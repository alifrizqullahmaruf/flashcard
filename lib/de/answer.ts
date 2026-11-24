/** Grades a typed German answer for a word (Indonesian → German cards). */
import type { Word } from './content'
import type { Grade } from './progress'
import { spoken } from './speech-texts'

const fold = (s: string) =>
  s.trim().replace(/\s+/g, ' ').toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')

export type TypedResult = { grade: Grade; msg: string }

export function gradeTyped(input: string, w: Word): TypedResult {
  const target = spoken(w) // nouns include their article: "der Tisch"
  const typed = input.trim().replace(/\s+/g, ' ')
  if (!typed) return { grade: 'lupa', msg: `Jawaban: ${target}` }
  if (typed === target) return { grade: 'hafal', msg: 'Tepat!' }
  if (fold(typed) === fold(target)) {
    const caseOnly = typed.toLowerCase() === target.toLowerCase()
    return { grade: 'sulit', msg: caseOnly ? `Hampir — perhatikan huruf besar: ${target}` : `Hampir — ejaan yang tepat: ${target}` }
  }
  if (w.gender && fold(typed) === fold(w.de)) return { grade: 'sulit', msg: `Hampir — jangan lupa artikelnya: ${target}` }
  if (w.gender) {
    const [art, ...rest] = typed.split(' ')
    if (['der', 'die', 'das'].includes(art.toLowerCase()) && fold(rest.join(' ')) === fold(w.de)) {
      return { grade: 'lupa', msg: `Artikelnya salah: ${target}` }
    }
  }
  return { grade: 'lupa', msg: `Jawaban: ${target}` }
}
