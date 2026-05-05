'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { setUserLanguage } from '@/lib/actions/user.actions'
import { toast } from '@/lib/toast'
import { useLocale } from '@/components/i18n/LocaleProvider'
import { t } from '@/lib/i18n/translations'
import type { Locale } from '@/lib/types'

export default function LanguagePicker() {
  const router = useRouter()
  const currentLocale = useLocale()
  const [isPending, startTransition] = useTransition()
  const [pending, setPending] = useState<Locale | null>(null)

  function handleSelect(lang: Locale) {
    if (lang === currentLocale || isPending) return
    setPending(lang)
    startTransition(async () => {
      const result = await setUserLanguage(lang)
      if (result.success) {
        toast(t('profile.lang_saved', lang))
        router.refresh()
      } else {
        toast(t('profile.lang_save_failed', currentLocale), 'error')
      }
      setPending(null)
    })
  }

  return (
    <div className="px-4 py-4">
      <p className="text-ink-muted text-xs font-bold uppercase tracking-wide mb-3">
        {t('profile.lang_picker_title', currentLocale)}
      </p>
      <div className="grid grid-cols-2 gap-2">
        <LangButton
          flag="🇮🇩"
          label={t('common.lang.id', currentLocale)}
          active={currentLocale === 'id'}
          loading={pending === 'id'}
          onClick={() => handleSelect('id')}
        />
        <LangButton
          flag="🇬🇧"
          label={t('common.lang.en', currentLocale)}
          active={currentLocale === 'en'}
          loading={pending === 'en'}
          onClick={() => handleSelect('en')}
        />
      </div>
    </div>
  )
}

function LangButton({
  flag,
  label,
  active,
  loading,
  onClick,
}: {
  flag: string
  label: string
  active: boolean
  loading: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={active || loading}
      className={`relative flex items-center gap-2 h-12 px-4 rounded-xl border-2 transition-all active:scale-[0.98] ${
        active
          ? 'border-mint bg-mint-soft'
          : 'border-ink-faint bg-surface hover:bg-bg-soft hover:border-ink-subtle'
      }`}
      style={active ? { boxShadow: '0 3px 0 0 #00B891' } : undefined}
      aria-pressed={active}
    >
      <span className="text-2xl leading-none shrink-0">{flag}</span>
      <span className={`text-sm font-bold flex-1 text-left ${active ? 'text-mint-deep' : 'text-ink'}`}>
        {label}
      </span>
      {active && !loading && <span className="text-mint-deep text-base">✓</span>}
      {loading && <span className="text-ink-subtle text-xs animate-pulse">...</span>}
    </button>
  )
}
