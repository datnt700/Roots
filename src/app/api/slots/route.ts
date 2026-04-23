/**
 * /api/slots
 *
 * GET  ?token=<rawToken>   — validate QR token for parent flow (replaces parent-sessions GET)
 * GET  ?userId=<id>        — list all slots for a user's album grid
 * POST                     — create a new memory slot (student action)
 * PATCH                    — update prompt/title on an existing slot
 *
 * 1 slot = 1 physical album page = 1 persistent QR sticker.
 * Token never expires — student can update prompt at any time.
 */
import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { db } from '@/lib/db'
import { hashToken, decrypt } from '@/lib/crypto'
import { logger } from '@/lib/logger'

// ─── GET ─────────────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  const t0 = Date.now()
  const { searchParams } = new URL(request.url)
  const rawToken = searchParams.get('token')
  const userId = searchParams.get('userId')

  // ── Validate QR token (parent-facing) ─────────────────────────────────────
  if (rawToken) {
    try {
      const tokenHash = hashToken(rawToken)
      const slot = await db.memorySlot.findUnique({
        where: { tokenHash },
        include: {
          parent: { include: { user: true } },
        },
      })

      if (!slot) {
        logger.warn('slots', 'QR token not found')
        return NextResponse.json({ error: 'Invalid QR code' }, { status: 404 })
      }

      const parentName = decrypt(slot.parent.name)
      const studentName = decrypt(slot.parent.user.displayName)

      logger.info('slots', 'QR token validated', {
        slotId: slot.id,
        parentId: slot.parentId,
        ms: Date.now() - t0,
      })
      return NextResponse.json({
        slotId: slot.id,
        parentId: slot.parentId,
        userId: slot.userId,
        parentName,
        studentName,
        relationship: slot.parent.relationship,
        locale: slot.parent.locale,
        pageNumber: slot.pageNumber,
        title: slot.title,
        prompt: slot.prompt,
        coverPhotoKey: slot.coverPhotoKey ?? null,
      })
    } catch (err) {
      logger.error(
        'slots',
        'Failed to validate QR token',
        { ms: Date.now() - t0 },
        err,
      )
      return NextResponse.json(
        { error: 'Failed to validate QR' },
        { status: 500 },
      )
    }
  }

  // ── List all slots for album grid (student-facing) ─────────────────────────
  if (userId) {
    try {
      const slots = await db.memorySlot.findMany({
        where: { userId },
        orderBy: { pageNumber: 'asc' },
        include: {
          parent: { select: { name: true, relationship: true } },
          memories: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { id: true, isProcessed: true, createdAt: true },
          },
        },
      })

      const result = slots.map((s) => ({
        id: s.id,
        pageNumber: s.pageNumber,
        title: s.title,
        prompt: s.prompt,
        parentId: s.parentId,
        parentName: decrypt(s.parent.name),
        relationship: s.parent.relationship,
        coverPhotoKey: s.coverPhotoKey ?? null,
        latestMemory: s.memories[0] ?? null,
        hasRecording: s.memories.length > 0,
      }))

      logger.debug('slots', 'Album grid fetched', {
        userId,
        count: result.length,
        ms: Date.now() - t0,
      })
      return NextResponse.json({ slots: result })
    } catch (err) {
      logger.error(
        'slots',
        'Failed to fetch slots',
        { userId, ms: Date.now() - t0 },
        err,
      )
      return NextResponse.json(
        { error: 'Failed to fetch slots' },
        { status: 500 },
      )
    }
  }

  return NextResponse.json(
    { error: 'token or userId is required' },
    { status: 400 },
  )
}

// ─── POST — create a new slot ─────────────────────────────────────────────────

export async function POST(request: Request) {
  const t0 = Date.now()
  try {
    const body = (await request.json()) as {
      userId: string
      parentId: string
      title?: string
      prompt?: string
      pageNumber?: number
    }
    const { userId, parentId, title = '', prompt = '', pageNumber } = body

    if (!userId || !parentId) {
      logger.warn('slots', 'POST missing userId or parentId')
      return NextResponse.json(
        { error: 'userId and parentId are required' },
        { status: 400 },
      )
    }

    // Auto-assign next page number if not provided
    let page = pageNumber
    if (!page) {
      const last = await db.memorySlot.findFirst({
        where: { userId },
        orderBy: { pageNumber: 'desc' },
        select: { pageNumber: true },
      })
      page = (last?.pageNumber ?? 0) + 1
    }

    // Generate persistent QR token — never expires
    const rawToken = randomBytes(32).toString('hex')
    const tokenHash = hashToken(rawToken)

    const slot = await db.memorySlot.create({
      data: { userId, parentId, pageNumber: page, title, prompt, tokenHash },
    })

    const qrUrl = `/parent/${rawToken}`
    logger.info('slots', 'Memory slot created', {
      slotId: slot.id,
      userId,
      parentId,
      page,
      ms: Date.now() - t0,
    })
    return NextResponse.json(
      { slotId: slot.id, token: rawToken, qrUrl, pageNumber: page },
      { status: 201 },
    )
  } catch (err) {
    logger.error('slots', 'Failed to create slot', { ms: Date.now() - t0 }, err)
    return NextResponse.json(
      { error: 'Failed to create slot' },
      { status: 500 },
    )
  }
}

// ─── PATCH — update prompt or title ─────────────────────────────────────────

export async function PATCH(request: Request) {
  const t0 = Date.now()
  try {
    const body = (await request.json()) as {
      slotId: string
      title?: string
      prompt?: string
    }
    const { slotId, title, prompt } = body

    if (!slotId) {
      return NextResponse.json({ error: 'slotId is required' }, { status: 400 })
    }

    const slot = await db.memorySlot.update({
      where: { id: slotId },
      data: {
        ...(title !== undefined && { title }),
        ...(prompt !== undefined && { prompt }),
      },
    })

    logger.info('slots', 'Slot updated', {
      slotId,
      hasPrompt: !!slot.prompt,
      ms: Date.now() - t0,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    logger.error('slots', 'Failed to update slot', { ms: Date.now() - t0 }, err)
    return NextResponse.json(
      { error: 'Failed to update slot' },
      { status: 500 },
    )
  }
}
