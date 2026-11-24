# Rencana — Klar sebagai PWA (bisa dipasang di HP)

**Tujuan:** Klar bisa di-"install" dari browser HP (Android & iPhone), muncul sebagai ikon di layar utama, terbuka layar penuh, dan tetap bisa dipakai saat offline.
**Perkiraan:** 1 sesi · **Prasyarat:** HTTPS (sudah: Vercel production).

## Apa itu PWA (singkat)
Website + 3 komponen:
1. **Web App Manifest** — nama, ikon, warna, halaman awal → browser tahu ini "aplikasi".
2. **Service Worker** — skrip latar yang menyimpan halaman & audio di HP → **offline**.
3. **Ikon** dalam beberapa ukuran (192, 512, maskable untuk Android).

## Komponen teknis
| # | Bagian | File | Isi |
|---|---|---|---|
| 1 | Manifest | `app/manifest.ts` (fitur bawaan Next.js) | name "Klar — Bahasa Jerman", short_name "Klar", `start_url` (keputusan P1), `display: standalone`, `theme_color` & `background_color` `#FAFAFA`, ikon |
| 2 | Ikon | `public/icons/icon-192.png`, `icon-512.png`, `maskable-512.png` | Dirender dari `app/de/icon.svg` (K putih + 3 garis gender). Maskable = ruang aman 80% |
| 3 | Service worker | `public/sw.js` (ditulis manual, tanpa library — aman untuk Turbopack/Next 16) | Lihat strategi cache di bawah |
| 4 | Registrasi | `components/de/PwaRegister.tsx` (client) di `app/de/layout.tsx` & `app/mulai/layout.tsx` | `navigator.serviceWorker.register('/sw.js')` hanya di production |
| 5 | iPhone | metadata `appleWebApp` (capable, title "Klar", statusBarStyle) | apple-touch-icon sudah ada |
| 6 | Tombol pasang | `components/de/InstallCard.tsx` (keputusan P3) | Android/Chrome: tangkap `beforeinstallprompt` → tombol **"Pasang Klar"**. iPhone: panduan "Bagikan → Tambah ke Layar Utama" |
| 7 | Header aman | `next.config.ts` headers untuk `/sw.js` | `Cache-Control: no-cache`, `Service-Worker-Allowed: /` |

## Strategi offline (service worker)
| Jenis | Strategi | Alasan |
|---|---|---|
| Halaman `/de/*`, `/mulai` | **Network-first**, fallback ke cache | Konten terbaru saat online, tetap jalan saat offline |
| `/_next/static/*` (JS/CSS) | **Cache-first** (file ber-hash, tidak berubah) | Cepat |
| `/audio/de/*.mp3` | **Cache-first** | Suara cukup diunduh sekali |
| Font, ikon | Cache-first | — |
| App lama (`/hafalin`, `/folders`, `/login`, API Firebase) | **Tidak di-cache** | Butuh login & data online |
| Halaman offline cadangan | `/de/offline` sederhana | Bila halaman belum pernah dibuka |

**Progres belajar** sudah tersimpan di HP (localStorage) → tetap jalan offline tanpa perubahan.
**Versi cache** diberi nama `klar-v<n>`; saat deploy baru, cache lama dihapus otomatis.

## Mode "Unduh untuk offline" (keputusan P2)
Tombol di Progress: mengunduh semua halaman A1 + **semua audio (±18 MB)** sekaligus, dengan bar progres. Tanpa tombol ini, offline hanya mencakup halaman/audio yang pernah dibuka.

## Verifikasi
- Chrome DevTools → Application → Manifest (installable ✅) & Service Workers (activated ✅).
- Uji offline: buka beberapa halaman → mode pesawat → navigasi & putar audio.
- Uji pasang di Android (Chrome) & iPhone (Safari) dari URL Vercel.
- `next build` lolos; push ke `main` → Vercel deploy.

## Keputusan
| Kode | Pertanyaan | Rekomendasi |
|---|---|---|
| P1 | Halaman pertama saat app dibuka | `/de` (Beranda Jerman) |
| P2 | Tingkat offline | Otomatis + tombol "Unduh untuk offline" |
| P3 | Di mana tombol "Pasang Klar" muncul | Kartu kecil di Beranda (bisa ditutup) + di Progress |

## Risiko
| Risiko | Mitigasi |
|---|---|
| Versi lama "nyangkut" di HP setelah update | Network-first untuk halaman + versi cache + `skipWaiting` |
| iPhone tidak punya tombol install otomatis | Panduan langkah "Bagikan → Tambah ke Layar Utama" |
| Penyimpanan HP penuh | Audio offline hanya lewat tombol (bukan otomatis semua) |
