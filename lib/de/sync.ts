'use client'
/**
 * Klar progress sync — local-first.
 *
 * Every synced localStorage key (see isSyncKey) is mirrored as one Firestore
 * document: users/{uid}/de_state/{key} = { v: <JSON string>, updatedAt }.
 * ~40 small documents per learner (one per category / topic / day), so writes
 * stay cheap and far below Firestore's 1 MB document limit.
 *
 * pull  → merge remote into local (field-level rules below), re-mark keys that
 *         still differ so the merged result is pushed back.
 * push  → write the "dirty" keys in one batch (debounced after each change,
 *         on reconnect and when the app goes to the background).
 */
import { useSyncExternalStore } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { collection, deleteDoc, doc, getDocs, serverTimestamp, writeBatch } from 'firebase/firestore'
import { auth, clientDb, hasFirebaseConfig } from '@/lib/firebase/client'
import { PROGRESS_EVENT, clearDirty, dirtyKeys, isSyncKey, markDirty } from './progress'

type Card = { due?: string; last_review?: string | null; reps?: number }
type Json = Record<string, unknown>

/* ── merge rules ───────────────────────────────────── */

const time = (c: Card | undefined) => Date.parse((c?.last_review as string) || '') || Date.parse(c?.due || '') || 0

export function mergeValue(key: string, local: unknown, remote: unknown): unknown {
  if (local == null) return remote
  if (remote == null) return local

  // FSRS maps: per item, the most recently reviewed card wins
  if (/^de:(srs|gsrs):/.test(key)) {
    const a = local as Record<string, Card>
    const b = remote as Record<string, Card>
    const out: Record<string, Card> = { ...b }
    for (const [id, card] of Object.entries(a)) if (!out[id] || time(card) >= time(out[id])) out[id] = card
    return out
  }
  // topic status: earliest read/mastered date, best score
  if (key.startsWith('de:topic:')) {
    const a = local as Json
    const b = remote as Json
    const min = (x: unknown, y: unknown) => (x && y ? (String(x) < String(y) ? x : y) : x || y)
    return { read: min(a.read, b.read), mastered: min(a.mastered, b.mastered), best: Math.max(Number(a.best ?? 0), Number(b.best ?? 0)) || undefined }
  }
  if (key.startsWith('de:new:')) return Math.max(Number(local), Number(remote))
  if (key.startsWith('de:known:')) return [...new Set([...(local as string[]), ...(remote as string[])])]
  if (key === 'de:streak') {
    const a = local as { last: string; count: number }
    const b = remote as { last: string; count: number }
    if (a.last === b.last) return { last: a.last, count: Math.max(a.count, b.count) }
    return a.last > b.last ? a : b
  }
  if (key === 'de:profile') return Number((local as Json).updatedAt ?? 0) >= Number((remote as Json).updatedAt ?? 0) ? local : remote
  return local
}

/* ── status store (for the UI) ─────────────────────── */

export type SyncStatus = { state: 'off' | 'syncing' | 'ok' | 'offline' | 'error'; ready: boolean; at: number | null; user: { name: string | null; email: string | null; photo: string | null } | null }
let status: SyncStatus = { state: 'off', ready: false, at: null, user: null }
const subs = new Set<() => void>()
function setStatus(p: Partial<SyncStatus>) {
  status = { ...status, ...p }
  subs.forEach((f) => f())
}
export function useSyncStatus(): SyncStatus {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb)
      return () => subs.delete(cb)
    },
    () => status,
    () => status,
  )
}

/* ── local helpers ─────────────────────────────────── */

const UID_KEY = 'de:uid'
const readRaw = (k: string) => {
  try {
    return localStorage.getItem(k)
  } catch {
    return null
  }
}
const parse = (s: string | null): unknown => {
  try {
    return s == null ? null : JSON.parse(s)
  } catch {
    return null
  }
}
function localSyncKeys(): string[] {
  const out: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k && isSyncKey(k)) out.push(k)
  }
  return out
}
/** Remove all Klar learning data from this device (keeps app settings). */
export function clearLocalProgress() {
  for (const k of localSyncKeys()) localStorage.removeItem(k)
  for (const k of ['de:dirty', 'de:offline-downloaded']) localStorage.removeItem(k)
  window.dispatchEvent(new Event(PROGRESS_EVENT))
}

