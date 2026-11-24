// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { CATEGORIES } from '@/lib/de/content'
import { isOfficial, officialCoverage } from '@/lib/de/official'
import { getNewWords, levelReadiness } from '@/lib/de/progress'
import { GOETHE_A1_WORDS } from '@/lib/de/wortliste-a1'

const a1 = CATEGORIES.a1.flatMap((c) => c.words)
const find = (de: string) => a1.find((w) => w.de === de)!

beforeEach(() => localStorage.clear())

describe('official Goethe A1 list', () => {
  it('Klar covers at least 95% of the official headwords', () => {
    const r = officialCoverage('a1', a1)
    expect(r.total).toBe(new Set(GOETHE_A1_WORDS.map((w) => w.toLowerCase())).size)
    expect(r.covered / r.total, `missing: ${r.missing.join(', ')}`).toBeGreaterThanOrEqual(0.95)
  })

  it('recognises official words, including spelling aliases', () => {
    expect(isOfficial('a1', find('Bahnhof'))).toBe(true)
    expect(isOfficial('a1', find('Auf Wiedersehen'))).toBe(true) // → wiedersehen
    expect(isOfficial('a1', find('jeder'))).toBe(true) // → jed
    expect(isOfficial('a1', find('Halbpension'))).toBe(true)
  })

  it('levels without an official list treat every word as core', () => {
    expect(isOfficial('b1', { de: 'irgendwas', id: '', kind: 'other', example: '', exampleId: '' })).toBe(true)
  })
})

describe('official words are taught first', () => {
  it('a fresh learner only gets official words while any are left', () => {
    const first = getNewWords(40)
    expect(first).toHaveLength(40)
    for (const ref of first) {
      const w = CATEGORIES.a1.find((c) => c.slug === ref.cat)!.words.find((x) => x.de === ref.word)!
      expect(isOfficial('a1', w), ref.word).toBe(true)
    }
  })

  it('exam readiness counts only official words', () => {
    const officialCount = a1.filter((w) => isOfficial('a1', w)).length
    expect(levelReadiness('a1').words).toBe(officialCount)
    expect(officialCount).toBeLessThanOrEqual(a1.length)
  })
})
