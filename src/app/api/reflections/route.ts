/**
 * POST /api/reflections — save a student's private emotional reflection on a memory.
 *
 * Body: { memoryId: string, content: string }
 *
 * The content is AES-256-GCM encrypted before storage (Reflection.content [ENCRYPTED]).
 * Only the memory's owner can read it; decryption happens in GET /api/memories.
 *
 * Security: route protected by middleware (session required).
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { encrypt } from '@/lib/crypto'
import { logger } from '@/lib/logger'

export async function POST(request: Request) {
  const t0 = Date.now()
  try {
    const body = await request.json()
    const { memoryId, content } = body as { memoryId?: string; content?: string }

    if (!memoryId || !content?.trim()) {
      return NextResponse.json(
        { error: 'memoryId and content are required' },
        { status: 400 },
      )
    }

    // Verify the memory exists before upserting
    const memory = await db.memory.findUnique({ where: { id: memoryId }, select: { id: true } })
    if (!memory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 })
    }

    const encryptedContent = encrypt(content.trim())

    await db.reflection.upsert({
      where: { memoryId },
      create: { memoryId, content: encryptedContent },
      update: { content: encryptedContent },
    })

    logger.info('reflections', 'Reflection saved', { memoryId, ms: Date.now() - t0 })
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    logger.error('reflections', 'Failed to save reflection', { ms: Date.now() - t0 }, err)
    return NextResponse.json({ error: 'Failed to save reflection' }, { status: 500 })
  }
}
