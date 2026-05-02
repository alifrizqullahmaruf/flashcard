import { adminDb } from '@/lib/firebase/admin'
import { FieldValue, type Timestamp } from 'firebase-admin/firestore'
import type { DeckWithCards, CardData, DeckData, FsrsState, FsrsStateName } from '@/lib/types'

interface DeckDoc {
  title: string
  description: string | null
  userId: string
  folderId: string
  cardCount: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

interface CardDoc {
  soal: string
  jawaban: string
  order: number
  // FSRS state — `state` always present (explicit 'new' on creation)
  state: FsrsStateName
  due?: Timestamp
  stability?: number
  difficulty?: number
  elapsedDays?: number
  scheduledDays?: number
  reps?: number
  lapses?: number
  lastReview?: Timestamp
  // Audit
  createdAt: Timestamp
  updatedAt: Timestamp
}

function deckDocToData(id: string, data: DeckDoc): DeckData {
  return {
    id,
    title: data.title,
    description: data.description,
    folderId: data.folderId,
    userId: data.userId,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  }
}

function readFsrsState(data: CardDoc): FsrsState {
  // Lazy migration: cards without state field default to 'new'
  if (!data.state || data.state === 'new') {
    return { state: 'new' }
  }
  // Validate all required fields present for non-new state — fall back to 'new' if partial
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

function userDecksRef(userId: string) {
  return adminDb.collection('users').doc(userId).collection('decks')
}

function userFoldersRef(userId: string) {
  return adminDb.collection('users').doc(userId).collection('folders')
}

export async function getDeckWithCards(deckId: string, userId: string): Promise<DeckWithCards | null> {
  const deckRef = userDecksRef(userId).doc(deckId)
  const deckSnap = await deckRef.get()
  if (!deckSnap.exists) return null

  const deckData = deckSnap.data() as DeckDoc
  const cardsSnap = await deckRef.collection('cards').orderBy('order', 'asc').get()
  const cards = cardsSnap.docs.map((doc) =>
    cardDocToData(doc.id, deckId, doc.data() as CardDoc)
  )

  return { ...deckDocToData(deckSnap.id, deckData), cards }
}

export async function createDeck(
  userId: string,
  folderId: string,
  title: string,
  description: string | null,
  cards: { soal: string; jawaban: string }[]
): Promise<string> {
  const folderRef = userFoldersRef(userId).doc(folderId)
  const folderSnap = await folderRef.get()
  if (!folderSnap.exists) throw new Error('Folder tidak ditemukan')

  const deckRef = userDecksRef(userId).doc()
  const now = FieldValue.serverTimestamp()
  const batch = adminDb.batch()

  batch.set(deckRef, {
    title,
    description,
    userId,
    folderId,
    cardCount: cards.length,
    createdAt: now,
    updatedAt: now,
  })

  cards.forEach((card, i) => {
    const cardRef = deckRef.collection('cards').doc()
    batch.set(cardRef, {
      soal: card.soal,
      jawaban: card.jawaban,
      order: i,
      state: 'new',
      createdAt: now,
      updatedAt: now,
    })
  })

  batch.update(folderRef, { deckCount: FieldValue.increment(1), updatedAt: now })

  await batch.commit()
  return deckRef.id
}

/**
 * CRITICAL FIX: Diff-based update preserving FSRS state.
 *
 * Cards in input with `id` matching existing → UPDATE content only, preserve FSRS state.
 * Cards in input without `id` → CREATE new with state: 'new'.
 * Existing cards not in input → DELETE (cascades cards/{id}/reviews subcollection).
 */
export async function updateDeck(
  deckId: string,
  userId: string,
  folderId: string,
  title: string,
  description: string | null,
  cards: { id?: string; soal: string; jawaban: string }[]
): Promise<boolean> {
  const deckRef = userDecksRef(userId).doc(deckId)
  const deckSnap = await deckRef.get()
  if (!deckSnap.exists) return false

  const oldData = deckSnap.data() as DeckDoc
  const oldFolderId = oldData.folderId
  const movingFolder = oldFolderId !== folderId

  if (movingFolder) {
    const newFolderSnap = await userFoldersRef(userId).doc(folderId).get()
    if (!newFolderSnap.exists) throw new Error('Folder tidak ditemukan')
  }

  // Fetch existing card ids for diff
  const existingCardsSnap = await deckRef.collection('cards').get()
  const existingIds = new Set(existingCardsSnap.docs.map((d) => d.id))

  // Bucket inputs into update vs create
  const inputIdsSeen = new Set<string>()
  const toUpdate: Array<{ id: string; soal: string; jawaban: string; order: number }> = []
  const toCreate: Array<{ soal: string; jawaban: string; order: number }> = []

  cards.forEach((card, i) => {
    if (card.id && existingIds.has(card.id) && !inputIdsSeen.has(card.id)) {
      inputIdsSeen.add(card.id)
      toUpdate.push({ id: card.id, soal: card.soal, jawaban: card.jawaban, order: i })
    } else {
      // No id, unknown id, or duplicate id → treat as new
      toCreate.push({ soal: card.soal, jawaban: card.jawaban, order: i })
    }
  })

  // Existing cards NOT in input → delete
  const toDelete: string[] = []
  existingCardsSnap.docs.forEach((doc) => {
    if (!inputIdsSeen.has(doc.id)) toDelete.push(doc.id)
  })

  const now = FieldValue.serverTimestamp()
  const batch = adminDb.batch()

  // Update deck doc
  batch.update(deckRef, {
    title,
    description,
    folderId,
    cardCount: cards.length,
    updatedAt: now,
  })

  // Update existing cards (preserve FSRS state — only soal/jawaban/order/updatedAt)
  toUpdate.forEach((card) => {
    const cardRef = deckRef.collection('cards').doc(card.id)
    batch.update(cardRef, {
      soal: card.soal,
      jawaban: card.jawaban,
      order: card.order,
      updatedAt: now,
    })
  })

  // Create new cards with state: 'new' explicit
  toCreate.forEach((card) => {
    const cardRef = deckRef.collection('cards').doc()
    batch.set(cardRef, {
      soal: card.soal,
      jawaban: card.jawaban,
      order: card.order,
      state: 'new',
      createdAt: now,
      updatedAt: now,
    })
  })

  // Delete removed cards
  toDelete.forEach((id) => {
    batch.delete(deckRef.collection('cards').doc(id))
  })

  // Folder move: update deckCount on both sides
  if (movingFolder) {
    batch.update(userFoldersRef(userId).doc(oldFolderId), {
      deckCount: FieldValue.increment(-1),
      updatedAt: now,
    })
    batch.update(userFoldersRef(userId).doc(folderId), {
      deckCount: FieldValue.increment(1),
      updatedAt: now,
    })
  }

  await batch.commit()
  return true
}

export async function deleteDeck(deckId: string, userId: string): Promise<boolean> {
  const deckRef = userDecksRef(userId).doc(deckId)
  const deckSnap = await deckRef.get()
  if (!deckSnap.exists) return false

  const data = deckSnap.data() as DeckDoc
  const batch = adminDb.batch()

  const cardsSnap = await deckRef.collection('cards').get()
  cardsSnap.docs.forEach((doc) => batch.delete(doc.ref))
  batch.delete(deckRef)

  batch.update(userFoldersRef(userId).doc(data.folderId), {
    deckCount: FieldValue.increment(-1),
    updatedAt: FieldValue.serverTimestamp(),
  })

  await batch.commit()
  return true
}
