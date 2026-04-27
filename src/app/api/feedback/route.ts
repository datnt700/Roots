import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { decrypt, encryptOptional } from '@/lib/crypto'
import { logger } from '@/lib/logger'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      logger.warn('feedback', 'GET /feedback called without userId')
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const rows = await db.feedback.findMany({
      where: { memory: { userId } },
      include: { memory: { include: { parent: true } } },
      orderBy: { createdAt: 'desc' },
    })

    const feedback = rows.map((f) => {
      let parentName = f.memory.parent?.name ?? ''
      try { if (parentName) parentName = decrypt(parentName) } catch { /* plaintext in dev */ }

      let content: string | null = null
      if (f.content) {
        try { content = decrypt(f.content) } catch { content = f.content }
      }

      const daysAgo = Math.floor((Date.now() - f.createdAt.getTime()) / 86400000)
      const dateLabel = daysAgo === 0 ? 'Hôm nay' : daysAgo === 1 ? '1 ngày trước' : `${daysAgo} ngày trước`

      return {
        id: f.id,
        memoryId: f.memoryId,
        parentName,
        relationship: f.memory.parent?.relationship ?? '',
        memoryPrompt: f.memory.prompt ?? '',
        date: dateLabel,
        isPlayed: f.isPlayed,
        response: content,
        createdAt: f.createdAt.toISOString(),
      }
    })

    logger.debug('feedback', 'Fetched feedback', { userId, count: feedback.length })
    return NextResponse.json({ feedback })
  } catch (err) {
    logger.error('feedback', 'Failed to fetch feedback', {}, err)
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  const t0 = Date.now()
  try {
    const body = await request.json()
    const { memoryId, userId, content } = body as {
      memoryId: string
      userId: string
      content?: string
    }

    if (!memoryId || !userId) {
      logger.warn('feedback', 'POST /feedback missing required fields', { memoryId, userId })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    const item = await db.feedback.create({
      data: {
        memoryId,
        userId,
        content: encryptOptional(content), // [ENCRYPTED] personal voice/text content
        isPlayed: false,
      },
    })

    logger.info('feedback', 'Feedback created', { feedbackId: item.id, memoryId, userId, hasContent: !!content, ms: Date.now() - t0 })
    return NextResponse.json({ id: item.id }, { status: 201 })
  } catch (err) {
    logger.error('feedback', 'Failed to create feedback', { ms: Date.now() - t0 }, err)
    return NextResponse.json(
      { error: 'Failed to create feedback' },
      { status: 500 },
    )
  }
}
