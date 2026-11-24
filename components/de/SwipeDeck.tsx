'use client'
import { useRef, useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { CalendarCheck, Check, Eye, Keyboard, PartyPopper, RotateCcw, Waves, X } from 'lucide-react'
import type { Category, Word } from '@/lib/de/content'
import { bumpStreak, getResting, nextDueLabel, review, type Grade } from '@/lib/de/progress'
import { gradeTyped, type TypedResult } from '@/lib/de/answer'
import { useProgress } from '@/lib/de/useProgress'
import { speakDe } from '@/components/de/Speak'
import { Details, Front, FrontReverse, IconBadge, haptic, spoken } from '@/components/de/WordFaces'

const THRESHOLD = 90

/* ── card mode (remembered per device) ─────────────── */

type Mode = 'lihat' | 'ingat' | 'ketik'
const MODES: { id: Mode; label: string; hint: string; Icon: typeof Eye }[] = [
  { id: 'lihat', label: 'Lihat', hint: 'Jerman → Indonesia', Icon: Eye },
  { id: 'ingat', label: 'Ingat', hint: 'Indonesia → Jerman', Icon: Waves },
  { id: 'ketik', label: 'Ketik', hint: 'Indonesia → Jerman, diketik', Icon: Keyboard },
]
const MODE_KEY = 'de:card-mode'
const modeListeners = new Set<() => void>()
function readMode(): Mode {
  try {
    const m = localStorage.getItem(MODE_KEY)
    return m === 'ingat' || m === 'ketik' ? m : 'lihat'
  } catch {
    return 'lihat'
  }
}
function setMode(m: Mode) {
  try {
    localStorage.setItem(MODE_KEY, m)
  } catch {
    /* ignore */
  }
  modeListeners.forEach((f) => f())
}
function useMode(): Mode {
  return useSyncExternalStore(
    (cb) => {
      modeListeners.add(cb)
      return () => modeListeners.delete(cb)
    },
    readMode,
    () => 'lihat',
  )
}

/**
 * Quizlet/Anki-style swipe deck with a 3D flip and three grades:
 * Lupa (swipe left, FSRS Again — back this round + tomorrow),
 * Sulit (middle button, FSRS Hard — remembered with effort, shorter interval),
 * Hafal (swipe right, FSRS Good — rests until due).
 */
export default function SwipeDeck({ level, cat, onRestart }: { level: string; cat: Category; onRestart: () => void }) {
  const mode = useMode()
  // read once per mount; the deck itself is not affected by later writes
  const snapshot = useProgress(() => ({ resting: [...getResting(level, cat.slug)], next: nextDueLabel(level, cat.slug) }))
  // Pick the deck once (when storage is readable) so swiping doesn't reshuffle it
  const [deck, setDeck] = useState<{ words: Word[]; next: string | null; cram: boolean } | null>(null)
  if (snapshot && !deck) {
    const resting = new Set(snapshot.resting)
    setDeck({ words: cat.words.filter((w) => !resting.has(w.de)), next: snapshot.next, cram: false })
  }

  if (!deck) return <div className="skeleton h-80 rounded-card-lg" />

  if (!deck.words.length) {
    return (
      <div className="paper-card border-2 border-ink-faint rounded-card-lg p-6 text-center flex flex-col gap-3 items-center">
        <IconBadge><CalendarCheck size={30} /></IconBadge>
        <p className="font-display font-extrabold text-xl">Semua kartu sedang istirahat</p>
        <p className="text-ink-muted text-sm">
          Kartu yang kamu tandai <b>Hafal</b> akan muncul lagi saat waktunya diulang ({deck.next ?? '-'}). Mengulang terlalu cepat kurang efektif.
        </p>
        <Link href="/de/hari-ini" className="w-full h-12 rounded-btn bg-ink text-white font-medium btn-press flex items-center justify-center">Lihat tugas Hari ini</Link>
        <button onClick={() => setDeck({ ...deck, words: cat.words, cram: true })} className="text-sm font-medium text-ink-muted underline">
          Tetap latihan semua kartu
        </button>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1 p-1 rounded-btn bg-bg-soft" role="radiogroup" aria-label="Arah kartu">
        {MODES.map((m) => (
          <button
            key={m.id}
            role="radio"
            aria-checked={mode === m.id}
            onClick={() => setMode(m.id)}
            title={m.hint}
            className={`flex-1 h-8 rounded-[8px] text-[13px] font-medium flex items-center justify-center gap-1.5 transition ${
              mode === m.id ? 'bg-surface text-ink shadow-sm' : 'text-ink-muted'
            }`}
          >
            <m.Icon size={14} />
            {m.label}
          </button>
        ))}
      </div>
      <Deck key={`${deck.cram ? 'cram' : 'due'}-${mode}`} level={level} cat={cat} words={deck.words} mode={mode} onRestart={onRestart} />
    </div>
  )
}

const GRADE_UI: Record<Grade, { label: string; cls: string }> = {
  lupa: { label: 'Lupa', cls: 'bg-surface border border-ink-faint text-ink' },
  sulit: { label: 'Sulit', cls: 'bg-surface border border-ink-faint text-ink' },
  hafal: { label: 'Hafal', cls: 'bg-ink text-white' },
}

function Deck({ level, cat, words, mode, onRestart }: { level: string; cat: Category; words: Word[]; mode: Mode; onRestart: () => void }) {
  const [order, setOrder] = useState<Word[]>(words)
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [dx, setDx] = useState(0)
  const [dy, setDy] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [flying, setFlying] = useState(false)
  const [counts, setCounts] = useState<Record<Grade, number>>({ lupa: 0, sulit: 0, hafal: 0 })
  const [typed, setTyped] = useState('')
  const [result, setResult] = useState<TypedResult | null>(null)
  const start = useRef<{ x: number; y: number } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const w = order[idx]
  const done = idx >= order.length
  const reverse = mode !== 'lihat'

  function rate(grade: Grade) {
    if (flying || !w) return
    setFlying(true)
    haptic(grade === 'lupa' ? [25, 30, 25] : 15)
    if (grade === 'sulit') {
      setDx(0)
      setDy(-window.innerHeight * 0.9) // "Sulit" flies up
    } else {
      setDx((grade === 'hafal' ? 1 : -1) * (window.innerWidth * 1.1))
      setDy(40)
    }
    window.setTimeout(() => {
      if (idx + 1 >= order.length && grade !== 'lupa') bumpStreak()
      // forgotten earlier this round → keep the "tomorrow" schedule from that Lupa
      const failedBefore = order.slice(0, idx).some((x) => x.de === w.de)
      if (!(grade !== 'lupa' && failedBefore)) review(level, cat.slug, w.de, grade)
      setCounts((c) => ({ ...c, [grade]: c[grade] + 1 }))
      if (grade === 'lupa') setOrder((o) => [...o, w]) // still learning → comes back this round
      setIdx((i) => i + 1)
      setFlipped(false)
      setTyped('')
      setResult(null)
      setDx(0)
      setDy(0)
      setFlying(false)
    }, 260)
  }

  function flip() {
    setFlipped((f) => {
      if (!f && reverse && w) speakDe(spoken(w)) // reveal → hear the German word
      return !f
    })
  }

  function check() {
    if (!w || result) return
    const r = gradeTyped(typed, w)
    setResult(r)
    haptic(r.grade === 'hafal' ? 15 : r.grade === 'sulit' ? 10 : [25, 30, 25])
    setFlipped(true)
    speakDe(spoken(w))
  }

  function onPointerDown(e: React.PointerEvent) {
    if (flying) return
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    start.current = { x: e.clientX, y: e.clientY }
    setDragging(true)
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging || !start.current) return
    setDx(e.clientX - start.current.x)
    setDy(e.clientY - start.current.y)
  }
  function onPointerUp() {
    if (!dragging) return
    setDragging(false)
    start.current = null
    if (Math.abs(dx) < 6 && Math.abs(dy) < 6) {
      flip()
      setDx(0)
      setDy(0)
    } else if (dx > THRESHOLD) rate('hafal')
    else if (dx < -THRESHOLD) rate('lupa')
    else {
      setDx(0)
      setDy(0)
    }
  }

  if (done) {
    return (
      <div className="paper-card border-2 border-ink-faint rounded-card-lg p-6 text-center flex flex-col gap-3 items-center bounce-in">
        <IconBadge><PartyPopper size={26} /></IconBadge>
        <p className="font-display font-extrabold text-xl">Ronde selesai!</p>
        <div className="grid grid-cols-3 w-full divide-x divide-ink-faint border-y border-ink-faint py-2">
          {(['hafal', 'sulit', 'lupa'] as Grade[]).map((g) => (
            <div key={g}>
              <p className="text-xl font-semibold">{counts[g]}</p>
              <p className="de-label">{GRADE_UI[g].label}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-ink-subtle">
          <b>Hafal</b> istirahat beberapa hari · <b>Sulit</b> diulang lebih cepat · <b>Lupa</b> muncul lagi besok di Hari ini.
        </p>
        <button onClick={onRestart} className="h-12 px-5 rounded-btn bg-ink text-white font-medium btn-press flex items-center justify-center gap-1.5">Ulangi ronde</button>
      </div>
    )
  }

  const p = Math.min(Math.abs(dx) / THRESHOLD, 1) // drag progress → lifts the stack
  const okOpacity = Math.max(0, Math.min(dx / THRESHOLD, 1))
  const noOpacity = Math.max(0, Math.min(-dx / THRESHOLD, 1))
  const behind = order.slice(idx + 1, idx + 3)
  const typing = mode === 'ketik' && !result
  // plain function (not a nested component) so the card is not remounted on every drag frame
  const frontFace = (word: Word, hint = true) =>
    reverse ? <FrontReverse w={word} hint={!hint ? '' : mode === 'ketik' ? 'Ketik jawabanmu di bawah' : 'Ketuk untuk melihat jawaban'} /> : <Front w={word} hint={hint} />

  return (
    <div className="flex flex-col gap-4 select-none">
      <div className="flex items-center justify-between text-sm font-medium text-ink-muted">
        <span>{idx + 1} / {order.length}</span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-ink"><Check size={15} />{counts.hafal + counts.sulit}</span>
          <span className="flex items-center gap-1 text-[#B91C1C]"><RotateCcw size={14} />{counts.lupa}</span>
        </span>
      </div>
      <div className="h-1 rounded-pill bg-bg-soft overflow-hidden">
        <div className="h-full bg-mint transition-all duration-300" style={{ width: `${(idx / order.length) * 100}%` }} />
      </div>

      <div className={`relative ${typing ? 'h-[clamp(12rem,calc(100dvh-33rem),20rem)]' : 'h-[clamp(15rem,calc(100dvh-28rem),27rem)]'}`}>
        {/* Stack behind */}
        {behind
          .map((bw, k) => {
            const depth = k + 1 - p
            return (
              <div
                key={`${bw.de}-${idx + k + 1}`}
                className="absolute inset-0 paper-card border-2 border-ink-faint rounded-card-lg"
                style={{
                  transform: `translateY(${depth * 14}px) scale(${1 - depth * 0.05})`,
                  transition: dragging ? 'none' : 'transform 0.3s ease-out',
                  zIndex: 10 - k,
                  opacity: 1 - depth * 0.25,
                }}
              >
                {frontFace(bw, false)}
              </div>
            )
          })
          .reverse()}

        {/* Top card */}
        <div
          key={`${w.de}-${idx}`}
          className="absolute inset-0 z-20 touch-none cursor-grab active:cursor-grabbing card-enter"
          style={{
            transform: `translate(${dx}px, ${dy * (flying ? 1 : 0.35)}px) rotate(${dx / 16}deg)`,
            transition: dragging ? 'none' : 'transform 0.28s cubic-bezier(0.2, 0.8, 0.3, 1.1)',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="flip-scene h-full">
            <div className={`flip-inner ${flipped ? 'is-flipped' : ''}`}>
              <div className="flip-face paper-card border-2 border-ink-faint rounded-card-lg">
                {frontFace(w)}
              </div>
              <div className="flip-face flip-back paper-card border-2 border-ink-faint rounded-card-lg p-5">
                <Details w={w} />
              </div>
            </div>
          </div>
          {/* Swipe stamps */}
          <span
            className="absolute top-6 left-5 px-3 py-1 rounded-md border-2 font-semibold text-base tracking-[0.12em] -rotate-12 pointer-events-none"
            style={{ opacity: okOpacity, color: '#15803D', borderColor: '#15803D', background: 'rgba(255,255,255,0.9)' }}
          >
            HAFAL
          </span>
          <span
            className="absolute top-6 right-5 px-3 py-1 rounded-md border-2 font-semibold text-base tracking-[0.12em] rotate-12 pointer-events-none"
            style={{ opacity: noOpacity, color: '#B91C1C', borderColor: '#B91C1C', background: 'rgba(255,255,255,0.9)' }}
          >
            LUPA
          </span>
        </div>
      </div>

      {typing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            check()
          }}
          className="flex flex-col gap-2"
        >
          <input
            ref={inputRef}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder={w.gender ? 'contoh: der Tisch' : 'ketik kata Jermannya…'}
            className="w-full px-4 h-12 rounded-btn border border-ink-faint text-lg font-medium bg-surface outline-none focus:border-ink"
          />
          <div className="flex gap-2">
            {['ä', 'ö', 'ü', 'ß'].map((ch) => (
              <button
                type="button"
                key={ch}
                onClick={() => {
                  setTyped((v) => v + ch)
                  inputRef.current?.focus()
                }}
                className="flex-1 h-10 rounded-btn bg-bg-soft font-medium text-lg btn-press"
              >
                {ch}
              </button>
            ))}
            <button type="submit" className="flex-[2] h-10 rounded-btn bg-ink text-white font-medium btn-press">
              Periksa
            </button>
          </div>
        </form>
      ) : (
        <>
          {result && (
            <p
              className={`text-sm rounded-btn px-3 py-2 ${
                result.grade === 'hafal' ? 'bg-[#F0FDF4] text-[#15803D]' : result.grade === 'sulit' ? 'bg-bg-soft text-ink' : 'bg-[#FEF2F2] text-[#B91C1C]'
              }`}
            >
              {result.msg} · saran: <b>{GRADE_UI[result.grade].label}</b>
            </p>
          )}
          <div className="grid grid-cols-3 gap-2 items-center">
            {(['lupa', 'sulit', 'hafal'] as Grade[]).map((g) => (
              <button
                key={g}
                onClick={() => rate(g)}
                className={`h-12 rounded-btn font-medium btn-press flex items-center justify-center gap-1.5 transition ${GRADE_UI[g].cls} ${
                  result?.grade === g ? 'ring-2 ring-offset-2 ring-ink' : ''
                }`}
              >
                {g === 'lupa' && <X size={17} />}
                {g === 'hafal' && <Check size={17} />}
                {GRADE_UI[g].label}
              </button>
            ))}
          </div>
          <p className="text-xs text-center text-ink-subtle">Geser kanan = Hafal · geser kiri = Lupa · ketuk kartu = balik</p>
        </>
      )}
    </div>
  )
}
