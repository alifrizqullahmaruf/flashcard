// lib/quiz/distractors.ts

const MAX_ANSWER_LENGTH = 60

function normalizeForDedupe(s: string): string {
  return s.trim().toLowerCase()
}

function fisherYatesShuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Pilih 3 distraktor random dari pool jawaban deck.
 * - Exclude jawaban benar (case-insensitive).
 * - De-duplikasi (case-insensitive + trimmed).
 * - Exclude jawaban yang panjang > 60 karakter.
 * - Throw kalau pool tidak cukup (caller harus filter dulu).
 */
export function pickDistractors(
  correctAnswer: string,
  allDeckAnswers: string[]
): string[] {
  const correctNorm = normalizeForDedupe(correctAnswer)

  const seen = new Set<string>([correctNorm])
  const pool: string[] = []
  for (const ans of allDeckAnswers) {
    if (ans.length > MAX_ANSWER_LENGTH) continue
    const norm = normalizeForDedupe(ans)
    if (seen.has(norm)) continue
    seen.add(norm)
    pool.push(ans)
  }

  if (pool.length < 3) {
    throw new Error(`Pool distraktor terlalu kecil: butuh ≥3, dapat ${pool.length}`)
  }

  return fisherYatesShuffle(pool).slice(0, 3)
}

/**
 * Bangun 4 opsi: jawaban benar + 3 distraktor, dengan posisi acak.
 */
export function buildOptions(
  correctAnswer: string,
  distractors: string[]
): string[] {
  if (distractors.length !== 3) {
    throw new Error(`buildOptions butuh tepat 3 distraktor, dapat ${distractors.length}`)
  }
  return fisherYatesShuffle([correctAnswer, ...distractors])
}

/**
 * Cek apakah kartu eligible untuk mode kuis berdasarkan panjang jawaban.
 */
export function isQuizEligible(jawaban: string): boolean {
  return jawaban.length <= MAX_ANSWER_LENGTH
}

export const QUIZ_MAX_ANSWER_LENGTH = MAX_ANSWER_LENGTH
