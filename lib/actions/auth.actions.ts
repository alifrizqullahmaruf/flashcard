'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { adminAuth } from '@/lib/firebase/admin'
import { SESSION_COOKIE_NAME } from '@/lib/auth'

const SESSION_DURATION_MS = 5 * 24 * 60 * 60 * 1000 // 5 hari

export async function createSession(idToken: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Verifikasi idToken dulu sebelum buat session cookie
    const decoded = await adminAuth.verifyIdToken(idToken)
    if (!decoded.uid) return { success: false, error: 'Invalid token' }

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION_MS,
    })

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      maxAge: SESSION_DURATION_MS / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    })
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Login gagal' }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
  redirect('/login')
}
