'use client'
import Link from 'next/link'
import { ChevronRight, Timer } from 'lucide-react'
import { levelReadiness } from '@/lib/de/progress'
import { useProgress } from '@/lib/de/useProgress'
import { examReadiness, MODULES, PASS_TOTAL, verdict } from '@/lib/de/pruefung/score'
import { bestModule, bestSimulation, getExam, practiceBest } from '@/lib/de/pruefung/store'

export default function UjianPage() {
  const data = useProgress(() => {
    const r = levelReadiness('a1')
    const exam = getExam()
    const best = bestSimulation(exam)
    return {
      r,
      best,
      sims: exam.sims.slice(0, 5),
      modules: MODULES.map((m) => ({ ...m, sim: bestModule(m.id, exam), practice: practiceBest(m.id, exam) })),
      pct: examReadiness(r.words ? r.hafal / r.words : 0, r.topics ? r.mastered / r.topics : 0, best?.total ?? null),
    }
  })
  if (!data) return <div className="skeleton h-96 rounded-card-lg" />
  const { r, best } = data

  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="de-label">Prüfung</p>
        <h1 className="text-[2rem] font-semibold tracking-tight leading-tight">Ujian A1</h1>
        <p className="text-ink-muted mt-1">Goethe-Zertifikat A1: Start Deutsch 1</p>
      </header>

      <div className="bg-surface border border-ink-faint rounded-card-lg p-5 flex flex-col gap-4">
        <div>
          <p className="de-label">Siap ujian</p>
          <p className="text-5xl font-semibold tracking-tight leading-none mt-2">{data.pct}%</p>
        </div>
        <div className="h-1 rounded-pill bg-bg-soft overflow-hidden">
          <div className="h-full bg-ink transition-all" style={{ width: `${data.pct}%` }} />
        </div>
        <div className="grid grid-cols-3 divide-x divide-ink-faint border-t border-ink-faint pt-3 text-sm">
          <div className="pr-2">
            <p className="text-lg font-semibold">{r.hafal}/{r.words}</p>
            <p className="text-[11px] text-ink-muted">kata resmi hafal (30%)</p>
          </div>
          <div className="px-2">
            <p className="text-lg font-semibold">{r.mastered}/{r.topics}</p>
            <p className="text-[11px] text-ink-muted">grammar dikuasai (20%)</p>
          </div>
          <div className="pl-2">
            <p className="text-lg font-semibold">{best ? `${best.total}` : '–'}</p>
            <p className="text-[11px] text-ink-muted">simulasi terbaik /100 (50%)</p>
          </div>
        </div>
      </div>

      <Link href="/de/ujian/simulasi" className="rounded-card-lg bg-ink text-white p-5 flex items-center gap-4 btn-press">
        <Timer size={28} strokeWidth={1.6} />
        <div className="flex-1">
          <p className="font-semibold text-lg leading-tight">Simulasi ujian lengkap</p>
          <p className="text-sm opacity-80">4 modul · ±80 menit · lulus ≥ {PASS_TOTAL} poin</p>
        </div>
        <ChevronRight size={20} />
      </Link>

      <section className="flex flex-col gap-2">
        <p className="de-label">Latihan per modul</p>
        <div className="bg-surface border border-ink-faint rounded-card-lg divide-y divide-ink-faint overflow-hidden">
          {data.modules.map((m) => (
            <Link key={m.id} href={`/de/ujian/${m.id}`} className="flex items-center gap-3 px-4 py-3 active:bg-bg-soft transition-colors">
              <div className="flex-1 min-w-0">
                <p className="font-medium leading-tight">{m.de}</p>
                <p className="text-[13px] text-ink-subtle">
                  {m.label} · latihan {m.practice == null ? '–' : `${m.practice}%`}
                </p>
              </div>
              <span className="text-sm font-semibold">{m.sim == null ? '–' : `${m.sim}/25`}</span>
              <ChevronRight className="text-ink-subtle" size={18} />
            </Link>
          ))}
        </div>
        <p className="text-[11px] text-ink-subtle">Angka kanan = skor terbaik modul itu di simulasi.</p>
      </section>

      {data.sims.length > 0 && (
        <section className="flex flex-col gap-2">
          <p className="de-label">Riwayat simulasi</p>
          <div className="bg-surface border border-ink-faint rounded-card-lg divide-y divide-ink-faint overflow-hidden">
            {data.sims.map((s) => {
              const v = verdict(s.points)
              return (
                <div key={s.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                  <span className="flex-1">{new Date(s.id).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span className={`font-bold ${v.passed ? 'text-mint-deep' : 'text-coral-deep'}`}>{v.passed ? 'Lulus' : 'Belum lulus'}</span>
                  <span className="font-semibold w-14 text-right">{s.total}/100</span>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
