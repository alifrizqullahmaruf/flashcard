'use client'
import Link from 'next/link'
import { ArrowRight, Check, Circle, CircleCheck, CircleDashed, Target, Trophy } from 'lucide-react'
import { MASTERY_PCT, getTopicStatus, markRead, topicStage, type TopicStage } from '@/lib/de/progress'
import { useProgress } from '@/lib/de/useProgress'
import { haptic } from '@/components/de/WordFaces'

const STAGE_LABEL: Record<TopicStage, string> = { belum: 'Belum mulai', dibaca: 'Sudah dibaca', dikuasai: 'Dikuasai' }

/** Small status icon for the Materi list. */
export function TopicStageIcon({ level, topic }: { level: string; topic: string }) {
  const s = useProgress(() => topicStage(getTopicStatus(level, topic)))
  if (s === 'dikuasai') return <CircleCheck size={20} className="text-[#15803D] shrink-0" aria-label="Dikuasai" />
  if (s === 'dibaca') return <CircleDashed size={20} className="text-ink shrink-0" aria-label="Sudah dibaca" />
  return <Circle size={20} strokeWidth={2} className="text-ink-faint shrink-0" aria-label="Belum mulai" />
}

/** "x/y dikuasai" bar for a level in the Materi list. */
export function LevelTopicBar({ level, topics }: { level: string; topics: string[] }) {
  const n = useProgress(() => topics.filter((t) => topicStage(getTopicStatus(level, t)) === 'dikuasai').length) ?? 0
  if (!topics.length) return null
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div className="flex-1 h-1.5 rounded-pill bg-bg-soft overflow-hidden">
        <div className="h-full bg-mint transition-all" style={{ width: `${(n / topics.length) * 100}%` }} />
      </div>
      <span className="text-[11px] font-extrabold text-ink-muted">{n}/{topics.length} dikuasai</span>
    </div>
  )
}

/** End-of-lesson block: "Saya sudah paham" → practice → mastered. */
export function TopicProgress({
  level,
  topic,
  practiceHref,
  nextHref,
  vocabDrillHref,
}: {
  level: string
  topic: string
  practiceHref?: string
  nextHref?: string
  vocabDrillHref?: string
}) {
  const st = useProgress(() => getTopicStatus(level, topic))
  if (!st) return <div className="skeleton h-28 rounded-card-lg" />
  const stage = topicStage(st)

  return (
    <div
      className={`rounded-card-lg border-2 p-4 flex flex-col gap-3 ${
        stage === 'dikuasai' ? 'bg-[#F0FDF4] border-[#BBF7D0]' : 'bg-surface border-ink-faint'
      }`}
    >
      <div className="flex items-center gap-2">
        <Steps stage={stage} />
        <span className="ml-auto text-xs font-extrabold text-ink-muted">{STAGE_LABEL[stage]}</span>
      </div>

      {stage === 'belum' && (
        <>
          <p className="text-sm text-ink">Sudah selesai membaca dan paham penjelasannya?</p>
          <button
            onClick={() => {
              markRead(level, topic)
              haptic(15)
            }}
            className="h-12 rounded-btn bg-ink text-white font-medium btn-press flex items-center justify-center gap-1.5"
          >
            <Check size={18} strokeWidth={3} />Saya sudah paham
          </button>
        </>
      )}

      {stage === 'dibaca' && (
        <>
          <p className="text-sm text-ink">
            Mantap! Sekarang buktikan dengan latihan. Skor <b>≥ {MASTERY_PCT}%</b> di latihan <b>Semua</b> = materi <b>Dikuasai</b>.
            {st.best !== undefined && <> Skor terbaikmu: <b>{st.best}%</b>.</>}
          </p>
          {practiceHref && (
            <Link href={practiceHref} className="h-12 rounded-btn bg-ink text-white font-medium btn-press flex items-center justify-center gap-1.5">
              <Target size={18} strokeWidth={2.6} />Uji dengan latihan
            </Link>
          )}
        </>
      )}

      {stage === 'dikuasai' && (
        <>
          <p className="text-sm text-ink flex items-start gap-2">
            <Trophy size={18} className="text-[#15803D] shrink-0 mt-0.5" />
            <span>
              Materi ini sudah kamu kuasai{st.best !== undefined && <> (skor terbaik <b>{st.best}%</b>)</>}. Beberapa soalnya akan muncul lagi di <b>Hari ini</b> supaya tidak lupa.
            </span>
          </p>
          {nextHref && (
            <Link href={nextHref} className="h-12 rounded-btn bg-ink text-white font-medium btn-press flex items-center justify-center gap-1.5">
              Topik berikutnya <ArrowRight size={18} strokeWidth={2.6} />
            </Link>
          )}
        </>
      )}

      {vocabDrillHref && stage !== 'belum' && (
        <Link href={vocabDrillHref} className="py-2.5 rounded-btn bg-surface border-2 border-ink-faint font-extrabold text-sm btn-press flex items-center justify-center gap-1.5">
          <Target size={16} strokeWidth={2.4} />Latih der/die/das dengan kosakata
        </Link>
      )}
    </div>
  )
}

function Steps({ stage }: { stage: TopicStage }) {
  const at = ['belum', 'dibaca', 'dikuasai'].indexOf(stage) // 0, 1, 2
  const labels = ['1. Paham', '2. Kuasai']
  return (
    <div className="flex items-center gap-1">
      {labels.map((l, i) => {
        const done = at > i
        const current = at === i
        return (
          <span key={l} className="flex items-center gap-1">
            <span
              className={`text-[11px] font-extrabold px-2 py-0.5 rounded-pill flex items-center gap-1 ${
                done ? 'bg-mint text-white' : current ? 'bg-surface border border-ink-faint text-ink' : 'text-ink-subtle'
              }`}
            >
              {done && <Check size={11} strokeWidth={3.4} />}
              {l}
            </span>
            {i === 0 && <span className="w-2 h-0.5 bg-ink-faint rounded" />}
          </span>
        )
      })}
    </div>
  )
}
