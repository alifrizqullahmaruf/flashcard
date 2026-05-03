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
import Highlight from '@/components/ui/Highlight'
import TapeStrip from '@/components/ui/TapeStrip'

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
    router.push('/')
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
    <div className="min-h-dvh bg-bg flex items-center justify-center px-5 py-8 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-mint-soft opacity-60 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-coral-soft opacity-60 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-32 h-32 rounded-full bg-sun-soft opacity-50 blur-2xl pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">

        {/* Logo + Brand */}
        <div className="bounce-in flex flex-col items-center mb-6">
          <div
            className="w-20 h-20 rounded-3xl bg-mint flex items-center justify-center mb-4"
            style={{ boxShadow: '0 6px 0 0 #008F73' }}
          >
            <span className="font-display text-white text-5xl">H</span>
          </div>
          <h1 className="font-display text-5xl text-ink mb-2 tracking-tight">Hafalin</h1>
          <p className="text-ink-muted text-sm font-medium text-center px-4">
            Belajar sebentar, <Highlight color="sun">inget selamanya</Highlight> ✨
          </p>
          <div className="mt-3">
            <TapeStrip color="coral" tilt="left">Gratis · Tanpa Iklan</TapeStrip>
          </div>
        </div>

        {/* Mode tabs */}
        <div className="bg-surface rounded-pill p-1 flex mb-5 border-2 border-ink-faint pop-in" style={{ animationDelay: '100ms' }}>
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null) }}
            className={`flex-1 h-10 rounded-pill text-sm font-bold transition-all ${
              mode === 'signin' ? 'bg-mint text-white shadow-sm' : 'text-ink-muted'
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null) }}
            className={`flex-1 h-10 rounded-pill text-sm font-bold transition-all ${
              mode === 'signup' ? 'bg-mint text-white shadow-sm' : 'text-ink-muted'
            }`}
          >
            Daftar
          </button>
        </div>

        {/* Google Sign-In */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={anyLoading}
          className="btn-3d btn-3d-outline w-full h-14 text-base normal-case tracking-normal pop-in"
          style={{ animationDelay: '160ms', textTransform: 'none', letterSpacing: 'normal' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" className="mr-3">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {googleLoading ? 'Memproses...' : 'Lanjut dengan Google'}
        </button>

        <div className="flex items-center gap-3 my-5 pop-in" style={{ animationDelay: '220ms' }}>
          <div className="flex-1 h-px bg-ink-faint" />
          <span className="text-ink-subtle text-xs font-bold uppercase tracking-wide">atau</span>
          <div className="flex-1 h-px bg-ink-faint" />
        </div>

        {/* Email + Password Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 pop-in" style={{ animationDelay: '280ms' }}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-ink text-sm font-bold ml-1">Email</label>
            <input
              id="email" type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kamu@email.com"
              className="h-14 rounded-btn border-2 border-ink-faint bg-surface px-4 text-base text-ink placeholder:text-ink-subtle font-medium focus:outline-none focus:border-mint focus:ring-4 focus:ring-mint-soft transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-ink text-sm font-bold ml-1">Password</label>
            <input
              id="password" type="password" required minLength={6} value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="h-14 rounded-btn border-2 border-ink-faint bg-surface px-4 text-base text-ink placeholder:text-ink-subtle font-medium focus:outline-none focus:border-mint focus:ring-4 focus:ring-mint-soft transition-all"
            />
          </div>

          {error && (
            <div className="bg-coral-soft border-2 border-coral rounded-btn px-4 py-3 flex items-start gap-2">
              <span className="text-base">⚠️</span>
              <p className="text-coral-dark text-sm font-semibold">{error}</p>
            </div>
          )}

          <button
            type="submit" disabled={anyLoading}
            className="btn-3d btn-3d-mint w-full h-14 text-base mt-2"
          >
            {loading ? 'Memproses...' : mode === 'signin' ? 'Masuk' : 'Daftar Akun'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-ink-subtle">
          Dengan {mode === 'signin' ? 'masuk' : 'daftar'}, kamu setuju dengan syarat penggunaan kami.
        </p>
      </div>
    </div>
  )
}
