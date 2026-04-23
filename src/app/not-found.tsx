// app/not-found.tsx — Global 404 page
// Rendered by Next.js when no route matches.
import { StatusPage } from '@/components/status-page'

export default function NotFound() {
  return (
    <StatusPage
      code="404"
      title="Trang không tồn tại"
      description="Có vẻ trang bạn đang tìm đã bị di chuyển hoặc không còn ở đây nữa. Đừng lo — ký ức gia đình vẫn đang chờ bạn."
      homeHref="/"
      homeLabel="Về trang chủ"
    />
  )
}
