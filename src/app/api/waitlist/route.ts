import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'

export async function POST(request: Request) {
  const t0 = Date.now()
  try {
    const body = await request.json()
    const { email, locale, shareMore } = body as {
      email: string
      locale?: string
      shareMore?: string
    }

    if (!email || typeof email !== 'string') {
      logger.warn('waitlist', 'Missing email field')
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 },
      )
    }

    const normalised = email.toLowerCase().trim()
    const normalizedShareMore =
      typeof shareMore === 'string' && shareMore.trim().length > 0
        ? shareMore.trim()
        : null

    // Basic format validation at the boundary
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalised)) {
      logger.warn('waitlist', 'Invalid email format supplied')
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 },
      )
    }

    const entry = await db.waitlistEntry.upsert({
      where: { email: normalised },
      create: {
        email: normalised,
        locale: locale ?? 'en',
        shareMore: normalizedShareMore,
      },
      update: normalizedShareMore ? { shareMore: normalizedShareMore } : {},
    })

    logger.info('waitlist', 'Email joined waitlist', {
      id: entry.id,
      locale: locale ?? 'en',
      ms: Date.now() - t0,
    })
    return NextResponse.json({ id: entry.id }, { status: 201 })
  } catch (err) {
    logger.error(
      'waitlist',
      'Failed to join waitlist',
      { ms: Date.now() - t0 },
      err,
    )
    return NextResponse.json(
      { error: 'Failed to join waitlist' },
      { status: 500 },
    )
  }
}
