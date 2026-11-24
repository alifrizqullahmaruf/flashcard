'use client'
import { useState } from 'react'
import { ChevronDown, TriangleAlert } from 'lucide-react'
import type { Category } from '@/lib/de/content'
import { cardStates, type CardState } from '@/lib/de/progress'
import { useProgress } from '@/lib/de/useProgress'
import { spoken } from '@/lib/de/speech-texts'

export const STATE_STYLE: Record<CardState, { label: string; color: string; hint: string }> = {
  baru: { label: 'Baru', color: '#E5E5E5', hint: 'belum pernah dipelajari' },
  belajar: { label: 'Belajar', color: '#A3A3A3', hint: 'sedang diulang berkala' },
  hafal: { label: 'Hafal', color: '#0A0A0A', hint: 'jarak ulang ≥ 21 hari' },
  sulit: { label: 'Sulit', color: '#B91C1C', hint: 'sering lupa (≥ 4×)' },
}
export const STATE_ORDER: CardState[] = ['hafal', 'belajar', 'sulit', 'baru']

/** Stacked bar baru/belajar/hafal/sulit. */
export function StateBar({ counts, total, h = 'h-2.5' }: { counts: Record<CardState, number>; total: number; h?: string }) {
  return (
    <div className={`${h === 'h-2.5' ? 'h-1' : h} rounded-pill bg-bg-soft overflow-hidden flex`}>
      {STATE_ORDER.filter((s) => s !== 'baru').map((s) =>
        counts[s] ? <div key={s} style={{ width: `${(counts[s] / total) * 100}%`, background: STATE_STYLE[s].color }} /> : null,
      )}
    </div>
  )
}

export default function CardStats({ level, cat }: { level: string; cat: Category }) {
  const states = useProgress(() => cardStates(level, cat.slug))
  const [open, setOpen] = useState(false)
  if (!states) return <div className="skeleton h-14 rounded-card" />

  const counts: Record<CardState, number> = { baru: 0, belajar: 0, hafal: 0, sulit: 0 }
  for (const s of Object.values(states)) counts[s]++
  const sulit = cat.words.filter((w) => states[w.de] === 'sulit')

  return (
    <div className="paper-card border-2 border-ink-faint rounded-card p-3 flex flex-col gap-2">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-3 text-left" aria-expanded={open}>
        <div className="flex-1 grid grid-cols-4 gap-1 text-center">
          {(['baru', 'belajar', 'hafal', 'sulit'] as CardState[]).map((s) => (
            <div key={s}>
              <p className={`text-lg font-semibold leading-none ${counts[s] ? (s === 'sulit' ? 'text-[#B91C1C]' : 'text-ink') : 'text-ink-faint'}`}>
                {counts[s]}
              </p>
              <p className="de-label mt-1">{STATE_STYLE[s].label}</p>
            </div>
          ))}
        </div>
        <ChevronDown size={18} strokeWidth={2.4} className={`text-ink-subtle transition ${open ? 'rotate-180' : ''}`} />
      </button>
      <StateBar counts={counts} total={cat.words.length} />
      {open && (
        <div className="text-xs text-ink-muted flex flex-col gap-1 pt-1">
          {(['baru', 'belajar', 'hafal', 'sulit'] as CardState[]).map((s) => (
            <p key={s} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-pill" style={{ background: STATE_STYLE[s].color }} />
              <b className="text-ink">{STATE_STYLE[s].label}</b>: {STATE_STYLE[s].hint}
            </p>
          ))}
        </div>
      )}
      {sulit.length > 0 && (
        <div className="rounded-card bg-coral-soft px-3 py-2 text-sm">
          <p className="font-extrabold text-coral-deep flex items-center gap-1.5">
            <TriangleAlert size={15} strokeWidth={2.6} />Kata sulit
          </p>
          <ul className="mt-1 flex flex-col gap-0.5">
            {sulit.map((w) => (
              <li key={w.de}>
                <b>{spoken(w)}</b> = {w.id}
                {w.hint && <span className="text-ink-muted"> · {w.hint}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
