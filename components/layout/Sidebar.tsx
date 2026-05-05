'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useT } from '@/components/i18n/LocaleProvider'

type IconProps = { active: boolean }

function IconHome({ active }: IconProps) {
  const c = active ? '#FFFFFF' : '#6B7280'
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path
        d="M3 11l9-8 9 8v9a2 2 0 01-2 2h-4v-7H10v7H6a2 2 0 01-2-2v-9z"
        stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
        fill={active ? 'rgba(255,255,255,0.18)' : 'none'}
      />
    </svg>
  )
}

function IconFolder({ active }: IconProps) {
  const c = active ? '#FFFFFF' : '#6B7280'
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path
        d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
        stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
        fill={active ? 'rgba(255,255,255,0.18)' : 'none'}
      />
    </svg>
  )
}

function IconStats({ active }: IconProps) {
  const c = active ? '#FFFFFF' : '#6B7280'
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path d="M5 21V11M12 21V3M19 21v-7" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function IconProfile({ active }: IconProps) {
  const c = active ? '#FFFFFF' : '#6B7280'
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" stroke={c} strokeWidth="2.2" fill={active ? 'rgba(255,255,255,0.18)' : 'none'} />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke={c} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

const links = [
  { href: '/', labelKey: 'nav.home' as const, icon: IconHome, match: (p: string) => p === '/' },
  { href: '/decks', labelKey: 'nav.folder' as const, icon: IconFolder, match: (p: string) => p === '/decks' || p.startsWith('/decks') || p.startsWith('/folders') || p.startsWith('/search') },
  { href: '/stats', labelKey: 'nav.progress' as const, icon: IconStats, match: (p: string) => p.startsWith('/stats') },
  { href: '/profile', labelKey: 'nav.profile' as const, icon: IconProfile, match: (p: string) => p.startsWith('/profile') },
]

export default function Sidebar() {
  const pathname = usePathname()
  const t = useT()

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-surface min-h-screen sticky top-0 border-r border-ink-faint">
      {/* Brand */}
      <div className="px-6 py-7 flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-2xl bg-mint flex items-center justify-center"
          style={{ boxShadow: '0 4px 0 0 #008F73' }}
        >
          <span className="font-display text-white text-2xl leading-none">H</span>
        </div>
        <div>
          <p className="font-display text-2xl text-ink leading-none tracking-tight">Hafalin</p>
          <p className="text-ink-subtle text-[11px] font-bold uppercase tracking-wider mt-1">{t('nav.brand_tagline')}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1.5 px-3 flex-1">
        {links.map(({ href, labelKey, icon: Icon, match }) => {
          const active = match(pathname)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`group relative flex items-center gap-3 h-12 px-4 rounded-btn text-sm font-extrabold transition-all duration-200 ${
                active
                  ? 'bg-mint text-white'
                  : 'text-ink-muted hover:bg-bg-soft hover:text-ink active:scale-[0.98]'
              }`}
              style={active ? { boxShadow: '0 3px 0 0 #008F73' } : undefined}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full opacity-90" />
              )}
              <Icon active={active} />
              <span>{t(labelKey)}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer brand mark */}
      <div className="px-6 py-5 text-[10px] text-ink-subtle font-bold uppercase tracking-widest">
        v1.0 · MVP
      </div>
    </aside>
  )
}
