# PRD: Aplikasi Flashcard untuk Pelajar Indonesia

> **Status:** Active · **Versi:** 2.0 · **Update terakhir:** 2026-05-02
> **Owner:** Alif Rizqullah M

---

## 1. Executive Summary

Aplikasi flashcard berbasis web yang dirancang untuk **pelajar Indonesia usia SMP hingga perkuliahan**, mengkombinasikan **algoritma spaced repetition modern (FSRS-5)** dengan **engagement mechanics ala Duolingo** dan **konten kaya (Markdown + LaTeX + Cloze)**.

Tujuannya: bikin belajar terasa **playful tapi serius**, sehingga pelajar mau kembali setiap hari membuka aplikasi tanpa merasa dipaksa. Bahasa interface 100% Indonesian native.

**Wedge kompetitif:** "Study quality (FSRS + Markdown) dengan UX modern dan harga gratis, untuk pelajar Indonesia non-power-user."

---

## 2. Target User

### Primary Personas

#### Persona 1: Adi (15) — Anak SMP
- **Konteks:** Kelas 9, hafalan banyak (IPA, IPS, Bahasa)
- **Pain:** Catat di kertas hilang, gak tau cara belajar efektif untuk ulangan harian
- **Goal:** Dapat nilai bagus tanpa belajar terlalu lama
- **Behavior:** Suka game mobile, main TikTok, kompetitif sama teman, sensitif sama UI yang ribet
- **Preferensi vibe:** Vibrant, gamified, fun

#### Persona 2: Cika (19) — Mahasiswa Semester Awal
- **Konteks:** Kuliah tahun pertama, mata kuliah banyak istilah baru
- **Pain:** Catatan note app berantakan, lupa istilah saat UTS
- **Goal:** Organize materi per mata kuliah, review berkala sebelum ujian
- **Behavior:** Pakai laptop + HP, multitask, suka aesthetic minimalis tapi functional
- **Preferensi vibe:** Clean, organized, capable

#### Persona 3: Rina (22) — Mahasiswa Tingkat Akhir / Pelajar Bahasa
- **Konteks:** Belajar bahasa Jepang/Inggris/Mandarin untuk persiapan kerja
- **Pain:** Anki terlalu jelek dan ribet, Quizlet paywalled fitur penting
- **Goal:** Sistem hafalan yang scientifically-proven dan portable
- **Behavior:** Power user, mau fitur SRS proper, butuh markdown untuk catatan kompleks
- **Preferensi vibe:** Refined, performant, tidak intrusif

### Bukan target (out of persona)

- Pelajar SD (terlalu kecil untuk SRS abstract)
- Profesional dewasa yang sudah pakai Anki bertahun-tahun (mereka stick dengan Anki)
- Casual user yang gak punya niat belajar konsisten

---

## 3. Product Objectives

| # | Objective | Cara measure |
|---|---|---|
| 1 | **Operational Efficiency** — Lapse antara buka app dan mulai belajar < 5 detik | Time-to-first-flashcard metric |
| 2 | **Cognitive Clarity** — Interface tidak distract user dari konten | Bounce rate < 30%, session length > 5 menit |
| 3 | **Engagement-Driven Retention** — User kembali besok dengan sukarela | D7 retention > 25%, median streak ≥ 3 hari |
| 4 | **Content Portability** — Bulk import + future export agar tidak vendor lock-in | CSV import success rate > 95%, export feature di v1.1 |
| 5 | **Study Quality** — Hasil belajar lebih efisien dari rote memorization | FSRS rating distribution: < 15% "Lagi" |

---

## 4. Brand Identity

### 4.1 Identitas Brand

| Field | Value |
|---|---|
| **Brand Name** | **Hafalin** *(proposed — code masih "Flashcard")* |
| **Tagline / One-liner** | "Belajar sebentar, inget selamanya." |
| **Domain target** | `hafalin.com` / `hafalin.id` (perlu cek availability + trademark) |
| **Industry** | Education / EdTech (B2C, mobile-first) |

