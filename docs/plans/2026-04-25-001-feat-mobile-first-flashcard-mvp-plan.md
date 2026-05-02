---
title: "feat: Build Mobile-First Flashcard MVP"
type: feat
status: active
date: 2026-04-25
deepened: 2026-04-25
origin: docs/brainstorms/2026-04-25-mobile-first-flashcard-brainstorm.md
---

# feat: Build Mobile-First Flashcard MVP

## Enhancement Summary

**Deepened on:** 2026-04-25  
**Research agents used:** architecture-strategist, security-sentinel, data-integrity-guardian, julik-frontend-races-reviewer, kieran-typescript-reviewer, performance-oracle, code-simplicity-reviewer, best-practices-researcher (×2)

### Key Improvements Discovered

1. **Schema hardening:** Switch `cuid()` → `uuid()` with `@db.Uuid`; add `@db.VarChar(255)` on title; add `@@unique([deckId, order])`; raw SQL FK to `auth.users`
2. **Security gaps:** Missing Zod validation on Server Actions (HIGH); missing deck ownership check before `card.create` (HIGH); CSV formula injection (MEDIUM)
3. **Race condition fixes:** `setCards(prev => ...)` functional updater; `isSubmitting` guard on ImportModal; IntersectionObserver for progress tracking; shuffle guard during scroll
4. **Performance:** Dynamic import papaparse; virtual 5-card sliding window for StudyCarousel; `contain: strict`; `touch-action: pan-y`
5. **Simplification:** 6 files eliminated (DeckGrid, Modal wrapper, DeckForm extract, supabase/middleware.ts, split csv utils)
6. **Architecture:** Auth callback outside route groups; edit pages as Server Components; `components/layout/` for nav; `lib/types.ts` for Prisma payload types

---

## Overview

Bangun aplikasi flashcard web dari scratch — responsive, mobile-first, "Quiet Luxury" aesthetic — di atas scaffold Next.js 16.2.4 yang sudah ada. User login via Supabase Auth, membuat deck, menambah kartu (manual + paste-import Quizlet-style), dan belajar via study mode vertical scroll dengan flip animation.

Stack: Next.js 16.2.4 App Router · React 19 · Supabase Auth + PostgreSQL · Prisma ORM · Tailwind v4 · papaparse

---

## Problem Statement / Motivation

User ingin alat belajar yang:
- Terasa native di HP dan tablet (bukan "desktop yang dishrink")
- Tidak butuh install — buka browser langsung bisa belajar
- Input kartu cepat: paste dari spreadsheet atau ketik satu per satu
- Desain tidak mengalihkan perhatian dari materi belajar

(see brainstorm: docs/brainstorms/2026-04-25-mobile-first-flashcard-brainstorm.md)

---

## Proposed Solution

Responsive web app dengan layout adaptif: **bottom tab bar di mobile (< 768px)** dan **sidebar di tablet/desktop (≥ 768px)**. Study mode menggunakan CSS `scroll-snap` vertikal + pure CSS 3D flip — tidak ada library animasi berat. Card creation mengikuti pola Quizlet: live inline list + keyboard shortcuts + import modal.

---

## Technical Approach

### Architecture & Directory Structure

> Disederhanakan berdasarkan YAGNI review: 6 file dieliminasi. Auth callback di luar route groups. Nav components dipindah ke `layout/`.

```
app/
├── auth/
│   └── callback/
│       └── route.ts              # Supabase callback — LUAR route groups (URL: /auth/callback)
├── (auth)/
│   └── login/
│       └── page.tsx              # Email magic link login
├── (app)/
│   ├── layout.tsx                # Auth guard + responsive nav wrapper
│   ├── decks/
│   │   ├── page.tsx              # Deck list — Server Component
│   │   ├── new/
│   │   │   └── page.tsx          # Create deck — Server Component + Client form inline
│   │   └── [id]/
│   │       ├── page.tsx          # Deck detail — Server Component
│   │       ├── study/
│   │       │   └── page.tsx      # Study mode — Server Component (fetch) + Client carousel
│   │       └── edit/
│   │           └── page.tsx      # Edit deck — Server Component (fetch) + Client form
├── globals.css                   # Tailwind v4 @theme tokens
├── layout.tsx                    # Root layout (fonts, metadata, viewport)
└── page.tsx                      # Redirect ke /decks

components/
├── layout/                       # Nav shells — bukan UI primitives
│   ├── BottomNav.tsx
│   └── Sidebar.tsx
├── ui/
│   ├── Button.tsx
│   └── ConfirmDialog.tsx         # Inline HTML dialog, no Modal wrapper needed
├── decks/
│   └── DeckCard.tsx              # Single deck card (reused in list map)
├── cards/
│   ├── CardEditorRow.tsx         # Single soal/jawaban input row
│   ├── CardLiveList.tsx          # Live list di bawah form
│   ├── ImportModal.tsx           # Paste text + CSV — inline dialog markup
│   └── FlashCard.tsx             # Study mode card dengan 3D flip
└── study/
    ├── StudyCarousel.tsx         # Virtual 5-card sliding window
    └── ProgressBadge.tsx         # "5 / 20" floating indicator

lib/
├── supabase/
│   ├── client.ts                 # createBrowserClient
│   └── server.ts                 # createServerClient
├── prisma.ts                     # Prisma singleton
├── types.ts                      # Prisma payload type aliases
├── schemas/
│   ├── deck.schema.ts            # Zod: CreateDeckSchema, UpdateDeckSchema
│   └── card.schema.ts            # Zod: BulkCreateCardsSchema
├── actions/
│   ├── deck.actions.ts           # Server Actions: createDeck, updateDeck, deleteDeck
│   └── card.actions.ts           # Server Actions: bulkUpsertCards, deleteCard
└── utils/
    └── import.ts                 # Merged: papaparse + text-paste parser + validator

prisma/
└── schema.prisma

middleware.ts                     # Auth session refresh + route protection (Supabase inline)
.env.local
```

