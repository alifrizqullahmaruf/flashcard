'use client'
import { type AchievementProgress, type AchievementId, TIER_VISUAL, type Tier } from '@/lib/achievements'
import { t } from '@/lib/i18n/translations'
import type { Locale } from '@/lib/types'

type Props = {
  progress: AchievementProgress
  locale: Locale
}

const NAME_KEYS: Record<AchievementId, 'achievement.wildfire.name' | 'achievement.scholar.name' | 'achievement.marathon.name' | 'achievement.sharpshooter.name' | 'achievement.curator.name' | 'achievement.daily_habit.name'> = {
  wildfire: 'achievement.wildfire.name',
  scholar: 'achievement.scholar.name',
  marathon: 'achievement.marathon.name',
  sharpshooter: 'achievement.sharpshooter.name',
  curator: 'achievement.curator.name',
  daily_habit: 'achievement.daily_habit.name',
}

const UNIT_KEYS: Record<AchievementId, 'achievement.wildfire.unit' | 'achievement.scholar.unit' | 'achievement.marathon.unit' | 'achievement.sharpshooter.unit' | 'achievement.curator.unit' | 'achievement.daily_habit.unit'> = {
  wildfire: 'achievement.wildfire.unit',
  scholar: 'achievement.scholar.unit',
  marathon: 'achievement.marathon.unit',
  sharpshooter: 'achievement.sharpshooter.unit',
  curator: 'achievement.curator.unit',
  daily_habit: 'achievement.daily_habit.unit',
}

const TIER_LABEL_KEYS: Record<Tier, 'tier.bronze' | 'tier.silver' | 'tier.gold' | 'tier.diamond'> = {
  bronze: 'tier.bronze',
  silver: 'tier.silver',
  gold: 'tier.gold',
  diamond: 'tier.diamond',
}

export default function TieredBadge({ progress, locale }: Props) {
  const { def, currentValue, currentTier, nextTier, progressToNext, nextThreshold } = progress
  const locked = currentTier === null
  const maxed = nextTier === null

  const visual = currentTier ? TIER_VISUAL[currentTier] : null
  const nextVisual = nextTier ? TIER_VISUAL[nextTier] : null

  const name = t(NAME_KEYS[def.id], locale)
  const unit = t(UNIT_KEYS[def.id], locale)

  return (
    <div
      className={`relative rounded-card p-3 border-2 transition-all ${
        locked ? 'border-ink-faint bg-bg-soft' : ''
      }`}
      style={
        locked
          ? undefined
          : {
              backgroundColor: visual!.soft,
              borderColor: visual!.color,
              boxShadow: `0 3px 0 0 ${visual!.ring}`,
            }
      }
    >
      {!locked && currentTier && (
        <span
          className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-pill text-[9px] font-bold uppercase tracking-wide text-white"
          style={{ backgroundColor: visual!.color }}
        >
          {t(TIER_LABEL_KEYS[currentTier], locale)}
        </span>
      )}

      <div className="flex flex-col items-center gap-1.5">
        <span className={`text-3xl leading-none ${locked ? 'grayscale opacity-50' : ''}`}>
          {def.emoji}
        </span>
        <p className={`text-xs font-bold text-center leading-tight ${locked ? 'text-ink-subtle' : 'text-ink'}`}>
          {name}
        </p>
      </div>

      {!maxed && (
        <div className="mt-2.5">
          <div className="h-1 rounded-pill bg-white/60 overflow-hidden mb-1">
            <div
              className="h-full rounded-pill transition-all"
              style={{
                width: `${progressToNext * 100}%`,
                backgroundColor: nextVisual?.color ?? '#00D4A8',
              }}
            />
          </div>
          <p className="text-[9px] text-ink-muted text-center font-medium tabular">
            {currentValue} / {nextThreshold} {unit}
          </p>
        </div>
      )}

      {maxed && (
        <p className="text-[9px] text-ink-muted text-center font-bold uppercase tracking-wide mt-2">
          {t('stats.badge_max', locale)}
        </p>
      )}
    </div>
  )
}
