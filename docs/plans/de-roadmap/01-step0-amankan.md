# Langkah 0 — Amankan & rapikan

**Tujuan:** semua pekerjaan MVP tersimpan aman di git, perbaikan kecil yang tertunda selesai, dan basis kode bersih sebelum konten diperbanyak.
**Perkiraan:** ½ sesi · **Risiko:** rendah

## 0.1 Commit pekerjaan MVP (keputusan D0-1)
Saat ini 13 path belum di-commit di `feat/german-mvp`.

Usulan pemecahan commit (urut, masing-masing bisa di-build):
| # | Isi | Path |
|---|---|---|
| 1 | `feat(de): german MVP routes, content & cards` | `lib/de/content.ts`, `lib/de/lessons.ts`, `app/de/**`, `app/mulai/**`, `components/de/*` (kecuali yang di bawah), `proxy.ts`, `next.config.ts` |
| 2 | `feat(de): grammar practice (5 exercise types)` | `lib/de/exercises.ts`, `components/de/TopicPractice.tsx`, `app/de/materi/**/latihan/**` |
| 3 | `feat(de): learning loop — Hari ini, FSRS states, mastery` | `lib/de/progress.ts`, `lib/de/useProgress.ts`, `components/de/{DailySession,HomeToday,TopicStatus,CardStats}.tsx` |
| 4 | `feat(de): German audio (Piper Thorsten) + build scripts` | `scripts/de-audio/**`, `public/audio/de/**`, `lib/de/audio-manifest.json`, `lib/de/speech-texts.ts`, `components/de/Speak.tsx`, `app/de/kredit/**` |
| 5 | `style(de): calm minimal + swiss UI` | `app/globals.css`, layout & restyle |
| 6 | `docs: de plans & roadmap` | `docs/plans/**` |
Catatan: karena banyak file disentuh di beberapa fitur, pemecahan sempurna per-commit sulit; alternatif paling aman = **1 commit besar** + deskripsi rinci. Default: 1 commit fitur + 1 commit docs, kecuali user minta dipecah.

Yang **tidak** di-commit: `scripts/de-audio/texts.json` (hasil generate) → tambahkan ke `.gitignore`. Model suara Piper (114 MB) tetap di luar repo.

## 0.2 Perbaikan kecil yang tertunda
1. **Baris "Target ujian" di Beranda** (dari pertanyaan user): ganti teks kecil abu-abu dengan kartu kecil:
   ```
   TARGET UJIAN
   Goethe-Zertifikat A1            13% siap  ›
   ───────────────────────────────
   ```
   - File: `app/de/page.tsx` + komponen klien `ReadinessRow` di `components/de/HomeToday.tsx` (pakai `levelReadiness('a1')`).
2. **2 error lint lama** (`react-hooks/set-state-in-effect`):
   - `components/de/SmartSession.tsx` (bangun antrian di effect) → pindah ke pola "derive saat render" seperti `DailySession` (pakai `useProgress` + `useState` sekali).
   - `components/de/Speak.tsx` (`setSupported` di effect) → hitung `supported` lewat `useSyncExternalStore` (server: `true`).
3. **Teks tombol di layar akhir Flashcard/Artikel** masih memakai gaya lama (`px-5 py-2.5 … font-extrabold`) → seragamkan ke tombol hitam `h-12`.
4. **Cek visual layar setelah interaksi** (belum terlihat setelah redesign): kartu sisi belakang, bottom sheet benar/salah, layar akhir sesi → screenshot via preview saat panel terbuka, atau minta screenshot user.

## 0.3 Kebersihan
- Hapus prop/variabel tidak terpakai (`bestCombo`/`setCombo` di SmartSession bila combo tidak ditampilkan lagi; ganti statistik "Combo" dengan "Waktu" atau hapus).
- `npx tsc --noEmit` dan `npx eslint components/de app/de app/mulai lib/de` harus **0 error**.

## Kriteria selesai
- [ ] `git status` bersih (kecuali file yang memang di-ignore).
- [ ] Lint & typecheck 0 error.
- [ ] Beranda menampilkan "Target ujian … X% siap".
- [ ] User sudah melihat 3 layar interaktif di HP dan tidak ada keluhan tampilan.
