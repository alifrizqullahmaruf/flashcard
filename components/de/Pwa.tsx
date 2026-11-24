'use client'
import { useEffect, useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import { CircleCheck, CloudDownload, Download, Share, SquarePlus, X } from 'lucide-react'
import { CATEGORIES, LEVELS } from '@/lib/de/content'
import { PRACTICE } from '@/lib/de/exercises'
import MANIFEST from '@/lib/de/audio-manifest.json'
import EXAM_AUDIO from '@/lib/de/exam-audio.json'
import { SETS, TEILE } from '@/lib/de/pruefung'
import { downloadForOffline, initPwa, promptInstall, useInstallState } from '@/lib/de/pwa'

/** Registers the service worker + captures the install prompt. Render once per layout. */
export function PwaRegister() {
  useEffect(() => initPwa(), [])
  return null
}

/* ── "Pasang Klar" ─────────────────────────────────── */

const DISMISS_KEY = 'de:install-dismissed'
const dismissSubscribe = (cb: () => void) => {
  window.addEventListener('storage', cb)
  return () => window.removeEventListener('storage', cb)
}
const readDismissed = () => {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    return false
  }
}

export function InstallCard({ variant }: { variant: 'home' | 'progress' }) {
  const state = useInstallState()
  const dismissed = useSyncExternalStore(dismissSubscribe, readDismissed, () => true)
  const [hidden, setHidden] = useState(false)

  if (!state || state === 'unsupported') return null
  if (variant === 'home' && (state === 'installed' || dismissed || hidden)) return null

  if (state === 'installed') {
    return (
      <div className="bg-surface border border-ink-faint rounded-card-lg px-4 py-3 flex items-center gap-3 text-sm">
        <CircleCheck size={18} className="text-[#15803D] shrink-0" />
        Klar sudah terpasang di perangkat ini.
      </div>
    )
  }

  const close = () => {
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* ignore */
    }
    setHidden(true)
  }

  return (
    <div className="bg-surface border border-ink-faint rounded-card-lg p-4 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <Image src="/icons/icon-192.png" alt="" width={40} height={40} className="rounded-[10px] shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-medium leading-snug">Pasang Klar di HP</p>
          <p className="text-[13px] text-ink-muted leading-snug">Buka langsung dari layar utama, layar penuh, dan bisa dipakai offline.</p>
        </div>
        {variant === 'home' && (
          <button onClick={close} aria-label="Tutup" className="text-ink-subtle -mr-1 -mt-1 p-1">
            <X size={18} />
          </button>
        )}
      </div>
      {state === 'prompt' ? (
        <button onClick={() => promptInstall()} className="h-11 rounded-btn bg-ink text-white font-medium btn-press flex items-center justify-center gap-2">
          <Download size={17} />Pasang Klar
        </button>
      ) : (
        <ol className="text-[13px] text-ink-muted flex flex-col gap-1.5 border-t border-ink-faint pt-3">
          <li className="flex items-center gap-2">
            <span className="de-label w-4">1</span>Ketuk <Share size={15} className="text-ink" /> <b className="text-ink font-medium">Bagikan</b> di Safari
          </li>
          <li className="flex items-center gap-2">
            <span className="de-label w-4">2</span>Pilih <SquarePlus size={15} className="text-ink" /> <b className="text-ink font-medium">Tambah ke Layar Utama</b>
          </li>
          <li className="flex items-center gap-2">
            <span className="de-label w-4">3</span>Ketuk <b className="text-ink font-medium">Tambah</b>
          </li>
        </ol>
      )}
    </div>
  )
}

/* ── "Unduh untuk offline" ─────────────────────────── */

function offlineUrls(): string[] {
  const pages = ['/de', '/mulai', '/de/offline', '/de/materi', '/de/kartu', '/de/progress', '/de/hari-ini', '/de/latihan-artikel', '/de/kredit']
  for (const lv of LEVELS) {
    for (const t of lv.topics) {
      if (!t.body) continue
      pages.push(`/de/materi/${lv.id}/${t.slug}`)
      if (PRACTICE[lv.id]?.[t.slug]) pages.push(`/de/materi/${lv.id}/${t.slug}/latihan`)
    }
    for (const c of CATEGORIES[lv.id]) pages.push(`/de/kartu/${lv.id}/${c.slug}`)
  }
  const audio = Object.values(MANIFEST as Record<string, { tts: string; native?: { src: string } }>).flatMap((e) =>
    e.native ? [e.tts, e.native.src] : [e.tts],
  )
  // exam practice (each set has its own URL) + its listening audio
  pages.push('/de/ujian', '/de/ujian/simulasi')
  for (const [m, parts] of Object.entries(TEILE)) {
    pages.push(`/de/ujian/${m}`)
    for (const t of parts) for (const s of SETS) pages.push(`/de/ujian/${m}/${t.n}?set=${s}`)
  }
  return [...pages, ...audio, ...Object.values(EXAM_AUDIO as Record<string, string>)]
}

const DONE_KEY = 'de:offline-downloaded'

export function OfflineDownload() {
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)
  const [finished, setFinished] = useState(false)
  const already = useSyncExternalStore(dismissSubscribe, () => {
    try {
      return localStorage.getItem(DONE_KEY)
    } catch {
      return null
    }
  }, () => null)
  const supported = useSyncExternalStore(dismissSubscribe, () => 'caches' in window && 'serviceWorker' in navigator, () => true)

  if (!supported) return null
  const running = progress !== null && !finished

  async function start() {
    setFinished(false)
    setProgress({ done: 0, total: 1 })
    await downloadForOffline(offlineUrls(), (done, total) => setProgress({ done, total }))
    try {
      localStorage.setItem(DONE_KEY, new Date().toLocaleDateString('id-ID'))
    } catch {
      /* ignore */
    }
    setFinished(true)
  }

  const pct = progress ? Math.round((progress.done / Math.max(progress.total, 1)) * 100) : 0

  return (
    <div className="bg-surface border border-ink-faint rounded-card-lg p-4 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <CloudDownload size={20} className="text-ink shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium leading-snug">Unduh untuk offline</p>
          <p className="text-[13px] text-ink-muted leading-snug">
            Simpan semua materi, kartu, dan suara A1 (±20 MB) di HP supaya bisa belajar tanpa internet.
            {already && !running && <> Terakhir diunduh: {already}.</>}
          </p>
        </div>
      </div>
      {running ? (
        <div className="flex flex-col gap-1.5">
          <div className="h-1 rounded-pill bg-bg-soft overflow-hidden">
            <div className="h-full bg-ink transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs text-ink-subtle">Mengunduh… {pct}% ({progress!.done}/{progress!.total})</p>
        </div>
      ) : finished ? (
        <p className="text-sm text-[#15803D] flex items-center gap-1.5">
          <CircleCheck size={16} />Selesai. Klar siap dipakai offline.
        </p>
      ) : (
        <button onClick={start} className="h-11 rounded-btn bg-surface border border-ink-faint font-medium btn-press flex items-center justify-center gap-2">
          <Download size={17} />
          {already ? 'Perbarui unduhan' : 'Unduh sekarang'}
        </button>
      )}
    </div>
  )
}
