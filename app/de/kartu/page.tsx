import Link from 'next/link'
import { ChevronRight, Lock } from 'lucide-react'
import { CATEGORIES, LEVELS } from '@/lib/de/content'
import { CategoryIcon } from '@/components/de/icons'

export default function KartuPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="de-label">Wortschatz</p>
        <h1 className="text-[2rem] font-semibold tracking-tight leading-tight">Kartu</h1>
        <p className="text-ink-muted mt-1">Kosakata siap pakai, per level & kategori.</p>
      </div>

      {LEVELS.map((lv) => {
        const cats = CATEGORIES[lv.id]
        return (
          <section key={lv.id} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight">{lv.label}</span>
              <span className="text-sm font-bold text-ink-muted flex items-center gap-1">
                {cats.length ? `${cats.length} kategori` : <><Lock size={13} strokeWidth={2.6} />Segera hadir</>}
              </span>
            </div>
            {cats.length > 0 && (
              <div className="bg-surface border border-ink-faint rounded-card-lg divide-y divide-ink-faint overflow-hidden">
                {cats.map((c) => (
                  <Link key={c.slug} href={`/de/kartu/${lv.id}/${c.slug}`} className="flex items-center gap-3 px-4 py-3 active:bg-bg-soft transition-colors">
                    <CategoryIcon slug={c.slug} size={16} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium leading-tight">{c.title}</p>
                      <p className="text-[13px] text-ink-subtle">{c.titleDe} · {c.words.length} kata</p>
                    </div>
                    <ChevronRight className="text-ink-subtle" size={20} strokeWidth={2.4} />
                  </Link>
                ))}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