> **Removed vs original plan:** `components/ui/Modal.tsx` (inline), `components/decks/DeckGrid.tsx` (inline map), `components/decks/DeckForm.tsx` (inline di page), `lib/supabase/middleware.ts` (inline di middleware.ts), `lib/utils/csv.ts` + `text-import.ts` (merged ke `import.ts`)

---

### Database Schema (Prisma)

> Hardened berdasarkan data integrity review: uuid, VarChar, unique order constraint, manual FK.

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")   // pooled via Supavisor port 6543
  directUrl = env("DIRECT_URL")     // direct port 5432 untuk migrations
}

model Deck {
  id          String   @id @default(uuid()) @db.Uuid
  title       String   @db.VarChar(255)
  description String?  @db.Text
  userId      String   @db.Uuid
  cards       Card[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
  @@index([userId, createdAt])
  // @@unique([userId, title])  // uncomment jika ingin prevent duplicate titles per user
}

model Card {
  id        String   @id @default(uuid()) @db.Uuid
  soal      String   @db.Text
  jawaban   String   @db.Text
  order     Int      @default(0)
  deckId    String   @db.Uuid
  deck      Deck     @relation(fields: [deckId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([deckId, order])          // prevent duplicate order within deck
  @@index([deckId])
}
```

#### Manual Migration: FK ke auth.users

> Supabase mengelola `auth.users` di skema terpisah — Prisma tidak bisa mendefinisikan FK ini. Tambahkan sebagai manual migration SQL.

```sql
-- prisma/migrations/XXXXXX_add_user_fk/migration.sql (tambahkan manual)
ALTER TABLE "Deck"
  ADD CONSTRAINT fk_deck_user
  FOREIGN KEY ("userId") REFERENCES auth.users(id)
  ON DELETE CASCADE;
```

Ini memastikan ketika user dihapus di Supabase Auth, semua deck-nya ikut terhapus (orphan prevention).

#### ERD

```mermaid
erDiagram
    AUTH_USERS {
        uuid id PK
        string email
    }
    DECK {
        uuid id PK
        varchar255 title
        text description
        uuid userId FK
        datetime createdAt
        datetime updatedAt
    }
    CARD {
        uuid id PK
        text soal
        text jawaban
        int order
        uuid deckId FK
        datetime createdAt
        datetime updatedAt
    }
    AUTH_USERS ||--o{ DECK : "owns"
    DECK ||--o{ CARD : "contains"
```

---

### Environment Variables (`.env.local`)

```env
# Supabase — anon key aman di client (NEXT_PUBLIC_*)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Prisma — dua URL wajib untuk Supabase + Supavisor
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

> ⚠️ Jangan pernah tambahkan `NEXT_PUBLIC_` prefix ke `DATABASE_URL` atau `DIRECT_URL`.

---

### Design System Patterns

#### Typography

```css
/* Body / card text */
font-size: 16px;          /* minimum — mencegah iOS auto-zoom */
line-height: 1.6;
letter-spacing: -0.01em;  /* slight tightening = premium feel */

/* Secondary / metadata */
font-size: 13px;
line-height: 1.5;
letter-spacing: 0.01em;

/* Display / deck title — pakai Instrument Serif (Google Fonts) untuk warmth */
font-size: 28px;
line-height: 1.2;
letter-spacing: -0.02em;
font-weight: 400;          /* serif richer di regular weight */
```

Font pairing: **Inter** (body + UI) + **Instrument Serif** (deck titles, empty state headlines). Instrument Serif hanya untuk large display — jangan di body text.

#### Flashcard Shadow (di atas cream background)

```css
/* Resting card — layered, low-opacity (bukan harsh shadow) */
.flashcard {
  box-shadow:
    0 1px 2px rgba(26, 26, 26, 0.04),
    0 4px 12px rgba(26, 26, 26, 0.06);
  border-radius: 12px;
  border: 1px solid rgba(26, 26, 26, 0.07);
  padding: 32px 28px;
}
/* Hover/focus lift */
.flashcard:focus-visible {
  box-shadow:
    0 2px 4px rgba(26, 26, 26, 0.05),
    0 8px 24px rgba(26, 26, 26, 0.10);
  transform: translateY(-2px);
}
```

Tidak ada colored shadows. `border-radius: 12px` — 8px terlalu utilitarian, 16px+ terlalu playful.

#### Skeleton Loading — Pulse (bukan shimmer)

```css
/* Quiet luxury: pulse, bukan shimmer/gradient moving */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}
.skeleton {
  background: #E8E3D8;  /* antara cream dan cream-dark */
  border-radius: 6px;
  animation: pulse 1.6s ease-in-out infinite;
}
```

Shimmer (moving gradient) terlalu noisy dan terasa murah di atas cream. Pulse lebih tenang.

#### Deck List Layout (375px mobile)

Single-column list (bukan grid) di mobile. Grid pada lebar 375px memaksa kartu sempit dan truncate judul.

```css
/* Deck list item */
.deck-item {
  height: 72px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #E8E3D8;
}
/* gap between items */
.deck-list { gap: 0; }  /* border-bottom sudah jadi separator */
```

#### Empty State

Text-only, tanpa ilustrasi (ilustrasi terasa "consumer app"):
- Headline: Instrument Serif, 22px, ink color
- Subtext: Inter, 14px, ink-muted
- CTA: text link bergaris bawah atau ghost button — bukan filled primary button

#### Mobile Keyboard Handling (CardEditorRow)

`env(keyboard-inset-height)` tidak reliable di 2026. Gunakan VisualViewport API:

```ts
// Untuk CardEditorRow — ensure visible above keyboard
useEffect(() => {
  const handler = () => {
    const keyboardHeight = window.innerHeight - (window.visualViewport?.height ?? window.innerHeight)
    document.documentElement.style.setProperty('--keyboard-height', `${keyboardHeight}px`)
  }
  window.visualViewport?.addEventListener('resize', handler)
  return () => window.visualViewport?.removeEventListener('resize', handler)
}, [])
```

```css
.card-live-list {
  padding-bottom: max(env(safe-area-inset-bottom), var(--keyboard-height, 0px));
}
```

---

### Tailwind v4 Design Tokens (`app/globals.css`)

```css
@import "tailwindcss";

@theme inline {
  /* Quiet Luxury Palette */
  --color-cream:       #FAFAF7;
  --color-cream-dark:  #F0EBE0;
  --color-ink:         #1A1A1A;    /* WCAG AA ratio vs cream: ~17:1 ✓ */
  --color-ink-muted:   #6B6B6B;    /* WCAG AA ratio vs cream: ~5.7:1 ✓ */
  --color-ink-subtle:  #C4C4C4;    /* Only for decorative, NOT body text */
  --color-surface:     #FFFFFF;

  /* Typography — Inter body + Instrument Serif display */
  --font-sans:    "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Instrument Serif", Georgia, serif;

  /* Spacing tokens */
  --radius-card: 1rem;
  --radius-btn:  0.5rem;
}

/* Reduced motion — disable flip animation */
@media (prefers-reduced-motion: reduce) {
  .card-inner { transition: none; }
}
```

> **WCAG AA:** ink (#1A1A1A) vs cream (#FAFAF7) = ~17:1 ✓. ink-muted (#6B6B6B) vs cream = ~5.7:1 ✓. ink-subtle (#C4C4C4) = hanya untuk dekoratif.

---

### TypeScript: Shared Types (`lib/types.ts`)

```ts
// lib/types.ts — Prisma payload type aliases
import type { Prisma } from '@prisma/client'

export type DeckWithCount = Prisma.DeckGetPayload<{
  include: { _count: { select: { cards: true } } }
}>

export type DeckWithCards = Prisma.DeckGetPayload<{
  include: { cards: { orderBy: { order: 'asc' } } }
}>

// Typed result untuk Server Actions
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }
```

---

### Zod Schemas (`lib/schemas/`)

```ts
// lib/schemas/deck.schema.ts
import { z } from 'zod'

export const CreateDeckSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi').max(255).trim(),
  description: z.string().max(1000).trim().optional(),
})

export const UpdateDeckSchema = CreateDeckSchema

// lib/schemas/card.schema.ts
export const CardSchema = z.object({
  soal: z.string().min(1, 'Soal wajib diisi').max(5000).trim(),
  jawaban: z.string().min(1, 'Jawaban wajib diisi').max(5000).trim(),
  order: z.number().int().nonneg(),
})

export const BulkCreateCardsSchema = z
  .array(CardSchema)
  .min(1)
  .max(200, 'Maksimal 200 kartu per import')
```

---

### Supabase Auth Setup

```ts
// lib/supabase/client.ts
'use client'
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  // @supabase/ssr defaults to PKCE flow — no additional config needed
)

// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cs) =>
          cs.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          ),
      },
    }
  )
}
```

```ts
// middleware.ts — Supabase helper inline (tidak perlu lib/supabase/middleware.ts)
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cs) => cs.forEach((c) => response.cookies.set(c)),
      },
    }
  )

  // ALWAYS getUser(), bukan getSession() — getSession() tidak validasi ke Supabase
  const { data: { user } } = await supabase.auth.getUser()

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login')
  const isCallback = request.nextUrl.pathname.startsWith('/auth/callback')

  if (!user && !isAuthRoute && !isCallback) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

---

### Prisma Singleton (`lib/prisma.ts`)

```ts
import { PrismaClient } from '@prisma/client'

// eslint-disable-next-line no-var
declare global { var prisma: PrismaClient | undefined }

export const prisma = global.prisma ?? new PrismaClient()

// Guard: prevent exhausting connections on HMR in development
if (process.env.NODE_ENV !== 'production') global.prisma = prisma
```

---

### Server Actions (`lib/actions/deck.actions.ts`)

```ts
'use server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { CreateDeckSchema } from '@/lib/schemas/deck.schema'
import { BulkCreateCardsSchema } from '@/lib/schemas/card.schema'
import { revalidatePath } from 'next/cache'
import type { ActionResult, DeckWithCards } from '@/lib/types'

export async function createDeck(
  formData: FormData,
  rawCards: unknown[]
): Promise<ActionResult<DeckWithCards>> {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  // Validate — never trust client input
  const deckParsed = CreateDeckSchema.safeParse(Object.fromEntries(formData))
  if (!deckParsed.success)
    return { success: false, error: deckParsed.error.flatten().toString() }

  const cardsParsed = BulkCreateCardsSchema.safeParse(rawCards)
  if (!cardsParsed.success)
    return { success: false, error: 'Kartu tidak valid' }

  // Atomic: deck + cards dalam satu transaksi
  const deck = await prisma.$transaction(async (tx) => {
    const newDeck = await tx.deck.create({
      data: { ...deckParsed.data, userId: user.id },
    })
    if (cardsParsed.data.length > 0) {
      await tx.card.createMany({
        data: cardsParsed.data.map((c) => ({ ...c, deckId: newDeck.id })),
      })
    }
    return tx.deck.findUnique({
      where: { id: newDeck.id },
      include: { cards: { orderBy: { order: 'asc' } } },
    })
  })

  revalidatePath('/decks')   // BEFORE any redirect — never after
  return { success: true, data: deck! }
}

// IDOR-safe delete: verifikasi userId sebelum hapus
export async function deleteDeck(deckId: string): Promise<ActionResult<void>> {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const deck = await prisma.deck.findFirst({ where: { id: deckId, userId: user.id } })
  if (!deck) return { success: false, error: 'Not found' }

  await prisma.deck.delete({ where: { id: deckId } })
  revalidatePath('/decks')
  return { success: true, data: undefined }
}
```

---

### Key Component Implementations

#### CSS Card Flip (`components/cards/FlashCard.tsx`)

```tsx
// Pure CSS 3D flip — no library
// touch-action: manipulation prevents 300ms tap delay on iOS
```

```css
.card-container {
  perspective: 1000px;
  touch-action: manipulation;   /* eliminate 300ms tap delay */
}
.card-inner {
  transform-style: preserve-3d;
  transition: transform 0.45s ease;
  will-change: transform;       /* hint GPU — remove after transition ends */
}
.card-inner.flipped { transform: rotateY(180deg); }
.card-front, .card-back {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;  /* Safari still needs prefix */
}
.card-back { transform: rotateY(180deg); }
```

#### Study Carousel — Virtual Window (`components/study/StudyCarousel.tsx`)

```tsx
// Render hanya 5 kartu (2 sebelum, current, 2 sesudah) — bukan semua 200 DOM nodes
// Gunakan IntersectionObserver untuk progress tracking — bukan onScroll (60fps setState jank)
```

```css
.scroll-container {
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  height: 100dvh;               /* dynamic viewport height — address bar aware */
  overscroll-behavior: contain; /* prevent pull-to-refresh conflict */
  touch-action: pan-y;          /* allow vertical pan, prevent gesture hijack */
  contain: strict;              /* paint boundary — reduces repaint scope on scroll */
}
.card-snap-item {
  scroll-snap-align: start;
  scroll-snap-stop: always;     /* user must stop at each card, no skip */
  height: 100dvh;
  min-height: -webkit-fill-available;  /* iOS Safari fallback */
}
```

```tsx
// Tracking progress dengan IntersectionObserver (bukan onScroll)
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        currentIndexRef.current = Number(entry.target.dataset.index)
        setDisplayIndex(currentIndexRef.current) // state hanya untuk display
      }
    })
  },
  { threshold: 0.6 }
)
```

#### Import Utils (`lib/utils/import.ts`)

```ts
// Merged: CSV file upload + paste text dalam satu file
// Dynamic import papaparse — tidak di initial bundle

export async function parseImportText(
  text: string,
  delimiter: 'tab' | 'comma' | 'auto' = 'auto'
): Promise<{ cards: CardInput[]; errors: string[] }> {
  // Auto-detect: tab jika ada \t, otherwise comma
  const sep = delimiter === 'auto'
    ? (text.includes('\t') ? '\t' : ',')
    : delimiter === 'tab' ? '\t' : ','

  // Sanitize formula injection: strip leading =, +, -, @ dari setiap field
  const sanitize = (s: string) => s.replace(/^[=+\-@]/, '')

  // ... parse rows, validate non-empty, return up to 200
}

export async function parseCsvFile(
  file: File
): Promise<{ cards: CardInput[]; errors: string[] }> {
  const Papa = await import('papaparse') // lazy load — hanya saat user buka ImportModal
  return new Promise((resolve) => {
    Papa.default.parse<{ soal: string; jawaban: string }>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // validate + sanitize + cap at 200
      },
    })
  })
}
```

#### CardLiveList Race Condition Fix

```tsx
// BENAR: functional updater — tidak close over stale state
const addCard = (card: CardInput) => {
  setCards(prev => [...prev, { ...card, order: prev.length }])
}

