import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import ExamPractice from '@/components/de/exam/ExamPractice'
import { isModule, SET_LABEL, SETS, TEILE } from '@/lib/de/pruefung'
import { MODULES } from '@/lib/de/pruefung/score'

export default async function ExamPartPage({
  params,
  searchParams,
}: {
  params: Promise<{ modul: string; teil: string }>
  searchParams: Promise<{ set?: string }>
}) {
  const { modul, teil } = await params
  const { set: rawSet } = await searchParams
  if (!isModule(modul)) notFound()
  const t = TEILE[modul].find((x) => String(x.n) === teil)
  if (!t) notFound()
  const set = (SETS as readonly string[]).includes(rawSet ?? '') ? rawSet! : 's1'
  const m = MODULES.find((x) => x.id === modul)!
  const base = `/de/ujian/${modul}/${teil}`

  return (
    <div className="flex flex-col gap-4">
      <Link href={`/de/ujian/${modul}`} className="text-sm font-extrabold text-ink-muted flex items-center gap-1 w-fit">
        <ArrowLeft size={16} strokeWidth={2.6} />
        {m.de}
      </Link>
      <div>
        <p className="de-label">
          {m.de} · Teil {t.n}
        </p>
        <h1 className="font-display font-extrabold text-2xl leading-tight">{t.title}</h1>
        <p className="text-sm text-ink-muted mt-1">{t.info}</p>
      </div>
      <div className="flex gap-1.5">
        {SETS.map((s) => (
          <Link
            key={s}
            href={`${base}?set=${s}`}
            replace
            className={`text-[13px] font-extrabold px-3 py-1.5 rounded-pill transition ${s === set ? 'bg-ink text-white' : 'bg-bg-soft text-ink-muted'}`}
          >
            {SET_LABEL[s]}
          </Link>
        ))}
      </div>
      <ExamPractice key={set} module={modul} set={set} teil={t.n} />
    </div>
  )
}
