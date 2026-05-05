'use client'
import { useMemo } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { t } from '@/lib/i18n/translations'
import type { DailyActivity } from '@/lib/firestore/stats'
import type { Locale } from '@/lib/types'

type Props = {
  data: DailyActivity[]
  locale: Locale
}

export default function ReviewsPerDayChart({ data, locale }: Props) {
  const sliced = useMemo(() => data.slice(-30), [data])
  const localeStr = locale === 'en' ? 'en-US' : 'id-ID'

  const labelReview = t('stats.reviews_label_review', locale)
  const labelNew = t('stats.reviews_label_new', locale)

  const chartData = useMemo(
    () =>
      sliced.map((d) => ({
        date: d.date,
        label: shortLabel(d.date, localeStr),
        [labelReview]: d.reviewCount,
        [labelNew]: d.newCount,
      })),
    [sliced, localeStr, labelReview, labelNew]
  )

  const totalReviews = sliced.reduce((s, d) => s + d.totalCount, 0)
  const empty = totalReviews === 0

  return (
    <div className="card-3d-soft p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-display text-base text-ink tracking-tight">{t('stats.reviews_title', locale)}</p>
          <p className="text-xs text-ink-muted font-medium">{t('stats.reviews_window', locale)}</p>
        </div>
        {!empty && (
          <p className="text-xs text-ink-muted font-medium">
            <span className="font-bold text-ink">{Math.round(totalReviews / 30)}</span>{' '}
            {t('stats.reviews_avg', locale)}
          </p>
        )}
      </div>

      {empty ? (
        <div className="py-8 flex flex-col items-center gap-2">
          <span className="text-3xl">📊</span>
          <p className="text-ink-muted text-sm font-medium text-center">{t('stats.reviews_empty', locale)}</p>
        </div>
      ) : (
        <div style={{ width: '100%', height: 180 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="#E5E7EB" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 9, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                interval={Math.max(0, Math.floor(chartData.length / 6) - 1)}
              />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={28} />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid #E5E7EB',
                  fontSize: 12,
                  padding: '6px 10px',
                }}
                cursor={{ fill: 'rgba(0, 212, 168, 0.08)' }}
                labelFormatter={(label, payload) => {
                  const item = payload?.[0]?.payload as { date?: string } | undefined
                  return item?.date ? formatFullDate(item.date, localeStr) : label
                }}
              />
              <Bar dataKey={labelReview} stackId="x" fill="#00D4A8" radius={[0, 0, 0, 0]} />
              <Bar dataKey={labelNew} stackId="x" fill="#FFD23F" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

function shortLabel(iso: string, localeStr: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString(localeStr, { day: 'numeric', month: 'short' })
}

function formatFullDate(iso: string, localeStr: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString(localeStr, { weekday: 'long', day: 'numeric', month: 'short' })
}
