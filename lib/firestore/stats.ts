import { cache } from 'react'
import { adminDb } from '@/lib/firebase/admin'
import { Timestamp } from 'firebase-admin/firestore'
import { dateKeyForTimezone, type ReviewEventDoc } from '@/lib/firestore/review-events'
import { DEFAULT_TIMEZONE, isValidTimezone } from '@/lib/utils/timezone'
import type { FsrsStateName } from '@/lib/types'
import type { FsrsRating } from '@/lib/fsrs/scheduler'

export type UserStats = {
  folderCount: number
  deckCount: number
  cardCount: number
  masteredCount: number
  learningCount: number
  newCount: number
  totalReps: number
  totalLapses: number
  dueTodayCount: number
}

interface CardDocLite {
  state?: FsrsStateName
  reps?: number
  lapses?: number
  due?: Timestamp
  stability?: number
  folderId?: string
}

interface DeckDocLite {
  folderId: string
  cardCount: number
  title: string
  icon?: string | null
}

interface FolderDocLite {
  name: string
  icon?: string | null
}

// ====================================================================
// Original headline aggregate
// ====================================================================
export const getUserStats = cache(async (userId: string): Promise<UserStats> => {
  const userRef = adminDb.collection('users').doc(userId)

  const [foldersSnap, decksSnap] = await Promise.all([
    userRef.collection('folders').count().get(),
    userRef.collection('decks').get(),
  ])

  const cardsResults = await Promise.all(
    decksSnap.docs.map((deckDoc) => deckDoc.ref.collection('cards').get())
  )

  let cardCount = 0
  let masteredCount = 0
  let learningCount = 0
  let newCount = 0
  let totalReps = 0
  let totalLapses = 0
  let dueTodayCount = 0
  const now = Date.now()

  for (const cardsSnap of cardsResults) {
    cardCount += cardsSnap.size
    cardsSnap.docs.forEach((doc) => {
      const data = doc.data() as CardDocLite
      const state: FsrsStateName = data.state ?? 'new'

      if (state === 'review') masteredCount++
      else if (state === 'learning' || state === 'relearning') learningCount++
      else newCount++

      totalReps += data.reps ?? 0
      totalLapses += data.lapses ?? 0

      if (state !== 'new' && data.due && data.due.toMillis() <= now) {
        dueTodayCount++
      }
    })
  }

  return {
    folderCount: foldersSnap.data().count,
    deckCount: decksSnap.size,
    cardCount,
    masteredCount,
    learningCount,
    newCount,
    totalReps,
    totalLapses,
    dueTodayCount,
  }
})

// ====================================================================
// Daily activity (heatmap + reviews/day chart)
// ====================================================================
export type DailyActivity = {
  date: string         // YYYY-MM-DD
  reviewCount: number
  newCount: number     // first-time reviews (prev state was new)
  totalCount: number
}

/**
 * Aggregate review events by day for last N days.
 * Returns array sorted oldest → newest, days without activity = 0 counts.
 */
export const getDailyActivity = cache(async (
  userId: string,
  days: number = 84,
  timezone: string = DEFAULT_TIMEZONE
): Promise<DailyActivity[]> => {
  const tz = isValidTimezone(timezone) ? timezone : DEFAULT_TIMEZONE

  const now = new Date()
  const fromDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

  const snap = await adminDb
    .collection('users').doc(userId)
    .collection('review_events')
    .where('timestamp', '>=', Timestamp.fromDate(fromDate))
    .get()

  const byDate = new Map<string, { review: number; new: number }>()
  snap.docs.forEach((doc) => {
    const data = doc.data() as ReviewEventDoc
    const key = data.dateKey || dateKeyForTimezone(data.timestamp.toDate(), tz)
    const entry = byDate.get(key) ?? { review: 0, new: 0 }
    entry.review++
    if (data.prevState === 'new') entry.new++
    byDate.set(key, entry)
  })

  // Build dense array for last N days (including empty days)
  const result: DailyActivity[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const key = dateKeyForTimezone(d, tz)
    const entry = byDate.get(key) ?? { review: 0, new: 0 }
    result.push({
      date: key,
      reviewCount: entry.review - entry.new,
      newCount: entry.new,
      totalCount: entry.review,
    })
  }
  return result
})

// ====================================================================
// Forecast — cards due over next N days
// ====================================================================
export type ForecastDay = {
  date: string
  dayLabel: string  // "Hari ini", "Besok", "Sen", etc.
  count: number
}

