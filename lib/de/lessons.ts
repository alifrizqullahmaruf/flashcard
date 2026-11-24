/**
 * A1 grammar lessons (markdown). Written by us for Indonesian learners.
 * Convention: a fenced block with language `contoh` renders as example cards with audio.
 * Each line: `German sentence | terjemahan`.
 */

export const A1_ARTIKEL = `
Setiap kata benda (Nomen) bahasa Jerman punya **gender**: maskulin, feminin, atau netral. Gender ini menentukan banyak hal: artikel, kata ganti (*er/sie/es*), dan nanti bentuk adjektiva. Karena gender **tidak selalu logis**, hafalkan kata benda **selalu bersama artikelnya**: bukan "Tisch", tapi "**der** Tisch".

| Gender | Artikel tertentu | Artikel tak tentu | Kata ganti | Contoh |
|---|---|---|---|---|
| Maskulin | **der** | ein | er | der Tisch |
| Feminin | **die** | eine | sie | die Lampe |
| Netral | **das** | ein | es | das Buch |
| Jamak | **die** | – | sie | die Bücher |

*der/die/das* = "si/itu" (benda yang sudah jelas). *ein/eine* = "sebuah/seorang" (benda yang baru disebut).

~~~contoh
Das ist ein Tisch. Der Tisch ist neu. | Itu sebuah meja. Meja itu baru.
Das ist eine Lampe. Die Lampe ist alt. | Itu sebuah lampu. Lampu itu tua.
Das ist ein Buch. Das Buch ist gut. | Itu sebuah buku. Buku itu bagus.
~~~

### der — maskulin
Kata ganti: **er**. Pola yang paling bisa diandalkan:
- **Orang & hewan jantan**: der Vater, der Bruder, der Mann, der Lehrer
- **Hari, bulan, musim**: der Montag, der Mai, der Sommer
- **Cuaca & arah mata angin**: der Regen, der Schnee, der Wind, der Norden
- **Akhiran -ling, -ismus**: der Frühling, der Tourismus
- **Akhiran -ent, -ant, -ist** (untuk orang): der Student, der Praktikant, der Polizist
- **Banyak kata kerja yang dipendekkan**: der Anfang (anfangen), der Besuch (besuchen)

~~~contoh
Der Vater kocht heute. Er kocht gut. | Ayah memasak hari ini. Dia masak dengan enak.
Am Montag regnet es. Der Regen ist kalt. | Hari Senin hujan. Hujannya dingin.
Der Student wohnt in Berlin. | Mahasiswa itu tinggal di Berlin.
~~~

### die — feminin
Kata ganti: **sie**. Pola yang paling bisa diandalkan:
- **Orang & hewan betina**: die Mutter, die Schwester, die Frau
- **Akhiran -in** (bentuk perempuan): der Lehrer → die Lehrer**in**, der Arzt → die Ärzt**in**
- **Akhiran -ung, -heit, -keit, -schaft**: die Zeitung, die Freiheit, die Möglichkeit, die Freundschaft
- **Akhiran -ion, -tät, -ie, -ik, -ur**: die Information, die Universität, die Familie, die Musik, die Kultur
- **Sebagian besar kata berakhiran -e** (±90%): die Lampe, die Schule, die Tasche

Pengecualian -e yang sering muncul: **der** Name, **der** Junge, **der** Käse, **das** Auge, **das** Ende.

~~~contoh
Die Mutter liest. Sie liest eine Zeitung. | Ibu sedang membaca. Dia membaca koran.
Die Lehrerin ist sehr nett. | Guru (perempuan) itu sangat baik.
Die Universität ist groß. | Universitasnya besar.
~~~

### das — netral
Kata ganti: **es**. Pola yang paling bisa diandalkan:
- **Akhiran -chen, -lein** (bentuk kecil): das Mädchen, das Brötchen, das Büchlein
- **Kata kerja jadi kata benda**: das Essen, das Lernen, das Schwimmen
- **Akhiran -um, -ment, -ma**: das Museum, das Zentrum, das Dokument, das Thema
- **Makhluk muda**: das Kind, das Baby
- **Banyak kata serapan internasional**: das Hotel, das Café, das Kino, das Restaurant, das Handy
- **Bahasa & warna sebagai kata benda**: das Deutsch, das Rot

**Hati-hati:** *das Mädchen* (anak perempuan) tetap netral karena akhiran *-chen*, jadi kata gantinya **es**, bukan *sie*.

~~~contoh
Das Mädchen spielt. Es ist acht Jahre alt. | Anak perempuan itu bermain. Dia berumur delapan tahun.
Das Essen ist lecker. | Makanannya enak.
Das Hotel ist im Zentrum. | Hotelnya di pusat kota.
~~~

### Jamak — selalu die
Apa pun gendernya, bentuk jamak **selalu memakai die**. Artikel tak tentu tidak punya bentuk jamak: cukup tanpa artikel.

~~~contoh
der Tisch → die Tische | meja → meja-meja
das Kind → die Kinder | anak → anak-anak
Das sind Bücher. Die Bücher sind neu. | Itu buku-buku. Buku-buku itu baru.
~~~

### Kata majemuk — ikut kata terakhir
Bahasa Jerman suka menggabung kata. Gender kata gabungan **selalu ikut kata terakhir**.
- das Haus + **die** Tür = **die** Haustür
- der Apfel + **der** Saft = **der** Apfelsaft
- die Schule + **das** Buch = **das** Schulbuch

### Tips menghafal
- Warna di aplikasi ini konsisten: **der** = biru, **die** = merah, **das** = hijau. Bayangkan bendanya berwarna itu.
- Belajar pola akhiran dulu: dengan pola di atas kamu sudah bisa menebak banyak kata dengan benar.
- Saat ragu, ucapkan keras-keras bersama artikelnya. Telinga lama-lama akan "merasa" mana yang benar.
`

