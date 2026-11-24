# Langkah 1 — Lengkapi A1 (kosakata ±650 + 7 materi)

**Tujuan:** isi app cukup untuk benar-benar mengantar ke ujian Goethe A1.
**Perkiraan:** 4–6 sesi, dikerjakan dalam **5 tahap** yang masing-masing bisa dicoba di HP.
**Referensi:** Goethe-Institut *Start Deutsch 1 – Wortliste* (daftar kata resmi A1) & *Prüfungsziele/Testbeschreibung* (kemampuan yang diuji).

---

## 1.A Restrukturisasi data (fondasi, dikerjakan sekali)
Masalah: semua kata ada di `lib/de/content.ts`; dengan 650 kata file ini akan >5.000 baris.

1. **Pisah file per kategori:** `lib/de/vocab/a1/<slug>.ts`, masing-masing export `Category`.
   `lib/de/vocab/index.ts` menggabungkan → `CATEGORIES` (API tetap sama, komponen tidak berubah).
2. **Tambah field opsional di `Word`:**
   - `id` stabil (`slug`) agar kunci FSRS tidak rusak bila teks kata diperbaiki (mis. `"a1-familie-vater"`).
     Migrasi: kunci FSRS lama (`de:srs:<level>:<cat>` → `word.de`) dipetakan ke `id` sekali saat load.
   - `tags?: string[]` (mis. `["wortgruppe:monate"]`) untuk filter/latihan khusus.
   - `level` tidak perlu (sudah dari kategori).
3. **Urutan belajar** (`getNewWords`) memakai urutan kategori di bawah, bukan urutan file.

## 1.B Kategori kosakata A1 (keputusan D1-1: urutan)
Disusun dari tema yang sering muncul di ujian A1 (perkenalan, angka/waktu, belanja, kota, kerja) dan Wortgruppen di Wortliste. Target ±650 kata total.

| # | Slug | Judul (ID / DE) | Isi utama | ± kata |
|---|---|---|---|---|
| 1 | `person` | Tentang diri / Person | nama, umur, alamat, negara, bahasa, kebangsaan | 40 |
| 2 | `familie` ✅ | Keluarga / Familie | (ada 10) + Ehemann, Großeltern, verheiratet … | 30 |
| 3 | `zahlen` ✅ | Angka / Zahlen | (ada 10) + 11–100, Ordinalzahlen, Preis | 40 |
| 4 | `zeit` | Waktu / Zeit | hari, bulan, musim, jam, Tageszeiten, heute/morgen | 50 |
| 5 | `essen` ✅ | Makanan & Minuman | (ada 10) + Frühstück, Restaurant, bestellen | 50 |
| 6 | `einkaufen` | Belanja & Pakaian | Geschäft, Kasse, kosten, Größe, Hose … | 40 |
| 7 | `wohnen` | Tempat tinggal | Wohnung, Zimmer, Küche, Miete, Möbel | 40 |
| 8 | `stadt` | Kota & Transportasi | Bahnhof, Bus, Fahrkarte, links/rechts, Haltestelle | 45 |
| 9 | `reisen` | Perjalanan & Liburan | Urlaub, Hotel, Pass, Flughafen, Gepäck | 30 |
| 10 | `koerper` | Tubuh & Kesehatan | Kopf, Arzt, krank, Termin, Apotheke | 35 |
| 11 | `arbeit` | Kerja & Profesi | Beruf, Büro, Firma, arbeiten, Kollege | 40 |
| 12 | `schule` ✅ | Sekolah & Belajar | (ada 10) + Kurs, Prüfung, Wörterbuch | 30 |
| 13 | `freizeit` | Hobi & Waktu luang | Sport, Kino, Musik, schwimmen, Freund | 35 |
| 14 | `kommunikation` | Komunikasi | Telefon, E-Mail, Brief, Formular, unterschreiben | 30 |
| 15 | `wetter` | Cuaca & Alam | Sonne, Regen, warm, kalt | 20 |
| 16 | `farben` ✅ | Warna & Sifat | (ada 9) + groß/klein, neu/alt, gut/schlecht | 35 |
| 17 | `verben` | Kata kerja inti | sein, haben, gehen, kommen, machen, können … | 60 |
| 18 | `kleinwoerter` | Kata kecil | Fragewörter, Präpositionen, und/oder/aber, nicht/kein | 40 |
✅ = kategori sudah ada (diperluas). Total ≈ 690 (sebagian overlap → ±650 unik).

**Aturan isi per kata** (sama dengan sekarang):
- `de`, `id` (arti singkat, bisa >1 arti dipisah "/"), `kind`, `gender` + `plural` untuk nomen,
  `forms` untuk verba: `er-Form · Perfekt` (keputusan **D1-2**: default ditampilkan), `example` (kalimat A1 sederhana, ≤ 8 kata, **ditulis sendiri**), `exampleId`, `hint` opsional (pola akhiran, jebakan).
- Kata yang hanya muncul dalam frasa (mis. *Entschuldigung*, *Guten Tag*) → `kind: 'other'` dengan contoh situasi.

