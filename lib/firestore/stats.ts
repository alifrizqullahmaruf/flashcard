import { adminDb } from '@/lib/firebase/admin'
import { Timestamp } from 'firebase-admin/firestore'
import type { FsrsStateName } from '@/lib/types'

export type UserStats = {
  folderCount: number
  deckCount: number
  cardCount: number
  // FSRS aggregates
  masteredCount: number      // cards in 'review' state — sudah dikuasai
  learningCount: number      // cards in 'learning' or 'relearning' state — sedang dipelajari
  newCount: number           // cards in 'new' state — belum disentuh
  totalReps: number          // total review sessions across all cards
  totalLapses: number        // total times user forgot a card
  dueTodayCount: number      // cards due now or earlier (need review)
}

interface CardDocLite {
  state?: FsrsStateName
  reps?: number
  lapses?: number
  due?: Timestamp
}

export async function getUserStats(userId: string): Promise<UserStats> {
  const userRef = adminDb.collection('users').doc(userId)

  const [foldersSnap, decksSnap] = await Promise.all([
    userRef.collection('folders').count().get(),
    userRef.collection('decks').get(),
  ])

  // Read all cards across all decks in parallel
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
}
