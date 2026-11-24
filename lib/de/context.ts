/**
 * "Latihan konteks": exercises generated from the example sentences that every
 * word already has (no extra content needed).
 *  - cloze  (kalimat rumpang): the word's form in the sentence is blanked out
 *  - dikte  (dictation): hear the sentence, type it, word-by-word correction
 * Only words the learner has already studied are used.
 */
import { CATEGORIES, type LevelId, type Word } from './content'

export type CtxRef = { level: LevelId; cat: string; w: Word }
export type ClozeItem = CtxRef & { kind: 'cloze'; before: string; answer: string; after: string }
export type DikteItem = CtxRef & { kind: 'dikte'; sentence: string }
export type CtxItem = ClozeItem | DikteItem
export type CtxKind = CtxItem['kind']

export const fold = (s: string) =>
  s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')

const strip = (t: string) => t.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')

/** Find the token in the example sentence that is a form of the word (Kind, Kinder, kocht …). */
export function cloze(w: Word): { before: string; answer: string; after: string } | null {
  if (/\s/.test(w.de)) return null // multi-word expressions are not blanked
  const tokens = w.example.split(/(\s+)/) // keep whitespace so the sentence can be rebuilt exactly
  const lemma = fold(w.de)
  const stem = lemma.slice(0, Math.max(3, Math.min(lemma.length, lemma.length - 2)))
  for (let i = 0; i < tokens.length; i++) {
    const core = strip(tokens[i])
    if (!core) continue
    const f = fold(core)
    if (f === lemma || (f.startsWith(stem) && f.length <= lemma.length + 4)) {
      const start = tokens[i].indexOf(core)
      const before = tokens.slice(0, i).join('') + tokens[i].slice(0, start)
      const after = tokens[i].slice(start + core.length) + tokens.slice(i + 1).join('')
      return { before, answer: core, after }
    }
  }
  return null
}

/** Studied words (have an FSRS card) across all levels. `studied(level, cat)` returns the word keys. */
export function buildPool(studied: (level: LevelId, cat: string) => Set<string>): CtxRef[] {
  const out: CtxRef[] = []
  for (const [level, cats] of Object.entries(CATEGORIES) as [LevelId, (typeof CATEGORIES)['a1']][]) {
    for (const c of cats) {
      const known = studied(level, c.slug)
      for (const w of c.words) if (known.has(w.de)) out.push({ level, cat: c.slug, w })
    }
  }
  return out
}

/** Pick up to n exercises of one kind (random order; called from an event handler). */
export function makeSession(pool: CtxRef[], kind: CtxKind, n = 10): CtxItem[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  const out: CtxItem[] = []
  for (const r of shuffled) {
    if (out.length >= n) break
    if (kind === 'cloze') {
      const c = cloze(r.w)
      if (c) out.push({ ...r, kind: 'cloze', ...c })
    } else if (r.w.example.split(/\s+/).length >= 3) {
      out.push({ ...r, kind: 'dikte', sentence: r.w.example })
    }
  }
  return out
}

/** Today's practice type: alternates by weekday (Sun/Tue/Thu/Sat → dikte). */
export function todaysKind(d = new Date()): CtxKind {
  return d.getDay() % 2 === 0 ? 'dikte' : 'cloze'
}

/* ── dictation diff (word level, LCS) ─────────────────── */

export type DiffToken = { text: string; status: 'ok' | 'missing' | 'wrong'; typed?: string }

const words = (s: string) => s.split(/\s+/).map(strip).filter(Boolean)

/** Compare typed text with the target sentence; case/umlaut-insensitive, punctuation ignored. */
export function diffSentence(target: string, typed: string): { tokens: DiffToken[]; score: number } {
  const a = words(target)
  const b = words(typed)
  const fa = a.map(fold)
  const fb = b.map(fold)
  const n = a.length
  const m = b.length
  const dp = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0))
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = fa[i] === fb[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
  const tokens: DiffToken[] = []
  let i = 0
  let j = 0
  while (i < n) {
    if (j < m && fa[i] === fb[j]) {
      tokens.push({ text: a[i], status: 'ok' })
      i++
      j++
    } else if (j < m && dp[i + 1][j + 1] === dp[i][j] - 0 && dp[i][j + 1] <= dp[i + 1][j] && dp[i + 1][j] === dp[i + 1][j + 1]) {
      // substitution: typed a different word in this position
      tokens.push({ text: a[i], status: 'wrong', typed: b[j] })
      i++
      j++
    } else if (j < m && dp[i][j + 1] >= dp[i + 1][j]) {
      j++ // extra typed word
    } else {
      tokens.push({ text: a[i], status: 'missing' })
      i++
    }
  }
  const ok = tokens.filter((t) => t.status === 'ok').length
  return { tokens, score: n ? ok / n : 0 }
}
