import { initializeApp, getApps, cert, type App } from 'firebase-admin/app'
import { getAuth, type Auth } from 'firebase-admin/auth'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

let cachedApp: App | null = null

function getAdminApp(): App {
  if (cachedApp) return cachedApp
  if (getApps().length) {
    cachedApp = getApps()[0]!
    return cachedApp
  }

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  let privateKey = process.env.FIREBASE_PRIVATE_KEY

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      `Firebase Admin env vars belum lengkap: ${[
        !projectId && 'FIREBASE_PROJECT_ID',
        !clientEmail && 'FIREBASE_CLIENT_EMAIL',
        !privateKey && 'FIREBASE_PRIVATE_KEY',
      ].filter(Boolean).join(', ')}`
    )
  }

  // Strip wrapping quotes (kalau env tersimpan dengan kutip)
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1)
  }
  // Convert literal \n menjadi newline asli
  privateKey = privateKey.replace(/\\n/g, '\n')

  try {
    cachedApp = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    })
    return cachedApp
  } catch (err) {
    console.error('[firebase-admin] Init failed:', err)
    throw new Error(
      `Firebase Admin init gagal: ${err instanceof Error ? err.message : String(err)}`
    )
  }
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp())
}

export const adminAuth = new Proxy({} as Auth, {
  get(_, prop) {
    const auth = getAdminAuth()
    const value = (auth as unknown as Record<string | symbol, unknown>)[prop as string]
    return typeof value === 'function' ? value.bind(auth) : value
  },
})

export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp())
}

export const adminDb = new Proxy({} as Firestore, {
  get(_, prop) {
    const db = getAdminDb()
    const value = (db as unknown as Record<string | symbol, unknown>)[prop as string]
    return typeof value === 'function' ? value.bind(db) : value
  },
})
