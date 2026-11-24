# Langkah 4 — Level A2

**Tujuan:** setelah A1 dikuasai, user lanjut ke A2 (Goethe-Zertifikat A2) dengan kosakata & grammar baru, tanpa melupakan A1.
**Perkiraan:** 5–7 sesi · **Prasyarat:** Langkah 1 selesai (struktur data per kategori + validator), idealnya Langkah 3 (sinkron).
**Referensi:** Goethe-Zertifikat A2 – Wortliste (kumulatif ±1.300 kata, jadi ±650 kata **baru**) & Testbeschreibung A2.

## 4.1 Alur naik level (keputusan D4-1)
- **Default:** A2 terbuka otomatis saat **Kesiapan A1 ≥ 80%**; sebelum itu tampil terkunci dengan teks "Kesiapan A1: 64% · butuh 80%".
- Tombol "Buka A2 sekarang" tetap ada (untuk yang sudah punya dasar) → konfirmasi singkat.
- Saat terbuka: layar perayaan kecil (confetti = momen besar) + `targetLevel` berubah ke `a2` (Beranda, Hari ini, Kesiapan ikut).
- **Kata baru harian** diambil dari A2; **kartu A1 tetap diulang** sesuai jadwal FSRS (tidak dihapus).
- Halaman Materi/Kartu: A1 tetap bisa dibuka; level aktif ditandai.

## 4.2 Kosakata A2 (±650 kata baru)
Tema baru/perluasan (diselaraskan dengan Wortliste A2):
| # | Slug | Tema | ± kata |
|---|---|---|---|
| 1 | `alltag` | Rutinitas & rumah tangga | 45 |
| 2 | `gesundheit` | Kesehatan & dokter (lanjutan) | 45 |
| 3 | `arbeit2` | Pekerjaan, lamaran, kantor | 55 |
| 4 | `ausbildung` | Sekolah, kursus, studi | 40 |
| 5 | `reisen2` | Perjalanan, hotel, reservasi | 50 |
| 6 | `verkehr` | Lalu lintas, mobil, kecelakaan | 35 |
| 7 | `medien` | Media, internet, telepon | 40 |
| 8 | `feste` | Perayaan, hadiah, undangan | 35 |
| 9 | `natur` | Alam, lingkungan, hewan | 40 |
| 10 | `gefuehle` | Perasaan & sifat orang | 45 |
| 11 | `einkaufen2` | Belanja, reklamasi, bank | 45 |
| 12 | `behoerden` | Kantor pemerintah, formulir | 35 |
| 13 | `verben2` | Verba A2 (refleksif, + Dativ) | 70 |
| 14 | `kleinwoerter2` | Konektor, Präposition Dativ/Wechsel | 50 |
Pipeline sama dengan A1: data per kategori → validator Wiktionary → audio → tahap per ±150 kata.

**Tambahan field untuk A2:** verba menampilkan **Perfekt dengan sein/haben** dan kasus yang diminta (mis. `helfen + Dativ`); kata dengan pasangan refleksif ditandai (`sich freuen`).

## 4.3 Materi grammar A2 (9 topik, sudah ada judulnya di `content.ts`)
| # | Materi | Bagian latihan (rencana) |
|---|---|---|
| 1 | Dativ | artikel, pronomen, verba + Dativ |
| 2 | Wechselpräpositionen | wo (Dativ) vs. wohin (Akkusativ) |
| 3 | Perfekt | haben/sein, Partizip II beraturan/tidak |
| 4 | Präteritum sein/haben/modal | war/hatte/konnte |
| 5 | Kata kerja refleksif | sich + Akk/Dat |
| 6 | Anak kalimat weil/dass/wenn | verba di akhir |
| 7 | Komparativ & Superlativ | -er, am -sten, umlaut, gut→besser |
| 8 | Deklinasi adjektiva dasar | setelah der/ein/tanpa artikel |
| 9 | würde / hätte / könnte | permintaan sopan |
Tiap materi: penjelasan + contoh bersuara + 20–25 soal, 5 jenis.
**Jenis soal baru yang mungkin dibutuhkan:** `transform` (ubah kalimat Präsens → Perfekt; dinilai seperti `gap` dengan beberapa jawaban benar).

## 4.4 Simulasi ujian A2
Ulangi kerangka Langkah 2 dengan format A2 (Hören, Lesen, Schreiben, Sprechen — tugas lebih panjang). Dikerjakan setelah konten A2 ≥ 60%.

## 4.5 Kesiapan per level
- `levelReadiness(level)` sudah generik → tambah tampilan per level di Progress (tab A1 / A2).
- Beranda: "Target ujian: Goethe-Zertifikat A2 · X% siap".

## 4.6 Tahapan
| Tahap | Isi |
|---|---|
| A2-1 | Alur naik level + kunci/terbuka + targetLevel |
| A2-2 | Kosakata kategori 1–5 + Dativ, Perfekt |
| A2-3 | Kategori 6–10 + Wechselpräp., Präteritum, Refleksif |
| A2-4 | Kategori 11–14 + weil/dass/wenn, Komparativ, Adjektiv, würde |
| A2-5 | Simulasi ujian A2 |

## Risiko
| Risiko | Mitigasi |
|---|---|
| Beban ulangan harian membengkak (A1 + A2) | Batas ulangan harian (mis. 100) + kata baru otomatis dikurangi bila ulangan menumpuk |
| User merasa "mengulang A1 terus" | Statistik terpisah per level; kartu A1 matang jaraknya panjang |
| Grammar A2 jauh lebih kompleks | Penjelasan bertahap + jenis soal `transform` |
