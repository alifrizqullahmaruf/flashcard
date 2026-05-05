'use client'
import { useMemo, useState } from 'react'
import { t } from '@/lib/i18n/translations'
import type { DailyActivity } from '@/lib/firestore/stats'
import type { Locale } from '@/lib/types'

type Props = {
  data: DailyActivity[]
  locale: Locale
}

function intensityClass(count: number, max: number): string {
  if (count === 0) return 'bg-bg-soft border-ink-faint'
  if (max <= 0) return 'bg-mint-soft border-mint-soft'
  const ratio = count / max
  if (ratio < 0.25) return 'bg-mint-soft border-mint-soft'
  if (ratio < 0.5)  return 'border-transparent'
  if (ratio < 0.75) return 'border-transparent'
  return 'border-transparent'
}

function intensityStyle(count: number, max: number): React.CSSProperties {
  if (count === 0) return {}
  if (max <= 0) return {}
  const ratio = count / max
  let bg: string
  if (ratio < 0.25)      bg = 'rgba(0, 212, 168, 0.25)'
  else if (ratio < 0.5)  bg = 'rgba(0, 212, 168, 0.5)'
  else if (ratio < 0.75) bg = 'rgba(0, 212, 168, 0.75)'
  else                   bg = 'rgba(0, 212, 168, 1)'
  return { backgroundColor: bg }
}

const DAY_LABELS_ID = ['M', 'S', 'S', 'R', 'K', 'J', 'S']
const DAY_LABELS_EN = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function CalendarHeatmap({ data, locale }: Props) {
  const [hovered, setHovered] = useState<DailyActivity | null>(null)

  const dayLabels = locale === 'en' ? DAY_LABELS_EN : DAY_LABELS_ID

  const weeks = useMemo(() => {
    if (data.length === 0) return []
    const result: (DailyActivity | null)[][] = []
    let currentWeek: (DailyActivity | null)[] = []

    const firstDate = new Date(data[0].date + 'T00:00:00')
    const firstDow = firstDate.getDay()
    for (let i = 0; i < firstDow; i++) currentWeek.push(null)

    data.forEach((day) => {
      const d = new Date(day.date + 'T00:00:00')
      currentWeek.push(day)
      if (d.getDay() === 6) {
        result.push(currentWeek)
        currentWeek = []
      }
    })
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null)
      result.push(currentWeek)
    }
    return result
  }, [data])

  const max = useMemo(() => Math.max(0, ...data.map((d) => d.totalCount)), [data])
  const totalReviews = useMemo(() => data.reduce((s, d) => s + d.totalCount, 0), [data])
  const activeDays = useMemo(() => data.filter((d) => d.totalCount > 0).length, [data])

  const empty = totalReviews === 0
  const localeStr = locale === 'en' ? 'en-US' : 'id-ID'

  return (
    <div className="card-3d-soft p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-display text-base text-ink tracking-tight">{t('stats.heatmap_title', locale)}</p>
          <p className="text-xs text-ink-muted font-medium">
            {t('stats.heatmap_window', locale, { n: data.length })}
          </p>
        </div>
        {!empty && (
          <div className="text-right">
            <p className="font-display text-2xl text-ink tabular leading-none tracking-tight">{totalReviews}</p>
            <p className="text-[10px] text-ink-muted font-bold uppercase tracking-wide">
              {t('stats.heatmap_unit', locale)}
            </p>
          </div>
        )}
      </div>

      {empty ? (
        <div className="py-8 flex flex-col items-center gap-2">
          <span className="text-3xl">🌱</span>
          <p className="text-ink-muted text-sm font-medium text-center">
            {t('stats.heatmap_empty', locale)}
          </p>
        </div>
      ) : (
        <>
          <div className="h-6 mb-2 text-xs">
            {hovered && (
              <p className="text-ink font-medium">
                <span className="text-ink-muted">{formatDate(hovered.date, localeStr)}:</span>{' '}
                {hovered.totalCount === 0
                  ? t('stats.heatmap_no_study', locale)
                  : `${hovered.totalCount} ${t('stats.heatmap_unit', locale)}`}
                {hovered.newCount > 0 && (
                  <span className="text-mint-deep">
                    {' · '}
                    {t('stats.heatmap_tooltip_new', locale, { n: hovered.newCount })}
                  </span>
                )}
              </p>
            )}
          </div>

          <div className="flex gap-1 overflow-x-auto pb-2">
            <div className="flex flex-col gap-[3px] pt-1 shrink-0 mr-1">
              {dayLabels.map((d, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 text-[9px] text-ink-subtle font-bold flex items-center justify-center ${i % 2 === 0 ? '' : 'opacity-0'}`}
                >
                  {d}
                </div>
              ))}
            </div>
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px] shrink-0">
                {week.map((day, di) => (
                  <div
                    key={di}
                    role={day ? 'button' : 'presentation'}
                    tabIndex={day ? 0 : -1}
                    onMouseEnter={() => day && setHovered(day)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => day && setHovered(day)}
                    onBlur={() => setHovered(null)}
                    className={`w-3 h-3 rounded-sm border ${day ? intensityClass(day.totalCount, max) : 'border-transparent'}`}
                    style={day ? intensityStyle(day.totalCount, max) : { visibility: 'hidden' }}
                    aria-label={day ? `${formatDate(day.date, localeStr)}: ${day.totalCount}` : ''}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-3 text-[10px] text-ink-muted font-medium">
            <span>{t('stats.heatmap_active_days', locale, { n: activeDays })}</span>
            <div className="flex items-center gap-1">
              <span>{t('stats.heatmap_legend_less', locale)}</span>
              <div className="w-3 h-3 rounded-sm bg-bg-soft border border-ink-faint" />
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(0, 212, 168, 0.25)' }} />
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(0, 212, 168, 0.5)' }} />
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(0, 212, 168, 0.75)' }} />
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(0, 212, 168, 1)' }} />
              <span>{t('stats.heatmap_legend_more', locale)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function formatDate(iso: string, localeStr: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString(localeStr, { day: 'numeric', month: 'short', year: 'numeric' })
}
