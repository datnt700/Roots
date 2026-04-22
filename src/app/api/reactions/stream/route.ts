/**
 * GET /api/reactions/stream?token=<rawToken>
 *
 * Server-Sent Events stream for the parent's /done page.
 * Polls every 3 s for new ❤️ reactions on memories linked to this parent session.
 * Emits `event: reaction` when a student sends a heart — lights the lantern on the parent side.
 *
 * Security: raw token is never logged; only its hash is used for DB lookups.
 */
import { NextResponse } from 'next/server'
import { hashToken } from '@/lib/crypto'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const rawToken = searchParams.get('token')

  if (!rawToken) {
    return NextResponse.json({ error: 'token is required' }, { status: 400 })
  }

  const tokenHash = hashToken(rawToken)

  // Resolve parentId once at connection time
  const session = await db.parentSession.findUnique({
    where: { tokenHash },
    select: { parentId: true },
  })

  if (!session) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
  }

  const { parentId } = session
  let lastSeen = new Date()

  const stream = new ReadableStream({
    start(controller) {
      const enc = new TextEncoder()

      const emit = (event: string, data: unknown) => {
        try {
          controller.enqueue(
            enc.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
          )
        } catch {
          // Client disconnected — cleanup handles the rest
        }
      }

      // Initial ack
      emit('connected', { ok: true })

      // Poll for new reactions on memories from this parent
      const pollInterval = setInterval(async () => {
        try {
          const reactions = await db.reaction.findMany({
            where: {
              createdAt: { gt: lastSeen },
              memory: { parentId },
            },
            orderBy: { createdAt: 'asc' },
          })

          if (reactions.length > 0) {
            lastSeen = reactions[reactions.length - 1].createdAt
            emit('reaction', { count: reactions.length, type: 'heart' })
          }
        } catch {
          // Ignore transient DB errors — keep polling
        }
      }, 3000)

      // Keepalive ping every 25 s to prevent proxy timeouts
      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(enc.encode(': ping\n\n'))
        } catch {
          clearInterval(pollInterval)
          clearInterval(pingInterval)
        }
      }, 25000)

      // Cleanup when client disconnects
      request.signal.addEventListener('abort', () => {
        clearInterval(pollInterval)
        clearInterval(pingInterval)
        try {
          controller.close()
        } catch {
          /* already closed */
        }
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