export const getForecast = cache(async (
  userId: string,
  days: number = 14,
  timezone: string = DEFAULT_TIMEZONE
): Promise<ForecastDay[]> => {
  const tz = isValidTimezone(timezone) ? timezone : DEFAULT_TIMEZONE
  const now = new Date()

  const decksSnap = await adminDb.collection('users').doc(userId).collection('decks').get()
  const allCardSnaps = await Promise.all(
    decksSnap.docs.map((d) => d.ref.collection('cards').where('state', 'in', ['learning', 'review', 'relearning']).get())
  )

  const counts = new Map<string, number>()
  for (const snap of allCardSnaps) {
    snap.docs.forEach((doc) => {
      const data = doc.data() as CardDocLite
      if (!data.due) return
      const dueDate = data.due.toDate()
      // Bucket by user-local date string
      const key = dateKeyForTimezone(dueDate, tz)
      // Only count if within forecast window (today through +N-1)
      counts.set(key, (counts.get(key) ?? 0) + 1)
    })
  }

  // Build ordered result for next N days
  const result: ForecastDay[] = []
  const todayKey = dateKeyForTimezone(now, tz)

  // Sum overdue (everything <= today) into "today" bucket
  let overdueAndToday = 0
  for (const [key, count] of counts) {
    if (key <= todayKey) overdueAndToday += count
  }

  for (let i = 0; i < days; i++) {
    const d = new Date(now.getTime() + i * 24 * 60 * 60 * 1000)
    const key = dateKeyForTimezone(d, tz)
    let count: number
    if (i === 0) {
      count = overdueAndToday
    } else {
      count = counts.get(key) ?? 0
    }

    let label: string
    if (i === 0) label = 'Hari ini'
    else if (i === 1) label = 'Besok'
    else {
      const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
      label = dayNames[d.getDay()]
    }

    result.push({ date: key, dayLabel: label, count })
  }
  return result
})

// ====================================================================
// Retention rate — % of recent reviews where rating was Good or Easy
// ====================================================================
export type RetentionStat = {
  rate: number       // 0-1
  totalReviews: number
  windowDays: number
}

export const getRetentionRate = cache(async (
  userId: string,
  days: number = 30
): Promise<RetentionStat> => {
  const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const snap = await adminDb
    .collection('users').doc(userId)
    .collection('review_events')
    .where('timestamp', '>=', Timestamp.fromDate(fromDate))
    .get()

  // Only count reviews of cards already in 'review' state (mature cards)
  // Rating 'Good' or 'Easy' = remembered; 'Again' or 'Hard' = forgotten/struggled
  let total = 0
  let remembered = 0
  snap.docs.forEach((doc) => {
    const data = doc.data() as ReviewEventDoc
    // Only count "real" reviews (skip first-time learning)
    if (data.prevState !== 'review' && data.prevState !== 'relearning') return
    total++
    const rating = data.rating as FsrsRating
    if (rating === 'Good' || rating === 'Easy') remembered++
  })

  return {
    rate: total > 0 ? remembered / total : 0,
    totalReviews: total,
    windowDays: days,
  }
})

// ====================================================================
// Mastery per Folder
// ====================================================================
export type FolderMastery = {
  folderId: string
  folderName: string
  folderIcon: string | null
  totalCards: number
  newCount: number
  learningCount: number
  masteredCount: number
  masteryPct: number
}

