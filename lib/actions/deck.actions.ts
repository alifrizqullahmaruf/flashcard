'use server'
import { getCurrentUserId } from '@/lib/auth'
import { CreateDeckSchema, UpdateDeckSchema } from '@/lib/schemas/deck.schema'
import { revalidatePath } from 'next/cache'
import {
  createDeck as fsCreateDeck,
  updateDeck as fsUpdateDeck,
  deleteDeck as fsDeleteDeck,
} from '@/lib/firestore/decks'
import type { ActionResult } from '@/lib/types'

type CardRaw = { soal: string; jawaban: string }

function parseCards(rawCards: unknown[]): CardRaw[] {
  return rawCards
    .filter((c): c is CardRaw => !!c && typeof (c as CardRaw).soal === 'string' && typeof (c as CardRaw).jawaban === 'string')
    .slice(0, 200)
}

export async function createDeck(
  formData: FormData,
  rawCards: unknown[],
  folderId: string
): Promise<ActionResult<{ id: string }>> {
  const userId = await getCurrentUserId()
  if (!userId) return { success: false, error: 'Unauthorized' }
  if (!folderId) return { success: false, error: 'Folder wajib dipilih' }

  const parsed = CreateDeckSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success)
    return { success: false, error: parsed.error.flatten().fieldErrors.title?.[0] ?? 'Input tidak valid' }

  const cards = parseCards(rawCards)

  try {
    const id = await fsCreateDeck(
      userId,
      folderId,
      parsed.data.title,
      parsed.data.description ?? null,
      parsed.data.icon && parsed.data.icon.length > 0 ? parsed.data.icon : null,
      cards
    )
    revalidatePath('/decks')
    revalidatePath(`/folders/${folderId}`)
    return { success: true, data: { id } }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Gagal membuat deck' }
  }
}

export async function updateDeck(
  deckId: string,
  formData: FormData,
  rawCards: unknown[],
  folderId: string
): Promise<ActionResult<void>> {
  const userId = await getCurrentUserId()
  if (!userId) return { success: false, error: 'Unauthorized' }
  if (!folderId) return { success: false, error: 'Folder wajib dipilih' }

  const parsed = UpdateDeckSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success)
    return { success: false, error: parsed.error.flatten().fieldErrors.title?.[0] ?? 'Input tidak valid' }

  const cards = parseCards(rawCards)

  try {
    const ok = await fsUpdateDeck(
      deckId,
      userId,
      folderId,
      parsed.data.title,
      parsed.data.description ?? null,
      parsed.data.icon && parsed.data.icon.length > 0 ? parsed.data.icon : null,
      cards,
    )
    if (!ok) return { success: false, error: 'Deck tidak ditemukan' }

    revalidatePath(`/decks/${deckId}`)
    revalidatePath('/decks')
    revalidatePath(`/folders/${folderId}`)
    return { success: true, data: undefined }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Gagal menyimpan' }
  }
}

export async function deleteDeck(deckId: string): Promise<ActionResult<void>> {
  const userId = await getCurrentUserId()
  if (!userId) return { success: false, error: 'Unauthorized' }

  const ok = await fsDeleteDeck(deckId, userId)
  if (!ok) return { success: false, error: 'Deck tidak ditemukan' }

  revalidatePath('/decks')
  return { success: true, data: undefined }
}
