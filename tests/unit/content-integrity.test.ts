import { describe, expect, it } from 'vitest'
import { CATEGORIES, LEVELS } from '@/lib/de/content'
import { PRACTICE } from '@/lib/de/exercises'
import { audioKey, lessonExamples, lessonSpeech, matchSpeakable, solution, spoken } from '@/lib/de/speech-texts'
import MANIFEST from '@/lib/de/audio-manifest.json'

const manifest = MANIFEST as Record<string, { tts: string }>

describe('vocabulary data', () => {
  for (const [level, cats] of Object.entries(CATEGORIES)) {
    const words = cats.flatMap((c) => c.words.map((w) => ({ c: c.slug, w })))
    if (!words.length) continue
    it(`${level}: no duplicate words`, () => {
      const keys = words.map(({ w }) => `${w.de}|${w.kind}`)
      expect(keys.length).toBe(new Set(keys).size)
    })
    it(`${level}: every noun has gender + plural, every word has meaning & example`, () => {
      for (const { c, w } of words) {
        const where = `${c}/${w.de}`
        expect(w.id, where).toBeTruthy()
        expect(w.example, where).toBeTruthy()
        expect(w.exampleId, where).toBeTruthy()
        if (w.kind === 'noun') {
          expect(['der', 'die', 'das'], where).toContain(w.gender)
          expect(w.plural, where).toBeTruthy()
        }
      }
    })
    it(`${level}: category slugs are unique`, () => {
      expect(new Set(cats.map((c) => c.slug)).size).toBe(cats.length)
    })
  }
})

describe('grammar practice data', () => {
  for (const [level, topics] of Object.entries(PRACTICE)) {
    for (const [slug, p] of Object.entries(topics)) {
      it(`${level}/${slug}: lesson exists and items are well-formed`, () => {
        const topic = LEVELS.find((l) => l.id === level)?.topics.find((t) => t.slug === slug)
        expect(topic?.body, 'practice without a lesson').toBeTruthy()
        const sections = new Set(p.sections.map((s) => s.id))
        for (const [i, ex] of p.items.entries()) {
          const where = `${slug}#${i}`
          expect(sections.has(ex.section), where).toBe(true)
          expect(ex.explain, where).toBeTruthy()
          if (ex.type === 'mcq') expect(ex.options, where).toContain(ex.answer)
          if (ex.type === 'gap') {
            expect(ex.sentence, where).toContain('___')
            expect(ex.answer.length, where).toBeGreaterThan(0)
          }
          if (ex.type === 'order') expect(ex.tokens.length, where).toBeGreaterThan(1)
          if (ex.type === 'match') expect(ex.pairs.length, where).toBeGreaterThan(1)
        }
        // every section is actually used
        for (const s of sections) expect(p.items.some((x) => x.section === s), `${slug}: empty section ${s}`).toBe(true)
      })
    }
  }
})

describe('audio manifest', () => {
  it('has a recording for every text the app reads aloud', () => {
    const needed = new Set<string>()
    for (const cats of Object.values(CATEGORIES)) for (const c of cats) for (const w of c.words) {
      needed.add(audioKey(spoken(w)))
      needed.add(audioKey(w.example))
    }
    for (const lv of LEVELS) for (const t of lv.topics) if (t.body) for (const [de] of lessonExamples(t.body)) needed.add(audioKey(lessonSpeech(de)))
    for (const topics of Object.values(PRACTICE)) for (const p of Object.values(topics)) for (const ex of p.items) {
      const s = solution(ex)
      if (s) needed.add(audioKey(s))
      if (ex.type === 'match') for (const [l] of ex.pairs) if (matchSpeakable(l)) needed.add(audioKey(l))
    }
    const missing = [...needed].filter((k) => !manifest[k])
    expect(missing, `run scripts/de-audio (collect + build) — missing ${missing.length}`).toEqual([])
  })
})
