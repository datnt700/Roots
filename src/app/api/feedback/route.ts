import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { encryptOptional } from '@/lib/crypto'
import { logger } from '@/lib/logger'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      logger.warn('feedback', 'GET /feedback called without userId')
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const feedback = await db.feedback.findMany({
      where: { memory: { userId } },
      include: { memory: true },
      orderBy: { createdAt: 'desc' },
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
