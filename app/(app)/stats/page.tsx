import { redirect } from 'next/navigation'
import { getCurrentUserId } from '@/lib/auth'
import { getUserStats } from '@/lib/firestore/stats'
import { getFolders } from '@/lib/firestore/folders'
import { getUserData } from '@/lib/firestore/user'
import PageHeader from '@/components/layout/PageHeader'
import StickerChip from '@/components/ui/StickerChip'
import PencilDivider from '@/components/ui/PencilDivider'
import Highlight from '@/components/ui/Highlight'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function StatsPage() {
  const userId = await getCurrentUserId()
  if (!userId) redirect('/login')

  const [stats, folders, userData] = await Promise.all([
    getUserStats(userId),
    getFolders(userId),
    getUserData(userId),
  ])

  const topFolders = [...folders]
    .sort((a, b) => b._count.decks - a._count.decks)
    .slice(0, 5)

  const streak = userData.currentStreak
  const longestStreak = userData.longestStreak
  // XP: 1 review session = 1 XP for now (simple proxy until proper XP system ships)
  const xp = stats.totalReps
  const masteryPct = stats.cardCount > 0 ? Math.round((stats.masteredCount / stats.cardCount) * 100) : 0

  return (
    <>
      <PageHeader title="Progres" />
      <div className="flex-1 px-5 py-5 overflow-y-auto max-w-2xl mx-auto w-full">

        {/* Streak hero — coral gradient card */}
        <div
          className="relative rounded-card-lg p-6 mb-6 overflow-hidden bounce-in"
          style={{ background: 'linear-gradient(135deg, #FF7676 0%, #FF5252 100%)' }}
        >
          <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/15" />
          <div className="absolute -right-2 -bottom-10 w-28 h-28 rounded-full bg-white/10" />

          <div className="relative z-10">
            <p className="text-white/85 text-xs font-bold uppercase tracking-wider mb-1">
              Streak Saat Ini
            </p>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl flame-pulse">🔥</span>
              <p className="font-display text-white text-6xl tabular leading-none tracking-tight">
                {streak}
              </p>
              <p className="text-white text-2xl font-extrabold ml-1">hari</p>
            </div>
            <p className="text-white/90 text-sm font-medium mt-2">
              {streak > 0
                ? <>Lanjut! Streak terpanjang <Highlight color="sun">{longestStreak} hari</Highlight></>
                : 'Mulai belajar hari ini buat dapat streak pertama!'
              }
            </p>
          </div>
        </div>

        {/* XP + Total stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 pop-in" style={{ animationDelay: '80ms' }}>
          <StatCard
            emoji="⚡"
            value={xp}
            label="Total XP"
            tone="sun"
          />
          <StatCard
            emoji="🃏"
            value={stats.cardCount}
            label="Total Kartu"
            tone="mint"
          />
        </div>

        {/* Sub stats */}
        <div className="flex items-center gap-2 mb-6 pop-in flex-wrap" style={{ animationDelay: '140ms' }}>
          <StickerChip color="sky" tilt="left" icon="📁">
            {stats.folderCount} folder
          </StickerChip>
          <StickerChip color="purple" tilt="right" icon="📚">
            {stats.deckCount} deck
          </StickerChip>
          {stats.dueTodayCount > 0 && (
            <StickerChip color="coral" tilt="left" icon="⏰">
              {stats.dueTodayCount} perlu review
            </StickerChip>
          )}
        </div>

        {/* Mastery progress */}
        {stats.cardCount > 0 && (
          <div className="mb-6 pop-in" style={{ animationDelay: '180ms' }}>
            <h2 className="font-display text-xl text-ink mb-3 tracking-tight">Progres Belajar</h2>
            <div className="card-3d-soft p-5">
              <div className="flex items-baseline justify-between mb-2">
                <p className="font-display text-3xl text-ink tabular leading-none tracking-tight">
                  {stats.masteredCount}<span className="text-ink-muted text-xl"> / {stats.cardCount}</span>
                </p>
                <p className="text-mint-deep text-sm font-bold">{masteryPct}% mastery</p>
              </div>
              <p className="text-ink-muted text-xs font-bold uppercase tracking-wide mb-3">
                Kartu sudah dikuasai
              </p>

              <div className="h-3 rounded-pill bg-bg-soft overflow-hidden mb-4">
                <div
                  className="h-full rounded-pill transition-all"
                  style={{
                    width: `${masteryPct}%`,
                    background: 'linear-gradient(90deg, #00D4A8 0%, #00B891 100%)',
                  }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <MiniStat value={stats.newCount} label="Baru" tone="default" />
                <MiniStat value={stats.learningCount} label="Belajar" tone="sun" />
                <MiniStat value={stats.masteredCount} label="Hafal" tone="mint" />
              </div>
            </div>
          </div>
        )}

        {/* Activity stats */}
        {stats.totalReps > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-6 pop-in" style={{ animationDelay: '220ms' }}>
            <div className="card-3d-soft p-4 text-center">
              <p className="font-display text-3xl text-ink tabular leading-none">{stats.totalReps}</p>
              <p className="text-xs text-ink-muted mt-1.5 font-bold uppercase tracking-wide">Total Review</p>
            </div>
            <div className="card-3d-soft p-4 text-center">
              <p className="font-display text-3xl text-ink tabular leading-none">{stats.totalLapses}</p>
              <p className="text-xs text-ink-muted mt-1.5 font-bold uppercase tracking-wide">Pernah Lupa</p>
            </div>
          </div>
        )}

        <PencilDivider className="mb-5" />

        {/* Top folders */}
        {folders.length > 0 ? (
          <div className="mb-6 pop-in" style={{ animationDelay: '200ms' }}>
            <h2 className="font-display text-xl text-ink mb-3 tracking-tight">Folder Teratas</h2>
            <div className="card-3d-soft overflow-hidden">
              {topFolders.map((folder, i) => (
                <Link
                  key={folder.id}
                  href={`/folders/${folder.id}`}
                  className="flex items-center px-4 py-4 border-b border-ink-faint last:border-b-0 gap-3 hover:bg-bg-soft transition-colors"
                >
                  <div className="w-9 h-9 rounded-pill bg-mint-soft text-mint-deep flex items-center justify-center font-extrabold text-sm shrink-0">
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-ink font-bold text-base truncate">{folder.name}</p>
                    <p className="text-ink-muted text-xs mt-0.5 font-medium">{folder._count.decks} deck</p>
                  </div>
                  <span className="text-ink-subtle text-base">→</span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="card-3d-soft py-12 px-6 flex flex-col items-center gap-3 text-center">
            <div className="text-5xl mb-1">📊</div>
            <p className="font-display text-2xl text-ink tracking-tight">Belum ada progres</p>
            <p className="text-ink-muted text-sm font-medium">Mulai bikin folder dan deck untuk lihat statistik di sini.</p>
            <Link href="/decks" className="btn-3d btn-3d-mint h-12 px-7 text-sm mt-2">
              Mulai Sekarang
            </Link>
          </div>
        )}

        {/* Achievements placeholder (Phase 2) */}
        {folders.length > 0 && (
          <div className="pop-in" style={{ animationDelay: '260ms' }}>
            <h2 className="font-display text-xl text-ink mb-3 tracking-tight">Pencapaian</h2>
            <div className="grid grid-cols-3 gap-3">
              <AchievementBadge emoji="🌱" label="Pemula" locked={stats.cardCount === 0} />
              <AchievementBadge emoji="🔥" label="Streak 7" locked={streak < 7} />
              <AchievementBadge emoji="⚡" label="100 XP" locked={xp < 100} />
              <AchievementBadge emoji="📚" label="3 Folder" locked={stats.folderCount < 3} />
              <AchievementBadge emoji="🎯" label="50 Kartu" locked={stats.cardCount < 50} />
              <AchievementBadge emoji="🏆" label="30 Hari" locked={streak < 30} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function StatCard({
  emoji, value, label, tone,
}: {
  emoji: string
  value: number
  label: string
  tone: 'sun' | 'mint'
}) {
  const bg = tone === 'sun' ? '#FFF7D6' : '#E5FBF5'
  const accent = tone === 'sun' ? '#F5B800' : '#00B891'
  return (
    <div
      className="rounded-card-lg p-5 border-2"
      style={{ backgroundColor: bg, borderColor: accent, boxShadow: `0 4px 0 0 ${accent}` }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl leading-none">{emoji}</span>
      </div>
      <p className="font-display text-4xl text-ink tabular leading-none tracking-tight">{value}</p>
      <p className="text-ink-muted text-xs font-bold uppercase tracking-wide mt-2">{label}</p>
    </div>
  )
}

function MiniStat({ value, label, tone }: { value: number; label: string; tone: 'default' | 'sun' | 'mint' }) {
  const bgClass = tone === 'mint' ? 'bg-mint-soft' : tone === 'sun' ? 'bg-sun-soft' : 'bg-bg-soft'
  const textClass = tone === 'mint' ? 'text-mint-deep' : tone === 'sun' ? 'text-ink' : 'text-ink-muted'
  return (
    <div className={`${bgClass} rounded-card py-2.5 px-2`}>
      <p className={`font-display text-xl ${textClass} tabular leading-none`}>{value}</p>
      <p className={`text-[10px] mt-1 font-bold uppercase tracking-wide ${textClass} opacity-80`}>{label}</p>
    </div>
  )
}

function AchievementBadge({ emoji, label, locked }: { emoji: string; label: string; locked: boolean }) {
  return (
    <div
      className={`rounded-card p-3 flex flex-col items-center gap-1 border-2 transition-all ${
        locked
          ? 'border-ink-faint bg-bg-soft opacity-60 grayscale'
          : 'border-mint bg-mint-soft'
      }`}
    >
      <span className="text-3xl leading-none">{emoji}</span>
      <p className={`text-[10px] font-bold uppercase tracking-wide text-center ${locked ? 'text-ink-subtle' : 'text-mint-deep'}`}>
        {label}
      </p>
    </div>
  )
}
