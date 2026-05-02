---
title: "feat: FSRS-5 Study Engine + Markdown Content Layer + Streaks"
type: feat
status: active
date: 2026-05-02
deepened: 2026-05-02
origin: docs/brainstorms/2026-05-02-app-improvements-brainstorm.md
---

## ⚡ Enhancement Summary (Deepened 2026-05-02)

Plan ini sudah di-deepen dengan 8 review agent paralel: TypeScript reviewer, Architecture strategist, Performance oracle, Security sentinel, Frontend race reviewer, Data integrity guardian, Code simplicity reviewer, dan FSRS best-practices researcher. Hasil → **major refinements** ke architecture, security, dan race condition handling. Lihat section [Research Insights & Critical Updates](#research-insights--critical-updates) di bawah untuk detail.

**Top 5 changes from review:**
1. 🔴 **CRITICAL:** `rateCard` HARUS pakai Firestore `runTransaction` (bukan sequential awaits) — atomicity untuk recordReview + updateStreak + incrementCardsStudied
2. 🔴 **CRITICAL:** `todayDate` DI-COMPUTE SERVER-SIDE dari stored user timezone, bukan dari client (cegah streak inflation attack)
3. 🔴 **CRITICAL:** Markdown rendering BUTUH `rehype-sanitize` + URL scheme allowlist (react-markdown default TIDAK cukup — `javascript:` link masuk)
4. 🟡 **HIGH:** Pull streak data model ke Phase 1 Day 4 (counters only, no UI) — biar testing Week 1 punya engagement loop
5. 🟡 **HIGH:** Server-render Markdown (RSC), client cuma handle flip — bundle win signifikan


# feat: FSRS-5 Study Engine + Markdown Content Layer + Streaks

## Overview

Upgrade aplikasi flashcard dari **simple flip card** menjadi **production-ready spaced repetition tool** dengan algoritma FSRS-5 (Free Spaced Repetition Scheduler), rendering Markdown + LaTeX, cloze deletions, dan engagement layer (streaks + daily goal).

Target: **launch publik dalam 2 minggu (16 Mei 2026)** dengan iterative ship — Week 1 ship FSRS+Markdown internal, Week 2 ship LaTeX+Cloze+Streaks publik.

Plan ini meng-implement semua keputusan dari [brainstorm 2026-05-02](../brainstorms/2026-05-02-app-improvements-brainstorm.md).

## Problem Statement

### Current state (per repo research)
Aplikasi sekarang punya pondasi solid (folder/deck/card hierarchy, Firestore + Firebase Auth, navigation lengkap), tapi **fundamental learning experience-nya lemah**:

1. **Tidak ada SRS** — Study mode di [components/study/StudyCarousel.tsx](../../components/study/StudyCarousel.tsx) cuma vertical scroll-snap dengan flip animation. User tidak dapat sinyal kapan harus review ulang.
2. **Konten plain-text only** — [components/cards/FlashCard.tsx:36,51](../../components/cards/FlashCard.tsx#L36) render `{soal}` dan `{jawaban}` sebagai raw string. Pelajar STEM butuh LaTeX, pelajar bahasa butuh markdown formatting.
3. **No retention loop** — Tidak ada streak/goal tracking. User tidak punya alasan kembali besok.
4. **Critical bug discovered:** [lib/firestore/decks.ts:139-145](../../lib/firestore/decks.ts#L139) `updateDeck()` melakukan `batch.delete(doc.ref)` lalu re-create semua kartu. **Ini akan menghancurkan FSRS state setiap user edit deck** — must fix sebagai prerequisite.

### What competitors have (per brainstorm research)
- **Anki:** FSRS-5 default, cloze, MD/LaTeX → power user friendly tapi UX jelek
- **Quizlet:** AI generation + game modes → tapi paywalled aggressively
- **Mochi:** Markdown minimalism → tapi tidak punya FSRS modern
- **Tinycards (mati):** terlalu gamified, tidak serius → cautionary tale

### Wedge yang diambil (carry-forward dari brainstorm)
"FSRS-quality + UX modern + harga terjangkau, untuk pelajar serius non-power-user."

## Proposed Solution

### High-level architecture

```
┌─────────────────────────────────────────────────────────────┐
│ STUDY SESSION FLOW (NEW)                                    │
├─────────────────────────────────────────────────────────────┤
│ 1. Build queue: cards.due <= now, ordered by due asc        │
│ 2. Show card front (markdown rendered)                      │
│ 3. User flips → show back (markdown + LaTeX rendered)       │
│ 4. Floating bar: [Lagi] [Susah] [Bagus] [Mudah]             │
│ 5. Rating → ts-fsrs.next(card, now, rating)                 │
│ 6. Persist new {due, stability, difficulty, ...} to Firestore│
│ 7. Increment user streak/cardsStudiedToday                  │
│ 8. Next card OR show completion screen                      │
└─────────────────────────────────────────────────────────────┘
```

### 4 sub-systems

1. **FSRS Engine** — `ts-fsrs` library wrapper di [lib/fsrs/](../../lib/fsrs/) + extended card schema
2. **Content Renderer** — `react-markdown` + `remark-math`/`rehype-katex` lazy-loaded
3. **Cloze System** — Regex parser di [lib/cloze/](../../lib/cloze/) + multi-card generator
4. **Engagement** — `users/{uid}` doc dengan streak fields + UI badges di /stats dan /profile

## Technical Approach

### Schema Changes

#### Card document (extended)

```typescript
// lib/types.ts
export type CardData = {
  // EXISTING
  id: string
  soal: string
  jawaban: string
  order: number
  deckId: string
  createdAt: Date
  updatedAt: Date

  // NEW (FSRS-5 state) — populated lazily on first review
  due?: Date              // when card is next due
  stability?: number      // FSRS stability (days)
  difficulty?: number     // FSRS difficulty (1-10)
  elapsedDays?: number
  scheduledDays?: number
  reps?: number           // total reviews
  lapses?: number         // times forgotten
  state?: 'new' | 'learning' | 'review' | 'relearning'
  lastReview?: Date
}
```

**Rationale:** All FSRS fields optional (`?`) → existing cards tanpa state tetap valid. Lazy migration: ketika card di-review pertama kali, field di-populate dengan `createEmptyCard()` defaults sebelum `next()` dipanggil.

#### User document (NEW)

Per repo research: `users/{uid}` document **tidak exist** (only subcollections). Must bootstrap on demand.

```typescript
// lib/types.ts
export type UserData = {
  uid: string
  email: string | null
  timezone: string                // IANA, e.g. "Asia/Jakarta"
  currentStreak: number           // consecutive days
  longestStreak: number
  lastStudyDate: string | null    // YYYY-MM-DD in user's timezone
  dailyGoal: number               // default: 10
  cardsStudiedToday: number       // resets at midnight (user TZ)
  todayDate: string | null        // YYYY-MM-DD for daily reset detection
  createdAt: Date
  updatedAt: Date
}
```

**Bootstrap helper** ([lib/firestore/users.ts](../../lib/firestore/users.ts) — NEW):
```typescript
export async function ensureUserDoc(uid: string, email: string | null, timezone: string): Promise<UserData>
```
Dipanggil saat first study action; idempotent (set with merge).

#### Firestore indexes
- `cards.where('due', '<=', timestamp).orderBy('due')` → single-field auto index (no manual setup)
- Existing index untuk `decks.where('folderId').orderBy('createdAt')` tetap dipakai

### Implementation Phases

#### Phase 1: Week 1 (5 days) — FSRS Engine + Markdown

**Day 1: Schema + Library Setup**
- [ ] `npm install ts-fsrs react-markdown remark-gfm`
- [ ] Update [lib/types.ts](../../lib/types.ts): tambah optional FSRS fields ke `CardData`
- [ ] Buat [lib/fsrs/scheduler.ts](../../lib/fsrs/scheduler.ts) — wrapper:
  - `createNewFsrsState()` — return defaults dari `createEmptyCard()`
  - `previewRatings(card, now)` — return preview untuk 4 buttons (untuk show interval next)
  - `applyRating(card, now, rating)` — return `{ updatedCard, log }`
- [ ] Buat [lib/fsrs/serialize.ts](../../lib/fsrs/serialize.ts) — convert antara Firestore Timestamp ↔ FSRS Card object

**Day 2: Card-level Service + Study Action**
- [ ] **CRITICAL FIX:** Refactor [lib/firestore/decks.ts:130-145](../../lib/firestore/decks.ts#L130) `updateDeck()`:
  - Tambah optional `id` ke `CardInput`
  - Diff existing vs input by id:
    - Card dengan id ada di input → `batch.update` content, **preserve FSRS fields**
    - Card di input tanpa id → `batch.set` baru dengan FSRS defaults
    - Card di DB tapi tidak di input → `batch.delete`
- [ ] Update [components/decks/EditDeckClient.tsx:17](../../components/decks/EditDeckClient.tsx#L17): kirim id saat load existing cards
- [ ] Update [lib/utils/import.ts](../../lib/utils/import.ts): `CardInput` interface tambah `id?: string`
- [ ] Buat [lib/firestore/cards.ts](../../lib/firestore/cards.ts):
  - `getDueCards(deckId, userId, now)` — returns cards yang due ≤ now
  - `getNewCards(deckId, userId, limit)` — returns cards tanpa state (treat sebagai new)
  - `recordReview(cardId, deckId, userId, updatedCard)` — write FSRS state
- [ ] Buat [lib/actions/study.actions.ts](../../lib/actions/study.actions.ts):
  - `rateCard(deckId, cardId, rating)` — validate auth, apply FSRS, persist, return next card
  - Auth gate + ActionResult pattern (mengikuti [lib/actions/deck.actions.ts:25-26](../../lib/actions/deck.actions.ts#L25))

**Day 3: StudyCarousel Refactor**
- [ ] Major rework [components/study/StudyCarousel.tsx](../../components/study/StudyCarousel.tsx):
  - Hapus `Acak` button (random shuffle conflicts dengan SRS ordering)
  - Ganti `setCards` mutations → controlled review queue dari props
  - Setelah card flip: tampilkan `<RatingButtons />` di bottom (fixed)
  - Setelah rating: `await rateCard(...)` → next card di queue
  - Empty queue: tampilkan "✨ Sudah selesai untuk hari ini" + streak preview
- [ ] Buat [components/study/RatingButtons.tsx](../../components/study/RatingButtons.tsx):
  - 4 tombol horizontal (Lagi/Susah/Bagus/Mudah) di floating bar bawah
  - Tampilkan preview interval di bawah label (e.g., "Bagus → 3 hari")
  - Disable tombol selama action pending
- [ ] Update [app/(app)/decks/[id]/study/page.tsx](../../app/(app)/decks/[id]/study/page.tsx):
  - Build queue: `getDueCards()` + `getNewCards(limit: 20)` (limit new cards per session)
  - Pass `{ cards, dailyGoalRemaining }` ke StudyCarousel

**Day 4: Markdown Rendering**
- [ ] Buat [components/markdown/Markdown.tsx](../../components/markdown/Markdown.tsx):
  - Wrap `react-markdown` dengan `remark-gfm`
  - Custom components untuk `<code>`, `<pre>`, `<a>`, `<table>`
  - Tailwind styling konsisten dengan design system (cream/ink palette)
- [ ] Update [components/cards/FlashCard.tsx:36,51](../../components/cards/FlashCard.tsx#L36):
  - Replace `<p>{soal}</p>` → `<Markdown>{soal}</Markdown>`
  - Replace `<p>{jawaban}</p>` → `<Markdown>{jawaban}</Markdown>`
- [ ] Wrap dengan `next/dynamic` untuk lazy loading kalau bundle size berlebihan (verify after measure)

**Day 5: Phase 1 Validation**
- [ ] Manual test scenarios:
  - Create deck baru dengan 5 kartu → study → rate semua → verify FSRS fields tertulis
  - Edit deck (tambah/edit/hapus kartu) → verify FSRS state preserved untuk yang tidak diubah
  - Existing deck (cards tanpa FSRS) → study → verify lazy migration OK
  - Markdown content: bold, italic, code blocks, lists, tables semua render
- [ ] Type-check (`npx tsc --noEmit`) → harus zero errors
- [ ] Internal ship — share dengan tester (1-2 orang) untuk feedback

#### Phase 2: Week 2 (5 days) — LaTeX + Cloze + Streaks

**Day 6: KaTeX Integration**
- [ ] `npm install remark-math rehype-katex katex`
- [ ] Import `katex/dist/katex.min.css` di [app/layout.tsx](../../app/layout.tsx)
- [ ] Update [components/markdown/Markdown.tsx](../../components/markdown/Markdown.tsx):
  - Tambah `remarkPlugins: [remarkGfm, remarkMath]`
  - Tambah `rehypePlugins: [[rehypeKatex, { strict: 'ignore' }]]`
- [ ] Lazy load via `next/dynamic`:
  ```tsx
  const Markdown = dynamic(() => import('@/components/markdown/Markdown'), {
    ssr: true,
    loading: () => <p>{rawText}</p>
  })
  ```
- [ ] Verify bundle: study page initial JS < 250KB

**Day 7: Cloze Deletion System**
- [ ] Buat [lib/cloze/parser.ts](../../lib/cloze/parser.ts):
  - `extractClozeIndices(src: string): number[]`
  - `renderCloze(src, activeIdx, reveal): string`
  - Regex: `/\{\{c(\d+)::([^:}]+)(?:::([^}]+))?\}\}/g`
- [ ] Buat [components/cloze/ClozeCard.tsx](../../components/cloze/ClozeCard.tsx):
  - Detect cloze in `soal` field
  - Sequence through cluster indices (c1, c2, ...) per study session
  - **Decision (MVP simplification):** Single FSRS state per card, regardless of cloze count. User mendapat 1 review session per card walau ada multi-cloze. Iterate later kalau user request.
- [ ] Update [components/cards/FlashCard.tsx](../../components/cards/FlashCard.tsx):
  - Detect kalau `soal` mengandung cloze → render via ClozeCard
  - Fallback ke regular markdown render kalau no cloze
- [ ] Add help text di NewDeckClient/EditDeckClient: "Pakai `{{c1::jawaban}}` untuk hidden text"

**Day 8: Streak Data Model**
- [ ] Buat [lib/firestore/users.ts](../../lib/firestore/users.ts):
  - `ensureUserDoc(uid, email, timezone)` — bootstrap user doc kalau belum ada (set with merge)
  - `getUserData(uid)` — read user doc, return UserData | null
  - `updateStreak(uid, timezone, todayDate)` — atomic update logic:
    - kalau `lastStudyDate === todayDate` → no-op
    - kalau `lastStudyDate === yesterday` → currentStreak += 1
    - else → currentStreak = 1
    - update `longestStreak = max(longestStreak, currentStreak)`
    - reset `cardsStudiedToday = 0` kalau crossed day boundary
  - `incrementCardsStudied(uid)` — `FieldValue.increment(1)` pada cardsStudiedToday
- [ ] Update [lib/actions/study.actions.ts](../../lib/actions/study.actions.ts):
  - Setelah `recordReview()`: panggil `ensureUserDoc` → `updateStreak` → `incrementCardsStudied`
  - Capture timezone dari client (browser sends via `Intl.DateTimeFormat().resolvedOptions().timeZone`)

**Day 9: Streak UI**
- [ ] Buat [components/streaks/StreakBadge.tsx](../../components/streaks/StreakBadge.tsx):
  - Visual badge: "🔥 N hari" dengan animation kalau active hari ini
  - Variant: large (untuk /stats page) vs inline (untuk completion screen)
- [ ] Update [app/(app)/stats/page.tsx](../../app/(app)/stats/page.tsx):
  - Tampil streak badge di top
  - Show progress bar `cardsStudiedToday / dailyGoal`
  - Show longestStreak
- [ ] Update [app/(app)/profile/page.tsx](../../app/(app)/profile/page.tsx):
  - Tambah "Pengaturan Belajar" section
  - Daily goal selector (5/10/20/50/custom)
  - Reset streak button (dengan konfirmasi)
- [ ] Update [components/study/StudyCarousel.tsx](../../components/study/StudyCarousel.tsx) completion screen:
  - Show streak achievement: "🔥 N hari berturut-turut!"
  - Show progress: "Sudah selesai 10/10 hari ini"

**Day 10: Final Polish + Launch**
- [ ] End-to-end testing:
  - Fresh user → register → bikin folder → bikin deck → study → verify streak start
  - Existing user → study → cross day boundary → verify streak increment
  - Skip a day → verify streak reset
  - Edit deck dengan FSRS-tracked cards → verify state preserved
  - Cloze: `{{c1::A}} dan {{c2::B}}` → verify rendering correct
  - LaTeX: `$x^2 + y^2 = z^2$` inline + `$$\int$$` block → verify
  - Bundle size measurement (`next build` analyzer)
- [ ] Update CLAUDE.md / README dengan info FSRS + Markdown features
- [ ] Update [prd.md](../../prd.md): document new study mode, streak system
- [ ] Production deploy ke Vercel + Firebase Security Rules audit
- [ ] **Launch publik** 🚀

## Alternative Approaches Considered

### Alternative 1: SM-2 algorithm (rejected)
Lebih simpel di-implement (~50 LOC tanpa library), no dependency. **Rejected:** FSRS-5 sudah jadi standar 2026, ts-fsrs library kecil, dan SM-2 20-30% kurang efisien (lebih banyak review untuk retention sama). Wedge "study quality" demands FSRS.

### Alternative 2: Big Bang Launch (rejected — see brainstorm)
Build semua 5 fitur sekaligus 2 minggu. **Rejected:** Risk timeline meleset; iterative ship lebih aman.

### Alternative 3: Cards stored as separate documents per cloze (rejected)
Saat user create card dengan `{{c1::}}` `{{c2::}}`, simpan sebagai 2 docs di Firestore (parent-child). **Rejected:** Edit becomes weird (ubah parent → propagate ke children?). MVP cuma satu FSRS state per card walau multi-cloze; iterate later.

### Alternative 4: Native mobile app (rejected)
Build dengan React Native untuk feel native. **Rejected:** Effort 10x lebih besar, tidak fit timeline 2 minggu. PWA dengan Firestore offline persistence cukup, plus bisa dikerjakan post-launch.

### Alternative 5: AI card generation di Phase 1 (rejected)
Tambah Claude API untuk generate cards dari paste teks. **Rejected:** Quizlet juga sudah punya — bukan wedge utama. Defer ke post-launch milestone.

## System-Wide Impact

### Interaction Graph

**User triggers card review:**
```
[User klik "Bagus" di RatingButtons]
  ↓
study.actions.ts:rateCard(deckId, cardId, rating: 'Good')
  ↓ (server action)
  ├→ getCurrentUserId() → verify auth
  ├→ getCard(cardId) → load existing FSRS state (or defaults)
  ├→ scheduler.next(card, now, Rating.Good) → calculate new state
  ├→ recordReview(cardId, deckId, userId, updatedCard)
  │    └→ adminDb.batch:
  │        ├→ update card doc {due, stability, difficulty, reps+1, ...}
  │        └→ no-op pada deck's cardCount (tidak berubah)
  ├→ ensureUserDoc(uid, email, timezone) → bootstrap kalau belum ada
  ├→ updateStreak(uid, timezone, todayDate)
  │    └→ adminDb.update users/{uid}: {currentStreak, longestStreak, lastStudyDate, cardsStudiedToday}
  └→ revalidatePath('/decks', '/stats')
  ↓
[Client] receive ActionResult, fetch next card from queue
[Client] kalau queue empty: render <CompletionScreen streak={} />
```

### Error & Failure Propagation

| Layer | Error Type | Handling |
|---|---|---|
| Network/Firestore | `FirebaseError` | Catch in `study.actions.ts`, return `{ success: false, error: '...' }` |
| FSRS calculation | Throw (invalid state) | Catch, fallback to `createEmptyCard()` defaults, log to console |
| User doc not exists | `NotFoundError` | `ensureUserDoc()` creates with defaults (idempotent) |
| Auth expired | session cookie invalid | `getCurrentUserId()` returns null → action returns `Unauthorized` → client redirects to /login |
| Race condition (multiple devices) | concurrent reviews | Last write wins. Acceptable for MVP. |

**Silent failure risks:**
- Streak update gagal tapi card review berhasil → user lihat "Bagus" tapi streak tidak update. **Mitigation:** Kalau streak update fail, log error tapi return success (non-blocking).
- Daily reset gagal di midnight (server clock skew) → user lihat 11/10 cards atau 0/10 di hari salah. **Mitigation:** Compute "today" dari user TZ saat read, bukan stored value.

### State Lifecycle Risks

1. **Mid-review crash** — User rate kartu, network putus sebelum response → kartu tetap di queue lokal (FSRS state DI Firestore tidak update). User rate ulang saat reconnect. **OK:** No data corruption, hanya repeat satu rating.

2. **Edit deck dengan FSRS state** — User add/edit/delete cards. Per `updateDeck` rewrite, FSRS state diff-preserved by id. **OK** dengan refactor di Day 2.

3. **User delete deck** — Cascade delete semua cards (existing logic OK). FSRS state hilang permanen. **Acceptable:** Delete intentional.

4. **Daily goal reset across midnight** — User belajar sampai 23:59, lanjut 00:01 → harus reset `cardsStudiedToday`. Server compute `todayDate` dari user TZ, compare dengan stored value, reset kalau berbeda. **Tested in Day 10.**

5. **Timezone change** — User travel, ubah timezone device. Streak bisa "skip a day" salah. **Mitigation MVP:** Anggap user pakai 1 timezone konsisten. Edge case rare untuk demographic Indonesia.

6. **Card with FSRS state then deleted** — Cleanup OK via existing cascade.

### API Surface Parity

Mutations yang affect cards harus konsisten:

| Action | Affects FSRS state? | File |
|---|---|---|
| `createDeck` | New cards default state | [lib/actions/deck.actions.ts:21](../../lib/actions/deck.actions.ts#L21) |
| `updateDeck` | **Preserve via id-diff** | [lib/firestore/decks.ts:115](../../lib/firestore/decks.ts#L115) — REFACTOR |
| `deleteDeck` | Cascade delete OK | [lib/firestore/decks.ts:163](../../lib/firestore/decks.ts#L163) |
| `rateCard` (NEW) | Update state | [lib/actions/study.actions.ts](../../lib/actions/study.actions.ts) — NEW |

Semua read paths harus handle missing FSRS fields gracefully (lazy migration friendly):
- [lib/firestore/decks.ts:54](../../lib/firestore/decks.ts#L54) `getDeckWithCards` — pass through optional fields
- [lib/firestore/cards.ts](../../lib/firestore/cards.ts) `getDueCards`, `getNewCards` — NEW

### Integration Test Scenarios

1. **Lazy FSRS migration** — Existing card tanpa FSRS fields → first review → verify defaults applied + state persisted
2. **Day boundary crossing** — Study at 23:55, more reviews at 00:05 → verify streak +1, cardsStudiedToday reset
3. **Skip 1 day reset** — Study Day 1, skip Day 2, study Day 3 → verify streak = 1 (reset)
4. **Same-day duplicate study** — Study, close app, study lagi → streak NOT incremented twice
5. **Cloze multi-cluster** — Card dengan `{{c1::A}} {{c2::B}}` → render correctly + 1 FSRS state shared
6. **Edit preserves FSRS** — Card reviewed 5x → edit deck, ubah text card lain → verify state card tidak berubah
7. **Delete preserves siblings** — Delete 1 card di deck dengan 10 → 9 lain retain state
8. **Markdown XSS attempt** — Card dengan `<script>alert(1)</script>` → react-markdown sanitizes (verify)
9. **LaTeX malformed** — Card dengan `$\unmatched$` → KaTeX strict: 'ignore' tampilkan raw, no crash
10. **Rate limit FSRS** — Rapid clicks (10x dalam 1 detik) → button disable while pending, no double-write

## Acceptance Criteria

### Functional Requirements

- [ ] FSRS-5 algorithm correctly schedules cards: 4 ratings produce different `due` intervals
- [ ] Card schema lazily migrates: existing cards tanpa FSRS fields treated sebagai 'new'
- [ ] Study mode UI: tombol Lagi/Susah/Bagus/Mudah floating di bawah, muncul setelah flip
- [ ] Preview interval ditampilkan di tombol (e.g., "Bagus → 3 hari")
- [ ] Empty due queue: tampilkan "✨ Sudah selesai untuk hari ini" dengan streak progress
- [ ] Markdown rendering: bold, italic, headings, code, code blocks, lists, tables, links, blockquotes
- [ ] LaTeX rendering: inline `$x^2$` dan block `$$\int$$` (lazy-loaded)
- [ ] Cloze syntax `{{c1::text}}` di-render sebagai hidden text dengan reveal-on-flip
- [ ] Multi-cloze (`c1`, `c2`) di kartu sama: kartu di-show satu kali per session
- [ ] Streak counter: increment di hari berbeda, reset kalau skip ≥1 hari
- [ ] Daily goal: configurable di /profile (default 10), counter reset midnight (user TZ)
- [ ] Streak badge tampil di /stats prominently dengan emoji api 🔥
- [ ] Progress bar `studied / goal` di /stats real-time
- [ ] Edit deck preserve FSRS state untuk kartu yang tidak diubah

### Non-Functional Requirements

- [ ] Bundle size: study page initial JS < 250KB (KaTeX deferred)
- [ ] FSRS calculation latency: < 50ms per rating
- [ ] Card review API roundtrip: < 500ms p95
- [ ] First Contentful Paint study page: < 1.5s
- [ ] Mobile responsive: rating buttons reachable dengan jempol satu tangan
- [ ] Reduced motion respected (existing CSS at [app/globals.css](../../app/globals.css))
- [ ] No data loss: card schema additions backward-compatible (semua field optional)

### Security & Privacy

- [ ] Markdown sanitization: react-markdown default config blocks `<script>` etc
- [ ] LaTeX `strict: 'ignore'` — malformed LaTeX tidak throw
- [ ] Firestore Security Rules: user only access `users/{request.auth.uid}/...` (existing rule covers ini)
- [ ] No PII in client logs (timezone is OK, email OK)

### Quality Gates

- [ ] TypeScript clean: `npx tsc --noEmit` → 0 errors
- [ ] All Firestore queries documented + auto-indexed (no manual composite needed)
- [ ] All new server actions: ActionResult wrapping + auth gate + try/catch
- [ ] Test plan executed: all 10 integration scenarios in System-Wide Impact section
- [ ] Manual UX review on iPhone Safari + Chrome Android

## Success Metrics

### Product KPIs (post-launch)

| Metric | Target (30 hari pasca-launch) | Cara measure |
|---|---|---|
| **D7 retention** | > 25% | Firebase Analytics: user yang review minimum 1 kartu di Day 7 |
| **Median streak** | ≥ 3 hari | Aggregate `currentStreak` dari users docs |
| **Cards reviewed/user/day** | ≥ 8 (≥ 80% dari goal 10) | Sum `cardsStudiedToday` |
| **Study session length** | ≥ 5 menit median | Time between first dan last `rateCard` per session |
| **FSRS efficacy** | < 15% rating "Lagi" | Hitung distribution rating per user setelah 2 minggu |

### Technical KPIs

| Metric | Target | Tooling |
|---|---|---|
| Build size delta | < +200KB initial JS | `next build` output |
| FSRS calc time | < 50ms | console.time di action |
| Crash rate | < 0.1% | Browser console errors |

## Dependencies & Prerequisites

### NPM packages to install (Week 1)
```
ts-fsrs                # FSRS-5 algorithm (~30KB)
react-markdown         # Markdown rendering (~50KB)
remark-gfm             # GFM extension (tables, strikethrough) (~80KB)
```

### NPM packages to install (Week 2)
```
remark-math            # Math syntax detection (~20KB)
rehype-katex           # KaTeX integration plugin (~10KB)
katex                  # LaTeX rendering (~270KB JS + 23KB CSS, lazy)
```

### Internal prerequisites
- ✅ Firestore enabled (sudah)
- ✅ Firebase Auth working (sudah)
- ✅ Composite index untuk `decks.where('folderId').orderBy('createdAt')` (sudah build)
- ⚠️ **Auto single-field index untuk `cards.due` ASC akan trigger di first query** — wajar, tunggu 1-3 menit
- ⚠️ Firebase Security Rules harus include rule untuk `users/{uid}` doc

### External dependencies
- Firestore SLA (Google Cloud)
- npm registry uptime (untuk install)

## Risk Analysis & Mitigation

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| **FSRS state corruption pada `updateDeck`** | High (current bug) | Critical | Refactor Day 2 dengan id-stable diff |
| **Bundle size explosion (KaTeX)** | Medium | High | Lazy load via `next/dynamic`, measure tiap commit |
| **Timezone bugs di streak calculation** | Medium | Medium | Capture user TZ via client, compute server-side. Edge case rare. |
| **Cloze parser regex fails edge case** | Medium | Low | Test suite cover 5+ edge cases (nested, escaped, malformed) |
| **Day boundary race condition** | Low | Medium | Atomic `FieldValue.increment` + idempotent `updateStreak` |
| **Existing cards tidak migrate auto** | Low | Low | Lazy migration verified Day 5 |
| **Timeline slip** | Medium | High | Iterative ship — bisa launch dengan Phase 1 saja kalau Phase 2 telat |
| **User confused dengan rating buttons** | Medium | Medium | Tooltip help text + interval preview di button |
| **Firebase quota exceeded di launch** | Low | Medium | Free tier: 50k reads/hari. Monitor via Firebase console. |
| **Markdown XSS** | Low | High | react-markdown default sanitization (verify dengan eval test) |

## Resource Requirements

- **Developer time:** 1 dev × 2 minggu (10 hari kerja)
- **Infrastructure:** Sudah ada (Firebase free tier, Vercel hobby)
- **No additional cost** — semua dependencies free/open-source
- **Testing:** Manual + 1-2 internal testers di Day 5 untuk Phase 1 feedback

## Future Considerations

Post-launch milestones (NOT in scope of plan ini):

### Milestone 2 (Month 2)
- AI card generation dari paste teks/PDF (Claude API)
- PWA + Firestore offline persistence
- Public deck sharing dengan link

### Milestone 3 (Month 3)
- Image cards / image occlusion
- Audio cards (TTS auto-generate)
- Konfigurabel FSRS desired retention

### Milestone 4 (Month 6)
- Stripe payments untuk premium tier
- Shared decks marketplace
- Native iOS/Android wrapper (Capacitor)

## Documentation Plan

After implementation:
- [ ] Update [README.md](../../README.md) — feature list (FSRS, Markdown, Cloze, Streaks)
- [ ] Update [prd.md](../../prd.md) — section 3.3 Study Mode rewrite + new section "3.4 Engagement Layer"
- [ ] Buat [docs/solutions/2026-05-XX-fsrs-integration-learnings.md](../solutions/) setelah Day 5 — capture gotchas (e.g., "FSRS state corruption bug discovered di updateDeck")
- [ ] Buat [docs/user-guide.md](../user-guide.md) — basic guide untuk user: "Cara pakai cloze deletion", "Cara pakai LaTeX"

## Research Insights & Critical Updates

Section ini dihasilkan dari deepen-plan review (8 agent paralel). Tujuan: integrate findings tanpa rewrite plan dari scratch. Cross-reference ke Phase Day bullets di atas — kalau ada konflik, **section ini menang.**

### A. Critical Atomicity Fixes (ALL reviewers flagged)

**Problem:** Plan original melakukan `recordReview → ensureUserDoc → updateStreak → incrementCardsStudied` sebagai 4 sequential awaits. Setiap window adalah failure mode. Multi-tab atau rapid clicks akan corrupt FSRS state.

**Fix:** Buat `lib/services/study.service.ts` (REVISED dari Phase 1 Day 2 plan) yang wrap semua di `adminDb.runTransaction()`:

```typescript
// lib/services/study.service.ts
export async function recordCardReview(params: {
  uid: string
  deckId: string
  cardId: string
  rating: FsrsRating
  reviewId: string           // client-generated UUID for idempotency
  expectedReps: number       // optimistic concurrency check
  timezone: string           // for server-side date computation
}): Promise<ReviewOutcome> {
  return adminDb.runTransaction(async (tx) => {
    const cardRef = adminDb.collection('users').doc(params.uid)
      .collection('decks').doc(params.deckId)
      .collection('cards').doc(params.cardId)
    const userRef = adminDb.collection('users').doc(params.uid)
    const reviewRef = cardRef.collection('reviews').doc(params.reviewId)

    // 1. Idempotency check — duplicate reviewId returns cached result
    const existingReview = await tx.get(reviewRef)
    if (existingReview.exists) {
      return existingReview.data() as ReviewOutcome
    }

    // 2. Optimistic concurrency check
    const cardSnap = await tx.get(cardRef)
    const cardData = cardSnap.data()
    if (cardData && cardData.reps !== params.expectedReps) {
      throw new StaleStateError('Card was reviewed in another tab')
    }

    // 3. Compute server-side todayDate from user TZ
    const userSnap = await tx.get(userRef)
    const userData = userSnap.data() as UserData | undefined
    const todayDate = formatInTimezone(new Date(), userData?.timezone ?? params.timezone)

    // 4. Apply FSRS
    const { updatedCard, log } = applyRating(cardData, new Date(), params.rating)

    // 5. Compute streak delta
    const streakUpdate = computeStreakUpdate(userData, todayDate)

    // 6. Atomic writes (single transaction commit)
    tx.update(cardRef, { ...updatedCard, updatedAt: FieldValue.serverTimestamp() })
    tx.create(reviewRef, { rating: params.rating, log, createdAt: FieldValue.serverTimestamp() })
    tx.set(userRef, {
      ...streakUpdate,
      cardsStudiedToday: FieldValue.increment(streakUpdate.crossedDayBoundary ? 1 - prevCount : 1),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true })

    return { updatedCard, streak: streakUpdate.currentStreak, log }
  })
}
```

**Action items:**
- [ ] Create `lib/services/study.service.ts` (NEW) — Phase 1 Day 2
- [ ] Move `lib/firestore/users.ts` `updateStreak` logic INTO service (it must be inside transaction)
- [ ] Replace all `new Date()` writes dengan `FieldValue.serverTimestamp()`
- [ ] Add `expectedReps` field to rateCard payload (client sends current reps state)
- [ ] Add `reviewId` UUID generation in client (`crypto.randomUUID()`) before each rating
- [ ] Drop `revalidatePath('/decks', '/stats')` two-arg call — wrong signature, must be 2 separate calls

### B. Security Hardening (HIGH severity from Sentinel)

#### B.1 Markdown XSS — `rehype-sanitize` REQUIRED

react-markdown 9.x escapes raw HTML, **BUT** does NOT block `[click](javascript:alert(1))` or `data:` URIs. Must add explicit sanitization.

```typescript
// components/markdown/Markdown.tsx
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'

const SAFE_URL = /^(https?:|mailto:|\/|#)/i

const customSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    a: [...(defaultSchema.attributes?.a ?? []), 'target', 'rel'],
  },
}

<Markdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[[rehypeSanitize, customSchema]]}
  components={{
    a({ href, children }) {
      if (!href || !SAFE_URL.test(href)) return <span>{children}</span>
      return <a href={href} target="_blank" rel="noopener noreferrer nofollow">{children}</a>
    },
    img({ src, alt }) {
      if (!src || !SAFE_URL.test(src)) return null
      return <img src={src} alt={alt ?? ''} loading="lazy" />
    },
  }}
>{src}</Markdown>
```

**Plus CSP header** di [next.config.ts](../../next.config.ts):
```typescript
{ source: '/(.*)', headers: [{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
}]}
```

#### B.2 KaTeX Hardening

```typescript
rehypePlugins: [[rehypeKatex, {
  strict: 'ignore',
  trust: false,           // CVE-2023-30533 prevention
  maxExpand: 1000,        // macro expansion DoS prevention
  maxSize: 50,            // single-equation memory cap
  output: 'html',
  errorColor: '#cc0000',
}]]
```

#### B.3 Cloze Parser Sanitization-Bypass Fix

Original: `${answer}` interpolated raw → markdown chars in answer can break out.

```typescript
// lib/cloze/parser.ts
function escapeMarkdown(s: string): string {
  return s.replace(/[\\`*_{}\[\]()#+\-.!]/g, '\\$&')
}

export function renderCloze(src: string, activeIdx: number, reveal: boolean): string {
  return src.replace(CLOZE_RE, (_, idx, answer, hint) => {
    const i = Number(idx)
    const safeAnswer = escapeMarkdown(answer)
    const safeHint = hint ? escapeMarkdown(hint) : '...'
    if (i === activeIdx) return reveal ? `**${safeAnswer}**` : `[${safeHint}]`
    return safeAnswer
  })
}
```

Plus: validate per-field length in Zod schema (cap 10KB):
```typescript
// lib/schemas/card.schema.ts
export const CardSchema = z.object({
  soal: z.string().min(1).max(10_000),
  jawaban: z.string().min(1).max(10_000),
})
```

#### B.4 Untrusted Client Timezone

**Attack:** Client sends `timezone: 'Etc/GMT-14'` then `'Etc/GMT+12'` to roll midnight forward and inflate streak.

**Fix:**
```typescript
// Validate IANA whitelist
import { isValidTimezone } from '@/lib/utils/timezone'

function validateTimezone(tz: string): string {
  if (!isValidTimezone(tz)) throw new Error('Invalid timezone')
  return tz
}

// Server-compute todayDate from STORED user timezone
function computeTodayDate(userTimezone: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: userTimezone }).format(new Date())
  // 'en-CA' returns YYYY-MM-DD format
}
```

Store timezone on first action; require explicit profile UI to change. Cap streak deltas: single rateCard cannot increase currentStreak by more than 1.

#### B.5 firestore.rules MUST Be in Repo

Plan original assumes "existing rule covers." **NO `firestore.rules` file exists in repo.** Commit explicitly:

```
// firestore.rules (NEW FILE — root of project)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
      allow create: if request.auth != null && request.auth.uid == uid;
      allow update: if request.auth != null && request.auth.uid == uid
        && request.resource.data.currentStreak <= resource.data.currentStreak + 1;
      allow delete: if false; // Server actions only
    }
    match /users/{uid}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

Plus [firebase.json](../../firebase.json):
```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

Deploy: `firebase deploy --only firestore:rules,firestore:indexes`.

#### B.6 GDPR / Privacy (BEFORE launch publik)

- [ ] Buat `lib/actions/account.actions.ts` dengan `deleteAccount()` — cascade delete users/{uid}/** + adminAuth.deleteUser()
- [ ] Buat halaman `/privacy` + `/terms`
- [ ] Map error messages ke generic strings (jangan leak Firestore paths)

### C. Performance Optimizations (Performance Oracle)

#### C.1 Bundle Size Real Numbers (gzipped)
Per oracle measurement bukan raw:
- react-markdown: ~38KB
- remark-gfm: ~22KB
- ts-fsrs: ~8KB
- KaTeX: ~75KB JS + ~23KB CSS

Total tanpa KaTeX: **~68KB** (sangat reasonable). Dengan KaTeX: ~166KB. Target 250KB **achievable**.

#### C.2 Conditional KaTeX Loading
Detect math content sebelum mount KaTeX:

```typescript
// components/markdown/SmartMarkdown.tsx
const HAS_MATH = /\$[^\$]+\$|\$\$[\s\S]+\$\$/

export default function SmartMarkdown({ src }: { src: string }) {
  const hasMath = HAS_MATH.test(src)
  if (!hasMath) return <Markdown>{src}</Markdown>
  const MarkdownMath = dynamic(() => import('./MarkdownMath'), { ssr: false })
  return <MarkdownMath>{src}</MarkdownMath>
}
```

~95% of cards skip KaTeX entirely.

#### C.3 Server-Render Markdown (architecture refinement)
Split [components/cards/FlashCard.tsx](../../components/cards/FlashCard.tsx) menjadi:
- `FlashCardServer.tsx` (RSC, no 'use client') — render `<Markdown>` ke HTML server-side, pass `front`/`back` sebagai children
- `FlashCardClient.tsx` ('use client') — terima children, handle flip state only

**Wins:** Markdown bundle (~68KB) gak masuk ke client bundle untuk FlashCard. Hanya katex yang masuk client kalau ada `$...$`.

#### C.4 Memoize Markdown
```typescript
const MemoMarkdown = React.memo(Markdown, (prev, next) => prev.children === next.children)
```

#### C.5 Render Only Current+Next Card
StudyCarousel jangan mount semua 200 cards. Pakai `currentIndex`, render `cards[currentIndex]` dan `cards[currentIndex+1]` (preload). Drop scroll-snap (lihat [section D](#d-race-condition-mitigations)).

#### C.6 Composite Index DECLARED (NOT auto)
**Plan original salah:** "auto single-field index covers it." Untuk collection-group queries dengan multiple fields → MUST declare. Add [firestore.indexes.json](../../firestore.indexes.json):

```json
{
  "indexes": [
    {
      "collectionGroup": "cards",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "due", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "cards",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "state", "order": "ASCENDING" }
      ]
    }
  ]
}
```

**Action:** Denormalize `userId` ke setiap card document saat create (extra field, ~30 bytes/card). Enables collection-group query untuk cross-deck study session di future.

#### C.7 Bundle Analyzer di CI dari Day 1
Add `@next/bundle-analyzer` ke devDependencies. Gate PRs dengan threshold check.

### D. Race Condition Mitigations (Frontend Race Reviewer)

#### D.1 State Machine in Study UI
Replace boolean `isPending` dengan symbol-based state machine:

```typescript
const STATE = { IDLE: 'idle', RATING: 'rating', ADVANCING: 'advancing' } as const
type StudyState = typeof STATE[keyof typeof STATE]

const [state, setState] = useState<StudyState>(STATE.IDLE)

async function handleRate(rating: FsrsRating) {
  if (state !== STATE.IDLE) return
  setState(STATE.RATING)
  try {
    const reviewId = crypto.randomUUID()
    const result = await rateCard({ ...payload, reviewId, expectedReps: card.reps })
    if (!result.success) {
      // Show error, stay on current card
      setState(STATE.IDLE)
      return
    }
    setState(STATE.ADVANCING)
    // animate transition...
    setCurrentIndex(i => i + 1)
    setState(STATE.IDLE)
  } catch {
    setState(STATE.IDLE)
  }
}
```

#### D.2 AbortController + mountedRef
```typescript
const mountedRef = useRef(true)
useEffect(() => () => { mountedRef.current = false }, [])

async function handleRate(...) {
  const result = await rateCard(...)
  if (!mountedRef.current) return  // unmounted — skip state updates
  setState(STATE.ADVANCING)
}
```

#### D.3 Drop scroll-snap untuk rated mode
Original StudyCarousel pakai `scroll-snap-y mandatory` + IntersectionObserver. Untuk rated queue, **transition controlled by rating action**, bukan scroll. Replace dengan:

```typescript
<div style={{ transform: `translateY(-${currentIndex * 100}%)`, transition: 'transform 250ms' }}>
  {cards.map((card, i) => (
    <div key={card.id} style={{ visibility: i >= currentIndex - 1 && i <= currentIndex + 1 ? 'visible' : 'hidden' }}>
      <FlashCard ... />
    </div>
  ))}
</div>
```

20 lines lighter, no IntersectionObserver/snap conflicts.

#### D.4 Functional setState
Avoid stale closures: `setCards(prev => prev.slice(1))` not `setCards(cards.slice(1))`.

### E. TypeScript Design Improvements (Kieran TS Reviewer)

#### E.1 Discriminated Union untuk FsrsState
Original: all 8 fields optional → tipe membolehkan `{ due: Date, stability: undefined }` (invalid). Replace:

```typescript
type FsrsState =
  | { state: 'new' }
  | {
      state: 'learning' | 'review' | 'relearning'
      due: Date
      stability: number
      difficulty: number
      elapsedDays: number
      scheduledDays: number
      reps: number
      lapses: number
      lastReview: Date
    }

export type CardData = {
  id: string
  soal: string
  jawaban: string
  order: number
  deckId: string
  userId: string  // NEW for collection group query (denormalized)
  fsrsVersion?: number  // for future weight migration
  createdAt: Date
  updatedAt: Date
} & FsrsState
```

`cardDataToFsrs(card)` switches on `card.state` — exhaustive, no `!` non-null assertions.

#### E.2 Drop redundant `todayDate` field
`lastStudyDate` dan `todayDate` selalu sama setelah `updateStreak` — `todayDate` redundant. Compute di read time.

#### E.3 `as const satisfies` untuk Rating Map
```typescript
const RATING_MAP = {
  Again: Rating.Again,
  Hard: Rating.Hard,
  Good: Rating.Good,
  Easy: Rating.Easy,
} as const satisfies Record<string, Rating>

export type FsrsRating = keyof typeof RATING_MAP
```

#### E.4 Discriminated CardInput
```typescript
export type CardInput =
  | { kind: 'existing'; id: string; soal: string; jawaban: string }
  | { kind: 'new'; soal: string; jawaban: string }
```

`updateDeck` switches on `kind` — TS exhaustiveness check catches bugs at compile time.

#### E.5 Branded ID types (optional but cheap)
```typescript
type DeckId = string & { readonly __brand: 'DeckId' }
type CardId = string & { readonly __brand: 'CardId' }
type UserId = string & { readonly __brand: 'UserId' }
```

Catches `rateCard(cardId, deckId, ...)` at compile time. Zero runtime cost.

### F. Architecture Refinements (Architecture Strategist)

#### F.1 Add `fsrsVersion` field
Future-proof against algorithm tuning:
```typescript
{ fsrsVersion: 5, ...fsrsState }
```
Future migrations bisa filter `where fsrsVersion < N` untuk recalculate.

#### F.2 Pull streak DATA model ke Phase 1
Original: streak fully in Phase 2. **Issue:** Phase 1 tester gak punya engagement loop, sulit validate FSRS efficacy di 5 hari.

**Refactor:** Phase 1 Day 4 — buat `users/{uid}` doc dengan `incrementCardsStudied` + `currentStreak` write-only (no UI). Phase 2 Day 9 — add UI badge.

Cost: 2 jam extra di Phase 1, manfaat: tester return Day 2-7 untuk validate.

#### F.3 Cloze derived field (clozeIndices)
Keep `soal` raw (single source of truth). Add `clozeIndices?: number[]` derived at save time:

```typescript
// in createDeck/updateDeck
const clozeIndices = extractClozeIndices(card.soal)
batch.set(cardRef, {
  ...cardData,
  clozeIndices: clozeIndices.length > 0 ? clozeIndices : undefined,
})
```

Cheap, lets `getDueCards` filter cloze cards in query, parsing happens at render time still.

#### F.4 Decide collection group vs per-deck
**Decision:** Use collection group query for cross-deck study (the natural FSRS UX where user reviews across all decks). Document this. Per-deck queries still work for `/decks/[id]/study` page.

```typescript
// Cross-deck (default study):
adminDb.collectionGroup('cards')
  .where('userId', '==', uid)
  .where('due', '<=', now)
  .orderBy('due', 'asc')
  .limit(50)

// Per-deck (focused review):
deckRef.collection('cards')
  .where('due', '<=', now)
  .orderBy('due', 'asc')
```

### G. Best Practices Integration (FSRS Researcher)

#### G.1 Use `generatorParameters()` defaults; defer optimization
Don't expose `request_retention` or weights as user setting in v1. Anki's own beginner docs say "do not touch for weeks." Add as Advanced Settings post-launch.

#### G.2 Daily limits (NEW addition)
Plan original tidak punya daily new/review limits. Add defaults:
- New cards/day: 20 (cap 50)
- Reviews/day: 200 (option: unlimited)

Stored di `users/{uid}` doc:
```typescript
maxNewPerDay: 20,
maxReviewsPerDay: 200,
```

Required: dynamic new-card throttling — kalau review queue > maxReviewsPerDay, skip new cards (anti death-spiral).

#### G.3 Rating buttons — soft interval text
Compromise antara "tampilkan interval" (Anki standard) dan "label only" (simplicity reviewer suggestion):
```
[Lagi]            [Susah]           [Bagus]            [Mudah]
< 10 menit        < 1 hari          ~ 3 hari           ~ 1 minggu
```
Secondary muted text below label. Hide "Easy" interval until 3rd review (early easy ratings inflate stability badly).

#### G.4 Lapse handling — Tough Cards section
Lapsed cards (rating: 'Again') jangan di-interleave mid-session. Queue ke "Kartu Sulit" mini-section di akhir session (max 5 cards). Mochi/RemNote pattern.

#### G.5 Explicit `state: 'new'` from creation
**Important pattern shift:** Don't lazy-migrate ("absent state = new"). Set `state: 'new'` explicitly saat card creation. Reasons:
- Firestore can't query "field absent"
- Future migration paths cleaner
- `getNewCards` becomes `where('state', '==', 'new').orderBy('createdAt')` — clean query

**Action:** Update [lib/firestore/decks.ts](../../lib/firestore/decks.ts) `createDeck` and `updateDeck` (insert path) to set `state: 'new'` on new cards.

#### G.6 Reviews log subcollection
Store review history at `users/{uid}/decks/{deckId}/cards/{cardId}/reviews/{reviewId}`. Serves dual purpose:
1. **Idempotency** (reviewId UUID — duplicate write fails via `tx.create`)
2. **Future weight optimization** (history needed for FSRS optimizer)

Card document tetap kecil. ~150 bytes per review log, deletable kalau besar.

#### G.7 Streak anti-anxiety patterns
- ❌ NO push notifications about streak loss (Duolingo dark pattern)
- ✅ Hide counter saat streak < 7 days (reduce early pressure)
- ✅ "Streak freeze" — auto-grant 1 free skip per 7-day streak (use `streakFreezes: number` field)
- ✅ Show streak only on /stats dan completion screen, bukan home

### H. YAGNI Adjustments (Selective from Simplicity Reviewer)

**Adopted cuts:**
- ✂️ **Hardcode `dailyGoal = 10`** untuk MVP — drop /profile config UI (~40 LOC saved). Add config in v1.1.
- ✂️ **Drop redundant `todayDate` field** (also caught by TS reviewer)
- ✂️ **StreakBadge: single component, size prop** (not separate variants)
- ✂️ **Drop "internal ship at Day 5" ceremony** — Phase 1/2 split is logical only, build continuous

**Rejected cuts (kept):**
- ❌ Cut cloze entirely — KEEP (brainstorm decision, distinguishing feature, ~150 LOC achievable in 1 day)
- ❌ Cut LaTeX — KEEP (per-card lazy detection means most users don't pay bundle cost)
- ❌ Cut interval preview — KEEP but make subtle (per FSRS researcher recommendation G.3)
- ❌ Cut `ensureUserDoc` helper — KEEP (used by transaction service for clarity)

### I. Updated Risk Matrix

| Risk | Probability | Impact | Mitigation (POST-deepen) |
|---|---|---|---|
| FSRS state corruption multi-tab | High | Critical | ✅ runTransaction + expectedReps optimistic concurrency |
| Streak inflation via TZ manipulation | Medium | Medium | ✅ Server-compute todayDate, validate IANA whitelist |
| Markdown XSS | Medium | High | ✅ rehype-sanitize + URL allowlist + CSP |
| KaTeX exploit | Low | High | ✅ Explicit `trust: false`, maxExpand, maxSize |
| Cloze regex bypass | Low | Medium | ✅ escapeMarkdown() in renderCloze |
| Reviewed twice via network retry | Medium | Medium | ✅ reviewId UUID + tx.create() idempotency |
| Race in updateStreak | High | Medium | ✅ Inside runTransaction |
| FieldValue.increment vs reset race | Medium | Medium | ✅ Single tx with merge |
| ensureUserDoc concurrent first call | Low | Low | ✅ tx.set with merge inside transaction |
| Bundle size > 250KB | Medium | Medium | ✅ Conditional KaTeX, server-render markdown |
| Day boundary mid-session | Medium | Medium | ✅ Server-side todayDate computation |
| Mid-review unmount | Medium | Low | ✅ mountedRef + AbortController |
| Stale FSRS state on edit | High → ✅ | Critical | ✅ Diff-based updateDeck with id-stable cards |
| Privacy violation (no GDPR controls) | High | High | ✅ deleteAccount action + /privacy page |
| Composite index missing | High → ✅ | High | ✅ firestore.indexes.json declared upfront |

### J. Updated Phase 1 Day-by-Day (REVISED)

**Day 1: Schema + Lib + Security Foundations**
- [x] `npm install ts-fsrs react-markdown remark-gfm rehype-sanitize`
- [x] Update [lib/types.ts](../../lib/types.ts): discriminated union `FsrsState` (branded IDs deferred — premature for MVP, `userId` denorm deferred to Day 2 when collection-group queries needed)
- [x] Buat [lib/fsrs/scheduler.ts](../../lib/fsrs/scheduler.ts) — `applyRating`, `previewRatings` (returns `{due, scheduledDays}`), serialize logic inline (separate serialize.ts unnecessary)
- [x] Buat [lib/utils/timezone.ts](../../lib/utils/timezone.ts) — `isValidTimezone`, `computeTodayDate`, `computeYesterdayDate`, `DEFAULT_TIMEZONE`
- [x] Commit [firestore.rules](../../firestore.rules) + [firestore.indexes.json](../../firestore.indexes.json) + [firebase.json](../../firebase.json)
- [ ] Add `@next/bundle-analyzer` + threshold check di package.json scripts (DEFERRED — Phase 2 Day 6 saat KaTeX masuk)

**Day 2: Service Layer + Critical updateDeck Refactor**
- [x] **CRITICAL FIX** [lib/firestore/decks.ts](../../lib/firestore/decks.ts) `updateDeck`: optional `id` di CardInput (simpler than discriminated union for MVP), diff-based update preserving FSRS state
- [x] Add `state: 'new'` explicit pada card creation (not lazy)
- [x] Replace `new Date()` dengan `FieldValue.serverTimestamp()` di decks.ts writes
- [x] Update [components/decks/EditDeckClient.tsx](../../components/decks/EditDeckClient.tsx) untuk pass card ids
- [ ] Add `userId` denormalization pada card document (DEFERRED — Day 3 saat butuh collection group query)
- [ ] Buat [lib/firestore/cards.ts](../../lib/firestore/cards.ts): `getDueCards`, `getDeckDueCards`, `getNewCards` (DEFERRED Day 3)
- [ ] Buat [lib/services/study.service.ts](../../lib/services/study.service.ts) — `recordCardReview` dalam `runTransaction` (DEFERRED Day 3)
- [ ] Buat [lib/actions/study.actions.ts](../../lib/actions/study.actions.ts) (DEFERRED Day 3)

**Day 3: Study Mode UX + State Machine**
- [ ] Major rework [components/study/StudyCarousel.tsx](../../components/study/StudyCarousel.tsx): drop scroll-snap, controlled queue, state machine, mountedRef
- [ ] Buat [components/study/RatingButtons.tsx](../../components/study/RatingButtons.tsx) — 4 tombol + subtle interval text
- [ ] Update [app/(app)/decks/[id]/study/page.tsx](../../app/\(app\)/decks/[id]/study/page.tsx) build queue with limits
- [ ] Test: rapid clicks, navigate-away, multi-tab dengan optimistic concurrency

**Day 4: Markdown Rendering (Server) + Streak Data Model**
- [ ] Split [components/cards/FlashCard.tsx](../../components/cards/FlashCard.tsx): RSC + client
- [ ] Buat [components/markdown/Markdown.tsx](../../components/markdown/Markdown.tsx) dengan rehype-sanitize + URL allowlist
- [ ] Buat [components/markdown/SmartMarkdown.tsx](../../components/markdown/SmartMarkdown.tsx) dengan math regex pre-detect
- [ ] Buat [lib/firestore/users.ts](../../lib/firestore/users.ts) — `ensureUserDoc`, `computeStreakUpdate` (helpers untuk transaction)
- [ ] Integrate streak update into `recordCardReview` (data only, no UI)

**Day 5: Test + Polish (no internal ship ceremony)**
- [ ] Manual test scenarios (10 dari System-Wide Impact section)
- [ ] Bundle size measurement < 250KB
- [ ] Type-check clean
- [ ] Continue to Phase 2 directly

### K. Updated Phase 2 Day-by-Day (REVISED)

**Day 6: KaTeX (Conditional Lazy Load)**
- [ ] `npm install remark-math rehype-katex katex`
- [ ] Buat [components/markdown/MarkdownMath.tsx](../../components/markdown/MarkdownMath.tsx) dengan KaTeX hardening (trust: false, maxExpand, maxSize)
- [ ] Update SmartMarkdown untuk dynamic import
- [ ] Verify bundle: math-free pages < 200KB, math pages < 270KB

**Day 7: Cloze Deletion**
- [ ] Buat [lib/cloze/parser.ts](../../lib/cloze/parser.ts) dengan escapeMarkdown
- [ ] Buat [components/cloze/ClozeCard.tsx](../../components/cloze/ClozeCard.tsx) — sequence cluster dalam session, single FSRS state per card (MVP)
- [ ] Add `clozeIndices` derived field di card creation/update
- [ ] Help text di NewDeckClient

**Day 8: Streak UI**
- [ ] Buat [components/streaks/StreakBadge.tsx](../../components/streaks/StreakBadge.tsx) — single component, size prop
- [ ] Hide counter saat streak < 7 (anti-anxiety pattern)
- [ ] Update [app/(app)/stats/page.tsx](../../app/\(app\)/stats/page.tsx)
- [ ] Add streak freeze logic (1 per 7-day streak earned)

**Day 9: Lapse Handling + Account Deletion**
- [ ] "Kartu Sulit" mini-section di completion screen (max 5 lapsed)
- [ ] Buat [lib/actions/account.actions.ts](../../lib/actions/account.actions.ts) `deleteAccount`
- [ ] Tambah delete account button di /profile (dengan konfirmasi)
- [ ] Buat halaman [/privacy](../../app/privacy/page.tsx) dan [/terms](../../app/terms/page.tsx)

**Day 10: Final Testing + Launch**
- [ ] Full e2e test (10 scenarios + 8 race conditions from Section D)
- [ ] Security checklist verified (rehype-sanitize, KaTeX hardening, firestore.rules deployed)
- [ ] Bundle analyzer green
- [ ] Privacy policy live
- [ ] Production deploy
- [ ] **Launch publik** 🚀

### L. New Acceptance Criteria (Adds to Original)

- [ ] Multi-tab safety: rating same card from 2 tabs → second one rejected with "stale state" error
- [ ] Idempotent retry: same reviewId twice → no double-increment
- [ ] Server-computed todayDate: client manipulating system clock cannot inflate streak
- [ ] No `javascript:` URI in markdown links (XSS test)
- [ ] No `\href{javascript:...}` in LaTeX (KaTeX hardening test)
- [ ] Cloze with markdown injection in answer → escaped properly
- [ ] firestore.rules deployed AND committed to repo
- [ ] CSP header set in production
- [ ] deleteAccount cascades correctly (verified in test)
- [ ] Streak freeze auto-granted at 7-day mark
- [ ] Bundle: math-free study page < 200KB initial JS
- [ ] runTransaction for rateCard verified (single round trip)
- [ ] FSRS state preserved through deck edit (verified in test)

---

## Sources & References

### Origin
- **Brainstorm:** [docs/brainstorms/2026-05-02-app-improvements-brainstorm.md](../brainstorms/2026-05-02-app-improvements-brainstorm.md)
  - Key decisions carried forward:
    - Wedge: Study quality (FSRS + Markdown), bukan AI/social
    - Approach: Iterative Ship — Week 1 FSRS+Markdown, Week 2 LaTeX+Cloze+Streaks
    - UX: Floating bar 4 tombol di bawah card setelah flip
    - Daily goal default 10, streak reset kalau skip 1 hari penuh
    - Pricing: 100% free saat launch
    - Multi-cloze: 1 FSRS state per card (MVP simplification, not strict Anki behavior)

### Internal References (current code)

| Aspect | File:Line |
|---|---|
| Card schema (current) | [lib/types.ts:1-9](../../lib/types.ts#L1) |
| Card writes (current) | [lib/firestore/decks.ts:80,115](../../lib/firestore/decks.ts#L80) |
| **`updateDeck` bug** (must fix) | [lib/firestore/decks.ts:139-145](../../lib/firestore/decks.ts#L139) |
| Study entry point | [app/(app)/decks/[id]/study/page.tsx](../../app/\(app\)/decks/[id]/study/page.tsx) |
| Study UX (current) | [components/study/StudyCarousel.tsx](../../components/study/StudyCarousel.tsx) |
| Card render (current) | [components/cards/FlashCard.tsx:36,51](../../components/cards/FlashCard.tsx#L36) |
| Server action template | [lib/actions/deck.actions.ts:20-49](../../lib/actions/deck.actions.ts#L20) |
| Stats hook point | [lib/firestore/stats.ts](../../lib/firestore/stats.ts) |
| Auth pattern | [lib/auth.ts:6-22](../../lib/auth.ts#L6) |
| Firebase Admin | [lib/firebase/admin.ts](../../lib/firebase/admin.ts) |

### External References

- **ts-fsrs (FSRS-5 library):** https://github.com/open-spaced-repetition/ts-fsrs
  - API: `createEmptyCard()`, `fsrs()`, `scheduler.next(card, now, rating)`
  - Default params: `request_retention: 0.9`, 21 weights
- **react-markdown:** https://github.com/remarkjs/react-markdown — v9.x supports React 19 + Next.js 16, SSR-safe
- **remark-math + rehype-katex:** https://github.com/remarkjs/remark-math
- **KaTeX:** https://katex.org/docs/browser — CSS import required
- **Anki cloze syntax:** https://docs.ankiweb.net/editing.html#cloze-deletion

### Related Work
- **Previous plan:** [docs/plans/2026-04-25-001-feat-mobile-first-flashcard-mvp-plan.md](2026-04-25-001-feat-mobile-first-flashcard-mvp-plan.md) — original MVP plan, sekarang sudah implemented
- **Previous brainstorm:** [docs/brainstorms/2026-04-25-mobile-first-flashcard-brainstorm.md](../brainstorms/2026-04-25-mobile-first-flashcard-brainstorm.md)

## Appendix: Code Sketches

### lib/fsrs/scheduler.ts
```typescript
import { fsrs, generatorParameters, createEmptyCard, Rating, State, type Card as FsrsCard } from 'ts-fsrs'
import type { CardData } from '@/lib/types'

const scheduler = fsrs(generatorParameters({ request_retention: 0.9 }))

export type FsrsRating = 'Again' | 'Hard' | 'Good' | 'Easy'

const ratingMap: Record<FsrsRating, Rating> = {
  Again: Rating.Again, Hard: Rating.Hard, Good: Rating.Good, Easy: Rating.Easy,
}

export function cardDataToFsrs(card: CardData): FsrsCard {
  if (card.due === undefined) return createEmptyCard()
  return {
    due: card.due,
    stability: card.stability!,
    difficulty: card.difficulty!,
    elapsed_days: card.elapsedDays!,
    scheduled_days: card.scheduledDays!,
    reps: card.reps!,
    lapses: card.lapses!,
    state: stateMap[card.state!],
    last_review: card.lastReview,
    learning_steps: 0,
  }
}

export function applyRating(card: CardData, now: Date, rating: FsrsRating) {
  const fsrsCard = cardDataToFsrs(card)
  const result = scheduler.next(fsrsCard, now, ratingMap[rating])
  return { updatedCard: fsrsToCardData(result.card), log: result.log }
}

export function previewRatings(card: CardData, now: Date): Record<FsrsRating, Date> {
  const fsrsCard = cardDataToFsrs(card)
  const previews = scheduler.repeat(fsrsCard, now)
  return {
    Again: previews[Rating.Again].card.due,
    Hard: previews[Rating.Hard].card.due,
    Good: previews[Rating.Good].card.due,
    Easy: previews[Rating.Easy].card.due,
  }
}
```

### lib/firestore/users.ts
```typescript
import { adminDb } from '@/lib/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'
import type { UserData } from '@/lib/types'

function userRef(uid: string) {
  return adminDb.collection('users').doc(uid)
}

export async function ensureUserDoc(uid: string, email: string | null, timezone: string): Promise<void> {
  await userRef(uid).set({
    uid, email, timezone,
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: null,
    dailyGoal: 10,
    cardsStudiedToday: 0,
    todayDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }, { merge: true })
}

export async function updateStreak(uid: string, todayDate: string): Promise<void> {
  const ref = userRef(uid)
  const snap = await ref.get()
  const data = snap.data() as UserData

  // Same day → no-op
  if (data.lastStudyDate === todayDate) return

  // Calculate yesterday in user's TZ format
  const today = new Date(todayDate)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().slice(0, 10)

  const newStreak = data.lastStudyDate === yesterdayStr ? data.currentStreak + 1 : 1

  await ref.update({
    currentStreak: newStreak,
    longestStreak: Math.max(data.longestStreak, newStreak),
    lastStudyDate: todayDate,
    cardsStudiedToday: data.todayDate === todayDate ? data.cardsStudiedToday : 0,
    todayDate,
    updatedAt: new Date(),
  })
}
```

### lib/cloze/parser.ts
```typescript
const CLOZE_RE = /\{\{c(\d+)::([^:}]+)(?:::([^}]+))?\}\}/g

export function extractClozeIndices(src: string): number[] {
  const set = new Set<number>()
  for (const m of src.matchAll(CLOZE_RE)) set.add(Number(m[1]))
  return [...set].sort((a, b) => a - b)
}

export function renderCloze(src: string, activeIdx: number, reveal: boolean): string {
  return src.replace(CLOZE_RE, (_, idx, answer, hint) => {
    const i = Number(idx)
    if (i === activeIdx) return reveal ? `**${answer}**` : `[${hint ?? '...'}]`
    return answer
  })
}
```

---

**Status:** Plan ready for review.
**Next step:** `/ce-work docs/plans/2026-05-02-001-feat-fsrs-content-streaks-plan.md` untuk start implementation.
