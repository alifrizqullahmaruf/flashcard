'use client'
import { createContext, useContext, type ReactNode } from 'react'
import { t as translate, type TranslationKey } from '@/lib/i18n/translations'
import type { Locale } from '@/lib/types'

type LocaleContextValue = {
  locale: Locale
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale
  children: ReactNode
}) {
  const value: LocaleContextValue = {
    locale,
    t: (key, vars) => translate(key, locale, vars),
  }
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): Locale {
  const ctx = useContext(LocaleContext)
  if (!ctx) return 'id'
  return ctx.locale
}

/**
 * Client-side translation hook.
 * Returns a memo-stable t() function bound to the user's current locale.
 */
export function useT(): (key: TranslationKey, vars?: Record<string, string | number>) => string {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    // Fallback to id if used outside provider (defensive)
    return (key, vars) => translate(key, 'id', vars)
  }
  return ctx.t
}
