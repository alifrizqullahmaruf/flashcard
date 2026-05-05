'use client'
import Link from 'next/link'
import { useT } from '@/components/i18n/LocaleProvider'

type Props = {
  title: string
  backHref?: string
  action?: React.ReactNode
}

export default function PageHeader({ title, backHref, action }: Props) {
  const t = useT()
  return (
    <header className="sticky top-0 z-30 bg-bg/85 backdrop-blur-md border-b border-ink-faint px-4 h-16 flex items-center gap-2 shrink-0">
      <div className="flex items-center gap-2 flex-1 min-w-0 max-w-2xl mx-auto w-full">
        {backHref && (
          <Link
            href={backHref}
            className="w-11 h-11 flex items-center justify-center -ml-2 rounded-full hover:bg-bg-soft transition-colors shrink-0"
            aria-label={t('common.back')}
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        )}
        <h1 className="font-display text-2xl text-ink truncate flex-1">{title}</h1>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  )
}
