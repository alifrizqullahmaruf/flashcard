import type { Category } from '../../content'

const zahlen: Category = {
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
}

export default zahlen
