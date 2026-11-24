'use client'
import { useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CircleCheck, CircleX, Headphones, PencilLine, Snail, Trophy, Volume2 } from 'lucide-react'
import { CATEGORIES, type LevelId } from '@/lib/de/content'
import { bumpStreak, review, studiedWords } from '@/lib/de/progress'
import { buildPool, diffSentence, fold, makeSession, todaysKind, type ClozeItem, type CtxItem, type CtxKind, type DikteItem, type DiffToken } from '@/lib/de/context'
import { useProgress } from '@/lib/de/useProgress'
import Speak, { speakDe } from '@/components/de/Speak'
import { BottomSheet, Confetti, IconBadge, haptic } from '@/components/de/WordFaces'

const MIN_WORDS = 5
const KINDS: { id: CtxKind; label: string; hint: string; Icon: typeof PencilLine }[] = [
  { id: 'cloze', label: 'Kalimat rumpang', hint: 'Lengkapi kata yang hilang di kalimat', Icon: PencilLine },
  { id: 'dikte', label: 'Dikte', hint: 'Dengar kalimat, lalu ketik', Icon: Headphones },
]

const studiedPool = () => buildPool((level, cat) => studiedWords(level, cat))
const totalWords = () => Object.values(CATEGORIES).reduce((n, cats) => n + cats.reduce((m, c) => m + c.words.length, 0), 0)

/* ── start screen + session ──────────────────────────── */

export default function ContextPractice() {
  const info = useProgress(() => ({ studied: studiedPool().length, total: totalWords(), today: todaysKind() }))
  const [picked, setPicked] = useState<CtxKind | null>(null)
  const [items, setItems] = useState<CtxItem[] | null>(null)
  const [run, setRun] = useState(0)

  if (!info) return <div className="skeleton h-72 rounded-card-lg" />
  const kind = picked ?? info.today

  if (items) return <Session key={run} items={items} onAgain={() => { setItems(makeSession(studiedPool(), kind)); setRun((r) => r + 1) }} onExit={() => setItems(null)} />

  const enough = info.studied >= MIN_WORDS
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-2">
        {KINDS.map((k) => {
          const active = kind === k.id
          return (
            <button
              key={k.id}
              onClick={() => setPicked(k.id)}
              className={`rounded-card-lg border p-3 text-left flex flex-col gap-2 transition ${active ? 'bg-ink text-white border-ink' : 'bg-surface border-ink-faint'}`}
            >
              <k.Icon size={18} />
              <span>
                <span className="block font-medium leading-tight">{k.label}</span>
                <span className={`block text-[12px] leading-snug ${active ? 'text-white/70' : 'text-ink-subtle'}`}>{k.hint}</span>
              </span>
              {info.today === k.id && <span className={`de-label ${active ? '!text-white/70' : ''}`}>Jadwal hari ini</span>}
            </button>
          )
        })}
      </div>

      <div className="bg-surface border border-ink-faint rounded-card-lg p-4 flex flex-col gap-2">
        <p className="text-sm text-ink-muted">
          Soal dibuat dari contoh kalimat kata yang <b className="text-ink font-medium">sudah kamu pelajari</b>: {info.studied} dari {info.total} kata.
        </p>
        {kind === 'cloze' ? (
          <p className="text-sm text-ink-muted">Kata yang salah ditulis akan masuk ulangan di <b className="text-ink font-medium">Hari ini</b>.</p>
        ) : (
          <p className="text-sm text-ink-muted">Dengarkan berulang kali kalau perlu. Huruf besar & tanda baca tidak dinilai.</p>
        )}
      </div>

      {enough ? (
        <button onClick={() => setItems(makeSession(studiedPool(), kind))} className="h-12 rounded-btn bg-ink text-white font-medium btn-press flex items-center justify-center gap-1.5">
          Mulai · 10 soal <ArrowRight size={17} />
        </button>
      ) : (
        <div className="bg-bg-soft rounded-card-lg p-4 text-sm text-ink-muted flex flex-col gap-3">
          Pelajari minimal {MIN_WORDS} kata dulu supaya soalnya memakai kata yang kamu kenal.
          <Link href="/de/hari-ini" className="h-11 rounded-btn bg-ink text-white font-medium btn-press flex items-center justify-center">Belajar di Hari ini</Link>
        </div>
      )}
    </div>
  )
}

