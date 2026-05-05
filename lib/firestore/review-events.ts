import { adminDb } from '@/lib/firebase/admin'
import { Timestamp, type Transaction, type WriteBatch } from 'firebase-admin/firestore'
import type { FsrsRating } from '@/lib/fsrs/scheduler'
import type { FsrsStateName } from '@/lib/types'

/**
 * Review event log — append-only ledger of every card rating.
 * Powers: daily activity heatmap, retention %, reviews-per-day chart.
 *
 * Path: users/{uid}/review_events/{eventId}
 *
 * Note: kept as flat collection (not nested under deck/card) for efficient
 * range queries by date.
 */

export interface ReviewEvent {
  cardId: string
  deckId: string
  rating: FsrsRating
  prevState: FsrsStateName
  newState: FsrsStateName
  timestamp: Date
}

export interface ReviewEventDoc {
  cardId: string
  deckId: string
  rating: FsrsRating
  prevState: FsrsStateName
  newState: FsrsStateName
  timestamp: Timestamp
  // Denormalized date string (YYYY-MM-DD in user timezone) for efficient grouping
  dateKey: string
}

function userEventsRef(userId: string) {
  return adminDb.collection('users').doc(userId).collection('review_events')
}

/**
 * Format date as YYYY-MM-DD in given timezone.
 * Used as group key for daily aggregations (heatmap, charts).
 */
export function dateKeyForTimezone(date: Date, timezone: string): string {
  try {
    // sv-SE returns ISO format YYYY-MM-DD
    return new Intl.DateTimeFormat('sv-SE', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date)
  } catch {
    return new Intl.DateTimeFormat('sv-SE').format(date)
  }
}

/**
 * Append a review event INSIDE an existing Firestore transaction.
 * Caller must have already done all reads.
 */
export function logReviewEventInTx(
  tx: Transaction,
  userId: string,
  event: ReviewEvent,
  timezone: string
): void {
  const ref = userEventsRef(userId).doc()
  tx.set(ref, {
    cardId: event.cardId,
    deckId: event.deckId,
    rating: event.rating,
    prevState: event.prevState,
    newState: event.newState,
    timestamp: Timestamp.fromDate(event.timestamp),
    dateKey: dateKeyForTimezone(event.timestamp, timezone),
  })
}

/**
 * Batch helper for seed scripts / non-transactional logging.
 */
export function logReviewEventInBatch(
  batch: WriteBatch,
  userId: string,
  event: ReviewEvent,
  timezone: string
): void {
  const ref = userEventsRef(userId).doc()
  batch.set(ref, {
    cardId: event.cardId,
    deckId: event.deckId,
    rating: event.rating,
    prevState: event.prevState,
    newState: event.newState,
    timestamp: Timestamp.fromDate(event.timestamp),
    dateKey: dateKeyForTimezone(event.timestamp, timezone),
  })
}

/**
 * Read review events within a time range, ordered by timestamp ascending.
 */
export async function getReviewEventsBetween(
  userId: string,
  fromDate: Date,
  toDate: Date
): Promise<ReviewEvent[]> {
  const snap = await userEventsRef(userId)
    .where('timestamp', '>=', Timestamp.fromDate(fromDate))
    .where('timestamp', '<=', Timestamp.fromDate(toDate))
    .orderBy('timestamp', 'asc')
    .get()

  return snap.docs.map((doc) => {
    const data = doc.data() as ReviewEventDoc
    return {
      cardId: data.cardId,
      deckId: data.deckId,
      rating: data.rating,
      prevState: data.prevState,
      newState: data.newState,
      timestamp: data.timestamp.toDate(),
    }
  })
}
