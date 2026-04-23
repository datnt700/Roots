/**
 * POST /api/auth/register — create a new account with email + password.
 * Only used for the credentials (password) flow; OAuth handles its own user creation.
 */
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { encrypt, hashEmail } from '@/lib/crypto'
import { logger } from '@/lib/logger'

const BCRYPT_ROUNDS = 12

export async function POST(request: Request) {
  const t0 = Date.now()
  try {
    const body = await request.json()
    const { email, password, name, locale } = body as {
      email: string
      password: string
      name: string
      locale?: string
    }

    // ── Input validation ──────────────────────────────────────────────────
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, mật khẩu và tên là bắt buộc' },
        { status: 400 },
      )
    }

    const normalised = email.toLowerCase().trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalised)) {
      return NextResponse.json({ error: 'Email không hợp lệ' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Mật khẩu phải có ít nhất 8 ký tự' },
        { status: 400 },
      )
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Tên phải có ít nhất 2 ký tự' },
        { status: 400 },
      )
    }

    // ── Duplicate check (via hash — never decrypt+compare) ────────────────
    const emailHash = hashEmail(normalised)
    const existing = await db.user.findUnique({ where: { emailHash } })
    if (existing) {
      logger.warn('auth/register', 'Registration attempt with duplicate email')
      return NextResponse.json(
        { error: 'Email này đã được đăng ký' },
        { status: 409 },
      )
    }

    // ── Hash password + encrypt personal fields ───────────────────────────
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS)

    const user = await db.user.create({
      data: {
        email: encrypt(normalised),
        emailHash,
        displayName: encrypt(name.trim()),
        passwordHash,
        locale: locale ?? 'vi',
      },
    })

    logger.info('auth/register', 'New user registered', { userId: user.id, locale: locale ?? 'vi', ms: Date.now() - t0 })
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    logger.error('auth/register', 'Failed to create user account', { ms: Date.now() - t0 }, err)
    return NextResponse.json(
      { error: 'Không thể tạo tài khoản' },
      { status: 500 },
    )
  }
}
