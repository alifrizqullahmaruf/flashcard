/* Klar service worker — offline support for the German app (/de, /mulai).
 * Pages: network-first (fresh when online, cached when offline).
 * Static assets & audio: cache-first (hashed / immutable files).
 * The old Hafalin app (login, folders, Firebase) is never cached.
 * Bump CACHE when the caching logic changes; old caches are deleted on activate.
 */
const CACHE = 'klar-v1'
const OFFLINE_URL = '/de/offline'
const PRECACHE = ['/de', '/mulai', OFFLINE_URL, '/icons/icon-192.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => Promise.all(PRECACHE.map((u) => cache.add(u).catch(() => undefined))))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('klar-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

const isKlarPage = (p) => p === '/' || /^\/(de|mulai)(\/|$)/.test(p)
const isStatic = (p) => p.startsWith('/_next/static/') || p.startsWith('/audio/') || p.startsWith('/icons/') || /\/(icon|apple-icon)[^/]*\.(svg|png)$/.test(p)

async function networkFirst(request) {
  const cache = await caches.open(CACHE)
  try {
    const res = await fetch(request)
    if (res.ok && res.type === 'basic') cache.put(request, res.clone())
    return res
  } catch {
    const hit = (await cache.match(request, { ignoreSearch: true })) || (await cache.match(OFFLINE_URL))
    return hit || Response.error()
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE)
  const hit = await cache.match(request)
  if (hit) return hit
  const res = await fetch(request)
  // audio may come back as a 206 range response; only store full 200 responses
  if (res.status === 200) cache.put(request, res.clone())
  return res
}

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return

  // Next.js client-navigation data (RSC): go to network; if offline, Next falls
  // back to a full page load, which is then served from the page cache below.
  if (url.searchParams.has('_rsc') || req.headers.get('RSC') === '1') return

  if (isStatic(url.pathname)) {
    event.respondWith(cacheFirst(req))
    return
  }
  if (req.mode === 'navigate' && isKlarPage(url.pathname)) {
    event.respondWith(networkFirst(req))
  }
  // everything else (old app, auth, APIs) → default network behaviour
})