function Session({ items, onAgain, onExit }: { items: CtxItem[]; onAgain: () => void; onExit: () => void }) {
  const [pos, setPos] = useState(0)
  const [scores, setScores] = useState<number[]>([])
  const [fb, setFb] = useState<{ score: number; msg?: string; tokens?: DiffToken[] } | null>(null)
  const cur = items[pos]

  if (!cur) {
    const avg = scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) : 0
    return (
      <div className="paper-card border-2 border-ink-faint rounded-card-lg p-6 text-center flex flex-col gap-3 items-center bounce-in">
        {avg >= 80 && <Confetti />}
        <IconBadge><Trophy size={26} /></IconBadge>
        <p className="text-2xl font-semibold">{avg}%</p>
        <p className="text-sm text-ink-muted">{items[0]?.kind === 'cloze' ? 'jawaban tepat' : 'kata tertulis benar'} dari {items.length} kalimat</p>
        <div className="grid grid-cols-2 gap-2 w-full">
          <button onClick={onExit} className="h-12 rounded-btn bg-surface border border-ink-faint font-medium btn-press">Selesai</button>
          <button onClick={onAgain} className="h-12 rounded-btn bg-ink text-white font-medium btn-press">Latihan lagi</button>
        </div>
      </div>
    )
  }

  function done(score: number, extra: { msg?: string; tokens?: DiffToken[] }) {
    setFb({ score, ...extra })
    setScores((s) => [...s, score])
    haptic(score >= 1 ? 15 : score >= 0.7 ? 10 : [30, 40, 30])
    speakDe(cur.w.example)
  }

  function next() {
    if (pos + 1 >= items.length) bumpStreak()
    setFb(null)
    setPos((p) => p + 1)
  }

  const ok = (fb?.score ?? 0) >= 1
  const close = !ok && (fb?.score ?? 0) >= 0.7

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1 rounded-pill bg-bg-soft overflow-hidden">
          <div className="h-full bg-ink rounded-pill transition-all" style={{ width: `${(pos / items.length) * 100}%` }} />
        </div>
        <span className="text-sm text-ink-muted">{pos + 1}/{items.length}</span>
      </div>

      <div key={pos} className="slide-up">
        {cur.kind === 'cloze' ? <Cloze item={cur} locked={!!fb} onDone={done} /> : <Dikte item={cur} locked={!!fb} onDone={done} />}
      </div>

      {fb && (
        <BottomSheet ok={ok || close}>
          <p className={`text-lg font-semibold flex items-center gap-2 ${ok || close ? 'text-[#15803D]' : 'text-[#B91C1C]'}`}>
            {ok || close ? <CircleCheck size={22} /> : <CircleX size={22} />}
            {ok ? 'Benar' : close ? 'Hampir benar' : 'Belum tepat'}
            {cur.kind === 'dikte' && <span className="text-sm font-normal text-ink-muted ml-auto">{Math.round(fb.score * 100)}%</span>}
          </p>
          {fb.msg && <p className="text-sm text-ink">{fb.msg}</p>}
          {fb.tokens && (
            <p className="text-[15px] leading-relaxed flex flex-wrap gap-x-1.5">
              {fb.tokens.map((t, i) =>
                t.status === 'ok' ? (
                  <span key={i}>{t.text}</span>
                ) : t.status === 'wrong' ? (
                  <span key={i}>
                    <s className="text-[#B91C1C]">{t.typed}</s> <b className="text-[#15803D] font-semibold">{t.text}</b>
                  </span>
                ) : (
                  <b key={i} className="text-[#B91C1C] font-semibold underline decoration-dotted">{t.text}</b>
                ),
              )}
            </p>
          )}
          <div className="flex items-center gap-2 rounded-card bg-surface/70 px-3 py-2">
            <div className="flex-1">
              <p className="font-medium">{cur.w.example}</p>
              <p className="text-sm text-ink-muted">{cur.w.exampleId}</p>
            </div>
            <Speak text={cur.w.example} size="sm" withSlow />
          </div>
          <button onClick={next} className="h-12 rounded-btn bg-mint text-white font-medium btn-press flex items-center justify-center gap-1.5">
            Lanjut <ArrowRight size={17} />
          </button>
        </BottomSheet>
      )}
    </div>
  )
}

/* ── exercise views ──────────────────────────────────── */

