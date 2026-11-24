/**
 * Per-topic grammar practice. Five exercise types:
 *  mcq   – pilihan ganda (der/die/das options render as gender buttons)
 *  gap   – isi titik-titik (ketik)
 *  order – susun kata jadi kalimat
 *  tf    – benar / salah
 *  match – pasangkan
 * `sentence` with `___` marks the blank; the filled sentence is read aloud.
 */

export type ExType = 'mcq' | 'gap' | 'order' | 'tf' | 'match'

interface Base {
  section: string
  explain: string
}
export type Exercise =
  | (Base & { type: 'mcq'; q: string; sentence?: string; options: string[]; answer: string })
  | (Base & { type: 'gap'; sentence: string; translation: string; base?: string; answer: string[] })
  | (Base & { type: 'order'; translation: string; tokens: string[]; alt?: string[][]; end: '.' | '?' | '!'; start?: string })
  | (Base & { type: 'tf'; statement: string; sentence?: string; answer: boolean })
  | (Base & { type: 'match'; q: string; pairs: [string, string][] })

export interface Section {
  id: string
  label: string
}
export interface TopicPractice {
  sections: Section[]
  items: Exercise[]
}

export const EX_TYPE_LABEL: Record<ExType, string> = {
  mcq: 'Pilihan ganda',
  gap: 'Isi titik-titik',
  order: 'Susun kalimat',
  tf: 'Benar atau salah',
  match: 'Pasangkan',
}

const G = ['der', 'die', 'das']

