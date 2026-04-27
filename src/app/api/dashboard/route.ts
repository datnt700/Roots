import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { decrypt } from '@/lib/crypto'
import { logger } from '@/lib/logger'

// GET /api/dashboard?userId=xxx
// Returns all data needed for the dashboard in a single request.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // Fetch in parallel for performance
    const [parents, memories, unplayedFeedback, slots] = await Promise.all([
      db.parent.findMany({
        where: { userId },
        include: { _count: { select: { memories: true } } },
        orderBy: { createdAt: 'asc' },
      }),
      db.memory.findMany({
        where: { userId },
        include: { parent: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      db.feedback.count({
        where: { memory: { userId }, isPlayed: false },
      }),
      db.memorySlot.count({ where: { userId } }),
    ])

    // Decrypt parent names (encrypted PII)
    const safeParents = parents.map((p) => {
      let name = p.name
      try {
        name = decrypt(p.name)
      } catch {
        // already plaintext in dev seed
      }
      return {
        id: p.id,
        name,
        relationship: p.relationship,
        recordingCount: p._count.memories,
      }
    })

    // Build recent memories (no need to decrypt audioKey — just metadata)
    const recentMemories = memories.map((m) => {
      let parentName = m.parent?.name ?? ''
      try {
        if (parentName) parentName = decrypt(parentName)
      } catch {
        // already plaintext
      }
      return {
        id: m.id,
        prompt: m.prompt ?? '',
        parentName,
        relationship: m.parent?.relationship ?? '',
        decade: m.decade ?? '',
        isProcessed: m.isProcessed,
        createdAt: m.createdAt.toISOString(),
      }
    })

    // Compute total recording hours from memory count (placeholder: 3 min avg per memory)
    const totalMemories = await db.memory.count({ where: { userId } })
    const estimatedHours = Math.round((totalMemories * 3) / 60 * 10) / 10

    return NextResponse.json({
      parents: safeParents,
      recentMemories,
      stats: {
        totalMemories,
        totalParents: parents.length,
        totalSlots: slots,
        estimatedHours,
        unplayedFeedback,
      },
    })
  } catch (err) {
    logger.error('dashboard', 'Failed to fetch dashboard data', {}, err)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 },
    )
  }
}
