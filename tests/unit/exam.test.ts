import { describe, expect, it } from 'vitest'
import EXAM_AUDIO from '@/lib/de/exam-audio.json'
import { HOEREN, LESEN, listeningClips, SCHREIBEN, SPRECHEN, speakingClips, TEILE } from '@/lib/de/pruefung'
import {
  analyzeMessage,
  examReadiness,
  fieldCorrect,
  grade,
  nachrichtPoints,
  scale,
  verdict,
} from '@/lib/de/pruefung/score'
import { SIM_MAX } from '@/components/de/exam/ExamSimulation'
import { mergeValue } from '@/lib/de/sync'
import type { ExamState } from '@/lib/de/pruefung/store'

describe('scoring (official Start Deutsch 1 rules)', () => {
  it('scales raw points to 25 per module, in half points', () => {
    expect(scale(15, 15)).toBe(25)
    expect(scale(9, 15)).toBe(15)
    expect(scale(7, 15)).toBe(11.5) // 11.67 → 11.5
    expect(scale(20, 15)).toBe(25) // clamped
    expect(scale(3, 0)).toBe(0)
  })

  it('passes at 60 of 100 and flags a written part below 35', () => {
    expect(verdict({ hoeren: 15, lesen: 15, schreiben: 15, sprechen: 15 })).toMatchObject({ total: 60, passed: true, writtenTooLow: false })
    expect(verdict({ hoeren: 10, lesen: 12, schreiben: 12, sprechen: 25 })).toMatchObject({ total: 59, passed: false, writtenTooLow: true })
  })

  it('uses the Goethe grade bands', () => {
    expect([grade(95), grade(85), grade(72), grade(60), grade(59.5)]).toEqual(['sehr gut', 'gut', 'befriedigend', 'ausreichend', 'nicht bestanden'])
  })

  it('accepts form answers regardless of case, spacing and dots', () => {
    const f = { label: 'Telefon', accept: ['0176 55 23 98'] }
    expect(fieldCorrect(f, '0176552398')).toBe(true)
    expect(fieldCorrect(f, ' 0176 55 23 98 ')).toBe(true)
    expect(fieldCorrect(f, '0176 55 23 99')).toBe(false)
    expect(fieldCorrect({ label: 'x', accept: ['verheiratet'] }, 'Verheiratet')).toBe(true)
    expect(fieldCorrect({ label: 'x', accept: ['12. Mai'] }, '')).toBe(false)
  })

  it('checks a short message for words, greeting, closing and the three points', () => {
    const task = SCHREIBEN[0].teil2
    const a = analyzeMessage(task.model, task)
    expect(a.hasGreeting && a.hasClosing).toBe(true)
    expect(a.cueHits).toEqual([true, true, true])
    expect(a.words).toBeGreaterThanOrEqual(25)
    expect(analyzeMessage('ich komme nicht', task)).toMatchObject({ hasGreeting: false, hasClosing: false })
  })

  it('message points: 3 / 1.5 / 0 per point + 1 for greeting & closing', () => {
    expect(nachrichtPoints(['full', 'full', 'full'], true, true)).toBe(10)
    expect(nachrichtPoints(['full', 'half', 'none'], true, false)).toBe(5)
  })

  it('readiness = vocabulary 30% + grammar 20% + best simulation 50%', () => {
    expect(examReadiness(0, 0, null)).toBe(0)
    expect(examReadiness(1, 1, 100)).toBe(100)
    expect(examReadiness(0.5, 0.5, 60)).toBe(55)
  })
})

describe('exam content follows the official format', () => {
  it('every set has the official number of items per part', () => {
    for (const s of LESEN) {
      expect(s.teil1.reduce((n, t) => n + t.items.length, 0), s.id).toBe(SIM_MAX.lesen[0])
      expect(s.teil2, s.id).toHaveLength(SIM_MAX.lesen[1])
      expect(s.teil3, s.id).toHaveLength(SIM_MAX.lesen[2])
    }
    for (const s of HOEREN) {
      expect([s.teil1.length, s.teil2.length, s.teil3.length], s.id).toEqual(SIM_MAX.hoeren)
      for (const x of [...s.teil1, ...s.teil3]) expect(x.options[x.answer], x.id).toBeTruthy()
    }
    for (const s of SCHREIBEN) {
      expect(s.teil1.fields).toHaveLength(SIM_MAX.schreiben[0])
      expect(s.teil2.points).toHaveLength(3)
    }
    for (const s of SPRECHEN) {
      expect(s.teil2[0].cards.length * 2).toBe(SIM_MAX.sprechen[1])
      expect(s.teil3.length).toBeGreaterThanOrEqual(3)
    }
    for (const [m, parts] of Object.entries(TEILE)) expect(parts.length, m).toBe(SIM_MAX[m as keyof typeof SIM_MAX].length)
  })

  it('item ids are unique', () => {
    const ids = [
      ...LESEN.flatMap((s) => [...s.teil1, ...s.teil2, ...s.teil3].map((x) => x.id)),
      ...listeningClips().map((c) => c.id),
    ]
    expect(ids.length).toBe(new Set(ids).size)
  })

  it('every listening clip and model answer has built audio', () => {
    const audio = EXAM_AUDIO as Record<string, string>
    const missing = [...listeningClips(), ...speakingClips()].map((c) => c.id).filter((id) => !audio[id])
    expect(missing, 'run scripts/de-audio/collect-exam.ts + exam.py').toEqual([])
  })

  it('dialogues use both voices; announcements are a single speaker', () => {
    for (const s of HOEREN) {
      for (const d of s.teil1) expect(new Set(d.lines.map((l) => l.who)).size, d.id).toBe(2)
      for (const a of [...s.teil2, ...s.teil3]) expect(a.lines, a.id).toHaveLength(1)
    }
  })
})

describe('exam results sync between devices', () => {
  it('keeps the best practice score per part and merges simulations', () => {
    const sim = (id: string, total: number) => ({ id, set: 's1', total, points: { hoeren: total / 4, lesen: total / 4, schreiben: total / 4, sprechen: total / 4 } })
    const local = { practice: { 'lesen:s1:1': { best: 80, at: 'b' }, 'hoeren:s1:2': { best: 50, at: 'b' } }, sims: [sim('2026-11-24', 64)] }
    const remote = { practice: { 'lesen:s1:1': { best: 60, at: 'a' }, 'lesen:s2:3': { best: 100, at: 'a' } }, sims: [sim('2026-11-20', 52), sim('2026-11-24', 64)] }
    const out = mergeValue('de:exam:a1', local, remote) as ExamState
    expect(out.practice['lesen:s1:1'].best).toBe(80)
    expect(out.practice['lesen:s2:3'].best).toBe(100)
    expect(out.practice['hoeren:s1:2'].best).toBe(50)
    expect(out.sims.map((s) => s.id)).toEqual(['2026-11-24', '2026-11-20'])
  })
})
