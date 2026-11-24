# Rencana UI: "Calm Minimal + Swiss untuk kata Jerman"

Tanggal: 2026-11-24 · Branch: `feat/german-mvp` · Cakupan: hanya MVP Jerman (`/de`, `/mulai`). App lama tidak disentuh.

## Keputusan (dari user)
| Topik | Keputusan |
|---|---|
| Gaya | Struktur **Calm Minimal** (off-white, kartu putih, border 1px) + hierarki **Swiss/Bauhaus** khusus untuk kata Jerman & artikel |
| Warna | **Netral**; warna hanya untuk der/die/das + status benar/salah |
| Huruf | **Sans modern** satu keluarga (Geist), hierarki lewat ukuran & bobot |
| Gamifikasi | **Secukupnya**: streak, progres, animasi halus; confetti hanya momen besar |

## Design tokens (scoped `.de-ui`)
- **Latar** `#FAFAFA` · **Permukaan** `#FFFFFF` · **Border** `#E5E5E5` (1px) · **Divider** `#F0F0F0`
- **Teks** `#0A0A0A` (utama) · `#525252` (sekunder) · `#A3A3A3` (tersier)
- **Tombol utama** hitam `#0A0A0A` + teks putih · **Sekunder** putih + border
- **Gender** (satu-satunya warna kuat): der `#2563EB` · die `#DC2626` · das `#059669`
- **Status**: benar = hijau lembut (latar `#F0FDF4`, ikon `#15803D`), salah = merah lembut (latar `#FEF2F2`, ikon `#B91C1C`)
- **Radius** kartu 14px, tombol 10px, chip 999px · **Bayangan**: tidak ada / `0 1px 2px rgb(0 0 0 / .04)`
- **Huruf**: Geist; bobot 400/500/600 (tanpa 800). Skala: 12 · 14 · 16 · 20 · 28 · 44–56 (kata Jerman)
- **Label Swiss**: 11px, UPPERCASE, `letter-spacing: .08em`, abu-abu (mis. `NOMEN · FEMININ`)
- **Gerak**: 150–200ms ease-out; tekan = `scale(.98)`; flip kartu tetap; hormati reduced-motion

## Kata Jerman (bagian "Swiss")
- Kata besar 44–56px, bobot 600, `tracking -0.02em`, rata kiri di kartu.
- Artikel berwarna gender, ukuran sama dengan kata.
- Garis aksen 3px warna gender di sisi kiri kartu kata (satu-satunya dekorasi).
- Info di bawahnya dalam grid label/isi: `JAMAK  die Familien` · `ARTI  keluarga`.

## Tugas
1. **Fondasi**: kelas `.de-ui` + token di `globals.css`; hapus tekstur kertas, bayangan 3D tombol, `font-extrabold` → 600; komponen kecil `components/de/ui.tsx` (Button, Card, Label, Stat, Segmented).
2. **Navigasi**: bottom nav putih + border atas 1px, ikon stroke 1.75, aktif = hitam + label (tanpa pil mint).
3. **Beranda**: kartu "Hari ini" putih (angka besar, label kecil), tombol hitam "Mulai"; daftar kategori jadi list dengan divider (ikon outline monokrom).
4. **Kartu kata** (`WordFaces`, `SwipeDeck`, `DailySession`, `SmartSession`): tampilan Swiss; tombol Belum/Balik/Hafal netral (Belum = outline, Hafal = hitam); stempel HAFAL/BELUM tipis.
5. **Latihan** (`TopicPractice`, `ArticleQuiz`): opsi outline putih; der/die/das tetap berwarna; bottom sheet hijau/merah lembut; hapus combo/flame.
6. **Materi**: daftar bernomor gaya Swiss (01, 02 …), status ikon monokrom; halaman materi: tabel garis tipis, contoh kalimat dengan garis kiri abu, `strong` der/die/das berwarna.
7. **Progress & Kredit & Mulai**: angka besar, bar tipis 4px netral (hafal = hitam, belajar = abu), legenda kecil.
8. **Gamifikasi secukupnya**: confetti hanya saat "Hari ini selesai" & "Materi dikuasai"; animasi benar = centang halus; streak kecil di header.
9. **Verifikasi**: tsc, lint, cek iPhone SE & Pixel 7, kontras teks ≥ 4.5:1.

## Di luar cakupan
Dark mode, redesign app lama (non-`/de`), logo/brand baru.