// SALAH (jangan lakukan):
// setCards([...cards, card])  // cards bisa stale jika 2 keystrokes dalam 1 render frame
```

#### ImportModal Double-Submit Prevention

```tsx
const [isSubmitting, setIsSubmitting] = useState(false)

const handleConfirm = async () => {
  if (isSubmitting) return
  setIsSubmitting(true)
  try {
    await onImport(parsedCards)
  } finally {
    setIsSubmitting(false)  // selalu reset, bahkan saat error
  }
}
```

---

## Implementation Phases

### Phase 1: Foundation & Auth (Est. 2–3 jam)

**Tasks:**
- [ ] Install dependencies: `npm install @supabase/ssr @supabase/supabase-js prisma @prisma/client papaparse @types/papaparse zod`
- [ ] `npx prisma init` → tulis `prisma/schema.prisma` dengan schema yang sudah diperbarui (uuid, VarChar, @@unique)
- [ ] Setup `.env.local` dengan Supabase + Prisma URLs
- [ ] `npx prisma migrate dev --name init` → push schema ke Supabase
- [ ] Tambahkan manual migration SQL untuk FK ke `auth.users`
- [ ] Buat `lib/supabase/client.ts` + `lib/supabase/server.ts`
- [ ] Buat `lib/prisma.ts` (dengan global guard)
- [ ] Buat `lib/types.ts` (DeckWithCount, DeckWithCards, ActionResult)
- [ ] Buat `lib/schemas/deck.schema.ts` + `lib/schemas/card.schema.ts`
- [ ] Buat `middleware.ts` dengan auth guard (Supabase inline)
- [ ] Buat `app/auth/callback/route.ts` — di luar route groups
- [ ] Buat `app/(auth)/login/page.tsx` — form email magic link
- [ ] Setup Tailwind v4 `@theme` tokens di `globals.css` (termasuk reduced-motion)
- [ ] Buat `app/(app)/layout.tsx` — responsive nav wrapper
- [ ] Buat `components/layout/BottomNav.tsx` + `components/layout/Sidebar.tsx`
- [ ] Tambahkan `padding-bottom: env(safe-area-inset-bottom)` ke BottomNav

**Success criteria:**
- User bisa login via email magic link
- Setelah login, redirect ke `/decks`
- Tanpa login, `/decks` redirect ke `/login`
- Bottom nav muncul di HP, sidebar di tablet ≥ 768px
- Safe area inset tidak memotong BottomNav di iPhone

---

### Phase 2: Deck CRUD + Card Creation (Est. 4–5 jam)

**Tasks:**
- [ ] `app/(app)/decks/page.tsx` — Server Component, fetch `DeckWithCount[]` by userId
- [ ] Inline deck grid (map DeckCard) di page — tidak perlu DeckGrid.tsx terpisah
- [ ] `components/decks/DeckCard.tsx` — title, card count, tombol Study/Edit/Delete
- [ ] `app/(app)/decks/new/page.tsx` — Server Component + inline form + CardLiveList
- [ ] `components/cards/CardEditorRow.tsx` — soal/jawaban inputs; Tab→next, Enter→new card
  - Gunakan functional updater `setCards(prev => ...)` — bukan closure langsung
- [ ] `components/cards/CardLiveList.tsx` — live list dengan inline delete + order tracking
- [ ] `components/cards/ImportModal.tsx` — inline dialog; textarea paste + CSV upload
  - `isSubmitting` guard untuk prevent double-submit
  - Dynamic import papaparse: `const Papa = await import('papaparse')`
- [ ] `lib/utils/import.ts` — merged parser: text-paste + CSV + sanitize formula injection
- [ ] `lib/actions/deck.actions.ts` — `createDeck` (atomic tx), `updateDeck`, `deleteDeck`
- [ ] `lib/actions/card.actions.ts` — `bulkUpsertCards`, `deleteCard`
  - Setiap action: validate Zod + getUser() + IDOR check
  - `card.create`: verifikasi deck.userId === user.id sebelum insert
- [ ] `app/(app)/decks/[id]/page.tsx` — Server Component, fetch DeckWithCards
- [ ] `app/(app)/decks/[id]/edit/page.tsx` — Server Component (fetch data), pass ke Client form
- [ ] `components/ui/ConfirmDialog.tsx` — gunakan native `<dialog>` element

**Success criteria:**
- Semua Server Actions divalidasi Zod sebelum ke Prisma
- IDOR: user B tidak bisa hapus deck user A
- Nested create (card ke deck): verifikasi deck ownership
- Import max 200 kartu, formula injection ter-strip
- Atomic deck + card creation (tidak ada partial state)

---

### Phase 3: Study Mode (Est. 2–3 jam)

**Tasks:**
- [ ] `app/(app)/decks/[id]/study/page.tsx` — fetch cards (single query dengan include), pass ke StudyCarousel
- [ ] `components/study/StudyCarousel.tsx`:
  - Virtual 5-card sliding window (bukan render semua 200)
  - `scroll-snap-type: y mandatory`, `height: 100dvh`, `overscroll-behavior: contain`
  - `touch-action: pan-y`, `contain: strict`
  - IntersectionObserver untuk progress tracking (bukan onScroll)
  - `currentIndexRef` (ref) untuk immediate reads, `displayIndex` (state) untuk render
  - `isScrolling` ref guard — disable shuffle button saat scroll sedang berjalan
- [ ] `components/cards/FlashCard.tsx`:
  - Pure CSS 3D flip; `touch-action: manipulation`
  - `-webkit-backface-visibility: hidden` untuk Safari
  - Remove `will-change: transform` setelah transition selesai (onTransitionEnd)
- [ ] `components/study/ProgressBadge.tsx` — floating "5 / 20"
- [ ] Shuffle button — Fisher-Yates client-side; disabled saat `isScrolling`
- [ ] Empty state saat deck tidak punya kartu
- [ ] Completion screen setelah kartu terakhir

**Success criteria:**
- 200 kartu: hanya 5 DOM nodes yang render (virtual window)
- Scroll terasa smooth (IntersectionObserver, bukan onScroll 60fps)
- Shuffle tidak crash saat scroll in-progress
- Flip animation smooth; tidak ada 300ms tap delay
- `100dvh` tidak terpotong address bar mobile

---

### Phase 4: Polish & Responsive Refinement (Est. 1–2 jam)

**Tasks:**
- [ ] Loading skeletons untuk deck list + study load
- [ ] `error.tsx` boundaries di route yang relevan
- [ ] Toast notifikasi untuk create/delete/import success (gunakan native `<dialog>` toast atau minimal custom)
- [ ] Responsive review: test di 375px (iPhone SE), 768px (iPad), 1280px (desktop)
- [ ] Tipografi: font-size 16px minimum di form inputs (mencegah iOS auto-zoom)
- [ ] Touch target review: semua tombol interaktif ≥ 44×44px
- [ ] Viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` — `viewport-fit=cover` WAJIB untuk `env(safe-area-inset-bottom)` bekerja
- [ ] Tambahkan `<meta name="theme-color" content="#FAFAF7">` untuk cream browser chrome
- [ ] Load Instrument Serif via `next/font/google` untuk deck titles + empty states
- [ ] Favicon + page titles

