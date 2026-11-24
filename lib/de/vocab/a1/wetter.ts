import type { Category } from '../../content'

const wetter: Category = {
  slug: 'wetter',
  title: 'Cuaca & Alam',
  titleDe: 'Wetter',
  words: [
    { de: 'Wetter', id: 'cuaca', kind: 'noun', gender: 'das', plural: '–', example: 'Wie ist das Wetter heute?', exampleId: 'Bagaimana cuaca hari ini?' },
    { de: 'Sonne', id: 'matahari', kind: 'noun', gender: 'die', plural: 'die Sonnen', example: 'Die Sonne scheint.', exampleId: 'Matahari bersinar.' },
    { de: 'Regen', id: 'hujan', kind: 'noun', gender: 'der', plural: '–', example: 'Der Regen hört nicht auf.', exampleId: 'Hujannya tidak berhenti.', hint: 'Cuaca kebanyakan der: der Regen, der Schnee, der Wind.' },
    { de: 'Schnee', id: 'salju', kind: 'noun', gender: 'der', plural: '–', example: 'Im Winter gibt es viel Schnee.', exampleId: 'Di musim dingin banyak salju.' },
    { de: 'Wind', id: 'angin', kind: 'noun', gender: 'der', plural: 'die Winde', example: 'Der Wind ist heute stark.', exampleId: 'Anginnya hari ini kencang.' },
    { de: 'Wolke', id: 'awan', kind: 'noun', gender: 'die', plural: 'die Wolken', example: 'Am Himmel sind viele Wolken.', exampleId: 'Di langit banyak awan.' },
    { de: 'Gewitter', id: 'badai petir', kind: 'noun', gender: 'das', plural: 'die Gewitter', example: 'Heute Abend kommt ein Gewitter.', exampleId: 'Malam ini akan ada badai petir.' },
    { de: 'Himmel', id: 'langit', kind: 'noun', gender: 'der', plural: 'die Himmel', example: 'Der Himmel ist blau.', exampleId: 'Langitnya biru.' },
    { de: 'Temperatur', id: 'suhu', kind: 'noun', gender: 'die', plural: 'die Temperaturen', example: 'Die Temperatur ist heute hoch.', exampleId: 'Suhunya hari ini tinggi.' },
    { de: 'Grad', id: 'derajat', kind: 'noun', gender: 'der', plural: 'die Grade', example: 'Es sind 30 Grad.', exampleId: 'Suhunya 30 derajat.', hint: 'Sebagai satuan setelah angka tetap Grad: 30 Grad.' },
    { de: 'regnen', id: 'hujan (turun hujan)', kind: 'verb', forms: 'es regnet · hat geregnet', example: 'Es regnet seit gestern.', exampleId: 'Hujan sejak kemarin.', hint: 'Cuaca memakai subjek "es": es regnet, es schneit.' },
    { de: 'schneien', id: 'turun salju', kind: 'verb', forms: 'es schneit · hat geschneit', example: 'Morgen schneit es.', exampleId: 'Besok turun salju.' },
    { de: 'scheinen', id: 'bersinar', kind: 'verb', forms: 'sie scheint · hat geschienen', example: 'Heute scheint die Sonne.', exampleId: 'Hari ini matahari bersinar.' },
    { de: 'warm', id: 'hangat', kind: 'adj', example: 'Heute ist es warm.', exampleId: 'Hari ini hangat.' },
    { de: 'kalt', id: 'dingin', kind: 'adj', example: 'Im Januar ist es kalt.', exampleId: 'Di bulan Januari dingin.' },
    { de: 'heiß', id: 'panas', kind: 'adj', example: 'In Jakarta ist es immer heiß.', exampleId: 'Di Jakarta selalu panas.' },
    { de: 'kühl', id: 'sejuk', kind: 'adj', example: 'Am Abend wird es kühl.', exampleId: 'Malam hari menjadi sejuk.' },
    { de: 'sonnig', id: 'cerah', kind: 'adj', example: 'Morgen wird es sonnig.', exampleId: 'Besok akan cerah.' },
    { de: 'windig', id: 'berangin', kind: 'adj', example: 'Am Meer ist es oft windig.', exampleId: 'Di laut sering berangin.' },
    { de: 'schön', id: 'indah, bagus, cerah', kind: 'adj', example: 'Das Wetter ist schön.', exampleId: 'Cuacanya cerah.' },
  ],
}

export default wetter
