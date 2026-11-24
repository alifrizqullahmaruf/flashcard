/** Which Klar words belong to the official Goethe exam vocabulary (A1 for now). */
import type { LevelId, Word } from './content'
import { GOETHE_A1_GROUPS, GOETHE_A1_WORDS } from './wortliste-a1'

const norm = (s: string) => s.toLowerCase().replace(/[!?.]/g, '').replace(/\s+/g, ' ').trim()

/** Klar spelling → spelling used in the official list. */
const ALIAS: Record<string, string> = {
  'auf wiedersehen': 'wiedersehen',
  wehtun: 'weh tun',
  'auf wiederhören': 'wiederhören',
  jeder: 'jed',
  alle: 'all',
  andere: 'ander',
  welcher: 'welch',
  dieser: 'dies',
  letzte: 'letzt',
  nächste: 'nächst',
  'am besten': 'best',
  'lieblings-': 'lieblings',
  meistens: 'meist',
  'ein bisschen': 'bisschen',
}

const OFFICIAL: Partial<Record<LevelId, Set<string>>> = {
  a1: new Set([...GOETHE_A1_WORDS, ...GOETHE_A1_GROUPS].map(norm)),
}

export function isOfficial(level: LevelId, w: Word): boolean {
  const set = OFFICIAL[level]
  if (!set) return true // no official list for this level yet → treat all as core
  const k = norm(w.de)
  return set.has(k) || set.has(ALIAS[k] ?? '')
}

/** Share of the official alphabetical list that Klar covers (0–1). */
export function officialCoverage(level: LevelId, words: Word[]): { covered: number; total: number; missing: string[] } {
  if (level !== 'a1') return { covered: 0, total: 0, missing: [] }
  const ours = new Set(words.map((w) => ALIAS[norm(w.de)] ?? norm(w.de)))
  const list = [...new Set(GOETHE_A1_WORDS.map(norm))]
  const missing = list.filter((x) => !ours.has(x))
  return { covered: list.length - missing.length, total: list.length, missing }
}