---

## Alternative Approaches Considered

### PWA (Progressive Web App) — Ditolak
Setup service worker + manifest menambah kompleksitas tanpa nilai signifikan untuk MVP. Offline mode tidak diminta. Bisa ditambahkan nanti sebagai enhancement. (see brainstorm)

### API Route Handlers vs Server Actions
Server Actions dipilih untuk mutations karena lebih sedikit boilerplate. Route Handlers hanya untuk `/auth/callback` yang butuh Response langsung.

### Framer Motion vs CSS Native
CSS scroll-snap dan CSS 3D transform cukup. Framer Motion ~45KB tanpa kebutuhan yang jelas.

### Virtual Scrolling Library vs Manual Window
5-card sliding window manual dipilih — lebih simpel dari react-virtualize/tanstack-virtual. Deck max 200 kartu, bukan ribuan.

---

## System-Wide Impact

### Interaction Graph

```
User action (tap/type) → Client Component
  → Server Action (deck.actions.ts / card.actions.ts)
    → Zod.safeParse(input) → reject jika invalid
    → createSupabaseServerClient() → getUser() → reject jika null
    → prisma.deck.findFirst({ where: { id, userId } }) → IDOR check
    → prisma.$transaction([deck.create, card.createMany])
    → revalidatePath('/decks')   ← BEFORE redirect
      → Next.js ISR cache invalidated
        → Server Component re-render dengan data fresh
```

