import { adminDb } from '@/lib/firebase/admin'

export type UserStats = {
  folderCount: number
  deckCount: number
  cardCount: number
}

export async function getUserStats(userId: string): Promise<UserStats> {
  const userRef = adminDb.collection('users').doc(userId)

  const [foldersSnap, decksSnap] = await Promise.all([
    userRef.collection('folders').count().get(),
    userRef.collection('decks').get(),
  ])

  let cardCount = 0
  decksSnap.docs.forEach((doc) => {
    const data = doc.data() as { cardCount?: number }
    cardCount += data.cardCount ?? 0
  })

  return {
    folderCount: foldersSnap.data().count,
    deckCount: decksSnap.size,
    cardCount,
  }
}
