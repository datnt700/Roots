// app/app/not-found.tsx — 404 inside the /app section
import { StatusPage } from '@/components/status-page'

export default function AppNotFound() {
  return (
    <StatusPage
      code="404"
      title="Không tìm thấy trang"
      description="Trang bạn đang tìm không tồn tại trong ứng dụng. Quay về dashboard để tiếp tục."
      homeHref="/app"
      homeLabel="Về dashboard"
    />
  )
}
