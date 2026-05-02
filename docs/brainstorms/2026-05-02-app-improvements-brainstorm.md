# Brainstorm: Flashcard App Improvements untuk Launch Publik

**Tanggal:** 2026-05-02
**Status:** Brainstorm captured, siap planning
**Target launch:** ~16 Mei 2026 (2 minggu dari sekarang)

---

## What We're Building

Upgrade aplikasi flashcard dari MVP minimalis (folder → deck → simple flip card) menjadi produk yang siap launch publik bersaing dengan **Anki**, **Quizlet**, dan **Mochi**.

**Wedge utama:** Study quality — FSRS-5 spaced repetition + Markdown/LaTeX content. Targeted ke pelajar serius (mahasiswa STEM, language learners) yang merasa Anki terlalu jelek dan Quizlet terlalu paywalled.

**Bukan goal:** AI generation (defer), gamification heavy (Tinycards trap), social feed.

---

## Why This Approach

Riset kompetitor menunjukkan:

- **Anki** menang di power & FSRS-5, tapi UX jelek dan setup ribet
- **Quizlet** menang di mass market & AI, tapi paywalled aggressively (Learn Mode 20 rounds/bulan di free tier)
- **Mochi** menang di markdown minimalism, tapi tidak punya FSRS modern
- **Tinycards mati** karena terlalu gamified dan kurang serius

**Celah pasar yang kita masuki:** "FSRS-quality + UX modern + harga terjangkau, untuk pelajar serius non-power-user."

Dengan tech stack Next.js 16 + Firestore yang sudah terpasang, fokus paling impactful adalah **algoritma study + content rendering**, bukan fitur cosmetic.

---

## Key Decisions

### 1. Approach: Iterative Ship (B)
- **Week 1:** FSRS-5 algorithm + Markdown rendering → ship internal
- **Week 2:** LaTeX + Cloze deletions + Streaks → launch publik
- Alasan: Mengurangi deadline risk, dapat early feedback, minimum viable wedge sudah tercapai di Week 1

### 2. Study algorithm: FSRS-5 (bukan SM-2)
- Pakai library `ts-fsrs` (npm) — community-maintained TypeScript port
- 20-30% lebih efisien dari SM-2 untuk retention sama
- 4 tombol: Again / Hard / Good / Easy (mengganti simple flip)
- Field tambahan di card document: `due`, `stability`, `difficulty`, `state`, `reps`, `lapses`

### 3. Markdown rendering: react-markdown + KaTeX
- `react-markdown` untuk markdown standar (headers, bold, lists, code blocks)
- `KaTeX` untuk LaTeX (inline `$x^2$` dan block `$$\\int$$`)
- `react-syntax-highlighter` untuk code blocks (opsional, defer kalau berat)

### 4. Cloze deletions: syntax `{{c1::text}}`
- Sintaks Anki yang familiar
- Multi-cloze support (`{{c1::A}}` dan `{{c2::B}}` di kartu sama → generate 2 kartu)
- Render: text yang di-cloze diganti `[...]` lalu di-reveal saat klik

### 5. Streaks + daily goal
- Counter hari beruntun, reset kalau skip 1 hari
- Default goal: 20 kartu/hari (configurable di Profil)
- Tampilkan badge streak di halaman /stats dan /profile
- Simpan di `users/{uid}` document: `currentStreak`, `longestStreak`, `lastStudyDate`, `dailyGoal`

### 6. Backward compatibility
- Card existing tanpa FSRS fields → di-treat sebagai "new card" (state: 'new', due: today)
- Tidak perlu migration script — lazy migration saat user pertama kali review

### 7. Yang DIKECUALIKAN dari MVP ini
- AI card generation → defer (post-launch milestone)
- PWA + offline persistence → defer
- Public deck sharing → defer
- Image occlusion → defer
- Gamification berat (XP, leaderboard) → no
- Mobile native app → no, PWA cukup nanti

---

## Resolved Questions

| # | Pertanyaan | Jawaban |
|---|---|---|
| 1 | Target user | Launch ke publik (kompetitor Anki/Quizlet) |
| 2 | Diferensiator utama | Study quality (FSRS + Markdown) |
| 3 | Timeline | MVP 1-2 minggu |
| 4 | Approach | Iterative Ship (B) — Week 1 + Week 2 |
| 5 | Quick wins | Cloze deletions + Streaks |
| 6 | UX rating buttons FSRS | Floating bar bawah card (4 tombol horizontal: Lagi/Susah/Bagus/Mudah) — muncul setelah card di-flip |
| 7 | Daily goal default | 10 kartu/hari (santai, user-configurable di /profile) |
| 8 | Streak reset rule | Reset kalau skip 1 hari penuh (tidak buka app sama sekali); tidak peduli goal tercapai atau tidak |
| 9 | Pricing model | 100% free dulu untuk launch — focus growth, paywall ditambah pasca-launch kalau ada traction |
| 10 | LaTeX bundle size | Load lazily via `next/dynamic` — hanya di-import di halaman study/card detail. Decided. |
| 11 | Multi-cloze rendering | 1 kartu per cloze (standar Anki) — `{{c1::}}` dan `{{c2::}}` di kartu sama generate 2 kartu terpisah |
| 12 | Schema migration FSRS | Lazy default — set field FSRS saat user first review card. Tidak perlu bulk migration script |

---

## Sources

Riset kompetitor (per Mei 2026):

- [Anki FSRS algorithm explained](https://studycardsai.com/blog/anki-fsrs-algorithm)
- [ts-fsrs library (TypeScript)](https://github.com/open-spaced-repetition/ts-fsrs)
- [Quizlet AI Study Era](https://quizlet.com/blog/ai-study-era)
- [RemNote pricing & features](https://www.remnote.com/pricing)
- [Mochi Cards markdown formatting](https://mochi.cards/docs/markdown/advanced-formatting/)
- [Tinycards shutdown post-mortem](https://support.duolingo.com/hc/en-us/articles/360043909772)
- [Best flashcard apps 2026 (StudyCardsAI)](https://studycardsai.com/best-flashcard-apps-2026)

---

## Next Steps

Setelah open questions diresolve, jalankan `/ce-plan` untuk planning teknis: schema changes, file-level breakdown, ordering, testing strategy.
