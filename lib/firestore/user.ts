import { cache } from 'react'
import { adminDb } from '@/lib/firebase/admin'
import { FieldValue, Timestamp, type Transaction } from 'firebase-admin/firestore'
import { computeTodayDate, computeYesterdayDate, DEFAULT_TIMEZONE, isValidTimezone } from '@/lib/utils/timezone'
import type { Locale, UserData } from '@/lib/types'

interface UserDoc {
  email?: string | null
  timezone?: string
  language?: Locale
  currentStreak?: number
  longestStreak?: number
  lastStudyDate?: string | null
  dailyGoal?: number
  cardsStudiedToday?: number
  streakFreezes?: number
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

const DEFAULT_DAILY_GOAL = 10
const DEFAULT_LANGUAGE: Locale = 'id'

function userRef(userId: string) {
  return adminDb.collection('users').doc(userId)
}

function docToUserData(uid: string, data: UserDoc): UserData {
  return {
    uid,
    email: data.email ?? null,
    timezone: data.timezone && isValidTimezone(data.timezone) ? data.timezone : DEFAULT_TIMEZONE,
    language: data.language === 'en' || data.language === 'id' ? data.language : DEFAULT_LANGUAGE,
    currentStreak: data.currentStreak ?? 0,
    longestStreak: data.longestStreak ?? 0,
    lastStudyDate: data.lastStudyDate ?? null,
    dailyGoal: data.dailyGoal ?? DEFAULT_DAILY_GOAL,
    cardsStudiedToday: data.cardsStudiedToday ?? 0,
    streakFreezes: data.streakFreezes ?? 0,
    createdAt: data.createdAt?.toDate() ?? new Date(),
    updatedAt: data.updatedAt?.toDate() ?? new Date(),
  }
}

/**
 * Update user's language preference.
 * Creates user doc if not exists.
 */
export async function setUserLanguage(userId: string, language: Locale): Promise<void> {
  if (language !== 'id' && language !== 'en') throw new Error('Invalid language')

  const ref = userRef(userId)
  const snap = await ref.get()
  if (snap.exists) {
    await ref.update({ language, updatedAt: FieldValue.serverTimestamp() })
  } else {
    await ref.set({
      language,
      timezone: DEFAULT_TIMEZONE,
      dailyGoal: DEFAULT_DAILY_GOAL,
      currentStreak: 0,
      longestStreak: 0,
      cardsStudiedToday: 0,
      streakFreezes: 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })
  }
}

/**
 * Read user profile. Returns defaults if document doesn't exist yet.
 * Cached per-request via React.cache — multiple callers in same render share one read.
 */
export const getUserData = cache(async (userId: string): Promise<UserData> => {
  const snap = await userRef(userId).get()
  if (!snap.exists) {
    return docToUserData(userId, {})
  }
  return docToUserData(userId, snap.data() as UserDoc)
})

/**
 * Compute the user document update for a study session, given current state.
 * Returns the partial update to merge into the user doc — does not write.
 *
 * Streak rules:
 * - If lastStudyDate === today: increment cardsStudiedToday only (streak unchanged)
 * - If lastStudyDate === yesterday: streak += 1, reset cardsStudiedToday to 1
 * - Otherwise (skipped a day or first study): streak = 1, cardsStudiedToday = 1
 * - longestStreak = max(longestStreak, currentStreak after update)
 */
export function computeStudySessionUpdate(
  current: UserData,
  now: Date = new Date()
): Record<string, unknown> {
  const tz = current.timezone || DEFAULT_TIMEZONE
  const today = computeTodayDate(tz, now)
  const yesterday = computeYesterdayDate(tz, now)

  let nextStreak: number
  let nextCardsToday: number

  if (current.lastStudyDate === today) {
    // Already studied today — keep streak, increment counter
    nextStreak = current.currentStreak
    nextCardsToday = current.cardsStudiedToday + 1
  } else if (current.lastStudyDate === yesterday) {
    // Continued streak from yesterday — increment, reset counter
    nextStreak = current.currentStreak + 1
    nextCardsToday = 1
  } else {
    // Skipped one or more days, or first ever — reset
    nextStreak = 1
    nextCardsToday = 1
  }

  const nextLongest = Math.max(current.longestStreak, nextStreak)

  return {
    currentStreak: nextStreak,
    longestStreak: nextLongest,
    lastStudyDate: today,
    cardsStudiedToday: nextCardsToday,
    updatedAt: FieldValue.serverTimestamp(),
  }
}

/**
 * Read user data inside a transaction. Returns existing data or defaults.
 * Caller must have already acquired the read lock via tx.get().
 */
export function readUserDataInTx(
  uid: string,
  snapshot: FirebaseFirestore.DocumentSnapshot
): UserData {
  if (!snapshot.exists) {
    return docToUserData(uid, {})
  }
  return docToUserData(uid, snapshot.data() as UserDoc)
}

/**
 * Apply a study-session update to the user doc inside an existing transaction.
 * Reads current state, computes update, writes back.
 *
 * IMPORTANT: This must be called BEFORE any writes in the transaction
 * (Firestore requires reads before writes).
 */
export async function updateStreakInTransaction(
  tx: Transaction,
  userId: string,
  now: Date = new Date()
): Promise<void> {
  const ref = userRef(userId)
  const snap = await tx.get(ref)
  const current = readUserDataInTx(userId, snap)

  const update = computeStudySessionUpdate(current, now)

  if (snap.exists) {
    tx.update(ref, update)
  } else {
    // First-time write — initialize required fields
    tx.set(ref, {
      ...update,
      timezone: DEFAULT_TIMEZONE,
      dailyGoal: DEFAULT_DAILY_GOAL,
      streakFreezes: 0,
      createdAt: FieldValue.serverTimestamp(),
    })
  }
}
