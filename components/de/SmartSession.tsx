'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useProgress } from '@/lib/de/useProgress'
import { ArrowRight, Brain, CircleCheck, CircleX, Ear, Keyboard, Snail, Sprout, Target, TreeDeciduous, Trophy, Volume2, type LucideIcon } from 'lucide-react'
import { GENDER_STYLE, type Category, type Gender, type Word } from '@/lib/de/content'
import { bumpStreak, dailyNewTarget, getDue, hasSrs, newLeftToday, nextDueLabel, review } from '@/lib/de/progress'
import Speak, { speakDe } from '@/components/de/Speak'
import { BottomSheet, Details, IconBadge, WordTitle, haptic, spoken } from '@/components/de/WordFaces'

/**
 * "Sesi Pintar" — Memrise/Quizlet-Learn style ladder:
 * kenalan → pilih arti → der/die/das → dengar → ketik.
 * Wrong answers are re-inserted a few tasks later; finishing the ladder → FSRS review.
 */

type Step = 'intro' | 'meaning' | 'gender' | 'listen' | 'type'
interface Task { w: Word; step: Step; id: number }

const NEW_PER_SESSION = 5
const REINSERT_AT = 2

const STEP_LABEL: Record<Step, { text: string; Icon: LucideIcon }> = {
  intro: { text: 'Kata baru', Icon: Sprout },
  meaning: { text: 'Pilih arti', Icon: Brain },
  gender: { text: 'der, die, atau das?', Icon: Target },
  listen: { text: 'Dengar & pilih', Icon: Ear },
  type: { text: 'Tulis dalam bahasa Jerman', Icon: Keyboard },
}

const isGenderNoun = (w: Word) => !!w.gender && w.plural !== 'Pl.'

function ladder(w: Word, isNew: boolean): Step[] {
  if (!isNew) return ['meaning', 'type']
  return ['intro', 'meaning', ...(isGenderNoun(w) ? (['gender'] as Step[]) : []), 'listen', 'type']
}

function shuffle<T>(a: T[]): T[] {
  const b = [...a]
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[b[i], b[j]] = [b[j], b[i]]
  }
  return b
}

const norm = (s: string) =>
  s.toLowerCase().trim().replace(/\s+/g, ' ').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')

type Feedback = { ok: boolean; msg: string } | null