export const getMasteryByFolder = cache(async (userId: string): Promise<FolderMastery[]> => {
  const userRef = adminDb.collection('users').doc(userId)

  const [foldersSnap, decksSnap] = await Promise.all([
    userRef.collection('folders').get(),
    userRef.collection('decks').get(),
  ])

  // Map deckId → folderId for fast lookup
  const deckToFolder = new Map<string, string>()
  decksSnap.docs.forEach((doc) => {
    const data = doc.data() as DeckDocLite
    deckToFolder.set(doc.id, data.folderId)
  })

  // Aggregate cards per folder
  const folderAgg = new Map<string, { total: number; newC: number; learning: number; mastered: number }>()

  await Promise.all(
    decksSnap.docs.map(async (deckDoc) => {
      const folderId = deckDoc.data().folderId as string
      if (!folderId) return
      const cardsSnap = await deckDoc.ref.collection('cards').get()
      const agg = folderAgg.get(folderId) ?? { total: 0, newC: 0, learning: 0, mastered: 0 }
      cardsSnap.docs.forEach((c) => {
        const state = (c.data() as CardDocLite).state ?? 'new'
        agg.total++
        if (state === 'review') agg.mastered++
        else if (state === 'learning' || state === 'relearning') agg.learning++
        else agg.newC++
      })
      folderAgg.set(folderId, agg)
    })
  )

  return foldersSnap.docs
    .map((doc) => {
      const folderData = doc.data() as FolderDocLite
      const agg = folderAgg.get(doc.id) ?? { total: 0, newC: 0, learning: 0, mastered: 0 }
      return {
        folderId: doc.id,
        folderName: folderData.name,
        folderIcon: folderData.icon ?? null,
        totalCards: agg.total,
        newCount: agg.newC,
        learningCount: agg.learning,
        masteredCount: agg.mastered,
        masteryPct: agg.total > 0 ? Math.round((agg.mastered / agg.total) * 100) : 0,
      }
    })
    .sort((a, b) => b.totalCards - a.totalCards)
})

// ====================================================================
// Interval distribution (FSRS stability buckets)
// ====================================================================
export type IntervalBucket = {
  label: string
  range: string
  count: number
}

export const getIntervalDistribution = cache(async (userId: string): Promise<IntervalBucket[]> => {
  const decksSnap = await adminDb.collection('users').doc(userId).collection('decks').get()

  const cardsResults = await Promise.all(
    decksSnap.docs.map((deckDoc) =>
      deckDoc.ref.collection('cards').where('state', 'in', ['learning', 'review', 'relearning']).get()
    )
  )

  // Buckets in days
  const buckets = [
    { label: '< 1 hari', range: '<1d', count: 0, max: 1 },
    { label: '1-7 hari', range: '1-7d', count: 0, max: 7 },
    { label: '1-4 minggu', range: '1-4w', count: 0, max: 30 },
    { label: '1-3 bulan', range: '1-3m', count: 0, max: 90 },
    { label: '3 bln-1 thn', range: '3m-1y', count: 0, max: 365 },
    { label: '> 1 tahun', range: '>1y', count: 0, max: Infinity },
  ]

  for (const snap of cardsResults) {
    snap.docs.forEach((doc) => {
      const data = doc.data() as CardDocLite
      const stability = data.stability ?? 0
      for (const bucket of buckets) {
        if (stability < bucket.max) {
          bucket.count++
          break
        }
      }
    })
  }

  return buckets.map(({ label, range, count }) => ({ label, range, count }))
})

// ====================================================================
// Personal Records
// ====================================================================
export type PersonalRecords = {
  longestStreak: number
  bestDayCount: number          // Most reviews in a single day
  largestDeckSize: number
  largestDeckTitle: string
  totalDaysStudied: number
}

export const getPersonalRecords = cache(async (
  userId: string,
  timezone: string = DEFAULT_TIMEZONE
): Promise<PersonalRecords> => {
  const tz = isValidTimezone(timezone) ? timezone : DEFAULT_TIMEZONE

  const userRef = adminDb.collection('users').doc(userId)
  const [userSnap, decksSnap, eventsSnap] = await Promise.all([
    userRef.get(),
    userRef.collection('decks').get(),
    userRef.collection('review_events').get(),
  ])

  const userData = userSnap.exists ? (userSnap.data() as { longestStreak?: number }) : {}
  const longestStreak = userData.longestStreak ?? 0

  // Largest deck
  let largestDeckSize = 0
  let largestDeckTitle = ''
  decksSnap.docs.forEach((doc) => {
    const data = doc.data() as DeckDocLite
    if (data.cardCount > largestDeckSize) {
      largestDeckSize = data.cardCount
      largestDeckTitle = data.title
    }
  })

  // Best day + total days
  const dayCount = new Map<string, number>()
  eventsSnap.docs.forEach((doc) => {
    const data = doc.data() as ReviewEventDoc
    const key = data.dateKey || dateKeyForTimezone(data.timestamp.toDate(), tz)
    dayCount.set(key, (dayCount.get(key) ?? 0) + 1)
  })

  let bestDayCount = 0
  for (const c of dayCount.values()) if (c > bestDayCount) bestDayCount = c

  return {
    longestStreak,
    bestDayCount,
    largestDeckSize,
    largestDeckTitle,
    totalDaysStudied: dayCount.size,
  }
})
