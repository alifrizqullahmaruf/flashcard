/**
 * MVP German content (static). Target: Goethe-Zertifikat.
 * Coverage reference: Goethe-Institut Wortliste & Prüfungsziele (A1–B1).
 * Example sentences & explanations are written by us, not copied.
 */

import { A1_ARTIKEL, A1_NEGASI, A1_PRAESENS, A1_SATZ } from './lessons'

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
      { slug: 'akkusativ', title: 'Akkusativ', summary: 'der → den, ein → einen (objek langsung)' },
      { slug: 'plural', title: 'Bentuk Jamak', summary: '-e, -er, -n, -s, dan umlaut' },
      { slug: 'modalverben', title: 'Modalverben', summary: 'können, müssen, wollen, möchten, dürfen' },
      { slug: 'trennbar', title: 'Kata Kerja Terpisah', summary: 'aufstehen → Ich stehe um 7 Uhr auf.' },
      { slug: 'possessiv', title: 'Kata Ganti Kepemilikan', summary: 'mein, dein, sein, ihr, unser' },
      { slug: 'imperativ', title: 'Imperativ', summary: 'Komm! Kommt! Kommen Sie!' },
      { slug: 'zeit', title: 'Angka, Jam & Tanggal', summary: 'um 8 Uhr, am Montag, im Mai' },
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