Auth chain: setiap request → `middleware.ts` → `supabase.auth.getUser()` → redirect jika tidak valid.

### Error & Failure Propagation

| Layer | Error | Handler |
|---|---|---|
| Zod schema | Invalid input | Return `ActionResult` error ke client, tidak ke Prisma |
| Supabase Auth | Token expired / getUser fails | Middleware redirect ke /login; Action return Unauthorized |
| IDOR check | Deck tidak ditemukan / milik user lain | Return `{ success: false, error: 'Not found' }` (404, bukan 403 — jangan bocorkan existence) |
| Prisma transaction | Connection timeout / constraint violation | Caught di action, return generic server error |
| Import parse | Invalid CSV / melebihi 200 | Return `errors[]` array, ditampilkan di ImportModal sebelum konfirmasi |
| Formula injection | `=SUM(...)` di soal/jawaban | Stripped di `lib/utils/import.ts` sebelum ke server |

### State Lifecycle Risks

- **Partial bulk create:** Tertangani dengan `prisma.$transaction` — deck + cards atomic.
- **Double-submit ImportModal:** Tertangani dengan `isSubmitting` boolean.
- **Stale card state:** Tertangani dengan functional updater `setCards(prev => ...)`.
- **Scroll vs shuffle collision:** Tertangani dengan `isScrolling` ref guard.
- **Delete cascade:** `onDelete: Cascade` di Card + manual FK cascade ke auth.users.
- **Orphaned decks:** Manual FK migration (`auth.users ON DELETE CASCADE`) mencegah ini.