export const A1_PRAESENS = `
Kata kerja (Verb) bahasa Jerman **berubah sesuai subjeknya**. Bentuk dasarnya (Infinitiv) hampir selalu berakhiran *-en*: lernen, wohnen, machen. Buang *-en* untuk mendapatkan **akar kata** (lern-, wohn-, mach-), lalu tambahkan akhiran sesuai subjek.

### Kata kerja beraturan
| Subjek | Akhiran | lernen (belajar) | wohnen (tinggal) |
|---|---|---|---|
| ich (aku) | -e | lern**e** | wohn**e** |
| du (kamu) | -st | lern**st** | wohn**st** |
| er / sie / es (dia) | -t | lern**t** | wohn**t** |
| wir (kami/kita) | -en | lern**en** | wohn**en** |
| ihr (kalian) | -t | lern**t** | wohn**t** |
| sie (mereka) / Sie (Anda) | -en | lern**en** | wohn**en** |

~~~contoh
Ich lerne Deutsch. | Aku belajar bahasa Jerman.
Du wohnst in Jakarta. | Kamu tinggal di Jakarta.
Wir spielen Fußball. | Kami main sepak bola.
~~~

### Akar kata berakhiran -t / -d
Supaya mudah diucapkan, tambahkan **-e-** sebelum *-st* dan *-t*: arbeiten → du arbeit**e**st, er arbeit**e**t. finden → er find**e**t.

### Akar kata berakhiran -s / -ß / -z
Untuk *du* cukup tambahkan **-t** (bukan -st): heißen → du hei**ßt**, tanzen → du tan**zt**.

~~~contoh
Er arbeitet in einem Café. | Dia bekerja di sebuah kafe.
Wie heißt du? | Siapa namamu?
~~~

### sein & haben — tidak beraturan, wajib hafal
| Subjek | sein (adalah/berada) | haben (punya) |
|---|---|---|
| ich | bin | habe |
| du | bist | hast |
| er / sie / es | ist | hat |
| wir | sind | haben |
| ihr | seid | habt |
| sie / Sie | sind | haben |

Dua kata kerja ini paling sering dipakai: untuk nama, umur, asal, perasaan, dan kepemilikan.

~~~contoh
Ich bin Student. | Aku mahasiswa.
Sie ist 20 Jahre alt. | Dia (perempuan) berumur 20 tahun.
Wir haben einen Hund. | Kami punya seekor anjing.
Hast du Zeit? | Kamu ada waktu?
~~~

### Perubahan vokal (hanya du & er/sie/es)
Beberapa kata kerja kuat mengganti vokalnya, **hanya untuk du dan er/sie/es**. Subjek lain tetap normal.
- **a → ä**: fahren → du f**ä**hrst, er f**ä**hrt · schlafen → er schl**ä**ft
- **e → i**: essen → du **i**sst, er **i**sst · sprechen → er spr**i**cht · helfen → er h**i**lft
- **e → ie**: lesen → du l**ie**st, er l**ie**st · sehen → er s**ie**ht

~~~contoh
Er fährt nach Berlin. | Dia pergi (naik kendaraan) ke Berlin.
Was isst du gern? | Kamu suka makan apa?
Wir essen zusammen. | Kami makan bersama.
~~~

### Sie (formal) vs. sie
- **Sie** (huruf besar) = "Anda", untuk orang yang belum akrab, dosen, petugas.
- **sie** (huruf kecil) = "dia (perempuan)" atau "mereka". Lihat bentuk kata kerjanya: *sie wohnt* (dia) vs. *sie wohnen* (mereka).

~~~contoh
Wie heißen Sie? | Siapa nama Anda?
Woher kommen Sie, Frau Weber? | Anda berasal dari mana, Bu Weber?
~~~

### Präsens juga untuk masa depan
Dengan keterangan waktu, Präsens bisa berarti "akan": *Morgen fahre ich nach Hamburg.* = Besok aku akan ke Hamburg.
`