const ARTIKEL: TopicPractice = {
  sections: [
    { id: 'der', label: 'der · maskulin' },
    { id: 'die', label: 'die · feminin' },
    { id: 'das', label: 'das · netral' },
    { id: 'jamak', label: 'Jamak & majemuk' },
  ],
  items: [
    // der
    { section: 'der', type: 'mcq', q: 'Pilih artikelnya', sentence: '___ Montag', options: G, answer: 'der', explain: 'Hari, bulan, dan musim selalu maskulin: der Montag, der Mai, der Sommer.' },
    { section: 'der', type: 'mcq', q: 'Pilih artikelnya', sentence: '___ Lehrer', options: G, answer: 'der', explain: 'Orang laki-laki dan profesinya → der. Versi perempuannya: die Lehrerin.' },
    { section: 'der', type: 'gap', sentence: '___ Student lernt Deutsch.', translation: 'Mahasiswa itu belajar bahasa Jerman.', base: 'der/die/das', answer: ['der'], explain: 'Akhiran -ent untuk orang (der Student, der Patient) → maskulin.' },
    { section: 'der', type: 'tf', statement: 'Kata berakhiran -ling biasanya maskulin, misalnya der Frühling.', answer: true, explain: 'Benar: der Frühling, der Schmetterling, der Lehrling.' },
    { section: 'der', type: 'mcq', q: 'Ganti kata bendanya dengan kata ganti', sentence: 'Der Tisch ist neu. → ___ ist neu.', options: ['er', 'sie', 'es'], answer: 'er', explain: 'der → er. Kata ganti mengikuti gender gramatikal, juga untuk benda.' },
    { section: 'der', type: 'match', q: 'Pasangkan kata dengan artinya', pairs: [['der Sommer', 'musim panas'], ['der Regen', 'hujan'], ['der Januar', 'Januari'], ['der Norden', 'utara']], explain: 'Musim, cuaca, bulan, dan arah mata angin semuanya der.' },
    { section: 'der', type: 'order', translation: 'Ayah memasak hari ini.', tokens: ['der', 'Vater', 'kocht', 'heute'], end: '.', explain: 'Der Vater (subjek) + kocht (verba di posisi 2) + heute.' },

    // die
    { section: 'die', type: 'mcq', q: 'Pilih artikelnya', sentence: '___ Zeitung', options: G, answer: 'die', explain: 'Akhiran -ung selalu feminin: die Zeitung, die Wohnung, die Übung.' },
    { section: 'die', type: 'mcq', q: 'Pilih artikelnya', sentence: '___ Universität', options: G, answer: 'die', explain: 'Akhiran -tät selalu feminin: die Universität, die Qualität.' },
    { section: 'die', type: 'tf', statement: 'Semua kata berakhiran -e pasti feminin.', answer: false, explain: 'Sebagian besar ya, tapi ada pengecualian: der Name, der Junge, der Käse, das Auge, das Ende.' },
    { section: 'die', type: 'gap', sentence: 'Das ist ___ Lehrerin.', translation: 'Itu seorang guru (perempuan).', base: 'ein/eine', answer: ['eine'], explain: 'Akhiran -in = perempuan → feminin → artikel tak tentunya eine.' },
    { section: 'die', type: 'mcq', q: 'Ganti kata bendanya dengan kata ganti', sentence: 'Die Lampe ist kaputt. → ___ ist kaputt.', options: ['er', 'sie', 'es'], answer: 'sie', explain: 'die → sie.' },
    { section: 'die', type: 'match', q: 'Pasangkan kata dengan artinya', pairs: [['die Freiheit', 'kebebasan'], ['die Information', 'informasi'], ['die Freundschaft', 'persahabatan'], ['die Musik', 'musik']], explain: 'Akhiran -heit, -ion, -schaft, -ik → selalu die.' },
    { section: 'die', type: 'order', translation: 'Ibu membaca koran.', tokens: ['die', 'Mutter', 'liest', 'eine', 'Zeitung'], end: '.', explain: 'Die Mutter + liest (posisi 2) + eine Zeitung.' },

    // das
    { section: 'das', type: 'mcq', q: 'Pilih artikelnya', sentence: '___ Mädchen', options: G, answer: 'das', explain: 'Akhiran -chen selalu netral, walaupun artinya anak perempuan.' },
    { section: 'das', type: 'mcq', q: 'Pilih artikelnya', sentence: '___ Museum', options: G, answer: 'das', explain: 'Akhiran -um → netral: das Museum, das Zentrum, das Datum.' },
    { section: 'das', type: 'tf', statement: 'Kata kerja yang dijadikan kata benda (das Essen, das Lernen) selalu netral.', answer: true, explain: 'Benar. Infinitiv sebagai kata benda selalu das.' },
    { section: 'das', type: 'gap', sentence: 'Das ist ___ Hotel.', translation: 'Itu sebuah hotel.', base: 'ein/eine', answer: ['ein'], explain: 'das Hotel → netral → ein (sama dengan maskulin).' },
    { section: 'das', type: 'mcq', q: 'Ganti kata bendanya dengan kata ganti', sentence: 'Das Mädchen ist neun. → ___ ist neun.', options: ['er', 'sie', 'es'], answer: 'es', explain: 'Kata ganti ikut gender gramatikal: das Mädchen → es, bukan sie.' },
    { section: 'das', type: 'match', q: 'Pasangkan kata dengan artinya', pairs: [['das Kind', 'anak'], ['das Brötchen', 'roti kecil'], ['das Kino', 'bioskop'], ['das Thema', 'tema']], explain: 'Makhluk muda, -chen, kata serapan, -ma → das.' },
    { section: 'das', type: 'order', translation: 'Makanannya enak.', tokens: ['das', 'Essen', 'ist', 'lecker'], end: '.', explain: 'Das Essen + ist (posisi 2) + lecker.' },

    // jamak & majemuk
    { section: 'jamak', type: 'mcq', q: 'Pilih artikel bentuk jamak', sentence: '___ Bücher', options: G, answer: 'die', explain: 'Semua bentuk jamak memakai die, walaupun bentuk tunggalnya das Buch.' },
    { section: 'jamak', type: 'mcq', q: 'Gender kata majemuk', sentence: 'das Haus + die Tür = ___ Haustür', options: G, answer: 'die', explain: 'Kata majemuk ikut kata terakhir: die Tür → die Haustür.' },
    { section: 'jamak', type: 'mcq', q: 'Gender kata majemuk', sentence: 'die Schule + das Buch = ___ Schulbuch', options: G, answer: 'das', explain: 'Kata terakhir das Buch → das Schulbuch.' },
    { section: 'jamak', type: 'tf', statement: 'Bentuk jamak dari "ein" adalah "eine".', answer: false, explain: 'Artikel tak tentu tidak punya bentuk jamak: Das sind Bücher (tanpa artikel).' },
    { section: 'jamak', type: 'gap', sentence: 'Wo sind ___ Kinder?', translation: 'Di mana anak-anak itu?', base: 'der/die/das', answer: ['die'], explain: 'das Kind → jamaknya die Kinder.' },
    { section: 'jamak', type: 'match', q: 'Pasangkan artikel dengan kata gantinya', pairs: [['der', 'er'], ['die (tunggal)', 'sie (dia)'], ['das', 'es'], ['die (jamak)', 'sie (mereka)']], explain: 'der → er, die → sie, das → es, jamak → sie.' },
  ],
}

