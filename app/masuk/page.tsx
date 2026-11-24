'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Cloud, Layers } from 'lucide-react'
import { GoogleAuthProvider, getRedirectResult, onAuthStateChanged, signInWithPopup, signInWithRedirect, type AuthError, type User } from 'firebase/auth'
import { auth, hasFirebaseConfig } from '@/lib/firebase/client'
import { createSession } from '@/lib/actions/auth.actions'
import { initialSync } from '@/lib/de/sync'
import { getProfile } from '@/lib/de/progress'
import { Logo } from '@/components/de/Logo'

const ERRORS: Record<string, string> = {
  'auth/popup-closed-by-user': 'Login dibatalkan.',
  'auth/cancelled-popup-request': 'Login dibatalkan.',
  'auth/network-request-failed': 'Koneksi internet bermasalah. Coba lagi.',
  'auth/unauthorized-domain': 'Domain ini belum diizinkan di Firebase (Authorized domains).',
  'auth/too-many-requests': 'Terlalu banyak percobaan. Tunggu sebentar.',
}

/** Only allow internal Klar paths as the post-login target. */
function nextPath(): string {
  const n = new URLSearchParams(window.location.search).get('next') ?? '/de'
  return /^\/(de|mulai)(\/|$|\?)/.test(n) ? n : '/de'
}

export default function MasukPage() {
  const [phase, setPhase] = useState<'checking' | 'idle' | 'working'>('checking')
  const [error, setError] = useState<string | null>(null)
  const configured = hasFirebaseConfig()
  const finishing = useRef(false)

  async function finish(user: User) {
    if (finishing.current) return
    finishing.current = true
    setPhase('working')
    setError(null)
    try {
      const res = await createSession(await user.getIdToken())
      if (!res.success) throw new Error(res.error ?? 'Login gagal di server.')
      // pull the learner's progress first (max 8 s), so a returning user skips onboarding
      await Promise.race([initialSync(user), new Promise((r) => setTimeout(r, 8000))])
      const next = nextPath()
      window.location.replace(getProfile()?.onboarded ? next : `/de/mulai-belajar?next=${encodeURIComponent(next)}`)
    } catch (e) {
      finishing.current = false
      setError(e instanceof Error ? e.message : 'Login gagal. Coba lagi.')
      setPhase('idle')
    }
  }

  useEffect(() => {
    if (!configured) return
    // returning from the redirect fallback, or already signed in on this device
    getRedirectResult(auth)
      .then((r) => r?.user && finish(r.user))
      .catch((e: AuthError) => setError(ERRORS[e.code] ?? 'Login gagal. Coba lagi.'))
    return onAuthStateChanged(auth, (user) => {
      if (user) void finish(user)
      else setPhase('idle')
    })
  }, [configured])

  async function google() {
    setError(null)
    setPhase('working')
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    try {
      const cred = await signInWithPopup(auth, provider)
      await finish(cred.user)
    } catch (e) {
      const code = (e as AuthError).code
      // popups are blocked in some installed-app (PWA) contexts → full-page redirect instead
      if (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment') {
        await signInWithRedirect(auth, provider)
        return
      }
      setError(ERRORS[code] ?? 'Login gagal. Coba lagi.')
      setPhase('idle')
    }
  }

  const busy = phase !== 'idle'

  return (
    <main className="mx-auto max-w-md px-5 py-12 min-h-dvh flex flex-col">
      <Logo size="lg" />
      <h1 className="text-[2rem] font-semibold tracking-tight leading-tight mt-8">Belajar bahasa Jerman sampai lulus Goethe.</h1>
      <ul className="mt-6 flex flex-col gap-3 text-[15px]">
        {[
          { Icon: BookOpen, text: 'Materi grammar A1–C2 dengan latihan' },
          { Icon: Layers, text: 'Flashcard bersuara dengan pengulangan pintar' },
          { Icon: Cloud, text: 'Progres tersimpan & tersinkron di semua perangkat' },
        ].map(({ Icon, text }) => (
          <li key={text} className="flex items-center gap-3 text-ink-muted">
            <Icon size={18} className="text-ink shrink-0" />
            {text}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-10 flex flex-col gap-3">
        {!configured ? (
          <p className="text-sm text-[#B91C1C] bg-[#FEF2F2] rounded-card px-3 py-2">Login belum tersedia di lingkungan ini (konfigurasi Firebase tidak ditemukan).</p>
        ) : (
          <button
            onClick={google}
            disabled={busy}
            className="h-12 rounded-btn bg-surface border border-ink-faint font-medium btn-press flex items-center justify-center gap-3 disabled:opacity-60"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
            </svg>
            {phase === 'working' ? 'Memproses…' : phase === 'checking' ? 'Memeriksa…' : 'Lanjut dengan Google'}
          </button>
        )}
        {error && <p className="text-sm text-[#B91C1C]">{error}</p>}
        <p className="text-xs text-ink-subtle leading-relaxed">
          Satu akun untuk semua perangkatmu. Akun yang sama juga membuka deck & folder lama di{' '}
          <Link href="/login" className="underline">
            Hafalin
          </Link>
          .
        </p>
      </div>
    </main>
  )
}
