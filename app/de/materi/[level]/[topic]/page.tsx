import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Dumbbell, Layers } from 'lucide-react'
import Lesson from '@/components/de/Lesson'
import { TopicProgress } from '@/components/de/TopicStatus'
import { getLevel } from '@/lib/de/content'
import { getPractice } from '@/lib/de/exercises'

export default async function TopicPage({ params }: { params: Promise<{ level: string; topic: string }> }) {
  const { level, topic } = await params
  const lv = getLevel(level)
  const t = lv?.topics.find((x) => x.slug === topic)
  if (!lv || !t?.body) notFound()

  const ready = lv.topics.filter((x) => x.body)
  const nextTopic = ready[ready.findIndex((x) => x.slug === t.slug) + 1]
  const practice = getPractice(lv.id, t.slug)
  const base = `/de/materi/${lv.id}/${t.slug}/latihan`

  const PracticeCard = practice && (
    <div className="bg-surface border border-ink-faint rounded-card-lg p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-card border border-ink-faint text-ink flex items-center justify-center shrink-0">
          <Dumbbell size={22} strokeWidth={2.4} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-extrabold leading-tight">Latihan materi ini</p>
          <p className="text-xs text-ink-muted">{practice.items.length} soal · 5 jenis latihan</p>
        </div>
        <Link href={base} className="px-4 h-10 inline-flex items-center rounded-btn bg-ink text-white font-medium btn-press text-sm">
          Mulai
        </Link>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {practice.sections.map((s) => (
          <Link key={s.id} href={`${base}?bagian=${s.id}`} className="text-xs font-medium px-2.5 py-1.5 rounded-pill border border-ink-faint text-ink-muted btn-press">
            {s.label} · {practice.items.filter((x) => x.section === s.id).length}
          </Link>
        ))}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      <Link href="/de/materi" className="text-sm font-extrabold text-ink-muted flex items-center gap-1 w-fit"><ArrowLeft size={16} strokeWidth={2.6} />Materi</Link>
      <div>
        <span className="de-label">{lv.label}</span>
        <h1 className="font-display font-extrabold text-2xl mt-2">{t.title}</h1>
        <p className="text-ink-muted">{t.summary}</p>
      </div>
      {PracticeCard}
      <div className="paper-card border-2 border-ink-faint rounded-card-lg p-4">
        <Lesson body={t.body} />
      </div>
      <TopicProgress
        level={lv.id}
        topic={t.slug}
        practiceHref={practice ? base : undefined}
        nextHref={nextTopic ? `/de/materi/${lv.id}/${nextTopic.slug}` : undefined}
        vocabDrillHref={t.slug === 'artikel' ? '/de/latihan-artikel' : undefined}
      />
      <div className="flex gap-2">
        <Link href="/de/kartu" className="flex-1 h-12 rounded-btn bg-surface border border-ink-faint font-medium flex items-center justify-center gap-1.5">
          <Layers size={17} strokeWidth={2.4} />Kartu kosakata
        </Link>
        {nextTopic && (
          <Link href={`/de/materi/${lv.id}/${nextTopic.slug}`} className="flex-1 h-12 rounded-btn bg-surface border border-ink-faint font-medium flex items-center justify-center gap-1.5">
            Topik berikutnya <ArrowRight size={17} strokeWidth={2.6} />
          </Link>
        )}
      </div>
    </div>
  )
}
