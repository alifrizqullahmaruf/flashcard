'use client'
import Link from 'next/link'
import { CATEGORIES, LEVELS } from '@/lib/de/content'
import { countStates, getStreak, getTopicStatus, levelReadiness, topicStage, type CardState } from '@/lib/de/progress'
import { useProgress } from '@/lib/de/useProgress'
import { CategoryIcon } from '@/components/de/icons'
import { STATE_STYLE, StateBar } from '@/components/de/CardStats'
import { TopicStageIcon } from '@/components/de/TopicStatus'
import { InstallCard, OfflineDownload } from '@/components/de/Pwa'

export default function ProgressPage() {
  const lv = LEVELS[0]
  const cats = CATEGORIES.a1
  const ready = lv.topics.filter((t) => t.body)
  const data = useProgress(() => ({
    readiness: levelReadiness('a1'),
    counts: Object.fromEntries(cats.map((c) => [c.slug, countStates('a1', c.slug)])) as Record<string, Record<CardState, number>>,
    streak: getStreak().count,
    stages: Object.fromEntries(ready.map((t) => [t.slug, topicStage(getTopicStatus('a1', t.slug))])),
  }))

  if (!data) return <div className="skeleton h-96 rounded-card-lg" />
  const r = data.readiness

  return (
    <div className="flex flex-col gap-4">
      <header>
        <p className="de-label">Fortschritt</p>
        <h1 className="text-[2rem] font-semibold tracking-tight leading-tight">Progress</h1>
      </header>

      <div className="bg-surface border border-ink-faint rounded-card-lg p-5 flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="de-label">Kesiapan {lv.label}</p>
            <p className="text-5xl font-semibold tracking-tight leading-none mt-2">{r.pct}%</p>
          </div>
          <span className="text-xs font-extrabold text-ink-muted">Streak {data.streak} hari</span>
        </div>
        <div className="h-1 rounded-pill bg-bg-soft overflow-hidden">
          <div className="h-full bg-ink transition-all" style={{ width: `${r.pct}%` }} />
        </div>
        <div className="grid grid-cols-2 divide-x divide-ink-faint border-t border-ink-faint pt-3 text-sm">
          <div className="pr-3">
            <p className="text-xl font-semibold">{r.mastered}/{r.topics}</p>
            <p className="text-xs text-ink-muted">materi dikuasai (50%)</p>
          </div>
          <div className="pl-3">
            <p className="text-xl font-semibold">{r.hafal}/{r.words}</p>
            <p className="text-xs text-ink-muted">kata hafal permanen (50%)</p>
          </div>
        </div>
        <p className="text-[11px] text-ink-subtle">Dihitung dari materi & kosakata yang sudah tersedia di MVP ini. Kata dianggap hafal permanen setelah jarak ulangnya ≥ 21 hari.</p>
      </div>

      <section className="flex flex-col gap-3">
        <p className="de-label">Materi grammar</p>
        {ready.map((t) => (
          <Link key={t.slug} href={`/de/materi/a1/${t.slug}`} className="bg-surface border border-ink-faint rounded-card-lg px-4 py-3 flex items-center gap-3">
            <TopicStageIcon level="a1" topic={t.slug} />
            <span className="flex-1 font-medium text-sm">{t.title}</span>
            <span className="text-xs text-ink-subtle">
              {data.stages[t.slug] === 'dikuasai' ? 'Dikuasai' : data.stages[t.slug] === 'dibaca' ? 'Sudah dibaca' : 'Belum'}
            </span>
          </Link>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <p className="de-label">Kosakata</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-bold text-ink-muted">
          {(['hafal', 'belajar', 'sulit', 'baru'] as CardState[]).map((s) => (
            <span key={s} className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-pill" style={{ background: STATE_STYLE[s].color }} />
              {STATE_STYLE[s].label}
            </span>
          ))}
        </div>
        {cats.map((c) => {
          const n = data.counts[c.slug]
          return (
            <Link key={c.slug} href={`/de/kartu/a1/${c.slug}`} className="bg-surface border border-ink-faint rounded-card-lg px-4 py-3 flex items-center gap-3">
              <CategoryIcon slug={c.slug} size={16} />
              <div className="flex-1">
                <div className="flex justify-between text-sm font-medium">
                  <span>{c.title}</span>
                  <span className="text-ink-subtle font-normal text-xs">{n.hafal} hafal · {n.belajar + n.sulit} belajar · {n.baru} baru</span>
                </div>
                <div className="mt-1.5">
                  <StateBar counts={n} total={c.words.length} h="h-1" />
                </div>
              </div>
            </Link>
          )
        })}
      </section>

      <section className="flex flex-col gap-3">
        <p className="de-label">Aplikasi</p>
        <InstallCard variant="progress" />
        <OfflineDownload />
      </section>

      <Link href="/de/kredit" className="text-xs font-bold text-ink-subtle underline self-center">Kredit audio &amp; suara</Link>
    </div>
  )
}
