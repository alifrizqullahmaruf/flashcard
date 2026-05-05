import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getFolders } from '@/lib/firestore/folders'
import { getUserStats } from '@/lib/firestore/stats'
import { getUserData } from '@/lib/firestore/user'
import { t } from '@/lib/i18n/translations'
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

  const locale = userData.language

  // Reset cardsStudiedToday display if lastStudyDate is not today
  const todayDateForUser = new Intl.DateTimeFormat('en-CA', { timeZone: userData.timezone }).format(new Date())
  const isLastStudyToday = userData.lastStudyDate === todayDateForUser

  const streak = userData.currentStreak
  const xp = stats.totalReps
  const dailyGoal = userData.dailyGoal
  const cardsToday = isLastStudyToday ? userData.cardsStudiedToday : 0
  const goalProgress = Math.min((cardsToday / dailyGoal) * 100, 100)

  const AVG_SECONDS_PER_CARD = 10
  const minutesToday = Math.floor((cardsToday * AVG_SECONDS_PER_CARD) / 60)

  const firstName = user.email?.split('@')[0]?.split('.')[0] ?? 'kamu'
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1)

  const topFolders = folders.slice(0, 4)
  const continueDeck = folders.find((f) => f._count.decks > 0)

  return (
    <div className="flex-1 px-5 pt-3 pb-6 max-w-2xl mx-auto w-full">
      {/* Top Stats Bar */}
      <div className="flex items-center gap-2 mb-6 pop-in">
        <StickerChip color="coral" tilt="left" icon={<span className="flame-pulse">🔥</span>}>
          {t('home.streak_chip', locale, { n: streak })}
        </StickerChip>
        <StickerChip color="sun" tilt="right" icon="⚡">
          {t('home.xp_chip', locale, { n: xp })}
        </StickerChip>
        <div className="flex-1" />
        <Link
          href="/profile"
          className="w-11 h-11 rounded-full bg-mint flex items-center justify-center text-white font-extrabold text-base"
          style={{ boxShadow: '0 3px 0 0 #008F73' }}
          aria-label={t('home.profile_aria', locale)}
        >
          {displayName.charAt(0)}
        </Link>
      </div>

      {/* Greeting */}
      <div className="mb-6 pop-in" style={{ animationDelay: '60ms' }}>
        <h1 className="font-display text-4xl text-ink leading-tight tracking-tight">
          {t('home.greeting', locale, { name: displayName })} <span className="inline-block wiggle">👋</span>
        </h1>
        <p className="text-ink-muted text-base mt-1.5 font-medium">
          {streak > 0 ? (
            <>
              {locale === 'id' ? 'Streak ' : ''}
              <Highlight color="coral">
                {locale === 'id' ? `${streak} hari` : `${streak}-day streak`}
              </Highlight>
              {locale === 'id' ? ' — keep going!' : ' — keep going!'}
            </>
          ) : (
            <>
              {locale === 'id' ? 'Yuk mulai ' : 'Start your '}
              <Highlight color="sun">{t('home.streak_first', locale)}</Highlight>
              {locale === 'id' ? ' hari ini.' : ' today.'}
            </>
          )}
        </p>
      </div>

      {/* Daily Goal Hero Card */}
      <div
        className="bounce-in rounded-card-lg p-6 mb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #00D4A8 0%, #00B891 100%)' }}
      >
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -right-4 -bottom-12 w-32 h-32 rounded-full bg-white/10" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🎯</span>
            <p className="text-white/90 text-sm font-semibold uppercase tracking-wide">
              {t('home.daily_goal_label', locale)}
            </p>
          </div>
          <p className="font-display text-white text-3xl mb-3 tabular tracking-tight">
            {cardsToday} / {dailyGoal}{' '}
            <span className="text-white/85 text-xl font-bold">
              {t('home.daily_goal_unit', locale)}
            </span>
          </p>

          <div className="bg-white/25 rounded-full h-3 mb-5 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${goalProgress}%` }}
            />
          </div>

          {continueDeck ? (
            <Link href={`/folders/${continueDeck.id}`} className="btn-3d btn-3d-white h-12 px-7 text-sm">
              {t('home.continue_studying', locale)}
              <span className="ml-2">→</span>
            </Link>
          ) : (
            <Link href="/folders/new" className="btn-3d btn-3d-white h-12 px-7 text-sm">
              {t('home.start_now', locale)}
              <span className="ml-2">→</span>
            </Link>
          )}
        </div>
      </div>

      {/* Quick Stats Grid */}
      {stats.deckCount > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6 pop-in" style={{ animationDelay: '120ms' }}>
          <MiniStat value={stats.folderCount} label={t('home.stat_folder', locale)} />
          <MiniStat value={stats.deckCount} label={t('home.stat_deck', locale)} />
          <MiniStat value={stats.cardCount} label={t('home.stat_card', locale)} />
        </div>
      )}

      {/* Folders Preview */}
      <div className="mb-6 pop-in" style={{ animationDelay: '180ms' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-2xl text-ink tracking-tight">
            {t('home.folders_title', locale)}
          </h2>
          {folders.length > 4 && (
            <Link href="/decks" className="text-mint-dark text-sm font-semibold">
              {t('home.folders_see_all', locale)}
            </Link>
          )}
        </div>

        {folders.length === 0 ? (
          <EmptyFoldersCard locale={locale} />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {topFolders.map((folder, i) => (
              <FolderTile key={folder.id} folder={folder} index={i} locale={locale} />
            ))}
            <CreateFolderTile locale={locale} />
          </div>
        )}
      </div>

      {/* Daily Quests */}
      <div className="pop-in" style={{ animationDelay: '240ms' }}>
        <h2 className="font-display text-2xl text-ink mb-3 tracking-tight">
          {t('home.quests_title', locale)}
        </h2>
        <div className="card-3d-soft p-5 space-y-4">
          <Quest
            icon="📚"
            title={t('home.quest_cards_title', locale)}
            progress={cardsToday}
            target={10}
            xp={20}
            unit={t('home.unit_card', locale)}
          />
          <Quest
            icon="🎯"
            title={t('home.quest_minutes_title', locale)}
            progress={minutesToday}
            target={5}
            xp={10}
            unit={t('home.unit_minute', locale)}
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

function FolderTile({
  folder,
  index,
  locale,
}: {
  folder: { id: string; name: string; _count: { decks: number } }
  index: number
  locale: 'id' | 'en'
}) {
  const colors = [
    { bg: 'bg-mint-soft', emoji: '📘' },
    { bg: 'bg-coral-soft', emoji: '📕' },
    { bg: 'bg-sun-soft', emoji: '📒' },
    { bg: 'bg-sky-soft', emoji: '📗' },
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
      <p className="text-ink-muted text-xs mt-1">
        {t('home.folder_decks_count', locale, { n: folder._count.decks })}
      </p>
    </Link>
  )
}

function CreateFolderTile({ locale }: { locale: 'id' | 'en' }) {
  return (
    <Link
      href="/folders/new"
      className="bg-mint-soft border-2 border-dashed border-mint rounded-card p-4 flex flex-col items-center justify-center text-center min-h-28 hover:bg-mint/15 transition-colors"
    >
      <div className="w-10 h-10 rounded-full bg-mint flex items-center justify-center text-white text-xl font-bold mb-1">
        +
      </div>
      <p className="text-mint-dark font-semibold text-sm">{t('home.folder_new_tile', locale)}</p>
    </Link>
  )
}

function EmptyFoldersCard({ locale }: { locale: 'id' | 'en' }) {
  return (
    <div className="bg-surface border-2 border-dashed border-ink-faint rounded-card-lg p-8 text-center">
      <div className="text-5xl mb-3">📂</div>
      <h3 className="font-bold text-ink text-lg mb-1">{t('home.folders_empty_title', locale)}</h3>
      <p className="text-ink-muted text-sm mb-4">{t('home.folders_empty_desc', locale)}</p>
      <Link href="/folders/new" className="btn-3d btn-3d-mint h-12 px-7 text-sm">
        {t('home.folders_create_btn', locale)}
      </Link>
    </div>
  )
}

function Quest({
  icon,
  title,
  progress,
  target,
  xp,
  unit,
}: {
  icon: string
  title: string
  progress: number
  target: number
  xp: number
  unit: string
}) {
  const pct = Math.min((progress / target) * 100, 100)
  const done = progress >= target
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
          done ? 'bg-mint-soft' : 'bg-bg-soft'
        }`}
      >
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
          <span className="text-ink-muted text-xs tabular-nums">
            {progress}/{target} {unit}
          </span>
        </div>
      </div>
    </div>
  )
}
