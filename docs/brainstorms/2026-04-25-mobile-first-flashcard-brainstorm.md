# Brainstorm: Mobile-First Flashcard App

**Date:** 2026-04-25  
**Status:** Draft  
**Author:** quintylabs@gmail.com

---

## What We're Building

A minimalist flashcard web app dengan "Quiet Luxury" aesthetic, dirancang **mobile-first** untuk HP dan tablet. User dapat membuat deck, menambah kartu secara manual atau via paste/import, dan belajar lewat study mode vertical scroll. Dibuka via browser (tidak perlu install), tapi terasa native dan responsif di HP.

---

## Why This Approach (Responsive Web, Mobile-First)

PWA menambah kompleksitas service worker tanpa nilai signifikan untuk MVP. Pendekatan responsive web mobile-first memberikan titik manis: experience yang bagus di HP/tablet, cepat dibangun, mudah di-maintain. Jika offline support diperlukan nanti, PWA bisa ditambahkan sebagai enhancement.

---

## Key Decisions

### 1. Navigation: Bottom Tab Bar di Mobile
- **HP:** Bottom navigation bar (thumb-friendly) dengan 3 tab: Decks, Study, Import
- **Tablet/Desktop:** Sidebar navigation kiri
- Implementasi: CSS `@media` breakpoint, Tailwind `md:` prefix

### 2. Study Mode: Vertical Scroll Carousel
- Kartu ditampilkan dalam vertical scroll dengan **CSS scroll-snap** (bukan library berat)
- Tap/klik kartu → flip 3D animation (CSS `transform: rotateY`)
- Progress indicator floating di sudut (mis. "5 / 20")
- Swipe feel natural seperti feed — tidak perlu tombol Prev/Next

### 3. Card Creation: Quizlet-Style Interface
- **Live card list:** Kartu langsung muncul sebagai list di bawah form, bisa inline-edit
- **Import from text:** Modal dengan textarea — user paste teks, pilih delimiter (koma/tab), preview sebelum submit
- **Keyboard shortcuts:** Tab pindah ke field berikutnya, Enter tambah kartu baru
- CSV file upload tetap ada (via `papaparse`) sebagai opsi sekunder di Import modal

### 4. Aesthetic: Monochrome + Cream (Quiet Luxury)
- **Color palette:** `#FAFAF7` (cream), `#1A1A1A` (near-black), `#6B6B6B` (muted gray)
- **Typography:** Satu font family, size hierarchy yang jelas, generous whitespace
- **Cards:** Subtle shadow, rounded corners, border tipis — bukan warna-warni
- **Interaksi:** Micro-animation halus (flip, fade) — tidak berlebihan

### 5. Tech Stack (Sesuai PRD)
- **Framework:** Next.js 15+ App Router
- **Database:** Supabase (PostgreSQL) + Prisma ORM
- **CSV/Text parsing:** `papaparse` (client-side)
- **Styling:** Tailwind CSS v4
- **Animation:** CSS native untuk flip, CSS scroll-snap untuk study mode

---

## Page Structure

```
/                    → Redirect ke /decks
/decks               → Deck list (grid di tablet, list di HP)
/decks/new           → Buat deck baru + tambah kartu (Quizlet-style)
/decks/[id]          → Detail deck: daftar kartu + tombol Study & Edit
/decks/[id]/study    → Study mode (vertical scroll carousel)
/decks/[id]/edit     → Edit deck & kartu
```

---

## Open Questions

*(Semua telah diselesaikan — lihat Resolved Questions)*

---

## Resolved Questions

- **Navigation pattern:** Vertical scroll (swipe up/down) untuk study mode ✓
- **Import UX:** Paste-based text import (Quizlet-style) sebagai primary, CSV file upload sebagai secondary ✓
- **Card creation:** Live inline list + keyboard shortcuts + import modal ✓
- **Color scheme:** Monochrome + cream (Quiet Luxury) ✓
- **Approach:** Responsive web mobile-first, bukan PWA ✓
- **Authentication:** Ya, perlu login — Supabase Auth, data per user ✓
- **Study mode order:** Sequential default + tombol shuffle opsional ✓
- **Sharing:** Tidak di MVP, hanya untuk diri sendiri ✓
