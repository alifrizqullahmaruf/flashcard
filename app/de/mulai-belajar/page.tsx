'use client'
import { useState, useSyncExternalStore } from 'react'
import { ArrowLeft, ArrowRight, Briefcase, Check, GraduationCap, Heart, Plane } from 'lucide-react'
import { LEVELS, type LevelId } from '@/lib/de/content'
import { getProfile, saveProfile, type Goal } from '@/lib/de/progress'
import { Logo } from '@/components/de/Logo'

const GOALS: { id: Goal; label: string; hint: string; level: LevelId; Icon: typeof Heart }[] = [
  { id: 'keluarga', label: 'Ikut pasangan / keluarga', hint: 'Visa reuni keluarga biasanya butuh A1', level: 'a1', Icon: Heart },
  { id: 'kerja', label: 'Kerja / Ausbildung', hint: 'Umumnya B1, beberapa profesi B2', level: 'b1', Icon: Briefcase },
  { id: 'kuliah', label: 'Kuliah di Jerman', hint: 'Umumnya B2–C1', level: 'c1', Icon: GraduationCap },
  { id: 'hobi', label: 'Hobi / jalan-jalan', hint: 'A1–A2 sudah sangat membantu', level: 'a2', Icon: Plane },
]

const DAILY: { n: 5 | 10 | 20; label: string; hint: string }[] = [
  { n: 5, label: 'Santai', hint: '5 kata baru/hari · ±5 menit' },
  { n: 10, label: 'Normal', hint: '10 kata baru/hari · ±10 menit' },
  { n: 20, label: 'Intensif', hint: '20 kata baru/hari · ±20 menit' },
]

/** First-run setup: goal → target exam level → daily new words. Saved to the account (synced). */
export default function MulaiBelajarPage() {
  const existing = typeof window !== 'undefined' ? getProfile() : null
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState<Goal | null>(existing?.goal ?? null)
  const [level, setLevel] = useState<LevelId | null>(existing?.targetLevel ?? null)
  const [daily, setDaily] = useState<5 | 10 | 20>(existing?.dailyNew ?? 10)

  function pickGoal(g: (typeof GOALS)[number]) {
    setGoal(g.id)
    if (!level) setLevel(g.level)
    setStep(1)
  }

  function done() {
    if (!goal || !level) return
    saveProfile({ goal, targetLevel: level, dailyNew: daily })
    const next = new URLSearchParams(window.location.search).get('next') ?? '/de'
    window.location.replace(/^\/de(\/|$)/.test(next) && !next.startsWith('/de/mulai-belajar') ? next : '/de')
  }

  const suggested = GOALS.find((g) => g.id === goal)?.level
  // render only in the browser (the saved profile lives in localStorage)
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
  if (!isClient) return <div className="skeleton h-96 rounded-card-lg" />

  return (
    <div className="flex flex-col gap-6 min-h-[calc(100dvh-5rem)]">
      <header className="flex items-center justify-between">
        <Logo />
        <span className="de-label">Langkah {step + 1} dari 3</span>
      </header>
      <div className="h-1 rounded-pill bg-bg-soft overflow-hidden">
        <div className="h-full bg-ink transition-all duration-300" style={{ width: `${((step + 1) / 3) * 100}%` }} />
      </div>

      {step === 0 && (
        <section key="goal" className="slide-up flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight leading-tight">Untuk apa kamu belajar bahasa Jerman?</h1>
            <p className="text-ink-muted text-sm mt-1">Kami sesuaikan target level ujianmu.</p>
          </div>
          <div className="bg-surface border border-ink-faint rounded-card-lg divide-y divide-ink-faint overflow-hidden">
            {GOALS.map((g) => (
              <button key={g.id} onClick={() => pickGoal(g)} className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-bg-soft transition-colors">
                <g.Icon size={18} className="text-ink shrink-0" />
                <span className="flex-1">
                  <span className="block font-medium">{g.label}</span>
                  <span className="block text-[13px] text-ink-subtle">{g.hint}</span>
                </span>
                {goal === g.id && <Check size={18} className="text-ink" />}
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 1 && (
        <section key="level" className="slide-up flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight leading-tight">Target ujian Goethe-mu?</h1>
            <p className="text-ink-muted text-sm mt-1">
              Semua orang mulai dari A1. Targetmu menentukan sampai mana perjalananmu.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {LEVELS.map((lv) => {
              const active = level === lv.id
              return (
                <button
                  key={lv.id}
                  onClick={() => setLevel(lv.id)}
                  className={`h-16 rounded-card border flex flex-col items-center justify-center transition-colors ${
                    active ? 'bg-ink text-white border-ink' : 'bg-surface border-ink-faint'
                  }`}
                >
                  <span className="text-xl font-semibold tracking-tight">{lv.label}</span>
                  {suggested === lv.id && <span className={`text-[10px] uppercase tracking-[0.08em] ${active ? 'text-white/70' : 'text-ink-subtle'}`}>saran</span>}
                </button>
              )
            })}
          </div>
          {level && <p className="text-sm text-ink-muted">{LEVELS.find((l) => l.id === level)?.exam}</p>}
        </section>
      )}

      {step === 2 && (
        <section key="daily" className="slide-up flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight leading-tight">Berapa kata baru per hari?</h1>
            <p className="text-ink-muted text-sm mt-1">Ulangan kata lama dihitung terpisah. Bisa diubah kapan saja di Akun.</p>
          </div>
          <div className="bg-surface border border-ink-faint rounded-card-lg divide-y divide-ink-faint overflow-hidden">
            {DAILY.map((d) => (
              <button key={d.n} onClick={() => setDaily(d.n)} className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-bg-soft transition-colors">
                <span className="text-xl font-semibold tracking-tight w-8 tabular-nums">{d.n}</span>
                <span className="flex-1">
                  <span className="block font-medium">{d.label}</span>
                  <span className="block text-[13px] text-ink-subtle">{d.hint}</span>
                </span>
                {daily === d.n && <Check size={18} className="text-ink" />}
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="mt-auto flex gap-2">
        {step > 0 && (
          <button onClick={() => setStep((s) => s - 1)} className="h-12 px-4 rounded-btn bg-surface border border-ink-faint font-medium btn-press flex items-center gap-1.5">
            <ArrowLeft size={17} />Kembali
          </button>
        )}
        {step < 2 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={(step === 0 && !goal) || (step === 1 && !level)}
            className="flex-1 h-12 rounded-btn bg-ink text-white font-medium btn-press flex items-center justify-center gap-1.5 disabled:opacity-40"
          >
            Lanjut <ArrowRight size={17} />
          </button>
        ) : (
          <button onClick={done} className="flex-1 h-12 rounded-btn bg-ink text-white font-medium btn-press flex items-center justify-center gap-1.5">
            Mulai belajar <ArrowRight size={17} />
          </button>
        )}
      </div>
    </div>
  )
}
