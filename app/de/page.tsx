import Link from 'next/link'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { CATEGORIES, LEVELS } from '@/lib/de/content'
import { CategoryIcon } from '@/components/de/icons'
import { Logo } from '@/components/de/Logo'
import { NextTopicCard, ReadinessRow, StreakChip, TodayCard } from '@/components/de/HomeToday'
import { InstallCard } from '@/components/de/Pwa'
import { AccountChip } from '@/components/de/Account'

export default function DeHome() {
  const a1 = LEVELS[0]
  const cats = CATEGORIES.a1
  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          <Link href="/mulai" className="text-sm font-medium text-ink-muted flex items-center gap-1">
            Deutsch · {a1.label}
            <ChevronDown size={15} strokeWidth={1.75} />
          </Link>
          <StreakChip />
          <AccountChip />
        </div>
      </header>

      <section className="flex flex-col gap-3">
        <div>
          <p className="de-label">Heute</p>
          <h1 className="text-[2rem] font-semibold tracking-tight leading-tight">Hari ini</h1>
        </div>
        <TodayCard />
      </section>

      <InstallCard variant="home" />

      <section className="flex flex-col gap-3">
        <p className="de-label">Target ujian</p>
        <ReadinessRow />
      </section>

      <section className="flex flex-col gap-3">
        <p className="de-label">Lanjut grammar</p>
        <NextTopicCard />
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <p className="de-label">Kosakata {a1.label}</p>
          <Link href="/de/kartu" className="text-xs font-medium text-ink-muted">Semua ({cats.length})</Link>
        </div>
        <ul className="bg-surface border border-ink-faint rounded-card-lg divide-y divide-ink-faint overflow-hidden">
          {cats.slice(0, 5).map((c) => (
            <li key={c.slug}>
              <Link href={`/de/kartu/a1/${c.slug}`} className="flex items-center gap-3 px-4 py-3 active:bg-bg-soft transition-colors">
                <CategoryIcon slug={c.slug} size={16} />
                <span className="flex-1 font-medium">{c.title}</span>
                <span className="text-sm text-ink-subtle">{c.words.length}</span>
                <ChevronRight size={16} strokeWidth={1.75} className="text-ink-subtle" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
