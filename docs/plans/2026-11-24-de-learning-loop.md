# Rencana: Alur belajar (Materi dikuasai + Kartu hafal/belum)

Tanggal: 2026-11-24 · Branch: `feat/german-mvp` · Penyimpanan: localStorage (MVP, tanpa login)

## Keputusan (dari user)
| Topik | Keputusan |
|---|---|
| Materi "Dikuasai" | Tombol **"Saya sudah paham"** → *Sudah dibaca*; skor latihan **≥ 80%** → *Dikuasai* |
| Kartu "Hafal" muncul lagi | **Otomatis FSRS** (jarak makin panjang, reset kalau lupa) |
| Target kata baru | **10 kata / hari** (bisa diubah nanti) |
| Ulang grammar | **Ya**: soal dari materi yang dikuasai ikut "Ulang hari ini" |

## Konsep
- **Status materi**: `belum` → `dibaca` → `dikuasai` (+ tanggal).
- **Status kartu** (dari FSRS): `baru` → `belajar` → `hafal` (stabilitas/jarak ≥ 21 hari) · flag `sulit` kalau lapses ≥ 4.
- **Antrian harian** = kartu jatuh tempo (semua kategori) + ≤ 10 kata baru + 3–5 soal grammar jatuh tempo.

## Tugas
1. **`lib/de/progress.ts`** — tambah:
   - `getTopicStatus / markRead / recordPracticeScore(level, topic, pct)` (≥80 → dikuasai).
   - `cardState(level, cat, word)` → baru/belajar/hafal/sulit; `getDueAll()` lintas kategori.
   - `dailyNewCount()` + batas 10/hari (reset per tanggal lokal).
   - FSRS untuk **soal grammar** (`de:gsrs:<level>:<topic>`), kunci per index soal.
2. **Materi**
   - Tombol "Saya sudah paham" di akhir halaman materi → *Sudah dibaca* + ajakan "Uji dengan latihan".
   - `TopicPractice` simpan skor via `recordPracticeScore`; layar akhir tampilkan "Materi dikuasai!" bila ≥ 80%.
   - Daftar Materi: ikon status (lingkaran kosong / setengah / centang) + bar progress per level.
3. **Kartu hafal / belum**
   - "Belum": tetap diulang di ronde yang sama + jadwal FSRS *Again* (muncul lagi hari ini/besok).
   - "Hafal": FSRS *Good*, kartu disembunyikan sampai jatuh tempo.
   - Halaman kategori: ringkasan "Baru 4 · Belajar 3 · Hafal 2 · Sulit 1"; kartu sulit diberi badge + petunjuk.
4. **Beranda – "Hari ini"**
   - Kartu besar: "Ulang N kartu · M kata baru · K soal grammar" → tombol **Mulai** ke sesi harian campuran (`/de/hari-ini`).
   - Streak harian terhitung bila sesi harian selesai.
5. **Materi ↔ Kartu**
   - Setelah *Artikel* dibaca: tombol "Latih der/die/das dengan kosakata" (mode Artikel lintas kategori).
   - Soal latihan yang salah → masuk FSRS grammar (muncul di "Hari ini").
6. **Progress**
   - "Siap A1: X%" = 50% grammar dikuasai + 50% kosakata hafal; rincian per kategori (baru/belajar/hafal) dan per topik.
7. **Verifikasi** — `tsc`, lint, cek di browser ukuran HP (iPhone SE & Pixel 7), alur: baca → paham → latihan ≥80% → centang; geser hafal/belum → angka "Hari ini" berubah.

## Di luar cakupan (nanti)
Sinkron ke Firestore/akun, notifikasi pengingat, pengaturan target dari UI.
