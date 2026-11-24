import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ArticleDrill } from '@/components/de/CardStudy'
import { CATEGORIES, type Category } from '@/lib/de/content'

export const metadata = { title: 'Latihan der/die/das · Hafalin Deutsch' }

export default function LatihanArtikelPage() {
  // every A1 noun, interleaved across categories so genders are mixed
  const lists = CATEGORIES.a1.map((c) => c.words.filter((w) => w.gender && w.plural !== 'Pl.'))
  const words = Array.from({ length: Math.max(...lists.map((l) => l.length)) }).flatMap((_, i) => lists.map((l) => l[i]).filter(Boolean))
  const cat: Category = { slug: 'semua-a1', title: 'Semua kata benda A1', titleDe: 'Alle Nomen', words }

  return (
    <div className="flex flex-col gap-4">
      <Link href="/de/materi/a1/artikel" className="text-sm font-extrabold text-ink-muted flex items-center gap-1 w-fit">
        <ArrowLeft size={16} strokeWidth={2.6} />Materi Artikel
      </Link>
      <div>
        <p className="text-xs font-extrabold text-mint-deep">A1 · Latihan kosakata</p>
        <h1 className="font-display font-extrabold text-2xl leading-tight">der, die, atau das?</h1>
        <p className="text-sm text-ink-muted mt-1">{words.length} kata benda dari semua kategori A1.</p>
      </div>
      <ArticleDrill cat={cat} />
    </div>
  )
}