### API Surface Parity

- Semua mutasi: userId dari server session (tidak dari client input).
- Semua queries: filter `userId` untuk reads + explicit ownership check untuk writes/deletes.
- Pattern IDOR-safe: `findFirst({ where: { id, userId } })` — jika tidak ketemu, return 'Not found' bukan 'Forbidden' (tidak bocorkan resource existence).

### Integration Test Scenarios

1. User A tidak bisa hapus deck user B: `deleteDeck(deckBId)` saat login sebagai user A → `ActionResult { success: false, error: 'Not found' }`
2. Import 201 kartu → Zod reject dengan pesan "Maksimal 200 kartu per import"
3. Import CSV dengan soal `=IMPORTRANGE(...)` → ter-strip menjadi `IMPORTRANGE(...)` di storage
4. Login → buat deck + kartu → logout → login lagi → deck + kartu masih ada
5. Study mode dengan 1 kartu → flip → scroll → completion screen (bukan blank/error)
6. Server Action `createDeck` dipanggil tanpa session (expired token) → return `Unauthorized`, bukan 500

---

## Acceptance Criteria

### Functional Requirements

**Auth:**
- [ ] User bisa login via email magic link
- [ ] Session persisten di cookies (tidak logout saat refresh)
- [ ] Route `/decks` dan turunannya protected — redirect ke `/login` jika tidak login
- [ ] User hanya bisa akses deck miliknya sendiri (IDOR prevention)

