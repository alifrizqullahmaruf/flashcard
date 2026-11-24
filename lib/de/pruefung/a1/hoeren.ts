import type { HoerenSet } from '../types'

export const HOEREN: HoerenSet[] = [
  {
    id: 's1',
    teil1: [
      {
        id: 's1-h1-1', q: 'Wann fährt der Zug nach München?', options: ['Um 10.15 Uhr', 'Um 10.50 Uhr', 'Um 11.15 Uhr'], answer: 1, explain: 'Der Mann sagt: „Der nächste Zug fährt um zehn Uhr fünfzig.“',
        lines: [
          { who: 'f', text: 'Entschuldigung, wann fährt der nächste Zug nach München?' },
          { who: 'm', text: 'Der Zug um zehn Uhr fünfzehn ist schon weg. Der nächste Zug fährt um zehn Uhr fünfzig.' },
          { who: 'f', text: 'Zehn Uhr fünfzig. Vielen Dank!' },
        ],
      },
      {
        id: 's1-h1-2', q: 'Was kauft die Frau?', options: ['Äpfel', 'Tomaten', 'Kartoffeln'], answer: 1, explain: 'Äpfel gibt es heute nicht; sie nimmt ein Kilo Tomaten.',
        lines: [
          { who: 'm', text: 'Guten Tag, was möchten Sie?' },
          { who: 'f', text: 'Ich hätte gern ein Kilo Äpfel.' },
          { who: 'm', text: 'Tut mir leid, Äpfel haben wir heute nicht mehr.' },
          { who: 'f', text: 'Schade. Dann nehme ich ein Kilo Tomaten.' },
        ],
      },
      {
        id: 's1-h1-3', q: 'Wo ist die Toilette?', options: ['Im ersten Stock', 'Im Erdgeschoss', 'Im zweiten Stock'], answer: 0, explain: '„Die Toilette ist im ersten Stock, neben dem Aufzug.“',
        lines: [
          { who: 'f', text: 'Entschuldigung, wo ist hier die Toilette?' },
          { who: 'm', text: 'Hier im Erdgeschoss leider nicht. Die Toilette ist im ersten Stock, neben dem Aufzug.' },
        ],
      },
      {
        id: 's1-h1-4', q: 'Wie viel kostet das T-Shirt?', options: ['9 Euro', '19 Euro', '29 Euro'], answer: 1, explain: 'Früher 29 Euro, heute nur 19 Euro.',
        lines: [
          { who: 'f', text: 'Wie viel kostet das T-Shirt hier?' },
          { who: 'm', text: 'Es hat neunundzwanzig Euro gekostet, aber heute kostet es nur neunzehn Euro.' },
          { who: 'f', text: 'Super, dann nehme ich es.' },
        ],
      },
      {
        id: 's1-h1-5', q: 'Was macht der Mann am Wochenende?', options: ['Er besucht seine Eltern.', 'Er arbeitet.', 'Er fährt in die Berge.'], answer: 0, explain: '„Ich fahre zu meinen Eltern nach Hamburg.“',
        lines: [
          { who: 'f', text: 'Und was machst du am Wochenende? Fährst du wieder in die Berge?' },
          { who: 'm', text: 'Nein, diesmal nicht. Ich fahre zu meinen Eltern nach Hamburg.' },
        ],
      },
      {
        id: 's1-h1-6', q: 'Wann ist der Termin beim Zahnarzt?', options: ['Am Montag', 'Am Dienstag', 'Am Mittwoch'], answer: 2, explain: 'Montag und Dienstag gehen nicht; der Termin ist am Mittwoch um neun.',
        lines: [
          { who: 'f', text: 'Praxis Doktor Lenz, guten Tag.' },
          { who: 'm', text: 'Guten Tag, ich brauche einen Termin. Geht es am Montag?' },
          { who: 'f', text: 'Montag und Dienstag sind leider voll. Am Mittwoch um neun Uhr ist noch frei.' },
          { who: 'm', text: 'Gut, dann Mittwoch um neun.' },
        ],
      },
    ],
    teil2: [
      { id: 's1-h2-1', statement: 'Der Zug nach Frankfurt hat zwanzig Minuten Verspätung.', answer: true, explain: '„… hat heute circa zwanzig Minuten Verspätung.“', lines: [{ who: 'f', text: 'Achtung an Gleis drei. Der ICE nach Frankfurt hat heute circa zwanzig Minuten Verspätung. Wir bitten um Entschuldigung.' }] },
      { id: 's1-h2-2', statement: 'Die Kunden sollen zur Kasse eins kommen.', answer: false, explain: 'Kasse eins ist geschlossen; sie sollen zu Kasse vier gehen.', lines: [{ who: 'm', text: 'Liebe Kundinnen und Kunden, Kasse eins ist jetzt geschlossen. Bitte gehen Sie zu Kasse vier. Vielen Dank.' }] },
      { id: 's1-h2-3', statement: 'Der Flug nach Wien geht von Ausgang B 12.', answer: true, explain: '„… bitte zum Ausgang B zwölf.“', lines: [{ who: 'f', text: 'Die Passagiere für den Flug nach Wien kommen bitte jetzt zum Ausgang B zwölf. Der Flug ist bereit zum Einsteigen.' }] },
      { id: 's1-h2-4', statement: 'Das Museum ist heute bis 20 Uhr offen.', answer: false, explain: 'Heute schließt das Museum schon um 16 Uhr.', lines: [{ who: 'm', text: 'Liebe Besucher, das Museum schließt heute schon um sechzehn Uhr. Morgen sind wir wieder von zehn bis zwanzig Uhr für Sie da.' }] },
    ],
    teil3: [
      {
        id: 's1-h3-1', q: 'Wann soll Herr Yilmaz kommen?', options: ['Heute um 15 Uhr', 'Morgen um 15 Uhr', 'Morgen um 5 Uhr'], answer: 1, explain: '„Können Sie morgen um fünfzehn Uhr kommen?“',
        lines: [{ who: 'f', text: 'Guten Tag, Herr Yilmaz, hier ist die Autowerkstatt Becker. Ihr Auto ist fertig. Können Sie morgen um fünfzehn Uhr kommen? Danke und auf Wiederhören.' }],
      },
      {
        id: 's1-h3-2', q: 'Was soll Anna mitbringen?', options: ['Kuchen', 'Getränke', 'Musik'], answer: 0, explain: '„Kannst du einen Kuchen mitbringen?“ – Getränke hat Paul schon.',
        lines: [{ who: 'm', text: 'Hallo Anna, hier ist Paul. Am Freitag machen wir das Picknick im Park. Getränke habe ich schon. Kannst du einen Kuchen mitbringen? Bis Freitag!' }],
      },
      {
        id: 's1-h3-3', q: 'Wo treffen sich die beiden?', options: ['Am Bahnhof', 'Vor dem Kino', 'Im Café'], answer: 2, explain: '„Treffen wir uns lieber im Café neben dem Kino.“',
        lines: [{ who: 'f', text: 'Hi Max, hier ist Julia. Es regnet so stark! Wir treffen uns nicht vor dem Kino, treffen wir uns lieber im Café neben dem Kino. Bis gleich!' }],
      },
      {
        id: 's1-h3-4', q: 'Welche Telefonnummer hat Frau Schulz?', options: ['0341 66 78 21', '0341 66 87 21', '0341 76 78 21'], answer: 0, explain: 'null drei vier eins, sechs sechs, sieben acht, zwei eins.',
        lines: [{ who: 'f', text: 'Guten Tag, hier spricht Monika Schulz. Ich habe eine Frage zu meiner Rechnung. Bitte rufen Sie mich zurück. Meine Nummer ist null drei vier eins, sechs sechs, sieben acht, zwei eins. Danke.' }],
      },
      {
        id: 's1-h3-5', q: 'Warum ruft Herr Klein an?', options: ['Er ist krank.', 'Er hat keine Zeit.', 'Sein Zug hat Verspätung.'], answer: 2, explain: '„Mein Zug hat Verspätung, ich komme eine halbe Stunde später.“',
        lines: [{ who: 'm', text: 'Hallo Frau Wolf, hier ist Thomas Klein. Mein Zug hat leider Verspätung. Ich komme eine halbe Stunde später zur Besprechung. Bis dann.' }],
      },
    ],
  },
  {
    id: 's2',
    teil1: [
      {
        id: 's2-h1-1', q: 'Was trinkt der Mann?', options: ['Kaffee', 'Tee', 'Wasser'], answer: 1, explain: 'Kaffee ist ihm zu spät am Abend; er nimmt einen Tee.',
        lines: [
          { who: 'f', text: 'Möchtest du einen Kaffee?' },
          { who: 'm', text: 'Nein danke, am Abend trinke ich keinen Kaffee. Ich nehme lieber einen Tee.' },
        ],
      },
      {
        id: 's2-h1-2', q: 'Wie kommt die Frau zur Arbeit?', options: ['Mit dem Auto', 'Mit dem Fahrrad', 'Mit dem Bus'], answer: 1, explain: 'Das Auto ist kaputt, sie fährt diese Woche mit dem Fahrrad.',
        lines: [
          { who: 'm', text: 'Fährst du heute mit dem Auto zur Arbeit?' },
          { who: 'f', text: 'Nein, mein Auto ist kaputt. Diese Woche fahre ich mit dem Fahrrad. Der Bus ist mir zu voll.' },
        ],
      },
      {
        id: 's2-h1-3', q: 'Welches Zimmer hat der Mann?', options: ['Zimmer 214', 'Zimmer 241', 'Zimmer 412'], answer: 0, explain: '„Ihr Zimmer ist Nummer zweihundertvierzehn.“',
        lines: [
          { who: 'f', text: 'Herzlich willkommen im Hotel Lindner. Ihr Zimmer ist Nummer zweihundertvierzehn, im zweiten Stock.' },
          { who: 'm', text: 'Danke schön. Und wann gibt es Frühstück?' },
          { who: 'f', text: 'Von sieben bis zehn Uhr.' },
        ],
      },
      {
        id: 's2-h1-4', q: 'Was ist das Problem?', options: ['Die Frau hat ihren Schlüssel verloren.', 'Die Heizung ist kaputt.', 'Das Licht geht nicht.'], answer: 1, explain: '„Die Heizung in meiner Wohnung funktioniert nicht.“',
        lines: [
          { who: 'f', text: 'Guten Tag, Herr Hausmeister. Die Heizung in meiner Wohnung funktioniert nicht. Es ist so kalt!' },
          { who: 'm', text: 'Oh, das tut mir leid. Ich komme heute Nachmittag.' },
        ],
      },
      {
        id: 's2-h1-5', q: 'Wann beginnt der Deutschkurs?', options: ['Am 1. März', 'Am 3. März', 'Am 13. März'], answer: 1, explain: '„Der Kurs beginnt am dritten März.“',
        lines: [
          { who: 'm', text: 'Ich möchte mich für den Deutschkurs A1 anmelden. Wann beginnt er?' },
          { who: 'f', text: 'Der Kurs beginnt am dritten März, immer montags und mittwochs.' },
        ],
      },
      {
        id: 's2-h1-6', q: 'Wo wohnt die Frau?', options: ['In der Stadtmitte', 'In einem Dorf', 'Am Bahnhof'], answer: 1, explain: '„Ich wohne jetzt in einem kleinen Dorf, zwanzig Kilometer von der Stadt.“',
        lines: [
          { who: 'm', text: 'Wohnst du noch in der Stadtmitte?' },
          { who: 'f', text: 'Nein, ich wohne jetzt in einem kleinen Dorf, zwanzig Kilometer von der Stadt. Das ist sehr ruhig.' },
        ],
      },
    ],
    teil2: [
      { id: 's2-h2-1', statement: 'Die U-Bahn-Linie 2 fährt heute nicht.', answer: true, explain: '„Die Linie U zwei fährt heute wegen Bauarbeiten nicht.“', lines: [{ who: 'm', text: 'Liebe Fahrgäste, die Linie U zwei fährt heute wegen Bauarbeiten nicht. Bitte nehmen Sie den Bus Nummer acht.' }] },
      { id: 's2-h2-2', statement: 'Im Kaufhaus gibt es heute Schuhe billiger.', answer: false, explain: 'Heute sind die Jacken billiger, nicht die Schuhe.', lines: [{ who: 'f', text: 'Liebe Kunden, heute im zweiten Stock: alle Jacken dreißig Prozent billiger! Nur heute!' }] },
      { id: 's2-h2-3', statement: 'Der Kurs beginnt heute später.', answer: true, explain: 'Er beginnt erst um zehn Uhr statt um neun.', lines: [{ who: 'm', text: 'Eine Information für die Teilnehmer vom Kurs A1: Der Kurs beginnt heute nicht um neun, sondern erst um zehn Uhr, in Raum fünf.' }] },
      { id: 's2-h2-4', statement: 'Der Wetterbericht sagt: Am Wochenende regnet es.', answer: false, explain: 'Am Wochenende scheint die Sonne; Regen gibt es nur am Freitag.', lines: [{ who: 'f', text: 'Und jetzt das Wetter: Am Freitag gibt es noch Regen, aber am Wochenende scheint die Sonne, bei bis zu fünfundzwanzig Grad.' }] },
    ],
    teil3: [
      {
        id: 's2-h3-1', q: 'Was soll Herr Fischer mitbringen?', options: ['Seinen Pass', 'Ein Foto', 'Seine Versichertenkarte'], answer: 2, explain: '„Bitte bringen Sie Ihre Versichertenkarte mit.“',
        lines: [{ who: 'f', text: 'Guten Tag, Herr Fischer, hier ist die Praxis Doktor Brandt. Ihr Termin ist am Donnerstag um acht Uhr. Bitte bringen Sie Ihre Versichertenkarte mit. Auf Wiederhören.' }],
      },
      {
        id: 's2-h3-2', q: 'Wann kommt Sara nach Hause?', options: ['Um 18 Uhr', 'Um 19 Uhr', 'Um 21 Uhr'], answer: 2, explain: '„Ich komme erst um einundzwanzig Uhr.“',
        lines: [{ who: 'f', text: 'Hallo Mama, hier ist Sara. Ich bin noch bei Lisa, wir lernen zusammen für den Test. Ich komme erst um einundzwanzig Uhr nach Hause. Tschüss!' }],
      },
      {
        id: 's2-h3-3', q: 'Was ist am Montag?', options: ['Ein Ausflug', 'Ein Test', 'Ein Fest'], answer: 0, explain: '„Am Montag machen wir einen Ausflug nach Heidelberg.“',
        lines: [{ who: 'm', text: 'Hallo, hier ist Herr Becker von der Sprachschule. Am Montag haben wir keinen Unterricht. Wir machen einen Ausflug nach Heidelberg. Wir treffen uns um acht Uhr am Bahnhof.' }],
      },
      {
        id: 's2-h3-4', q: 'Wie viel kostet die Reparatur?', options: ['45 Euro', '54 Euro', '145 Euro'], answer: 0, explain: '„Die Reparatur kostet fünfundvierzig Euro.“',
        lines: [{ who: 'm', text: 'Guten Tag, Frau Nowak, hier ist der Handy-Service. Ihr Handy ist repariert. Die Reparatur kostet fünfundvierzig Euro. Sie können es ab heute abholen.' }],
      },
      {
        id: 's2-h3-5', q: 'Wohin möchte Ben am Samstag gehen?', options: ['Ins Schwimmbad', 'Ins Konzert', 'Ins Fußballstadion'], answer: 1, explain: '„Ich habe zwei Karten für das Konzert am Samstag.“',
        lines: [{ who: 'm', text: 'Hey, hier ist Ben. Ich habe zwei Karten für das Konzert am Samstag. Hast du Lust? Ruf mich bitte bis morgen zurück!' }],
      },
    ],
  },
]
