import { HOEREN } from './a1/hoeren'
import { LESEN } from './a1/lesen'
import { SCHREIBEN } from './a1/schreiben'
import { SPRECHEN, VORSTELLEN } from './a1/sprechen'
import type { ModuleId } from './types'

export { HOEREN, LESEN, SCHREIBEN, SPRECHEN, VORSTELLEN }

export const SETS = ['s1', 's2'] as const
export type SetId = (typeof SETS)[number]
export const SET_LABEL: Record<string, string> = { s1: 'Set 1', s2: 'Set 2' }

/** Parts of each module, as in the official exam. */
export const TEILE: Record<ModuleId, { n: number; title: string; info: string }[]> = {
  hoeren: [
    { n: 1, title: 'Percakapan singkat', info: '6 dialog · pilihan ganda · diputar 2×' },
    { n: 2, title: 'Pengumuman', info: '4 pengumuman · benar/salah · diputar 1×' },
    { n: 3, title: 'Pesan telepon', info: '5 pesan · pilihan ganda · diputar 2×' },
  ],
  lesen: [
    { n: 1, title: 'E-mail & catatan', info: '2 teks · 5 pernyataan benar/salah' },
    { n: 2, title: 'Iklan kecil', info: '5 situasi · pilih iklan a atau b' },
    { n: 3, title: 'Papan & pengumuman', info: '5 papan · benar/salah' },
  ],
  schreiben: [
    { n: 1, title: 'Formulir', info: 'Isi 5 kolom dari sebuah teks' },
    { n: 2, title: 'Pesan singkat', info: '±30 kata · 3 poin + sapaan & salam' },
  ],
  sprechen: [
    { n: 1, title: 'Perkenalan diri', info: 'Perkenalkan diri, eja nama, sebut angka' },
    { n: 2, title: 'Tanya-jawab topik', info: 'Buat pertanyaan dari kartu & jawab' },
    { n: 3, title: 'Permintaan', info: 'Minta sesuatu dengan sopan & tanggapi' },
  ],
}

export const isModule = (m: string): m is ModuleId => m in TEILE

export const audioId = (itemId: string) => `exam-${itemId}`

/** Every listening clip (id → lines), for the audio build and tests. */
export function listeningClips() {
  return HOEREN.flatMap((s) => [...s.teil1, ...s.teil2, ...s.teil3]).map((x) => ({ id: audioId(x.id), lines: x.lines }))
}

/** Every Sprechen model text that gets a single-voice clip. */
export function speakingClips() {
  const out: { id: string; text: string }[] = [
    { id: 'exam-vorstellen', text: VORSTELLEN.model },
    { id: 'exam-spell', text: VORSTELLEN.spell.model },
    { id: 'exam-number', text: VORSTELLEN.number.model },
  ]
  for (const s of SPRECHEN) {
    s.teil2.forEach((t, i) => t.cards.forEach((c, j) => out.push({ id: `exam-${s.id}-sp2-${i}-${j}`, text: `${c.question} ${c.answer}` })))
    s.teil3.forEach((c, i) => out.push({ id: `exam-${s.id}-sp3-${i}`, text: c.request }))
  }
  return out
}
