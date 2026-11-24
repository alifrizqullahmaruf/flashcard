/** Practice for A1 lessons part 3: Plural, trennbare Verben. Same schema as exercises.ts. */
import type { TopicPractice } from './exercises'

export const PLURAL: TopicPractice = {
  sections: [
    { id: 'pola', label: 'Pola akhiran' },
    { id: 'umlaut', label: 'Umlaut' },
    { id: 'kalimat', label: 'Jamak di kalimat' },
  ],
  items: [
    { section: 'pola', type: 'mcq', q: 'Pilih bentuk jamak yang benar', sentence: 'die Lampe → die ___', options: ['Lampen', 'Lampes', 'Lampe'], answer: 'Lampen', explain: 'Feminin berakhiran -e → tambah -n.' },
    { section: 'pola', type: 'mcq', q: 'Pilih bentuk jamak yang benar', sentence: 'das Auto → die ___', options: ['Auten', 'Autos', 'Autoe'], answer: 'Autos', explain: 'Kata serapan / berakhiran vokal → -s.' },
    { section: 'pola', type: 'gap', sentence: 'die Lehrerin → die ___', translation: 'guru perempuan → guru-guru perempuan', base: 'jamak', answer: ['Lehrerinnen'], explain: '-in → -innen (n ditulis dua kali).' },
    { section: 'pola', type: 'gap', sentence: 'die Wohnung → die ___', translation: 'apartemen → apartemen-apartemen', base: 'jamak', answer: ['Wohnungen'], explain: '-ung → -ungen.' },
    { section: 'pola', type: 'mcq', q: 'Pilih bentuk jamak yang benar', sentence: 'das Mädchen → die ___', options: ['Mädchen', 'Mädchens', 'Mädchenen'], answer: 'Mädchen', explain: '-chen tidak berubah di jamak.' },
    { section: 'pola', type: 'tf', statement: 'Bentuk jamak semua kata benda memakai artikel "die".', answer: true, explain: 'Benar, apa pun gendernya: der Tisch → die Tische, das Kind → die Kinder.' },
    { section: 'pola', type: 'match', q: 'Pasangkan tunggal dengan jamaknya', pairs: [['der Tisch', 'die Tische'], ['das Kind', 'die Kinder'], ['die Frau', 'die Frauen'], ['das Hotel', 'die Hotels']], explain: '-e, -er, -en, -s: empat pola yang paling sering.' },

    { section: 'umlaut', type: 'mcq', q: 'Pilih bentuk jamak yang benar', sentence: 'das Haus → die ___', options: ['Hause', 'Häuser', 'Hausen'], answer: 'Häuser', explain: 'Netral pendek → -er + umlaut (au → äu).' },
    { section: 'umlaut', type: 'mcq', q: 'Pilih bentuk jamak yang benar', sentence: 'der Vater → die ___', options: ['Vatern', 'Väter', 'Vaters'], answer: 'Väter', explain: 'Akhiran -er → tanpa akhiran, tapi a → ä.' },
    { section: 'umlaut', type: 'gap', sentence: 'der Stuhl → die ___', translation: 'kursi → kursi-kursi', base: 'jamak', answer: ['Stühle'], explain: '-e + umlaut: u → ü.' },
    { section: 'umlaut', type: 'gap', sentence: 'das Buch → die ___', translation: 'buku → buku-buku', base: 'jamak', answer: ['Bücher'], explain: '-er + umlaut: u → ü.' },
    { section: 'umlaut', type: 'tf', statement: 'Jamak dari "der Apfel" adalah "die Apfels".', answer: false, explain: 'Salah. Akhiran -el → tanpa akhiran + umlaut: die Äpfel.' },
    { section: 'umlaut', type: 'match', q: 'Pasangkan tunggal dengan jamaknya', pairs: [['der Fuß', 'die Füße'], ['die Stadt', 'die Städte'], ['der Bahnhof', 'die Bahnhöfe'], ['die Hand', 'die Hände']], explain: 'Umlaut sering muncul di jamak -e: a → ä, o → ö, u → ü.' },

    { section: 'kalimat', type: 'mcq', q: 'Pilih bentuk yang benar', sentence: 'Ich habe zwei ___.', options: ['Bruder', 'Brüder', 'Brudern'], answer: 'Brüder', explain: 'Setelah angka > 1 pakai jamak: der Bruder → die Brüder.' },
    { section: 'kalimat', type: 'mcq', q: 'Pilih kata kerja yang benar', sentence: 'Die Kinder ___ im Garten.', options: ['spielt', 'spielen', 'spielst'], answer: 'spielen', explain: 'Subjek jamak (die Kinder = sie) → -en.' },
    { section: 'kalimat', type: 'gap', sentence: 'Wir haben ___ Stühle.', translation: 'Kami tidak punya kursi.', base: 'kein', answer: ['keine'], explain: 'Jamak → keine.' },
    { section: 'kalimat', type: 'order', translation: 'Buku-buku itu baru.', tokens: ['die', 'Bücher', 'sind', 'neu'], end: '.', explain: 'Subjek jamak → sind (bukan ist).' },
    { section: 'kalimat', type: 'tf', statement: 'Kalimat ini benar.', sentence: 'Ich kaufe drei Äpfel.', answer: true, explain: 'Benar: drei + jamak (Äpfel).' },
    { section: 'kalimat', type: 'order', translation: 'Anak-anak bermain di kebun.', tokens: ['die', 'Kinder', 'spielen', 'im', 'Garten'], end: '.', explain: 'die Kinder (jamak) → spielen.' },
  ],
}

