import { describe, expect, it } from 'vitest'
import { gradeTyped } from '@/lib/de/answer'
import type { Word } from '@/lib/de/content'

const mutter: Word = { de: 'Mutter', id: 'ibu', kind: 'noun', gender: 'die', plural: 'die Mütter', example: 'Meine Mutter ist Ärztin.', exampleId: 'Ibuku seorang dokter.' }
const essen: Word = { de: 'essen', id: 'makan', kind: 'verb', forms: 'er isst · hat gegessen', example: 'Wir essen um 12 Uhr.', exampleId: 'Kami makan jam 12.' }
const groesse: Word = { de: 'Größe', id: 'ukuran', kind: 'noun', gender: 'die', plural: 'die Größen', example: 'Welche Größe?', exampleId: 'Ukuran berapa?' }

describe('gradeTyped (Indonesia → Jerman, diketik)', () => {
  it('exact answer with article → hafal', () => {
    expect(gradeTyped('die Mutter', mutter).grade).toBe('hafal')
    expect(gradeTyped('  die   Mutter ', mutter).grade).toBe('hafal')
  })
  it('missing article → sulit with a hint about the article', () => {
    const r = gradeTyped('Mutter', mutter)
    expect(r.grade).toBe('sulit')
    expect(r.msg).toMatch(/artikel/i)
  })
  it('wrong article → lupa and shows the right one', () => {
    const r = gradeTyped('der Mutter', mutter)
    expect(r.grade).toBe('lupa')
    expect(r.msg).toContain('die Mutter')
  })
  it('only capitalisation differs → sulit', () => {
    expect(gradeTyped('die mutter', mutter).grade).toBe('sulit')
  })
  it('umlaut / ß typed as ae / ss → sulit', () => {
    expect(gradeTyped('die Groesse', groesse).grade).toBe('sulit')
  })
  it('verbs have no article', () => {
    expect(gradeTyped('essen', essen).grade).toBe('hafal')
    expect(gradeTyped('trinken', essen).grade).toBe('lupa')
  })
  it('empty answer → lupa', () => {
    expect(gradeTyped('   ', mutter).grade).toBe('lupa')
  })
})
