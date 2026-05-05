import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getFolders } from '@/lib/firestore/folders'
import { getUserStats } from '@/lib/firestore/stats'
import { getUserData } from '@/lib/firestore/user'
import Highlight from '@/components/ui/Highlight'
import StickerChip from '@/components/ui/StickerChip'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const [folders, stats, userData] = await Promise.all([
    getFolders(user.uid),
    getUserStats(user.uid),
    getUserData(user.uid),
  ])

  // Reset cardsStudiedToday display if lastStudyDate is not today
  // (user doc may have stale value from yesterday)
  const todayDateForUser = new Intl.DateTimeFormat('en-CA', { timeZone: userData.timezone }).format(new Date())
  const isLastStudyToday = userData.lastStudyDate === todayDateForUser

  const streak = userData.currentStreak
  const xp = stats.totalReps  // 1 review = 1 XP for now (simple proxy)
  const dailyGoal = userData.dailyGoal
  const cardsToday = isLastStudyToday ? userData.cardsStudiedToday : 0
  const goalProgress = Math.min((cardsToday / dailyGoal) * 100, 100)

  // Estimate study minutes from cards count.
  // ~10 sec/card average covers flashcard tap-flip-rate + quiz pick-confirm.
  // Real per-rate timing exists in QuizCarousel but not persisted yet — upgrade to
  // server-side tracking later if accuracy becomes a pain point.
  const AVG_SECONDS_PER_CARD = 10
  const minutesToday = Math.floor((cardsToday * AVG_SECONDS_PER_CARD) / 60)

  const firstName = user.email?.split('@')[0]?.split('.')[0] ?? 'kamu'
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1)

  const topFolders = folders.slice(0, 4)
  const continueDeck = folders.find((f) => f._count.decks > 0)

  return (
    <div className="flex-1 px-5 pt-3 pb-6 max-w-2xl mx-auto w-full">
      {/* Top Stats Bar — sticker chips with tilt */}
      <div className="flex items-center gap-2 mb-6 pop-in">
        <StickerChip color="coral" tilt="left" icon={<span className="flame-pulse">🔥</span>}>
          {streak} hari
        </StickerChip>
        <StickerChip color="sun" tilt="right" icon="⚡">
          {xp} XP
        </StickerChip>
        <div className="flex-1" />
        <Link
          href="/profile"
          className="w-11 h-11 rounded-full bg-mint flex items-center justify-center text-white font-extrabold text-base"
          style={{ boxShadow: '0 3px 0 0 #008F73' }}
          aria-label="Profil"
        >
          {displayName.charAt(0)}
        </Link>
      </div>

      {/* Greeting */}
      <div className="mb-6 pop-in" style={{ animationDelay: '60ms' }}>
        <h1 className="font-display text-4xl text-ink leading-tight tracking-tight">
          Halo, {displayName}! <span className="inline-block wiggle">👋</span>
        </h1>
        <p className="text-ink-muted text-base mt-1.5 font-medium">
          {streak > 0 ? (
            <>Streak <Highlight color="coral">{streak} hari</Highlight> — keep going!</>
          ) : (
            <>Yuk mulai <Highlight color="sun">belajar pertamamu</Highlight> hari ini.</>
          )}
        </p>
      </div>

      {/* Daily Goal Hero Card */}
      <div
        className="bounce-in rounded-card-lg p-6 mb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #00D4A8 0%, #00B891 100%)' }}
      >
        {/* Decorative blob */}
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -right-4 -bottom-12 w-32 h-32 rounded-full bg-white/10" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🎯</span>
            <p className="text-white/90 text-sm font-semibold uppercase tracking-wide">
              Target hari ini
            </p>
          </div>
          <p className="font-display text-white text-3xl mb-3 tabular tracking-tight">
            {cardsToday} / {dailyGoal} <span className="text-white/85 text-xl font-bold">kartu</span>
          </p>

          {/* Progress bar */}
          <div className="bg-white/25 rounded-full h-3 mb-5 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${goalProgress}%` }}
            />
          </div>

          {continueDeck ? (
            <Link
              href={`/folders/${continueDeck.id}`}
              className="btn-3d btn-3d-white h-12 px-7 text-sm"
            >
              Lanjut Belajar
              <span className="ml-2">→</span>
            </Link>
          ) : (
            <Link
              href="/folders/new"
              className="btn-3d btn-3d-white h-12 px-7 text-sm"
            >
              Mulai Sekarang
              <span className="ml-2">→</span>
            </Link>
          )}
        </div>
      </div>

      {/* Quick Stats Grid */}
      {stats.deckCount > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6 pop-in" style={{ animationDelay: '120ms' }}>
          <MiniStat value={stats.folderCount} label="Folder" />
          <MiniStat value={stats.deckCount} label="Deck" />
          <MiniStat value={stats.cardCount} label="Kartu" />
        </div>
      )}

      {/* Folders Preview */}
      <div className="mb-6 pop-in" style={{ animationDelay: '180ms' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-2xl text-ink tracking-tight">Folder</h2>
          {folders.length > 4 && (
            <Link href="/decks" className="text-mint-dark text-sm font-semibold">
              Semua →
            </Link>
          )}
        </div>

        {folders.length === 0 ? (
          <EmptyFoldersCard />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {topFolders.map((folder, i) => (
              <FolderTile key={folder.id} folder={folder} index={i} />
            ))}
            <CreateFolderTile />
          </div>
        )}
      </div>

      {/* Daily Quests (placeholder for Phase 2) */}
      <div className="pop-in" style={{ animationDelay: '240ms' }}>
        <h2 className="font-display text-2xl text-ink mb-3 tracking-tight">Misi Hari Ini</h2>
        <div className="card-3d-soft p-5 space-y-4">
          <Quest
            icon="📚"
            title="Selesaikan 10 kartu"
            progress={cardsToday}
            target={10}
            xp={20}
          />
          <Quest
            icon="🎯"
            title="Belajar 5 menit"
            progress={minutesToday}
            target={5}
            xp={10}
            unit="mnt"
          />
        </div>
      </div>
    </div>
  )
}

function MiniStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="card-3d-soft px-3 py-4 text-center">
      <p className="font-display text-3xl text-ink tabular leading-none">{value}</p>
      <p className="text-xs text-ink-muted mt-1.5 font-bold uppercase tracking-wide">{label}</p>
    </div>
  )
}

function FolderTile({ folder, index }: { folder: { id: string; name: string; _count: { decks: number } }; index: number }) {
  const colors = [
    { bg: 'bg-mint-soft', text: 'text-mint-dark', emoji: '📘' },
    { bg: 'bg-coral-soft', text: 'text-coral-dark', emoji: '📕' },
    { bg: 'bg-sun-soft', text: 'text-ink', emoji: '📒' },
    { bg: 'bg-sky-soft', text: 'text-sky', emoji: '📗' },
  ]
  const c = colors[index % colors.length]

  return (
    <Link
      href={`/folders/${folder.id}`}
      className="bg-surface border border-ink-faint rounded-card p-4 hover:border-mint hover:shadow-sm transition-all"
    >
      <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center text-xl mb-2`}>
        {c.emoji}
      </div>
      <p className="font-bold text-ink text-sm leading-tight line-clamp-2">{folder.name}</p>
      <p className="text-ink-muted text-xs mt-1">{folder._count.decks} deck</p>
    </Link>
  )
}

function CreateFolderTile() {
  return (
    <Link
      href="/folders/new"
      className="bg-mint-soft border-2 border-dashed border-mint rounded-card p-4 flex flex-col items-center justify-center text-center min-h-28 hover:bg-mint/15 transition-colors"
    >
      <div className="w-10 h-10 rounded-full bg-mint flex items-center justify-center text-white text-xl font-bold mb-1">
        +
      </div>
      <p className="text-mint-dark font-semibold text-sm">Folder baru</p>
    </Link>
  )
}

function EmptyFoldersCard() {
  return (
    <div className="bg-surface border-2 border-dashed border-ink-faint rounded-card-lg p-8 text-center">
      <div className="text-5xl mb-3">📂</div>
      <h3 className="font-bold text-ink text-lg mb-1">Belum ada folder</h3>
      <p className="text-ink-muted text-sm mb-4">Buat folder pertamamu untuk mulai mengelompokkan deck.</p>
      <Link
        href="/folders/new"
        className="btn-3d btn-3d-mint h-12 px-7 text-sm"
      >
        Buat Folder
      </Link>
    </div>
  )
}

function Quest({
  icon, title, progress, target, xp, unit = 'kartu',
}: {
  icon: string
  title: string
  progress: number
  target: number
  xp: number
  unit?: string
}) {
  const pct = Math.min((progress / target) * 100, 100)
  const done = progress >= target
  return (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${done ? 'bg-mint-soft' : 'bg-bg-soft'}`}>
        {done ? '✅' : icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-ink font-semibold text-sm">{title}</p>
          <span className="text-sun text-xs font-bold bg-sun-soft px-2 py-0.5 rounded-pill">
            +{xp} XP
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-ink-faint/40 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${done ? 'bg-mint' : 'bg-ink-subtle'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-ink-muted text-xs tabular-nums">{progress}/{target} {unit}</span>
        </div>
      </div>
    </div>
  )
}
