// MVP-only progress, per device (localStorage). Real version → Firestore.
import { createEmptyCard, fsrs, Rating, TypeConvert, type Card as FsrsCard } from 'ts-fsrs'
import { CATEGORIES, LEVELS, type LevelId } from './content'
import { PRACTICE } from './exercises'

/**
 * enable_short_term: false → no minute-level learning steps.
 * "Belum hafal" comes back tomorrow, "Hafal" after a few days, then longer and longer.
 */
const scheduler = fsrs({ request_retention: 0.9, enable_short_term: false })

export const DAILY_NEW = 10 // default new words per day (profile can override: 5/10/20)
export const MASTERY_PCT = 80 // practice score for "Dikuasai"
const MATURE_DAYS = 21 // interval ≥ 21 days = "Hafal permanen"
const LEECH_LAPSES = 4 // forgotten ≥ 4× = "Kata sulit"

/* ── storage helpers ───────────────────────────────── */

export const PROGRESS_EVENT = 'de-progress'

function read<T>(k: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(k)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

/* ── sync bookkeeping (lib/de/sync.ts pushes these keys to the account) ── */

/** Keys that belong to the learner's account and are synced to Firestore. */
export const isSyncKey = (k: string) => /^de:(srs|gsrs|topic|new|known):/.test(k) || k === 'de:streak' || k === 'de:profile'
const DIRTY_KEY = 'de:dirty'

export function dirtyKeys(): string[] {
  return read<string[]>(DIRTY_KEY, [])
}
export function clearDirty(keys: string[]) {
  const done = new Set(keys)
  try {
    localStorage.setItem(DIRTY_KEY, JSON.stringify(dirtyKeys().filter((k) => !done.has(k))))
  } catch {
    /* ignore */
  }
}
export function markDirty(k: string) {
  if (!isSyncKey(k)) return
  const d = dirtyKeys()
  if (d.includes(k)) return
  try {
    localStorage.setItem(DIRTY_KEY, JSON.stringify([...d, k]))
  } catch {
    /* ignore */
  }
}

function write(k: string, v: unknown) {
  try {
    localStorage.setItem(k, JSON.stringify(v))
    markDirty(k)
    window.dispatchEvent(new Event(PROGRESS_EVENT))
  } catch {
    /* storage unavailable */
  }
}

/* ── learner profile (from onboarding) ─────────────── */

export type Goal = 'keluarga' | 'kerja' | 'kuliah' | 'hobi'
export type Profile = { goal: Goal; targetLevel: LevelId; dailyNew: 5 | 10 | 20; onboarded: true; updatedAt: number }
const PROFILE_KEY = 'de:profile'

export function getProfile(): Profile | null {
  return read<Profile | null>(PROFILE_KEY, null)
}
export function saveProfile(p: Omit<Profile, 'onboarded' | 'updatedAt'>) {
  write(PROFILE_KEY, { ...p, onboarded: true, updatedAt: Date.now() })
}
/** New words per day: from the profile, default 10. */
export function dailyNewTarget(): number {
  return getProfile()?.dailyNew ?? DAILY_NEW
}

/** Local calendar day, e.g. 2026-11-24 (not UTC). */
export const today = (d = new Date()) => d.toLocaleDateString('sv')

/* ── vocabulary cards (FSRS) ───────────────────────── */

const knownKey = (level: string, cat: string) => `de:known:${level}:${cat}`
const srsKey = (level: string, cat: string) => `de:srs:${level}:${cat}`
const newKey = (day: string) => `de:new:${day}`

export function getKnown(level: string, cat: string): string[] {
  return read<string[]>(knownKey(level, cat), [])
}

type SrsMap = Record<string, FsrsCard>

function getSrs(level: string, cat: string): SrsMap {
  const raw = read<Record<string, unknown>>(srsKey(level, cat), {})
  return Object.fromEntries(Object.entries(raw).map(([w, c]) => [w, TypeConvert.card(c as FsrsCard)]))
}

/** Record a review: good → Rating.Good ("Hafal"), else Rating.Again ("Belum hafal"). */
export function review(level: string, cat: string, word: string, good: boolean) {
  const map = getSrs(level, cat)
  const isNew = !map[word]
  const card = map[word] ?? createEmptyCard()
  map[word] = scheduler.next(card, new Date(), good ? Rating.Good : Rating.Again).card
  write(srsKey(level, cat), map)
  if (isNew) write(newKey(today()), newToday() + 1)

  const known = new Set(getKnown(level, cat))
  if (good) known.add(word)
  else known.delete(word)
  write(knownKey(level, cat), [...known])
}

export type CardState = 'baru' | 'belajar' | 'hafal' | 'sulit'

function stateOf(c: FsrsCard | undefined): CardState {
  if (!c) return 'baru'
  if (c.lapses >= LEECH_LAPSES) return 'sulit'
  if (c.scheduled_days >= MATURE_DAYS) return 'hafal'
  return 'belajar'
}

export function cardStates(level: string, cat: string): Record<string, CardState> {
  const map = getSrs(level, cat)
  const c = CATEGORIES[level as LevelId]?.find((x) => x.slug === cat)
  return Object.fromEntries((c?.words ?? []).map((w) => [w.de, stateOf(map[w.de])]))
}

export function countStates(level: string, cat: string) {
  const counts: Record<CardState, number> = { baru: 0, belajar: 0, hafal: 0, sulit: 0 }
  for (const s of Object.values(cardStates(level, cat))) counts[s]++
  return counts
}

/** Words whose FSRS review is due now. */
export function getDue(level: string, cat: string): string[] {
  const now = Date.now()
  return Object.entries(getSrs(level, cat))
    .filter(([, c]) => c.due.getTime() <= now)
    .map(([w]) => w)
}

/** Words scheduled in the future ("resting" until due). */
export function getResting(level: string, cat: string): Set<string> {
  const now = Date.now()
  return new Set(
    Object.entries(getSrs(level, cat))
      .filter(([, c]) => c.due.getTime() > now)
      .map(([w]) => w),
  )
}

export function hasSrs(level: string, cat: string, word: string) {
  return word in getSrs(level, cat)
}

export type CardRef = { level: LevelId; cat: string; word: string }

/** Due cards across every category, most overdue first. */
export function getDueAll(): CardRef[] {
  const now = Date.now()
  const out: (CardRef & { due: number })[] = []
  for (const [level, cats] of Object.entries(CATEGORIES) as [LevelId, typeof CATEGORIES.a1][]) {
    for (const c of cats) {
      for (const [word, card] of Object.entries(getSrs(level, c.slug))) {
        if (card.due.getTime() <= now) out.push({ level, cat: c.slug, word, due: card.due.getTime() })
      }
    }
  }
  return out.sort((a, b) => a.due - b.due).map(({ level, cat, word }) => ({ level, cat, word }))
}

/** Next unseen words in curriculum order (A1 first, category order). */
export function getNewWords(limit: number): CardRef[] {
  const out: CardRef[] = []
  for (const lv of LEVELS) {
    for (const c of CATEGORIES[lv.id]) {
      const srs = getSrs(lv.id, c.slug)
      for (const w of c.words) {
        if (out.length >= limit) return out
        if (!srs[w.de]) out.push({ level: lv.id, cat: c.slug, word: w.de })
      }
    }
  }
  return out
}

export function newToday(): number {
  return read<number>(newKey(today()), 0)
}

export function newLeftToday(): number {
  return Math.max(0, dailyNewTarget() - newToday())
}

export function nextDueLabel(level: string, cat: string): string | null {
  const dues = Object.values(getSrs(level, cat)).map((c) => c.due.getTime())
  if (!dues.length) return null
  return dueLabel(Math.min(...dues))
}

export function dueLabel(ts: number): string {
  const ms = ts - Date.now()
  if (ms <= 0) return 'sekarang'
  const min = Math.round(ms / 60000)
  if (min < 60) return `${min} menit lagi`
  const h = Math.round(min / 60)
  if (h < 24) return `${h} jam lagi`
  const d = Math.round(h / 24)
  return d === 1 ? 'besok' : `${d} hari lagi`
}

/* ── grammar topics ────────────────────────────────── */

export type TopicStatus = { read?: string; mastered?: string; best?: number }
const topicKey = (level: string, topic: string) => `de:topic:${level}:${topic}`

export function getTopicStatus(level: string, topic: string): TopicStatus {
  return read<TopicStatus>(topicKey(level, topic), {})
}

export type TopicStage = 'belum' | 'dibaca' | 'dikuasai'
export function topicStage(s: TopicStatus): TopicStage {
  return s.mastered ? 'dikuasai' : s.read ? 'dibaca' : 'belum'
}

export function markRead(level: string, topic: string) {
  const s = getTopicStatus(level, topic)
  write(topicKey(level, topic), { ...s, read: s.read ?? today() })
}

/** Full-practice score. ≥ 80% → Dikuasai (also counts as read). */
export function recordPracticeScore(level: string, topic: string, pct: number) {
  const s = getTopicStatus(level, topic)
  const next: TopicStatus = { ...s, best: Math.max(s.best ?? 0, pct), read: s.read ?? today() }
  if (pct >= MASTERY_PCT && !s.mastered) next.mastered = today()
  write(topicKey(level, topic), next)
}

/* ── grammar review (FSRS per exercise) ────────────── */

const gsrsKey = (level: string, topic: string) => `de:gsrs:${level}:${topic}`

function getGsrs(level: string, topic: string): Record<string, FsrsCard> {
  const raw = read<Record<string, unknown>>(gsrsKey(level, topic), {})
  return Object.fromEntries(Object.entries(raw).map(([i, c]) => [i, TypeConvert.card(c as FsrsCard)]))
}

export function reviewGrammar(level: string, topic: string, idx: number, good: boolean) {
  const map = getGsrs(level, topic)
  map[idx] = scheduler.next(map[idx] ?? createEmptyCard(), new Date(), good ? Rating.Good : Rating.Again).card
  write(gsrsKey(level, topic), map)
}

export type GrammarRef = { level: LevelId; topic: string; idx: number }

/** Due grammar exercises from topics the learner has read or mastered. */
export function getDueGrammar(limit: number): GrammarRef[] {
  const now = Date.now()
  const out: (GrammarRef & { due: number })[] = []
  for (const [level, topics] of Object.entries(PRACTICE) as [LevelId, Record<string, unknown>][]) {
    for (const topic of Object.keys(topics)) {
      if (topicStage(getTopicStatus(level, topic)) === 'belum') continue
      for (const [i, c] of Object.entries(getGsrs(level, topic))) {
        if (c.due.getTime() <= now) out.push({ level, topic, idx: Number(i), due: c.due.getTime() })
      }
    }
  }
  return out
    .sort((a, b) => a.due - b.due)
    .slice(0, limit)
    .map(({ level, topic, idx }) => ({ level, topic, idx }))
}

/* ── streak ────────────────────────────────────────── */

type Streak = { last: string; count: number }
const STREAK_KEY = 'de:streak'

/** Call when a study session is finished. */
export function bumpStreak() {
  const s = read<Streak | null>(STREAK_KEY, null)
  const t = today()
  if (s?.last === t) return
  const y = new Date()
  y.setDate(y.getDate() - 1)
  write(STREAK_KEY, { last: t, count: s?.last === today(y) ? s.count + 1 : 1 })
}

export function getStreak(): { count: number; doneToday: boolean } {
  const s = read<Streak | null>(STREAK_KEY, null)
  if (!s) return { count: 0, doneToday: false }
  const y = new Date()
  y.setDate(y.getDate() - 1)
  const alive = s.last === today() || s.last === today(y)
  return { count: alive ? s.count : 0, doneToday: s.last === today() }
}

/* ── level readiness ───────────────────────────────── */

export function levelReadiness(level: LevelId) {
  const lv = LEVELS.find((l) => l.id === level)!
  const ready = lv.topics.filter((t) => t.body)
  const mastered = ready.filter((t) => topicStage(getTopicStatus(level, t.slug)) === 'dikuasai').length
  let words = 0
  let hafal = 0
  for (const c of CATEGORIES[level]) {
    const st = countStates(level, c.slug)
    words += c.words.length
    hafal += st.hafal
  }
  const g = ready.length ? mastered / ready.length : 0
  const v = words ? hafal / words : 0
  return { pct: Math.round((g * 0.5 + v * 0.5) * 100), mastered, topics: ready.length, hafal, words }
}
