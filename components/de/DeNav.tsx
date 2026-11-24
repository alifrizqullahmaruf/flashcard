'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, ChartColumn, House, Layers } from 'lucide-react'

const links = [
  { href: '/de', label: 'Beranda', Icon: House, match: (p: string) => p === '/de' },
  { href: '/de/materi', label: 'Materi', Icon: BookOpen, match: (p: string) => p.startsWith('/de/materi') },
  { href: '/de/kartu', label: 'Kartu', Icon: Layers, match: (p: string) => p.startsWith('/de/kartu') },
  { href: '/de/progress', label: 'Progress', Icon: ChartColumn, match: (p: string) => p.startsWith('/de/progress') },
]

/** Study sessions are full-screen (like Anki/Duolingo): no tab bar, back link at the top. */
const isFocusRoute = (p: string) =>
  /^\/de\/kartu\/[^/]+\/[^/]+/.test(p) || /\/latihan(\/|$)/.test(p) || /^\/de\/(hari-ini|latihan-artikel|mulai-belajar|konteks)(\/|$)/.test(p)

export default function DeNav() {
  const pathname = usePathname()
  if (isFocusRoute(pathname)) return null
  return (
    <>
      {/* spacer so page content can scroll above the fixed bar */}
      <div className="h-20" aria-hidden />
      <nav
        className="fixed bottom-0 inset-x-0 z-40 bg-surface/90 backdrop-blur border-t border-ink-faint"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Navigasi utama"
      >
        <div className="mx-auto max-w-md grid grid-cols-4">
          {links.map(({ href, label, Icon, match }) => {
            const active = match(pathname)
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`relative flex flex-col items-center justify-center gap-1 h-16 transition-colors ${active ? 'text-ink' : 'text-ink-subtle'}`}
              >
                {active && <span className="absolute top-0 h-[2px] w-8 rounded-b bg-ink" />}
                <Icon size={22} strokeWidth={active ? 2 : 1.6} />
                <span className={`text-[11px] leading-none ${active ? 'font-semibold' : 'font-medium'}`}>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
