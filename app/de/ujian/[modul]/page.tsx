'use client'
import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { isModule, SET_LABEL, SETS, TEILE } from '@/lib/de/pruefung'
import { MODULES } from '@/lib/de/pruefung/score'
import { getExam, practiceKey } from '@/lib/de/pruefung/store'
import { useProgress } from '@/lib/de/useProgress'

export default function ExamModulePage() {
  const { modul } = useParams<{ modul: string }>()
  const state = useProgress(() => getExam())
  if (!isModule(modul)) notFound()
  const m = MODULES.find((x) => x.id === modul)!

  return (
    <div className="flex flex-col gap-5">
      <Link href="/de/ujian" className="text-sm font-extrabold text-ink-muted flex items-center gap-1 w-fit">
        <ArrowLeft size={16} strokeWidth={2.6} />
        Ujian
      </Link>
      <div>
        <p className="de-label">Goethe A1 · {m.minutes} menit di ujian</p>
        <h1 className="text-[2rem] font-semibold tracking-tight leading-tight">{m.de}</h1>
        <p className="text-ink-muted mt-1">{m.label} · 25 poin</p>
      </div>
      {TEILE[modul].map((t) => (
        <section key={t.n} className="flex flex-col gap-2">
          <div>
            <p className="de-label">Teil {t.n}</p>
            <p className="font-semibold">{t.title}</p>
            <p className="text-sm text-ink-muted">{t.info}</p>
          </div>
          <div className="bg-surface border border-ink-faint rounded-card-lg divide-y divide-ink-faint overflow-hidden">
            {SETS.map((s) => {
              const best = state?.practice[practiceKey(modul, s, t.n)]?.best
              return (
                <Link key={s} href={`/de/ujian/${modul}/${t.n}?set=${s}`} className="flex items-center gap-3 px-4 py-3 active:bg-bg-soft transition-colors">
                  <span className="flex-1 font-medium">{SET_LABEL[s]}</span>
                  <span className={`text-xs font-bold ${best == null ? 'text-ink-subtle' : best >= 60 ? 'text-mint-deep' : 'text-coral-deep'}`}>
                    {best == null ? 'Belum' : `Terbaik ${best}%`}
                  </span>
                  <ChevronRight className="text-ink-subtle" size={18} />
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
