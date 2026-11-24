# Rencana — Belajar lebih efektif (flashcard akurat, konteks, berbicara)

Keputusan user (2026-11-24): prioritas **A + B + C**, penilaian **Lupa / Sulit / Hafal**, waktu belajar **20–30 menit/hari**.

## Rutinitas harian yang dituju
- **Hari ini** (±15 mnt): ulangan + kata baru + grammar (sudah ada).
- **Latihan konteks** (±10 mnt, baru): berganti per hari — kalimat rumpang (Sen/Kam), dikte (Sel/Jum), shadowing (Rab/Sab), menulis pendek (Min).

## Tahap 1 — Flashcard lebih akurat
1. **3 nilai**: Lupa (FSRS Again) · Sulit (Hard) · Hafal (Good). `review()` menerima nilai ini; "Sulit" tetap dihitung ingat tapi jaraknya lebih pendek.
   - Flashcard: geser kiri = Lupa, geser kanan = Hafal, tombol tengah = Sulit (ketuk kartu = balik).
   - Hari ini (kartu ulang): tombol Lupa / Sulit / Hafal.
   - Kata yang sudah "Lupa" di ronde yang sama tetap dijadwalkan besok walau nanti dijawab benar (aturan lama tetap).
2. **Arah kartu** (disimpan per perangkat): **Lihat** (Jerman → Indonesia), **Ingat** (Indonesia → Jerman), **Ketik** (Indonesia → Jerman, jawaban diketik).
3. **Ketik**: dinilai otomatis → saran nilai: tepat = Hafal, hampir (artikel kurang / ae-oe-ue-ss / huruf besar) = Sulit, salah = Lupa. User tetap mengetuk nilai akhir.

## Tahap 2 — Kata dalam konteks (dari 661 contoh kalimat yang sudah ada)
- **Kalimat rumpang**: kata target di contoh kalimat diganti ___ + arti Indonesia; ketik kata (bentuk persis di kalimat).
- **Dikte**: putar suara kalimat (normal/pelan) → ketik → koreksi per kata (benar/salah/hilang).
- Hanya kata yang sudah pernah dipelajari; salah → kata masuk ulangan (FSRS Again).
- Halaman `/de/konteks` + kartu "Latihan konteks" di Beranda (jenis berganti per hari).

## Tahap 3 — Berbicara & menulis
- **Shadowing**: dengar → rekam (MediaRecorder, tetap di HP) → putar bergantian dengan contoh.
- **Pengenalan suara** (Web Speech, Chrome/Android): transkrip + kata yang cocok/tidak; disembunyikan bila tidak didukung.
- **Menulis pendek** gaya Goethe A1 (tugas + 3 poin wajib + hitung kata + checklist + contoh jawaban). 8 tugas awal.

## Tahap 4 — Teks pendek per kategori
18 bacaan ±80 kata (hanya kosakata kategori), kata bisa diketuk untuk arti + suara per kalimat.

## Verifikasi tiap tahap
tsc, lint, build; uji di browser (localhost production build); commit + push ke `main` → cek deploy Vercel.
