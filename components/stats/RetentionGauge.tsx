'use client'
import { t } from '@/lib/i18n/translations'
import type { RetentionStat } from '@/lib/firestore/stats'
import type { Locale } from '@/lib/types'

type Props = {
  stat: RetentionStat
  locale: Locale
}

export default function RetentionGauge({ stat, locale }: Props) {
  const pct = Math.round(stat.rate * 100)
  const tooFew = stat.totalReviews < 10

  let tone: 'success' | 'warning' | 'optimal' | 'pending'
  let labelKey: 'stats.retention_too_few' | 'stats.retention_optimal_label' | 'stats.retention_success_label' | 'stats.retention_warning_label' | 'stats.retention_low_label'
  let adviceKey: 'stats.retention_too_few_advice' | 'stats.retention_optimal_advice' | 'stats.retention_success_advice' | 'stats.retention_warning_advice' | 'stats.retention_low_advice'
  let adviceVars: Record<string, string | number> | undefined

  if (tooFew) {
    tone = 'pending'
    labelKey = 'stats.retention_too_few'
    adviceKey = 'stats.retention_too_few_advice'
    adviceVars = { n: 10 - stat.totalReviews }
  } else if (pct >= 95) {
    tone = 'optimal'
    labelKey = 'stats.retention_optimal_label'
    adviceKey = 'stats.retention_optimal_advice'
  } else if (pct >= 80) {
    tone = 'success'
    labelKey = 'stats.retention_success_label'
    adviceKey = 'stats.retention_success_advice'
  } else if (pct >= 60) {
    tone = 'warning'
    labelKey = 'stats.retention_warning_label'
    adviceKey = 'stats.retention_warning_advice'
  } else {
    tone = 'warning'
    labelKey = 'stats.retention_low_label'
    adviceKey = 'stats.retention_low_advice'
  }

  const TONE_COLORS = {
    success:  { bg: 'bg-mint-soft', text: 'text-mint-deep', accent: '#00D4A8', barBg: '#E5FBF5' },
    warning:  { bg: 'bg-sun-soft', text: 'text-sun-dark', accent: '#FFD23F', barBg: '#FFF7D6' },
    optimal:  { bg: 'bg-sky-soft', text: 'text-sky-dark', accent: '#4DB8FF', barBg: '#E5F4FF' },
    pending:  { bg: 'bg-bg-soft', text: 'text-ink-muted', accent: '#9CA3AF', barBg: '#EEF2F6' },
  }
  const c = TONE_COLORS[tone]

  return (
    <div className="card-3d-soft p-4">
      <p className="font-display text-base text-ink tracking-tight mb-1">
        {t('stats.retention_title', locale)}
      </p>
      <p className="text-xs text-ink-muted font-medium mb-4">
        {t('stats.retention_window', locale, { days: stat.windowDays, n: stat.totalReviews })}
      </p>

      <div className="flex items-baseline gap-2 mb-3">
        <p className="font-display text-5xl text-ink tabular leading-none tracking-tight">
          {tooFew ? '—' : `${pct}%`}
        </p>
        {!tooFew && (
          <p className="text-ink-muted text-sm font-medium">{t('stats.retention_remembered', locale)}</p>
        )}
      </div>

      <div className="h-3 rounded-pill overflow-hidden mb-3" style={{ backgroundColor: c.barBg }}>
        <div
          className="h-full rounded-pill transition-all"
          style={{
            width: `${tooFew ? 0 : pct}%`,
            backgroundColor: c.accent,
          }}
        />
      </div>

      <div className={`${c.bg} rounded-card p-3 flex items-start gap-2`}>
        <span className="text-base shrink-0">
          {tone === 'success' ? '🎉' : tone === 'optimal' ? '🚀' : tone === 'warning' ? '💪' : '🌱'}
        </span>
        <div>
          <p className={`text-xs font-bold ${c.text} mb-0.5`}>{t(labelKey, locale)}</p>
          <p className="text-ink text-xs">{t(adviceKey, locale, adviceVars)}</p>
        </div>
      </div>
    </div>
  )
}
