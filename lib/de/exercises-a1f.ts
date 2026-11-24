/** Practice for A1 lesson part 6: Perfekt, Dativ, polite forms & connectors. Same schema as exercises.ts. */
import type { TopicPractice } from './exercises'

export const PERFEKT: TopicPractice = {
  sections: [
    { id: 'partizip', label: 'Partizip II' },
    { id: 'hilfsverb', label: 'haben / sein' },
    { id: 'praeteritum', label: 'war / hatte' },
  ],
  items: [
    { section: 'partizip', type: 'mcq', q: 'Partizip II dari "machen"?', options: ['gemacht', 'gemachen', 'machte'], answer: 'gemacht', explain: 'Teratur: ge- + mach + -t.' },
    { section: 'partizip', type: 'mcq', q: 'Partizip II dari "essen"?', options: ['gegessen', 'geesst', 'gegesst'], answer: 'gegessen', explain: 'Tak teratur: essen → gegessen (dihafal).' },
    { section: 'partizip', type: 'mcq', q: 'Partizip II dari "verstehen"?', options: ['verstanden', 'geverstanden', 'verstehtet'], answer: 'verstanden', explain: 'Awalan ver- → tanpa ge-.' },
    { section: 'partizip', type: 'gap', sentence: 'Ich habe gestern bis 20 Uhr ___.', translation: 'Kemarin aku bekerja sampai jam 20.', base: 'arbeiten', answer: ['gearbeitet'], explain: 'Akar berakhiran -t → ge-arbeit-et.' },
    { section: 'partizip', type: 'gap', sentence: 'Hast du das Buch schon ___?', translation: 'Kamu sudah baca buku itu?', base: 'lesen', answer: ['gelesen'], explain: 'lesen → gelesen (tak teratur).' },
    { section: 'partizip', type: 'gap', sentence: 'Wir haben viel Wasser ___.', translation: 'Kami minum banyak air.', base: 'trinken', answer: ['getrunken'], explain: 'trinken → getrunken (i → u).' },
    { section: 'partizip', type: 'gap', sentence: 'Was ist ___?', translation: 'Apa yang terjadi?', base: 'passieren', answer: ['passiert'], explain: 'Berakhiran -ieren → tanpa ge-: passiert.' },
    { section: 'partizip', type: 'match', q: 'Pasangkan infinitiv dengan Partizip II', pairs: [['sehen', 'gesehen'], ['schlafen', 'geschlafen'], ['fragen', 'gefragt'], ['lernen', 'gelernt']], explain: 'sehen & schlafen tak teratur (-en); fragen & lernen teratur (-t).' },
    { section: 'partizip', type: 'order', translation: 'Aku tidak mengerti kamu.', tokens: ['ich', 'habe', 'dich', 'nicht', 'verstanden'], end: '.', explain: 'habe di posisi 2, verstanden di akhir.' },

    { section: 'hilfsverb', type: 'mcq', q: 'Pilih kata kerja bantu', sentence: 'Wir ___ nach Berlin gefahren.', options: ['sind', 'haben', 'hatten'], answer: 'sind', explain: 'fahren = berpindah tempat → sein.' },
    { section: 'hilfsverb', type: 'mcq', q: 'Pilih kata kerja bantu', sentence: 'Ich ___ eine Pizza gegessen.', options: ['habe', 'bin', 'war'], answer: 'habe', explain: 'essen tidak berpindah tempat → haben.' },
    { section: 'hilfsverb', type: 'gap', sentence: 'Er ___ am Sonntag zu Hause geblieben.', translation: 'Hari Minggu dia tinggal di rumah.', base: 'haben/sein', answer: ['ist'], explain: 'bleiben selalu memakai sein.' },
    { section: 'hilfsverb', type: 'gap', sentence: '___ du gut geschlafen?', translation: 'Kamu tidur nyenyak?', base: 'haben/sein', answer: ['Hast', 'hast'], explain: 'schlafen → haben: Hast du … geschlafen?' },
    { section: 'hilfsverb', type: 'tf', statement: '"Ich bin um 7 Uhr aufgestanden" memakai sein karena aufstehen adalah perubahan keadaan.', answer: true, explain: 'Benar: aufstehen (dari tidur ke bangun) → sein.' },
    { section: 'hilfsverb', type: 'tf', statement: 'Dalam Perfekt, Partizip II berada di posisi 2.', answer: false, explain: 'Salah. haben/sein di posisi 2, Partizip II di akhir kalimat.' },
    { section: 'hilfsverb', type: 'order', translation: 'Akhir pekan kami pergi ke Hamburg.', start: 'am', tokens: ['am', 'Wochenende', 'sind', 'wir', 'nach', 'Hamburg', 'gefahren'], end: '.', explain: 'Am Wochenende posisi 1 → sind posisi 2 → wir → … gefahren di akhir.' },

    { section: 'praeteritum', type: 'mcq', q: 'Pilih bentuk yang tepat', sentence: 'Gestern ___ ich sehr müde.', options: ['war', 'warst', 'hatte'], answer: 'war', explain: 'sein, ich → war.' },
    { section: 'praeteritum', type: 'mcq', q: 'Pilih bentuk yang tepat', sentence: 'Wo ___ du am Wochenende?', options: ['warst', 'war', 'wart'], answer: 'warst', explain: 'sein, du → warst.' },
    { section: 'praeteritum', type: 'gap', sentence: 'Ich ___ leider keine Zeit.', translation: 'Sayangnya aku tidak punya waktu.', base: 'haben', answer: ['hatte'], explain: 'haben, ich → hatte.' },
    { section: 'praeteritum', type: 'gap', sentence: 'Wir ___ einen Termin beim Arzt.', translation: 'Kami punya janji di dokter.', base: 'haben', answer: ['hatten'], explain: 'haben, wir → hatten.' },
    { section: 'praeteritum', type: 'match', q: 'Pasangkan subjek dengan bentuk "sein"', pairs: [['ich', 'war'], ['du', 'warst'], ['wir', 'waren'], ['ihr', 'wart']], explain: 'ich/er war, du warst, wir/sie waren, ihr wart.' },
  ],
}

