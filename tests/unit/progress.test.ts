// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  bumpStreak,
  cardStates,
  dailyNewTarget,
  dirtyKeys,
  getStreak,
  getTopicStatus,
  isSyncKey,
  newLeftToday,
  recordPracticeScore,
  review,
  saveProfile,
  topicStage,
} from '@/lib/de/progress'

const srs = () => JSON.parse(localStorage.getItem('de:srs:a1:familie') ?? '{}')

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-11-24T09:00:00'))
})
afterEach(() => vi.useRealTimers())

describe('review grades (FSRS)', () => {
  it('Lupa comes back tomorrow, Sulit sooner than Hafal', () => {
    review('a1', 'familie', 'Vater', 'lupa')
    review('a1', 'familie', 'Mutter', 'sulit')
    review('a1', 'familie', 'Kind', 'hafal')
    const s = srs()
    expect(s.Vater.scheduled_days).toBe(1)
    expect(s.Mutter.scheduled_days).toBeLessThan(s.Kind.scheduled_days)
    expect(s.Kind.scheduled_days).toBeGreaterThanOrEqual(2)
  })
  it('boolean callers still work (true = hafal, false = lupa)', () => {
    review('a1', 'familie', 'Vater', true)
    review('a1', 'familie', 'Mutter', false)
    expect(srs().Vater.scheduled_days).toBeGreaterThan(srs().Mutter.scheduled_days)
  })
  it('card states: baru → belajar', () => {
    expect(cardStates('a1', 'familie').Vater).toBe('baru')
    review('a1', 'familie', 'Vater', 'hafal')
    expect(cardStates('a1', 'familie').Vater).toBe('belajar')
  })
  it('counts new words per day against the profile target', () => {
    expect(dailyNewTarget()).toBe(10)
    saveProfile({ goal: 'kerja', targetLevel: 'b1', dailyNew: 5 })
    review('a1', 'familie', 'Vater', 'hafal')
    review('a1', 'familie', 'Mutter', 'hafal')
    review('a1', 'familie', 'Mutter', 'hafal') // same word again: not new
    expect(newLeftToday()).toBe(3)
  })
})

describe('topics', () => {
  it('read → mastered at ≥ 80 %', () => {
    recordPracticeScore('a1', 'artikel', 70)
    expect(topicStage(getTopicStatus('a1', 'artikel'))).toBe('dibaca')
    recordPracticeScore('a1', 'artikel', 85)
    const s = getTopicStatus('a1', 'artikel')
    expect(topicStage(s)).toBe('dikuasai')
    expect(s.best).toBe(85)
  })
})

describe('streak', () => {
  it('counts consecutive days and resets after a gap', () => {
    bumpStreak()
    vi.setSystemTime(new Date('2026-11-25T09:00:00'))
    bumpStreak()
    bumpStreak() // same day: no double count
    expect(getStreak()).toEqual({ count: 2, doneToday: true })
    vi.setSystemTime(new Date('2026-11-28T09:00:00'))
    expect(getStreak().count).toBe(0)
    bumpStreak()
    expect(getStreak().count).toBe(1)
  })
})

describe('sync bookkeeping', () => {
  it('only learner data is synced', () => {
    expect(isSyncKey('de:srs:a1:familie')).toBe(true)
    expect(isSyncKey('de:profile')).toBe(true)
    expect(isSyncKey('de:card-mode')).toBe(false)
    expect(isSyncKey('de:dirty')).toBe(false)
  })
  it('writes mark keys dirty for the next push', () => {
    review('a1', 'familie', 'Vater', 'hafal')
    expect(dirtyKeys()).toEqual(expect.arrayContaining(['de:srs:a1:familie', 'de:known:a1:familie']))
  })
})
