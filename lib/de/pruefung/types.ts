/**
 * Exam-format practice (Goethe-Zertifikat A1: Start Deutsch 1).
 * The format follows the official Modellsatz; every text and item here is written by us.
 */

export type ModuleId = 'hoeren' | 'lesen' | 'schreiben' | 'sprechen'

/** Who speaks a line in a listening clip: m = Thorsten (male), f = Kerstin (female). */
export type Voice = 'm' | 'f'
export interface Line {
  who: Voice
  text: string
}

export interface RichtigFalsch {
  statement: string
  answer: boolean
  explain: string
}
export interface MultipleChoice {
  q: string
  options: [string, string, string]
  answer: 0 | 1 | 2
  explain: string
}

/* ── Lesen ─────────────────────────────────────────── */
export interface LesenText {
  id: string
  kind: 'email' | 'notiz' | 'sms'
  from?: string
  subject?: string
  text: string
  items: RichtigFalsch[]
}
export interface Anzeige {
  title: string
  text: string
}
export interface LesenAnzeigen {
  id: string
  situation: string
  a: Anzeige
  b: Anzeige
  answer: 'a' | 'b'
  explain: string
}
export interface LesenSchild extends RichtigFalsch {
  id: string
  place: string
  sign: string
}
export interface LesenSet {
  id: string
  teil1: LesenText[] // 5 statements in total
  teil2: LesenAnzeigen[] // 5 situations
  teil3: LesenSchild[] // 5 signs
}

/* ── Hören ─────────────────────────────────────────── */
export interface HoerenMC extends MultipleChoice {
  id: string
  lines: Line[]
}
export interface HoerenRF extends RichtigFalsch {
  id: string
  lines: Line[]
}
export interface HoerenSet {
  id: string
  teil1: HoerenMC[] // 6 short dialogues, heard twice
  teil2: HoerenRF[] // 4 announcements, heard once
  teil3: HoerenMC[] // 5 phone messages, heard twice
}

/* ── Schreiben ─────────────────────────────────────── */
export interface FormField {
  label: string
  /** accepted answers (compared case- and space-insensitively) */
  accept: string[]
}
export interface Formular {
  id: string
  title: string
  situation: string
  example: { label: string; value: string }
  fields: FormField[] // 5
}
export interface Nachricht {
  id: string
  situation: string
  register: 'du' | 'Sie'
  points: [string, string, string]
  /** words that suggest a point was covered — a hint for self-checking, never the grade itself */
  cues: [string[], string[], string[]]
  model: string
}
export interface SchreibenSet {
  id: string
  teil1: Formular
  teil2: Nachricht
}

/* ── Sprechen ──────────────────────────────────────── */
export interface ThemaKarte {
  word: string
  question: string
  answer: string
}
export interface Thema {
  title: string
  cards: ThemaKarte[]
}
export interface BitteKarte {
  word: string
  situation: string
  request: string
  reply: string
}
export interface SprechenSet {
  id: string
  teil2: Thema[] // 2 topics × 3 cards
  teil3: BitteKarte[] // 6 cards
}
