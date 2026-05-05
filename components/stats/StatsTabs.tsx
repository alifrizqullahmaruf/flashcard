'use client'
import { useState, useRef, useEffect, useLayoutEffect, type ReactNode } from 'react'
import { t } from '@/lib/i18n/translations'
import type { Locale } from '@/lib/types'

export type StatsTabKey = 'overview' | 'activity' | 'achievements'

type Tab = {
  key: StatsTabKey
  labelKey: 'stats.tab_overview' | 'stats.tab_activity' | 'stats.tab_achievements'
  emoji: string
}

const TABS: Tab[] = [
  { key: 'overview', labelKey: 'stats.tab_overview', emoji: '📊' },
  { key: 'activity', labelKey: 'stats.tab_activity', emoji: '📈' },
  { key: 'achievements', labelKey: 'stats.tab_achievements', emoji: '🏆' },
]

type Props = {
  overview: ReactNode
  activity: ReactNode
  achievements: ReactNode
  locale: Locale
}

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default function StatsTabs({ overview, activity, achievements, locale }: Props) {
  const [active, setActive] = useState<StatsTabKey>('overview')
  const containerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Record<StatsTabKey, HTMLButtonElement | null>>({
    overview: null,
    activity: null,
    achievements: null,
  })
  const [pill, setPill] = useState<{ x: number; w: number; ready: boolean }>({
    x: 0, w: 0, ready: false,
  })

  const measure = () => {
    const node = tabRefs.current[active]
    const container = containerRef.current
    if (!node || !container) return
    const nRect = node.getBoundingClientRect()
    const cRect = container.getBoundingClientRect()
    setPill({ x: nRect.left - cRect.left, w: nRect.width, ready: true })
  }

  useIsoLayoutEffect(() => {
    measure()
    // Re-measure once after fonts settle
    const t = setTimeout(measure, 50)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  useEffect(() => {
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  return (
    <>
      {/* === STICKY TAB BAR — fully opaque, with clear separator === */}
      <div
        className="sticky top-14 z-30 -mx-5 px-5 py-3 "
        style={{
          boxShadow: '0 6px 12px -8px rgba(31, 41, 55, 0.10), 0 1px 0 0 rgba(31, 41, 55, 0.04)',
        }}
      >
        <div
          ref={containerRef}
          role="tablist"
          aria-label="Statistik tabs"
          className="relative max-w-2xl mx-auto flex bg-surface rounded-pill p-1.5"
        >
          {/* Sliding pill */}
          <div
            aria-hidden="true"
            className="absolute rounded-pill bg-mint pointer-events-none"
            style={{
              top: 6,
              bottom: 6,
              left: 0,
              transform: `translate3d(${pill.x}px, 0, 0)`,
              width: pill.w,
              opacity: pill.ready ? 1 : 0,
              transition: pill.ready
                ? 'transform 0.36s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.36s cubic-bezier(0.34, 1.56, 0.64, 1)'
                : 'none',
              boxShadow: '0 2px 0 0 #008F73, 0 1px 6px rgba(0, 143, 115, 0.25)',
            }}
          />

          {TABS.map((tab) => {
            const isActive = active === tab.key
            return (
              <button
                key={tab.key}
                ref={(el) => { tabRefs.current[tab.key] = el }}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.key}`}
                id={`tab-${tab.key}`}
                onClick={() => setActive(tab.key)}
                className="relative z-10 flex-1 flex items-center justify-center gap-2 h-11 px-3 rounded-pill text-sm font-extrabold active:scale-[0.97]"
                style={{
                  color: isActive ? '#FFFFFF' : '#6B7280',
                  transition: 'color 0.22s ease, transform 0.08s ease',
                }}
              >
                <span
                  className="text-lg leading-none"
                  style={{
                    transform: isActive ? 'scale(1.12)' : 'scale(1)',
                    transition: 'transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    display: 'inline-block',
                  }}
                >
                  {tab.emoji}
                </span>
                <span className="whitespace-nowrap">{t(tab.labelKey, locale)}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* === PANELS === */}
      <div className="pt-16">
        <TabPanel id="overview" active={active === 'overview'}>{overview}</TabPanel>
        <TabPanel id="activity" active={active === 'activity'}>{activity}</TabPanel>
        <TabPanel id="achievements" active={active === 'achievements'}>{achievements}</TabPanel>
      </div>
    </>
  )
}

function TabPanel({ id, active, children }: { id: StatsTabKey; active: boolean; children: ReactNode }) {
  if (!active) return null
  return (
    <div
      key={id}
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
      className="space-y-5 tab-fade-in"
    >
      {children}
    </div>
  )
}
