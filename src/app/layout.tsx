import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { headers } from 'next/headers'
import { I18nProvider } from '@/components/i18n-provider'
import { locales, type Locale } from '@/lib/i18n'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ROOTS (GỐC) - Digital Museum for Family Heritage',
  description:
    'Preserve memories, voices, and life stories of your family. The first digital museum for family heritage in Vietnam.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Detect preferred locale from browser's Accept-Language header
  const headersList = await headers()
  const acceptLanguage = headersList.get('accept-language') ?? ''
  const preferredLocale = parseLocale(acceptLanguage)

  return (
    <html lang={preferredLocale} suppressHydrationWarning>
      <body className={`${dmSans.variable} ${playfair.variable}`}>
        <I18nProvider defaultLocale={preferredLocale}>{children}</I18nProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

// Pick the first locale from Accept-Language that we support
function parseLocale(acceptLanguage: string): Locale {
  const candidate = acceptLanguage
    .split(',')
    .map((s) => s.trim().split(';')[0].slice(0, 2).toLowerCase())
    .find((lang) => locales.includes(lang as Locale))
  return (candidate as Locale) ?? 'en'
}