**Deck Management:**
- [ ] Buat deck dengan title (required, max 255 char) dan description (optional)
- [ ] Edit title dan description deck yang ada
- [ ] Delete deck dengan konfirmasi dialog — semua kartu ikut terhapus
- [ ] Deck list menampilkan jumlah kartu per deck

**Card Creation:**
- [ ] Tambah kartu manual: Tab untuk pindah field soal→jawaban, Enter untuk tambah kartu baru
- [ ] Kartu muncul langsung di live list saat disubmit (optimistic)
- [ ] Inline edit kartu yang sudah ditambahkan sebelum save
- [ ] Import via paste text: auto-detect delimiter (tab/koma), preview table, konfirmasi
- [ ] Import via CSV file upload via papaparse (lazy loaded)
- [ ] Validasi Zod: soal dan jawaban tidak boleh kosong
- [ ] Batas import: maksimal 200 kartu per sesi
- [ ] Formula injection stripped: nilai yang diawali `=`, `+`, `-`, `@`

**Study Mode:**
- [ ] Kartu ditampilkan vertikal full-screen dengan virtual 5-card window
- [ ] Scroll up/swipe untuk ke kartu berikutnya (scroll-snap)
- [ ] Tap/klik kartu → flip 3D, tampilkan jawaban
- [ ] Progress badge "X / Y" update via IntersectionObserver (bukan onScroll)
- [ ] Shuffle button mengacak urutan; disabled saat scroll berlangsung
- [ ] Empty state jika deck tidak punya kartu
- [ ] Completion screen setelah kartu terakhir

### Non-Functional Requirements

- [ ] Layout responsif: bottom nav di < 768px, sidebar di ≥ 768px
- [ ] Tidak terpotong address bar mobile (`100dvh` + `min-height: -webkit-fill-available`)
- [ ] Safe area insets di BottomNav untuk notched iPhones
- [ ] Touch target ≥ 44×44px untuk semua elemen interaktif
- [ ] Font input ≥ 16px (mencegah iOS auto-zoom)
- [ ] Tidak ada data user lain yang dapat diakses (IDOR)
- [ ] Cream/monochrome palette; WCAG AA contrast ratio