const PRAESENS: TopicPractice = {
  sections: [
    { id: 'reguler', label: 'Kata kerja beraturan' },
    { id: 'sein', label: 'sein & haben' },
    { id: 'vokal', label: 'Perubahan vokal & Sie' },
  ],
  items: [
    { section: 'reguler', type: 'mcq', q: 'Pilih bentuk yang benar', sentence: 'Ich ___ in Jakarta.', options: ['wohne', 'wohnst', 'wohnt', 'wohnen'], answer: 'wohne', explain: 'ich → akhiran -e: ich wohne.' },
    { section: 'reguler', type: 'gap', sentence: 'Du ___ Deutsch.', translation: 'Kamu belajar bahasa Jerman.', base: 'lernen', answer: ['lernst'], explain: 'du → akhiran -st: du lernst.' },
    { section: 'reguler', type: 'gap', sentence: 'Er ___ in einem Café.', translation: 'Dia bekerja di sebuah kafe.', base: 'arbeiten', answer: ['arbeitet'], explain: 'Akar kata berakhiran -t → tambah -e-: er arbeitet.' },
    { section: 'reguler', type: 'mcq', q: 'Pilih bentuk yang benar', sentence: 'Wie ___ du?', options: ['heißt', 'heißst', 'heißest'], answer: 'heißt', explain: 'Akar kata berakhiran -ß → du cukup + t: du heißt.' },
    { section: 'reguler', type: 'tf', statement: 'Bentuk "ihr" dan "er" dari kata kerja beraturan sama-sama berakhiran -t.', answer: true, explain: 'Benar: er lernt, ihr lernt. Bedakan dari subjeknya.' },
    { section: 'reguler', type: 'match', q: 'Pasangkan subjek dengan bentuk spielen', pairs: [['ich', 'spiele'], ['du', 'spielst'], ['wir', 'spielen'], ['ihr', 'spielt']], explain: 'ich -e, du -st, wir -en, ihr -t.' },
    { section: 'reguler', type: 'order', translation: 'Kami main sepak bola hari ini.', tokens: ['wir', 'spielen', 'heute', 'Fußball'], alt: [['heute', 'spielen', 'wir', 'Fußball']], end: '.', explain: 'wir → spielen (-en), verba di posisi 2.' },

    { section: 'sein', type: 'mcq', q: 'Pilih bentuk sein', sentence: 'Ich ___ Student.', options: ['bin', 'bist', 'ist', 'sind'], answer: 'bin', explain: 'ich bin, du bist, er ist.' },
    { section: 'sein', type: 'mcq', q: 'Pilih bentuk haben', sentence: 'Wir ___ einen Hund.', options: ['habe', 'hast', 'haben', 'habt'], answer: 'haben', explain: 'wir haben, ihr habt.' },
    { section: 'sein', type: 'gap', sentence: 'Ihr ___ sehr nett.', translation: 'Kalian sangat baik.', base: 'sein', answer: ['seid'], explain: 'ihr seid. Jangan tertukar dengan "seit" (sejak).' },
    { section: 'sein', type: 'gap', sentence: 'Anna ___ heute Geburtstag.', translation: 'Anna berulang tahun hari ini.', base: 'haben', answer: ['hat'], explain: 'er/sie/es hat (bukan "habt").' },
    { section: 'sein', type: 'tf', statement: 'Bentuk "du" dari haben adalah "habst".', answer: false, explain: 'Yang benar: du hast.' },
    { section: 'sein', type: 'match', q: 'Pasangkan subjek dengan bentuk sein', pairs: [['ich', 'bin'], ['du', 'bist'], ['er', 'ist'], ['ihr', 'seid']], explain: 'sein tidak beraturan: bin, bist, ist, sind, seid, sind.' },
    { section: 'sein', type: 'order', translation: 'Dia (perempuan) berumur 20 tahun.', tokens: ['sie', 'ist', '20', 'Jahre', 'alt'], end: '.', explain: 'Umur memakai sein: Sie ist 20 Jahre alt.' },

    { section: 'vokal', type: 'mcq', q: 'Pilih bentuk fahren', sentence: 'Er ___ nach Berlin.', options: ['fahrt', 'fährt', 'fährst', 'fahren'], answer: 'fährt', explain: 'fahren: a → ä untuk du & er/sie/es: er fährt.' },
    { section: 'vokal', type: 'gap', sentence: 'Du ___ gern Bücher.', translation: 'Kamu suka membaca buku.', base: 'lesen', answer: ['liest'], explain: 'lesen: e → ie, dan karena akar berakhiran -s: du liest.' },
    { section: 'vokal', type: 'mcq', q: 'Pilih bentuk sprechen', sentence: 'Ich ___ ein bisschen Deutsch.', options: ['spreche', 'spriche', 'sprichst', 'spricht'], answer: 'spreche', explain: 'Perubahan vokal hanya untuk du & er/sie/es. ich spreche tetap normal.' },
    { section: 'vokal', type: 'tf', statement: 'Perubahan vokal juga berlaku untuk "wir": wir fähren.', answer: false, explain: 'Salah. Yang benar: wir fahren. Hanya du & er/sie/es yang berubah.' },
    { section: 'vokal', type: 'mcq', q: 'Pilih bentuk untuk "Sie" (Anda)', sentence: 'Frau Weber, wo ___ Sie?', options: ['wohnen', 'wohnst', 'wohnt'], answer: 'wohnen', explain: 'Sie (formal) konjugasinya sama dengan sie (mereka): -en.' },
    { section: 'vokal', type: 'match', q: 'Pasangkan infinitiv dengan bentuk er', pairs: [['essen', 'isst'], ['lesen', 'liest'], ['schlafen', 'schläft'], ['helfen', 'hilft']], explain: 'e → i, e → ie, a → ä.' },
    { section: 'vokal', type: 'order', translation: 'Kamu suka makan apa?', tokens: ['was', 'isst', 'du', 'gern'], end: '?', explain: 'essen → du isst. Kata tanya + verba + subjek.' },
  ],
}

