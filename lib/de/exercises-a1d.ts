/** Practice for A1 lessons part 4: Possessivartikel, Imperativ. Same schema as exercises.ts. */
import type { TopicPractice } from './exercises'

export const POSSESSIV: TopicPractice = {
  sections: [
    { id: 'pemilik', label: 'mein, dein, sein, ihr …' },
    { id: 'akhiran', label: 'Akhiran -e / -en' },
  ],
  items: [
    { section: 'pemilik', type: 'mcq', q: 'Pilih kata yang tepat', sentence: 'Das ist Tom und ___ Schwester.', options: ['seine', 'ihre', 'deine'], answer: 'seine', explain: 'Pemiliknya Tom (laki-laki) → sein; Schwester feminin → seine.' },
    { section: 'pemilik', type: 'mcq', q: 'Pilih kata yang tepat', sentence: 'Das ist Lisa und ___ Bruder.', options: ['sein', 'ihr', 'ihre'], answer: 'ihr', explain: 'Pemiliknya Lisa (perempuan) → ihr; Bruder maskulin Nominativ → ihr.' },
    { section: 'pemilik', type: 'gap', sentence: 'Wie ist ___ Name? (du)', translation: 'Siapa namamu?', base: 'du', answer: ['dein'], explain: 'du → dein; der Name → dein Name.' },
    { section: 'pemilik', type: 'gap', sentence: 'Ist das ___ Koffer, Herr Weber?', translation: 'Apakah ini koper Anda, Pak Weber?', base: 'Sie', answer: ['Ihr'], explain: 'Sie (formal) → Ihr dengan huruf besar.' },
    { section: 'pemilik', type: 'match', q: 'Pasangkan pemilik dengan artikel miliknya', pairs: [['ich', 'mein'], ['du', 'dein'], ['wir', 'unser'], ['ihr (kalian)', 'euer']], explain: 'er → sein, sie → ihr, Sie → Ihr.' },
    { section: 'pemilik', type: 'tf', statement: '"sein" atau "ihr" dipilih berdasarkan gender bendanya.', answer: false, explain: 'Salah. Dipilih berdasarkan pemiliknya: Tom → sein, Lisa → ihr.' },
    { section: 'pemilik', type: 'order', translation: 'Ini ayahku.', tokens: ['das', 'ist', 'mein', 'Vater'], end: '.', explain: 'ich → mein; der Vater → mein Vater.' },
    { section: 'pemilik', type: 'mcq', q: 'Pilih kata yang tepat (anjing milik mereka)', sentence: 'Die Kinder suchen ___ Hund.', options: ['ihren', 'seinen', 'unseren'], answer: 'ihren', explain: 'Pemiliknya mereka (sie) → ihr; der Hund sebagai objek → ihren.' },

    { section: 'akhiran', type: 'mcq', q: 'Pilih akhiran yang benar', sentence: '___ Mutter ist Lehrerin.', options: ['Mein', 'Meine', 'Meinen'], answer: 'Meine', explain: 'die Mutter (feminin) → meine.' },
    { section: 'akhiran', type: 'mcq', q: 'Pilih akhiran yang benar', sentence: 'Ich besuche ___ Bruder.', options: ['mein', 'meine', 'meinen'], answer: 'meinen', explain: 'der Bruder sebagai objek (Akkusativ) → meinen.' },
    { section: 'akhiran', type: 'gap', sentence: '___ Kinder spielen draußen. (wir)', translation: 'Anak-anak kami bermain di luar.', base: 'unser', answer: ['unsere'], explain: 'Jamak → unsere.' },
    { section: 'akhiran', type: 'gap', sentence: 'Wo ist ___ Wohnung? (ihr)', translation: 'Di mana apartemen kalian?', base: 'euer', answer: ['eure'], explain: 'euer + -e → eure (e kedua hilang).' },
    { section: 'akhiran', type: 'gap', sentence: 'Anna sucht ___ Schlüssel.', translation: 'Anna mencari kuncinya.', base: 'ihr', answer: ['ihren'], explain: 'der Schlüssel sebagai objek → ihren.' },
    { section: 'akhiran', type: 'tf', statement: 'Akhiran possessivartikel sama polanya dengan ein / kein.', answer: true, explain: 'Benar: mein/meine/mein, Akk maskulin meinen, persis seperti ein/eine/einen.' },
    { section: 'akhiran', type: 'match', q: 'Pasangkan kata benda dengan bentuk "mein" (Nominativ)', pairs: [['Vater', 'mein'], ['Mutter', 'meine'], ['Kind', 'mein'], ['Eltern', 'meine']], explain: 'Maskulin/netral → mein, feminin/jamak → meine.' },
    { section: 'akhiran', type: 'order', translation: 'Ibuku seorang guru.', tokens: ['meine', 'Mutter', 'ist', 'Lehrerin'], end: '.', explain: 'die Mutter → meine Mutter; profesi tanpa artikel.' },
  ],
}