## 1.C Validasi otomatis (wajib sebelum kata masuk)
Script `scripts/de-vocab/validate.ts` (tsx):
1. Untuk tiap nomen → ambil wikitext de.wiktionary (`action=parse&prop=wikitext`, sudah terbukti bisa diakses), baca `Genus=` dan `Nominativ Plural=` dari template *Deutsch Substantiv Übersicht*.
2. Bandingkan dengan data kita → laporan `OK / BEDA / TIDAK DITEMUKAN`.
3. Cek duplikat `de` antar kategori, field wajib terisi, contoh kalimat mengandung kata targetnya.
4. Cache hasil di `scripts/de-vocab/.cache/` (tidak di-commit), jeda 0,5 dtk per request.
Kriteria: **0 BEDA** sebelum commit (yang beda diperiksa manual).

## 1.D Audio untuk kata baru
`npx tsx scripts/de-audio/collect.ts` → `build.py --no-native` (hanya teks baru yang dibuat; cache by hash).
Perkiraan: ±1.300 klip (kata + contoh) ≈ 15 MB mp3. Jika rekaman penutur asli disetujui → jalankan tanpa `--no-native`.

## 1.E Tujuh materi grammar A1 yang tersisa
Format sama dengan 4 materi yang ada: penjelasan + tabel + blok `~~~contoh` (dengan suara) + latihan **5 jenis** dibagi per bagian.

| # | Materi | Bagian latihan | Isi kunci |
|---|---|---|---|
| 5 | **Akkusativ** | `artikel`, `kein`, `verba` | der→den, ein→einen, kein→keinen; verba + Akk (haben, brauchen, möchten, kaufen) |
| 6 | **Bentuk jamak** | `pola`, `umlaut`, `-s` | -e, -er, -n/-en, -s, tanpa akhiran; umlaut; selalu *die* |
| 7 | **Modalverben** | `konjugasi`, `kalimat` | können, müssen, wollen, möchten, dürfen, sollen; verba ke-2 di akhir |
| 8 | **Kata kerja terpisah** | `prefiks`, `posisi` | an-, auf-, aus-, ein-, mit-, zu-; prefiks di akhir kalimat |
| 9 | **Possessivartikel** | `bentuk`, `akkusativ` | mein/dein/sein/ihr/unser/euer/Ihr + -e/-en |
| 10 | **Imperativ** | `du`, `ihr`, `Sie` | Komm!, Kommt!, Kommen Sie!; bitte; verba kuat (Lies!, Gib!) |
| 11 | **Waktu: jam & tanggal** | `uhrzeit`, `präposition` | Wie spät ist es?, halb/Viertel; um/am/im; Ordinalzahl tanggal |
Target per materi: 18–25 soal, tiap bagian memakai ≥ 3 jenis soal.

## 1.F Tahapan kerja (masing-masing dicoba di HP lalu commit)
| Tahap | Isi | Kriteria selesai |
|---|---|---|
| T1 | 1.A restrukturisasi + validator 1.C + migrasi kunci FSRS | progres lama tidak hilang; validator jalan pada 49 kata lama |
| T2 | Kategori 1–5 (person, familie+, zahlen+, zeit, essen+) ≈ 210 kata + audio + **Akkusativ** & **Modalverben** | validator 0 BEDA; Hari ini menyajikan kata baru dari kategori baru |
| T3 | Kategori 6–10 ≈ 190 kata + audio + **Jamak** & **Kata kerja terpisah** | idem |
| T4 | Kategori 11–15 ≈ 155 kata + audio + **Possessiv** & **Imperativ** | idem |
| T5 | Kategori 16–18 ≈ 135 kata + audio + **Jam & tanggal** | Kartu A1 ±650; Materi A1 11/11; Kesiapan A1 dihitung dari 11 materi |

## 1.G Dampak ke fitur yang ada
- **Kesiapan A1** otomatis lebih akurat (penyebut jadi 11 materi & ±650 kata).
- **Latihan der/die/das** (`/de/latihan-artikel`) otomatis memakai semua nomen → batasi 30 kata acak per sesi agar tidak terlalu panjang.
- **Beranda**: daftar kategori jadi 18 → tampilkan 5 teratas "sedang dipelajari" + tautan "Semua".
- **Halaman Kartu**: kelompokkan kategori dengan label kecil (Diri & keluarga · Sehari-hari · Kota & perjalanan · Kerja & sekolah · Tata bahasa dasar).

## Risiko & mitigasi
| Risiko | Mitigasi |
|---|---|
| Salah gender/jamak | Validator Wiktionary + cek manual yang BEDA |
| Contoh kalimat terlalu sulit untuk A1 | Aturan ≤ 8 kata, hanya pakai kata A1 & Präsens/Perfekt dasar |
| Bundle JS membesar | Data kosakata dimuat per kategori (`import()` dinamis) bila > 200 KB |
| Kunci FSRS berubah | Migrasi ke `id` stabil di T1, dites dengan data lama |
