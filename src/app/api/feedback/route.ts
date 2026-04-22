import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { encryptOptional } from '@/lib/crypto'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const feedback = await db.feedback.findMany({
      where: { memory: { userId } },
      include: { memory: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ feedback })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { memoryId, userId, content } = body as {
      memoryId: string
      userId: string
      content?: string
    }

    if (!memoryId || !userId) {
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

    return NextResponse.json({ id: item.id }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create feedback' },
      { status: 500 },
    )
  }
}