export const IMPERATIV: TopicPractice = {
  sections: [
    { id: 'du', label: 'Bentuk du' },
    { id: 'ihr-sie', label: 'Bentuk ihr & Sie' },
    { id: 'khusus', label: 'Terpisah & sein' },
  ],
  items: [
    { section: 'du', type: 'mcq', q: 'Imperativ "du" dari kommen', options: ['Komm!', 'Kommst!', 'Kommen!'], answer: 'Komm!', explain: 'du kommst → buang -st dan du → Komm!' },
    { section: 'du', type: 'mcq', q: 'Imperativ "du" dari lesen', options: ['Les!', 'Lies!', 'Liest!'], answer: 'Lies!', explain: 'e → ie tetap: du liest → Lies!' },
    { section: 'du', type: 'gap', sentence: '___ doch ein Stück Kuchen!', translation: 'Ambillah sepotong kue!', base: 'nehmen, du', answer: ['nimm'], explain: 'du nimmst → Nimm!' },
    { section: 'du', type: 'gap', sentence: '___ vorsichtig!', translation: 'Hati-hati menyetir!', base: 'fahren, du', answer: ['fahr', 'fahre'], explain: 'a → ä TIDAK dipakai di Imperativ: Fahr! (bukan Fähr!).' },
    { section: 'du', type: 'tf', statement: 'Imperativ "du" dari helfen adalah "Hilf!".', answer: true, explain: 'Benar: du hilfst → Hilf!' },
    { section: 'du', type: 'match', q: 'Pasangkan infinitiv dengan Imperativ "du"', pairs: [['geben', 'Gib!'], ['essen', 'Iss!'], ['schlafen', 'Schlaf!'], ['warten', 'Warte!']], explain: 'e → i tetap, a → ä hilang; akar -t tambah -e.' },

    { section: 'ihr-sie', type: 'mcq', q: 'Imperativ "ihr" dari kommen', sentence: 'Kinder, ___ essen!', options: ['kommt', 'komm', 'kommen'], answer: 'kommt', explain: 'ihr kommt → Kommt! (tanpa ihr).' },
    { section: 'ihr-sie', type: 'order', translation: 'Silakan tunggu sebentar.', tokens: ['warten', 'Sie', 'bitte', 'einen', 'Moment'], end: '.', explain: 'Bentuk Sie: verba + Sie di depan.' },
    { section: 'ihr-sie', type: 'gap', sentence: '___ Sie bitte langsam!', translation: 'Tolong bicara pelan-pelan!', base: 'sprechen, Sie', answer: ['sprechen'], explain: 'Bentuk Sie: infinitiv + Sie → Sprechen Sie!' },
    { section: 'ihr-sie', type: 'mcq', q: 'Kalimat mana yang paling sopan untuk orang asing?', options: ['Öffnen Sie bitte das Fenster.', 'Öffne das Fenster!', 'Öffnet das Fenster!'], answer: 'Öffnen Sie bitte das Fenster.', explain: 'Bentuk Sie + bitte = sopan/formal.' },
    { section: 'ihr-sie', type: 'tf', statement: 'Di Imperativ "ihr", kata "ihr" tetap ditulis: "Ihr kommt!"', answer: false, explain: 'Salah. Imperativ ihr tanpa ihr: Kommt!' },
    { section: 'ihr-sie', type: 'gap', sentence: 'Kinder, ___ eure Hausaufgaben!', translation: 'Anak-anak, kerjakan PR kalian!', base: 'machen, ihr', answer: ['macht'], explain: 'ihr macht → Macht!' },

    { section: 'khusus', type: 'order', translation: 'Bangun!', tokens: ['steh', 'auf'], end: '!', explain: 'aufstehen: awalan di akhir → Steh auf!' },
    { section: 'khusus', type: 'order', translation: 'Telepon aku besok!', tokens: ['ruf', 'mich', 'morgen', 'an'], end: '!', explain: 'anrufen → Ruf … an!' },
    { section: 'khusus', type: 'mcq', q: 'Imperativ "du" dari sein', sentence: '___ ruhig!', options: ['Bist', 'Sei', 'Seid'], answer: 'Sei', explain: 'sein: Sei! (du), Seid! (ihr), Seien Sie! (Sie).' },
    { section: 'khusus', type: 'mcq', q: 'Lengkapi kalimatnya', sentence: '___ Sie bitte pünktlich!', options: ['Sind', 'Seien', 'Seid'], answer: 'Seien', explain: 'Bentuk Sie dari sein: Seien Sie!' },
    { section: 'khusus', type: 'gap', sentence: 'Mach bitte die Tür ___!', translation: 'Tolong tutup pintunya!', base: 'zumachen', answer: ['zu'], explain: 'zumachen → Mach … zu!' },
    { section: 'khusus', type: 'tf', statement: 'Kalimat ini benar.', sentence: 'Komm doch mit!', answer: true, explain: 'Benar. mitkommen → Komm … mit!; doch membuatnya lebih ramah.' },
  ],
}
