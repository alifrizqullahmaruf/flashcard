/** Exam practice results (synced with the account as `de:exam:a1`). */
import { readKey, writeKey } from '../progress'
import type { ModuleId } from './types'
import { verdict, type Points } from './score'

export interface SimResult {
  id: string // ISO timestamp of completion
  set: string
  points: Points
  total: number
}
export interface ExamState {
  practice: Record<string, { best: number; at: string }> // key `${module}:${set}:${teil}` → best %
  sims: SimResult[] // newest first
}

const KEY = 'de:exam:a1'
const EMPTY: ExamState = { practice: {}, sims: [] }

export function getExam(): ExamState {
  const s = readKey<ExamState>(KEY, EMPTY)
  return { practice: s.practice ?? {}, sims: s.sims ?? [] }
}

export const practiceKey = (m: ModuleId, set: string, teil: number) => `${m}:${set}:${teil}`

export function recordPractice(m: ModuleId, set: string, teil: number, pct: number) {
  const s = getExam()
  const k = practiceKey(m, set, teil)
  const prev = s.practice[k]
  if (prev && prev.best >= pct) return
  writeKey(KEY, { ...s, practice: { ...s.practice, [k]: { best: Math.round(pct), at: new Date().toISOString() } } })
}

export function recordSimulation(set: string, points: Points): SimResult {
  const s = getExam()
  const r: SimResult = { id: new Date().toISOString(), set, points, total: verdict(points).total }
  writeKey(KEY, { ...s, sims: [r, ...s.sims].slice(0, 30) })
  return r
}

export function bestSimulation(s: ExamState = getExam()): SimResult | null {
  return s.sims.reduce<SimResult | null>((best, x) => (!best || x.total > best.total ? x : best), null)
}

/** Best module score across all simulations (out of 25), null if never simulated. */
export function bestModule(m: ModuleId, s: ExamState = getExam()): number | null {
  return s.sims.length ? Math.max(...s.sims.map((x) => x.points[m])) : null
}

/** Best practice % for a module across its parts and sets. */
export function practiceBest(m: ModuleId, s: ExamState = getExam()): number | null {
  const v = Object.entries(s.practice).filter(([k]) => k.startsWith(`${m}:`)).map(([, x]) => x.best)
  return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : null
}
