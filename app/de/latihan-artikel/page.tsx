import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ArticleDrill } from '@/components/de/CardStudy'
import { CATEGORIES, type Category } from '@/lib/de/content'

export const metadata = { title: 'Latihan der/die/das · Hafalin Deutsch' }
export const dynamic = 'force-dynamic' // a different set of nouns every day

const PER_SESSION = 30

/** Deterministic shuffle seeded by the calendar day (same set all day, new set tomorrow). */
function dailyShuffle<T>(arr: T[]): T[] {
  let seed = Number(new Date().toISOString().slice(0, 10).replace(/-/g, ''))
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280
    const j = Math.floor((seed / 233280) * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function LatihanArtikelPage() {
  const nouns = CATEGORIES.a1.flatMap((c) => c.words.filter((w) => w.gender && w.plural !== 'Pl.'))
  const words = dailyShuffle(nouns).slice(0, PER_SESSION)
  const cat: Category = { slug: 'semua-a1', title: 'Semua kata benda A1', titleDe: 'Alle Nomen', words }

  return (
    <div className="flex flex-col gap-4">
      <Link href="/de/materi/a1/artikel" className="text-sm font-extrabold text-ink-muted flex items-center gap-1 w-fit">
        <ArrowLeft size={16} strokeWidth={2.6} />Materi Artikel
      </Link>
      <div>
        <p className="text-xs font-extrabold text-mint-deep">A1 · Latihan kosakata</p>
        <h1 className="font-display font-extrabold text-2xl leading-tight">der, die, atau das?</h1>
        <p className="text-sm text-ink-muted mt-1">{words.length} dari {nouns.length} kata benda A1 · set baru setiap hari.</p>
      </div>
      <ArticleDrill cat={cat} />
    </div>
  )
}
