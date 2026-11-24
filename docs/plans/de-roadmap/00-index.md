# Roadmap Hafalin Deutsch (setelah MVP)

Dibuat: 2026-11-24 · Branch kerja: `feat/german-mvp` · Penanggung jawab keputusan: user

## Kondisi awal (baseline)
- MVP `/de` + `/mulai`: UI "Calm + Swiss", Hari ini, FSRS kartu & grammar, status materi, Kesiapan, audio Piper "Thorsten".
- Konten: **49 kata** A1 (5 kategori) dari ±650 Wortliste; **4/11 materi** A1 (87 soal); A2–C2 hanya judul topik.
- Progres di **localStorage** (per perangkat). Akses HP via Dev Tunnel (mati tiap 2 jam).
- **Belum ada commit** untuk semua pekerjaan `/de` (13 path berubah/baru).

## Urutan langkah
| # | Rencana | Tujuan | Perkiraan | File |
|---|---|---|---|---|
| 0 | Amankan & rapikan | Commit, perbaikan kecil, lint bersih | ½ sesi | [01-step0-amankan.md](01-step0-amankan.md) |
| 1 | Lengkapi A1 | ±650 kata + 7 materi + latihan | 4–6 sesi (bertahap) | [02-step1-lengkapi-a1.md](02-step1-lengkapi-a1.md) |
| 2 | Simulasi ujian A1 | Latihan format Goethe A1 (4 modul) | 3–4 sesi | [03-step2-simulasi-ujian.md](03-step2-simulasi-ujian.md) |
| 3 | Akses & akun | Deploy permanen + sinkron progres | 2–3 sesi | [04-step3-akses-akun.md](04-step3-akses-akun.md) |
| 4 | Level A2 | Konten A2 + buka otomatis dari A1 | 5–7 sesi | [05-step4-a2.md](05-step4-a2.md) |

"Sesi" = satu putaran kerja seperti percakapan ini (perkiraan kasar).

## Prinsip yang berlaku di semua langkah
1. **Konten ditulis sendiri.** Kata dari Wortliste boleh dipakai (fakta bahasa), tetapi contoh kalimat, penjelasan, dan soal ujian **dibuat sendiri**, tidak menyalin Modellsatz/buku.
2. **Akurasi bahasa diverifikasi otomatis** (gender, jamak) terhadap Wiktionary sebelum masuk app.
3. **Tiap tahap bisa dicoba di HP** sebelum lanjut, dan di-commit per tahap kecil.
4. **Tidak ada aksi keluar (deploy, push, layanan eksternal baru) tanpa persetujuan user.**
5. UI mengikuti [rencana Calm + Swiss](../2026-11-24-de-ui-calm-swiss.md); alur belajar mengikuti [learning loop](../2026-11-24-de-learning-loop.md).

## Keputusan yang masih terbuka (dikumpulkan dari tiap rencana)
| Kode | Pertanyaan | Langkah |
|---|---|---|
| D0-1 | Pesan commit satu besar atau dipecah per fitur? | 0 |
| D1-1 | Urutan kategori kosakata A1 (default: mengikuti tema paling sering di ujian) | 1 |
| D1-2 | Kata kerja ditampilkan dengan Perfekt sejak A1? (default: ya, kecil) | 1 |
| D2-1 | Sprechen: rekam suara sendiri saja, atau + pengenalan suara browser? | 2 |
| D2-2 | Schreiben: cek mandiri pakai checklist, atau koreksi AI (berbayar)? | 2 |
| D2-3 | Suara kedua (wanita) untuk dialog Hören: lisensi voice Piper perlu dicek | 2 |
| D3-1 | Hosting: Vercel (yang sudah dipakai app lama) atau lainnya? | 3 |
| D3-2 | Login wajib, atau boleh tamu dulu lalu sinkron saat login? | 3 |
| D3-3 | `/de` menggantikan app lama, atau hidup berdampingan? | 3 |
| D4-1 | Syarat buka A2: Kesiapan A1 ≥ 80%, atau boleh dibuka manual? | 4 |
