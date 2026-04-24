import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'

<<<<<<< HEAD
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  return new PrismaClient({ adapter })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()
=======
function resolveDatabaseUrl(): string {
  const isProduction = process.env.NODE_ENV === 'production'
  const environmentKey = isProduction ? 'PROD_DATABASE_URL' : 'DEV_DATABASE_URL'
  const environmentUrl = process.env[environmentKey]

  if (environmentUrl) {
    return environmentUrl
  }

  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }

  throw new Error(
    `${environmentKey} is not set. Configure DEV_DATABASE_URL for local development and PROD_DATABASE_URL for production.`,
  )
}

const databaseUrl = resolveDatabaseUrl()

const sql = neon(databaseUrl)
>>>>>>> c7655d9 (feat: config neon db)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
