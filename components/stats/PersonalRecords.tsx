'use client'
import { t } from '@/lib/i18n/translations'
import type { PersonalRecords as PersonalRecordsType } from '@/lib/firestore/stats'
import type { Locale } from '@/lib/types'

type Props = {
  records: PersonalRecordsType
  locale: Locale
}

export default function PersonalRecords({ records, locale }: Props) {
  return (
    <div>
      <h2 className="font-display text-xl text-ink mb-3 tracking-tight">
        {t('stats.records_title', locale)}
      </h2>
      <div className="grid grid-cols-3 gap-3">
        <RecordCard
          emoji="🔥"
          value={records.longestStreak}
          unit={t('stats.records_streak_unit', locale)}
          label={t('stats.records_streak_label', locale)}
          tone="coral"
        />
        <RecordCard
          emoji="💪"
          value={records.bestDayCount}
          unit={t('stats.records_best_unit', locale)}
          label={t('stats.records_best_label', locale)}
          tone="sun"
        />
        <RecordCard
          emoji="📅"
          value={records.totalDaysStudied}
          unit={t('stats.records_active_unit', locale)}
          label={t('stats.records_active_label', locale)}
          tone="mint"
        />
      </div>

      {records.largestDeckSize > 0 && (
        <div className="card-3d-soft p-4 mt-3 flex items-center gap-3">
          <span className="text-3xl shrink-0">🏆</span>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-ink-muted font-bold uppercase tracking-wide">
              {t('stats.records_largest_label', locale)}
            </p>
            <p className="text-ink font-bold text-sm truncate">{records.largestDeckTitle}</p>
            <p className="text-ink-muted text-xs">
              {t('stats.records_largest_unit', locale, { n: records.largestDeckSize })}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function RecordCard({
  emoji,
  value,
  unit,
  label,
  tone,
}: {
  emoji: string
  value: number
  unit: string
  label: string
  tone: 'mint' | 'coral' | 'sun'
}) {
  const TONE = {
    mint:  { bg: '#E5FBF5', accent: '#00B891' },
    coral: { bg: '#FFE5E5', accent: '#E03B3B' },
    sun:   { bg: '#FFF7D6', accent: '#F5B800' },
  }
  const c = TONE[tone]
  return (
    <div
      className="rounded-card p-3 border-2 flex flex-col items-center text-center"
      style={{ backgroundColor: c.bg, borderColor: c.accent, boxShadow: `0 3px 0 0 ${c.accent}` }}
    >
      <span className="text-2xl leading-none mb-1">{emoji}</span>
      <p className="font-display text-2xl text-ink tabular leading-none tracking-tight">{value}</p>
      <p className="text-[10px] text-ink-muted font-bold uppercase tracking-wide mt-1">{unit}</p>
      <p className="text-[10px] text-ink mt-0.5 font-medium">{label}</p>
    </div>
  )
}
