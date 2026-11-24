/**
 * Scoring for Goethe A1 (Start Deutsch 1), following the official rules:
 *  - each module is worth 25 points, 100 in total; pass = 60 or more
 *  - written exam (Hören + Lesen + Schreiben) max 75; below 35, even a perfect
 *    Sprechen (25) cannot reach 60
 * Pure functions, no storage.
 */
import type { FormField, ModuleId, Nachricht } from './types'

export const MODULE_MAX = 25
export const PASS_TOTAL = 60
export const WRITTEN_MIN_USEFUL = PASS_TOTAL - MODULE_MAX // 35

export const MODULES: { id: ModuleId; label: string; de: string; minutes: number }[] = [
  { id: 'hoeren', label: 'Mendengar', de: 'Hören', minutes: 20 },
  { id: 'lesen', label: 'Membaca', de: 'Lesen', minutes: 25 },
  { id: 'schreiben', label: 'Menulis', de: 'Schreiben', minutes: 20 },
  { id: 'sprechen', label: 'Berbicara', de: 'Sprechen', minutes: 15 },
]

/** Raw points → module points out of 25, rounded to half points. */
export function scale(raw: number, rawMax: number): number {
  if (rawMax <= 0) return 0
  const v = (Math.max(0, Math.min(raw, rawMax)) / rawMax) * MODULE_MAX
  return Math.round(v * 2) / 2
}

export type Points = Record<ModuleId, number>

export function verdict(p: Points) {
  const written = p.hoeren + p.lesen + p.schreiben
  const total = written + p.sprechen
  return {
    total,
    written,
    passed: total >= PASS_TOTAL,
    /** written part so low that the oral exam cannot rescue it */
    writtenTooLow: written < WRITTEN_MIN_USEFUL,
    grade: grade(total),
  }
}

/** Official Goethe grade bands. */
export function grade(total: number): string {
  if (total >= 90) return 'sehr gut'
  if (total >= 80) return 'gut'
  if (total >= 70) return 'befriedigend'
  if (total >= 60) return 'ausreichend'
  return 'nicht bestanden'
}

/* ── Schreiben ─────────────────────────────────────── */

const squash = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim()
const noSpace = (s: string) => squash(s).replace(/[\s.]/g, '')

export function fieldCorrect(f: FormField, value: string): boolean {
  const v = squash(value)
  if (!v) return false
  return f.accept.some((a) => squash(a) === v || noSpace(a) === noSpace(v))
}

const GREETING = /^(liebe[rs]?|hallo|hi|sehr geehrte[rs]?|guten (tag|morgen|abend))\b/i
const CLOSING = /(viele|liebe|herzliche|beste|mit freundlichen)\s+grüße|\bgruß\b|bis (bald|dann|später)|tschüss|lg\b|vg\b/i

export function analyzeMessage(text: string, task: Nachricht) {
  const t = text.trim()
  const words = t ? t.split(/\s+/).length : 0
  const lower = t.toLowerCase()
  const firstLine = t.split('\n')[0] ?? ''
  return {
    words,
    hasGreeting: GREETING.test(firstLine.trim()),
    hasClosing: CLOSING.test(lower),
    cueHits: task.cues.map((cs) => cs.some((c) => lower.includes(c))) as [boolean, boolean, boolean],
  }
}

/** Self-assessment per content point: full = 3, half = 1.5, none = 0. */
export type PointRating = 'full' | 'half' | 'none'
export const POINT_VALUE: Record<PointRating, number> = { full: 3, half: 1.5, none: 0 }

/** Teil 2 = 10 raw points: 3 content points × 3 + 1 for form (greeting + closing). */
export function nachrichtPoints(ratings: PointRating[], hasGreeting: boolean, hasClosing: boolean): number {
  const content = ratings.reduce((n, r) => n + POINT_VALUE[r], 0)
  const form = (hasGreeting ? 0.5 : 0) + (hasClosing ? 0.5 : 0)
  return content + form
}

/* ── readiness (R4) ────────────────────────────────── */

/** Exam readiness = official vocabulary 30% + grammar 20% + best simulation 50%. */
export function examReadiness(vocabRatio: number, grammarRatio: number, bestSimTotal: number | null): number {
  const clamp = (x: number) => Math.max(0, Math.min(1, x))
  const sim = bestSimTotal == null ? 0 : clamp(bestSimTotal / 100)
  return Math.round(30 * clamp(vocabRatio) + 20 * clamp(grammarRatio) + 50 * sim)
}
