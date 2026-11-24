# Langkah 3 — Akses permanen & akun (sinkron progres)

**Tujuan:** app bisa dibuka dari HP kapan saja tanpa Dev Tunnel, dan progres tersimpan di akun sehingga HP & laptop sinkron.
**Perkiraan:** 2–3 sesi · **Aksi keluar (deploy, perubahan Firebase) hanya dengan persetujuan user.**

## Kondisi yang sudah ada di repo
- App lama memakai **Firebase Auth + Firestore** (`lib/firebase/client.ts`, `lib/firestore/*`, `firestore.rules`), dan pesan error menyebut **Vercel** → kemungkinan app lama sudah di-deploy di Vercel.
- Lokal **tidak ada `.env.local`**, jadi `/de` saat ini dibuat publik tanpa login (`proxy.ts` melewatkan `/de`, `/mulai`, `/audio`).
- Rules Firestore: `users/{uid}/{document=**}` hanya bisa dibaca/ditulis pemiliknya ✅ (cukup untuk data `/de`).

## 3.1 Deploy (keputusan D3-1, D3-3)
1. **Konfirmasi ke user:** pakai project Vercel yang sama dengan app lama? (`/de` hidup berdampingan dengan app lama — default) atau project baru.
2. Pastikan env `NEXT_PUBLIC_FIREBASE_*` & admin ada di Vercel (user yang mengisi lewat dashboard; tidak dikirim lewat chat).
3. Build lokal `npm run build` harus lolos (cek: `next/font` Geist, JSON manifest audio, `public/audio` ±3–20 MB).
4. Deploy **Preview** dulu dari branch `feat/german-mvp` → user mencoba di HP → baru merge ke `main` (Production) bila disetujui.
5. Hapus `allowedDevOrigins` tunnel dari `next.config.ts` hanya bila tidak dipakai lagi (tidak berbahaya bila tetap).

## 3.2 Login (keputusan D3-2)
- **Default: "tamu dulu"** — semua fitur jalan tanpa login (localStorage, seperti sekarang). Tombol "Simpan progres ke akun" di Progress.
- Saat login (pakai alur auth app lama: halaman login yang sudah ada) → **unggah progres lokal** ke Firestore lalu sinkron dua arah.
- Alternatif: login wajib sejak `/mulai` (lebih sederhana datanya, tapi menambah hambatan untuk user baru).

## 3.3 Model data Firestore (`users/{uid}/de/...`)
| Path | Isi | Sumber lokal |
|---|---|---|
| `de_cards/{wordId}` | kartu FSRS (`due`, `stability`, `difficulty`, `reps`, `lapses`, `state`, `last_review`, `scheduled_days`), `level`, `cat` | `de:srs:*` |
| `de_grammar/{level}_{topic}_{idx}` | kartu FSRS soal grammar | `de:gsrs:*` |
| `de_topics/{level}_{topic}` | `read`, `mastered`, `best` | `de:topic:*` |
| `de_daily/{yyyy-mm-dd}` | `newCount`, `reviews`, `done` | `de:new:*` |
| `de_meta/profile` | `streak {last,count}`, `dailyNew`, `targetLevel`, `updatedAt` | `de:streak` |
| `de_exams/{id}` | hasil simulasi (Langkah 2) | `de:exam:*` |
Dokumen per kartu (bukan satu dokumen besar) → aman dari batas 1 MB & konflik tulis.

## 3.4 Strategi sinkron (local-first)
1. `lib/de/progress.ts` tetap menulis ke localStorage (cepat, offline) **dan** menaruh perubahan di antrian `de:outbox`.
2. `lib/de/sync.ts` (klien, hanya bila login): kirim outbox via `writeBatch` (≤ 500 operasi/batch), debounce 3 detik + saat tab disembunyikan.
3. Saat login/membuka app: tarik dokumen yang `updatedAt > lastSync` → gabungkan:
   - **Kartu FSRS:** pakai yang `last_review` paling baru (review terakhir menang).
   - **Topik:** gabung terbaik (`read`/`mastered` paling awal tetap, `best` maksimum).
   - **Streak:** ambil `last` paling baru; `count` maksimum yang valid.
4. Aturan anti-curang streak di `firestore.rules` (seperti app lama) untuk `de_meta/profile`.
5. Indikator kecil di Progress: "Tersinkron · 2 mnt lalu" / "Offline — akan disinkron".

## 3.5 Keamanan & privasi
- Rules: tambahkan validasi tipe ringan untuk `de_*` (mis. `due` timestamp, `lapses` int ≥ 0).
- Tidak ada data pribadi baru selain progres belajar.
- Rekaman suara Sprechen (Langkah 2) **tidak** diunggah — tetap di perangkat.

## 3.6 Tahapan
| Tahap | Isi | Selesai bila |
|---|---|---|
| S1 | Build lolos + deploy Preview (setelah izin) | `/de` terbuka di HP via URL Vercel |
| S2 | Login + unggah progres lokal | progres HP muncul di Firestore |
| S3 | Sinkron dua arah + penggabungan konflik + indikator | review di laptop → muncul di HP |
| S4 | Rules + uji offline/online + merge ke `main` (izin) | Production aktif |

## Risiko
| Risiko | Mitigasi |
|---|---|
| Env Firebase tidak tersedia lokal | Uji sinkron di Preview Vercel, atau user mengisi `.env.local` sendiri |
| Konflik data 2 perangkat | Aturan "review terakhir menang" + kartu per dokumen |
| Biaya Firestore | ±650–2.000 dokumen kartu/user; tulis di-batch & debounce |
| `/de` mengganggu app lama | Rute terpisah; tidak ada perubahan di koleksi lama |
