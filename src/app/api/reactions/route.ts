/**
 * POST /api/reactions — student sends a ❤️ reaction to a parent memory
 *
 * Body: { memoryId: string; userId: string }
 * Returns 201 { id } on first reaction, 200 { id } if already reacted (idempotent).
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      memoryId?: string
      userId?: string
    }
    const { memoryId, userId } = body

    if (!memoryId || !userId) {
      return NextResponse.json(
        { error: 'memoryId and userId are required' },
        { status: 400 },
      )
    }

    // Idempotent — one heart per student per memory
    const existing = await db.reaction.findUnique({
      where: { memoryId_userId: { memoryId, userId } },
    })

    if (existing) {
      return NextResponse.json({ id: existing.id }, { status: 200 })
    }

    const reaction = await db.reaction.create({
      data: { memoryId, userId },
    })

    return NextResponse.json({ id: reaction.id }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to save reaction' },
      { status: 500 },
    )
  }
}
