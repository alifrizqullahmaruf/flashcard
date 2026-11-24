import Link from 'next/link'
import { ChevronRight, Lock } from 'lucide-react'
import { CATEGORIES, LEVELS, type Category } from '@/lib/de/content'
import { CategoryIcon } from '@/components/de/icons'

/** Theme groups so a long category list stays scannable. Unknown slugs fall into "Lainnya". */
const GROUPS: { label: string; slugs: string[] }[] = [
  { label: 'Diri & keluarga', slugs: ['person', 'formular', 'familie', 'leute'] },
  { label: 'Sehari-hari', slugs: ['zahlen', 'zeit', 'essen', 'einkaufen', 'wohnen', 'alltag', 'dinge'] },
  { label: 'Kota & perjalanan', slugs: ['stadt', 'reisen', 'unterwegs'] },
  { label: 'Kesehatan, sekolah & kerja', slugs: ['koerper', 'schule', 'arbeit', 'freizeit', 'kommunikation'] },
  { label: 'Dasar bahasa', slugs: ['farben', 'wetter', 'verben', 'adverbien', 'kleinwoerter', 'pronomen'] },
]

function grouped(cats: Category[]) {
  const known = new Set(GROUPS.flatMap((g) => g.slugs))
  const out = GROUPS.map((g) => ({ label: g.label, cats: g.slugs.map((s) => cats.find((c) => c.slug === s)).filter((c): c is Category => !!c) }))
  const rest = cats.filter((c) => !known.has(c.slug))
  if (rest.length) out.push({ label: 'Lainnya', cats: rest })
  return out.filter((g) => g.cats.length)
}

export default function KartuPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="de-label">Wortschatz</p>
        <h1 className="text-[2rem] font-semibold tracking-tight leading-tight">Kartu</h1>
        <p className="text-ink-muted mt-1">Kosakata siap pakai, per level & kategori.</p>
      </div>

      {LEVELS.map((lv) => {
        const cats = CATEGORIES[lv.id]
        const total = cats.reduce((n, c) => n + c.words.length, 0)
        return (
          <section key={lv.id} className="flex flex-col gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-semibold tracking-tight">{lv.label}</span>
              <span className="text-sm text-ink-subtle flex items-center gap-1">
                {cats.length ? `${cats.length} kategori · ${total} kata` : <><Lock size={13} />Segera hadir</>}
              </span>
            </div>
            {grouped(cats).map((g) => (
              <div key={g.label} className="flex flex-col gap-2">
                <p className="de-label">{g.label}</p>
                <div className="bg-surface border border-ink-faint rounded-card-lg divide-y divide-ink-faint overflow-hidden">
                  {g.cats.map((c) => (
                    <Link key={c.slug} href={`/de/kartu/${lv.id}/${c.slug}`} className="flex items-center gap-3 px-4 py-3 active:bg-bg-soft transition-colors">
                      <CategoryIcon slug={c.slug} size={16} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium leading-tight">{c.title}</p>
                        <p className="text-[13px] text-ink-subtle">{c.titleDe} · {c.words.length} kata</p>
                      </div>
                      <ChevronRight className="text-ink-subtle" size={18} />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )
      })}
    </div>
  )
}
