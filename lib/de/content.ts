/**
 * MVP German content (static). Target: Goethe-Zertifikat.
 * Coverage reference: Goethe-Institut Wortliste & Prüfungsziele (A1–B1).
 * Example sentences & explanations are written by us, not copied.
 */

import { A1_ARTIKEL, A1_NEGASI, A1_PRAESENS, A1_SATZ } from './lessons'
import { CATEGORIES } from './vocab'
import { A1_AKKUSATIV, A1_MODAL } from './lessons-a1b'
import { A1_PLURAL, A1_TRENNBAR } from './lessons-a1c'
import { A1_IMPERATIV, A1_POSSESSIV } from './lessons-a1d'
import { A1_ZEIT } from './lessons-a1e'

export type LevelId = 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2'
export type Gender = 'der' | 'die' | 'das'

export interface GrammarTopic {
  slug: string
  title: string
  summary: string
  body?: string // markdown — present = lesson ready
}

export interface Level {
  id: LevelId
  label: string
  exam: string
  vocab: string
  color: string
  topics: GrammarTopic[]
}

export interface Word {
  de: string // without article
  id: string // Indonesian meaning
  kind: 'noun' | 'verb' | 'adj' | 'num' | 'other'
  gender?: Gender
  plural?: string // '–' = no plural, 'Pl.' = plural-only
  forms?: string // verbs: er-form · Perfekt
  example: string
  exampleId: string
  hint?: string
}

export interface Category {
  slug: string
  title: string
  titleDe: string
  words: Word[]
}

/* ───────────────────────── Grammar roadmap ───────────────────────── */

