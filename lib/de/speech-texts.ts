/**
 * The exact German strings the app reads aloud. Shared by the UI and by
 * scripts/de-audio (which pre-records them), so every key matches.
 */
import type { Word } from './content'
import type { Exercise } from './exercises'

/** What we say/type for a word: nouns always with article. */
export const spoken = (w: Word) => (w.gender ? `${w.plural === 'Pl.' ? 'die' : w.gender} ${w.de}` : w.de)

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function orderText(tokens: string[], end: string) {
  return cap(tokens.join(' ')) + end
}

/** German sentence to read aloud after answering an exercise (null = nothing). */
export function solution(ex: Exercise): string | null {
  if (ex.type === 'mcq') {
    if (!ex.sentence || !ex.sentence.includes('___')) return /[a-zäöüß]{3,} /i.test(ex.answer) ? ex.answer : null
    const s = ex.sentence.split(/[→=]/).pop()!.trim()
    return cap(s.replace('___', ex.answer))
  }
  if (ex.type === 'gap') return cap(ex.sentence.replace('___', ex.answer[0]))
  if (ex.type === 'order') return orderText(ex.tokens, ex.end)
  if (ex.type === 'tf') return ex.sentence && ex.answer ? ex.sentence : null
  return null
}

/** Match-pair items that get read aloud when matched. */
export const matchSpeakable = (s: string) => /[a-zäöüß]/i.test(s)

/** Lesson example line → what is spoken (arrows become pauses). */
export const lessonSpeech = (de: string) => de.replace(/[→–]/g, ',')

/** Parse the ```contoh blocks of a lesson body into [de, id] rows. */
export function lessonExamples(body: string): [string, string][] {
  const rows: [string, string][] = []
  for (const block of body.matchAll(/~~~contoh\n([\s\S]*?)~~~/g)) {
    for (const line of block[1].trim().split('\n')) {
      const [de, id = ''] = line.split('|').map((x) => x.trim())
      if (de) rows.push([de, id])
    }
  }
  return rows
}

/** Manifest key: whitespace-normalised text. */
export const audioKey = (text: string) => text.trim().replace(/\s+/g, ' ')
