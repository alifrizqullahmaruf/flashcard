import { cookies } from 'next/headers'
import { adminAuth } from '@/lib/firebase/admin'

const SESSION_COOKIE_NAME = 'firebase-session'

export async function getCurrentUser(): Promise<{ uid: string; email: string | null } | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!session) return null

  try {
    const decoded = await adminAuth.verifySessionCookie(session, true)
    return { uid: decoded.uid, email: decoded.email ?? null }
  } catch {
    return null
  }
}

export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser()
  return user?.uid ?? null
}

export { SESSION_COOKIE_NAME }
