'use server'
import { getCurrentUserId } from '@/lib/auth'
import { CreateFolderSchema, UpdateFolderSchema } from '@/lib/schemas/folder.schema'
import { revalidatePath } from 'next/cache'
import {
  createFolder as fsCreateFolder,
  updateFolder as fsUpdateFolder,
  deleteFolder as fsDeleteFolder,
} from '@/lib/firestore/folders'
import type { ActionResult } from '@/lib/types'

export async function createFolder(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const userId = await getCurrentUserId()
  if (!userId) return { success: false, error: 'Unauthorized' }

  const parsed = CreateFolderSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    const errs = parsed.error.flatten().fieldErrors
    return { success: false, error: errs.name?.[0] ?? errs.description?.[0] ?? 'Input tidak valid' }
  }

  const id = await fsCreateFolder(
    userId,
    parsed.data.name,
    parsed.data.description ?? null,
    parsed.data.icon && parsed.data.icon.length > 0 ? parsed.data.icon : null
  )

  revalidatePath('/decks')
  return { success: true, data: { id } }
}

export async function updateFolder(folderId: string, formData: FormData): Promise<ActionResult<void>> {
  const userId = await getCurrentUserId()
  if (!userId) return { success: false, error: 'Unauthorized' }

  const parsed = UpdateFolderSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    const errs = parsed.error.flatten().fieldErrors
    return { success: false, error: errs.name?.[0] ?? errs.description?.[0] ?? 'Input tidak valid' }
  }

  const ok = await fsUpdateFolder(
    folderId,
    userId,
    parsed.data.name,
    parsed.data.description ?? null,
    parsed.data.icon && parsed.data.icon.length > 0 ? parsed.data.icon : null
  )
  if (!ok) return { success: false, error: 'Folder tidak ditemukan' }

  revalidatePath('/decks')
  revalidatePath(`/folders/${folderId}`)
  return { success: true, data: undefined }
}

export async function deleteFolder(folderId: string): Promise<ActionResult<void>> {
  const userId = await getCurrentUserId()
  if (!userId) return { success: false, error: 'Unauthorized' }

  const ok = await fsDeleteFolder(folderId, userId)
  if (!ok) return { success: false, error: 'Folder tidak ditemukan' }

  revalidatePath('/decks')
  return { success: true, data: undefined }
}
