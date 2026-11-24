# Rencana — Akun Klar (login Google + sinkron progres)

Menggantikan bagian login di [04-step3-akses-akun.md](04-step3-akses-akun.md) (deploy sudah selesai).
**Perkiraan:** 2–3 sesi · **Aksi keluar** (Firebase console, env Vercel) dilakukan/dikonfirmasi user.

## Keputusan (dari user)
| Topik | Keputusan |
|---|---|
| Wajib login? | **Ya, dari awal** — `/mulai` dan `/de` butuh login |
| Metode | **Google** saja |
| Akun lama Hafalin | **Satu akun** (Firebase yang sama) — data lama tetap bisa diakses |
| Profil | **Tujuan belajar**, **target level ujian**, **target kata baru/hari** |

## Alur pengguna
```
Buka Klar ──► belum login ──► /masuk (gaya Klar)
                                 │  "Lanjut dengan Google" (redirect, aman untuk PWA iPhone)
                                 ▼
                         akun baru? ── ya ──► Onboarding 3 langkah ──► /de
                                 │                1. Tujuan belajar
                                 │                2. Target level (A1…C2)
                                 │                3. Kata baru per hari (5/10/20)
                                 └── tidak ──► /de (progres dari akun)
```
- Progres yang **sudah ada di HP** (sebelum ada akun) **diunggah otomatis** saat login pertama, lalu digabung.
- Setelah login, Klar tetap **bisa offline** (sesi tersimpan di HP); sinkron jalan lagi saat online.
- **Keluar** dan **Hapus akun & data Klar** ada di halaman profil (Progress → Akun).

## Komponen teknis
| # | Bagian | Rincian |
|---|---|---|
| 1 | Env Firebase | `NEXT_PUBLIC_FIREBASE_*` + admin (sudah ada di Vercel). Lokal butuh `.env.local` (lihat keputusan E1) |
| 2 | Halaman `/masuk` | Gaya Calm + Swiss, logo Klar, tombol Google. `signInWithRedirect` (bukan popup) → `getRedirectResult` → buat session cookie lewat API/server action yang sudah dipakai app lama (`firebase-session`) |
| 3 | Proteksi rute | `proxy.ts`: `/de/*` & `/mulai` tanpa cookie → redirect `/masuk?next=…`. Pengecualian: `/de/offline`, aset statis, manifest, sw.js. `/login` lama diarahkan ke `/masuk` |
| 4 | Service worker | Jangan cache `/masuk` & redirect 3xx; halaman cache tetap tampil offline meski cookie kedaluwarsa (sinkron menunggu login ulang saat online) |
| 5 | Profil Firestore | `users/{uid}/de_meta/profile`: `goal`, `targetLevel`, `dailyNew`, `createdAt`, `onboarded` |
| 6 | Onboarding | `/de/mulai-belajar` 3 layar (1 pertanyaan per layar, bisa kembali). `DAILY_NEW` di `progress.ts` dibaca dari profil |
| 7 | Sinkron progres | Sesuai 04-step3 §3.3–3.4: dokumen per kartu (`de_cards`, `de_grammar`, `de_topics`, `de_daily`), outbox lokal + `writeBatch`, gabung "review terakhir menang" |
| 8 | Migrasi data HP | Login pertama: unggah semua kunci `de:*` dari localStorage → tandai `de:migrated:<uid>` |
| 9 | Firestore rules | Validasi tipe ringan untuk `de_*` + anti-curang streak (pola app lama) |
| 10 | Akun di UI | Avatar Google kecil di header Beranda; halaman Akun: nama, email, target (bisa diubah), Keluar, Hapus data Klar |
| 11 | Indikator sinkron | "Tersinkron · 2 mnt lalu" / "Offline — disinkron nanti" |

## Tujuan belajar → saran level (dipakai di onboarding)
| Tujuan | Saran target |
|---|---|
| Ikut pasangan / keluarga | A1 |
| Ausbildung / kerja | B1 (beberapa profesi B2) |
| Kuliah di Jerman | B2–C1 |
| Hobi / jalan-jalan | A1–A2 |
User tetap bebas memilih; konten saat ini A1, level lain ditandai "segera".

## Tahapan
| Tahap | Isi | Selesai bila |
|---|---|---|
| K1 | Env lokal, `/masuk` + Google redirect + session cookie, proteksi rute | Login Google berhasil di localhost & Vercel Preview |
| K2 | Onboarding + profil Firestore + `dailyNew` dari profil | Akun baru melewati 3 langkah |
| K3 | Sinkron progres + migrasi data HP + indikator | Review di laptop muncul di HP |
| K4 | Halaman Akun (keluar, hapus data), rules, uji offline + PWA iPhone | Lolos uji di Android & iPhone |

## Keputusan yang masih perlu
| Kode | Pertanyaan |
|---|---|
| E1 | Cara mendapatkan env Firebase untuk uji lokal |
| E2 | Domain Vercel sudah terdaftar di Firebase Auth → Authorized domains? (dicek user di Firebase console) |

## Implementasi (2026-11-24) — keputusan teknis
- **E1 → opsi (c):** tanpa `.env.local`; alur tanpa Firebase diuji lokal (proteksi rute, onboarding, Akun, aturan merge), login Google sungguhan diuji di production.
- **Login:** `signInWithPopup` (pola app lama yang sudah terbukti), otomatis jatuh ke `signInWithRedirect` bila popup diblokir (PWA). Cookie sesi sama dengan app lama (`createSession`) → satu akun.
- **Sinkron:** bukan dokumen per kartu, tetapi **satu dokumen per kunci progres** (`users/{uid}/de_state/{key}`, ±40 dokumen kecil) → tulis lebih hemat, tetap jauh di bawah batas 1 MB. Merge per item di sisi klien (`lib/de/sync.ts`, diuji dengan asersi).
- **Profil** = kunci `de:profile` (ikut sinkron, jalan offline).
- **Firestore rules:** tidak diubah — aturan `users/{uid}/{document=**}` (hanya pemilik) sudah mencakup `de_state`.
- **Ganti akun di HP yang sama:** progres lokal akun sebelumnya dibersihkan sebelum menarik data akun baru.
