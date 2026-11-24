'use client'
import { useMemo, useState } from 'react'
import { ArrowRight, Brain, Layers, Target, type LucideIcon } from 'lucide-react'
import { GENDER_STYLE, type Category, type Gender } from '@/lib/de/content'
import { speakDe } from '@/components/de/Speak'
import SmartSession from '@/components/de/SmartSession'
import SwipeDeck from '@/components/de/SwipeDeck'
import { Hint, IconBadge, haptic, spoken } from '@/components/de/WordFaces'

type Mode = 'pintar' | 'kartu' | 'artikel'

const MODES: { id: Mode; label: string; Icon: LucideIcon }[] = [
  { id: 'pintar', label: 'Sesi Pintar', Icon: Brain },
  { id: 'kartu', label: 'Flashcard', Icon: Layers },
  { id: 'artikel', label: 'Artikel', Icon: Target },
]

export default function CardStudy({ level, cat }: { level: string; cat: Category }) {
  const [mode, setMode] = useState<Mode>('pintar')
  const [run, setRun] = useState(0) // bump to restart the current mode
  const restart = () => setRun((r) => r + 1)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-1 p-1 rounded-pill bg-bg-soft">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setMode(m.id)
              restart()
            }}
            className={`py-2 rounded-pill text-[13px] font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              mode === m.id ? 'bg-surface text-ink shadow scale-[1.03]' : 'text-ink-muted'
            }`}
          >
            <m.Icon size={15} strokeWidth={2.4} />
            {m.label}
          </button>
        ))}
      </div>

      <div key={`${mode}-${run}`} className="tab-fade-in">
        {mode === 'pintar' && <SmartSession level={level} cat={cat} onRestart={restart} />}
        {mode === 'kartu' && <SwipeDeck level={level} cat={cat} onRestart={restart} />}
        {mode === 'artikel' && <ArticleQuiz cat={cat} onRestart={restart} />}
      </div>
    </div>
  )
}

function ArticleQuiz({ cat, onRestart }: { cat: Category; onRestart: () => void }) {
  const deck = useMemo(() => cat.words.filter((w) => w.gender && w.plural !== 'Pl.'), [cat.words])
  const [i, setI] = useState(0)
  const [pick, setPick] = useState<Gender | null>(null)
  const [score, setScore] = useState(0)
  const [anim, setAnim] = useState('')
  const w = deck[i]

  if (!deck.length) {
    return <p className="text-center text-ink-muted py-10">Kategori ini tidak punya kata benda. Coba Sesi Pintar.</p>
  }

  if (!w) {
    return (
      <div className="paper-card border-2 border-ink-faint rounded-card-lg p-6 text-center flex flex-col gap-3 items-center bounce-in">
        <IconBadge><Target size={30} /></IconBadge>
        <p className="font-display font-extrabold text-xl">Skor {score} / {deck.length}</p>
        <button onClick={onRestart} className="h-12 px-5 rounded-btn bg-ink text-white font-medium btn-press flex items-center justify-center gap-1.5">Ulangi</button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-sm font-bold text-ink-muted">
        <span>{i + 1} / {deck.length}</span>
        <span>Skor: {score}</span>
      </div>
      <div
        key={i}
        className={`paper-card border-2 border-ink-faint rounded-card-lg p-6 min-h-[14rem] flex flex-col items-center justify-center text-center gap-2 slide-up ${anim}`}
        onAnimationEnd={() => setAnim('')}
      >
        <p className="font-display font-extrabold text-4xl">
          {pick ? <span style={{ color: GENDER_STYLE[w.gender!].color }}>{w.gender} </span> : <span className="text-ink-faint">___ </span>}
          {w.de}
        </p>
        <p className="text-ink-muted">{w.id}</p>
        {pick && (
          <p className={`font-extrabold mt-2 ${pick === w.gender ? 'text-success' : 'text-error'}`}>
            {pick === w.gender ? 'Benar!' : `Kurang tepat, yang benar: ${w.gender}`}
          </p>
        )}
        {pick && w.hint && <div className="mt-1"><Hint text={w.hint} /></div>}
      </div>
      {pick ? (
        <button
          onClick={() => {
            setPick(null)
            setI((x) => x + 1)
          }}
          className="h-12 rounded-btn bg-ink text-white font-medium btn-press flex items-center justify-center gap-1.5"
        >
          Lanjut <ArrowRight size={18} strokeWidth={2.6} />
        </button>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {(['der', 'die', 'das'] as Gender[]).map((g) => (
            <button
              key={g}
              onClick={() => {
                const ok = g === w.gender
                setPick(g)
                setAnim(ok ? 'pop-good' : 'shake')
                haptic(ok ? 15 : [30, 40, 30])
                speakDe(spoken(w))
                if (ok) setScore((s) => s + 1)
              }}
              className="py-4 rounded-btn font-display font-extrabold text-xl text-white btn-press"
              style={{ background: GENDER_STYLE[g].color }}
            >
              {g}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/** Standalone der/die/das drill (used after the Artikel lesson). */
export function ArticleDrill({ cat }: { cat: Category }) {
  const [run, setRun] = useState(0)
  return <ArticleQuiz key={run} cat={cat} onRestart={() => setRun((r) => r + 1)} />
}
