/**
 * Collects the exam listening clips (multi-voice dialogues) and Sprechen model answers
 * → scripts/de-audio/exam-texts.json
 * Run: npx tsx scripts/de-audio/collect-exam.ts
 * Then: python scripts/de-audio/exam.py --male <thorsten.onnx> --female <kerstin.onnx>
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { listeningClips, speakingClips } from '../../lib/de/pruefung'

const clips = [...listeningClips(), ...speakingClips().map((c) => ({ id: c.id, lines: [{ who: 'm' as const, text: c.text }] }))]
writeFileSync(join(__dirname, 'exam-texts.json'), JSON.stringify(clips, null, 1))
console.log(`${clips.length} exam clips`)
