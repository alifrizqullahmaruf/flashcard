import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import CardStudy from '@/components/de/CardStudy'
import CardStats from '@/components/de/CardStats'
import { CategoryIcon } from '@/components/de/icons'
import { getCategory, getLevel } from '@/lib/de/content'

export default async function CategoryPage({ params }: { params: Promise<{ level: string; cat: string }> }) {
  const { level, cat } = await params
  const lv = getLevel(level)
  const c = getCategory(level, cat)
  if (!lv || !c) notFound()

  return (
    <div className="flex flex-col gap-4">
      <Link href="/de/kartu" className="text-sm font-extrabold text-ink-muted flex items-center gap-1 w-fit">
        <ArrowLeft size={16} strokeWidth={2.6} />Kartu
      </Link>
      <div className="flex items-center gap-3">
        <CategoryIcon slug={c.slug} size={22} />
        <div>
          <p className="de-label">{lv.label} · {c.titleDe}</p>
          <h1 className="font-display font-extrabold text-2xl leading-tight">{c.title}</h1>
        </div>
      </div>
      <CardStats level={lv.id} cat={c} />
      <CardStudy level={lv.id} cat={c} />
    </div>
  )
}
