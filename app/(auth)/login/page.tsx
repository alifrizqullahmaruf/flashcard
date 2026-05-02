'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  type AuthError,
} from 'firebase/auth'
import { auth } from '@/lib/firebase/client'
import { createSession } from '@/lib/actions/auth.actions'

type Mode = 'signin' | 'signup'

const ERROR_MAP: Record<string, string> = {
  'auth/invalid-credential': 'Email atau password salah.',
  'auth/user-not-found': 'Akun tidak ditemukan.',
  'auth/wrong-password': 'Password salah.',
  'auth/email-already-in-use': 'Email sudah terdaftar. Coba masuk.',
  'auth/weak-password': 'Password minimal 6 karakter.',
  'auth/invalid-email': 'Format email tidak valid.',
  'auth/too-many-requests': 'Terlalu banyak percobaan. Tunggu sebentar.',
  'auth/network-request-failed': 'Koneksi internet bermasalah.',
  'auth/popup-closed-by-user': 'Login dibatalkan.',
  'auth/popup-blocked': 'Popup diblokir browser. Izinkan popup untuk lanjut.',
}

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function finishLogin(idToken: string) {
    const result = await createSession(idToken)
    if (!result.success) {
      setError(result.error ?? 'Login gagal di server.')
      return false
    }
    router.push('/decks')
    router.refresh()
    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const cred = mode === 'signin'
        ? await signInWithEmailAndPassword(auth, email, password)
        : await createUserWithEmailAndPassword(auth, email, password)
      const idToken = await cred.user.getIdToken()
      const ok = await finishLogin(idToken)
      if (!ok) setLoading(false)
    } catch (err) {
      setError(ERROR_MAP[(err as AuthError).code] ?? 'Login gagal. Coba lagi.')
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError(null)
    setGoogleLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const cred = await signInWithPopup(auth, provider)
      const idToken = await cred.user.getIdToken()
      const ok = await finishLogin(idToken)
      if (!ok) setGoogleLoading(false)
    } catch (err) {
      const code = (err as AuthError).code
      const message = ERROR_MAP[code] ?? (err instanceof Error ? err.message : 'Login Google gagal.')
      setError(message)
      setGoogleLoading(false)
    }
  }

  const anyLoading = loading || googleLoading

  return (
    <div className="min-h-dvh bg-cream flex items-center justify-center px-6 py-8">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-4xl text-ink mb-2">Flashcard</h1>
        <p className="text-ink-muted text-sm mb-8">
          {mode === 'signin' ? 'Masuk untuk mulai belajar.' : 'Buat akun baru untuk mulai.'}
        </p>

        {/* Google Sign-In */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={anyLoading}
          className="w-full h-14 rounded-xl border border-cream-dark bg-surface flex items-center justify-center gap-3 text-ink text-base font-medium hover:bg-cream-dark transition-colors disabled:opacity-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {googleLoading ? 'Memproses...' : 'Lanjut dengan Google'}
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-cream-dark" />
          <span className="text-ink-subtle text-xs">atau pakai email</span>
          <div className="flex-1 h-px bg-cream-dark" />
        </div>

        {/* Email + Password Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-ink text-sm font-medium">Email</label>
            <input
              id="email" type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kamu@email.com"
              className="h-14 rounded-xl border border-cream-dark bg-surface px-4 text-base text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-ink/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-ink text-sm font-medium">Password</label>
            <input
              id="password" type="password" required minLength={6} value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="h-14 rounded-xl border border-cream-dark bg-surface px-4 text-base text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-ink/20"
            />
          </div>

          {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <button
            type="submit" disabled={anyLoading}
            className="h-14 rounded-xl bg-ink text-surface text-base font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Memproses...' : mode === 'signin' ? 'Masuk' : 'Daftar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-ink-muted">
          {mode === 'signin' ? (
            <>
              Belum punya akun?{' '}
              <button type="button" onClick={() => { setMode('signup'); setError(null) }}
                className="text-ink underline underline-offset-4 hover:text-ink-muted">
                Daftar di sini
              </button>
            </>
          ) : (
            <>
              Sudah punya akun?{' '}
              <button type="button" onClick={() => { setMode('signin'); setError(null) }}
                className="text-ink underline underline-offset-4 hover:text-ink-muted">
                Masuk
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