export default function SmartSession({ level, cat, onRestart }: { level: string; cat: Category; onRestart: () => void }) {
  const [queue, setQueue] = useState<Task[] | null>(null)
  const [plan, setPlan] = useState<Map<string, Step[]>>(new Map())
  const [doneCount, setDoneCount] = useState(0)
  const [mistakes, setMistakes] = useState<Record<string, number>>({})
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [correct, setCorrect] = useState(0)
  const [answered, setAnswered] = useState(0)
  const [learned, setLearned] = useState<string[]>([])
  const [anim, setAnim] = useState<'' | 'shake' | 'pop-good'>('')
  const [extra, setExtra] = useState(false) // learner chose to go past the daily new-word target
  const [capped, setCapped] = useState(false)
  const [nextId, setNextId] = useState(0)

  // Build the session once storage is readable (derive-during-render, no effect)
  const snap = useProgress(() => ({
    due: getDue(level, cat.slug),
    seen: cat.words.filter((w) => hasSrs(level, cat.slug, w.de)).map((w) => w.de),
    left: newLeftToday(),
    target: dailyNewTarget(),
  }))
  if (snap && queue === null) {
    const due = new Set(snap.due)
    const seen = new Set(snap.seen)
    const reviews = cat.words.filter((w) => due.has(w.de)).slice(0, 5)
    const unseen = cat.words.filter((w) => !seen.has(w.de))
    const allowance = extra ? NEW_PER_SESSION : Math.min(NEW_PER_SESSION, snap.left)
    const fresh = unseen.slice(0, allowance)
    const words = [...reviews.map((w) => ({ w, isNew: false })), ...fresh.map((w) => ({ w, isNew: true }))]
    const p = new Map(words.map(({ w, isNew }) => [w.de, ladder(w, isNew)]))
    setCapped(fresh.length === 0 && unseen.length > 0)
    setPlan(p)
    setQueue(words.map(({ w }, i) => ({ w, step: p.get(w.de)![0], id: i })))
    setNextId(words.length)
  }

  const task = queue?.[0]

  // Auto-play audio for intro & listening steps
  useEffect(() => {
    if (task && (task.step === 'intro' || task.step === 'listen')) {
      const t = window.setTimeout(() => speakDe(spoken(task.w)), 250)
      return () => window.clearTimeout(t)
    }
  }, [task])

  if (!queue) return <div className="skeleton h-80 rounded-card-lg" />

  if (!task) {
    if (doneCount === 0 && capped) {
      return (
        <div className="paper-card border-2 border-ink-faint rounded-card-lg p-6 text-center flex flex-col gap-3 items-center">
          <IconBadge><Trophy size={30} /></IconBadge>
          <p className="font-display font-extrabold text-xl">Target {snap?.target} kata baru hari ini tercapai!</p>
          <p className="text-ink-muted text-sm">Otak butuh waktu untuk menyimpan kata baru. Besok kamu dapat {snap?.target} kata lagi, plus ulangan kata hari ini.</p>
          <button onClick={() => { setExtra(true); setQueue(null) }} className="text-sm font-extrabold text-ink-muted underline">Tetap tambah {NEW_PER_SESSION} kata lagi</button>
        </div>
      )
    }
    if (doneCount === 0) {
      const next = nextDueLabel(level, cat.slug)
      return (
        <div className="paper-card border-2 border-ink-faint rounded-card-lg p-6 text-center flex flex-col gap-2 items-center">
          <IconBadge><TreeDeciduous size={30} /></IconBadge>
          <p className="font-display font-extrabold text-xl">Semua kata sudah dipelajari!</p>
          <p className="text-ink-muted">Review berikutnya: <b>{next ?? '-'}</b>. Kata yang jatuh tempo otomatis masuk ke <b>Hari ini</b> di Beranda.</p>
        </div>
      )
    }
    const acc = answered ? Math.round((correct / answered) * 100) : 100
    return (
      <div className="paper-card border-2 border-ink-faint rounded-card-lg p-6 text-center flex flex-col gap-3 items-center bounce-in">
        <IconBadge bg="#FFF7D6" color="#F5B800"><Trophy size={30} /></IconBadge>
        <p className="font-display font-extrabold text-2xl">Sesi selesai!</p>
        <div className="grid grid-cols-3 gap-2 w-full">
          <Stat label="Kata" value={`${learned.length}`} />
          <Stat label="Akurasi" value={`${acc}%`} />
          <Stat label="Benar" value={`${correct}`} />
        </div>
        <p className="text-sm text-ink-muted">Review berikutnya: <b>{nextDueLabel(level, cat.slug) ?? '-'}</b></p>
        <button onClick={onRestart} className="h-12 px-5 rounded-btn bg-ink text-white font-medium btn-press flex items-center justify-center gap-1.5">Sesi berikutnya</button>
      </div>
    )
  }

  function answer(ok: boolean, msg: string) {
    if (!task || feedback) return
    setFeedback({ ok, msg })
    setAnswered((n) => n + 1)
    setAnim(ok ? 'pop-good' : 'shake')
    if (ok) {
      setCorrect((n) => n + 1)
      haptic(15)
    } else {
      setMistakes((m) => ({ ...m, [task.w.de]: (m[task.w.de] ?? 0) + 1 }))
      haptic([30, 40, 30])
    }
    speakDe(spoken(task.w))
  }

  function advance() {
    if (!task || !queue) return
    const ok = task.step === 'intro' || feedback?.ok
    const rest = queue.slice(1)
    setNextId((n) => n + 1)
    const steps = plan.get(task.w.de)!
    let nextTask: Task | null = null
    if (!ok) nextTask = { ...task, id: nextId }
    else {
      const ni = steps.indexOf(task.step) + 1
      if (ni < steps.length) nextTask = { w: task.w, step: steps[ni], id: nextId }
      else {
        // Ladder finished → schedule with FSRS
        review(level, cat.slug, task.w.de, (mistakes[task.w.de] ?? 0) <= 1)
        setLearned((l) => [...l, task.w.de])
      }
    }
    if (nextTask) rest.splice(Math.min(REINSERT_AT, rest.length), 0, nextTask)
    if (!rest.length) bumpStreak()
    setQueue(rest)
    setDoneCount((n) => n + 1)
    setFeedback(null)
    setAnim('')
  }

  const total = doneCount + queue.length
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1 rounded-pill bg-bg-soft overflow-hidden">
          <div className="h-full bg-mint rounded-pill transition-all duration-500" style={{ width: `${(doneCount / total) * 100}%` }} />
        </div>
      </div>

      <div key={task.id} className="slide-up flex flex-col gap-4">
        <StepLabel step={task.step} />
        <div className={anim} onAnimationEnd={() => setAnim('')}>
          <TaskBody task={task} words={cat.words} feedback={feedback} onAnswer={answer} />
        </div>
      </div>

      {task.step === 'intro' ? (
        <button onClick={advance} className="h-12 rounded-btn bg-ink text-white font-medium btn-press">
          <span className="flex items-center justify-center gap-1.5">Mengerti, lanjut <ArrowRight size={18} strokeWidth={2.6} /></span>
        </button>
      ) : (
        feedback && (
          <BottomSheet ok={feedback.ok}>
            <p className={`font-display font-extrabold text-lg flex items-center gap-2 ${feedback.ok ? 'text-mint-deep' : 'text-coral-deep'}`}>
              {feedback.ok ? <CircleCheck size={22} strokeWidth={2.6} /> : <CircleX size={22} strokeWidth={2.6} />}
              {feedback.ok ? 'Benar' : 'Belum tepat'}
            </p>
            {feedback.msg && <p className="text-sm text-ink">{feedback.msg}</p>}
            <button
              onClick={advance}
              className={`py-3 rounded-btn text-white font-extrabold btn-press ${feedback.ok ? 'bg-mint' : 'bg-coral'}`}
            >
              <span className="flex items-center justify-center gap-1.5">Lanjut <ArrowRight size={18} strokeWidth={2.6} /></span>
            </button>
          </BottomSheet>
        )
      )}
    </div>
  )
}