export const DATIV: TopicPractice = {
  sections: [
    { id: 'pronomen', label: 'mir / dir / Ihnen' },
    { id: 'verben', label: 'Kata kerja + Dativ' },
    { id: 'praepositionen', label: 'Kata depan' },
  ],
  items: [
    { section: 'pronomen', type: 'mcq', q: 'Pilih kata ganti yang tepat', sentence: 'Wie geht es ___? (Anda)', options: ['Ihnen', 'Sie', 'Ihr'], answer: 'Ihnen', explain: 'es geht + Dativ: Sie → Ihnen.' },
    { section: 'pronomen', type: 'mcq', q: 'Pilih kata ganti yang tepat', sentence: 'Kannst du ___ helfen? (aku)', options: ['mir', 'mich', 'ich'], answer: 'mir', explain: 'helfen + Dativ: ich → mir.' },
    { section: 'pronomen', type: 'gap', sentence: 'Danke, ___ geht es gut.', translation: 'Terima kasih, aku baik.', base: 'ich', answer: ['mir'], explain: 'Jawaban "Wie geht es dir?" → Mir geht es gut.' },
    { section: 'pronomen', type: 'gap', sentence: 'Das Auto gehört ___.', translation: 'Mobil itu miliknya (lk).', base: 'er', answer: ['ihm'], explain: 'gehören + Dativ: er → ihm.' },
    { section: 'pronomen', type: 'match', q: 'Pasangkan Nominativ dengan Dativ', pairs: [['ich', 'mir'], ['du', 'dir'], ['sie (dia pr)', 'ihr'], ['Sie', 'Ihnen']], explain: 'ich → mir, du → dir, sie → ihr, Sie → Ihnen.' },
    { section: 'pronomen', type: 'mcq', q: 'Kata tanya untuk Dativ?', options: ['Wem?', 'Wen?', 'Wer?'], answer: 'Wem?', explain: 'Wer = Nominativ, Wen = Akkusativ, Wem = Dativ.' },

    { section: 'verben', type: 'mcq', q: 'Pilih bentuk yang tepat', sentence: 'Ich danke ___ für die Hilfe.', options: ['dir', 'dich', 'du'], answer: 'dir', explain: 'danken + Dativ → dir.' },
    { section: 'verben', type: 'gap', sentence: 'Berlin gefällt ___ sehr.', translation: 'Aku sangat suka Berlin.', base: 'ich', answer: ['mir'], explain: 'gefallen + Dativ: Berlin gefällt mir.' },
    { section: 'verben', type: 'gap', sentence: 'Ich helfe ___ Mutter.', translation: 'Aku membantu ibuku.', base: 'mein', answer: ['meiner'], explain: 'helfen + Dativ; die Mutter (feminin) → meiner.' },
    { section: 'verben', type: 'tf', statement: 'Dalam "Gib mir den Schlüssel", mir adalah Dativ dan den Schlüssel adalah Akkusativ.', answer: true, explain: 'Benar: orang yang menerima = Dativ, benda = Akkusativ.' },
    { section: 'verben', type: 'order', translation: 'Bisa Anda berikan tagihannya?', tokens: ['können', 'Sie', 'mir', 'die', 'Rechnung', 'geben'], end: '?', explain: 'Modalverb di depan (pertanyaan), mir (Dativ) sebelum die Rechnung, geben di akhir.' },

    { section: 'praepositionen', type: 'mcq', q: 'Pilih kata depan yang tepat', sentence: 'Ich fahre ___ dem Bus.', options: ['mit', 'bei', 'nach'], answer: 'mit', explain: 'Naik kendaraan → mit + Dativ.' },
    { section: 'praepositionen', type: 'mcq', q: 'Pilih bentuk yang tepat', sentence: 'Ich gehe heute ___ Arzt.', options: ['zum', 'zur', 'nach'], answer: 'zum', explain: 'der Arzt → zu + dem = zum.' },
    { section: 'praepositionen', type: 'mcq', q: 'Pilih bentuk yang tepat', sentence: 'Wo ist hier der Weg ___ Post?', options: ['zur', 'zum', 'nach'], answer: 'zur', explain: 'die Post → zu + der = zur.' },
    { section: 'praepositionen', type: 'gap', sentence: 'Morgen fliege ich ___ Wien.', translation: 'Besok aku terbang ke Wina.', base: 'nach/zu', answer: ['nach'], explain: 'Kota tanpa artikel → nach.' },
    { section: 'praepositionen', type: 'gap', sentence: 'Sie arbeitet ___ einer Bank.', translation: 'Dia bekerja di bank.', base: 'mit/bei', answer: ['bei'], explain: 'Bekerja di perusahaan → bei.' },
    { section: 'praepositionen', type: 'gap', sentence: 'Wir warten ___ Bahnhof.', translation: 'Kami menunggu di stasiun.', base: 'an + dem', answer: ['am'], explain: 'an + dem = am.' },
    { section: 'praepositionen', type: 'tf', statement: '"Ich bin nach Hause" berarti aku sedang di rumah.', answer: false, explain: 'Salah. Di rumah = zu Hause; nach Hause = pulang ke rumah.' },
    { section: 'praepositionen', type: 'match', q: 'Pasangkan gabungan kata depan', pairs: [['zu + dem', 'zum'], ['zu + der', 'zur'], ['in + dem', 'im'], ['bei + dem', 'beim']], explain: 'Gabungan wajib dengan artikel dem/der.' },
    { section: 'praepositionen', type: 'order', translation: 'Aku naik kereta ke Köln.', tokens: ['ich', 'fahre', 'mit', 'dem', 'Zug', 'nach', 'Köln'], end: '.', explain: 'mit dem Zug (cara), lalu nach Köln (tujuan).' },
  ],
}