### Quality Gates

- [ ] TypeScript: tidak ada `as string` cast di Server Actions (gunakan Zod)
- [ ] TypeScript: komponen menggunakan `Prisma.DeckGetPayload` types dari `lib/types.ts`
- [ ] Setiap Server Action: Zod validation → getUser() → IDOR check → Prisma
- [ ] `revalidatePath` sebelum `redirect` di Server Actions
- [ ] Tidak ada `console.log` di production code
- [ ] papaparse di-lazy-import (tidak di initial bundle)

---

## Dependencies & Prerequisites

### Packages to Install

```bash
npm install @supabase/ssr @supabase/supabase-js prisma @prisma/client papaparse @types/papaparse zod
```

> Zod ditambahkan (tidak ada di original plan) — diperlukan untuk Server Action validation.

### External Setup Required

1. **Supabase project** — buat di supabase.com, ambil URL + anon key
2. **Supabase Auth** — aktifkan Email provider, enable "Magic Links", set OTP expiry ke **15 menit** (bukan default 1 jam)
3. **Supabase Auth Settings** — enable "Confirm email" + "Secure email change"
4. **Redirect URL** — tambahkan `http://localhost:3000/auth/callback` di Supabase Auth settings
5. **Prisma migrate** — `npx prisma migrate dev --name init`
6. **Manual FK migration** — tambahkan SQL FK ke `auth.users` setelah migrate

---

## Risk Analysis & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Supabase free tier connection limits (60 conn) | Medium | High | Wajib pakai `DATABASE_URL` pooled (Supavisor port 6543, `?pgbouncer=true`) |
| `100dvh` tidak konsisten di Safari iOS | Low | Medium | Fallback `min-height: -webkit-fill-available` + `overscroll-behavior: contain` |
| CSS scroll-snap tidak smooth di Android lama | Low | Medium | `scroll-snap-stop: always` + `contain: strict` membantu; graceful degradation tetap bisa scroll |
| Partial deck creation (deck terbuat, cards gagal) | Medium | Medium | `prisma.$transaction` — atomic, tidak ada partial state |
| Double-submit ImportModal | High | Low | `isSubmitting` boolean guard |
| Virtual window desync (wrong card highlighted) | Low | Medium | `IntersectionObserver` dengan `threshold: 0.6` + `currentIndexRef` untuk immediate reads |
| Formula injection di import | Medium | Low | Strip `^[=+\-@]` di `lib/utils/import.ts` sebelum ke server |
| Orphaned decks saat user dihapus | Low | Medium | Manual FK migration `ON DELETE CASCADE` ke `auth.users` |

---

## Sources & References

### Origin

- **Brainstorm document:** [docs/brainstorms/2026-04-25-mobile-first-flashcard-brainstorm.md](../brainstorms/2026-04-25-mobile-first-flashcard-brainstorm.md)
  - Key decisions carried forward: (1) vertical scroll-snap study mode, (2) Quizlet-style live card list + paste import, (3) Supabase Auth required (data per user), (4) no PWA, (5) monochrome+cream aesthetic

### Research Findings (Deepening Agents)

- **Architecture:** auth callback di luar route groups; edit pages tetap Server Components, client form sebagai leaf
- **Security:** Zod wajib; IDOR gap pada nested card creates; formula injection strip; PKCE default di `@supabase/ssr`
- **Database:** `uuid()` > `cuid()` untuk database-native default; `@@unique([deckId, order])`; manual FK
- **Race conditions:** functional updater pattern; `isSubmitting` guard; IntersectionObserver > onScroll; shuffle guard
- **TypeScript:** `Prisma.DeckGetPayload` untuk component props; `Promise<{...}> params` di Next.js 15+
- **Performance:** dynamic import papaparse; virtual 5-card window; `contain: strict`; `touch-action: pan-y`; `will-change` hanya saat flip aktif
- **Simplicity:** 6 file dieliminasi sebelum implementasi dimulai

### External References

- Supabase SSR: `@supabase/ssr` (bukan deprecated `auth-helpers-nextjs`); `getUser()` bukan `getSession()` di server
- Prisma + Supabase: `DATABASE_URL` pooled (6543, `?pgbouncer=true`) + `DIRECT_URL` direct (5432) — keduanya wajib
- Tailwind v4: custom colors via `--color-*` di `@theme inline`; shadow scale berubah dari v3
- CSS scroll-snap: `scroll-snap-stop: always`; `100dvh` + `-webkit-fill-available` fallback; `overscroll-behavior: contain`
- CSS 3D flip: `-webkit-backface-visibility` masih diperlukan Safari 2026; `touch-action: manipulation` eliminate 300ms delay
- WCAG: `ink (#1A1A1A)` vs `cream (#FAFAF7)` = 17:1 ✓; `ink-muted (#6B6B6B)` vs cream = 5.7:1 ✓
