import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { encrypt, encryptOptional } from '@/lib/crypto'
import { logger } from '@/lib/logger'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      logger.warn('memories', 'GET /memories called without userId')
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const memories = await db.memory.findMany({
      where: { userId },
      include: { transcript: true, reflection: true },
      orderBy: { createdAt: 'desc' },
    })

    logger.debug('memories', 'Fetched memories', { userId, count: memories.length })
    return NextResponse.json({ memories })
  } catch (err) {
    logger.error('memories', 'Failed to fetch memories', {}, err)
    return NextResponse.json(
      { error: 'Failed to fetch memories' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  const t0 = Date.now()
  try {
    const body = await request.json()
    const { userId, parentId, prompt, decade, audioKey, photoKey } = body as {
      userId: string
      parentId: string
      prompt: string
      decade?: string
      audioKey?: string // raw S3 key from /api/upload — encrypted here before DB write
      photoKey?: string // raw S3 key from /api/upload — encrypted here before DB write
    }

    if (!userId || !parentId || !prompt) {
      logger.warn('memories', 'POST /memories missing required fields', { userId, parentId })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    const memory = await db.memory.create({
      data: {
        userId,
        parentId,
        prompt,
        decade: decade ?? null,
        // Encrypt S3 keys before storage (biometric-adjacent per Decree 13/2023)
        audioKey: encryptOptional(audioKey),
        photoKey: encryptOptional(photoKey),
        isProcessed: false,
      },
    })

    logger.info('memories', 'Memory created', { memoryId: memory.id, userId, parentId, hasAudio: !!audioKey, hasPhoto: !!photoKey, ms: Date.now() - t0 })
    return NextResponse.json({ id: memory.id }, { status: 201 })
  } catch (err) {
    logger.error('memories', 'Failed to create memory', { ms: Date.now() - t0 }, err)
    return NextResponse.json(
      { error: 'Failed to create memory' },
      { status: 500 },
    )
  }
}
