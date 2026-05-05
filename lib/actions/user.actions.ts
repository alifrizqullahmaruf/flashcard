'use server'
import { revalidatePath } from 'next/cache'
import { getCurrentUserId } from '@/lib/auth'
import { setUserLanguage as setUserLanguageInDb } from '@/lib/firestore/user'
import type { ActionResult, Locale } from '@/lib/types'

export async function setUserLanguage(language: Locale): Promise<ActionResult<void>> {
  const userId = await getCurrentUserId()
  if (!userId) return { success: false, error: 'Unauthorized' }
  if (language !== 'id' && language !== 'en') {
    return { success: false, error: 'Invalid language' }
  }

  try {
    await setUserLanguageInDb(userId, language)
    revalidatePath('/', 'layout')
    return { success: true, data: undefined }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update language' }
  }
}