function StepLabel({ step }: { step: Step }) {
  const { text, Icon } = STEP_LABEL[step]
  return (
    <p className="text-sm font-extrabold text-ink-muted flex items-center gap-1.5">
      <Icon size={16} strokeWidth={2.4} />
      {text}
    </p>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card bg-bg-soft p-3">
      <p className="font-display font-extrabold text-xl">{value}</p>
      <p className="text-xs text-ink-muted font-bold">{label}</p>
    </div>
  )
}

function TaskBody({
  task,
  words,
  feedback,
  onAnswer,
}: {
  task: Task
  words: Word[]
  feedback: Feedback
  onAnswer: (ok: boolean, msg: string) => void
}) {
  const { w, step } = task
  const [picked, setPicked] = useState<string | null>(null)

  const options = useMemo(() => {
    const others = shuffle(words.filter((x) => x.de !== w.de)).slice(0, 3)
    return shuffle([w, ...others])
  }, [w, words])

  const card = 'paper-card border-2 border-ink-faint rounded-card-lg'

  if (step === 'intro') {
    return (
      <div className={`${card} p-5`}>
        <Details w={w} />
      </div>
    )
  }

  if (step === 'gender') {
    const pick = picked as Gender | null
    return (
      <div className="flex flex-col gap-3">
        <div className={`${card} p-6 text-center flex flex-col gap-2 items-center`}>
          <p className="font-display font-extrabold text-4xl">
            {pick ? <span style={{ color: GENDER_STYLE[w.gender!].color }}>{w.gender} </span> : <span className="text-ink-faint">___ </span>}
            {w.de}
          </p>
          <p className="text-ink-muted">{w.id}</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(['der', 'die', 'das'] as Gender[]).map((g) => {
            const isRight = feedback && g === w.gender
            const isWrongPick = feedback && pick === g && g !== w.gender
            return (
              <button
                key={g}
                disabled={!!feedback}
                onClick={() => {
                  setPicked(g)
                  onAnswer(g === w.gender, g === w.gender ? (w.hint ?? '') : `Yang benar: ${w.gender} ${w.de}. ${w.hint ?? ''}`)
                }}
                className={`py-4 rounded-btn font-display font-extrabold text-xl text-white btn-press transition ${
                  feedback && !isRight && !isWrongPick ? 'opacity-30' : ''
                } ${isWrongPick ? 'line-through' : ''}`}
                style={{ background: GENDER_STYLE[g].color }}
              >
                {g}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  if (step === 'meaning' || step === 'listen') {
    return (
      <div className="flex flex-col gap-3">
        <div className={`${card} p-6 text-center flex flex-col gap-3 items-center`}>
          {step === 'meaning' ? (
            <>
              <WordTitle w={w} />
              <Speak text={spoken(w)} withSlow />
            </>
          ) : (
            <>
              <button
                onClick={() => speakDe(spoken(w))}
                className="w-24 h-24 rounded-pill bg-sky text-white text-4xl flex items-center justify-center btn-press"
               
                aria-label="Putar lagi"
              >
                <Volume2 size={40} strokeWidth={2.2} />
              </button>
              <button onClick={() => speakDe(spoken(w), 0.55)} className="text-sm font-extrabold text-sky-dark flex items-center gap-1.5"><Snail size={16} strokeWidth={2.4} />Putar pelan</button>
            </>
          )}
        </div>
        <div className="grid grid-cols-1 gap-2">
          {options.map((o) => {
            const label = step === 'meaning' ? o.id : spoken(o)
            const right = o.de === w.de
            const state = !feedback ? 'idle' : right ? 'right' : picked === o.de ? 'wrong' : 'dim'
            return (
              <button
                key={o.de}
                disabled={!!feedback}
                onClick={() => {
                  setPicked(o.de)
                  onAnswer(right, right ? '' : `Jawaban: ${spoken(w)} = ${w.id}`)
                }}
                className={`py-3.5 px-4 rounded-btn border-2 text-left font-bold transition btn-press ${
                  state === 'right'
                    ? 'bg-[#F0FDF4] border-[#86EFAC] text-[#15803D]'
                    : state === 'wrong'
                      ? 'bg-coral-soft border-coral text-coral-deep'
                      : state === 'dim'
                        ? 'bg-surface border-ink-faint opacity-40'
                        : 'bg-surface border-ink-faint'
                }`}
                
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return <TypeTask w={w} feedback={feedback} onAnswer={onAnswer} />
}

function TypeTask({ w, feedback, onAnswer }: { w: Word; feedback: Feedback; onAnswer: (ok: boolean, msg: string) => void }) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const target = spoken(w)

  function check() {
    if (!value.trim() || feedback) return
    const typed = norm(value)
    const ok = typed === norm(target)
    if (ok) {
      const exact = value.trim().toLowerCase().replace(/\s+/g, ' ') === target.toLowerCase()
      onAnswer(true, exact ? '' : `Ejaan yang tepat: ${target}`)
    } else if (w.gender && typed === norm(w.de)) {
      onAnswer(false, `Hampir! Jangan lupa artikelnya: ${target}`)
    } else {
      onAnswer(false, `Jawaban: ${target}`)
    }
  }

  function insert(ch: string) {
    setValue((v) => v + ch)
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="paper-card border-2 border-ink-faint rounded-card-lg p-6 text-center">
        <p className="font-display font-extrabold text-3xl">{w.id}</p>
        {w.gender && <p className="text-sm text-ink-muted mt-1">Tulis dengan artikelnya (der/die/das)</p>}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          check()
        }}
        className="flex flex-col gap-2"
      >
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!!feedback}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder={w.gender ? 'contoh: der Tisch' : 'ketik jawabanmu…'}
          className={`w-full px-4 py-3.5 rounded-btn border text-lg font-medium bg-surface outline-none focus:border-ink ${
            feedback ? (feedback.ok ? 'border-[#15803D]' : 'border-[#B91C1C]') : 'border-ink-faint'
          }`}
        />
        <div className="flex gap-2">
          {['ä', 'ö', 'ü', 'ß'].map((ch) => (
            <button
              type="button"
              key={ch}
              disabled={!!feedback}
              onClick={() => insert(ch)}
              className="flex-1 py-2 rounded-btn bg-bg-soft font-extrabold text-lg btn-press"
            >
              {ch}
            </button>
          ))}
        </div>
        {!feedback && (
          <button type="submit" className="py-3.5 rounded-btn bg-ink text-white font-extrabold btn-press disabled:opacity-40" disabled={!value.trim()}>
            Cek jawaban
          </button>
        )}
      </form>
    </div>
  )
}
