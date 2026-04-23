// app/forbidden.tsx — 403 page (rendered via notFound() can't do 403, but middleware can redirect here)
// Rendered when middleware or server code redirects to /forbidden.
import { StatusPage } from '@/components/status-page'

export default function Forbidden() {
  return (
    <StatusPage
      code="403"
      title="Bạn không có quyền truy cập"
      description="Trang này yêu cầu đăng nhập hoặc bạn không có quyền xem nội dung này. Vui lòng đăng nhập để tiếp tục."
      homeHref="/login"
      homeLabel="Đăng nhập"
    />
  )
}
