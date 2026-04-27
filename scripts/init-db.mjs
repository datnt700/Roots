import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { neon } from '@neondatabase/serverless'
import { config as loadDotenv } from 'dotenv'

function loadEnvironmentFiles() {
  const envLocalPath = resolve(process.cwd(), '.env.local')
  const envPath = resolve(process.cwd(), '.env')

  if (existsSync(envLocalPath)) {
    loadDotenv({ path: envLocalPath, override: false })
  }

  if (existsSync(envPath)) {
    loadDotenv({ path: envPath, override: false })
  }
}

function parseEnvironmentArgument(argv) {
  const option = argv.find((value) => value.startsWith('--env='))
  if (!option) {
    return process.env.NODE_ENV === 'production' ? 'production' : 'development'
  }

  const parsed = option.split('=')[1]

  if (parsed !== 'development' && parsed !== 'production') {
    throw new Error("Invalid --env value. Use 'development' or 'production'.")
  }

  return parsed
}

function resolveDatabaseUrl(targetEnvironment) {
  if (targetEnvironment === 'production' && process.env.PROD_DATABASE_URL) {
    return process.env.PROD_DATABASE_URL
  }

  if (targetEnvironment === 'development' && process.env.DEV_DATABASE_URL) {
    return process.env.DEV_DATABASE_URL
  }

  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }

  throw new Error(
    `No database URL found for ${targetEnvironment}. Set ${targetEnvironment === 'production' ? 'PROD_DATABASE_URL' : 'DEV_DATABASE_URL'} or DATABASE_URL.`,
  )
}

async function initializeDatabase() {
  loadEnvironmentFiles()

  const targetEnvironment = parseEnvironmentArgument(process.argv)
  const databaseUrl = resolveDatabaseUrl(targetEnvironment)
  const sql = neon(databaseUrl)

  const migrationPath = resolve(process.cwd(), 'sql', 'init.sql')
  const migrationSql = await readFile(migrationPath, 'utf8')

  await sql.query(migrationSql)

  console.log(`Database initialized for ${targetEnvironment}.`)
}

initializeDatabase().catch((error) => {
  console.error('Failed to initialize database.')
  console.error(error)
  process.exit(1)
})
