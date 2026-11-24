import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import TopicPractice from '@/components/de/TopicPractice'
import { getLevel } from '@/lib/de/content'
import { getPractice } from '@/lib/de/exercises'

export default async function LatihanPage({
  params,
  searchParams,
}: {
  params: Promise<{ level: string; topic: string }>
  searchParams: Promise<{ bagian?: string }>
}) {
  const { level, topic } = await params
  const { bagian } = await searchParams
  const lv = getLevel(level)
  const t = lv?.topics.find((x) => x.slug === topic)
  const practice = getPractice(level, topic)
  if (!lv || !t || !practice) notFound()

  const section = practice.sections.some((s) => s.id === bagian) ? bagian! : null
  const base = `/de/materi/${lv.id}/${t.slug}/latihan`
  const chips = [{ id: null as string | null, label: 'Semua' }, ...practice.sections]

  return (
    <div className="flex flex-col gap-4">
      <Link href={`/de/materi/${lv.id}/${t.slug}`} className="text-sm font-extrabold text-ink-muted flex items-center gap-1 w-fit">
        <ArrowLeft size={16} strokeWidth={2.6} />Materi
      </Link>
      <div>
        <p className="de-label">{lv.label} · Latihan</p>
        <h1 className="font-display font-extrabold text-2xl leading-tight">{t.title}</h1>
      </div>
      <div className="flex gap-1.5 overflow-x-auto -mx-4 px-4 pb-1 no-scrollbar">
        {chips.map((c) => {
          const active = c.id === section
          return (
            <Link
              key={c.id ?? 'semua'}
              href={c.id ? `${base}?bagian=${c.id}` : base}
              replace
              className={`shrink-0 text-[13px] font-extrabold px-3 py-1.5 rounded-pill transition ${active ? 'bg-ink text-white' : 'bg-bg-soft text-ink-muted'}`}
            >
              {c.label}
            </Link>
          )
        })}
      </div>
      <TopicPractice
        key={section ?? 'semua'}
        level={lv.id}
        topic={t.slug}
        practice={practice}
        section={section}
        backHref={`/de/materi/${lv.id}/${t.slug}`}
      />
    </div>
  )
}
