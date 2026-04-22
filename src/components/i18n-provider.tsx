'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
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
const USER_SELECTED_STORAGE_KEY = 'roots-locale-user-selected'

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('vi')

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale)
    window.localStorage.setItem(STORAGE_KEY, nextLocale)
    window.localStorage.setItem(USER_SELECTED_STORAGE_KEY, 'true')
  }, [])

  useEffect(() => {
    const storedLocale = window.localStorage.getItem(STORAGE_KEY)
    const userSelectedLocale =
      window.localStorage.getItem(USER_SELECTED_STORAGE_KEY) === 'true'

    if (
      userSelectedLocale &&
      storedLocale &&
      locales.includes(storedLocale as Locale)
    ) {
      setLocaleState(storedLocale as Locale)
      return
    }

    // For first-time visitors (or legacy auto-saved locale), default to Vietnamese.
    setLocaleState('vi')
    window.localStorage.setItem(STORAGE_KEY, 'vi')
  }, [])

  useEffect(() => {
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
