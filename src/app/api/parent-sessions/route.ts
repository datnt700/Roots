/**
 * POST /api/parent-sessions — create a new QR session for a parent
 * GET  /api/parent-sessions?token=<rawToken> — validate a QR token
 *
 * Security: raw token is NEVER stored — only SHA-256 hash is persisted.
 * The raw token lives only in the QR URL: /parent/<rawToken>
 */
import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { db } from '@/lib/db'
import { hashToken, decrypt } from '@/lib/crypto'

const SESSION_TTL_HOURS = 72

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rawToken = searchParams.get('token')

    if (!rawToken) {
      return NextResponse.json({ error: 'token is required' }, { status: 400 })
    }

    const tokenHash = hashToken(rawToken)

    const session = await db.parentSession.findUnique({
      where: { tokenHash },
      include: {
        parent: {
          include: { user: true },
        },
      },
    })

    if (!session) {
      return NextResponse.json({ error: 'Invalid QR code' }, { status: 404 })
    }

    if (session.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'QR code has expired' },
        { status: 410 },
      )
    }

    // Decrypt sensitive fields before returning
    const parentName = decrypt(session.parent.name)
    const studentName = decrypt(session.parent.user.displayName)

    return NextResponse.json({
      parentId: session.parent.id,
      userId: session.parent.userId,
      parentName,
      studentName,
      relationship: session.parent.relationship,
      locale: session.parent.locale,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to validate session' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { parentId } = body as { parentId: string }

    if (!parentId) {
      return NextResponse.json(
        { error: 'parentId is required' },
        { status: 400 },
      )
    }

    const parent = await db.parent.findUnique({ where: { id: parentId } })
    if (!parent) {
      return NextResponse.json({ error: 'Parent not found' }, { status: 404 })
    }

    const rawToken = randomBytes(32).toString('hex')
    const tokenHash = hashToken(rawToken)
    const expiresAt = new Date(Date.now() + SESSION_TTL_HOURS * 60 * 60 * 1000)

    await db.parentSession.create({
      data: { parentId, tokenHash, expiresAt },
    })

    // Return the raw token — only time it's ever visible
    const qrUrl = `/parent/${rawToken}`
    return NextResponse.json(
      { token: rawToken, qrUrl, expiresAt },
      { status: 201 },
    )
  } catch {
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 },
    )
  }
}
