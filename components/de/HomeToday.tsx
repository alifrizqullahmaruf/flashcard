'use client'
import Link from 'next/link'
import { ArrowRight, BookOpen, ChevronRight, CircleCheck, Flame, Headphones, PencilLine } from 'lucide-react'
import { todaysKind } from '@/lib/de/context'
import { LEVELS } from '@/lib/de/content'
import {
  dailyNewTarget,
  getDueAll,
  getDueGrammar,
  getNewWords,
  getStreak,
  getTopicStatus,
  levelReadiness,
  newLeftToday,
  newToday,
  topicStage,
} from '@/lib/de/progress'
import { useProgress } from '@/lib/de/useProgress'

export function StreakChip() {
  const s = useProgress(getStreak)
  const n = s?.count ?? 0
  return (
    <span className="text-sm font-medium flex items-center gap-1" title="Streak harian">
      <Flame size={16} strokeWidth={1.75} className={s?.doneToday ? 'text-[#EA580C]' : 'text-ink-subtle'} fill={s?.doneToday ? 'currentColor' : 'none'} />
      <span className={s?.doneToday ? 'text-ink' : 'text-ink-muted'}>{n}</span>
    </span>
  )
}

export function TodayCard() {
  const t = useProgress(() => ({
    due: getDueAll().length,
    fresh: getNewWords(newLeftToday()).length,
    learnedToday: newToday(),
    target: dailyNewTarget(),
    gram: getDueGrammar(5).length,
    doneToday: getStreak().doneToday,
  }))

  if (!t) return <div className="skeleton h-44 rounded-card-lg" />
  const total = t.due + t.fresh + t.gram
  const empty = total === 0

  return (
    <div className="bg-surface border border-ink-faint rounded-card-lg overflow-hidden">
      <div className="grid grid-cols-3 divide-x divide-ink-faint">
        <Count n={t.due} label="Ulang" />
        <Count n={t.fresh} label="Kata baru" />
        <Count n={t.gram} label="Grammar" />
      </div>
      <div className="border-t border-ink-faint p-3 flex flex-col gap-2">
        {empty ? (
          <p className="text-sm text-ink-muted flex items-center gap-1.5 px-1 py-1.5">
            <CircleCheck size={16} strokeWidth={1.75} className="text-[#15803D]" />
            Semua beres. Kartu berikutnya muncul saat waktunya diulang.
          </p>
        ) : (
          <Link href="/de/hari-ini" className="h-12 rounded-btn bg-ink text-white font-medium btn-press flex items-center justify-center gap-2">
            {t.doneToday ? 'Lanjut belajar' : 'Mulai'}
            <span className="text-white/60">· {total}</span>
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
        )}
        <p className="text-[11px] text-ink-subtle text-center">Kata baru hari ini {t.learnedToday}/{t.target}</p>
      </div>
    </div>
  )
}

function Count({ n, label }: { n: number; label: string }) {
  return (
    <div className="py-4 px-2 text-center">
      <p className={`text-[1.75rem] font-semibold leading-none tracking-tight ${n ? 'text-ink' : 'text-ink-faint'}`}>{n}</p>
      <p className="de-label mt-2">{label}</p>
    </div>
  )
}

/** First grammar topic that is not mastered yet. */
export function NextTopicCard() {
  const lv = LEVELS[0]
  const ready = lv.topics.filter((t) => t.body)
  // null = not loaded yet (server render); { slug: null } = everything mastered
  const res = useProgress(() => ({ slug: ready.find((t) => topicStage(getTopicStatus(lv.id, t.slug)) !== 'dikuasai')?.slug ?? null }))
  const allDone = res !== null && res.slug === null
  const t = allDone ? null : (ready.find((x) => x.slug === res?.slug) ?? ready[0])

  return (
    <Link
      href={t ? `/de/materi/${lv.id}/${t.slug}` : '/de/materi'}
      className="bg-surface border border-ink-faint rounded-card-lg px-4 py-3.5 flex items-center gap-3 active:bg-bg-soft transition-colors"
    >
      <BookOpen size={18} strokeWidth={1.6} className="text-ink-muted shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-medium leading-snug">{allDone ? 'Semua materi A1 yang tersedia sudah dikuasai' : t?.title ?? ready[0].title}</p>
        <p className="text-sm text-ink-muted truncate">{allDone ? 'Materi berikutnya segera hadir.' : t?.summary ?? ready[0].summary}</p>
      </div>
      <ChevronRight size={16} strokeWidth={1.75} className="text-ink-subtle shrink-0" />
    </Link>
  )
}

/** "Target ujian" row: exam name + readiness %, links to Progress. */
export function ReadinessRow() {
  const lv = LEVELS[0]
  const r = useProgress(() => levelReadiness(lv.id))
  const pct = r?.pct ?? 0
  return (
    <Link href="/de/progress" className="bg-surface border border-ink-faint rounded-card-lg px-4 py-3.5 flex flex-col gap-2.5 active:bg-bg-soft transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium leading-snug truncate">{lv.exam.split(':')[0]}</p>
          <p className="text-[13px] text-ink-subtle truncate">{lv.exam.split(':')[1]?.trim()}</p>
        </div>
        <span className="text-sm shrink-0">
          <b className="font-semibold">{r ? `${pct}%` : '–'}</b> <span className="text-ink-muted">siap</span>
        </span>
        <ChevronRight size={16} strokeWidth={1.75} className="text-ink-subtle shrink-0" />
      </div>
      <div className="h-1 rounded-pill bg-bg-soft overflow-hidden">
        <div className="h-full bg-ink transition-all" style={{ width: `${pct}%` }} />
      </div>
    </Link>
  )
}

/** Home card: today's context practice (cloze / dictation alternate by weekday). */
export function ContextCard() {
  const kind = useProgress(() => todaysKind())
  if (!kind) return null
  const isCloze = kind === 'cloze'
  return (
    <Link href="/de/konteks" className="bg-surface border border-ink-faint rounded-card-lg px-4 py-3.5 flex items-center gap-3 active:bg-bg-soft transition-colors">
      {isCloze ? <PencilLine size={18} className="text-ink-muted shrink-0" /> : <Headphones size={18} className="text-ink-muted shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="font-medium leading-snug">Latihan konteks · {isCloze ? 'Kalimat rumpang' : 'Dikte'}</p>
        <p className="text-sm text-ink-muted truncate">±10 menit · kata yang sudah kamu pelajari, di dalam kalimat</p>
      </div>
      <ChevronRight size={16} strokeWidth={1.75} className="text-ink-subtle shrink-0" />
    </Link>
  )
}
