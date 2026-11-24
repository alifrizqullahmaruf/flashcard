/** A1 grammar lessons, part 4 (Possessivartikel, Imperativ). Same `~~~contoh` convention. */

export const A1_POSSESSIV = `
**Possessivartikel** menunjukkan **milik siapa**: *mein Buch* = bukuku. Bentuknya menggantikan artikel, jadi tidak ada *der/die/das* lagi.

| Pemilik | Artikel milik | Contoh |
|---|---|---|
| ich | **mein** | mein Vater (ayahku) |
| du | **dein** | dein Handy (HP-mu) |
| er / es | **sein** | sein Auto (mobilnya — milik dia lk) |
| sie (dia pr) | **ihr** | ihr Bruder (saudaranya — milik dia pr) |
| wir | **unser** | unser Haus (rumah kami) |
| ihr (kalian) | **euer** | euer Lehrer (guru kalian) |
| sie (mereka) | **ihr** | ihr Kind (anak mereka) |
| Sie (Anda) | **Ihr** | Ihr Pass (paspor Anda) |

~~~contoh
Das ist mein Vater. | Ini ayahku.
Wie ist dein Name? | Siapa namamu?
Anna sucht ihren Schlüssel. | Anna mencari kuncinya.
Ist das Ihr Koffer? | Apakah ini koper Anda?
~~~

### sein atau ihr? Lihat pemiliknya
Pilihannya tergantung **pemilik**, bukan bendanya:
- Pemiliknya laki-laki (er) → **sein**: *Tom und **seine** Schwester*.
- Pemiliknya perempuan (sie) → **ihr**: *Lisa und **ihr** Bruder*.

### Akhiran: persis seperti ein / kein
| | Nominativ | Akkusativ |
|---|---|---|
| Maskulin | mein | mein**en** |
| Feminin | mein**e** | mein**e** |
| Netral | mein | mein |
| Jamak | mein**e** | mein**e** |

Jadi kamu cukup ingat pola *ein*: feminin & jamak → **-e**, maskulin objek → **-en**.

~~~contoh
Meine Mutter ist Lehrerin. | Ibuku seorang guru.
Ich besuche meinen Bruder. | Aku mengunjungi saudara laki-lakiku.
Unsere Kinder spielen draußen. | Anak-anak kami bermain di luar.
~~~

### Catatan: euer
*euer* kehilangan **e** kedua saat diberi akhiran: euer Lehrer, tapi **eure** Lehrerin, **euren** Sohn.

~~~contoh
Wo ist eure Wohnung? | Di mana apartemen kalian?
~~~
`

export const A1_IMPERATIV = `
**Imperativ** dipakai untuk **memerintah, meminta, atau memberi saran**: *Komm!* (Datang!), *Bitte warten Sie.* (Silakan tunggu.) Ada tiga bentuk sesuai lawan bicara.

| Untuk | Cara membuat | kommen | warten |
|---|---|---|---|
| **du** | bentuk *du* tanpa **-st** dan tanpa *du* | **Komm!** | **Warte!** |
| **ihr** | bentuk *ihr* tanpa *ihr* | **Kommt!** | **Wartet!** |
| **Sie** | kata kerja + **Sie** (verba di depan) | **Kommen Sie!** | **Warten Sie!** |

~~~contoh
Komm bitte her! | Tolong datang ke sini!
Kinder, kommt essen! | Anak-anak, ayo makan!
Warten Sie bitte einen Moment. | Silakan tunggu sebentar.
~~~

### Perubahan vokal e → i / ie tetap ada (bentuk du)
- geben → du gibst → **Gib!**
- nehmen → du nimmst → **Nimm!**
- lesen → du liest → **Lies!**
- essen → du isst → **Iss!**
- helfen → du hilfst → **Hilf!**

Tapi **a → ä tidak dipakai**: fahren → **Fahr!** (bukan *Fähr!*), schlafen → **Schlaf!**

~~~contoh
Nimm doch ein Stück Kuchen! | Ambillah sepotong kue!
Lies den Text bitte laut. | Tolong bacakan teksnya keras-keras.
Fahr vorsichtig! | Hati-hati menyetir!
~~~

### Kata kerja terpisah: awalan di akhir
~~~contoh
Steh auf! | Bangun!
Ruf mich morgen an! | Telepon aku besok!
Machen Sie bitte das Fenster zu. | Tolong tutup jendelanya.
~~~

### sein (tidak beraturan)
**Sei** ruhig! · **Seid** leise! · **Seien Sie** pünktlich!

### Supaya lebih sopan
Tambahkan **bitte**, **mal**, atau **doch**: *Komm doch mit!* (Ayo ikut!) · *Hilf mir bitte mal.* (Tolong bantu aku sebentar.) Untuk orang yang belum akrab, pakai bentuk **Sie**.
`
