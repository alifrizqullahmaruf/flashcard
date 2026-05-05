'use client'
import { useMemo } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts'
import { t } from '@/lib/i18n/translations'
import type { ForecastDay } from '@/lib/firestore/stats'
import type { Locale } from '@/lib/types'

type Props = {
  data: ForecastDay[]
  locale: Locale
}

export default function ForecastChart({ data, locale }: Props) {
  // Re-localize day labels (data was generated server-side in Indonesian)
  const localized = useMemo(() => {
    if (locale !== 'en') return data
    return data.map((d, i) => {
      let dayLabel = d.dayLabel
      if (i === 0) dayLabel = t('stats.forecast_day_today', 'en')
      else if (i === 1) dayLabel = t('stats.forecast_day_tomorrow', 'en')
      else {
        const date = new Date(d.date + 'T00:00:00')
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        dayLabel = dayNames[date.getDay()]
      }
      return { ...d, dayLabel }
    })
  }, [data, locale])

  const total = localized.reduce((s, d) => s + d.count, 0)
  const todayCount = localized[0]?.count ?? 0
  const empty = total === 0

  return (
    <div className="card-3d-soft p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-display text-base text-ink tracking-tight">{t('stats.forecast_title', locale)}</p>
          <p className="text-xs text-ink-muted font-medium">{t('stats.forecast_window', locale)}</p>
        </div>
        {!empty && (
          <div className="text-right">
            <p className="font-display text-2xl text-ink tabular leading-none tracking-tight">{todayCount}</p>
            <p className="text-[10px] text-ink-muted font-bold uppercase tracking-wide">{t('stats.forecast_today', locale)}</p>
          </div>
        )}
      </div>

      {empty ? (
        <div className="py-8 flex flex-col items-center gap-2">
          <span className="text-3xl">✨</span>
          <p className="text-ink-muted text-sm font-medium text-center">{t('stats.forecast_empty', locale)}</p>
        </div>
      ) : (
        <>
          <div style={{ width: '100%', height: 160 }}>
            <ResponsiveContainer>
              <BarChart data={localized} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="dayLabel" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} interval={0} />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={28} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid #E5E7EB',
                    fontSize: 12,
                    padding: '6px 10px',
                  }}
                  cursor={{ fill: 'rgba(0, 212, 168, 0.08)' }}
                  formatter={(val) => [t('stats.forecast_unit_card', locale, { n: Number(val) }), t('stats.forecast_due_label', locale)]}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {localized.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#FF7676' : '#00D4A8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-ink-muted font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-coral" /> {t('stats.forecast_legend_today', locale)}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-mint" /> {t('stats.forecast_legend_future', locale)}
            </span>
          </div>
        </>
      )}
    </div>
  )
}
