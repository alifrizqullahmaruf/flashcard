'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, ArrowLeft, Clock, PartyPopper, RotateCcw } from 'lucide-react'
import { ExamPart, type PartResult } from './ExamParts'
import { SET_LABEL, SETS, TEILE } from '@/lib/de/pruefung'
import { MODULE_MAX, MODULES, PASS_TOTAL, scale, verdict, type Points } from '@/lib/de/pruefung/score'
import { recordSimulation } from '@/lib/de/pruefung/store'
import type { ModuleId } from '@/lib/de/pruefung/types'

/** Raw maximum of each part in a simulation (Sprechen uses 1 topic and 3 request cards). */
export const SIM_MAX: Record<ModuleId, number[]> = {
  hoeren: [6, 4, 5],
  lesen: [5, 5, 5],
  schreiben: [5, 10],
  sprechen: [3, 6, 6],
}

type Phase = { kind: 'intro' } | { kind: 'part'; m: number; t: number } | { kind: 'break'; m: number } | { kind: 'rapor'; points: Points }

/** Seconds left until `deadline` (epoch ms), ticking once a second. */
function useCountdown(deadline: number | null) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (deadline == null) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [deadline])
  return deadline == null ? 0 : Math.max(0, Math.ceil((deadline - now) / 1000))
}

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

export default function ExamSimulation() {
  const [set, setSet] = useState<string>('s1')
  const [phase, setPhase] = useState<Phase>({ kind: 'intro' })
  const raw = useRef<Record<ModuleId, number[]>>({ hoeren: [], lesen: [], schreiben: [], sprechen: [] })
  const [moduleRun, setModuleRun] = useState(0)

  const [deadline, setDeadline] = useState<number | null>(null)
  const m = phase.kind === 'part' ? MODULES[phase.m] : null
  const left = useCountdown(phase.kind === 'part' ? deadline : null)
  const timeUp = phase.kind === 'part' && deadline != null && left === 0
  const beginModule = (mi: number) => {
    setDeadline(Date.now() + MODULES[mi].minutes * 60_000)
    setModuleRun((r) => r + 1)
    setPhase({ kind: 'part', m: mi, t: 0 })
  }

  useEffect(() => {
    if (phase.kind === 'part' || phase.kind === 'break') window.scrollTo({ top: 0 })
  }, [phase])

  function start() {
    raw.current = { hoeren: [], lesen: [], schreiben: [], sprechen: [] }
    beginModule(0)
  }

  function finishModule(mi: number) {
    setDeadline(null)
    if (mi + 1 < MODULES.length) return setPhase({ kind: 'break', m: mi })
    const points = Object.fromEntries(
      MODULES.map(({ id }) => {
        const got = SIM_MAX[id].reduce((n, _, i) => n + (raw.current[id][i] ?? 0), 0)
        return [id, scale(got, SIM_MAX[id].reduce((a, b) => a + b, 0))]
      }),
    ) as Points
    recordSimulation(set, points)
    setPhase({ kind: 'rapor', points })
  }

  function onPartDone(r: PartResult) {
    if (phase.kind !== 'part') return
    const id = MODULES[phase.m].id
    raw.current[id][phase.t] = r.raw
    // time is up → the remaining parts of this module score 0
    if (timeUp || phase.t + 1 >= TEILE[id].length) return finishModule(phase.m)
    setPhase({ kind: 'part', m: phase.m, t: phase.t + 1 })
  }

  if (phase.kind === 'intro')
    return (
      <div className="flex flex-col gap-5">
        <Link href="/de/ujian" className="text-sm font-extrabold text-ink-muted flex items-center gap-1 w-fit">
          <ArrowLeft size={16} strokeWidth={2.6} />
          Ujian
        </Link>
        <div>
          <p className="de-label">Simulation</p>
          <h1 className="text-[2rem] font-semibold tracking-tight leading-tight">Simulasi Start Deutsch 1</h1>
        </div>
        <div className="bg-surface border border-ink-faint rounded-card-lg divide-y divide-ink-faint">
          {MODULES.map((x) => (
            <div key={x.id} className="flex items-center gap-3 px-4 py-3 text-sm">
              <span className="flex-1 font-medium">{x.de}</span>
              <span className="text-ink-muted">{x.minutes} menit · 25 poin</span>
            </div>
          ))}
        </div>
        <ul className="text-sm text-ink-muted list-disc pl-5 flex flex-col gap-1">
          <li>Tidak ada umpan balik sampai rapor. Waktu habis = jawaban dikirim otomatis.</li>
          <li>Hören: audio diputar 2× (pengumuman 1×). Siapkan earphone.</li>
          <li>Schreiben & Sprechen dinilai sendiri dengan panduan penguji. Sprechen butuh mikrofon.</li>
          <li>Lulus jika total ≥ {PASS_TOTAL} dari 100.</li>
        </ul>
        <div className="flex gap-1.5">
          {SETS.map((s) => (
            <button key={s} onClick={() => setSet(s)} className={`text-[13px] font-extrabold px-3 py-1.5 rounded-pill transition ${s === set ? 'bg-ink text-white' : 'bg-bg-soft text-ink-muted'}`}>
              {SET_LABEL[s]}
            </button>
          ))}
        </div>
        <button onClick={start} className="h-12 rounded-btn bg-ink text-white font-extrabold btn-press">
          Mulai simulasi
        </button>
      </div>
    )

  if (phase.kind === 'break') {
    const next = MODULES[phase.m + 1]
    return (
      <div className="flex flex-col gap-5 items-center text-center pt-10">
        <p className="de-label">{MODULES[phase.m].de} selesai</p>
        <h1 className="text-2xl font-semibold">Berikutnya: {next.de}</h1>
        <p className="text-ink-muted">{next.minutes} menit. Tarik napas dulu.</p>
        <button
          onClick={() => beginModule(phase.m + 1)}
          className="h-12 px-8 rounded-btn bg-ink text-white font-extrabold btn-press"
        >
          Mulai {next.de}
        </button>
      </div>
    )
  }

  if (phase.kind === 'rapor') return <Rapor points={phase.points} onAgain={() => setPhase({ kind: 'intro' })} />

  const id = MODULES[phase.m].id
  const teil = TEILE[id][phase.t]
  return (
    <div className="flex flex-col gap-4">
      <div className="sticky top-0 z-10 -mx-4 px-4 py-2 bg-bg/95 backdrop-blur border-b border-ink-faint flex items-center gap-3">
        <div className="flex-1">
          <p className="text-xs font-bold text-ink-muted">
            {m!.de} · Teil {teil.n}/{TEILE[id].length}
          </p>
          <p className="font-semibold leading-tight">{teil.title}</p>
        </div>
        <span className={`flex items-center gap-1 font-mono font-bold ${left < 60 ? 'text-coral-deep' : ''}`}>
          <Clock size={16} />
          {mmss(left)}
        </span>
      </div>
      {timeUp && <p className="text-sm bg-coral-soft rounded-btn px-3 py-2">Waktu habis — jawabanmu dikirim.</p>}
      <ExamPart key={`${moduleRun}-${phase.m}-${phase.t}`} module={id} set={set} teil={teil.n} mode="simulasi" timeUp={timeUp} onDone={onPartDone} />
    </div>
  )
}

