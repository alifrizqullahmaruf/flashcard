import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getUserStats } from '@/lib/firestore/stats'
import { getUserData } from '@/lib/firestore/user'
import { t } from '@/lib/i18n/translations'
import PageHeader from '@/components/layout/PageHeader'
import ProfileLogoutButton from '@/components/profile/ProfileClient'
import LanguagePicker from '@/components/profile/LanguagePicker'
import StickerChip from '@/components/ui/StickerChip'
import PencilDivider from '@/components/ui/PencilDivider'
import Highlight from '@/components/ui/Highlight'

export default async function ProfilePage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const [stats, userData] = await Promise.all([
    getUserStats(user.uid),
    getUserData(user.uid),
  ])
  const locale = userData.language

  const initial = user.email?.[0]?.toUpperCase() ?? '?'
  const username = user.email?.split('@')[0] ?? 'pelajar'
  const streak = userData.currentStreak
  const xp = stats.totalReps

  return (
    <>
      <PageHeader title={t('profile.title', locale)} />
      <div className="flex-1 px-5 py-5 overflow-y-auto max-w-2xl mx-auto w-full">

        {/* Hero */}
        <div className="flex flex-col items-center gap-4 py-6 mb-6 pop-in">
          <div className="relative">
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
            <p className="text-ink-muted text-sm font-medium mt-1 break-all">
              {user.email ?? t('profile.no_email', locale)}
            </p>
          </div>

          <div className="flex gap-2 mt-1">
            <StickerChip color="coral" tilt="left" icon="🔥">
              {t('profile.streak_chip', locale, { n: streak })}
            </StickerChip>
            <StickerChip color="sun" tilt="right" icon="⚡">
              {t('profile.xp_chip', locale, { n: xp })}
            </StickerChip>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mb-6 pop-in" style={{ animationDelay: '80ms' }}>
          <StatTile value={stats.folderCount} label={t('profile.stat_folder', locale)} emoji="📁" />
          <StatTile value={stats.deckCount} label={t('profile.stat_deck', locale)} emoji="📚" />
          <StatTile value={stats.cardCount} label={t('profile.stat_card', locale)} emoji="🃏" />
        </div>

        <PencilDivider className="my-2" />

        {/* Account */}
        <div className="mt-5 mb-6 pop-in" style={{ animationDelay: '140ms' }}>
          <h2 className="font-display text-xl text-ink mb-3 tracking-tight">
            {t('profile.account_title', locale)}
          </h2>
          <div className="card-3d-soft overflow-hidden">
            <InfoRow label={t('profile.account_email', locale)} value={user.email ?? '-'} />
            <div className="border-t border-ink-faint" />
            <InfoRow label={t('profile.account_user_id', locale)} value={`${user.uid.slice(0, 8)}...`} mono />
            <div className="border-t border-ink-faint" />
            <InfoRow label={t('profile.account_status', locale)} value={t('profile.account_status_active', locale)} />
          </div>
        </div>

        {/* Settings */}
        <div className="mb-6 pop-in" style={{ animationDelay: '200ms' }}>
          <h2 className="font-display text-xl text-ink mb-3 tracking-tight">
            {t('profile.settings_title', locale)}
          </h2>
          <div className="card-3d-soft overflow-hidden">
            {/* Language picker — REAL working setting */}
            <LanguagePicker />
            <div className="border-t border-ink-faint" />
            <SettingRow
              label={t('profile.setting_daily_goal', locale)}
              value={t('profile.setting_daily_goal_value', locale)}
              badge={t('common.coming_soon', locale)}
            />
            <div className="border-t border-ink-faint" />
            <SettingRow
              label={t('profile.setting_streak_freeze', locale)}
              value={t('profile.setting_streak_freeze_value', locale)}
              badge={t('common.coming_soon', locale)}
            />
            <div className="border-t border-ink-faint" />
            <SettingRow
              label={t('profile.setting_theme', locale)}
              value={t('profile.setting_theme_value', locale)}
              badge={t('common.coming_soon', locale)}
            />
          </div>
        </div>

        <PencilDivider className="my-2" />

        <div className="mt-5 pop-in" style={{ animationDelay: '260ms' }}>
          <ProfileLogoutButton />
        </div>

        <p className="text-center text-xs text-ink-subtle mt-6 font-medium">
          {t('profile.tagline', locale)}
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
        <span
          className="text-[10px] font-bold uppercase tracking-wide bg-purple-soft px-2.5 py-1 rounded-pill border border-purple/40"
          style={{ color: '#6D28D9' }}
        >
          {badge}
        </span>
      )}
    </div>
  )
}
