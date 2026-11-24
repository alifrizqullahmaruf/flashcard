/**
 * A1 grammar lessons, part 2 (Akkusativ, Modalverben).
 * Same conventions as lessons.ts: `~~~contoh` blocks → example cards with audio.
 */

export const A1_AKKUSATIV = `
Dalam kalimat bahasa Jerman, kata benda bisa punya **peran** yang berbeda. Peran ini disebut **kasus**. Di A1 kamu perlu dua kasus:

- **Nominativ** = **subjek** (siapa/apa yang melakukan). Pertanyaannya: *Wer? Was?*
- **Akkusativ** = **objek langsung** (siapa/apa yang dikenai). Pertanyaannya: *Wen? Was?*

~~~contoh
Der Hund ist groß. | Anjing itu besar. (der Hund = subjek)
Ich sehe den Hund. | Aku melihat anjing itu. (den Hund = objek)
~~~

### Kabar baik: hanya maskulin yang berubah
| | Nominativ | Akkusativ |
|---|---|---|
| Maskulin | **der** / ein / kein / mein | **den** / ein**en** / kein**en** / mein**en** |
| Feminin | die / eine | die / eine *(sama)* |
| Netral | das / ein | das / ein *(sama)* |
| Jamak | die / – | die / – *(sama)* |

Jadi kamu hanya perlu ingat satu hal: **maskulin + objek → -en** (den, einen, keinen, meinen).

~~~contoh
Ich habe einen Bruder. | Aku punya seorang saudara laki-laki.
Ich habe eine Schwester. | Aku punya seorang saudara perempuan.
Ich habe ein Kind. | Aku punya seorang anak.
Er kauft den Tisch. | Dia membeli meja itu.
Wir haben keinen Hunger. | Kami tidak lapar.
~~~

### Kata kerja yang selalu butuh Akkusativ
Kata kerja berikut sering muncul di A1 dan langsung diikuti objek Akkusativ:
**haben, brauchen, möchten, kaufen, nehmen, essen, trinken, sehen, suchen, besuchen, lesen, bestellen**, dan ungkapan **es gibt** (ada).

~~~contoh
Ich brauche einen Stift. | Aku butuh sebuah pulpen.
Wir möchten einen Kaffee. | Kami mau satu kopi.
Er sucht seinen Schlüssel. | Dia mencari kuncinya.
Es gibt einen Park in der Nähe. | Ada sebuah taman di dekat sini.
~~~

### Tips: posisi tidak menentukan peran
Karena bentuknya berubah, bahasa Jerman boleh menaruh objek di depan. Lihat artikelnya, bukan urutannya.

~~~contoh
Den Film finde ich gut. | Film itu menurutku bagus.
~~~

### Kata ganti orang di Akkusativ
| Nominativ | ich | du | er | sie | es | wir | ihr | sie / Sie |
|---|---|---|---|---|---|---|---|---|
| Akkusativ | **mich** | **dich** | **ihn** | sie | es | **uns** | **euch** | sie / Sie |

~~~contoh
Kennst du ihn? | Kamu kenal dia (lk)?
Ich liebe dich. | Aku mencintaimu.
Besuchst du uns morgen? | Kamu mengunjungi kami besok?
~~~
`

export const A1_MODAL = `
**Modalverben** adalah kata kerja bantu yang menunjukkan **kemampuan, keharusan, keinginan, atau izin**. Di A1 ada enam:

| Modalverb | Arti | Contoh |
|---|---|---|
| **können** | bisa, mampu | Ich kann schwimmen. |
| **müssen** | harus | Ich muss arbeiten. |
| **wollen** | mau (keinginan kuat) | Ich will nach Berlin fahren. |
| **möchten** | ingin (sopan) | Ich möchte einen Kaffee. |
| **dürfen** | boleh | Darf ich hier rauchen? |
| **sollen** | sebaiknya, disuruh | Der Arzt sagt, ich soll viel trinken. |

### Aturan "kurung": verba kedua di akhir
Modalverb di **posisi 2** (dikonjugasikan), kata kerja utama di **akhir kalimat** dalam bentuk dasar (*Infinitiv*).

| Posisi 1 | Posisi 2 | Tengah | Akhir |
|---|---|---|---|
| Ich | **kann** | gut | **schwimmen**. |
| Heute | **muss** | ich lange | **arbeiten**. |
| Wir | **möchten** | eine Pizza | **bestellen**. |

~~~contoh
Ich kann gut Deutsch sprechen. | Aku bisa berbahasa Jerman dengan baik.
Heute muss ich lange arbeiten. | Hari ini aku harus bekerja lama.
Wir möchten eine Pizza bestellen. | Kami ingin memesan pizza.
~~~

### Konjugasi: ich dan er sama, tanpa akhiran
| | können | müssen | wollen | dürfen | sollen | möchten |
|---|---|---|---|---|---|---|
| ich | kann | muss | will | darf | soll | möchte |
| du | kannst | musst | willst | darfst | sollst | möchtest |
| er/sie/es | **kann** | **muss** | **will** | **darf** | **soll** | **möchte** |
| wir | können | müssen | wollen | dürfen | sollen | möchten |
| ihr | könnt | müsst | wollt | dürft | sollt | möchtet |
| sie/Sie | können | müssen | wollen | dürfen | sollen | möchten |

Perhatikan: untuk **ich** dan **er/sie/es**, bentuknya **sama dan tanpa -t** (er kann, bukan *er kannt*). Vokal juga berubah di bentuk tunggal (können → kann, müssen → muss, dürfen → darf).

### Pertanyaan
Pertanyaan Ja/Nein: **Modalverb di posisi 1**, infinitiv tetap di akhir.

~~~contoh
Kannst du mir helfen? | Bisakah kamu membantuku?
Darf ich das Fenster öffnen? | Bolehkah aku membuka jendela?
Was möchten Sie trinken? | Anda ingin minum apa?
~~~

### Hati-hati dengan negasi
- **nicht dürfen** = *tidak boleh* (dilarang)
- **nicht müssen** = *tidak perlu* (bukan "tidak boleh"!)

~~~contoh
Hier darf man nicht parken. | Di sini tidak boleh parkir.
Du musst nicht kommen. | Kamu tidak perlu datang.
~~~

### möchten vs. wollen
**möchten** lebih sopan, cocok untuk memesan dan meminta. **wollen** terdengar lebih tegas.

~~~contoh
Ich möchte bitte zahlen. | Saya ingin membayar.
Ich will jetzt nach Hause! | Aku mau pulang sekarang!
~~~
`
