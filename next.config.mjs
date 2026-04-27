import { fileURLToPath } from 'url'
import { dirname } from 'path'
import createNextIntlPlugin from 'next-intl/plugin'

const __dirname = dirname(fileURLToPath(import.meta.url))

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    viewTransition: true,
  },
  turbopack: {
    root: __dirname,
  },
}

export default withNextIntl(nextConfig)
