/** Practice for A1 lesson part 5: clock time & dates. Same schema as exercises.ts. */
import type { TopicPractice } from './exercises'

export const ZEIT: TopicPractice = {
  sections: [
    { id: 'uhrzeit', label: 'Jam' },
    { id: 'praeposition', label: 'um / am / im' },
    { id: 'datum', label: 'Tanggal' },
  ],
  items: [
    { section: 'uhrzeit', type: 'mcq', q: 'Jam berapa "halb neun"?', options: ['8:30', '9:30', '9:00'], answer: '8:30', explain: 'halb neun = setengah menuju sembilan = 8:30.' },
    { section: 'uhrzeit', type: 'mcq', q: 'Bagaimana menyebut 8:15?', options: ['Viertel nach acht', 'Viertel vor acht', 'halb acht'], answer: 'Viertel nach acht', explain: 'Seperempat lewat delapan = Viertel nach acht.' },
    { section: 'uhrzeit', type: 'mcq', q: 'Bagaimana menyebut 8:45?', options: ['Viertel vor neun', 'Viertel nach neun', 'Viertel vor acht'], answer: 'Viertel vor neun', explain: 'Seperempat sebelum sembilan = Viertel vor neun.' },
    { section: 'uhrzeit', type: 'gap', sentence: 'Es ist zehn ___ zwölf. (11:50)', translation: 'Jam dua belas kurang sepuluh.', base: 'nach/vor', answer: ['vor'], explain: '10 menit sebelum jam 12 → zehn vor zwölf.' },
    { section: 'uhrzeit', type: 'tf', statement: '"halb drei" berarti jam 3:30.', answer: false, explain: 'Salah. halb drei = 2:30 (setengah menuju tiga).' },
    { section: 'uhrzeit', type: 'match', q: 'Pasangkan jam dengan ucapannya', pairs: [['7:30', 'halb acht'], ['7:15', 'Viertel nach sieben'], ['7:45', 'Viertel vor acht'], ['7:05', 'fünf nach sieben']], explain: 'nach = lewat, vor = sebelum, halb = setengah menuju jam berikutnya.' },
    { section: 'uhrzeit', type: 'order', translation: 'Jam berapa sekarang?', tokens: ['wie', 'spät', 'ist', 'es'], end: '?', explain: 'Wie spät ist es? = Jam berapa sekarang?' },

    { section: 'praeposition', type: 'mcq', q: 'Pilih kata depan yang tepat', sentence: 'Der Kurs beginnt ___ neun Uhr.', options: ['um', 'am', 'im'], answer: 'um', explain: 'Jam → um.' },
    { section: 'praeposition', type: 'mcq', q: 'Pilih kata depan yang tepat', sentence: 'Wir kommen ___ Samstag.', options: ['um', 'am', 'im'], answer: 'am', explain: 'Hari → am.' },
    { section: 'praeposition', type: 'mcq', q: 'Pilih kata depan yang tepat', sentence: '___ Juli habe ich Urlaub.', options: ['Um', 'Am', 'Im'], answer: 'Im', explain: 'Bulan → im.' },
    { section: 'praeposition', type: 'gap', sentence: 'Ich arbeite ___ Abend.', translation: 'Aku bekerja di malam hari.', base: 'um/am/im', answer: ['am'], explain: 'Bagian hari → am (am Morgen, am Abend). Pengecualian: in der Nacht.' },
    { section: 'praeposition', type: 'gap', sentence: 'Die Praxis ist von acht ___ zwölf Uhr offen.', translation: 'Tempat praktik buka dari jam 8 sampai 12.', base: 'rentang', answer: ['bis'], explain: 'Rentang waktu: von … bis.' },
    { section: 'praeposition', type: 'tf', statement: 'Untuk musim dipakai "im": im Winter.', answer: true, explain: 'Benar: im Frühling, im Sommer, im Herbst, im Winter.' },
    { section: 'praeposition', type: 'match', q: 'Pasangkan kata depan dengan contohnya', pairs: [['um', '8 Uhr'], ['am', 'Montag'], ['im', 'Dezember'], ['von … bis', '9 bis 17 Uhr']], explain: 'um = jam, am = hari/tanggal, im = bulan/musim.' },
    { section: 'praeposition', type: 'order', translation: 'Hari Senin aku bekerja jam delapan.', start: 'am', tokens: ['am', 'Montag', 'arbeite', 'ich', 'um', 'acht'], end: '.', explain: 'Am Montag di posisi 1 → verba posisi 2 → subjek → um acht.' },

    { section: 'datum', type: 'mcq', q: 'Bagaimana menyebut 1. Mai?', sentence: 'Heute ist der ___ Mai.', options: ['erste', 'einste', 'eins'], answer: 'erste', explain: 'Pengecualian: 1. = der erste.' },
    { section: 'datum', type: 'mcq', q: 'Bagaimana menyebut 3. Juni?', sentence: 'Heute ist der ___ Juni.', options: ['dritte', 'dreite', 'dreiste'], answer: 'dritte', explain: 'Pengecualian: 3. = der dritte.' },
    { section: 'datum', type: 'gap', sentence: 'Mein Geburtstag ist am ___ Juli. (20.)', translation: 'Ulang tahunku tanggal dua puluh Juli.', base: 'zwanzig', answer: ['zwanzigsten'], explain: '20 ke atas → -ste; setelah "am" → -sten: am zwanzigsten.' },
    { section: 'datum', type: 'tf', statement: 'Tanggal "4.5." dalam tulisan Jerman berarti 4 Mei.', answer: true, explain: 'Benar. Urutannya hari.bulan, sama seperti di Indonesia.' },
    { section: 'datum', type: 'match', q: 'Pasangkan tanggal dengan ucapannya', pairs: [['1.', 'erste'], ['7.', 'siebte'], ['10.', 'zehnte'], ['21.', 'einundzwanzigste']], explain: '1–19 → -te (pengecualian erste, dritte, siebte), 20+ → -ste.' },
  ],
}