export const LEVELS: Level[] = [
  {
    id: 'a1',
    label: 'A1',
    exam: 'Goethe-Zertifikat A1: Start Deutsch 1',
    vocab: '±650 kata (Wortliste resmi)',
    color: '#00D4A8',
    topics: [
      { slug: 'artikel', title: 'Artikel & Gender (der/die/das)', summary: 'Maskulin, feminin, netral dan pola akhiran kata', body: A1_ARTIKEL },
      { slug: 'praesens', title: 'Konjugasi Präsens + sein/haben', summary: 'Mengubah kata kerja sesuai subjek', body: A1_PRAESENS },
      { slug: 'satzstellung', title: 'Posisi Kata Kerja & Pertanyaan', summary: 'Verba di posisi 2, W-Fragen, Ja/Nein', body: A1_SATZ },
      { slug: 'negasi', title: 'Negasi: nicht vs. kein', summary: 'Kapan pakai nicht, kapan kein', body: A1_NEGASI },
      { slug: 'akkusativ', title: 'Akkusativ', summary: 'der → den, ein → einen (objek langsung)', body: A1_AKKUSATIV },
      { slug: 'plural', title: 'Bentuk Jamak', summary: '-e, -er, -n, -s, dan umlaut', body: A1_PLURAL },
      { slug: 'modalverben', title: 'Modalverben', summary: 'können, müssen, wollen, möchten, dürfen', body: A1_MODAL },
      { slug: 'trennbar', title: 'Kata Kerja Terpisah', summary: 'aufstehen → Ich stehe um 7 Uhr auf.', body: A1_TRENNBAR },
      { slug: 'possessiv', title: 'Kata Ganti Kepemilikan', summary: 'mein, dein, sein, ihr, unser', body: A1_POSSESSIV },
      { slug: 'imperativ', title: 'Imperativ', summary: 'Komm! Kommt! Kommen Sie!', body: A1_IMPERATIV },
      { slug: 'zeit', title: 'Angka, Jam & Tanggal', summary: 'um 8 Uhr, am Montag, im Mai', body: A1_ZEIT },
    ],
  },
  {
    id: 'a2',
    label: 'A2',
    exam: 'Goethe-Zertifikat A2',
    vocab: '±1.300 kata (Wortliste resmi)',
    color: '#4DB8FF',
    topics: [
      { slug: 'dativ', title: 'Dativ', summary: 'dem, der, dem, den + -n; mit, bei, von, zu' },
      { slug: 'wechsel', title: 'Wechselpräpositionen', summary: 'in, an, auf: Wo? (Dativ) vs. Wohin? (Akkusativ)' },
      { slug: 'perfekt', title: 'Perfekt', summary: 'hat gemacht / ist gegangen' },
      { slug: 'praeteritum', title: 'Präteritum sein/haben/modal', summary: 'war, hatte, konnte, musste' },
      { slug: 'reflexiv', title: 'Kata Kerja Refleksif', summary: 'sich freuen, sich waschen' },
      { slug: 'nebensatz', title: 'Anak Kalimat: weil, dass, wenn', summary: 'Verba pindah ke akhir kalimat' },
      { slug: 'komparativ', title: 'Komparativ & Superlativ', summary: 'groß – größer – am größten' },
      { slug: 'adjektiv', title: 'Deklinasi Adjektiva (dasar)', summary: 'ein guter Film, das gute Buch' },
      { slug: 'konjunktiv', title: 'würde / hätte / könnte', summary: 'Permintaan sopan & keinginan' },
    ],
  },
  {
    id: 'b1',
    label: 'B1',
    exam: 'Goethe-Zertifikat B1',
    vocab: '±2.400 kata (Wortliste resmi)',
    color: '#FFD23F',
    topics: [
      { slug: 'praeteritum', title: 'Präteritum lengkap', summary: 'Bentuk lampau untuk cerita & teks' },
      { slug: 'plusquamperfekt', title: 'Plusquamperfekt', summary: 'hatte gemacht, war gegangen' },
      { slug: 'passiv', title: 'Passiv', summary: 'wird gebaut, wurde gebaut' },
      { slug: 'relativ', title: 'Relativsätze', summary: 'der Mann, der …; die Frau, die …' },
      { slug: 'konnektoren', title: 'obwohl, damit, um … zu', summary: 'Konektor sebab, tujuan, pertentangan' },
      { slug: 'infinitiv', title: 'Infinitiv mit zu', summary: 'Ich habe keine Lust, zu …' },
      { slug: 'genitiv', title: 'Genitiv', summary: 'des Mannes, wegen, trotz' },
      { slug: 'futur', title: 'Futur I', summary: 'Ich werde … machen' },
    ],
  },
  {
    id: 'b2',
    label: 'B2',
    exam: 'Goethe-Zertifikat B2',
    vocab: 'Tidak ada Wortliste resmi',
    color: '#FF7676',
    topics: [
      { slug: 'konjunktiv1', title: 'Konjunktiv I', summary: 'Kalimat tidak langsung (indirekte Rede)' },
      { slug: 'passiv-modal', title: 'Passiv dengan Modalverben', summary: 'muss gemacht werden' },
      { slug: 'nominal', title: 'Nominalisierung', summary: 'entscheiden → die Entscheidung' },
      { slug: 'zweiteilig', title: 'Konektor Dua Bagian', summary: 'je … desto, weder … noch, sowohl … als auch' },
      { slug: 'nvv', title: 'Nomen-Verb-Verbindungen', summary: 'eine Entscheidung treffen' },
    ],
  },
  {
    id: 'c1',
    label: 'C1',
    exam: 'Goethe-Zertifikat C1',
    vocab: 'Tidak ada Wortliste resmi',
    color: '#A78BFA',
    topics: [
      { slug: 'partizip', title: 'Partizipialattribute', summary: 'die von uns geplante Reise' },
      { slug: 'nominalstil', title: 'Nominalstil', summary: 'Gaya bahasa akademik' },
      { slug: 'passiversatz', title: 'Passiversatzformen', summary: 'lässt sich machen, ist zu machen' },
      { slug: 'modal-subjektiv', title: 'Modalverben Subjektif', summary: 'Er soll reich sein. Sie dürfte zu Hause sein.' },
    ],
  },
  {
    id: 'c2',
    label: 'C2',
    exam: 'Goethe-Zertifikat C2: Großes Deutsches Sprachdiplom',
    vocab: 'Tidak ada Wortliste resmi',
    color: '#1F2937',
    topics: [
      { slug: 'register', title: 'Register & Gaya', summary: 'Formal, akademik, sehari-hari' },
      { slug: 'idiom', title: 'Idiom & Redewendungen', summary: 'Ungkapan khas penutur asli' },
    ],
  },
]

/* ───────────────────────── Vocabulary (A1) ───────────────────────── */

export { CATEGORIES } from './vocab'

export const GENDER_STYLE: Record<Gender, { color: string; soft: string; label: string }> = {
  der: { color: '#2563EB', soft: '#EFF6FF', label: 'Maskulin' },
  die: { color: '#DC2626', soft: '#FEF2F2', label: 'Feminin' },
  das: { color: '#059669', soft: '#ECFDF5', label: 'Netral' },
}

export const KIND_LABEL: Record<Word['kind'], string> = {
  noun: 'Kata benda',
  verb: 'Kata kerja',
  adj: 'Kata sifat',
  num: 'Angka',
  other: 'Lainnya',
}

export function getLevel(id: string) {
  return LEVELS.find((l) => l.id === id)
}

export function getCategory(level: string, slug: string) {
  return CATEGORIES[level as LevelId]?.find((c) => c.slug === slug)
}
