import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { decrypt, encryptOptional } from '@/lib/crypto'
import { logger } from '@/lib/logger'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      logger.warn('memories', 'GET /memories called without userId')
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const rows = await db.memory.findMany({
      where: { userId },
      include: {
        parent: true,
        transcript: { include: { aiSummary: true } },
        reflection: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const memories = rows.map((m) => {
      // Decrypt parent name
      let parentName = m.parent?.name ?? ''
      try { if (parentName) parentName = decrypt(parentName) } catch { /* plaintext in dev */ }

      // Decrypt transcript
      let transcriptContent: string | null = null
      if (m.transcript?.content) {
        try { transcriptContent = decrypt(m.transcript.content) } catch { transcriptContent = m.transcript.content }
      }

      // Decrypt AI summary fields
      let aiTitle: string | null = null
      let aiSummary: string | null = null
      let aiTags: string[] = []
      if (m.transcript?.aiSummary) {
        const s = m.transcript.aiSummary
        try { aiTitle = decrypt(s.title) } catch { aiTitle = s.title }
        try { aiSummary = decrypt(s.summary) } catch { aiSummary = s.summary }
        try { aiTags = JSON.parse(JSON.stringify(s.tags)) as string[] } catch { aiTags = [] }
      }

      // Decrypt reflection
      let reflection: string | null = null
      if (m.reflection?.content) {
        try { reflection = decrypt(m.reflection.content) } catch { reflection = m.reflection.content }
      }

      return {
        id: m.id,
        prompt: m.prompt ?? '',
        parentName,
        relationship: m.parent?.relationship ?? '',
        decade: m.decade ?? '',
        isProcessed: m.isProcessed,
        hasPhoto: !!m.photoKey,
        transcript: transcriptContent,
        reflection,
        aiTitle,
        aiSummary,
        aiTags,
        createdAt: m.createdAt.toISOString(),
      }
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
      prompt?: string
      decade?: string
      audioKey?: string
      photoKey?: string
    }

    if (!userId || !parentId) {
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
        prompt: prompt ?? '',
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
