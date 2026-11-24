'use client'
import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  ArrowRightLeft,
  CircleCheck,
  CircleHelp,
  CircleX,
  Delete,
  ListChecks,
  PencilLine,
  RotateCcw,
  Shuffle,
  Trophy,
  type LucideIcon,
} from 'lucide-react'
import { GENDER_STYLE, type Gender } from '@/lib/de/content'
import { EX_TYPE_LABEL, type Exercise, type ExType, type TopicPractice as Practice } from '@/lib/de/exercises'
import Speak, { speakDe } from '@/components/de/Speak'
import { cap, matchSpeakable, orderText, solution } from '@/lib/de/speech-texts'
import { MASTERY_PCT, bumpStreak, recordPracticeScore, reviewGrammar } from '@/lib/de/progress'
import { BottomSheet, Confetti, IconBadge, haptic } from '@/components/de/WordFaces'

const TYPE_ICON: Record<ExType, LucideIcon> = {
  mcq: ListChecks,
  gap: PencilLine,
  order: Shuffle,
  tf: CircleHelp,
  match: ArrowRightLeft,
}

type Feedback = { ok: boolean; msg: string } | null

/* ── helpers ─────────────────────────────────────────── */

/** Deterministic shuffle so server and client render the same order. */
function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr]
  let s = seed * 9301 + 49297
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const norm = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/[.?!,]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')

const bestKey = (level: string, topic: string, section: string) => `de:latihan:${level}:${topic}:${section}`

/* ── session ─────────────────────────────────────────── */

export default function TopicPractice({
  level,
  topic,
  practice,
  section,
  backHref,
}: {
  level: string
  topic: string
  practice: Practice
  section: string | null
  backHref: string
}) {
  const [run, setRun] = useState(1)
  return (
    <Session
      key={run}
      seed={run}
      level={level}
      topic={topic}
      practice={practice}
      section={section}
      backHref={backHref}
      onRestart={() => setRun((r) => r + 1)}
    />
  )
}

