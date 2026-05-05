'use client'
import { useMemo } from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { t } from '@/lib/i18n/translations'
import type { Locale } from '@/lib/types'

type Props = {
  newCount: number
  learningCount: number
  masteredCount: number
  locale: Locale
}

const COLORS = {
  baru: '#9CA3AF',
  belajar: '#FFD23F',
  hafal: '#00D4A8',
}

export default function MasteryDonut({ newCount, learningCount, masteredCount, locale }: Props) {
  const total = newCount + learningCount + masteredCount
  const pct = total > 0 ? Math.round((masteredCount / total) * 100) : 0

  const labelMastered = t('stats.mastery_legend_mastered', locale)
  const labelLearning = t('stats.mastery_legend_learning', locale)
  const labelNew = t('stats.mastery_legend_new', locale)
  const cardUnit = t('stats.interval_unit', locale)

  const data = useMemo(
    () => [
      { name: labelMastered, value: masteredCount, fill: COLORS.hafal },
      { name: labelLearning, value: learningCount, fill: COLORS.belajar },
      { name: labelNew, value: newCount, fill: COLORS.baru },
    ].filter((d) => d.value > 0),
    [newCount, learningCount, masteredCount, labelMastered, labelLearning, labelNew]
  )

  if (total === 0) {
    return (
      <div className="card-3d-soft p-5 flex flex-col items-center gap-2">
        <span className="text-3xl">🍩</span>
        <p className="font-display text-base text-ink">{t('stats.mastery_empty_title', locale)}</p>
        <p className="text-ink-muted text-xs text-center">{t('stats.mastery_empty_desc', locale)}</p>
      </div>
    )
  }

  return (
    <div className="card-3d-soft p-4">
      <p className="font-display text-base text-ink tracking-tight mb-1">{t('stats.mastery_title', locale)}</p>
      <p className="text-xs text-ink-muted font-medium mb-3">{t('stats.mastery_subtitle', locale)}</p>

      <div className="relative" style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={56}
              outerRadius={88}
              paddingAngle={2}
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.fill} stroke="#FFFFFF" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #E5E7EB',
                fontSize: 12,
                padding: '6px 10px',
              }}
              formatter={(val, name) => [`${val} ${cardUnit}`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="font-display text-3xl text-ink tabular leading-none tracking-tight">{pct}%</p>
          <p className="text-[10px] text-ink-muted font-bold uppercase tracking-wide mt-1">
            {t('stats.mastery_center_label', locale)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3 text-center">
        <LegendItem color={COLORS.baru} label={labelNew} value={newCount} />
        <LegendItem color={COLORS.belajar} label={labelLearning} value={learningCount} />
        <LegendItem color={COLORS.hafal} label={labelMastered} value={masteredCount} />
      </div>
    </div>
  )
}

function LegendItem({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
        <span className="text-[10px] text-ink-muted font-bold uppercase tracking-wide">{label}</span>
      </div>
      <p className="font-display text-lg text-ink tabular leading-none">{value}</p>
    </div>
  )
}
