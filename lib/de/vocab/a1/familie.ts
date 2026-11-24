import type { Category } from '../../content'

const familie: Category = {
  slug: 'familie',
  title: 'Keluarga',
  titleDe: 'Familie',
  words: [
    { de: 'Familie', id: 'keluarga', kind: 'noun', gender: 'die', plural: 'die Familien', example: 'Meine Familie wohnt in Bandung.', exampleId: 'Keluargaku tinggal di Bandung.' },
    { de: 'Mutter', id: 'ibu', kind: 'noun', gender: 'die', plural: 'die Mütter', example: 'Meine Mutter ist Ärztin.', exampleId: 'Ibuku seorang dokter.' },
    { de: 'Vater', id: 'ayah', kind: 'noun', gender: 'der', plural: 'die Väter', example: 'Mein Vater kocht gern.', exampleId: 'Ayahku suka memasak.' },
    { de: 'Bruder', id: 'saudara laki-laki', kind: 'noun', gender: 'der', plural: 'die Brüder', example: 'Ich habe einen Bruder.', exampleId: 'Aku punya satu saudara laki-laki.' },
    { de: 'Schwester', id: 'saudara perempuan', kind: 'noun', gender: 'die', plural: 'die Schwestern', example: 'Meine Schwester ist 12 Jahre alt.', exampleId: 'Adik perempuanku berumur 12 tahun.' },
    { de: 'Kind', id: 'anak', kind: 'noun', gender: 'das', plural: 'die Kinder', example: 'Das Kind spielt im Garten.', exampleId: 'Anak itu bermain di kebun.' },
    { de: 'Mädchen', id: 'anak perempuan', kind: 'noun', gender: 'das', plural: 'die Mädchen', example: 'Das Mädchen heißt Sari.', exampleId: 'Anak perempuan itu bernama Sari.', hint: 'Akhiran -chen selalu das, walaupun artinya perempuan!' },
    { de: 'Eltern', id: 'orang tua', kind: 'noun', gender: 'die', plural: 'Pl.', example: 'Meine Eltern kommen aus Medan.', exampleId: 'Orang tuaku berasal dari Medan.', hint: 'Hanya ada bentuk jamak.' },
    { de: 'Sohn', id: 'anak laki-laki (putra)', kind: 'noun', gender: 'der', plural: 'die Söhne', example: 'Ihr Sohn geht zur Schule.', exampleId: 'Putranya pergi ke sekolah.' },
    { de: 'Tochter', id: 'anak perempuan (putri)', kind: 'noun', gender: 'die', plural: 'die Töchter', example: 'Meine Tochter liest viel.', exampleId: 'Putriku banyak membaca.' },
  ],
}

export default familie
