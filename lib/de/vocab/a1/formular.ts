import type { Category } from '../../content'

const formular: Category = {
  slug: 'formular',
  title: 'Formulir & data diri',
  titleDe: 'Formulare und Angaben zur Person',
  words: [
    { de: 'Familienstand', id: 'status perkawinan', kind: 'noun', gender: 'der', plural: '–', example: 'Familienstand: ledig.', exampleId: 'Status perkawinan: lajang.', hint: 'Kolom formulir: ledig, verheiratet, geschieden.' },
    { de: 'geboren', id: 'lahir', kind: 'adj', example: 'Ich bin 2001 in Medan geboren.', exampleId: 'Aku lahir tahun 2001 di Medan.', hint: 'Di formulir: geboren am … (tanggal lahir).' },
    { de: 'Geburtsort', id: 'tempat lahir', kind: 'noun', gender: 'der', plural: 'die Geburtsorte', example: 'Geburtsort: Bandung.', exampleId: 'Tempat lahir: Bandung.' },
    { de: 'Geburtsjahr', id: 'tahun lahir', kind: 'noun', gender: 'das', plural: 'die Geburtsjahre', example: 'Bitte schreiben Sie Ihr Geburtsjahr.', exampleId: 'Silakan tulis tahun lahir Anda.' },
    { de: 'männlich', id: 'laki-laki (jenis kelamin)', kind: 'adj', example: 'Geschlecht: männlich.', exampleId: 'Jenis kelamin: laki-laki.' },
    { de: 'weiblich', id: 'perempuan (jenis kelamin)', kind: 'adj', example: 'Geschlecht: weiblich.', exampleId: 'Jenis kelamin: perempuan.' },
    { de: 'ankreuzen', id: 'memberi tanda silang', kind: 'verb', forms: 'er kreuzt an · hat angekreuzt', example: 'Bitte kreuzen Sie an: ja oder nein.', exampleId: 'Silakan beri tanda silang: ya atau tidak.', hint: 'Sering di instruksi ujian: Kreuzen Sie an!' },
    { de: 'anmelden', id: 'mendaftar', kind: 'verb', forms: 'er meldet an · hat angemeldet', example: 'Ich möchte mich für den Kurs anmelden.', exampleId: 'Saya ingin mendaftar untuk kursus itu.', hint: 'Terpisah: Ich melde mich an.' },
    { de: 'Anmeldung', id: 'pendaftaran', kind: 'noun', gender: 'die', plural: 'die Anmeldungen', example: 'Die Anmeldung ist im ersten Stock.', exampleId: 'Pendaftarannya di lantai satu.', hint: 'Akhiran -ung → die.' },
    { de: 'Anrede', id: 'sapaan (di surat)', kind: 'noun', gender: 'die', plural: 'die Anreden', example: 'Schreiben Sie auch eine Anrede.', exampleId: 'Tulis juga sapaannya.', hint: 'Contoh: Liebe Anna, / Sehr geehrte Damen und Herren,' },
    { de: 'Gruß', id: 'salam', kind: 'noun', gender: 'der', plural: 'die Grüße', example: 'Viele Grüße aus Berlin!', exampleId: 'Salam hangat dari Berlin!', hint: 'Penutup surat: Viele Grüße / Mit freundlichen Grüßen.' },
    { de: 'herzlich', id: 'hangat, tulus', kind: 'adj', example: 'Herzliche Grüße, deine Lisa.', exampleId: 'Salam hangat, Lisa.' },
    { de: 'Ausländer', id: 'orang asing', kind: 'noun', gender: 'der', plural: 'die Ausländer', example: 'In der Stadt leben viele Ausländer.', exampleId: 'Di kota itu tinggal banyak orang asing.' },
    { de: 'ausländisch', id: 'asing, dari luar negeri', kind: 'adj', example: 'Er hat eine ausländische Firma.', exampleId: 'Dia punya perusahaan asing.' },
    { de: 'Heimat', id: 'kampung halaman, tanah air', kind: 'noun', gender: 'die', plural: '–', example: 'Meine Heimat ist Indonesien.', exampleId: 'Tanah airku Indonesia.' },
    { de: 'Ort', id: 'tempat, kota kecil', kind: 'noun', gender: 'der', plural: 'die Orte', example: 'Der Ort ist sehr klein.', exampleId: 'Tempat itu sangat kecil.' },
    { de: 'Partner', id: 'pasangan, mitra', kind: 'noun', gender: 'der', plural: 'die Partner', example: 'Mein Partner kommt aus Spanien.', exampleId: 'Pasanganku berasal dari Spanyol.' },
    { de: 'Verwandte', id: 'kerabat', kind: 'noun', gender: 'die', plural: 'Pl.', example: 'Meine Verwandten wohnen in Jakarta.', exampleId: 'Kerabatku tinggal di Jakarta.', hint: 'Biasanya jamak: die Verwandten.' },
    { de: 'Erwachsene', id: 'orang dewasa', kind: 'noun', gender: 'die', plural: 'Pl.', example: 'Erwachsene zahlen fünf Euro.', exampleId: 'Orang dewasa membayar lima euro.', hint: 'Sering di papan harga: Erwachsene / Kinder.' },
    { de: 'Jugendliche', id: 'remaja', kind: 'noun', gender: 'die', plural: 'Pl.', example: 'Der Kurs ist für Jugendliche.', exampleId: 'Kursus itu untuk remaja.' },
    { de: 'Konto', id: 'rekening', kind: 'noun', gender: 'das', plural: 'die Konten', example: 'Ich möchte ein Konto eröffnen.', exampleId: 'Saya ingin membuka rekening.' },
    { de: 'überweisen', id: 'mentransfer (uang)', kind: 'verb', forms: 'er überweist · hat überwiesen', example: 'Ich überweise das Geld morgen.', exampleId: 'Aku mentransfer uangnya besok.' },
    { de: 'bar', id: 'tunai', kind: 'adj', example: 'Kann ich bar bezahlen?', exampleId: 'Bisa saya bayar tunai?' },
    { de: 'zahlen', id: 'membayar', kind: 'verb', forms: 'er zahlt · hat gezahlt', example: 'Ich zahle mit Karte.', exampleId: 'Aku bayar pakai kartu.', hint: 'zahlen = bezahlen. Di restoran: Zahlen, bitte!' },
    { de: 'selbstständig', id: 'wiraswasta, mandiri', kind: 'adj', example: 'Mein Vater ist selbstständig.', exampleId: 'Ayahku wiraswasta.' },
    { de: 'Hausmann', id: 'bapak rumah tangga', kind: 'noun', gender: 'der', plural: 'die Hausmänner', example: 'Er ist Hausmann.', exampleId: 'Dia bapak rumah tangga.' },
    { de: 'Kindergarten', id: 'taman kanak-kanak', kind: 'noun', gender: 'der', plural: 'die Kindergärten', example: 'Meine Tochter geht in den Kindergarten.', exampleId: 'Putriku pergi ke TK.' },
    { de: 'Studium', id: 'kuliah, studi', kind: 'noun', gender: 'das', plural: 'die Studien', example: 'Das Studium dauert vier Jahre.', exampleId: 'Kuliahnya empat tahun.', hint: 'Akhiran -um → das.' },
  ],
}

export default formular
