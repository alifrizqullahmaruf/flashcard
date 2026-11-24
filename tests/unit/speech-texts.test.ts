import { describe, expect, it } from 'vitest'
import type { Exercise } from '@/lib/de/exercises'
import type { Word } from '@/lib/de/content'
import { lessonExamples, orderText, solution, spoken } from '@/lib/de/speech-texts'

describe('spoken()', () => {
  it('nouns are read with their article, plural-only with "die"', () => {
    expect(spoken({ de: 'Vater', gender: 'der', kind: 'noun' } as Word)).toBe('der Vater')
    expect(spoken({ de: 'Eltern', gender: 'die', plural: 'Pl.', kind: 'noun' } as Word)).toBe('die Eltern')
    expect(spoken({ de: 'essen', kind: 'verb' } as Word)).toBe('essen')
  })
})

describe('solution()', () => {
  const base = { section: 's', explain: 'e' }
  it('fills the blank and capitalises', () => {
    expect(solution({ ...base, type: 'gap', sentence: '___ Student lernt.', translation: '', answer: ['der'] } as Exercise)).toBe('Der Student lernt.')
  })
  it('uses the part after an arrow', () => {
    expect(solution({ ...base, type: 'mcq', q: '', sentence: 'Der Tisch ist neu. → ___ ist neu.', options: ['er'], answer: 'er' } as Exercise)).toBe('Er ist neu.')
  })
  it('order exercises become a sentence with end punctuation', () => {
    expect(orderText(['wie', 'spät', 'ist', 'es'], '?')).toBe('Wie spät ist es?')
  })
  it('false statements are not read aloud', () => {
    expect(solution({ ...base, type: 'tf', statement: '', sentence: 'Am Montag ich arbeite.', answer: false } as Exercise)).toBeNull()
  })
})

describe('lessonExamples()', () => {
  it('parses ~~~contoh blocks', () => {
    const body = 'Teks\n~~~contoh\nIch bin hier. | Aku di sini.\nDu bist da. | Kamu di sana.\n~~~\n'
    expect(lessonExamples(body)).toEqual([
      ['Ich bin hier.', 'Aku di sini.'],
      ['Du bist da.', 'Kamu di sana.'],
    ])
  })
})
