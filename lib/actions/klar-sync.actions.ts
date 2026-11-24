'use server'
/**
 * Klar progress sync on the server (Firebase Admin), authenticated by the
 * httpOnly session cookie — the same pattern as the rest of the app, so it
 * does not depend on client-side Firestore security rules.
 *
 * Data: users/{uid}/de_state/{key} = { v: <JSON string>, updatedAt }
 */
import { FieldValue } from 'firebase-admin/firestore'
import { adminDb } from '@/lib/firebase/admin'
import { getCurrentUserId } from '@/lib/auth'

type Result<T> = { ok: true; data: T } | { ok: false; error: 'unauthenticated' | 'invalid' | 'server' }

/** Same rule as isSyncKey in lib/de/progress.ts (kept here so the server validates input). */
const SYNC_KEY = /^de:(srs|gsrs|topic|new|known):[a-z0-9:_-]+$|^de:(streak|profile)$/i
const MAX_VALUE = 500_000 // bytes per document value (Firestore limit is 1 MiB)
const MAX_ENTRIES = 450

const col = (uid: string) => adminDb.collection('users').doc(uid).collection('de_state')

export async function pullKlarState(): Promise<Result<{ key: string; v: string }[]>> {
  const uid = await getCurrentUserId()
  if (!uid) return { ok: false, error: 'unauthenticated' }
  try {
    const snap = await col(uid).get()
    return { ok: true, data: snap.docs.map((d) => ({ key: d.id, v: String(d.get('v') ?? '') })) }
  } catch (e) {
    console.error('pullKlarState', e)
    return { ok: false, error: 'server' }
  }
}

export async function pushKlarState(entries: { key: string; v: string | null }[]): Promise<Result<number>> {
  const uid = await getCurrentUserId()
  if (!uid) return { ok: false, error: 'unauthenticated' }
  if (!Array.isArray(entries) || entries.length > MAX_ENTRIES) return { ok: false, error: 'invalid' }
  for (const e of entries) {
    if (typeof e?.key !== 'string' || !SYNC_KEY.test(e.key)) return { ok: false, error: 'invalid' }
    if (e.v !== null && (typeof e.v !== 'string' || e.v.length > MAX_VALUE)) return { ok: false, error: 'invalid' }
  }
  try {
    const batch = adminDb.batch()
    for (const e of entries) {
      const ref = col(uid).doc(e.key)
      if (e.v === null) batch.delete(ref)
      else batch.set(ref, { v: e.v, updatedAt: FieldValue.serverTimestamp() })
    }
    await batch.commit()
    return { ok: true, data: entries.length }
  } catch (e) {
    console.error('pushKlarState', e)
    return { ok: false, error: 'server' }
  }
}

export async function deleteKlarState(): Promise<Result<number>> {
  const uid = await getCurrentUserId()
  if (!uid) return { ok: false, error: 'unauthenticated' }
  try {
    const snap = await col(uid).get()
    const batch = adminDb.batch()
    snap.docs.forEach((d) => batch.delete(d.ref))
    await batch.commit()
    return { ok: true, data: snap.size }
  } catch (e) {
    console.error('deleteKlarState', e)
    return { ok: false, error: 'server' }
  }
}