/* ── pull / push ───────────────────────────────────── */

const stateCol = (uid: string) => collection(clientDb(), 'users', uid, 'de_state')

async function pull(uid: string) {
  const snap = await getDocs(stateCol(uid))
  for (const d of snap.docs) {
    const key = d.id
    if (!isSyncKey(key)) continue
    const remoteStr = (d.data().v as string) ?? null
    const localStr = readRaw(key)
    const merged = mergeValue(key, parse(localStr), parse(remoteStr))
    const mergedStr = JSON.stringify(merged)
    if (mergedStr !== localStr) localStorage.setItem(key, mergedStr)
    if (mergedStr !== remoteStr) markDirty(key) // local had something newer → push back
  }
  window.dispatchEvent(new Event(PROGRESS_EVENT))
}

let pushing = false
async function push(uid: string) {
  if (pushing) return
  const keys = dirtyKeys()
  if (!keys.length) return
  pushing = true
  try {
    for (let i = 0; i < keys.length; i += 400) {
      const chunk = keys.slice(i, i + 400)
      const batch = writeBatch(clientDb())
      for (const k of chunk) {
        const v = readRaw(k)
        if (v == null) batch.delete(doc(stateCol(uid), k))
        else batch.set(doc(stateCol(uid), k), { v, updatedAt: serverTimestamp() })
      }
      await batch.commit()
      clearDirty(chunk)
    }
  } finally {
    pushing = false
  }
}

/* ── lifecycle ─────────────────────────────────────── */

let currentUid: string | null = null
let timer: ReturnType<typeof setTimeout> | null = null

export async function syncNow() {
  if (!currentUid) return
  if (!navigator.onLine) return setStatus({ state: 'offline', ready: true })
  setStatus({ state: 'syncing' })
  try {
    await pull(currentUid)
    await push(currentUid)
    setStatus({ state: 'ok', at: Date.now(), ready: true })
  } catch {
    setStatus({ state: navigator.onLine ? 'error' : 'offline', ready: true })
  }
}

async function flush() {
  if (!currentUid || !navigator.onLine) return
  try {
    await push(currentUid)
    setStatus({ state: 'ok', at: Date.now() })
  } catch {
    setStatus({ state: 'error' })
  }
}

function onUser(user: User | null) {
  if (!user) {
    currentUid = null
    setStatus({ state: 'off', user: null, ready: true })
    return
  }
  const prev = readRaw(UID_KEY)
  if (prev && prev !== user.uid) clearLocalProgress() // another account used this device before
  if (prev !== user.uid) {
    // first login on this device: upload everything learned so far
    for (const k of localSyncKeys()) markDirty(k)
    localStorage.setItem(UID_KEY, user.uid)
  }
  currentUid = user.uid
  setStatus({ user: { name: user.displayName, email: user.email, photo: user.photoURL } })
  void syncNow()
}

let started = false
/** Start once per page load (mounted in the Klar layouts). */
export function startSync() {
  if (started || typeof window === 'undefined' || !hasFirebaseConfig()) return
  started = true
  onAuthStateChanged(auth, onUser)
  window.addEventListener(PROGRESS_EVENT, () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(flush, 3000)
  })
  window.addEventListener('online', () => void syncNow())
  window.addEventListener('offline', () => setStatus({ state: 'offline' }))
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') void flush()
    else void syncNow()
  })
}

/** Wait for the first sync after login (used by /masuk before routing). */
export async function initialSync(user: User) {
  startSync()
  onUser(user)
  await syncNow()
}

/** Delete this learner's Klar data from the account and from this device. */
export async function deleteKlarData() {
  if (currentUid) {
    const snap = await getDocs(stateCol(currentUid))
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)))
  }
  clearLocalProgress()
}
