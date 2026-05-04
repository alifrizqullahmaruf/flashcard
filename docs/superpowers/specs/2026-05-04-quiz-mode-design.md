# Quiz Mode (Multiple Choice) — Design Spec

**Status:** Approved, ready for implementation plan
**Date:** 2026-05-04
**Owner:** Hafalin

## Goal

Tambahkan mode kuis pilihan ganda di samping mode flashcard yang sudah ada, supaya user bisa review dengan cara recognition (cepat, otomatis-rated) selain recall manual.

## Non-Goals

- AI-generated distractors (LLM-based) — di luar scope iterasi ini
- Manual distractor input per kartu — di luar scope iterasi ini
- Mixed mode dalam satu sesi (auto-pick mode per kartu) — di luar scope iterasi ini
- Schema Firestore baru, perubahan FSRS algoritma, perubahan security rules — tidak diperlukan

## Architecture

```
/decks/{id}/study (page.tsx)
  ├─ getDueCards(userId, deckId)        # tetap sama
  ├─ filter eligible quiz cards (jawaban.length <= 60)
  ├─ pre-compute opsi distraktor per kartu
  └─ render:
       ├─ <ModePicker>      # NEW — pilih flashcard / kuis
       ├─ <StudyCarousel>   # existing — mode flashcard
       └─ <QuizCarousel>    # NEW — mode kuis MC
              │
              └─ rateCard()  # server action existing, dipanggil dengan rating yang dihitung otomatis
```

Komponen kuis dibangun **sejajar** dengan flashcard existing — tidak menggantikan apa pun. Server action `rateCard()` dipakai bersama; perbedaan hanya di siapa yang menentukan rating (manual klik vs hitung otomatis).

## Design Decisions

### D1: Mode picker muncul di awal sesi (bukan tombol terpisah di DeckCard)

User klik "BELAJAR" → tampil layar pemilihan mode → pilih → masuk carousel mode itu.

**Alasan:** Lebih fleksibel — DeckCard tetap clean (1 tombol), user putuskan mode setelah lihat berapa banyak kartu eligible per mode.

### D2: Distractor = random dari jawaban kartu lain di deck yang sama

Untuk setiap kartu kuis, ambil 3 jawaban random (de-dupe, case-insensitive) dari kartu lain di deck. Gabung dengan jawaban benar, shuffle posisi 4 opsi.

**Alasan:** KISS — tidak butuh API/AI. Otomatis konteks-aware (deck Jepang → distraktor pasti hiragana lain). Bisa di-upgrade ke similarity-based atau AI-based di iterasi berikutnya tanpa breaking change.

### D3: Filter kartu dengan jawaban > 60 karakter

Kartu dengan `jawaban.length > 60` tidak masuk antrean kuis (tetap muncul di flashcard mode). Threshold dipilih supaya 4 tombol opsi tetap rapi di mobile (kira-kira 8-10 kata per opsi).

**Alasan:** Mode MC cocok untuk recognition cepat, bukan reading comprehension. Kartu panjang bukan kandidat MC yang bagus.

### D4: MC result → FSRS rating berdasarkan kecepatan (3-tier)

| Hasil | Waktu jawab | FSRS Rating |
|-------|-------------|-------------|
| Benar | < 3000 ms   | `Easy`      |
| Benar | ≥ 3000 ms   | `Good`      |
| Salah | -           | `Again`     |

`Hard` rating tidak digunakan di mode kuis. Threshold 3 detik = konstanta `EASY_THRESHOLD_MS`.

**Alasan:** Speed adalah sinyal proxy yang bagus untuk fluency (sebagaimana di Memrise/Drops). 3 dari 4 rating FSRS terpakai tanpa nambah UI complexity (tetap 1-tap per kartu).

### D5: Pre-compute opsi distraktor di server (page.tsx)

Distraktor dihitung sekali di server saat load `/study`, bukan per kartu di client. Server kirim `options: string[4]` yang sudah ter-shuffle ke client.

**Alasan:** Hemat compute, konsisten saat user navigasi balik dalam 1 sesi, dan client tidak perlu lihat seluruh jawaban deck.

### D6: Auto-advance setelah pilih opsi

