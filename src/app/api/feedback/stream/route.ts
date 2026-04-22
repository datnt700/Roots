/**
 * GET /api/feedback/stream?userId=xxx
 *
 * Server-Sent Events stream — pushes a notification event whenever a new
 * Feedback row is created for the user's memories.
 *
 * Strategy: long-poll via SSE with a 3-second DB poll.
 * When a new feedback item appears since the client last connected,
 * it emits a `new-feedback` event with the count of unread items.
 *
 * The client reconnects automatically (EventSource spec).
 * Vercel function timeout limit: 60s on Hobby, 300s on Pro.
 * The stream pings every 25s to prevent idle disconnection.
 */
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

const POLL_INTERVAL_MS = 3000
const PING_INTERVAL_MS = 25000

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return new Response('userId is required', { status: 400 })
  }

  const encoder = new TextEncoder()
  let closed = false

  // Track the latest feedback ID seen so we only send deltas
  let lastSeen: string | null = null

  // Seed lastSeen from current DB state so we don't flood on connect
  try {
    const latest = await db.feedback.findFirst({
      where: { memory: { userId } },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    })
    lastSeen = latest?.id ?? null
  } catch {
    // If DB is unreachable, let the stream open and fail on first poll
  }

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: string) => {
        if (closed) return
        try {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${data}\n\n`),
          )
        } catch {
          closed = true
        }
      }

      // Ping to keep connection alive
      const pingTimer = setInterval(() => {
        send('ping', 'keep-alive')
      }, PING_INTERVAL_MS)

      // Poll DB for new feedback
      const pollTimer = setInterval(async () => {
        if (closed) {
          clearInterval(pingTimer)
          clearInterval(pollTimer)
          return
        }
        try {
          const newItems = await db.feedback.findMany({
            where: {
              memory: { userId },
              isPlayed: false,
              // Only rows created after the last seen id (approximate via cursor)
            },
            orderBy: { createdAt: 'desc' },
            select: { id: true, createdAt: true, memoryId: true },
          })

          if (newItems.length > 0 && newItems[0].id !== lastSeen) {
            // Count unread (not played) items
            const unreadCount = await db.feedback.count({
              where: { memory: { userId }, isPlayed: false },
            })
            lastSeen = newItems[0].id
            send('new-feedback', JSON.stringify({ unread: unreadCount }))
          }
        } catch {
          // DB error — don't crash the stream
        }
      }, POLL_INTERVAL_MS)

      // Clean up when client disconnects
      request.signal.addEventListener('abort', () => {
        closed = true
        clearInterval(pingTimer)
        clearInterval(pollTimer)
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
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no', // disable Nginx buffering on Vercel
    },
  })
}
