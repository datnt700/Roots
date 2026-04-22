'use server'

import sql from '@/lib/db'
import type { WaitlistActionState } from '@/lib/waitlist-action-state'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function joinWaitlist(
  _prevState: WaitlistActionState,
  formData: FormData,
): Promise<WaitlistActionState> {
  const email = formData.get('email')

  if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    return {
      success: false,
      count: null,
      message: 'Email khong hop le. Vui long thu lai.',
    }
  }

  const normalizedEmail = email.trim().toLowerCase()

  try {
    const existing = await sql`
      SELECT 1
      FROM waitlist
      WHERE LOWER(email) = LOWER(${normalizedEmail})
      LIMIT 1
    `

    if (existing.length > 0) {
      return {
        success: false,
        count: null,
        message: 'Email nay da ton tai trong danh sach cho.',
      }
    }

    await sql`
      INSERT INTO waitlist (email) 
      VALUES (${normalizedEmail})
      ON CONFLICT (email) DO NOTHING;
    `

    const result = await sql`SELECT COUNT(*)::text AS count FROM waitlist`
    const count =
      Number((result[0] as { count?: string } | undefined)?.count ?? '0') + 100

    return {
      success: true,
      count,
      message: `Tuyệt vời! Bạn là người thứ ${count} đăng ký danh sách chờ này. Chúng tôi sẽ liên hệ với bạn khi có tin tức mới. Cảm ơn bạn đã quan tâm! Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi qua email rootsfrvn@gmail.com.`,
    }
  } catch {
    return {
      success: false,
      count: null,
      message: 'Có lỗi xảy ra.',
    }
  }
}