- Benar → tunggu 800 ms (cukup untuk lihat feedback hijau) → swipe ke kartu berikut
- Salah → tunggu 1800 ms (lebih lama, biar user baca jawaban benar yang di-highlight) → swipe ke kartu berikut

User bisa override dengan tombol panah keyboard (`←` `→`).

### D7: Tidak ada state persistensi mode picker

Setiap sesi baru, user pilih mode lagi dari awal. Tidak pakai localStorage.

**Alasan:** KISS untuk iterasi pertama. Bisa ditambahkan nanti kalau jadi pain point.

## Components

### `lib/quiz/distractors.ts` (NEW, pure module)

Fungsi pure tanpa side effect. Mudah ditest unit.

```typescript
export function pickDistractors(
  correctAnswer: string,
  allDeckAnswers: string[]
): string[]

export function buildOptions(
  correctAnswer: string,
  distractors: string[]
): string[]
```

Aturan:
- De-duplikasi case-insensitive + trimmed
- Filter pool: hanya jawaban dengan length ≤ 60
- Fisher-Yates shuffle untuk posisi
- Throw error kalau pool < 3 (caller harus filter dulu)

### `components/study/ModePicker.tsx` (NEW, client component)

Props:
```typescript
type Props = {
  deckTitle: string
  flashcardCount: number   // total kartu due
  quizEligibleCount: number // kartu due dengan jawaban ≤ 60 chars
  onPickFlashcard: () => void
  onPickQuiz: () => void
}
```

Behavior:
- 2 kartu mode dengan deskripsi singkat + count
- Kartu kuis disabled jika `quizEligibleCount < 4`, tampil hint "Butuh ≥4 kartu pendek"
- Klik kartu mode → callback ke parent (parent yang ganti view)

### `components/study/QuizCarousel.tsx` (NEW, client component)

Props:
```typescript
type Props = {
  cards: QuizCard[]  // sudah dengan options pre-computed
  deckId: string
}

type QuizCard = {
  id: string
  soal: string
  jawaban: string  // jawaban benar
  options: string[]  // 4 opsi sudah ter-shuffle
}
```

State:
- `currentIndex: number`
- `answers: Map<cardId, { picked: string; elapsedMs: number; isCorrect: boolean }>`

Per kartu:
1. Mount kartu → start timer (`Date.now()`)
2. User klik opsi → stop timer, lock kartu, hitung `elapsedMs`
3. Tentukan rating dari D4 → call `rateCard(deckId, cardId, rating)` async (tidak await)
4. Visual feedback: opsi benar = mint, opsi salah = coral, jawaban benar di-highlight kalau user salah
5. Setelah delay (D6) → scroll ke kartu berikut
6. Setelah semua kartu → completion screen dengan stats

Layout:
- Layout swipe horizontal (sama pattern dengan StudyCarousel existing)
- Grid 2x2 di mobile, 1x4 di desktop untuk tombol opsi
- Keyboard: `1`/`2`/`3`/`4` pilih opsi, `←`/`→` navigasi manual

### `app/(app)/decks/[id]/study/page.tsx` (UPDATE)

Server component, orkestrasi:

1. Auth check (existing)
2. Fetch deck title (existing)
3. `getDueCards()` (existing)
4. Hitung eligible quiz cards: filter `jawaban.length <= 60`
5. Untuk tiap eligible quiz card, pre-compute `options` via `buildOptions(correctAnswer, pickDistractors(...))`
6. Pass kedua dataset ke client wrapper component yang manage mode state

Karena page.tsx adalah Server Component dan ModePicker butuh callback untuk switch mode, kita pakai pola **client wrapper**:

```
StudyPage (server)
  └─ <StudyModeRouter cards={...} quizCards={...} deckId={...} />  (client)
       └─ {mode === null  ? <ModePicker /> :
           mode === 'fc'  ? <StudyCarousel /> :
                            <QuizCarousel />}
```

`StudyModeRouter` adalah komponen client baru yang sederhana — hanya manage `mode` state dan render salah satu dari 3 view.

## Data Flow

### Quiz session flow

