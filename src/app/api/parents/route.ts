import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { encrypt } from '@/lib/crypto'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    const parents = await db.parent.findMany({
      orderBy: { createdAt: 'desc' },
    })
    const result = parents.map((p) => ({
      ...p,
      name: p.relationship,
    }))
    logger.debug('parents', 'Listed parents', { count: parents.length })
    return NextResponse.json({ parents: result })
  } catch (err) {
    logger.error('parents', 'Failed to fetch parents', {}, err)
    return NextResponse.json(
      { error: 'Failed to fetch parents' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  const t0 = Date.now()
  try {
    const body = await request.json()
    const { name, relationship, userId } = body as {
      name: string
      relationship: string
      userId: string
    }

    if (!name || !relationship || !userId) {
      logger.warn('parents', 'Missing required fields on POST /parents', { userId })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    const parent = await db.parent.create({
      data: {
        userId,
        name: encrypt(name),
        relationship,
      },
    })

    logger.info('parents', 'Parent created', { parentId: parent.id, userId, relationship, ms: Date.now() - t0 })
    return NextResponse.json({ id: parent.id }, { status: 201 })
  } catch (err) {
    logger.error('parents', 'Failed to create parent', { ms: Date.now() - t0 }, err)
    return NextResponse.json(
      { error: 'Failed to create parent' },
      { status: 500 },
    )
  }
}