const SATZ: TopicPractice = {
  sections: [
    { id: 'posisi', label: 'Verba di posisi 2' },
    { id: 'w', label: 'Pertanyaan W' },
    { id: 'janein', label: 'Ja/Nein & Doch' },
  ],
  items: [
    { section: 'posisi', type: 'order', translation: 'Hari ini aku belajar bahasa Jerman.', start: 'heute', tokens: ['heute', 'lerne', 'ich', 'Deutsch'], end: '.', explain: 'Heute di posisi 1 → verba lerne di posisi 2 → subjek ich setelahnya.' },
    { section: 'posisi', type: 'mcq', q: 'Lengkapi kalimatnya', sentence: 'Heute ___.', options: ['ich gehe ins Kino', 'gehe ich ins Kino', 'ins Kino ich gehe'], answer: 'gehe ich ins Kino', explain: 'Bukan subjek di posisi 1 → inversi: verba dulu, baru subjek.' },
    { section: 'posisi', type: 'tf', statement: 'Kalimat ini benar.', sentence: 'Am Montag ich arbeite.', answer: false, explain: 'Verba harus di posisi 2: Am Montag arbeite ich.' },
    { section: 'posisi', type: 'order', translation: 'Di akhir pekan aku main tenis.', start: 'am', tokens: ['am', 'Wochenende', 'spiele', 'ich', 'Tennis'], end: '.', explain: '"Am Wochenende" = satu posisi, jadi verba spiele langsung setelahnya.' },
    { section: 'posisi', type: 'mcq', q: 'Kalimat mana yang benar?', options: ['Ich kann gut schwimmen.', 'Ich kann schwimmen gut.', 'Ich schwimmen kann gut.'], answer: 'Ich kann gut schwimmen.', explain: 'Dua verba: kann di posisi 2, schwimmen (infinitiv) di akhir.' },
    { section: 'posisi', type: 'gap', sentence: 'In Berlin ___ meine Schwester.', translation: 'Di Berlin tinggal kakak/adik perempuanku.', base: 'wohnen', answer: ['wohnt'], explain: 'Verba di posisi 2, subjek (meine Schwester) setelahnya → wohnt.' },
    { section: 'posisi', type: 'match', q: 'Pasangkan awal kalimat dengan lanjutannya', pairs: [['Ich', 'lerne heute.'], ['Heute', 'lerne ich.'], ['Morgen', 'fahre ich nach Bandung.'], ['Wir', 'möchten Kaffee trinken.']], explain: 'Kalau posisi 1 bukan subjek, subjek datang setelah verba.' },

    { section: 'w', type: 'mcq', q: 'Pilih kata tanya', sentence: '___ kommst du? – Aus Indonesien.', options: ['Wo', 'Woher', 'Wohin', 'Wann'], answer: 'Woher', explain: 'Woher = dari mana. Jawabannya "aus …".' },
    { section: 'w', type: 'mcq', q: 'Pilih kata tanya', sentence: '___ heißt du? – Ich heiße Rina.', options: ['Wer', 'Wie', 'Was'], answer: 'Wie', explain: 'Bahasa Jerman bertanya nama dengan "Wie" (bagaimana): Wie heißt du?' },
    { section: 'w', type: 'gap', sentence: '___ wohnst du? – In Surabaya.', translation: 'Di mana kamu tinggal? – Di Surabaya.', base: 'kata tanya', answer: ['wo'], explain: 'Wo = di mana (tempat diam).' },
    { section: 'w', type: 'match', q: 'Pasangkan kata tanya dengan artinya', pairs: [['wer', 'siapa'], ['was', 'apa'], ['wann', 'kapan'], ['warum', 'mengapa']], explain: 'Semua kata tanya W ada di posisi 1.' },
    { section: 'w', type: 'order', translation: 'Kapan kursusnya mulai?', tokens: ['wann', 'beginnt', 'der', 'Kurs'], end: '?', explain: 'Kata tanya + verba + subjek.' },
    { section: 'w', type: 'tf', statement: 'Kalimat ini benar.', sentence: 'Was du machst?', answer: false, explain: 'Verba tetap di posisi 2: Was machst du?' },

    { section: 'janein', type: 'order', translation: 'Apakah kamu bisa bahasa Jerman?', tokens: ['sprichst', 'du', 'Deutsch'], end: '?', explain: 'Pertanyaan Ja/Nein: verba di posisi 1.' },
    { section: 'janein', type: 'mcq', q: 'Ubah jadi pertanyaan Ja/Nein', sentence: 'Du wohnst in Jakarta.', options: ['Wohnst du in Jakarta?', 'Wo wohnst du in Jakarta?', 'Du in Jakarta wohnst?'], answer: 'Wohnst du in Jakarta?', explain: 'Cukup pindahkan verba ke depan.' },
    { section: 'janein', type: 'tf', statement: 'Pertanyaan Ja/Nein dimulai dengan verba.', answer: true, explain: 'Benar: Kommst du? Hast du Zeit?' },
    { section: 'janein', type: 'gap', sentence: '___ du Kaffee? – Ja, gern.', translation: 'Kamu minum kopi? – Ya, boleh.', base: 'trinken', answer: ['trinkst'], explain: 'Verba di posisi 1, bentuk du: Trinkst du …?' },
    { section: 'janein', type: 'mcq', q: 'Bantah pertanyaan negatif ini', sentence: 'Kommst du nicht? – ___, ich komme!', options: ['Ja', 'Doch', 'Nein'], answer: 'Doch', explain: 'Untuk membantah pertanyaan negatif dengan "ya", pakai Doch.' },
    { section: 'janein', type: 'match', q: 'Pasangkan pertanyaan dengan jawaban', pairs: [['Hast du Zeit?', 'Ja, ich habe Zeit.'], ['Hast du keinen Hunger?', 'Doch, ich habe Hunger!'], ['Bist du müde?', 'Nein, ich bin nicht müde.']], explain: 'Ja/Nein untuk pertanyaan biasa, Doch untuk membantah pertanyaan negatif.' },
  ],
}

