import { describe, expect, it } from 'vitest'
import { CATEGORIES, type Word } from '@/lib/de/content'
import { buildPool, cloze, diffSentence, makeSession, todaysKind } from '@/lib/de/context'

const all = CATEGORIES.a1.flatMap((c) => c.words)
const word = (de: string) => all.find((w) => w.de === de) as Word

describe('cloze (kalimat rumpang)', () => {
  it('blanks the exact form used in the sentence', () => {
    expect(cloze(word('Vater'))).toEqual({ before: 'Mein ', answer: 'Vater', after: ' kocht gern.' })
    expect(cloze(word('kochen'))?.answer).toBe('koche') // conjugated form
  })
  it('rebuilds the original sentence exactly', () => {
    for (const w of all) {
      const c = cloze(w)
      if (c) expect(c.before + c.answer + c.after).toBe(w.example)
    }
  })
  it('skips multi-word expressions', () => {
    expect(cloze(word('Guten Tag'))).toBeNull()
  })
  it('covers most A1 example sentences', () => {
    const covered = all.filter((w) => cloze(w)).length
    expect(covered / all.length).toBeGreaterThan(0.9)
  })
})

describe('diffSentence (dikte)', () => {
  const t = 'Meine Familie wohnt in Bandung.'
  it('perfect answer, ignoring case and punctuation', () => {
    expect(diffSentence(t, 'meine familie wohnt in bandung').score).toBe(1)
  })
  it('accepts ae/oe/ue/ss for umlauts', () => {
    expect(diffSentence('Die Tür ist groß.', 'die Tuer ist gross').score).toBe(1)
  })
  it('marks wrong and missing words', () => {
    const r = diffSentence(t, 'Meine Famile wohnt Bandung')
    expect(r.tokens.map((x) => x.status)).toEqual(['ok', 'wrong', 'ok', 'missing', 'ok'])
    expect(r.tokens[1].typed).toBe('Famile')
    expect(r.score).toBeCloseTo(0.6)
  })
  it('empty answer scores 0', () => {
    expect(diffSentence(t, '').score).toBe(0)
  })
})

describe('session building', () => {
  it('uses only studied words', () => {
    const pool = buildPool((level, cat) => new Set(level === 'a1' && cat === 'familie' ? ['Vater', 'Mutter', 'Kind'] : []))
    expect(pool.map((p) => p.w.de).sort()).toEqual(['Kind', 'Mutter', 'Vater'])
    const s = makeSession(pool, 'cloze', 10)
    expect(s.length).toBe(3)
    expect(s.every((x) => x.kind === 'cloze')).toBe(true)
  })
  it('alternates the daily type', () => {
    expect(todaysKind(new Date('2026-11-23T10:00:00'))).toBe('cloze') // Monday
    expect(todaysKind(new Date('2026-11-24T10:00:00'))).toBe('dikte') // Tuesday
  })
})
