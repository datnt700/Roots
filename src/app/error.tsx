'use client'

// app/error.tsx — Global error boundary
// Catches unhandled runtime errors in the root layout tree.
import { useEffect } from 'react'
import { StatusPage } from '@/components/status-page'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(
      '[global-error]',
      error.message,
      { digest: error.digest },
      error,
    )
  }, [error])

  return (
    <StatusPage
      code="500"
      title="Có lỗi xảy ra"
      description="Rất xin lỗi — có gì đó không ổn ở phía chúng tôi. Vui lòng thử lại hoặc quay về trang chủ."
      homeHref="/"
      homeLabel="Về trang chủ"
      onReset={reset}
      resetLabel="Thử lại"
    />
  )
}