const NEGASI: TopicPractice = {
  sections: [
    { id: 'kein', label: 'kein' },
    { id: 'nicht', label: 'nicht' },
    { id: 'campur', label: 'Campuran & sondern' },
  ],
  items: [
    { section: 'kein', type: 'mcq', q: 'Pilih negasi yang benar', sentence: 'Das ist ___ Hund.', options: ['kein', 'keine', 'keinen', 'nicht'], answer: 'kein', explain: 'der Hund, sebagai subjek (Nominativ) → kein.' },
    { section: 'kein', type: 'mcq', q: 'Pilih negasi yang benar', sentence: 'Wir haben ___ Zeit.', options: ['kein', 'keine', 'keinen'], answer: 'keine', explain: 'die Zeit → feminin → keine.' },
    { section: 'kein', type: 'gap', sentence: 'Ich habe ___ Bruder.', translation: 'Aku tidak punya saudara laki-laki.', base: 'kein', answer: ['keinen'], explain: 'der Bruder sebagai objek haben (Akkusativ) → keinen.' },
    { section: 'kein', type: 'gap', sentence: 'Ich trinke ___ Milch.', translation: 'Aku tidak minum susu.', base: 'kein', answer: ['keine'], explain: 'die Milch → keine.' },
    { section: 'kein', type: 'tf', statement: '"kein" dipakai untuk kata benda dengan der/die/das.', answer: false, explain: 'kein untuk ein/eine atau tanpa artikel. Dengan der/die/das pakai nicht.' },
    { section: 'kein', type: 'match', q: 'Pasangkan kalimat dengan negasinya', pairs: [['Das ist ein Auto.', 'Das ist kein Auto.'], ['Ich habe eine Katze.', 'Ich habe keine Katze.'], ['Ich habe einen Stift.', 'Ich habe keinen Stift.'], ['Ich esse Fleisch.', 'Ich esse kein Fleisch.']], explain: 'kein mengikuti bentuk ein: ein → kein, eine → keine, einen → keinen.' },
    { section: 'kein', type: 'order', translation: 'Kami tidak punya mobil.', tokens: ['wir', 'haben', 'kein', 'Auto'], end: '.', explain: 'das Auto → kein Auto.' },

    { section: 'nicht', type: 'mcq', q: 'Pilih negasi yang benar', sentence: 'Ich komme heute ___.', options: ['nicht', 'kein', 'keine'], answer: 'nicht', explain: 'Menyangkal kata kerja → nicht, di akhir kalimat.' },
    { section: 'nicht', type: 'order', translation: 'Buku itu tidak baru.', tokens: ['das', 'Buch', 'ist', 'nicht', 'neu'], end: '.', explain: 'nicht sebelum adjektiva.' },
    { section: 'nicht', type: 'mcq', q: 'Pilih negasi yang benar', sentence: 'Das ist ___ der Lehrer.', options: ['nicht', 'kein', 'keinen'], answer: 'nicht', explain: 'Kata benda dengan der/die/das → nicht.' },
    { section: 'nicht', type: 'tf', statement: 'Kalimat ini benar.', sentence: 'Ich schwimme nicht gern.', answer: true, explain: 'Benar. nicht berada sebelum gern.' },
    { section: 'nicht', type: 'order', translation: 'Aku tidak tinggal di Berlin.', tokens: ['ich', 'wohne', 'nicht', 'in', 'Berlin'], end: '.', explain: 'nicht sebelum keterangan tempat.' },
    { section: 'nicht', type: 'gap', sentence: 'Das ist ___ mein Handy.', translation: 'Itu bukan HP-ku.', base: 'nicht/kein', answer: ['nicht'], explain: 'Dengan mein/dein pakai nicht.' },

    { section: 'campur', type: 'mcq', q: 'Pilih negasi yang benar', sentence: 'Ich bin ___ müde.', options: ['nicht', 'kein', 'keine'], answer: 'nicht', explain: 'müde adalah adjektiva → nicht.' },
    { section: 'campur', type: 'mcq', q: 'Pilih negasi yang benar', sentence: 'Das ist ___ Problem.', options: ['nicht', 'kein', 'keine'], answer: 'kein', explain: 'Kalimat positifnya "Das ist ein Problem". ein → kein.' },
    { section: 'campur', type: 'mcq', q: 'Pilih kata penghubung', sentence: 'Das ist kein Tee, ___ Kaffee.', options: ['aber', 'sondern', 'oder'], answer: 'sondern', explain: 'Mengoreksi setelah nicht/kein ("bukan A, melainkan B") → sondern.' },
    { section: 'campur', type: 'gap', sentence: 'Ich habe ___ Geschwister.', translation: 'Aku tidak punya saudara kandung.', base: 'nicht/kein', answer: ['keine'], explain: 'Geschwister adalah jamak → keine.' },
    { section: 'campur', type: 'tf', statement: 'Untuk "aku tidak minum kopi", bentuk yang umum adalah "Ich trinke nicht Kaffee."', answer: false, explain: 'Kata benda tanpa artikel → kein: Ich trinke keinen Kaffee.' },
    { section: 'campur', type: 'match', q: 'Pasangkan kalimat dengan negasi yang tepat', pairs: [['Ich bin müde.', 'nicht'], ['Ich habe Hunger.', 'keinen'], ['Das ist eine Tasche.', 'keine'], ['Ich wohne in Köln.', 'nicht']], explain: 'Adjektiva & tempat → nicht. Kata benda dengan ein / tanpa artikel → kein.' },
    { section: 'campur', type: 'order', translation: 'Aku tidak tinggal di Berlin, melainkan di München.', tokens: ['ich', 'wohne', 'nicht', 'in', 'Berlin,', 'sondern', 'in', 'München'], end: '.', explain: 'nicht …, sondern … untuk mengoreksi.' },
  ],
}

import { AKKUSATIV, MODAL } from './exercises-a1b'
import { PLURAL, TRENNBAR } from './exercises-a1c'
import { IMPERATIV, POSSESSIV } from './exercises-a1d'

export const PRACTICE: Record<string, Record<string, TopicPractice>> = {
  a1: { artikel: ARTIKEL, praesens: PRAESENS, satzstellung: SATZ, negasi: NEGASI, akkusativ: AKKUSATIV, modalverben: MODAL, plural: PLURAL, trennbar: TRENNBAR, possessiv: POSSESSIV, imperativ: IMPERATIV },
}

export function getPractice(level: string, topic: string): TopicPractice | undefined {
  return PRACTICE[level]?.[topic]
}
