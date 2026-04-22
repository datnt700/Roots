'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  locales,
  type Locale,
  type TranslationSchema,
  translations,
} from '@/lib/i18n'

type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  messages: TranslationSchema
  t: (key: keyof (typeof translations)[Locale]['navbar']) => string
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

const STORAGE_KEY = 'roots-locale'

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    const storedLocale = window.localStorage.getItem(STORAGE_KEY)
    if (storedLocale && locales.includes(storedLocale as Locale)) {
      setLocale(storedLocale as Locale)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale)
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo<I18nContextValue>(() => {
    return {
      locale,
      setLocale,
      messages: translations[locale],
      t: (key) => translations[locale].navbar[key],
    }
  }, [locale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)

  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }

  return context
}
