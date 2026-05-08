/**
 * scripts/seed.mjs — Dev seed script
 *
 * Populates the database with sample data for local development.
 * Run with: pnpm db:seed
 *
 * WARNING: Do NOT run against production.
 */

import { createRequire } from 'module'
import { createCipheriv, randomBytes, createHash, scryptSync } from 'crypto'
import { config } from 'dotenv'

const require = createRequire(import.meta.url)

// ── Load env ────────────────────────────────────────────────────────────────
config({ path: ['.env.local', '.env'] })

const DATABASE_URL =
  process.env.DATABASE_URL ||
  process.env.DEV_DATABASE_URL ||
  process.env.PROD_DATABASE_URL

if (!DATABASE_URL) {
  console.error(
    '❌  DATABASE_URL/DEV_DATABASE_URL/PROD_DATABASE_URL is not set. Create a .env file first.',
  )
  process.exit(1)
}
if (!process.env.ENCRYPTION_KEY || !process.env.EMAIL_HASH_PEPPER) {
  console.error('❌  ENCRYPTION_KEY and EMAIL_HASH_PEPPER must be set in .env.')
  process.exit(1)
}

const SEED_DEV_EMAIL = process.env.SEED_DEV_EMAIL?.trim() || 'dev@roots.app'
const SEED_DEV_PASSWORD = process.env.SEED_DEV_PASSWORD || 'password123'

// ── Inline crypto helpers (mirrors lib/crypto.ts) ──────────────────────────
const KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex')
const PEPPER = process.env.EMAIL_HASH_PEPPER

function encrypt(plaintext) {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', KEY, iv)
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ])
  const tag = cipher.getAuthTag()
  // Must match lib/crypto.ts format: base64(iv):base64(tag):base64(ciphertext)
  return [
    iv.toString('base64'),
    tag.toString('base64'),
    encrypted.toString('base64'),
  ].join(':')
}

function hashEmail(email) {
  // Must match lib/crypto.ts: SHA-256(email + pepper)
  return createHash('sha256')
    .update(email.toLowerCase().trim() + PEPPER)
    .digest('hex')
}

function hashPassword(password) {
  const salt = randomBytes(16)
  const hash = scryptSync(password, salt, 32)
  return `${salt.toString('hex')}:${hash.toString('hex')}`
}

// ── Prisma client ──────────────────────────────────────────────────────────
const { PrismaPg } = await import('@prisma/adapter-pg')
const { PrismaClient } = await import('../src/generated/prisma/client.ts')

const adapter = new PrismaPg({ connectionString: DATABASE_URL })
const db = new PrismaClient({ adapter })

// ── Seed ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱  Seeding database...\n')

  // Clean existing seed data
  await db.memory.deleteMany({})
  await db.parent.deleteMany({})
  await db.account.deleteMany({})
  await db.user.deleteMany({
    where: { emailHash: hashEmail(SEED_DEV_EMAIL) },
  })

  // Create dev user
  const rawEmail = SEED_DEV_EMAIL
  const user = await db.user.create({
    data: {
      email: encrypt(rawEmail),
      emailHash: hashEmail(rawEmail),
      displayName: encrypt('Minh (Dev)'),
      passwordHash: hashPassword(SEED_DEV_PASSWORD),
      locale: 'vi',
    },
  })
  console.log(`✅  User created: ${rawEmail} (id: ${user.id})`)

  // Create demo user with fixed ID (used by MOCK_USER_ID in dev pages)
  const demoEmail = 'demo@roots.app'
  const demoUser = await db.user.create({
    data: {
      id: 'demo-user',
      email: encrypt(demoEmail),
      emailHash: hashEmail(demoEmail),
      displayName: encrypt('Demo User'),
      passwordHash: hashPassword('password123'),
      locale: 'vi',
    },
  })
  console.log(`✅  Demo user created: ${demoEmail} (id: ${demoUser.id})`)

  // Create parents
  const parents = await Promise.all([
    db.parent.create({
      data: {
        userId: user.id,
        name: encrypt('Nguyễn Văn Ba'),
        relationship: 'bố',
        locale: 'vi',
      },
    }),
    db.parent.create({
      data: {
        userId: user.id,
        name: encrypt('Trần Thị Năm'),
        relationship: 'mẹ',
        locale: 'vi',
      },
    }),
  ])
  console.log(`✅  Parents created: ${parents.length}`)

  // Create sample memories
  await db.memory.createMany({
    data: [
      {
        userId: user.id,
        parentId: parents[0].id,
        prompt: 'Kể cho con nghe về thời thơ ấu của bố?',
        decade: '1970s',
        recordedAt: new Date('2024-01-15'),
        isProcessed: false,
      },
      {
        userId: user.id,
        parentId: parents[1].id,
        prompt: 'Kỷ niệm đáng nhớ nhất của mẹ là gì?',
        decade: '1980s',
        recordedAt: new Date('2024-02-20'),
        isProcessed: false,
      },
    ],
  })
  console.log(`✅  Memories created: 2`)

  console.log('\n🎉  Seed complete!')
  console.log('\nDev credentials:')
  console.log(`  Email:    ${SEED_DEV_EMAIL}`)
  console.log(`  Password: ${SEED_DEV_PASSWORD}`)
}

main()
  .catch((e) => {
    console.error('❌  Seed failed:', e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
