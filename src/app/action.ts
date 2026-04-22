'use server'

import { db } from '@/lib/db'
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
    const existing = await db.waitlistEntry.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    })

    if (existing) {
      return {
        success: false,
        count: null,
        message: 'Email nay da ton tai trong danh sach cho.',
      }
    }

    await db.waitlistEntry.create({
      data: { email: normalizedEmail },
    })

    const count = await db.waitlistEntry.count()
    const displayCount = count + 100

    return {
      success: true,
      count: displayCount,
      message: `Tuyệt vời! Bạn là người thứ ${displayCount} đăng ký danh sách chờ này. Chúng tôi sẽ liên hệ với bạn khi có tin tức mới. Cảm ơn bạn đã quan tâm! Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi qua email rootsfrvn@gmail.com.`,
    }
  } catch {
    return {
      success: false,
      count: null,
      message: 'Có lỗi xảy ra.',
    }
  }
}