function Rapor({ points, onAgain }: { points: Points; onAgain: () => void }) {
  const v = verdict(points)
  const weakest = [...MODULES].sort((a, b) => points[a.id] - points[b.id])[0]
  return (
    <div className="flex flex-col gap-5">
      <div className="text-center flex flex-col items-center gap-2 pt-4">
        {v.passed ? <PartyPopper size={40} className="text-mint-deep" /> : <AlertTriangle size={40} className="text-coral-deep" />}
        <p className="de-label">Rapor simulasi</p>
        <p className="text-5xl font-semibold tracking-tight">{v.total}<span className="text-2xl text-ink-muted">/100</span></p>
        <p className={`font-bold ${v.passed ? 'text-mint-deep' : 'text-coral-deep'}`}>
          {v.passed ? `Bestanden · ${v.grade}` : `Belum lulus · butuh ${PASS_TOTAL - v.total} poin lagi`}
        </p>
      </div>
      <div className="bg-surface border border-ink-faint rounded-card-lg divide-y divide-ink-faint">
        {MODULES.map((m) => (
          <div key={m.id} className="px-4 py-3 flex flex-col gap-1.5">
            <div className="flex items-center text-sm">
              <span className="flex-1 font-medium">{m.de}</span>
              <span className="font-semibold">
                {points[m.id]}/{MODULE_MAX}
              </span>
            </div>
            <div className="h-1 rounded-pill bg-bg-soft overflow-hidden">
              <div className={`h-full ${points[m.id] >= 15 ? 'bg-mint' : 'bg-coral'}`} style={{ width: `${(points[m.id] / MODULE_MAX) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
      {v.writtenTooLow && (
        <p className="text-sm bg-coral-soft rounded-btn px-3 py-2">
          Bagian tertulis (Hören + Lesen + Schreiben) hanya <b>{v.written}</b> poin. Di bawah 35, nilai Sprechen sempurna pun tidak cukup untuk lulus. Fokus ke bagian tertulis dulu.
        </p>
      )}
      <Link href={`/de/ujian/${weakest.id}`} className="bg-surface border border-ink-faint rounded-card-lg px-4 py-3 text-sm">
        Modul terlemah: <b>{weakest.de}</b> ({points[weakest.id]}/25). Latih bagian-bagiannya →
      </Link>
      <div className="flex gap-2">
        <Link href="/de/ujian" className="flex-1 h-12 rounded-btn bg-surface border border-ink-faint font-medium flex items-center justify-center">
          Selesai
        </Link>
        <button onClick={onAgain} className="flex-1 h-12 rounded-btn bg-ink text-white font-medium btn-press flex items-center justify-center gap-1.5">
          <RotateCcw size={16} />
          Simulasi lagi
        </button>
      </div>
    </div>
  )
}
