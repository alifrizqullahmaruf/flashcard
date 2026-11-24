import type { Category } from '../../content'

const essen: Category = {
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
}

export default essen
