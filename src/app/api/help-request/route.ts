import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashToken, decrypt } from '@/lib/crypto'
import { sendHelpRequestEmail } from '@/lib/email'
import { logger } from '@/lib/logger'

export async function POST(request: Request) {
  try {
    const { token } = (await request.json()) as { token?: string }
    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 })
    }

    const tokenHash = hashToken(token)
    const slot = await db.memorySlot.findUnique({
      where: { tokenHash },
      include: { parent: { include: { user: true } } },
    })

    if (!slot || !slot.parent) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const studentEmail = decrypt(slot.parent.user.email)
    const studentName = decrypt(slot.parent.user.displayName)
    const parentName = decrypt(slot.parent.name)

    await sendHelpRequestEmail({
      to: studentEmail,
      studentName,
      parentName,
      relationship: slot.parent.relationship,
      token,
    })

    logger.info('help-request', 'Help request sent', {
      slotId: slot.id,
      parentId: slot.parentId,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    logger.error('help-request', 'Failed to send help request', {}, err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
