/** Practice for A1 lessons part 2: Akkusativ, Modalverben. Same schema as exercises.ts. */
import type { TopicPractice } from './exercises'

export const AKKUSATIV: TopicPractice = {
  sections: [
    { id: 'artikel', label: 'den / einen' },
    { id: 'kein', label: 'keinen / meinen' },
    { id: 'pronomen', label: 'mich, dich, ihn …' },
  ],
  items: [
    { section: 'artikel', type: 'mcq', q: 'Pilih artikel yang benar', sentence: 'Ich sehe ___ Hund.', options: ['der', 'den', 'dem'], answer: 'den', explain: 'der Hund sebagai objek (Akkusativ) → den.' },
    { section: 'artikel', type: 'mcq', q: 'Pilih artikel yang benar', sentence: 'Ich habe ___ Bruder.', options: ['ein', 'eine', 'einen'], answer: 'einen', explain: 'der Bruder (maskulin) sebagai objek → einen.' },
    { section: 'artikel', type: 'mcq', q: 'Pilih artikel yang benar', sentence: 'Wir kaufen ___ Lampe.', options: ['ein', 'eine', 'einen'], answer: 'eine', explain: 'die Lampe (feminin) tidak berubah: eine.' },
    { section: 'artikel', type: 'gap', sentence: 'Ich brauche ___ Stift.', translation: 'Aku butuh sebuah pulpen.', base: 'ein', answer: ['einen'], explain: 'der Stift → einen Stift (Akkusativ).' },
    { section: 'artikel', type: 'gap', sentence: 'Er liest ___ Buch.', translation: 'Dia membaca sebuah buku.', base: 'ein', answer: ['ein'], explain: 'das Buch (netral) tidak berubah: ein Buch.' },
    { section: 'artikel', type: 'tf', statement: 'Di Akkusativ, artikel feminin "die" berubah menjadi "den".', answer: false, explain: 'Salah. Hanya maskulin yang berubah (der → den). Feminin tetap die.' },
    { section: 'artikel', type: 'order', translation: 'Kami mau satu kopi.', tokens: ['wir', 'möchten', 'einen', 'Kaffee'], end: '.', explain: 'der Kaffee → einen Kaffee; möchten + Akkusativ.' },
    { section: 'artikel', type: 'match', q: 'Pasangkan Nominativ dengan Akkusativ', pairs: [['der Tisch', 'den Tisch'], ['die Tasche', 'die Tasche'], ['das Auto', 'das Auto'], ['ein Apfel', 'einen Apfel']], explain: 'Hanya maskulin yang berubah: der → den, ein → einen.' },

    { section: 'kein', type: 'mcq', q: 'Pilih bentuk yang benar', sentence: 'Wir haben ___ Hunger.', options: ['kein', 'keine', 'keinen'], answer: 'keinen', explain: 'der Hunger + haben (Akkusativ) → keinen.' },
    { section: 'kein', type: 'mcq', q: 'Pilih bentuk yang benar', sentence: 'Er sucht ___ Schlüssel.', options: ['sein', 'seinen', 'seine'], answer: 'seinen', explain: 'der Schlüssel → seinen (seperti einen).' },
    { section: 'kein', type: 'gap', sentence: 'Ich besuche ___ Vater.', translation: 'Aku mengunjungi ayahku.', base: 'mein', answer: ['meinen'], explain: 'der Vater sebagai objek → meinen Vater.' },
    { section: 'kein', type: 'gap', sentence: 'Sie hat ___ Zeit.', translation: 'Dia tidak punya waktu.', base: 'kein', answer: ['keine'], explain: 'die Zeit (feminin) → keine (tidak berubah).' },
    { section: 'kein', type: 'tf', statement: 'Kalimat ini benar.', sentence: 'Es gibt einen Park in der Nähe.', answer: true, explain: 'Benar. "es gibt" selalu diikuti Akkusativ: einen Park.' },
    { section: 'kein', type: 'order', translation: 'Dia tidak punya mobil.', tokens: ['er', 'hat', 'kein', 'Auto'], end: '.', explain: 'das Auto (netral) → kein Auto, tidak berubah.' },
    { section: 'kein', type: 'match', q: 'Pasangkan kalimat dengan bentuk yang tepat', pairs: [['Ich habe ___ Hund.', 'einen'], ['Ich habe ___ Katze.', 'eine'], ['Ich habe ___ Haus.', 'ein'], ['Ich habe ___ Geschwister.', 'keine']], explain: 'der → einen, die → eine, das → ein, jamak → keine.' },

    { section: 'pronomen', type: 'mcq', q: 'Ganti dengan kata ganti', sentence: 'Ich kenne den Lehrer. → Ich kenne ___.', options: ['er', 'ihn', 'ihm'], answer: 'ihn', explain: 'er → ihn di Akkusativ.' },
    { section: 'pronomen', type: 'mcq', q: 'Pilih kata ganti', sentence: 'Liebst du ___? – Ja, ich liebe dich.', options: ['ich', 'mich', 'mir'], answer: 'mich', explain: 'ich → mich di Akkusativ.' },
    { section: 'pronomen', type: 'gap', sentence: 'Besuchst du ___ morgen?', translation: 'Kamu mengunjungi kami besok?', base: 'wir', answer: ['uns'], explain: 'wir → uns di Akkusativ.' },
    { section: 'pronomen', type: 'tf', statement: 'Kata ganti "sie" dan "es" tidak berubah di Akkusativ.', answer: true, explain: 'Benar: sie → sie, es → es. Yang berubah: mich, dich, ihn, uns, euch.' },
    { section: 'pronomen', type: 'match', q: 'Pasangkan Nominativ dengan Akkusativ', pairs: [['ich', 'mich'], ['du', 'dich'], ['er', 'ihn'], ['ihr', 'euch']], explain: 'ich → mich, du → dich, er → ihn, wir → uns, ihr → euch.' },
    { section: 'pronomen', type: 'order', translation: 'Apakah kamu kenal dia (lk)?', tokens: ['kennst', 'du', 'ihn'], end: '?', explain: 'Pertanyaan Ja/Nein: verba di depan; er → ihn.' },
  ],
}

