import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, locale } = body as { email: string; locale?: string }

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 },
      )
    }

    const normalised = email.toLowerCase().trim()

    // Basic format validation at the boundary
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalised)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 },
      )
    }

    const entry = await db.waitlistEntry.upsert({
      where: { email: normalised },
      create: { email: normalised, locale: locale ?? 'en' },
      update: {},
    })

    return NextResponse.json({ id: entry.id }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to join waitlist' },
      { status: 500 },
    )
  }
}
