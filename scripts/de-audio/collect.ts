/**
 * Collects every German string the app reads aloud → scripts/de-audio/texts.json
 * Run: npx tsx scripts/de-audio/collect.ts
 * Then: python scripts/de-audio/build.py  (records/fetches the audio)
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { CATEGORIES, LEVELS } from '../../lib/de/content'
import { PRACTICE } from '../../lib/de/exercises'
import { audioKey, lessonExamples, lessonSpeech, matchSpeakable, solution, spoken } from '../../lib/de/speech-texts'

type Item = { key: string; lemma?: string }
const items = new Map<string, Item>()
const add = (text: string | null, lemma?: string) => {
  if (!text) return
  const key = audioKey(text)
  const prev = items.get(key)
  items.set(key, { key, lemma: prev?.lemma ?? lemma })
}

for (const cats of Object.values(CATEGORIES)) {
  for (const c of cats) {
    for (const w of c.words) {
      // single-word lemma → try a native-speaker recording from Wiktionary
      add(spoken(w), /\s/.test(w.de) ? undefined : w.de)
      add(w.example)
    }
  }
}
for (const lv of LEVELS) for (const t of lv.topics) if (t.body) for (const [de] of lessonExamples(t.body)) add(lessonSpeech(de))
for (const topics of Object.values(PRACTICE)) {
  for (const p of Object.values(topics)) {
    for (const ex of p.items) {
      add(solution(ex))
      if (ex.type === 'match') for (const [l] of ex.pairs) if (matchSpeakable(l)) add(l)
    }
  }
}

const out = [...items.values()]
writeFileSync(join(__dirname, 'texts.json'), JSON.stringify(out, null, 1))
console.log(`${out.length} texts (${out.filter((x) => x.lemma).length} with a lemma)`)
