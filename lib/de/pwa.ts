'use client'
/**
 * PWA helpers: service-worker registration, install prompt (Android/Chrome),
 * iOS detection, and "download everything for offline" into the SW cache.
 */
import { useSyncExternalStore } from 'react'

export const SW_CACHE = 'klar-v1' // must match public/sw.js

/* ── install prompt store ─────────────────────────── */

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> }

let deferred: BIPEvent | null = null
let installed = false
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

/** Call once on the client (PwaRegister). Captures the install prompt early. */
export function initPwa() {
  if (typeof window === 'undefined' || (window as unknown as { __klarPwa?: boolean }).__klarPwa) return
  ;(window as unknown as { __klarPwa?: boolean }).__klarPwa = true

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault() // we show our own "Pasang Klar" button
    deferred = e as BIPEvent
    emit()
  })
  window.addEventListener('appinstalled', () => {
    installed = true
    deferred = null
    emit()
  })

  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => undefined)
  }
}

export type InstallState = 'installed' | 'prompt' | 'ios' | 'unsupported'

function snapshot(): InstallState {
  const standalone =
    window.matchMedia?.('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true
  if (installed || standalone) return 'installed'
  if (deferred) return 'prompt'
  if (/iphone|ipad|ipod/i.test(navigator.userAgent)) return 'ios'
  return 'unsupported'
}

export function useInstallState(): InstallState | null {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    snapshot,
    () => null,
  )
}

export async function promptInstall(): Promise<boolean> {
  if (!deferred) return false
  await deferred.prompt()
  const { outcome } = await deferred.userChoice
  deferred = null
  emit()
  return outcome === 'accepted'
}

/* ── offline download ─────────────────────────────── */

/** Fetch every URL into the SW cache (plus the JS/CSS each page needs). */
export async function downloadForOffline(urls: string[], onProgress: (done: number, total: number) => void) {
  const cache = await caches.open(SW_CACHE)
  const queue = [...new Set(urls)]
  const seen = new Set(queue)
  let done = 0
  let total = queue.length

  async function worker() {
    while (queue.length) {
      const url = queue.shift()!
      try {
        if (!(await cache.match(url))) {
          const res = await fetch(url, { credentials: 'same-origin' })
          if (res.status === 200) {
            if (url.startsWith('/de') || url === '/mulai') {
              // pages: also grab the hashed JS/CSS chunks they reference
              const html = await res.clone().text()
              for (const m of html.matchAll(/(?:src|href)="(\/_next\/static\/[^"]+)"/g)) {
                if (!seen.has(m[1])) {
                  seen.add(m[1])
                  queue.push(m[1])
                  total++
                }
              }
            }
            await cache.put(url, res)
          }
        }
      } catch {
        /* offline or failed — skip */
      }
      done++
      onProgress(done, total)
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker))
}

/** Rough size of what is already cached (bytes), if the browser exposes it. */
export async function storageEstimate(): Promise<number | null> {
  try {
    const est = await navigator.storage?.estimate?.()
    return est?.usage ?? null
  } catch {
    return null
  }
}
