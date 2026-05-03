'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type IconProps = { active: boolean }

function IconHome({ active }: IconProps) {
  const c = active ? '#FFFFFF' : '#6B7280'
  return (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
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
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
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
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
      <path d="M5 21V11M12 21V3M19 21v-7" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function IconProfile({ active }: IconProps) {
  const c = active ? '#FFFFFF' : '#6B7280'
  return (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" stroke={c} strokeWidth="2.2" fill={active ? 'rgba(255,255,255,0.18)' : 'none'} />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke={c} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

const links = [
  { href: '/', label: 'Beranda', icon: IconHome, match: (p: string) => p === '/' },
  { href: '/decks', label: 'Folder', icon: IconFolder, match: (p: string) => p === '/decks' || p.startsWith('/decks') || p.startsWith('/folders') || p.startsWith('/search') },
  { href: '/stats', label: 'Progres', icon: IconStats, match: (p: string) => p.startsWith('/stats') },
  { href: '/profile', label: 'Profil', icon: IconProfile, match: (p: string) => p.startsWith('/profile') },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-3 left-3 right-3 z-40 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Navigasi utama"
    >
      <div
        className="bg-surface rounded-pill flex items-center justify-around p-1.5 border-2 border-ink-faint"
        style={{ boxShadow: '0 4px 0 0 #E5E7EB, 0 8px 24px -4px rgba(0,0,0,0.08)' }}
      >
        {links.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center min-w-14 min-h-12 px-3 py-1.5 rounded-pill transition-all duration-200 ${
                active
                  ? 'bg-mint text-white scale-105'
                  : 'text-ink-muted hover:bg-bg-soft active:scale-95'
              }`}
              style={active ? { boxShadow: '0 3px 0 0 #008F73' } : undefined}
            >
              <Icon active={active} />
              <span
                className={`text-[10px] font-extrabold mt-0.5 leading-none tracking-wide ${
                  active ? 'text-white' : 'text-ink-subtle'
                }`}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
