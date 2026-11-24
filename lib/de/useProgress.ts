'use client'
import { useMemo, useSyncExternalStore } from 'react'
import { PROGRESS_EVENT } from './progress'

function subscribe(cb: () => void) {
  window.addEventListener(PROGRESS_EVENT, cb)
  window.addEventListener('storage', cb) // other tabs
  return () => {
    window.removeEventListener(PROGRESS_EVENT, cb)
    window.removeEventListener('storage', cb)
  }
}

/**
 * Reads localStorage-backed progress without hydration mismatches:
 * returns null on the server / first paint, then the live value,
 * and re-renders whenever progress is written.
 * The selector result must be JSON-serialisable (it is compared as a string).
 */
export function useProgress<T>(select: () => T): T | null {
  const snap = useSyncExternalStore(
    subscribe,
    () => JSON.stringify(select()),
    () => null,
  )
  return useMemo(() => (snap === null ? null : (JSON.parse(snap) as T)), [snap])
}
