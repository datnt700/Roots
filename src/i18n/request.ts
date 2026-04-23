import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'

const locales = ['en', 'vi', 'fr'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

const namespaces = [
  'navbar',
  'hero',
  'problem',
  'solution',
  'competitive',
  'tech',
  'finalCta',
  'footer',
  'app',
  'dashboard',
  'record',
  'studio',
  'feedback',
  'timeline',
  'parents',
] as const

/**
 * Resolve locale priority:
 * 1. Cookie (user explicitly switched language)
 * 2. Browser Accept-Language header
 * 3. Default: 'en'
 */
export function resolveLocale(
  acceptLanguage: string,
  cookieLocale?: string,
): Locale {
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale
  }
  const preferred = acceptLanguage
    .split(',')
    .map((part) => part.split(';')[0].trim().toLowerCase().slice(0, 2))
    .find((lang) => locales.includes(lang as Locale))
  return (preferred as Locale) ?? defaultLocale
}

async function loadMessages(locale: Locale) {
  const entries = await Promise.all(
    namespaces.map(async (ns) => {
      const mod = await import(`../../messages/${locale}/${ns}.json`)
      return [ns, mod.default] as const
    }),
  )
  return Object.fromEntries(entries)
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const headerStore = await headers()

  const cookieLocale = cookieStore.get('roots-locale')?.value
  const acceptLanguage = headerStore.get('accept-language') ?? ''
  const locale = resolveLocale(acceptLanguage, cookieLocale)

  return {
    locale,
    messages: await loadMessages(locale),
  }
})