export const A1_SATZ = `
Aturan paling penting dalam kalimat bahasa Jerman: **kata kerja yang dikonjugasikan selalu di posisi ke-2** (dalam kalimat pernyataan). "Posisi" di sini = satu bagian kalimat, bukan satu kata. *Am Wochenende* (dua kata) tetap dihitung satu posisi.

| Posisi 1 | Posisi 2 (verba) | Sisanya |
|---|---|---|
| Ich | **lerne** | heute Deutsch. |
| Heute | **lerne** | ich Deutsch. |
| Am Wochenende | **lerne** | ich Deutsch. |

Kalau posisi 1 **bukan subjek** (misalnya keterangan waktu), **subjek pindah tepat setelah verba**. Ini disebut *Inversion*.

~~~contoh
Ich gehe heute ins Kino. | Aku pergi ke bioskop hari ini.
Heute gehe ich ins Kino. | Hari ini aku pergi ke bioskop.
In Berlin wohnt meine Schwester. | Di Berlin tinggal kakak/adik perempuanku.
~~~

Salah: ~~Heute ich gehe ins Kino.~~ — verba harus di posisi 2.

### Kalimat dengan dua kata kerja
Kalau ada dua verba (misalnya dengan *können, möchten*), verba yang dikonjugasikan di posisi 2, **verba kedua (bentuk dasar) di akhir kalimat**. Bentuknya seperti "kurung".

~~~contoh
Ich kann gut schwimmen. | Aku bisa berenang dengan baik.
Wir möchten einen Kaffee trinken. | Kami ingin minum kopi.
~~~

### Pertanyaan W (W-Fragen)
**Kata tanya (posisi 1) + verba (posisi 2) + subjek + …**

| Kata tanya | Arti | Contoh |
|---|---|---|
| Wer | siapa | Wer ist das? |
| Was | apa | Was machst du? |
| Wo | di mana | Wo wohnst du? |
| Woher | dari mana | Woher kommst du? |
| Wohin | ke mana | Wohin fährst du? |
| Wann | kapan | Wann beginnt der Kurs? |
| Wie | bagaimana | Wie heißt du? |
| Wie viel | berapa | Wie viel kostet das? |
| Warum | mengapa | Warum lernst du Deutsch? |

~~~contoh
Woher kommst du? – Ich komme aus Indonesien. | Kamu dari mana? – Aku dari Indonesia.
Wann beginnt der Kurs? – Um neun Uhr. | Kapan kursusnya mulai? – Jam sembilan.
~~~

### Pertanyaan Ja/Nein
Untuk pertanyaan yang jawabannya ya/tidak, **verba pindah ke posisi 1**. Tidak perlu kata tanya.

~~~contoh
Wohnst du in Jakarta? – Ja, ich wohne in Jakarta. | Kamu tinggal di Jakarta? – Ya, aku tinggal di Jakarta.
Sprichst du Deutsch? – Nein, noch nicht. | Kamu bisa bahasa Jerman? – Belum.
~~~

### Ja, Nein, Doch
- **Ja** = ya, untuk pertanyaan positif.
- **Nein** = tidak.
- **Doch** = "tentu saja ya!" untuk membantah **pertanyaan negatif**.

~~~contoh
Kommst du nicht? – Doch, ich komme! | Kamu tidak datang? – Datang kok!
Hast du keinen Hunger? – Doch! | Kamu tidak lapar? – Lapar kok!
~~~
`

