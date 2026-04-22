import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashEmail } from '@/lib/crypto'

export async function GET() {
  try {
    const parents = await db.parent.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ parents })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch parents' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, relationship, userId } = body as {
      name: string
      relationship: string
      userId: string
    }

    if (!name || !relationship || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    const parent = await db.parent.create({
      data: {
        userId,
        name, // encrypted by caller — stored as-is for stub
        relationship,
      },
    })

    return NextResponse.json({ id: parent.id }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create parent' },
      { status: 500 },
    )
  }
}
