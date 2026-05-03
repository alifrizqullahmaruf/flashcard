import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getUserStats } from '@/lib/firestore/stats'
import PageHeader from '@/components/layout/PageHeader'
import ProfileLogoutButton from '@/components/profile/ProfileClient'
import StickerChip from '@/components/ui/StickerChip'
import PencilDivider from '@/components/ui/PencilDivider'
import Highlight from '@/components/ui/Highlight'

export default async function ProfilePage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const stats = await getUserStats(user.uid)
  const initial = user.email?.[0]?.toUpperCase() ?? '?'
  const username = user.email?.split('@')[0] ?? 'pelajar'

  return (
    <>
      <PageHeader title="Profil" />
      <div className="flex-1 px-5 py-5 overflow-y-auto max-w-2xl mx-auto w-full">

        {/* Hero — avatar + brand */}
        <div className="flex flex-col items-center gap-4 py-6 mb-6 pop-in">
          <div className="relative">
            {/* Decorative sparkles around avatar */}
            <span className="absolute -top-2 -left-3 text-2xl tilt-extra">✨</span>
            <span className="absolute -bottom-1 -right-3 text-xl tilt-soft">⭐</span>
            <div
              className="w-24 h-24 rounded-full bg-mint flex items-center justify-center"
              style={{ boxShadow: '0 6px 0 0 #008F73' }}
            >
              <span className="font-display text-white text-5xl leading-none">{initial}</span>
            </div>
          </div>

          <div className="text-center">
            <p className="font-display text-2xl text-ink leading-tight tracking-tight">
              <Highlight color="sun">{username}</Highlight>
            </p>
            <p className="text-ink-muted text-sm font-medium mt-1 break-all">{user.email ?? 'Tanpa email'}</p>
          </div>

          {/* Sticker badges */}
          <div className="flex gap-2 mt-1">
            <StickerChip color="coral" tilt="left" icon="🔥">0 hari</StickerChip>
            <StickerChip color="sun" tilt="right" icon="⚡">0 XP</StickerChip>
          </div>
        </div>

        {/* Quick stats — sticker style cards */}
        <div className="grid grid-cols-3 gap-3 mb-6 pop-in" style={{ animationDelay: '80ms' }}>
          <StatTile value={stats.folderCount} label="Folder" emoji="📁" />
          <StatTile value={stats.deckCount} label="Deck" emoji="📚" />
          <StatTile value={stats.cardCount} label="Kartu" emoji="🃏" />
        </div>

        <PencilDivider className="my-2" />

        {/* Info section */}
        <div className="mt-5 mb-6 pop-in" style={{ animationDelay: '140ms' }}>
          <h2 className="font-display text-xl text-ink mb-3 tracking-tight">Akun</h2>
          <div className="card-3d-soft overflow-hidden">
            <InfoRow label="Email" value={user.email ?? '-'} />
            <div className="border-t border-ink-faint" />
            <InfoRow label="User ID" value={`${user.uid.slice(0, 8)}...`} mono />
            <div className="border-t border-ink-faint" />
            <InfoRow label="Status" value="Aktif ✨" />
          </div>
        </div>

        {/* Settings placeholder (Phase 2) */}
        <div className="mb-6 pop-in" style={{ animationDelay: '200ms' }}>
          <h2 className="font-display text-xl text-ink mb-3 tracking-tight">Pengaturan</h2>
          <div className="card-3d-soft overflow-hidden">
            <SettingRow label="Target harian" value="10 kartu" badge="Segera" />
            <div className="border-t border-ink-faint" />
            <SettingRow label="Streak freeze" value="0 tersedia" badge="Segera" />
            <div className="border-t border-ink-faint" />
            <SettingRow label="Tema" value="Terang" badge="Segera" />
          </div>
        </div>

        <PencilDivider className="my-2" />

        {/* Logout */}
        <div className="mt-5 pop-in" style={{ animationDelay: '260ms' }}>
          <ProfileLogoutButton />
        </div>

        <p className="text-center text-xs text-ink-subtle mt-6 font-medium">
          Hafalin v1.0 · Belajar sebentar, inget selamanya
        </p>
      </div>
    </>
  )
}

function StatTile({ value, label, emoji }: { value: number; label: string; emoji: string }) {
  return (
    <div className="card-3d-soft px-3 py-4 flex flex-col items-center text-center">
      <span className="text-2xl mb-1 leading-none">{emoji}</span>
      <p className="font-display text-2xl text-ink tabular leading-none">{value}</p>
      <p className="text-[10px] text-ink-muted mt-1.5 font-bold uppercase tracking-wide">{label}</p>
    </div>
  )
}

function InfoRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="px-4 py-4 flex items-center justify-between gap-3">
      <p className="text-ink-muted text-sm font-bold">{label}</p>
      <p className={`text-ink text-sm break-all text-right ${mono ? 'font-mono' : 'font-medium'}`}>
        {value}
      </p>
    </div>
  )
}

function SettingRow({ label, value, badge }: { label: string; value: string; badge?: string }) {
  return (
    <div className="px-4 py-4 flex items-center justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-ink text-sm font-bold">{label}</p>
        <p className="text-ink-muted text-xs mt-0.5">{value}</p>
      </div>
      {badge && (
        <span className="text-[10px] font-bold uppercase tracking-wide bg-purple-soft text-purple px-2.5 py-1 rounded-pill border border-purple/40" style={{ color: '#6D28D9' }}>
          {badge}
        </span>
      )}
    </div>
  )
}
