import type { SprechenSet } from '../types'

/** Teil 1: the same for every exam — introduce yourself, then spell and say a number. */
export const VORSTELLEN = {
  prompts: ['Name?', 'Alter?', 'Land?', 'Wohnort?', 'Sprachen?', 'Beruf?', 'Hobby?'],
  model:
    'Mein Name ist Rina. Ich bin 23 Jahre alt. Ich komme aus Indonesien. Ich wohne in Bandung. Ich spreche Indonesisch, Englisch und ein bisschen Deutsch. Ich bin Studentin. Mein Hobby ist Lesen.',
  spell: { q: 'Buchstabieren Sie bitte Ihren Namen.', model: 'R – I – N – A.' },
  number: { q: 'Wie ist Ihre Telefonnummer?', model: 'Null acht eins zwei, drei vier fünf sechs, sieben acht.' },
}

export const SPRECHEN: SprechenSet[] = [
  {
    id: 's1',
    teil2: [
      {
        title: 'Essen und Trinken',
        cards: [
          { word: 'Frühstück', question: 'Was isst du zum Frühstück?', answer: 'Zum Frühstück esse ich Brot mit Käse.' },
          { word: 'Lieblingsessen', question: 'Was ist dein Lieblingsessen?', answer: 'Mein Lieblingsessen ist Nasi Goreng.' },
          { word: 'Getränk', question: 'Was trinkst du gern?', answer: 'Ich trinke gern Tee.' },
        ],
      },
      {
        title: 'Wohnen',
        cards: [
          { word: 'Wohnung', question: 'Wie groß ist deine Wohnung?', answer: 'Meine Wohnung hat zwei Zimmer.' },
          { word: 'Nachbarn', question: 'Kennst du deine Nachbarn?', answer: 'Ja, meine Nachbarn sind sehr nett.' },
          { word: 'Küche', question: 'Hast du eine große Küche?', answer: 'Nein, meine Küche ist klein.' },
        ],
      },
    ],
    teil3: [
      { word: 'Fenster', situation: 'Es ist warm im Raum.', request: 'Können Sie bitte das Fenster aufmachen?', reply: 'Ja, gern.' },
      { word: 'Kugelschreiber', situation: 'Sie haben keinen Stift.', request: 'Kannst du mir bitte einen Kugelschreiber geben?', reply: 'Ja, hier bitte.' },
      { word: 'Wasser', situation: 'Sie haben Durst.', request: 'Ich hätte gern ein Glas Wasser, bitte.', reply: 'Gern, einen Moment.' },
      { word: 'Licht', situation: 'Es ist dunkel.', request: 'Mach bitte das Licht an!', reply: 'Okay, kein Problem.' },
      { word: 'Fahrkarte', situation: 'Sie sind am Bahnhof.', request: 'Eine Fahrkarte nach Berlin, bitte.', reply: 'Das macht 39 Euro.' },
      { word: 'Handy', situation: 'Sie müssen telefonieren.', request: 'Darf ich bitte dein Handy benutzen?', reply: 'Ja, klar.' },
    ],
  },
  {
    id: 's2',
    teil2: [
      {
        title: 'Freizeit',
        cards: [
          { word: 'Wochenende', question: 'Was machst du am Wochenende?', answer: 'Am Wochenende treffe ich Freunde.' },
          { word: 'Sport', question: 'Machst du gern Sport?', answer: 'Ja, ich spiele gern Fußball.' },
          { word: 'Kino', question: 'Wie oft gehst du ins Kino?', answer: 'Ich gehe einmal im Monat ins Kino.' },
        ],
      },
      {
        title: 'Arbeit und Schule',
        cards: [
          { word: 'Beruf', question: 'Was sind Sie von Beruf?', answer: 'Ich bin Krankenschwester.' },
          { word: 'Kollegen', question: 'Wie sind deine Kollegen?', answer: 'Meine Kollegen sind freundlich.' },
          { word: 'Pause', question: 'Wann hast du Pause?', answer: 'Ich habe um zwölf Uhr Pause.' },
        ],
      },
    ],
    teil3: [
      { word: 'Tür', situation: 'Sie tragen viele Taschen.', request: 'Können Sie bitte die Tür aufmachen?', reply: 'Natürlich.' },
      { word: 'Rechnung', situation: 'Sie sind im Restaurant und möchten gehen.', request: 'Die Rechnung, bitte!', reply: 'Sofort.' },
      { word: 'Kaffee', situation: 'Sie sind im Café.', request: 'Ich möchte einen Kaffee mit Milch, bitte.', reply: 'Gern.' },
      { word: 'Musik', situation: 'Die Musik ist zu laut.', request: 'Kannst du bitte die Musik leiser machen?', reply: 'Oh, Entschuldigung!' },
      { word: 'Stadtplan', situation: 'Sie sind neu in der Stadt.', request: 'Haben Sie einen Stadtplan für mich?', reply: 'Ja, hier, bitte.' },
      { word: 'Foto', situation: 'Sie sind mit Freunden vor einem Museum.', request: 'Können Sie bitte ein Foto von uns machen?', reply: 'Ja, gern!' },
    ],
  },
]