function TypeBox({ value, onChange, onSubmit, locked, multiline, placeholder }: { value: string; onChange: (v: string) => void; onSubmit: () => void; locked: boolean; multiline?: boolean; placeholder: string }) {
  const ref = useRef<HTMLInputElement & HTMLTextAreaElement>(null)
  const cls = 'w-full px-4 py-3 rounded-btn border border-ink-faint text-lg font-medium bg-surface outline-none focus:border-ink'
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (value.trim() && !locked) onSubmit()
      }}
      className="flex flex-col gap-2"
    >
      {multiline ? (
        <textarea ref={ref} value={value} onChange={(e) => onChange(e.target.value)} disabled={locked} rows={3} autoCapitalize="sentences" autoCorrect="off" spellCheck={false} placeholder={placeholder} className={`${cls} resize-none`} />
      ) : (
        <input ref={ref} value={value} onChange={(e) => onChange(e.target.value)} disabled={locked} autoCapitalize="none" autoCorrect="off" spellCheck={false} placeholder={placeholder} className={`${cls} h-12`} />
      )}
      <div className="flex gap-2">
        {['ä', 'ö', 'ü', 'ß'].map((ch) => (
          <button
            type="button"
            key={ch}
            disabled={locked}
            onClick={() => {
              onChange(value + ch)
              ref.current?.focus()
            }}
            className="flex-1 h-10 rounded-btn bg-bg-soft font-medium text-lg btn-press"
          >
            {ch}
          </button>
        ))}
        {!locked && (
          <button type="submit" disabled={!value.trim()} className="flex-[2] h-10 rounded-btn bg-ink text-white font-medium btn-press disabled:opacity-40">
            Periksa
          </button>
        )}
      </div>
    </form>
  )
}

function Cloze({ item, locked, onDone }: { item: ClozeItem; locked: boolean; onDone: (score: number, extra: { msg?: string }) => void }) {
  const [value, setValue] = useState('')
  function check() {
    const typed = value.trim()
    const exact = typed === item.answer
    const folded = fold(typed) === fold(item.answer)
    if (!folded) review(item.level as LevelId, item.cat, item.w.de, 'lupa') // wrong → back into "Hari ini"
    onDone(exact ? 1 : folded ? 0.8 : 0, { msg: exact ? undefined : `Jawaban: ${item.answer}${folded ? ' (perhatikan ejaan / huruf besar)' : ''}` })
  }
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-ink-muted flex items-center gap-1.5"><PencilLine size={16} />Lengkapi kalimatnya</p>
      <div className="paper-card border-2 border-ink-faint rounded-card-lg p-5 flex flex-col gap-3">
        <p className="text-2xl font-semibold tracking-tight leading-snug">
          {item.before}
          <span className="inline-block min-w-[4.5rem] border-b-[3px] border-ink-subtle mx-0.5 text-center">{locked ? item.answer : ' '}</span>
          {item.after}
        </p>
        <p className="text-sm text-ink-muted">
          Kata yang hilang: <b className="text-ink font-medium">{item.w.id}</b>
          {item.w.gender && ' (kata benda)'}
        </p>
      </div>
      <TypeBox value={value} onChange={setValue} onSubmit={check} locked={locked} placeholder="ketik kata yang hilang…" />
    </div>
  )
}

function Dikte({ item, locked, onDone }: { item: DikteItem; locked: boolean; onDone: (score: number, extra: { tokens: DiffToken[] }) => void }) {
  const [value, setValue] = useState('')
  const [plays, setPlays] = useState(0)
  function play(slow: boolean) {
    speakDe(item.sentence, slow ? 0.55 : 0.9)
    setPlays((p) => p + 1)
  }
  function check() {
    const { tokens, score } = diffSentence(item.sentence, value)
    onDone(score, { tokens })
  }
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-ink-muted flex items-center gap-1.5"><Headphones size={16} />Dengar, lalu tulis kalimatnya</p>
      <div className="paper-card border-2 border-ink-faint rounded-card-lg p-6 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => play(false)} disabled={locked} aria-label="Putar" className="w-16 h-16 rounded-pill bg-ink text-white flex items-center justify-center btn-press">
            <Volume2 size={26} />
          </button>
          <button onClick={() => play(true)} disabled={locked} aria-label="Putar pelan" className="w-12 h-12 rounded-pill bg-bg-soft flex items-center justify-center btn-press">
            <Snail size={20} />
          </button>
        </div>
        <p className="text-xs text-ink-subtle">{plays ? `Diputar ${plays}×` : 'Ketuk untuk mendengar'} · artinya: {item.w.exampleId}</p>
      </div>
      <TypeBox value={value} onChange={setValue} onSubmit={check} locked={locked} multiline placeholder="tulis yang kamu dengar…" />
    </div>
  )
}
