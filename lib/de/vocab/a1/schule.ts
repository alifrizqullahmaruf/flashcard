import type { Category } from '../../content'

const schule: Category = {
  slug: 'schule',
  title: 'Sekolah',
  titleDe: 'Schule',
  words: [
    { de: 'Schule', id: 'sekolah', kind: 'noun', gender: 'die', plural: 'die Schulen', example: 'Die Schule beginnt um 7 Uhr.', exampleId: 'Sekolah mulai jam 7.' },
    { de: 'Lehrer', id: 'guru (laki-laki)', kind: 'noun', gender: 'der', plural: 'die Lehrer', example: 'Der Lehrer ist nett.', exampleId: 'Guru itu baik.' },
    { de: 'Lehrerin', id: 'guru (perempuan)', kind: 'noun', gender: 'die', plural: 'die Lehrerinnen', example: 'Unsere Lehrerin kommt aus Berlin.', exampleId: 'Guru kami berasal dari Berlin.', hint: 'Akhiran -in untuk perempuan selalu die.' },
    { de: 'Buch', id: 'buku', kind: 'noun', gender: 'das', plural: 'die Bücher', example: 'Das Buch ist interessant.', exampleId: 'Buku itu menarik.' },
    { de: 'Heft', id: 'buku tulis', kind: 'noun', gender: 'das', plural: 'die Hefte', example: 'Ich brauche ein Heft.', exampleId: 'Aku butuh buku tulis.' },
    { de: 'Stift', id: 'pena / pensil', kind: 'noun', gender: 'der', plural: 'die Stifte', example: 'Hast du einen Stift?', exampleId: 'Kamu punya pena?' },
    { de: 'Tisch', id: 'meja', kind: 'noun', gender: 'der', plural: 'die Tische', example: 'Das Buch liegt auf dem Tisch.', exampleId: 'Buku itu ada di atas meja.' },
    { de: 'Prüfung', id: 'ujian', kind: 'noun', gender: 'die', plural: 'die Prüfungen', example: 'Die Prüfung ist morgen.', exampleId: 'Ujiannya besok.', hint: 'Akhiran -ung selalu die.' },
    { de: 'lernen', id: 'belajar', kind: 'verb', forms: 'er lernt · hat gelernt', example: 'Ich lerne Deutsch.', exampleId: 'Aku belajar bahasa Jerman.' },
    { de: 'schreiben', id: 'menulis', kind: 'verb', forms: 'er schreibt · hat geschrieben', example: 'Schreib deinen Namen, bitte.', exampleId: 'Tolong tulis namamu.' },
  ],
}

export default schule