export const TRENNBAR: TopicPractice = {
  sections: [
    { id: 'posisi', label: 'Awalan di akhir' },
    { id: 'modal', label: 'Dengan Modalverb' },
    { id: 'prefiks', label: 'Terpisah atau tidak?' },
  ],
  items: [
    { section: 'posisi', type: 'order', translation: 'Aku bangun jam tujuh.', tokens: ['ich', 'stehe', 'um', 'sieben', 'Uhr', 'auf'], end: '.', explain: 'aufstehen: stehe di posisi 2, auf di akhir.' },
    { section: 'posisi', type: 'mcq', q: 'Kalimat mana yang benar?', options: ['Ich rufe dich morgen an.', 'Ich anrufe dich morgen.', 'Ich rufe an dich morgen.'], answer: 'Ich rufe dich morgen an.', explain: 'Awalan an- pindah ke akhir kalimat.' },
    { section: 'posisi', type: 'gap', sentence: 'Der Zug kommt um neun Uhr ___.', translation: 'Keretanya tiba jam sembilan.', base: 'ankommen', answer: ['an'], explain: 'ankommen → kommt … an.' },
    { section: 'posisi', type: 'gap', sentence: 'Wir ___ im Supermarkt ein.', translation: 'Kami berbelanja di supermarket.', base: 'einkaufen', answer: ['kaufen'], explain: 'einkaufen → wir kaufen … ein.' },
    { section: 'posisi', type: 'order', translation: 'Kapan kamu bangun?', tokens: ['wann', 'stehst', 'du', 'auf'], end: '?', explain: 'Dalam pertanyaan pun awalan tetap di akhir.' },
    { section: 'posisi', type: 'tf', statement: 'Kalimat ini benar.', sentence: 'Er fernsieht am Abend.', answer: false, explain: 'Salah. fernsehen dipisah: Er sieht am Abend fern.' },
    { section: 'posisi', type: 'match', q: 'Pasangkan infinitiv dengan kalimatnya', pairs: [['aufstehen', 'Ich stehe früh auf.'], ['einsteigen', 'Wir steigen hier ein.'], ['mitkommen', 'Kommst du mit?'], ['zumachen', 'Mach die Tür zu!']], explain: 'Awalan selalu menutup kalimat.' },

    { section: 'modal', type: 'mcq', q: 'Kalimat mana yang benar?', options: ['Ich muss früh aufstehen.', 'Ich muss früh stehen auf.', 'Ich muss aufstehen früh.'], answer: 'Ich muss früh aufstehen.', explain: 'Dengan Modalverb, kata kerja terpisah utuh di akhir.' },
    { section: 'modal', type: 'order', translation: 'Bisakah kamu meneleponku nanti?', tokens: ['kannst', 'du', 'mich', 'später', 'anrufen'], end: '?', explain: 'Modalverb di depan, anrufen utuh di akhir.' },
    { section: 'modal', type: 'gap', sentence: 'In Köln müssen Sie ___.', translation: 'Di Köln Anda harus ganti kereta.', base: 'umsteigen', answer: ['umsteigen'], explain: 'Setelah müssen → infinitiv utuh: umsteigen.' },
    { section: 'modal', type: 'tf', statement: 'Kalimat ini benar.', sentence: 'Ich möchte heute einkaufen.', answer: true, explain: 'Benar. möchten + einkaufen (utuh di akhir).' },
    { section: 'modal', type: 'mcq', q: 'Lengkapi kalimatnya', sentence: 'Wir wollen im Mai ___.', options: ['umziehen', 'ziehen um', 'umgezogen'], answer: 'umziehen', explain: 'wollen + infinitiv utuh: umziehen.' },
    { section: 'modal', type: 'order', translation: 'Aku harus merapikan kamarku.', tokens: ['ich', 'muss', 'mein', 'Zimmer', 'aufräumen'], end: '.', explain: 'muss posisi 2, aufräumen utuh di akhir.' },

    { section: 'prefiks', type: 'mcq', q: 'Kata kerja mana yang TIDAK terpisah?', options: ['bezahlen', 'aufstehen', 'anrufen'], answer: 'bezahlen', explain: 'be- tidak pernah dipisah: Ich bezahle.' },
    { section: 'prefiks', type: 'mcq', q: 'Pilih kalimat yang benar', options: ['Ich verstehe das nicht.', 'Ich stehe das nicht ver.', 'Ich verstehe nicht das.'], answer: 'Ich verstehe das nicht.', explain: 'ver- tidak dipisah.' },
    { section: 'prefiks', type: 'tf', statement: 'Awalan "ein-" pada einkaufen dipisah: Ich kaufe ein.', answer: true, explain: 'Benar. ein- termasuk awalan terpisah.' },
    { section: 'prefiks', type: 'match', q: 'Terpisah atau tidak?', pairs: [['aufräumen', 'terpisah'], ['besuchen', 'tidak terpisah'], ['abfahren', 'terpisah'], ['verkaufen', 'tidak terpisah']], explain: 'auf-, ab- terpisah. be-, ver- tidak pernah.' },
    { section: 'prefiks', type: 'gap', sentence: 'Wir ___ unsere Oma.', translation: 'Kami mengunjungi nenek kami.', base: 'besuchen', answer: ['besuchen'], explain: 'be- tidak dipisah: wir besuchen.' },
  ],
}
