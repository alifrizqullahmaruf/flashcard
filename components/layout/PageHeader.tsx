import Link from 'next/link'

type Props = {
  title: string
  backHref?: string
  action?: React.ReactNode
}

export default function PageHeader({ title, backHref, action }: Props) {
  return (
    <header className="sticky top-0 z-30 bg-cream border-b border-cream-dark px-4 h-14 flex items-center gap-2 shrink-0">
      {backHref && (
        <Link
          href={backHref}
          className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-cream-dark transition-colors shrink-0"
          aria-label="Kembali"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      )}
      <h1 className="flex-1 text-base font-semibold text-ink truncate">{title}</h1>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  )
}