```
[ user di /decks/{id} klik BELAJAR ]
        │
        ▼
[ /decks/{id}/study (server) ]
   getDueCards() → 42 kartu
   filter quiz-eligible → 38 kartu
   pre-compute options untuk 38 kartu
   pass ke client
        │
        ▼
[ <StudyModeRouter mode={null}> ]
   render <ModePicker count={42, 38}>
        │
        ▼
[ user klik kartu Kuis ]
   setMode('quiz')
        │
        ▼
[ <QuizCarousel cards={38}> ]
   per kartu:
     - timer mulai
     - user klik opsi
     - rating = compute(correct, elapsedMs)
     - rateCard(deckId, cardId, rating) async
     - visual feedback
     - delay 800/1800ms → next card
        │
        ▼
[ semua kartu selesai ]
   completion screen dengan stats
```

### Rating dispatch

```
user klik opsi di kartu X
    ↓
client compute rating dari (correct, elapsedMs)
    ↓
rateCard(deckId, X, rating)  ← server action existing
    ↓
rateCardInTransaction()  ← firestore/cards.ts existing
    ↓
applyRating()  ← fsrs/scheduler.ts existing
    ↓
update Firestore: state, due, stability, difficulty, reps, ...
```

Tidak ada perubahan di server action atau Firestore. Kuis cuma cara berbeda untuk **menentukan** rating sebelum kirim.

## Error Handling

| Skenario | Perilaku |
|----------|---------|
| Deck eligible quiz cards < 4 | ModePicker disable kartu Kuis dengan hint |
| Deck eligible quiz cards = 0, flashcard cards = 0 | Page langsung tampil "Semua sudah dikuasai!" (existing) |
| `rateCard()` gagal saat sesi kuis | Toast "Gagal simpan rating", lanjut ke kartu berikut tetap (state lokal sudah optimistic). Karena tidak commit, FSRS state kartu tidak berubah — kartu akan muncul lagi di sesi berikutnya selama masih due |
| User refresh di tengah sesi | Sesi reset, masuk lagi via ModePicker — sama dengan flashcard existing |
| User klik 2 opsi cepat | State lock setelah klik pertama, klik kedua diabaikan |
| Distraktor kebetulan = jawaban benar (case-insensitive match) | Sudah di-handle di `pickDistractors` (de-dupe pool sebelum shuffle) |

## Testing Strategy

**Unit tests (manual atau Vitest nanti):**
- `pickDistractors`: pool < 3, pool dengan duplikat, pool dengan jawaban panjang yang harus di-skip, dst.
- `buildOptions`: posisi jawaban benar terdistribusi acak setelah banyak run

**Integration test manual:**
- Buat deck 5 kartu pendek → sesi kuis lengkap → cek Firestore: `state`, `due`, `reps` ter-update sesuai rating
- Buat deck 3 kartu pendek → mode picker disable Kuis
- Buat deck campuran (5 pendek, 3 panjang) → kuis hanya 5 kartu yang muncul

## File Changes Summary

| File | Status | Tujuan |
|------|--------|--------|
| `lib/quiz/distractors.ts` | NEW | Pure functions distractor logic |
| `components/study/ModePicker.tsx` | NEW | UI pilih mode |
| `components/study/QuizCarousel.tsx` | NEW | UI sesi kuis |
| `components/study/StudyModeRouter.tsx` | NEW | Client wrapper untuk switch mode |
| `app/(app)/decks/[id]/study/page.tsx` | UPDATE | Pre-compute quiz options + render router |
| `lib/firestore/cards.ts` | UNCHANGED | - |
| `lib/actions/study.actions.ts` | UNCHANGED | - |
| `lib/fsrs/scheduler.ts` | UNCHANGED | - |
| Firestore schema / rules | UNCHANGED | - |

## Estimated Effort

~3-4 jam fokus implementasi (excluding testing & polish).

## Future Enhancements (Out of Scope)

- AI-generated distractors (Gemini/Claude)
- Manual override distractors per kartu
- Mode picker state persistensi (localStorage)
- Mixed mode otomatis (algoritma pilih mode per kartu)
- Streak/XP integration untuk hasil kuis
- Statistik kuis di halaman /stats (akurasi, kecepatan rata-rata)