export const MODAL: TopicPractice = {
  sections: [
    { id: 'konjugasi', label: 'Konjugasi' },
    { id: 'kalimat', label: 'Posisi di kalimat' },
    { id: 'arti', label: 'Arti & negasi' },
  ],
  items: [
    { section: 'konjugasi', type: 'mcq', q: 'Pilih bentuk yang benar', sentence: 'Er ___ gut schwimmen.', options: ['kann', 'kannt', 'könnt', 'können'], answer: 'kann', explain: 'er/sie/es = sama dengan ich, tanpa -t: er kann.' },
    { section: 'konjugasi', type: 'gap', sentence: 'Du ___ heute arbeiten.', translation: 'Kamu harus bekerja hari ini.', base: 'müssen', answer: ['musst'], explain: 'müssen → du musst (tanpa umlaut di bentuk tunggal).' },
    { section: 'konjugasi', type: 'gap', sentence: 'Ich ___ einen Tee.', translation: 'Saya ingin teh.', base: 'möchten', answer: ['möchte'], explain: 'ich möchte, du möchtest, er möchte.' },
    { section: 'konjugasi', type: 'mcq', q: 'Pilih bentuk yang benar', sentence: '___ ich hier sitzen?', options: ['Darf', 'Dürfe', 'Darfst'], answer: 'Darf', explain: 'dürfen → ich darf.' },
    { section: 'konjugasi', type: 'match', q: 'Pasangkan infinitiv dengan bentuk "ich"', pairs: [['können', 'kann'], ['müssen', 'muss'], ['wollen', 'will'], ['dürfen', 'darf']], explain: 'Bentuk tunggal berubah vokal: können → kann, dürfen → darf.' },
    { section: 'konjugasi', type: 'tf', statement: 'Bentuk "er" dari wollen adalah "er willt".', answer: false, explain: 'Salah. er will (sama dengan ich will, tanpa -t).' },
    { section: 'konjugasi', type: 'gap', sentence: 'Wir ___ morgen nicht kommen.', translation: 'Kami tidak bisa datang besok.', base: 'können', answer: ['können'], explain: 'wir können (bentuk jamak sama dengan infinitiv).' },

    { section: 'kalimat', type: 'order', translation: 'Aku bisa berenang dengan baik.', tokens: ['ich', 'kann', 'gut', 'schwimmen'], end: '.', explain: 'Modalverb di posisi 2, infinitiv di akhir.' },
    { section: 'kalimat', type: 'order', translation: 'Hari ini aku harus bekerja.', start: 'heute', tokens: ['heute', 'muss', 'ich', 'arbeiten'], end: '.', explain: 'Heute di posisi 1 → muss posisi 2 → ich → arbeiten di akhir.' },
    { section: 'kalimat', type: 'mcq', q: 'Kalimat mana yang benar?', options: ['Ich möchte einen Kaffee trinken.', 'Ich möchte trinken einen Kaffee.', 'Ich trinken möchte einen Kaffee.'], answer: 'Ich möchte einen Kaffee trinken.', explain: 'Infinitiv (trinken) selalu di akhir kalimat.' },
    { section: 'kalimat', type: 'order', translation: 'Bisakah kamu membantuku?', tokens: ['kannst', 'du', 'mir', 'helfen'], end: '?', explain: 'Pertanyaan Ja/Nein: Modalverb di depan, infinitiv di akhir.' },
    { section: 'kalimat', type: 'tf', statement: 'Kalimat ini benar.', sentence: 'Wir wollen nach Berlin fahren.', answer: true, explain: 'Benar: wollen posisi 2, fahren di akhir.' },
    { section: 'kalimat', type: 'mcq', q: 'Lengkapi kalimatnya', sentence: 'Was möchten Sie ___?', options: ['trinken', 'trinkt', 'trinkst'], answer: 'trinken', explain: 'Setelah Modalverb, kata kerja utama selalu dalam bentuk dasar (Infinitiv).' },

    { section: 'arti', type: 'mcq', q: 'Pilih Modalverb yang cocok', sentence: 'Hier ___ man nicht rauchen.', options: ['darf', 'muss', 'kann'], answer: 'darf', explain: 'Larangan: nicht dürfen = tidak boleh.' },
    { section: 'arti', type: 'mcq', q: 'Apa arti kalimat ini?', sentence: 'Du musst nicht kommen.', options: ['Kamu tidak perlu datang.', 'Kamu tidak boleh datang.', 'Kamu tidak bisa datang.'], answer: 'Kamu tidak perlu datang.', explain: 'nicht müssen = tidak perlu (bukan dilarang).' },
    { section: 'arti', type: 'match', q: 'Pasangkan Modalverb dengan artinya', pairs: [['können', 'bisa'], ['müssen', 'harus'], ['dürfen', 'boleh'], ['möchten', 'ingin (sopan)']], explain: 'wollen = mau (tegas), sollen = sebaiknya/disuruh.' },
    { section: 'arti', type: 'mcq', q: 'Di restoran, mana yang paling sopan?', options: ['Ich möchte bitte zahlen.', 'Ich will zahlen!', 'Ich muss zahlen.'], answer: 'Ich möchte bitte zahlen.', explain: 'möchten + bitte terdengar paling sopan.' },
    { section: 'arti', type: 'tf', statement: '"Der Arzt sagt, ich soll viel trinken" berarti dokter menyarankan aku banyak minum.', answer: true, explain: 'Benar. sollen = disarankan/disuruh oleh orang lain.' },
    { section: 'arti', type: 'gap', sentence: 'Ich ___ Deutsch lernen, ich fahre nach Berlin!', translation: 'Aku mau belajar bahasa Jerman, aku akan ke Berlin!', base: 'wollen', answer: ['will'], explain: 'wollen = keinginan kuat; ich will.' },
  ],
}
