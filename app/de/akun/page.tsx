'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CircleUserRound, Cloud, CloudOff, FolderOpen, LogOut, RefreshCw, Trash2 } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth, hasFirebaseConfig } from '@/lib/firebase/client'
import { endSession } from '@/lib/actions/auth.actions'
import { LEVELS, type LevelId } from '@/lib/de/content'
import { getProfile, saveProfile, type Goal, type Profile } from '@/lib/de/progress'
import { useProgress } from '@/lib/de/useProgress'
import { deleteKlarData, syncNow, useSyncStatus } from '@/lib/de/sync'

const GOAL_LABEL: Record<Goal, string> = {
  keluarga: 'Ikut pasangan / keluarga',
  kerja: 'Kerja / Ausbildung',
  kuliah: 'Kuliah di Jerman',
  hobi: 'Hobi / jalan-jalan',
}

function ago(ts: number | null) {
  if (!ts) return '-'
  const s = Math.round((Date.now() - ts) / 1000)
  if (s < 60) return 'baru saja'
  const m = Math.round(s / 60)
  return m < 60 ? `${m} mnt lalu` : `${Math.round(m / 60)} jam lalu`
}

export default function AkunPage() {
  const status = useSyncStatus()
  const profile = useProgress(() => getProfile())
  const [busy, setBusy] = useState<null | 'out' | 'delete'>(null)

  function update(p: Partial<Omit<Profile, 'onboarded' | 'updatedAt'>>) {
    if (!profile) return
    saveProfile({ goal: profile.goal, targetLevel: profile.targetLevel, dailyNew: profile.dailyNew, ...p })
  }

  async function logout() {
    setBusy('out')
    try {
      if (hasFirebaseConfig()) await signOut(auth)
    } catch {
      /* ignore */
    }
    await endSession()
    window.location.replace('/masuk')
  }

  async function wipe() {
    if (!window.confirm('Hapus semua progres Klar (kartu, materi, streak, profil) dari akun dan HP ini? Deck & folder Hafalin lama tidak ikut terhapus. Tindakan ini tidak bisa dibatalkan.')) return
    setBusy('delete')
    try {
      await deleteKlarData()
      window.location.replace('/de/mulai-belajar')
    } catch {
      setBusy(null)
      window.alert('Gagal menghapus. Pastikan kamu online, lalu coba lagi.')
    }
  }

  const u = status.user
  const syncText =
    status.state === 'syncing' ? 'Menyinkronkan…' : status.state === 'ok' ? `Tersinkron · ${ago(status.at)}` : status.state === 'offline' ? 'Offline — disinkron saat online' : status.state === 'error' ? 'Gagal sinkron — coba lagi' : 'Belum tersambung ke akun'

  return (
    <div className="flex flex-col gap-6">
      <Link href="/de/progress" className="text-sm font-medium text-ink-muted flex items-center gap-1 w-fit">
        <ArrowLeft size={16} />Progress
      </Link>
      <header>
        <p className="de-label">Konto</p>
        <h1 className="text-[2rem] font-semibold tracking-tight leading-tight">Akun</h1>
      </header>

      <section className="bg-surface border border-ink-faint rounded-card-lg p-4 flex items-center gap-3">
        <span className="w-12 h-12 rounded-pill overflow-hidden border border-ink-faint flex items-center justify-center shrink-0">
          {u?.photo ? <Image src={u.photo} alt="" width={48} height={48} unoptimized className="w-full h-full object-cover" /> : <CircleUserRound size={24} className="text-ink-muted" />}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{u?.name ?? 'Akun Google'}</p>
          <p className="text-[13px] text-ink-subtle truncate">{u?.email ?? '—'}</p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <p className="de-label">Sinkronisasi</p>
        <div className="bg-surface border border-ink-faint rounded-card-lg px-4 py-3 flex items-center gap-3">
          {status.state === 'offline' || status.state === 'error' ? <CloudOff size={18} className="text-ink-muted shrink-0" /> : <Cloud size={18} className="text-ink shrink-0" />}
          <span className="flex-1 text-sm">{syncText}</span>
          <button onClick={() => syncNow()} disabled={status.state === 'syncing' || !u} className="text-sm font-medium flex items-center gap-1 disabled:opacity-40">
            <RefreshCw size={15} className={status.state === 'syncing' ? 'animate-spin' : ''} />Sinkron
          </button>
        </div>
      </section>

      {profile && (
        <section className="flex flex-col gap-3">
          <p className="de-label">Target belajar</p>
          <div className="bg-surface border border-ink-faint rounded-card-lg divide-y divide-ink-faint">
            <label className="flex items-center gap-3 px-4 py-3">
              <span className="flex-1 text-sm text-ink-muted">Tujuan</span>
              <select value={profile.goal} onChange={(e) => update({ goal: e.target.value as Goal })} className="bg-transparent font-medium text-right">
                {(Object.keys(GOAL_LABEL) as Goal[]).map((g) => (
                  <option key={g} value={g}>{GOAL_LABEL[g]}</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-3 px-4 py-3">
              <span className="flex-1 text-sm text-ink-muted">Target ujian</span>
              <select value={profile.targetLevel} onChange={(e) => update({ targetLevel: e.target.value as LevelId })} className="bg-transparent font-medium text-right">
                {LEVELS.map((l) => (
                  <option key={l.id} value={l.id}>Goethe {l.label}</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-3 px-4 py-3">
              <span className="flex-1 text-sm text-ink-muted">Kata baru per hari</span>
              <select value={profile.dailyNew} onChange={(e) => update({ dailyNew: Number(e.target.value) as 5 | 10 | 20 })} className="bg-transparent font-medium text-right">
                {[5, 10, 20].map((n) => (
                  <option key={n} value={n}>{n} kata</option>
                ))}
              </select>
            </label>
          </div>
        </section>
      )}

      <section className="flex flex-col gap-3">
        <p className="de-label">Lainnya</p>
        <div className="bg-surface border border-ink-faint rounded-card-lg divide-y divide-ink-faint overflow-hidden">
          <Link href="/hafalin" className="flex items-center gap-3 px-4 py-3 active:bg-bg-soft">
            <FolderOpen size={18} className="text-ink-muted" />
            <span className="flex-1 text-sm">Deck & folder lama (Hafalin)</span>
          </Link>
          <button onClick={logout} disabled={!!busy} className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-bg-soft disabled:opacity-50">
            <LogOut size={18} className="text-ink-muted" />
            <span className="flex-1 text-sm">{busy === 'out' ? 'Keluar…' : 'Keluar'}</span>
          </button>
          <button onClick={wipe} disabled={!!busy} className="w-full flex items-center gap-3 px-4 py-3 text-left text-[#B91C1C] active:bg-bg-soft disabled:opacity-50">
            <Trash2 size={18} />
            <span className="flex-1 text-sm">{busy === 'delete' ? 'Menghapus…' : 'Hapus semua progres Klar'}</span>
          </button>
        </div>
      </section>
    </div>
  )
}