export const A1_NEGASI = `
Bahasa Jerman punya dua kata utama untuk menyangkal: **kein** (untuk kata benda) dan **nicht** (untuk hampir semua yang lain). Kuncinya: lihat dulu apakah yang disangkal adalah kata benda **tanpa artikel** atau dengan **ein/eine**.

### kein — "tidak ada / bukan (sebuah)"
Dipakai untuk kata benda dengan **ein/eine** atau **tanpa artikel**. *kein* berubah persis seperti *ein*, ditambah bentuk jamak.

| | Nominativ (subjek) | Akkusativ (objek) |
|---|---|---|
| Maskulin | kein | kein**en** |
| Feminin | kein**e** | kein**e** |
| Netral | kein | kein |
| Jamak | kein**e** | kein**e** |

Dengan *haben* dan banyak kata kerja lain, objeknya berbentuk Akkusativ, jadi maskulin menjadi **keinen**.

~~~contoh
Das ist ein Hund. → Das ist kein Hund. | Itu seekor anjing. → Itu bukan anjing.
Ich habe einen Bruder. → Ich habe keinen Bruder. | Aku punya saudara laki-laki. → Aku tidak punya saudara laki-laki.
Ich trinke Kaffee. → Ich trinke keinen Kaffee. | Aku minum kopi. → Aku tidak minum kopi.
Wir haben Zeit. → Wir haben keine Zeit. | Kami punya waktu. → Kami tidak punya waktu.
Ich habe keine Geschwister. | Aku tidak punya saudara kandung.
~~~

### nicht — untuk yang lain
Dipakai untuk **kata kerja, adjektiva, keterangan, kata benda dengan der/die/das/mein, dan nama**.

Posisi *nicht*:
- **Menyangkal seluruh kalimat** → biasanya di **akhir** kalimat: *Ich komme heute nicht.*
- **Sebelum adjektiva**: *Das Buch ist nicht neu.*
- **Sebelum keterangan tempat**: *Ich wohne nicht in Berlin.*
- **Sebelum kata benda dengan der/die/das**: *Das ist nicht der Lehrer.*
- **Sebelum gern, gut, oft**: *Ich schwimme nicht gern.*

~~~contoh
Ich komme heute nicht. | Aku tidak datang hari ini.
Das Buch ist nicht neu. | Buku itu tidak baru.
Ich wohne nicht in Berlin. | Aku tidak tinggal di Berlin.
Das ist nicht mein Handy. | Itu bukan HP-ku.
Ich schwimme nicht gern. | Aku tidak suka berenang.
~~~

### Cara cepat memilih
1. Yang disangkal kata benda?
2. Kalau **ya**, dan artikelnya *ein/eine* atau tidak ada artikel → **kein**.
3. Kalau **tidak**, atau artikelnya *der/die/das/mein/dein* → **nicht**.

### nicht/kein …, sondern …
Untuk mengoreksi ("bukan A, melainkan B"), pakai **sondern**, bukan *aber*.

~~~contoh
Das ist kein Tee, sondern Kaffee. | Ini bukan teh, melainkan kopi.
Ich wohne nicht in Berlin, sondern in München. | Aku tidak tinggal di Berlin, tetapi di München.
~~~
`
