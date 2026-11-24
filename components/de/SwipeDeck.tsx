'use client'
import { useRef, useState } from 'react'
import Link from 'next/link'
import { CalendarCheck, Check, PartyPopper, RotateCcw, X } from 'lucide-react'
import type { Category, Word } from '@/lib/de/content'
import { bumpStreak, getResting, nextDueLabel, review } from '@/lib/de/progress'
import { useProgress } from '@/lib/de/useProgress'
import { Details, Front, IconBadge, haptic } from '@/components/de/WordFaces'

const THRESHOLD = 90

/**
 * Quizlet-style swipe deck with a 3D flip.
 * Right = Hafal (FSRS Good → card rests until due), Left = Belum (FSRS Again,
 * card comes back this round and again tomorrow).
 */
export default function SwipeDeck({ level, cat, onRestart }: { level: string; cat: Category; onRestart: () => void }) {
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
        <Link href="/de/hari-ini" className="w-full h-12 rounded-btn bg-ink text-white font-medium btn-press">Lihat tugas Hari ini</Link>
        <button onClick={() => setDeck({ ...deck, words: cat.words, cram: true })} className="text-sm font-extrabold text-ink-muted underline">
          Tetap latihan semua kartu
        </button>
      </div>
    )
  }
  return <Deck key={deck.cram ? 'cram' : 'due'} level={level} cat={cat} words={deck.words} onRestart={onRestart} />
}

function Deck({ level, cat, words, onRestart }: { level: string; cat: Category; words: Word[]; onRestart: () => void }) {
  const [order, setOrder] = useState<Word[]>(words)
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [dx, setDx] = useState(0)
  const [dy, setDy] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [flying, setFlying] = useState(false)
  const [knownNow, setKnownNow] = useState<Set<string>>(new Set())
  const [againCount, setAgainCount] = useState(0)
  const start = useRef<{ x: number; y: number } | null>(null)

  const w = order[idx]
  const done = idx >= order.length

  function fly(dir: 'left' | 'right') {
    if (flying || !w) return
    setFlying(true)
    haptic(dir === 'right' ? 15 : [25, 30, 25])
    setDx((dir === 'right' ? 1 : -1) * (window.innerWidth * 1.1))
    setDy(40)
    window.setTimeout(() => {
      const good = dir === 'right'
      if (idx + 1 >= order.length && good) bumpStreak()
      // forgotten earlier this round → keep the "tomorrow" schedule from that Again
      const failedBefore = order.slice(0, idx).some((x) => x.de === w.de)
      if (!(good && failedBefore)) review(level, cat.slug, w.de, good)
      if (good) setKnownNow((s) => new Set(s).add(w.de))
      else {
        setAgainCount((n) => n + 1)
        setOrder((o) => [...o, w]) // still learning → comes back this round
      }
      setIdx((i) => i + 1)
      setFlipped(false)
      setDx(0)
      setDy(0)
      setFlying(false)
    }, 260)
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
      setFlipped((f) => !f)
      setDx(0)
      setDy(0)
    } else if (dx > THRESHOLD) fly('right')
    else if (dx < -THRESHOLD) fly('left')
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
        <p className="text-ink-muted">
          {knownNow.size} kata hafal{againCount > 0 && ` · ${againCount}× diulang`}
        </p>
        <p className="text-xs text-ink-subtle">
          Kartu <b>Hafal</b> istirahat dulu dan muncul lagi beberapa hari lagi. Kartu <b>Belum</b> muncul lagi besok di Hari ini.
        </p>
        <button onClick={onRestart} className="h-12 px-5 rounded-btn bg-ink text-white font-medium btn-press flex items-center justify-center gap-1.5">Ulangi ronde</button>
      </div>
    )
  }

  const p = Math.min(Math.abs(dx) / THRESHOLD, 1) // drag progress → lifts the stack
  const okOpacity = Math.max(0, Math.min(dx / THRESHOLD, 1))
  const noOpacity = Math.max(0, Math.min(-dx / THRESHOLD, 1))
  const behind = order.slice(idx + 1, idx + 3)

  return (
    <div className="flex flex-col gap-4 select-none">
      <div className="flex items-center justify-between text-sm font-bold text-ink-muted">
        <span>{idx + 1} / {order.length}</span>
        <span className="flex items-center gap-3"><span className="flex items-center gap-1 text-mint-deep"><Check size={15} strokeWidth={3} />{knownNow.size}</span><span className="flex items-center gap-1 text-coral-deep"><RotateCcw size={14} strokeWidth={2.6} />{againCount}</span></span>
      </div>
      <div className="h-1 rounded-pill bg-bg-soft overflow-hidden">
        <div className="h-full bg-mint transition-all duration-300" style={{ width: `${(idx / order.length) * 100}%` }} />
      </div>

      <div className="relative h-[clamp(15rem,calc(100dvh-26rem),27rem)]">
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
                <Front w={bw} hint={false} />
              </div>
            )
          })
          .reverse()}

        {/* Top card */}
        <div
          key={`${w.de}-${idx}`}
          className="absolute inset-0 z-20 touch-none cursor-grab active:cursor-grabbing card-enter"
          style={{
            transform: `translate(${dx}px, ${dy * 0.35}px) rotate(${dx / 16}deg)`,
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
                <Front w={w} />
              </div>
              <div className="flip-face flip-back paper-card border-2 border-ink-faint rounded-card-lg p-5">
                <Details w={w} />
              </div>
            </div>
          </div>
          {/* Swipe stamps */}
          <span
            className="absolute top-6 left-5 px-3 py-1 rounded-md border-2 font-semibold text-base tracking-[0.12em] bg-surface/80 -rotate-12 pointer-events-none"
            style={{ opacity: okOpacity, color: '#15803D', borderColor: '#15803D', background: 'rgba(255,255,255,0.9)' }}
          >
            HAFAL
          </span>
          <span
            className="absolute top-6 right-5 px-3 py-1 rounded-md border-2 font-semibold text-base tracking-[0.12em] bg-surface/80 rotate-12 pointer-events-none"
            style={{ opacity: noOpacity, color: '#B91C1C', borderColor: '#B91C1C', background: 'rgba(255,255,255,0.9)' }}
          >
            BELUM
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 items-center">
        <button onClick={() => fly('left')} className="h-12 rounded-btn bg-surface border border-ink-faint text-ink font-medium btn-press flex items-center justify-center gap-1.5"><X size={17} />Belum</button>
        <button onClick={() => setFlipped((f) => !f)} className="h-12 rounded-btn text-ink-muted font-medium btn-press flex items-center justify-center gap-1.5"><RotateCcw size={16} />Balik</button>
        <button onClick={() => fly('right')} className="h-12 rounded-btn bg-ink text-white font-medium btn-press flex items-center justify-center gap-1.5"><Check size={17} />Hafal</button>
      </div>
      <p className="text-xs text-center text-ink-subtle">Geser kanan = Hafal · geser kiri = Belum · ketuk = balik</p>
    </div>
  )
}
