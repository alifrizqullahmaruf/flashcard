'use client'
import { useState } from 'react'
import { Lightbulb, Mic } from 'lucide-react'
import { GENDER_STYLE, type Word } from '@/lib/de/content'
import Speak, { audioFor } from '@/components/de/Speak'

export { spoken } from '@/lib/de/speech-texts'
import { spoken } from '@/lib/de/speech-texts'

export function haptic(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern)
  } catch {
    /* unsupported */
  }
}

/** Swiss-style metadata label, e.g. NOMEN · FEMININ */
const KIND_DE: Record<Word['kind'], string> = { noun: 'Nomen', verb: 'Verb', adj: 'Adjektiv', num: 'Zahl', other: 'Wort' }
const GENDER_DE = { der: 'Maskulin', die: 'Feminin', das: 'Neutrum' } as const

export function wordMeta(w: Word) {
  if (w.plural === 'Pl.') return `${KIND_DE[w.kind]} · Plural`
  return w.gender ? `${KIND_DE[w.kind]} · ${GENDER_DE[w.gender]}` : KIND_DE[w.kind]
}

export const genderColor = (w: Word) => (w.gender ? GENDER_STYLE[w.plural === 'Pl.' ? 'die' : w.gender].color : '#0A0A0A')

export function WordTitle({ w, size = 'text-5xl' }: { w: Word; size?: string }) {
  const g = w.gender ? GENDER_STYLE[w.gender] : null
  return (
    <p className={`de-word ${size} break-words`}>
      {g && <span style={{ color: g.color }}>{w.plural === 'Pl.' ? 'die' : w.gender} </span>}
      {w.de}
    </p>
  )
}

/** Front of a card: the German word, big and left-aligned, with a gender rule on the left. */
export function Front({ w, hint = true }: { w: Word; hint?: boolean }) {
  return (
    <div className="relative flex flex-col justify-between h-full p-6 pl-7 text-left">
      <span className="absolute left-0 top-6 bottom-6 w-[3px] rounded-r" style={{ background: genderColor(w) }} />
      <div className="flex items-start justify-between gap-2">
        <span className="de-label">{wordMeta(w)}</span>
        <Speak text={spoken(w)} withSlow size="sm" />
      </div>
      <WordTitle w={w} />
      <span className="text-xs text-ink-subtle">{hint ? 'Ketuk untuk melihat arti' : ' '}</span>
    </div>
  )
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[4.5rem_1fr] gap-3 py-2 border-t border-ink-faint items-baseline">
      <span className="de-label">{k}</span>
      <span className="text-[15px] text-ink">{children}</span>
    </div>
  )
}

/** Back of a card / word detail: Swiss grid of label → value. */
export function Details({ w }: { w: Word }) {
  const native = audioFor(spoken(w))?.native
  return (
    <div className="relative flex flex-col text-left pl-3">
      <span className="absolute left-[-0.25rem] top-1 bottom-1 w-[3px] rounded-r" style={{ background: genderColor(w) }} />
      <div className="flex items-start justify-between gap-2">
        <span className="de-label">{wordMeta(w)}</span>
        <Speak text={spoken(w)} withSlow size="sm" />
      </div>
      <div className="mt-2 mb-3">
        <WordTitle w={w} size="text-[2rem]" />
      </div>
      <Row k="Arti">
        <span className="font-semibold">{w.id}</span>
      </Row>
      {w.plural && (
        <Row k="Jamak">{w.plural === 'Pl.' ? 'hanya bentuk jamak' : w.plural === '–' ? 'jarang dipakai (tak terhitung)' : w.plural}</Row>
      )}
      {w.forms && <Row k="Bentuk">{w.forms}</Row>}
      <div className="py-2.5 border-t border-ink-faint flex items-start gap-2">
        <div className="flex-1">
          <p className="text-[15px] font-medium">{w.example}</p>
          <p className="text-sm text-ink-muted">{w.exampleId}</p>
        </div>
        <Speak text={w.example} size="sm" />
      </div>
      {w.hint && <Hint text={w.hint} />}
      {native && (
        <p className="de-label flex items-center gap-1 mt-1">
          <Mic size={11} strokeWidth={2} />Rekaman penutur asli
        </p>
      )}
    </div>
  )
}

export function Hint({ text }: { text: string }) {
  return (
    <p className="text-sm border-t border-ink-faint pt-2.5 pb-1 text-ink-muted flex gap-2 items-start text-left">
      <Lightbulb size={15} className="shrink-0 mt-0.5 text-ink-subtle" strokeWidth={2} />
      <span>{text}</span>
    </p>
  )
}

/** Round icon badge used on result screens. */
export function IconBadge({ children, bg = '#F4F4F5', color = '#0A0A0A' }: { children: React.ReactNode; bg?: string; color?: string }) {
  return (
    <span className="w-14 h-14 rounded-pill flex items-center justify-center [&_svg]:stroke-[1.75]" style={{ background: bg, color }}>
      {children}
    </span>
  )
}

// calm confetti: neutrals + the three gender colours
const COLORS = ['#0A0A0A', '#2563EB', '#DC2626', '#059669', '#D4D4D4']

export function Confetti() {
  const [pieces] = useState(
    () =>
      Array.from({ length: 48 }, (_, i) => ({
        left: Math.random() * 100,
        color: COLORS[i % COLORS.length],
        dx: `${(Math.random() - 0.5) * 160}px`,
        rot: `${Math.random() * 720 - 360}deg`,
        dur: `${1.8 + Math.random() * 1.4}s`,
        delay: `${Math.random() * 0.4}s`,
      })),
    
  )
  return (
    <>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={
            {
              left: `${p.left}vw`,
              background: p.color,
              animationDelay: p.delay,
              '--dx': p.dx,
              '--rot': p.rot,
              '--dur': p.dur,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  )
}

/**
 * Answer feedback pinned to the bottom of the screen (Duolingo-style), so
 * "Lanjut" is always reachable on short phones. A spacer keeps the question
 * scrollable above it.
 */
export function BottomSheet({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <>
      <div className="h-60" aria-hidden />
      <div className="fixed inset-x-0 bottom-0 z-40 px-3" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
        <div
          className={`sheet-up mx-auto max-w-md max-h-[70dvh] overflow-y-auto rounded-card-lg p-4 flex flex-col gap-3 border ${
            ok ? 'border-[#BBF7D0]' : 'border-[#FECACA]'
          }`}
          style={
            {
              background: ok ? '#F0FDF4' : '#FEF2F2',
              boxShadow: '0 -4px 24px -8px rgba(0,0,0,0.12)',
              // inside the sheet, "primary" becomes the status colour (green / red)
              '--color-mint': ok ? '#15803D' : '#B91C1C',
              '--color-mint-deep': ok ? '#15803D' : '#B91C1C',
              '--color-coral': '#B91C1C',
            } as React.CSSProperties
          }
        >
          {children}
        </div>
      </div>
    </>
  )
}
