'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type IconProps = { active: boolean }

function IconFolder({ active }: IconProps) {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
      <path
        d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
        stroke={active ? '#1A1A1A' : '#6B6B6B'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

function IconSearch({ active }: IconProps) {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="7" stroke={active ? '#1A1A1A' : '#6B6B6B'} strokeWidth="1.5" />
      <path d="M21 21l-4.35-4.35" stroke={active ? '#1A1A1A' : '#6B6B6B'} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconStats({ active }: IconProps) {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 20V10M10 20V4M16 20v-7M22 20H2"
        stroke={active ? '#1A1A1A' : '#6B6B6B'} strokeWidth="1.5" strokeLinecap="round"
      />
    </svg>
  )
}

function IconProfile({ active }: IconProps) {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" stroke={active ? '#1A1A1A' : '#6B6B6B'} strokeWidth="1.5" />
      <path
        d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"
        stroke={active ? '#1A1A1A' : '#6B6B6B'} strokeWidth="1.5" strokeLinecap="round"
      />
    </svg>
  )
}

const links = [
  { href: '/decks', label: 'Folder', icon: IconFolder, match: (p: string) => p === '/decks' || p.startsWith('/decks') || p.startsWith('/folders') },
  { href: '/search', label: 'Cari', icon: IconSearch, match: (p: string) => p.startsWith('/search') },
  { href: '/stats', label: 'Progress', icon: IconStats, match: (p: string) => p.startsWith('/stats') },
  { href: '/profile', label: 'Profil', icon: IconProfile, match: (p: string) => p.startsWith('/profile') },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-cream-dark bg-surface min-h-screen sticky top-0">
      <div className="px-6 py-6 border-b border-cream-dark">
        <span className="font-display text-xl text-ink">Flashcard</span>
      </div>
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {links.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 h-10 px-3 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-cream text-ink'
                  : 'text-ink-muted hover:bg-cream hover:text-ink'
              }`}
            >
              <Icon active={active} />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
