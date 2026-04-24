import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

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

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: resolveDatabaseUrl() })
  return new PrismaClient({ adapter })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
