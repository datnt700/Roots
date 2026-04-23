/**
 * lib/logger.ts — Structured logger for dev and production
 *
 * Dev:  colorized console output with context
 * Prod: JSON lines (stdout) — compatible with Vercel log drains
 *
 * Usage:
 *   import { logger } from '@/lib/logger'
 *   logger.info('auth', 'User signed in', { userId: '...' })
 *   logger.error('auth', 'authorize() failed', { email: '...' }, err)
 */

type Level = 'debug' | 'info' | 'warn' | 'error'
type Context = Record<string, unknown>

const isProd = process.env.NODE_ENV === 'production'

const COLORS: Record<Level, string> = {
  debug: '\x1b[37m', // white
  info: '\x1b[36m',  // cyan
  warn: '\x1b[33m',  // yellow
  error: '\x1b[31m', // red
}
const RESET = '\x1b[0m'

function log(level: Level, tag: string, message: string, ctx?: Context, err?: unknown) {
  const ts = new Date().toISOString()

  if (isProd) {
    const entry: Record<string, unknown> = { ts, level, tag, message, ...ctx }
    if (err instanceof Error) {
      entry.error = { name: err.name, message: err.message, stack: err.stack }
    } else if (err !== undefined) {
      entry.error = String(err)
    }
    process.stdout.write(JSON.stringify(entry) + '\n')
  } else {
    const color = COLORS[level]
    const prefix = `${color}[${level.toUpperCase()}]${RESET} ${ts} [${tag}]`
    const ctxStr = ctx && Object.keys(ctx).length ? ' ' + JSON.stringify(ctx) : ''
    console[level === 'debug' ? 'log' : level](`${prefix} ${message}${ctxStr}`)
    if (err) console.error(err)
  }
}

export const logger = {
  debug: (tag: string, message: string, ctx?: Context) => log('debug', tag, message, ctx),
  info:  (tag: string, message: string, ctx?: Context) => log('info',  tag, message, ctx),
  warn:  (tag: string, message: string, ctx?: Context) => log('warn',  tag, message, ctx),
  error: (tag: string, message: string, ctx?: Context, err?: unknown) => log('error', tag, message, ctx, err),
}
