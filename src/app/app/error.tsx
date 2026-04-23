'use client'

// app/app/error.tsx — Error boundary for the /app/* student section
import { useEffect } from 'react'
import { logger } from '@/lib/logger'
import { StatusPage } from '@/components/status-page'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logger.error('app-section-error', error.message ?? 'Unhandled error in /app', {
      digest: error.digest,
    }, error)
  }, [error])

  return (
    <StatusPage
      code="500"
      title="Có lỗi xảy ra"
      description="Rất xin lỗi — có gì đó không ổn. Vui lòng thử lại hoặc quay về trang chủ."
      homeHref="/app"
      homeLabel="Về dashboard"
      onReset={reset}
      resetLabel="Thử lại"
    />
  )
}
