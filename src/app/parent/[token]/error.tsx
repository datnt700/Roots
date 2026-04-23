'use client'

// app/parent/[token]/error.tsx — Error boundary for the parent QR recording flow
import { useEffect } from 'react'
import { StatusPage } from '@/components/status-page'

export default function ParentFlowError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(
      '[parent-flow-error]',
      error.message,
      { digest: error.digest },
      error,
    )
  }, [error])

  return (
    <StatusPage
      code="500"
      title="Có lỗi xảy ra"
      description="Xin lỗi, có sự cố trong quá trình kết nối. Vui lòng thử lại hoặc liên hệ người thân nhờ gửi lại mã QR."
      homeHref="/"
      homeLabel="Về trang chủ"
      onReset={reset}
      resetLabel="Thử lại"
    />
  )
}
