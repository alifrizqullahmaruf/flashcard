import { adminDb } from '@/lib/firebase/admin'
import { Timestamp } from 'firebase-admin/firestore'
import { applyRating, type FsrsRating } from '@/lib/fsrs/scheduler'
import { updateStreakInTransaction } from '@/lib/firestore/user'
import type { CardData, FsrsState, FsrsStateName } from '@/lib/types'

interface CardDoc {
  soal: string
  jawaban: string
  order: number
  state: FsrsStateName
  due?: Timestamp
  stability?: number
  difficulty?: number
  elapsedDays?: number
  scheduledDays?: number
  reps?: number
  lapses?: number
  lastReview?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}

function readFsrsState(data: CardDoc): FsrsState {
  if (!data.state || data.state === 'new') return { state: 'new' }
  if (
    data.due === undefined ||
    data.stability === undefined ||
    data.difficulty === undefined ||
    data.elapsedDays === undefined ||
    data.scheduledDays === undefined ||
    data.reps === undefined ||
    data.lapses === undefined ||
    data.lastReview === undefined
  ) {
    return { state: 'new' }
  }
  return {
    state: data.state,
    due: data.due.toDate(),
    stability: data.stability,
    difficulty: data.difficulty,
    elapsedDays: data.elapsedDays,
    scheduledDays: data.scheduledDays,
    reps: data.reps,
    lapses: data.lapses,
    lastReview: data.lastReview.toDate(),
  }
}

function cardDocToData(id: string, deckId: string, data: CardDoc): CardData {
  return {
    id,
    deckId,
    soal: data.soal,
    jawaban: data.jawaban,
    order: data.order,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
    ...readFsrsState(data),
  }
}

function cardRef(userId: string, deckId: string, cardId: string) {
  return adminDb
    .collection('users').doc(userId)
    .collection('decks').doc(deckId)
    .collection('cards').doc(cardId)
}

/**
 * Get cards from a deck that are due for review.
 * Returns cards where state === 'new' OR due <= now.
 * Sorted: new cards first (by order), then due cards (oldest due first).
 */
export async function getDueCards(
  userId: string,
  deckId: string,
  now: Date = new Date()
): Promise<CardData[]> {
  const deckRef = adminDb
    .collection('users').doc(userId)
    .collection('decks').doc(deckId)

  const cardsSnap = await deckRef.collection('cards').get()
  const all = cardsSnap.docs.map((doc) =>
    cardDocToData(doc.id, deckId, doc.data() as CardDoc)
  )

  const due = all.filter((c) => {
    if (c.state === 'new') return true
    return c.due.getTime() <= now.getTime()
  })

  due.sort((a, b) => {
    if (a.state === 'new' && b.state !== 'new') return -1
    if (a.state !== 'new' && b.state === 'new') return 1
    if (a.state === 'new' && b.state === 'new') return a.order - b.order
    if (a.state !== 'new' && b.state !== 'new') return a.due.getTime() - b.due.getTime()
    return 0
  })

  return due
}

function fsrsStateToFirestore(state: FsrsState, now: Date): Record<string, unknown> {
  const base: Record<string, unknown> = {
    state: state.state,
    updatedAt: Timestamp.fromDate(now),
  }
  if (state.state === 'new') return base
  return {
    ...base,
    due: Timestamp.fromDate(state.due),
    stability: state.stability,
    difficulty: state.difficulty,
    elapsedDays: state.elapsedDays,
    scheduledDays: state.scheduledDays,
    reps: state.reps,
    lapses: state.lapses,
    lastReview: Timestamp.fromDate(state.lastReview),
  }
}

/**
 * Apply a rating to a card, computing next FSRS state and writing to Firestore.
 * Uses transaction so concurrent rates don't clobber each other.
 */
export async function rateCardInTransaction(
  userId: string,
  deckId: string,
  cardId: string,
  rating: FsrsRating,
  now: Date = new Date()
): Promise<void> {
  const ref = cardRef(userId, deckId, cardId)

  await adminDb.runTransaction(async (tx) => {
    // ALL READS FIRST (Firestore transaction rule)
    const snap = await tx.get(ref)
    if (!snap.exists) throw new Error('Kartu tidak ditemukan')

    // Read user doc for streak update (also acquires read lock)
    await updateStreakInTransaction(tx, userId, now)

    // Now compute writes
    const card = cardDocToData(snap.id, deckId, snap.data() as CardDoc)
    const { nextState } = applyRating(card, now, rating)
    tx.update(ref, fsrsStateToFirestore(nextState, now))
  })
}
