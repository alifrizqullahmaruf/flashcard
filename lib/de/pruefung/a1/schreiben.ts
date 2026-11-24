import type { SchreibenSet } from '../types'

export const SCHREIBEN: SchreibenSet[] = [
  {
    id: 's1',
    teil1: {
      id: 's1-f',
      title: 'Anmeldung – Sprachschule Lingua',
      situation:
        'Ihre Freundin Ayu Lestari möchte einen Deutschkurs machen. Sie ist 24 Jahre alt und kommt aus Indonesien. Sie wohnt seit März in Köln, in der Bergstraße 8. Ayu ist verheiratet und hat keine Kinder. Sie möchte den Kurs am Abend machen, denn am Tag arbeitet sie. Sie bezahlt mit Kreditkarte.',
      example: { label: 'Name', value: 'Lestari' },
      fields: [
        { label: 'Alter', accept: ['24', '24 Jahre', 'vierundzwanzig'] },
        { label: 'Herkunftsland', accept: ['Indonesien'] },
        { label: 'Familienstand', accept: ['verheiratet'] },
        { label: 'Kurszeit (Vormittag / Abend)', accept: ['Abend', 'am Abend', 'abends'] },
        { label: 'Zahlung (bar / Überweisung / Kreditkarte)', accept: ['Kreditkarte', 'mit Kreditkarte'] },
      ],
    },
    teil2: {
      id: 's1-n',
      situation: 'Ihr Freund Jan hat Sie zu seinem Geburtstag am Samstag eingeladen. Sie können nicht kommen. Schreiben Sie Jan eine E-Mail.',
      register: 'du',
      points: ['Bedanken Sie sich für die Einladung.', 'Schreiben Sie, warum Sie nicht kommen können.', 'Machen Sie einen Vorschlag für ein anderes Treffen.'],
      cues: [['danke', 'dank', 'einladung'], ['denn', 'weil', 'leider', 'muss', 'krank', 'arbeit'], ['können wir', 'hast du', 'treffen', 'nächste', 'sonntag', 'zeit']],
      model:
        'Lieber Jan,\nvielen Dank für die Einladung zu deinem Geburtstag! Leider kann ich am Samstag nicht kommen, denn ich muss arbeiten. Hast du am Sonntag Zeit? Dann können wir zusammen Kaffee trinken.\nViele Grüße\nRina',
    },
  },
  {
    id: 's2',
    teil1: {
      id: 's2-f',
      title: 'Hotel Sonnenhof – Reservierung',
      situation:
        'Herr Budi Santoso möchte mit seiner Frau ein Hotelzimmer buchen. Sie kommen am 12. Mai und fahren am 15. Mai wieder ab. Sie möchten ein Doppelzimmer mit Frühstück. Herr Santoso hat die Telefonnummer 0176 55 23 98. Sie kommen mit dem Auto.',
      example: { label: 'Name', value: 'Santoso' },
      fields: [
        { label: 'Anzahl Personen', accept: ['2', 'zwei'] },
        { label: 'Ankunft', accept: ['12. Mai', '12.5.', '12.05.', '12. 5.', 'am 12. Mai'] },
        { label: 'Zimmer (Einzelzimmer / Doppelzimmer)', accept: ['Doppelzimmer'] },
        { label: 'Telefon', accept: ['0176 55 23 98', '0176552398', '0176 552398'] },
        { label: 'Parkplatz (ja / nein)', accept: ['ja'] },
      ],
    },
    teil2: {
      id: 's2-n',
      situation: 'Sie möchten im Sportzentrum einen Yogakurs machen. Schreiben Sie eine E-Mail an das Sportzentrum.',
      register: 'Sie',
      points: ['Fragen Sie, wann der Kurs ist.', 'Fragen Sie nach dem Preis.', 'Fragen Sie, was Sie mitbringen müssen.'],
      cues: [['wann', 'uhr', 'tag', 'zeit'], ['kostet', 'preis', 'wie viel', 'euro'], ['mitbringen', 'brauche', 'muss']],
      model:
        'Sehr geehrte Damen und Herren,\nich möchte gern einen Yogakurs machen. Wann ist der Kurs? Wie viel kostet er? Und was muss ich mitbringen?\nMit freundlichen Grüßen\nBudi Santoso',
    },
  },
]
