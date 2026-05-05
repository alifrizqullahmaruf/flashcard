import { cache } from 'react'
import { adminDb } from '@/lib/firebase/admin'
import { FieldValue, type Timestamp } from 'firebase-admin/firestore'
import type { FolderData, FolderWithCount, DeckWithCount } from '@/lib/types'

interface FolderDoc {
  name: string
  description: string | null
  icon?: string | null
  userId: string
  deckCount: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

interface DeckDoc {
  title: string
  description: string | null
  icon?: string | null
  userId: string
  folderId: string
  cardCount: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

function folderDocToData(id: string, data: FolderDoc): FolderData {
  return {
    id,
    name: data.name,
    description: data.description,
    icon: data.icon ?? null,
    userId: data.userId,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  }
}

function userFoldersRef(userId: string) {
  return adminDb.collection('users').doc(userId).collection('folders')
}

function userDecksRef(userId: string) {
  return adminDb.collection('users').doc(userId).collection('decks')
}

export const getFolders = cache(async (userId: string): Promise<FolderWithCount[]> => {
  const snap = await userFoldersRef(userId).orderBy('createdAt', 'desc').get()
  return snap.docs.map((doc) => {
    const data = doc.data() as FolderDoc
    return {
      ...folderDocToData(doc.id, data),
      _count: { decks: data.deckCount ?? 0 },
    }
  })
})

export async function getFolderById(folderId: string, userId: string): Promise<FolderData | null> {
  const snap = await userFoldersRef(userId).doc(folderId).get()
  if (!snap.exists) return null
  return folderDocToData(snap.id, snap.data() as FolderDoc)
}

export async function getDecksInFolder(folderId: string, userId: string): Promise<DeckWithCount[]> {
  const snap = await userDecksRef(userId)
    .where('folderId', '==', folderId)
    .orderBy('createdAt', 'desc')
    .get()
  return snap.docs.map((doc) => {
    const data = doc.data() as DeckDoc
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      icon: data.icon ?? null,
      folderId: data.folderId,
      userId: data.userId,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      _count: { cards: data.cardCount ?? 0 },
    }
  })
}

export async function createFolder(
  userId: string,
  name: string,
  description: string | null,
  icon: string | null
): Promise<string> {
  const ref = userFoldersRef(userId).doc()
  const now = new Date()
  await ref.set({
    name,
    description,
    icon,
    userId,
    deckCount: 0,
    createdAt: now,
    updatedAt: now,
  })
  return ref.id
}

export async function updateFolder(
  folderId: string,
  userId: string,
  name: string,
  description: string | null,
  icon: string | null
): Promise<boolean> {
  const ref = userFoldersRef(userId).doc(folderId)
  const snap = await ref.get()
  if (!snap.exists) return false

  await ref.update({ name, description, icon, updatedAt: new Date() })
  return true
}

export async function deleteFolder(folderId: string, userId: string): Promise<boolean> {
  const folderRef = userFoldersRef(userId).doc(folderId)
  const folderSnap = await folderRef.get()
  if (!folderSnap.exists) return false

  // Cascade delete: hapus semua deck di folder ini (beserta cards-nya)
  const decksSnap = await userDecksRef(userId).where('folderId', '==', folderId).get()

  for (const deckDoc of decksSnap.docs) {
    const cardsSnap = await deckDoc.ref.collection('cards').get()
    const batch = adminDb.batch()
    cardsSnap.docs.forEach((c) => batch.delete(c.ref))
    batch.delete(deckDoc.ref)
    await batch.commit()
  }

  await folderRef.delete()
  return true
}

export async function incrementDeckCount(folderId: string, userId: string, delta: number): Promise<void> {
  const ref = userFoldersRef(userId).doc(folderId)
  await ref.update({ deckCount: FieldValue.increment(delta), updatedAt: new Date() })
}
