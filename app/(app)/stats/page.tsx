import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUserId } from '@/lib/auth'
import {
  getUserStats,
  getDailyActivity,
  getForecast,
  getRetentionRate,
  getMasteryByFolder,
  getIntervalDistribution,
  getPersonalRecords,
} from '@/lib/firestore/stats'
import { getUserData } from '@/lib/firestore/user'
import { computeAllAchievements } from '@/lib/achievements'
import { t } from '@/lib/i18n/translations'

import PageHeader from '@/components/layout/PageHeader'
import Highlight from '@/components/ui/Highlight'
import StatsTabs from '@/components/stats/StatsTabs'
import MasteryDonut from '@/components/stats/MasteryDonut'
import RetentionGauge from '@/components/stats/RetentionGauge'
import MasteryByFolder from '@/components/stats/MasteryByFolder'
import CalendarHeatmap from '@/components/stats/CalendarHeatmap'
import ReviewsPerDayChart from '@/components/stats/ReviewsPerDayChart'
import ForecastChart from '@/components/stats/ForecastChart'
import IntervalHistogram from '@/components/stats/IntervalHistogram'
import PersonalRecords from '@/components/stats/PersonalRecords'
import TieredBadge from '@/components/stats/TieredBadge'

export const dynamic = 'force-dynamic'

export default async function StatsPage() {
  const userId = await getCurrentUserId()
  if (!userId) redirect('/login')

  const userData = await getUserData(userId)
  const tz = userData.timezone
  const locale = userData.language

  const [
    stats,
    dailyActivity,
    forecast,
    retention,
    folderMastery,
    intervalDist,
    records,
  ] = await Promise.all([
    getUserStats(userId),
    getDailyActivity(userId, 84, tz),
    getForecast(userId, 14, tz),
    getRetentionRate(userId, 30),
    getMasteryByFolder(userId),
    getIntervalDistribution(userId),
    getPersonalRecords(userId, tz),
  ])

  const streak = userData.currentStreak
  const longestStreak = userData.longestStreak
  const dailyGoal = userData.dailyGoal
  const cardsToday = userData.cardsStudiedToday
  const goalPct = Math.min(100, Math.round((cardsToday / Math.max(1, dailyGoal)) * 100))

  const achievements = computeAllAchievements({
    currentStreak: streak,
    masteredCount: stats.masteredCount,
    totalReps: stats.totalReps,
    retentionPct: Math.round(retention.rate * 100),
    folderCount: stats.folderCount,
    totalDaysStudied: records.totalDaysStudied,
  })

  const isFirstTime = stats.cardCount === 0

  if (isFirstTime) {
    return (
      <>
        <PageHeader title={t('stats.title', locale)} />
        <div className="flex-1 px-5 py-8 flex flex-col items-center justify-center gap-4 text-center max-w-md mx-auto">
          <div className="text-6xl mb-2">📊</div>
          <h2 className="font-display text-3xl text-ink tracking-tight">
            {t('stats.empty_title', locale)}
          </h2>
          <p className="text-ink-muted text-sm font-medium">
            {t('stats.empty_desc', locale)}
          </p>
          <Link href="/decks" className="btn-3d btn-3d-mint h-12 px-7 text-sm mt-2">
            {t('stats.empty_cta', locale)}
          </Link>
        </div>
      </>
    )
  }

  const overview = (
    <>
      {/* Streak hero */}
      <div
        className="relative rounded-card-lg p-6 overflow-hidden bounce-in"
        style={{ background: 'linear-gradient(135deg, #FF7676 0%, #FF5252 100%)' }}
      >
        <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/15" />
        <div className="absolute -right-2 -bottom-10 w-28 h-28 rounded-full bg-white/10" />

        <div className="relative z-10">
          <p className="text-white/85 text-xs font-bold uppercase tracking-wider mb-1">
            {t('stats.streak_label', locale)}
          </p>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl flame-pulse">🔥</span>
            <p className="font-display text-white text-6xl tabular leading-none tracking-tight">
              {streak}
            </p>
            <p className="text-white text-2xl font-extrabold ml-1">{t('stats.streak_unit', locale)}</p>
          </div>
          <p className="text-white/90 text-sm font-medium mt-2">
            {streak > 0 ? (
              <>{t('stats.streak_continue', locale, { n: longestStreak }).split(String(longestStreak))[0]}<Highlight color="sun">{longestStreak} {t('stats.streak_unit', locale)}</Highlight></>
            ) : (
              t('stats.streak_start', locale)
            )}
          </p>

          {dailyGoal > 0 && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-white/85 text-xs font-bold uppercase tracking-wider">
                  {t('stats.streak_target', locale)}
                </p>
                <p className="text-white text-xs font-bold tabular">
                  {cardsToday} / {dailyGoal}
                </p>
              </div>
              <div className="h-2 rounded-pill bg-white/20 overflow-hidden">
                <div
                  className="h-full rounded-pill bg-white transition-all"
                  style={{ width: `${goalPct}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pop-in" style={{ animationDelay: '80ms' }}>
        <RetentionGauge stat={retention} locale={locale} />
      </div>

      <div className="pop-in" style={{ animationDelay: '140ms' }}>
        <MasteryDonut
          newCount={stats.newCount}
          learningCount={stats.learningCount}
          masteredCount={stats.masteredCount}
          locale={locale}
        />
      </div>

      <div className="pop-in" style={{ animationDelay: '200ms' }}>
        <MasteryByFolder folders={folderMastery} locale={locale} />
      </div>
    </>
  )

  const activity = (
    <>
      <div className="pop-in">
        <CalendarHeatmap data={dailyActivity} locale={locale} />
      </div>

      <div className="pop-in" style={{ animationDelay: '80ms' }}>
        <ReviewsPerDayChart data={dailyActivity} locale={locale} />
      </div>

      <div className="pop-in" style={{ animationDelay: '140ms' }}>
        <ForecastChart data={forecast} locale={locale} />
      </div>

      <div className="pop-in" style={{ animationDelay: '200ms' }}>
        <IntervalHistogram data={intervalDist} locale={locale} />
      </div>
    </>
  )

  const achievementsTab = (
    <>
      <div className="pop-in">
        <PersonalRecords records={records} locale={locale} />
      </div>

      <div className="pop-in" style={{ animationDelay: '100ms' }}>
        <h2 className="font-display text-xl text-ink mb-3 tracking-tight">
          {t('stats.badges_title', locale)}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {achievements.map((ach) => (
            <TieredBadge key={ach.def.id} progress={ach} locale={locale} />
          ))}
        </div>
      </div>
    </>
  )

  return (
    <>
      <PageHeader title={t('stats.title', locale)} />
      <div className="flex-1 px-5 py-5 overflow-y-auto max-w-2xl mx-auto w-full">
        <StatsTabs
          overview={overview}
          activity={activity}
          achievements={achievementsTab}
          locale={locale}
        />
      </div>
    </>
  )
}
