'use client'
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'

let cachedApp: FirebaseApp | null = null

function getFirebaseApp(): FirebaseApp {
  if (cachedApp) return cachedApp
  if (getApps().length) {
    cachedApp = getApp()
    return cachedApp
  }

  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }

  if (!config.apiKey) {
    throw new Error(
      'Firebase Web env vars belum lengkap. Pastikan NEXT_PUBLIC_FIREBASE_* terisi di .env.local (lokal) atau Vercel Dashboard (production).'
    )
  }

  cachedApp = initializeApp(config)
  return cachedApp
}

/**
 * Lazy-initialized Firebase Auth.
 * Init terjadi saat property pertama diakses (bukan saat module load),
 * sehingga aman untuk prerender / build tanpa env vars.
 */
export const auth: Auth = new Proxy({} as Auth, {
  get(_, prop) {
    const a = getAuth(getFirebaseApp())
    const value = (a as unknown as Record<string | symbol, unknown>)[prop as string]
    return typeof value === 'function' ? value.bind(a) : value
  },
})