function Session({
  seed,
  level,
  topic,
  practice,
  section,
  backHref,
  onRestart,
}: {
  seed: number
  level: string
  topic: string
  practice: Practice
  section: string | null
  backHref: string
  onRestart: () => void
}) {
  const pool = useMemo(() => {
    const items = practice.items.map((ex, idx) => ({ ex, idx })).filter((x) => !section || x.ex.section === section)
    return shuffle(items, seed)
  }, [practice.items, section, seed])

  const [queue, setQueue] = useState(pool)
  const [pos, setPos] = useState(0)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [firstTry, setFirstTry] = useState<Record<number, boolean>>({})
  const [anim, setAnim] = useState('')
  const [best, setBest] = useState<number | null>(null)

  const cur = queue[pos]
  const done = !cur
  const firstCount = Object.keys(firstTry).length
  const score = Object.values(firstTry).filter(Boolean).length
  const pct = pool.length ? Math.round((score / pool.length) * 100) : 0

  function saveBest() {
    try {
      const key = bestKey(level, topic, section ?? 'semua')
      const prev = Number(localStorage.getItem(key) ?? '0')
      if (pct > prev) localStorage.setItem(key, String(pct))
      setBest(Math.max(prev, pct))
    } catch {
      /* storage blocked */
    }
    // Only the full practice ("Semua") can make a topic "Dikuasai"
    if (!section) recordPracticeScore(level, topic, pct)
    bumpStreak()
  }

  function answer(ok: boolean, msg = '') {
    if (feedback) return
    setFeedback({ ok, msg })
    setAnim(ok ? 'pop-good' : 'shake')
    haptic(ok ? 15 : [30, 40, 30])
    const sol = solution(cur.ex)
    if (sol) speakDe(sol)
    if (!(cur.idx in firstTry)) {
      setFirstTry((f) => ({ ...f, [cur.idx]: ok }))
      // schedule this exercise for spaced review ("Hari ini")
      reviewGrammar(level, topic, cur.idx, ok)
      // wrong on first try → ask again at the end of the session
      if (!ok) setQueue((q) => [...q, cur])
    }
  }

  function next() {
    if (pos + 1 >= queue.length) saveBest()
    setFeedback(null)
    setAnim('')
    setPos((p) => p + 1)
  }

  if (!pool.length) return <p className="text-center text-ink-muted py-10">Belum ada soal untuk bagian ini.</p>

  if (done) {
    const bySection = practice.sections
      .map((s) => {
        const ids = pool.filter((x) => x.ex.section === s.id).map((x) => x.idx)
        return { ...s, total: ids.length, ok: ids.filter((i) => firstTry[i]).length }
      })
      .filter((s) => s.total)
    return (
      <div className="paper-card border-2 border-ink-faint rounded-card-lg p-6 flex flex-col gap-4 items-center text-center bounce-in">
        {/* confetti only for the big moment: topic mastered */}
        {!section && pct >= MASTERY_PCT && <Confetti />}
        <IconBadge><Trophy size={30} /></IconBadge>
        <div>
          <p className="font-display font-extrabold text-3xl">{pct}%</p>
          <p className="text-ink-muted text-sm">{score} dari {pool.length} benar di percobaan pertama</p>
          {best !== null && <p className="text-xs font-bold text-ink-subtle mt-1">Skor terbaik: {best}%</p>}
        </div>
        {bySection.length > 1 && (
          <div className="w-full flex flex-col gap-2 text-left">
            {bySection.map((s) => (
              <div key={s.id}>
                <div className="flex justify-between text-sm font-extrabold">
                  <span>{s.label}</span>
                  <span className="text-ink-muted">{s.ok}/{s.total}</span>
                </div>
                <div className="h-1 rounded-pill bg-bg-soft overflow-hidden mt-1.5">
                  <div className="h-full bg-mint" style={{ width: `${(s.ok / s.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
        {!section && pct >= MASTERY_PCT ? (
          <p className="text-sm font-medium text-[#15803D] bg-[#F0FDF4] rounded-card px-3 py-2 flex items-center gap-1.5">
            <CircleCheck size={18} strokeWidth={2.6} />Materi dikuasai! Soal-soalnya akan diulang berkala di Hari ini.
          </p>
        ) : (
          <p className="text-sm text-ink-muted">
            {section
              ? `Untuk status Dikuasai, kerjakan latihan "Semua" dengan skor ≥ ${MASTERY_PCT}%.`
              : pct >= 60
                ? `Sedikit lagi! Butuh ≥ ${MASTERY_PCT}% untuk status Dikuasai. Soal yang salah akan muncul lagi di Hari ini.`
                : 'Baca lagi materinya, lalu coba ulang.'}
          </p>
        )}
        <div className="flex gap-2 w-full">
          <Link href={backHref} className="flex-1 h-12 rounded-btn bg-surface border border-ink-faint font-medium flex items-center justify-center gap-1.5">
            <ArrowLeft size={17} strokeWidth={2.6} />Materi
          </Link>
          <button onClick={onRestart} className="flex-1 h-12 rounded-btn bg-ink text-white font-medium btn-press flex items-center justify-center gap-1.5">
            <RotateCcw size={17} strokeWidth={2.6} />Ulangi
          </button>
        </div>
      </div>
    )
  }

  const TypeIcon = TYPE_ICON[cur.ex.type]
  const sectionLabel = practice.sections.find((s) => s.id === cur.ex.section)?.label
  const isRetry = pos >= pool.length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1 rounded-pill bg-bg-soft overflow-hidden">
          <div className="h-full bg-mint rounded-pill transition-all duration-500" style={{ width: `${(firstCount / pool.length) * 100}%` }} />
        </div>
      </div>

      <div key={`${pos}-${cur.idx}`} className="slide-up flex flex-col gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-extrabold text-ink-muted flex items-center gap-1.5">
            <TypeIcon size={16} strokeWidth={2.4} />
            {EX_TYPE_LABEL[cur.ex.type]}
          </span>
          {!section && sectionLabel && <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-pill bg-bg-soft text-ink-muted">{sectionLabel}</span>}
          {isRetry && <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-pill bg-coral-soft text-coral-deep">Ulangi</span>}
        </div>
        <div className={anim} onAnimationEnd={() => setAnim('')}>
          <ExerciseBody ex={cur.ex} seed={seed + pos} locked={!!feedback} onAnswer={answer} />
        </div>
      </div>

      {feedback && (
        <BottomSheet ok={feedback.ok}>
          <p className={`font-display font-extrabold text-lg flex items-center gap-2 ${feedback.ok ? 'text-mint-deep' : 'text-coral-deep'}`}>
            {feedback.ok ? <CircleCheck size={22} strokeWidth={2.6} /> : <CircleX size={22} strokeWidth={2.6} />}
            {feedback.ok ? 'Benar' : 'Belum tepat'}
          </p>
          {feedback.msg && <p className="text-sm font-bold text-ink">{feedback.msg}</p>}
          {solution(cur.ex) && (
            <div className="flex items-center gap-2 rounded-card bg-surface/70 px-3 py-2">
              <p className="flex-1 font-bold text-ink">{solution(cur.ex)}</p>
              <Speak text={solution(cur.ex)!} size="sm" withSlow />
            </div>
          )}
          <p className="text-sm text-ink">{cur.ex.explain}</p>
          <button onClick={next} className={`py-3 rounded-btn text-white font-extrabold btn-press ${feedback.ok ? 'bg-mint' : 'bg-coral'}`}>
            <span className="flex items-center justify-center gap-1.5">Lanjut <ArrowRight size={18} strokeWidth={2.6} /></span>
          </button>
        </BottomSheet>
      )}
    </div>
  )
}

/* ── exercise bodies ─────────────────────────────────── */

type BodyProps<T extends ExType> = {
  ex: Extract<Exercise, { type: T }>
  seed: number
  locked: boolean
  onAnswer: (ok: boolean, msg?: string) => void
}

export function ExerciseBody({ ex, ...rest }: { ex: Exercise } & Omit<BodyProps<ExType>, 'ex'>) {
  switch (ex.type) {
    case 'mcq':
      return <Mcq ex={ex} {...rest} />
    case 'gap':
      return <Gap ex={ex} {...rest} />
    case 'order':
      return <Order ex={ex} {...rest} />
    case 'tf':
      return <TrueFalse ex={ex} {...rest} />
    case 'match':
      return <Match ex={ex} {...rest} />
  }
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="paper-card border-2 border-ink-faint rounded-card-lg p-5 text-center flex flex-col gap-2">{children}</div>
}

/** Renders a sentence with the ___ blank highlighted (or filled once answered). */
function Blank({ sentence, fill, fillColor }: { sentence: string; fill?: string; fillColor?: string }) {
  const [a, b] = sentence.split('___')
  if (b === undefined) return <>{sentence}</>
  return (
    <>
      {a}
      {fill ? (
        <span className="pop-in inline-block" style={{ color: fillColor }}>{fill}</span>
      ) : (
        <span className="inline-block min-w-[3.5rem] border-b-[3px] border-ink-subtle mx-0.5">&nbsp;</span>
      )}
      {b}
    </>
  )
}

const KEEP_ORDER = [
  ['der', 'die', 'das'],
  ['er', 'sie', 'es'],
]

function Mcq({ ex, seed, locked, onAnswer }: BodyProps<'mcq'>) {
  const [pick, setPick] = useState<string | null>(null)
  const keep = KEEP_ORDER.some((k) => k.join() === ex.options.join())
  const opts = useMemo(() => (keep ? ex.options : shuffle(ex.options, seed)), [ex.options, keep, seed])
  const isGender = ex.options.join() === 'der,die,das'
  const long = opts.some((o) => o.length > 14)

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <p className="text-sm font-bold text-ink-muted">{ex.q}</p>
        {ex.sentence && (
          <p className="font-display font-extrabold text-2xl leading-snug">
            <Blank
              sentence={ex.sentence}
              fill={pick ? ex.answer : undefined}
              fillColor={isGender ? GENDER_STYLE[ex.answer as Gender].color : 'var(--color-mint-deep, #008F73)'}
            />
          </p>
        )}
      </Card>
      <div className={long ? 'flex flex-col gap-2' : `grid gap-2 ${opts.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {opts.map((o) => {
          const right = o === ex.answer
          const state = !pick ? '' : right ? 'ring-2 ring-[#15803D]' : o === pick ? 'ring-2 ring-[#B91C1C]' : 'opacity-40'
          if (isGender) {
            const c = GENDER_STYLE[o as Gender].color
            return (
              <button
                key={o}
                disabled={locked}
                onClick={() => {
                  setPick(o)
                  onAnswer(right, right ? '' : `Jawaban: ${ex.answer}`)
                }}
                className={`py-4 rounded-btn font-display font-extrabold text-xl text-white btn-press transition ${state}`}
                style={{ background: c }}
              >
                {o}
              </button>
            )
          }
          return (
            <button
              key={o}
              disabled={locked}
              onClick={() => {
                setPick(o)
                onAnswer(right, right ? '' : `Jawaban: ${ex.answer}`)
              }}
              className={`py-3.5 px-3 rounded-btn border-2 border-ink-faint bg-surface font-extrabold text-[15px] btn-press transition ${long ? 'text-left' : ''} ${state}`}
            >
              {o}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function UmlautKeys({ disabled, onKey }: { disabled: boolean; onKey: (ch: string) => void }) {
  return (
    <div className="flex gap-2">
      {['ä', 'ö', 'ü', 'ß'].map((ch) => (
        <button type="button" key={ch} disabled={disabled} onClick={() => onKey(ch)} className="flex-1 py-2 rounded-btn bg-bg-soft font-extrabold text-lg btn-press">
          {ch}
        </button>
      ))}
    </div>
  )
}

function Gap({ ex, locked, onAnswer }: BodyProps<'gap'>) {
  const [value, setValue] = useState('')
  const [result, setResult] = useState<boolean | null>(null)
  const ref = useRef<HTMLInputElement>(null)

  function check() {
    if (!value.trim() || locked) return
    const ok = ex.answer.some((a) => norm(a) === norm(value))
    setResult(ok)
    const exact = ex.answer.some((a) => a.toLowerCase() === value.trim().toLowerCase())
    onAnswer(ok, ok ? (exact ? '' : `Ejaan yang tepat: ${ex.answer[0]}`) : `Jawaban: ${ex.answer[0]}`)
  }

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <p className="font-display font-extrabold text-2xl leading-snug">
          <Blank sentence={ex.sentence} fill={result !== null ? ex.answer[0] : undefined} fillColor={result ? '#008F73' : '#E03B3B'} />
        </p>
        <p className="text-sm text-ink-muted">{ex.translation}</p>
        {ex.base && <span className="self-center text-xs font-extrabold px-2.5 py-1 rounded-pill bg-sky-soft text-sky-dark">({ex.base})</span>}
      </Card>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          check()
        }}
        className="flex flex-col gap-2"
      >
        <input
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={locked}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="ketik jawabanmu…"
          className={`w-full px-4 py-3.5 rounded-btn border text-lg font-medium bg-surface outline-none focus:border-ink ${
            result === null ? 'border-ink-faint' : result ? 'border-[#15803D]' : 'border-[#B91C1C]'
          }`}
        />
        <UmlautKeys
          disabled={locked}
          onKey={(ch) => {
            setValue((v) => v + ch)
            ref.current?.focus()
          }}
        />
        {!locked && (
          <button type="submit" disabled={!value.trim()} className="py-3.5 rounded-btn bg-ink text-white font-extrabold btn-press disabled:opacity-40">
            Periksa
          </button>
        )}
      </form>
    </div>
  )
}

function Order({ ex, seed, locked, onAnswer }: BodyProps<'order'>) {
  const bank = useMemo(() => {
    const items = ex.tokens.map((t, i) => ({ t, i }))
    let s = shuffle(items, seed)
    // never present the tokens already in the right order
    if (s.every((x, k) => x.i === k)) s = [...s.slice(1), s[0]]
    return s
  }, [ex.tokens, seed])
  const [chosen, setChosen] = useState<number[]>([])
  const [result, setResult] = useState<boolean | null>(null)

  const picked = chosen.map((i) => ex.tokens[i])
  const full = chosen.length === ex.tokens.length

  function check() {
    const typed = norm(picked.join(' '))
    const ok = [ex.tokens, ...(ex.alt ?? [])].some((t) => norm(t.join(' ')) === typed)
    setResult(ok)
    onAnswer(ok, ok ? '' : `Urutan yang benar: ${orderText(ex.tokens, ex.end)}`)
  }

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <p className="font-display font-extrabold text-xl leading-snug">{ex.translation}</p>
        {ex.start && <p className="text-xs font-bold text-ink-muted">Mulai dengan: <b>{cap(ex.start)}</b></p>}
      </Card>
      <div
        className={`min-h-[4.25rem] rounded-card-lg border-2 border-dashed p-2.5 flex flex-wrap gap-2 items-center ${
          result === null ? 'border-ink-faint' : result ? 'border-[#86EFAC] bg-[#F0FDF4]' : 'border-[#FECACA] bg-[#FEF2F2]'
        }`}
      >
        {chosen.length === 0 && <span className="text-sm text-ink-subtle px-1">Ketuk kata di bawah sesuai urutan</span>}
        {chosen.map((i, k) => (
          <button
            key={i}
            disabled={locked}
            onClick={() => setChosen((c) => c.filter((x) => x !== i))}
            className="pop-in px-3 py-2 rounded-btn bg-surface border-2 border-ink-faint font-extrabold btn-press"
          >
            {k === 0 ? cap(ex.tokens[i]) : ex.tokens[i]}
          </button>
        ))}
        {full && <span className="font-extrabold text-lg">{ex.end}</span>}
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {bank.map(({ t, i }) => {
          const used = chosen.includes(i)
          return (
            <button
              key={i}
              disabled={used || locked}
              onClick={() => setChosen((c) => [...c, i])}
              className={`px-3 py-2 rounded-btn border-2 font-extrabold btn-press transition ${
                used ? 'border-dashed border-ink-faint text-transparent bg-transparent' : 'border-ink-faint bg-surface'
              }`}
              
            >
              {t}
            </button>
          )
        })}
      </div>
      {!locked && (
        <div className="flex gap-2">
          <button
            onClick={() => setChosen((c) => c.slice(0, -1))}
            disabled={!chosen.length}
            aria-label="Hapus kata terakhir"
            className="px-4 rounded-btn bg-bg-soft font-extrabold btn-press disabled:opacity-40 flex items-center justify-center"
          >
            <Delete size={20} strokeWidth={2.4} />
          </button>
          <button onClick={check} disabled={!full} className="flex-1 py-3.5 rounded-btn bg-ink text-white font-extrabold btn-press disabled:opacity-40">
            Periksa
          </button>
        </div>
      )}
    </div>
  )
}

function TrueFalse({ ex, locked, onAnswer }: BodyProps<'tf'>) {
  const [pick, setPick] = useState<boolean | null>(null)
  const choose = (v: boolean) => {
    setPick(v)
    const ok = v === ex.answer
    onAnswer(ok, ok ? '' : `Jawaban: ${ex.answer ? 'Benar' : 'Salah'}`)
  }
  const style = (v: boolean) =>
    pick === null ? '' : v === ex.answer ? 'ring-2 ring-[#15803D]' : v === pick ? 'ring-2 ring-[#B91C1C]' : 'opacity-40'
  return (
    <div className="flex flex-col gap-3">
      <Card>
        <p className="font-bold text-[17px] leading-snug">{ex.statement}</p>
        {ex.sentence && (
          <p className="font-display font-extrabold text-2xl mt-1 px-3 py-2 rounded-card bg-bg-soft self-center">{ex.sentence}</p>
        )}
      </Card>
      <div className="grid grid-cols-2 gap-2">
        <button
          disabled={locked}
          onClick={() => choose(true)}
          className={`h-14 rounded-btn bg-surface border border-ink-faint text-ink font-medium text-base btn-press flex items-center justify-center gap-2 transition ${style(true)}`}
         
        >
          <CircleCheck size={20} strokeWidth={2.6} />Benar
        </button>
        <button
          disabled={locked}
          onClick={() => choose(false)}
          className={`h-14 rounded-btn bg-surface border border-ink-faint text-ink font-medium text-base btn-press flex items-center justify-center gap-2 transition ${style(false)}`}
         
        >
          <CircleX size={20} strokeWidth={2.6} />Salah
        </button>
      </div>
    </div>
  )
}

function Match({ ex, seed, locked, onAnswer }: BodyProps<'match'>) {
  const rights = useMemo(() => shuffle(ex.pairs.map(([, r], i) => ({ r, i })), seed), [ex.pairs, seed])
  const [selL, setSelL] = useState<number | null>(null)
  const [selR, setSelR] = useState<number | null>(null)
  const [doneL, setDoneL] = useState<number[]>([])
  const [doneR, setDoneR] = useState<number[]>([])
  const [wrong, setWrong] = useState<number | null>(null)
  const [mistakes, setMistakes] = useState(0)

  function attempt(l: number, rIdx: number) {
    const ok = ex.pairs[l][1] === rights[rIdx].r
    setSelL(null)
    setSelR(null)
    if (ok) {
      const nl = [...doneL, l]
      setDoneL(nl)
      setDoneR((d) => [...d, rIdx])
      haptic(10)
      if (matchSpeakable(ex.pairs[l][0])) speakDe(ex.pairs[l][0])
      if (nl.length === ex.pairs.length) {
        onAnswer(mistakes === 0, mistakes ? `${mistakes}× salah pasang. Coba lagi nanti supaya sempurna.` : '')
      }
    } else {
      setMistakes((m) => m + 1)
      setWrong(rIdx)
      haptic([30, 40, 30])
      setTimeout(() => setWrong(null), 450)
    }
  }

  const btn = (active: boolean, matched: boolean, bad: boolean) =>
    `w-full min-h-[3.25rem] px-3 py-2 rounded-btn border-2 font-extrabold text-[14px] leading-tight btn-press transition ${
      matched
        ? 'border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]'
        : bad
          ? 'border-coral bg-coral-soft shake'
          : active
            ? 'border-sky bg-sky-soft scale-[1.03]'
            : 'border-ink-faint bg-surface'
    }`

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <p className="font-bold">{ex.q}</p>
        <p className="text-xs text-ink-muted">Ketuk satu di kiri, lalu pasangannya di kanan</p>
      </Card>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-2">
          {ex.pairs.map(([l], i) => (
            <button
              key={i}
              disabled={locked || doneL.includes(i)}
              onClick={() => (selR !== null ? attempt(i, selR) : setSelL(i === selL ? null : i))}
              className={btn(selL === i, doneL.includes(i), false)}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {rights.map(({ r }, k) => (
            <button
              key={k}
              disabled={locked || doneR.includes(k)}
              onClick={() => (selL !== null ? attempt(selL, k) : setSelR(k === selR ? null : k))}
              className={btn(selR === k, doneR.includes(k), wrong === k)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