**Kenapa "Hafalin"?**
- Verb Indonesian gen Z (suffix `-in`: nontonin, cobain, kerjain, hafalin)
- Action-oriented untuk CTA: "Mulai hafalin sekarang", "Yuk hafalin"
- Direct relation ke fungsi flashcard (recall/memorize)
- Mudah diketik, di-search, dieja
- Tidak terlalu "kantor" untuk SMP, tidak terlalu childish untuk mahasiswa
- Logo possibility: huruf "H" mark dengan mint primary

**Alternatif yang sempat dipertimbangkan:**
- *Inget* — terlalu casual, kurang action
- *Pintar* — generic, brand serupa sudah banyak
- *Catet* — lebih ke note-taking, bukan recall
- *Lentera* — terlalu sastra/serius
- *Kartuku* — terlalu literal, kurang aspirational

### 4.2 Audience & Positioning

**Target Users** (detail di [Section 2](#2-target-user)):
- Adi (SMP, gamified-prone) — primary
- Cika (mahasiswa awal, organize-prone) — primary
- Rina (mahasiswa akhir / language learner) — secondary

**Brand Personality — 3 atribut utama:**
- **Friendly** — Approachable, tidak intimidatif untuk pemula
- **Energetic** — Playful animations, vibrant palette, CTAs yang bikin semangat
- **Smart** — FSRS-backed seriousness, bukan cuma fun shell tanpa substance

**Tone & Vibe:**
- Confident but approachable — "kakak yang udah ngerti, bukan guru killer"
- Casual Indonesian dengan slang ringan ("yuk", "udah", "biar inget terus")
- Encouraging tanpa pretensius
- Hindari corporate-speak, hindari over-childish baby-talk

**Voice examples:**
- ✅ "Yuk hafalin 10 kartu hari ini, biar streak makin panjang 🔥"
- ❌ "Selamat datang. Silakan memulai sesi pembelajaran Anda." (kaku)
- ❌ "OMG kamuuu udah mau belajar?? AMAZINGGGG!!!" (childish)

### 4.3 Visual Direction

| Field | Value |
|---|---|
| **Style Preference** | Playful + Modern (Duolingo-inspired, bukan clone) |
| **Color Direction** | Mint primary `#00D4A8` + Coral accent `#FF7676` + Sun `#FFD23F` (full palette di [Section 5](#5-branding--design-system)) |
| **Typography** | Plus Jakarta Sans (Tokotype Indonesia) — single family, all weights |
| **Inspired By** | Duolingo (engagement loop), Notion (clean structure), Mochi (markdown elegance), Cakap/Bahaso (local sensibility) |

### 4.4 Constraints

**❌ AVOID:**
- Stock photos (too generic, kills authenticity)
- Hearts/lives system (Duolingo controversy, kills retention)
- Aggressive paywalls (kills trust di demografi pelajar yang budget-sensitive)
- Push notifications soal streak loss (anti-anxiety pattern)
- Cluttered UI / banyak fitur visible sekaligus
- Heavy English usage (target user: Indonesian native)
- Too "kantor"/corporate aesthetic (alienate SMP)
- Too "anak-anak"/childish (alienate mahasiswa)
- Generic AI-stock aesthetic (purple gradients on white, Inter font, dll)
- Mascot generic ala owl Duolingo (defer ke milestone 3 dengan riset proper)

**✅ MUST HAVE:**
- Plus Jakarta Sans di SEMUA text rendering
- Mint primary terlihat di setiap halaman (brand consistency)
- Bahasa Indonesia native untuk semua copy (tidak ada string English yang ke-skip)
- Mobile-first responsive (target user pakai HP)
- Streak fire icon 🔥 visible saat ada streak active
- Logo bisa jadi favicon clear di 16px
- Logo bisa monochrome (untuk receipts, B&W use cases)
- Touch targets minimum 44px (mobile accessibility)
- Animations respect `prefers-reduced-motion`

### 4.5 Use Cases

**Brand bakal dipakai di:**
- Landing page hero (`/login`)
- App icon / favicon ([app/icon.tsx](app/icon.tsx))
- Social media (Instagram, TikTok untuk launch + ongoing)
- Marketing screenshots (Play Store / App Store nanti)
- Onboarding screens (first-run experience)
- Empty states (welcoming untuk user baru)
- PR/blog launch announcements
- Loading states & error pages

**Key messages by context:**

| Context | Message |
|---|---|
| Landing hero | "Belajar sebentar, inget selamanya" |
| Landing primary CTA | "Mulai gratis sekarang" |
| Onboarding step 1 | "Bikin folder pertamamu" |
| Empty home | "Yuk hafalin 5 menit aja, gampang kok" |
| Streak milestone | "🔥 N hari berturut-turut! Lanjut!" |
| Daily goal hit | "Goal tercapai! +20 XP buat kamu ✨" |
| Card lapsed | "Gapapa, kita coba lagi 💪" |
| Session done | "Sudah selesai untuk hari ini, kerja bagus!" |
| Error generic | "Yah, ada yang salah. Coba lagi ya." |

### 4.6 Decision Log

| Item | Decision | Status |
|---|---|---|
| Brand name | "Hafalin" | 🟡 PROPOSED — perlu validate (domain, trademark, user feedback) |
| Tagline | "Belajar sebentar, inget selamanya." | 🟡 PROPOSED |
| Logo concept | "H" mark + flashcard motif, mint primary | 🟡 PROPOSED — perlu eksekusi designer |
| Mascot character | Defer ke Milestone 3 (riset dulu) | 🔴 NOT NOW |
| Color palette | Mint & Coral | ✅ CONFIRMED (sudah implement) |
| Typography | Plus Jakarta Sans | ✅ CONFIRMED (sudah implement) |
| Voice/tone style guide | Casual Indonesian, slang ringan | 🟡 DRAFT (perlu copywriter review) |

---

## 5. Branding & Design System

### Visual Identity: "Indo Youth Learning"

**Tone:** Playful, encouraging, modern. Inspirasi Duolingo tapi dengan identity Indonesia (palette berbeda, bahasa native, sensibility lokal).

### Color Palette: "Mint & Coral"

```
Primary:    #00D4A8 (mint hijau)        → CTAs, brand accent
Primary-dk: #00B891                      → Hover state
Primary-sf: #E5FBF5                      → Soft backgrounds, badges

Accent:     #FF7676 (coral merah)        → Streak fire, important alerts
Accent-dk:  #FF5252                      → Error state

Sun:        #FFD23F (kuning)             → XP highlights, achievement
Sun-soft:   #FFF7D6

Sky:        #4DB8FF (biru langit)        → Info, secondary action
Sky-soft:   #E5F4FF

Surface:    #FFFFFF                      → Card surfaces
Background: #F7F9FB (off-white cool)     → App background
BG-soft:    #EEF2F6                      → Variant card backgrounds

Ink:        #1F2937 (slate-800)          → Primary text
Ink-muted:  #6B7280                      → Secondary text
Ink-subtle: #9CA3AF                      → Tertiary text, placeholders
Ink-faint:  #D1D5DB                      → Borders

Success:    #10B981
Error:      #EF4444
```

### Typography

**Font Family:** [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (oleh Tokotype, designer Indonesia)
- Rounded sans-serif modern, identity Indonesia
- Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)
- Display + body pakai font yang sama (consistency)

**Type Scale:**
- `text-3xl` (30px, bold/extrabold) — Page hero, greeting
- `text-2xl` (24px, bold/extrabold) — Stats numbers, deck title
- `text-xl` (20px, bold) — Section heading
- `text-base` (16px, regular/medium) — Body, paragraph
- `text-sm` (14px, regular/semibold) — Labels, secondary
- `text-xs` (12px, regular) — Metadata, captions

### Iconography & Imagery

- **Icons:** Inline SVG, stroke 2px, rounded line caps. Mengikuti pola Heroicons/Lucide style
- **Emoji:** Used liberally untuk add personality (📚 📁 🔥 ⚡ 🎯 ✨)
- **No stock photos** — semua decorative pakai geometric shapes, gradients, atau emoji
- **Mascot opportunity** (future): Karakter Indonesia (e.g., burung hantu lokal "Mbah Hafal") untuk feedback character

### Motion & Microinteractions

- **`bounce-in`** animation: cubic-bezier(0.34, 1.56, 0.64, 1) untuk card entry — springy, playful
- **`pop-in`** animation: scale + fade untuk staggered list reveal
- **`flame-pulse`** animation: streak emoji bouncing
- **`btn-press`** effect: 3D button dengan shadow yang hilang saat ditekan (Duolingo-style)
- Card flip pakai `transform: rotateY(180deg)` dengan backface-visibility
- Future: confetti on streak milestone, sound effects, haptic feedback

### Radii & Shape Language

- `rounded-card` (16px) — Standard cards
- `rounded-card-lg` (24px) — Hero cards, large surfaces
- `rounded-pill` (full) — Buttons, chips, badges, search bar
- Generous rounding = friendly, modern

---

## 6. Information Architecture

### Hierarki Data

```
User
└── Folder (mandatory — "Mata Pelajaran")
    └── Deck ("Set Kartu" / "Bab")
        └── Card (FSRS-tracked)
            └── Reviews (subcollection — riwayat rating)
```

**Note pada terminologi:** Saat ini code masih pakai "Folder" / "Deck" / "Card". Future label dapat di-rename ke "Mata Pelajaran" / "Set" / "Kartu" untuk lebih relate dengan target user pelajar — defer sampai user feedback mengkonfirmasi.

### Navigasi

**Bottom Nav (mobile) + Sidebar (desktop) — 4 tab:**

| Icon | Label | Route | Fungsi |
|---|---|---|---|
| 🏠 | **Beranda** | `/` | Home page — streak, daily goal, continue learning, folder grid, daily quests |
| 📁 | **Folder** | `/decks` | Folder list dengan search bar terintegrasi (filter by name/desc) |
| 📊 | **Progres** | `/stats` | Statistik belajar — total folder/deck/kartu, streak history, top folders |
| 👤 | **Profil** | `/profile` | Akun info, settings, logout, future: daily goal config, streak freeze |

**Sub-routes (tidak di nav):**

- `/folders/new` — Buat folder baru
- `/folders/[id]` — Detail folder (list deck di dalamnya)
- `/folders/[id]/edit` — Edit folder
- `/decks/new?folderId=X` — Buat deck baru di folder X
- `/decks/[id]` — Detail deck (list kartu)
- `/decks/[id]/edit` — Edit deck (rename, pindah folder, tambah/edit/hapus kartu)
- `/decks/[id]/study` — Study mode (FSRS-driven)
- `/search?q=X` — Global search across all decks (advanced)
- `/login` — Auth (email/password + Google OAuth)
- `/privacy`, `/terms` — Legal pages (untuk launch publik)

---

## 7. Core Features (MVP — Milestone 1)

### 6.1 Auth & User

- Firebase Auth: email/password + Google OAuth
- Session via httpOnly cookie (5 hari expiry)
- Auto-create `users/{uid}` document on first study action
- Logout dari /profile

### 6.2 Folder Management (CRUD)

- **Create:** Form dengan nama (required, max 100 char) + deskripsi (optional, max 500 char)
- **Update:** Edit metadata
- **Delete:** **Cascade delete** — semua deck + kartu di dalamnya ikut terhapus (dengan konfirmasi)
- **Folder = MANDATORY** — semua deck harus dalam folder

### 6.3 Deck Management (CRUD)

- **Create:** Form dengan title (required, max 255 char) + deskripsi + cards inline editor
- **Update:** Edit metadata, **pindah folder** via dropdown, tambah/edit/hapus kartu
- **Delete:** Cascade delete cards, decrement folder.deckCount
- **Critical:** `updateDeck` preserve FSRS state — diff-based update by card id (NOT delete-and-recreate)

### 6.4 Card Management & Bulk Import

- **Manual Entry:** Inline editor dengan Tab/Enter shortcuts
- **Bulk Import:** Upload CSV atau paste tab/comma-separated text
- **Specification:**
  - Format: CSV/TSV
  - Encoding: UTF-8
  - Header: `soal,jawaban`
  - Max 200 cards per import
  - Auto-sanitize formula prefixes (`=`, `+`, `-`, `@`)
- **Validation:** Field `soal` dan `jawaban` wajib non-empty

```csv
soal,jawaban
"What is React?","A JS library for UI."
"Define State","Data that changes over time."
```

### 6.5 Study Mode (FSRS-5 Engine)

- **Algoritma:** FSRS-5 via [`ts-fsrs`](https://github.com/open-spaced-repetition/ts-fsrs) library
- **Default config:** `request_retention: 0.9` (Anki standard)
- **Card states:** `new` / `learning` / `review` / `relearning`
- **UX:** Vertical scroll-snap atau controlled queue dengan flip animation
- **Rating buttons** (after card flip): 4 tombol floating bar di bawah
  - **Lagi** (coral) — < 10 menit
  - **Susah** (sun) — < 1 hari
  - **Bagus** (mint) — interval dynamic
  - **Mudah** (sky) — interval dynamic
  - Subtle interval text di bawah label
- **Queue building:** Cards dengan `due <= now`, sorted by `due asc`, max 50 per session
- **Lapse handling:** Failed cards (rating "Lagi") di-queue ke "Kartu Sulit" mini-section di akhir, max 5
- **Daily limits:** 20 new cards/day default, 200 reviews/day default

### 6.6 Content Rendering

- **Markdown:** Headers, bold, italic, code, code blocks, lists, tables, links, blockquotes
  - Library: `react-markdown` + `remark-gfm`
  - **XSS protection:** `rehype-sanitize` + URL scheme allowlist
- **LaTeX (Phase 2):** Inline `$x^2$` dan block `$$\int$$`
  - Library: `remark-math` + `rehype-katex`
  - **Lazy-loaded** via `next/dynamic` — hanya di-load kalau card mengandung syntax `$...$`
  - Hardening: `trust: false`, `maxExpand: 1000`, `maxSize: 50`
- **Cloze deletion (Phase 2):** Anki-style syntax `{{c1::text}}` dan `{{c1::text::hint}}`
  - Multi-cloze: `{{c1::A}} {{c2::B}}` generate 1 kartu (MVP simplification, satu FSRS state per kartu)
  - Markdown escape pada substitution untuk cegah injection

### 6.7 Engagement Layer (Phase 2)

#### Streak System
- **Daily streak counter** dengan emoji 🔥
- **Reset rule:** Skip 1 hari penuh = streak reset (forgiving — gak peduli apakah goal tercapai)
- **Anti-anxiety patterns:**
  - Tidak ada push notification streak loss
  - Hide counter saat streak < 7 hari
  - Streak freeze: auto-grant 1 free skip per 7-day streak earned
- **Server-computed `todayDate`** dari user timezone (cegah TZ inflation attack)

#### XP & Daily Goal
- Default daily goal: **10 kartu/hari** (hardcoded MVP, configurable v1.1)
- XP earned: 2 XP per kartu, +20 XP bonus saat goal tercapai
- Progress bar visible di home page
- Daily quests (placeholder UI, full logic v1.1)

#### Stats Page
- Counter: total folder, deck, kartu (existing)
- Future: streak heatmap, XP graph, milestones unlocked

### 6.8 Search

- **Integrated** ke halaman Folder (`/decks`) sebagai search bar pill di atas
- Filter folder by name/description
- Cross-deck search global di `/search?q=X` (accessible via search bar dengan kata kunci)

---

## 8. Technical Architecture

### Stack

| Layer | Technology | Version |
|---|---|---|
| **Framework** | Next.js (App Router + Server Actions) | 16.2.4 |
| **Runtime** | React | 19.2.4 |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS | 4.x |
| **Database** | Firestore (Firebase) | Admin SDK 13.8 + Web SDK 12.12 |
| **Auth** | Firebase Auth | (above) |
| **SRS Algorithm** | ts-fsrs (FSRS-5) | 5.3.2 |
| **Markdown** | react-markdown + remark-gfm + rehype-sanitize | 10.1 / 4.0 / 6.0 |
| **LaTeX (P2)** | katex + remark-math + rehype-katex | TBD |
| **CSV** | papaparse | 5.5 |
| **Validation** | zod | 4.3 |
| **Hosting** | Vercel | (deployment target) |

### Data Model (Firestore)

```
users/{uid}                              // Profile + engagement state
  ├── email, timezone
  ├── currentStreak, longestStreak, lastStudyDate
  ├── dailyGoal, cardsStudiedToday, streakFreezes
  └── createdAt, updatedAt

users/{uid}/folders/{folderId}
  ├── name, description, userId, deckCount
  └── createdAt, updatedAt

users/{uid}/decks/{deckId}
  ├── title, description, userId, folderId, cardCount
  └── createdAt, updatedAt

users/{uid}/decks/{deckId}/cards/{cardId}
  ├── soal, jawaban, order
  ├── state: 'new'|'learning'|'review'|'relearning'   ← Explicit, not lazy
  ├── due, stability, difficulty, reps, lapses        ← FSRS state (optional jika 'new')
  ├── elapsedDays, scheduledDays, lastReview
  └── createdAt, updatedAt

users/{uid}/decks/{deckId}/cards/{cardId}/reviews/{reviewId}  // Phase 2
  ├── rating, log
  └── createdAt
```

### Firestore Indexes

Defined di `firestore.indexes.json`:
1. `decks` collection: `folderId ASC + createdAt DESC` (per-folder deck list)
2. `cards` collection group: `userId ASC + due ASC` (cross-deck due queue)
3. `cards` collection group: `userId ASC + state ASC` (filter by state)

### Security Rules

Defined di `firestore.rules`:
- All user data scoped to `users/{request.auth.uid}/...`
- Anti-tamper: client cannot increase `currentStreak` by more than 1 per write
- Account deletion only via server action (admin SDK bypasses rules)

### Atomicity Patterns

- **Critical:** All mutations affecting multiple documents wrapped in `runTransaction()` — terutama `rateCard` (review + streak + counter)
- **Idempotency:** `rateCard` accepts client-generated `reviewId` UUID; duplicate writes return cached result
- **Optimistic concurrency:** `rateCard` checks `expectedReps` to detect multi-tab races

### Server-Side Computed Values

- `todayDate` computed from stored user timezone via `Intl.DateTimeFormat('en-CA', { timeZone })` — cegah client manipulating clock
- `updatedAt` pakai `FieldValue.serverTimestamp()` — cegah clock drift

---

## 9. Engagement Mechanics

### Streak Rules

| Event | Effect |
|---|---|
| User review card hari ini (any deck) | Update `lastStudyDate`, increment `cardsStudiedToday` |
| Hari ini = lastStudyDate | No streak change |
| Hari ini = lastStudyDate + 1 day | `currentStreak += 1`, `longestStreak = max(...)` |
| Skip ≥ 1 hari | `currentStreak = 1` (reset) |
| Hit 7-day streak milestone | Auto-grant `streakFreezes += 1` |

### XP Earning

| Action | XP |
|---|---|
| Review 1 kartu | +2 XP |
| Reach daily goal | +20 XP bonus |
| Complete daily quest | Per-quest XP (10-30) |
| Streak milestone (7, 30, 100 hari) | +100 XP each |

### Daily Quests (Placeholder logic — full UI in v1.1)

- Selesaikan N kartu hari ini
- Belajar minimum X menit
- Review semua kartu di Y deck
- Coba bahan baru (deck yang belum dipelajari)

### Anti-Anxiety Patterns

- ❌ NO push notification streak loss
- ✅ Hide streak counter saat < 7 hari (reduce early pressure)
- ✅ Streak freeze auto-grant
- ✅ Daily goal modest (10 kartu, lebih ringan dari Anki default 20)
- ✅ Tidak ada heart/energy system (vs Duolingo controversial pattern)

---

## 10. Roadmap

### Milestone 1: MVP Launch (Target: 16 Mei 2026)

**Phase 1 — Week 1 (sudah on track):**
- [x] Database migration ke Firestore (sebelumnya Prisma/SQLite)
- [x] Folder hierarchy implementation
- [x] Search page + integration ke Folder
- [x] Mint & Coral design system
- [x] Plus Jakarta Sans typography
- [x] Home page (Duolingo-vibe)
- [x] 4-tab navigation (Beranda/Folder/Progres/Profil)
- [x] FSRS schema foundation (types, scheduler, timezone util)
- [x] Critical updateDeck refactor (FSRS state preservation)
- [x] Firestore security rules + indexes committed
- [ ] FSRS service layer + study action (Day 3)
- [ ] StudyCarousel rework dengan rating buttons (Day 3)
- [ ] Markdown rendering (Day 4)
- [ ] Streak data model (Day 4)

**Phase 2 — Week 2:**
- [ ] LaTeX rendering (lazy-loaded)
- [ ] Cloze deletion system
- [ ] Streak UI + daily goal progress
- [ ] Lapse handling (Tough Cards mini-section)
- [ ] Account deletion + privacy policy
- [ ] Production deploy + launch publik

### Milestone 2: Engagement & AI (Q3 2026)

- AI card generation (Claude API) — paste teks/PDF → flashcards
- Public deck sharing dengan link
- Full daily quests system + XP shop
- Profile settings (daily goal config, theme)
- PWA + Firestore offline persistence

### Milestone 3: Multimedia & Social (Q4 2026)

- Image cards / image occlusion
- Audio cards (TTS auto-generate)
- Friends system + leaderboard mingguan
- Stripe premium tier (advanced features)
- Native mobile wrapper (Capacitor)

---

## 11. Pricing & Monetization

### Launch (MVP — Milestone 1)
- **100% gratis** semua fitur
- Fokus: growth + validasi product-market fit
- Tidak ada Stripe integration

### Post-Launch (Milestone 2+)
- Tetap free tier generous
- Premium tier (~Rp 25k/bulan):
  - Unlimited folder + deck
  - AI card generation (rate limit untuk free)
  - Cloud backup + sync ke multiple device
  - Themes / customization
  - Priority support

### Tidak akan dipakai
- Ads-based model (jelek untuk learning context)
- Heart/energy paywall (Duolingo controversy)
- Paywall fitur core SRS

---

## 12. Out of Scope (MVP)

Untuk maintain focus 2-minggu launch, hal-hal berikut **TIDAK** dibangun:

- ❌ AI card generation (defer M2)
- ❌ Public deck sharing (defer M2)
- ❌ Image cards / image occlusion (defer M3)
- ❌ Audio TTS (defer M3)
- ❌ Friends / social / leaderboard (defer M3)
- ❌ Native iOS/Android app (defer M3)
- ❌ Stripe payment integration (defer M2+)
- ❌ Heavy gamification (XP shop, hearts, gems beyond placeholder)
- ❌ Konfigurabel FSRS weights (advanced setting, defer)
- ❌ Custom card templates (defer)
- ❌ Mascot character (opportunity, defer)
- ❌ Push notifications (intentional anti-anxiety)
- ❌ Multi-language interface (Indonesian only di MVP)

---

## 13. Risks & Open Questions

### Known Risks (per [deepen-plan review](docs/plans/2026-05-02-001-feat-fsrs-content-streaks-plan.md))

| Risk | Mitigation |
|---|---|
| FSRS state corruption multi-tab | `runTransaction` + optimistic concurrency (`expectedReps`) |
| Streak inflation via TZ manipulation | Server-compute `todayDate`, validate IANA whitelist |
| Markdown XSS | `rehype-sanitize` + URL scheme allowlist + CSP header |
| Bundle size > 250KB | Conditional KaTeX loading, server-render markdown |
| Privacy violation (no GDPR controls) | `deleteAccount` action + `/privacy` page sebelum launch |

### Open Questions

- Apakah perlu dark mode untuk MVP? (Current bias: defer ke v1.1)
- Bahasa interface: Indonesian only atau Indonesian + English toggle? (Current: ID only)
- Mascot character apa yang fit dengan brand? (Future brainstorm)
- Apakah perlu rename "Folder/Deck" → "Mata Pelajaran/Set"? (Wait for user feedback)

---

## 14. Success Metrics (Post-Launch)

### Product KPIs (30 hari)

| Metric | Target | Cara measure |
|---|---|---|
| **D7 retention** | > 25% | Firebase Analytics |
| **Median streak** | ≥ 3 hari | Aggregate from `users/{uid}` |
| **Cards reviewed/user/day** | ≥ 8 | Sum `cardsStudiedToday` |
| **Session length** | ≥ 5 menit median | Time between first/last `rateCard` |
| **FSRS efficacy** | < 15% rating "Lagi" | Aggregate after 2 minggu |
| **Onboarding completion** | > 60% | Users yang bikin folder + deck pertama |

### Technical KPIs

| Metric | Target |
|---|---|
| Study page initial JS | < 250KB |
| FSRS calculation | < 50ms |
| Card review API roundtrip | < 500ms p95 |
| First Contentful Paint | < 1.5s |
| Crash rate | < 0.1% |

---

## 15. References

### Internal Documents
- **Plan implementation:** [docs/plans/2026-05-02-001-feat-fsrs-content-streaks-plan.md](docs/plans/2026-05-02-001-feat-fsrs-content-streaks-plan.md)
- **Brainstorm 2026-05-02:** [docs/brainstorms/2026-05-02-app-improvements-brainstorm.md](docs/brainstorms/2026-05-02-app-improvements-brainstorm.md)
- **Brainstorm 2026-04-25 (original MVP):** [docs/brainstorms/2026-04-25-mobile-first-flashcard-brainstorm.md](docs/brainstorms/2026-04-25-mobile-first-flashcard-brainstorm.md)

### External References
- [ts-fsrs library](https://github.com/open-spaced-repetition/ts-fsrs)
- [FSRS algorithm explanation](https://expertium.github.io/Algorithm.html)
- [Plus Jakarta Sans (Tokotype)](https://github.com/tokotype/PlusJakartaSans)
- [Duolingo design language analysis](https://uxmag.com/articles/the-psychology-of-hot-streak-game-design-how-to-keep-players-coming-back-every-day-without-shame)
- [Anki cloze deletion spec](https://docs.ankiweb.net/editing.html#cloze-deletion)

---

**Versi sebelumnya:** v1.0 (2026-04-25) — "Quiet Luxury minimalist" aesthetic, Prisma+PostgreSQL stack. Pivoted di v2.0 setelah brainstorm target user dan riset kompetitor (Duolingo).