export const CATEGORIES: Record<LevelId, Category[]> = {
  a1: [
    {
      slug: 'familie',
      title: 'Keluarga',
      titleDe: 'Familie',
      words: [
        { de: 'Familie', id: 'keluarga', kind: 'noun', gender: 'die', plural: 'die Familien', example: 'Meine Familie wohnt in Bandung.', exampleId: 'Keluargaku tinggal di Bandung.' },
        { de: 'Mutter', id: 'ibu', kind: 'noun', gender: 'die', plural: 'die Mütter', example: 'Meine Mutter ist Ärztin.', exampleId: 'Ibuku seorang dokter.' },
        { de: 'Vater', id: 'ayah', kind: 'noun', gender: 'der', plural: 'die Väter', example: 'Mein Vater kocht gern.', exampleId: 'Ayahku suka memasak.' },
        { de: 'Bruder', id: 'saudara laki-laki', kind: 'noun', gender: 'der', plural: 'die Brüder', example: 'Ich habe einen Bruder.', exampleId: 'Aku punya satu saudara laki-laki.' },
        { de: 'Schwester', id: 'saudara perempuan', kind: 'noun', gender: 'die', plural: 'die Schwestern', example: 'Meine Schwester ist 12 Jahre alt.', exampleId: 'Adik perempuanku berumur 12 tahun.' },
        { de: 'Kind', id: 'anak', kind: 'noun', gender: 'das', plural: 'die Kinder', example: 'Das Kind spielt im Garten.', exampleId: 'Anak itu bermain di kebun.' },
        { de: 'Mädchen', id: 'anak perempuan', kind: 'noun', gender: 'das', plural: 'die Mädchen', example: 'Das Mädchen heißt Sari.', exampleId: 'Anak perempuan itu bernama Sari.', hint: 'Akhiran -chen selalu das, walaupun artinya perempuan!' },
        { de: 'Eltern', id: 'orang tua', kind: 'noun', gender: 'die', plural: 'Pl.', example: 'Meine Eltern kommen aus Medan.', exampleId: 'Orang tuaku berasal dari Medan.', hint: 'Hanya ada bentuk jamak.' },
        { de: 'Sohn', id: 'anak laki-laki (putra)', kind: 'noun', gender: 'der', plural: 'die Söhne', example: 'Ihr Sohn geht zur Schule.', exampleId: 'Putranya pergi ke sekolah.' },
        { de: 'Tochter', id: 'anak perempuan (putri)', kind: 'noun', gender: 'die', plural: 'die Töchter', example: 'Meine Tochter liest viel.', exampleId: 'Putriku banyak membaca.' },
      ],
    },
    {
      slug: 'essen',
      title: 'Makanan & Minuman',
      titleDe: 'Essen und Trinken',
      words: [
        { de: 'Brot', id: 'roti', kind: 'noun', gender: 'das', plural: 'die Brote', example: 'Ich esse Brot zum Frühstück.', exampleId: 'Aku makan roti untuk sarapan.' },
        { de: 'Apfel', id: 'apel', kind: 'noun', gender: 'der', plural: 'die Äpfel', example: 'Der Apfel ist rot.', exampleId: 'Apel itu merah.' },
        { de: 'Milch', id: 'susu', kind: 'noun', gender: 'die', plural: '–', example: 'Trinkst du Milch?', exampleId: 'Apakah kamu minum susu?' },
        { de: 'Wasser', id: 'air', kind: 'noun', gender: 'das', plural: '–', example: 'Ein Glas Wasser, bitte.', exampleId: 'Segelas air, tolong.' },
        { de: 'Kaffee', id: 'kopi', kind: 'noun', gender: 'der', plural: '–', example: 'Ich trinke keinen Kaffee.', exampleId: 'Aku tidak minum kopi.', hint: 'Kebanyakan minuman: der (der Kaffee, der Tee, der Saft), kecuali das Wasser & das Bier.' },
        { de: 'Ei', id: 'telur', kind: 'noun', gender: 'das', plural: 'die Eier', example: 'Ich möchte zwei Eier.', exampleId: 'Aku mau dua telur.' },
        { de: 'Fisch', id: 'ikan', kind: 'noun', gender: 'der', plural: 'die Fische', example: 'Der Fisch ist frisch.', exampleId: 'Ikannya segar.' },
        { de: 'Kartoffel', id: 'kentang', kind: 'noun', gender: 'die', plural: 'die Kartoffeln', example: 'Die Kartoffeln sind billig.', exampleId: 'Kentangnya murah.' },
        { de: 'essen', id: 'makan', kind: 'verb', forms: 'er isst · hat gegessen', example: 'Wir essen um 12 Uhr.', exampleId: 'Kami makan jam 12.', hint: 'Tidak beraturan: du isst, er isst.' },
        { de: 'trinken', id: 'minum', kind: 'verb', forms: 'er trinkt · hat getrunken', example: 'Was trinkst du?', exampleId: 'Kamu minum apa?' },
      ],
    },
    {
      slug: 'schule',
      title: 'Sekolah',
      titleDe: 'Schule',
      words: [
        { de: 'Schule', id: 'sekolah', kind: 'noun', gender: 'die', plural: 'die Schulen', example: 'Die Schule beginnt um 7 Uhr.', exampleId: 'Sekolah mulai jam 7.' },
        { de: 'Lehrer', id: 'guru (laki-laki)', kind: 'noun', gender: 'der', plural: 'die Lehrer', example: 'Der Lehrer ist nett.', exampleId: 'Guru itu baik.' },
        { de: 'Lehrerin', id: 'guru (perempuan)', kind: 'noun', gender: 'die', plural: 'die Lehrerinnen', example: 'Unsere Lehrerin kommt aus Berlin.', exampleId: 'Guru kami berasal dari Berlin.', hint: 'Akhiran -in untuk perempuan selalu die.' },
        { de: 'Buch', id: 'buku', kind: 'noun', gender: 'das', plural: 'die Bücher', example: 'Das Buch ist interessant.', exampleId: 'Buku itu menarik.' },
        { de: 'Heft', id: 'buku tulis', kind: 'noun', gender: 'das', plural: 'die Hefte', example: 'Ich brauche ein Heft.', exampleId: 'Aku butuh buku tulis.' },
        { de: 'Stift', id: 'pena / pensil', kind: 'noun', gender: 'der', plural: 'die Stifte', example: 'Hast du einen Stift?', exampleId: 'Kamu punya pena?' },
        { de: 'Tisch', id: 'meja', kind: 'noun', gender: 'der', plural: 'die Tische', example: 'Das Buch liegt auf dem Tisch.', exampleId: 'Buku itu ada di atas meja.' },
        { de: 'Prüfung', id: 'ujian', kind: 'noun', gender: 'die', plural: 'die Prüfungen', example: 'Die Prüfung ist morgen.', exampleId: 'Ujiannya besok.', hint: 'Akhiran -ung selalu die.' },
        { de: 'lernen', id: 'belajar', kind: 'verb', forms: 'er lernt · hat gelernt', example: 'Ich lerne Deutsch.', exampleId: 'Aku belajar bahasa Jerman.' },
        { de: 'schreiben', id: 'menulis', kind: 'verb', forms: 'er schreibt · hat geschrieben', example: 'Schreib deinen Namen, bitte.', exampleId: 'Tolong tulis namamu.' },
      ],
    },
    {
      slug: 'farben',
      title: 'Warna',
      titleDe: 'Farben',
      words: [
        { de: 'Farbe', id: 'warna', kind: 'noun', gender: 'die', plural: 'die Farben', example: 'Welche Farbe magst du?', exampleId: 'Kamu suka warna apa?' },
        { de: 'rot', id: 'merah', kind: 'adj', example: 'Die Tomate ist rot.', exampleId: 'Tomatnya merah.' },
        { de: 'blau', id: 'biru', kind: 'adj', example: 'Der Himmel ist blau.', exampleId: 'Langitnya biru.' },
        { de: 'grün', id: 'hijau', kind: 'adj', example: 'Das Gras ist grün.', exampleId: 'Rumputnya hijau.' },
        { de: 'gelb', id: 'kuning', kind: 'adj', example: 'Die Banane ist gelb.', exampleId: 'Pisangnya kuning.' },
        { de: 'schwarz', id: 'hitam', kind: 'adj', example: 'Meine Katze ist schwarz.', exampleId: 'Kucingku hitam.' },
        { de: 'weiß', id: 'putih', kind: 'adj', example: 'Der Schnee ist weiß.', exampleId: 'Saljunya putih.' },
        { de: 'braun', id: 'cokelat', kind: 'adj', example: 'Er hat braune Augen.', exampleId: 'Dia punya mata cokelat.' },
        { de: 'grau', id: 'abu-abu', kind: 'adj', example: 'Heute ist der Himmel grau.', exampleId: 'Hari ini langitnya abu-abu.' },
      ],
    },
    {
      slug: 'zahlen',
      title: 'Angka',
      titleDe: 'Zahlen',
      words: [
        { de: 'Zahl', id: 'angka', kind: 'noun', gender: 'die', plural: 'die Zahlen', example: 'Die Zahl ist zu groß.', exampleId: 'Angkanya terlalu besar.' },
        { de: 'null', id: '0', kind: 'num', example: 'Meine Nummer beginnt mit null.', exampleId: 'Nomorku diawali nol.' },
        { de: 'eins', id: '1', kind: 'num', example: 'Eins, zwei, drei – los!', exampleId: 'Satu, dua, tiga – mulai!' },
        { de: 'zwei', id: '2', kind: 'num', example: 'Ich habe zwei Brüder.', exampleId: 'Aku punya dua saudara laki-laki.' },
        { de: 'drei', id: '3', kind: 'num', example: 'Das kostet drei Euro.', exampleId: 'Itu harganya tiga euro.' },
        { de: 'zehn', id: '10', kind: 'num', example: 'Der Kurs hat zehn Teilnehmer.', exampleId: 'Kursus ini punya sepuluh peserta.' },
        { de: 'zwölf', id: '12', kind: 'num', example: 'Es ist zwölf Uhr.', exampleId: 'Sekarang jam dua belas.' },
        { de: 'zwanzig', id: '20', kind: 'num', example: 'Ich bin zwanzig Jahre alt.', exampleId: 'Aku berumur dua puluh tahun.' },
        { de: 'einundzwanzig', id: '21', kind: 'num', example: 'Bus einundzwanzig kommt gleich.', exampleId: 'Bus 21 sebentar lagi datang.', hint: 'Satuan dulu, baru puluhan: ein-und-zwanzig = "satu-dan-dua puluh".' },
        { de: 'hundert', id: '100', kind: 'num', example: 'Das Buch hat hundert Seiten.', exampleId: 'Buku itu seratus halaman.' },
      ],
    },
  ],
  a2: [], b1: [], b2: [], c1: [], c2: [],
}

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