export const HOEFLICH: TopicPractice = {
  sections: [
    { id: 'bitten', label: 'Meminta sopan' },
    { id: 'gern', label: 'gern / lieber / dieser' },
    { id: 'konnektoren', label: 'Penghubung' },
  ],
  items: [
    { section: 'bitten', type: 'mcq', q: 'Mana yang paling sopan di kafe?', options: ['Ich möchte einen Kaffee, bitte.', 'Ich will Kaffee.', 'Kaffee!'], answer: 'Ich möchte einen Kaffee, bitte.', explain: 'möchte + bitte = permintaan sopan.' },
    { section: 'bitten', type: 'gap', sentence: '___ Sie etwas trinken?', translation: 'Anda mau minum sesuatu?', base: 'möchten', answer: ['Möchten', 'möchten'], explain: 'Sie → möchten (pertanyaan: verba di depan).' },
    { section: 'bitten', type: 'gap', sentence: 'Du ___ auch ein Eis, oder?', translation: 'Kamu juga mau es krim, kan?', base: 'möchten', answer: ['möchtest'], explain: 'du → möchtest.' },
    { section: 'bitten', type: 'mcq', q: 'Pilih yang tepat', sentence: 'Ich ___ gern ein Kilo Äpfel.', options: ['hätte', 'würde', 'habe'], answer: 'hätte', explain: 'hätte gern + benda = memesan dengan sopan.' },
    { section: 'bitten', type: 'mcq', q: 'Pilih yang tepat', sentence: 'Ich ___ gern am Montag kommen.', options: ['würde', 'hätte', 'möchten'], answer: 'würde', explain: 'würde gern + infinitiv (kommen) di akhir.' },
    { section: 'bitten', type: 'order', translation: 'Bisakah Anda mengulanginya?', tokens: ['könnten', 'Sie', 'das', 'bitte', 'wiederholen'], end: '?', explain: 'Könnten di depan, infinitiv wiederholen di akhir.' },

    { section: 'gern', type: 'mcq', q: 'Tee oder Kaffee? (kamu lebih suka teh)', options: ['Lieber Tee, bitte.', 'Gern Tee, bitte.', 'Am liebsten Kaffee.'], answer: 'Lieber Tee, bitte.', explain: 'Membandingkan dua pilihan → lieber.' },
    { section: 'gern', type: 'gap', sentence: 'Ich koche nicht ___.', translation: 'Aku tidak suka memasak.', base: 'gern', answer: ['gern', 'gerne'], explain: 'nicht gern = tidak suka.' },
    { section: 'gern', type: 'gap', sentence: 'Am ___ trinke ich Wasser.', translation: 'Yang paling aku suka minum air.', base: 'gern', answer: ['liebsten'], explain: 'gern → lieber → am liebsten.' },
    { section: 'gern', type: 'mcq', q: 'Pilih bentuk dieser', sentence: 'Wie viel kostet ___ Tisch?', options: ['dieser', 'diese', 'dieses'], answer: 'dieser', explain: 'der Tisch → dieser.' },
    { section: 'gern', type: 'gap', sentence: '___ Jacke gefällt mir.', translation: 'Aku suka jaket ini.', base: 'dieser', answer: ['Diese', 'diese'], explain: 'die Jacke → diese.' },
    { section: 'gern', type: 'match', q: 'Pasangkan dengan artinya', pairs: [['gern', 'suka'], ['lieber', 'lebih suka'], ['am liebsten', 'paling suka'], ['nicht gern', 'tidak suka']], explain: 'gern – lieber – am liebsten.' },

    { section: 'konnektoren', type: 'mcq', q: 'Pilih penghubung', sentence: 'Ich komme nicht, ___ ich bin krank.', options: ['denn', 'dann', 'oder'], answer: 'denn', explain: 'Alasan → denn (karena).' },
    { section: 'konnektoren', type: 'mcq', q: 'Pilih penghubung', sentence: 'Ich möchte kommen, ___ ich habe keine Zeit.', options: ['aber', 'und', 'denn'], answer: 'aber', explain: 'Pertentangan → aber (tetapi).' },
    { section: 'konnektoren', type: 'mcq', q: 'Urutan yang benar setelah "dann"?', options: ['Dann gehe ich nach Hause.', 'Dann ich gehe nach Hause.', 'Dann ich nach Hause gehe.'], answer: 'Dann gehe ich nach Hause.', explain: 'dann di posisi 1 → verba langsung di posisi 2.' },
    { section: 'konnektoren', type: 'gap', sentence: 'Kommst du heute ___ morgen?', translation: 'Kamu datang hari ini atau besok?', base: 'und/oder', answer: ['oder'], explain: 'Pilihan → oder.' },
    { section: 'konnektoren', type: 'tf', statement: 'Setelah "denn", verba tetap di posisi 2: … denn ich bin krank.', answer: true, explain: 'Benar. und, oder, aber, denn tidak mengubah urutan kata.' },
    { section: 'konnektoren', type: 'order', translation: 'Lalu kita makan bersama.', start: 'dann', tokens: ['dann', 'essen', 'wir', 'zusammen'], end: '.', explain: 'Dann posisi 1 → essen posisi 2 → wir.' },
    { section: 'konnektoren', type: 'match', q: 'Pasangkan bagian pesan', pairs: [['Lieber Tom,', 'sapaan'], ['denn ich bin krank', 'alasan'], ['Hast du am Sonntag Zeit?', 'usulan'], ['Viele Grüße', 'penutup']], explain: 'Pesan singkat: sapaan → isi (alasan, usulan) → penutup.' },
  ],
}
