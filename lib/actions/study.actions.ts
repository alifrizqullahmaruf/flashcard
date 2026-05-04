'use server'
import { revalidatePath } from 'next/cache'
import { getCurrentUserId } from '@/lib/auth'
import { rateCardInTransaction } from '@/lib/firestore/cards'
import type { FsrsRating } from '@/lib/fsrs/scheduler'
import type { ActionResult } from '@/lib/types'

const VALID_RATINGS: ReadonlyArray<FsrsRating> = ['Again', 'Hard', 'Good', 'Easy']

export async function rateCard(
  deckId: string,
  cardId: string,
  rating: FsrsRating
): Promise<ActionResult<void>> {
  const userId = await getCurrentUserId()
  if (!userId) return { success: false, error: 'Unauthorized' }
  if (!deckId || !cardId) return { success: false, error: 'Deck atau kartu tidak valid' }
  if (!VALID_RATINGS.includes(rating)) return { success: false, error: 'Rating tidak valid' }

  try {
    await rateCardInTransaction(userId, deckId, cardId, rating)
    revalidatePath(`/decks/${deckId}`)
    return { success: true, data: undefined }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Gagal menyimpan rating' }
  }
}
