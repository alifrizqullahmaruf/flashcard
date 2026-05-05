'use client'
import { useState, useMemo } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { t } from '@/lib/i18n/translations'
import type { IntervalBucket } from '@/lib/firestore/stats'
import type { Locale } from '@/lib/types'

type Props = {
  data: IntervalBucket[]
  locale: Locale
}

export default function IntervalHistogram({ data, locale }: Props) {
  const [open, setOpen] = useState(false)

  // Override bucket labels with localized versions (data uses ID labels by default)
  const localized = useMemo(() => {
    const labelKeys: Array<'stats.interval_label_1d' | 'stats.interval_label_1w' | 'stats.interval_label_1m' | 'stats.interval_label_3m' | 'stats.interval_label_1y' | 'stats.interval_label_long'> = [
      'stats.interval_label_1d',
      'stats.interval_label_1w',
      'stats.interval_label_1m',
      'stats.interval_label_3m',
      'stats.interval_label_1y',
      'stats.interval_label_long',
    ]
    return data.map((b, i) => ({
      ...b,
      label: t(labelKeys[i] ?? 'stats.interval_label_1d', locale),
    }))
  }, [data, locale])

  const total = localized.reduce((s, b) => s + b.count, 0)

  if (total === 0) return null

  return (
    <div className="card-3d-soft overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-4 hover:bg-bg-soft transition-colors"
      >
        <div className="text-left">
          <p className="font-display text-base text-ink tracking-tight">{t('stats.interval_title', locale)}</p>
          <p className="text-xs text-ink-muted font-medium">
            {t('stats.interval_subtitle', locale, { n: total })}
          </p>
        </div>
        <span className={`text-ink-subtle text-base transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="p-4 pt-0 slide-up">
          <p className="text-xs text-ink-muted font-medium mb-3">{t('stats.interval_desc', locale)}</p>
          <div style={{ width: '100%', height: 160 }}>
            <ResponsiveContainer>
              <BarChart data={localized} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="range" tick={{ fontSize: 9, fill: '#9CA3AF' }} axisLine={false} tickLine={false} interval={0} />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={28} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid #E5E7EB',
                    fontSize: 12,
                    padding: '6px 10px',
                  }}
                  cursor={{ fill: 'rgba(167, 139, 250, 0.12)' }}
                  formatter={(val) => [
                    `${val} ${t('stats.interval_unit', locale)}`,
                    t('stats.interval_count_label', locale),
                  ]}
                  labelFormatter={(label) => {
                    const bucket = localized.find((d) => d.range === label)
                    return bucket?.label ?? String(label)
                  }}
                />
                <Bar dataKey="count" fill="#A78BFA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
