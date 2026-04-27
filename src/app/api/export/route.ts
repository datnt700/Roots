import { NextResponse } from 'next/server'
import JSZip from 'jszip'
import { db } from '@/lib/db'
import { decrypt, decryptOptional } from '@/lib/crypto'
import { getFileBuffer } from '@/lib/storage'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 })
  }

  // Verify user exists
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const displayName = decrypt(user.displayName)

  // Fetch all memories with related data
  const memories = await db.memory.findMany({
    where: { userId },
    include: {
      parent: true,
      transcript: {
        include: { aiSummary: true },
      },
      reflection: true,
    },
    orderBy: { createdAt: 'asc' },
  })

  const zip = new JSZip()
  const memoriesData: object[] = []

  for (const memory of memories) {
    const parentName = memory.parent ? decryptOptional(memory.parent.name) : null
    const transcriptContent = memory.transcript
      ? decrypt(memory.transcript.content)
      : null
    const reflectionContent = memory.reflection
      ? decrypt(memory.reflection.content)
      : null
    const summaryContent = memory.transcript?.aiSummary
      ? decrypt(memory.transcript.aiSummary.summary)
      : null

    // Build structured data entry
    memoriesData.push({
      id: memory.id,
      parentName,
      relationship: memory.parent?.relationship,
      decade: memory.decade,
      prompt: memory.prompt,
      createdAt: memory.createdAt,
      transcript: transcriptContent,
      aiSummary: summaryContent,
      reflection: reflectionContent,
      hasAudio: !!memory.audioKey,
      hasPhoto: !!memory.photoKey,
    })

    // Add transcript as text file
    if (transcriptContent) {
      zip.file(
        `transcripts/${memory.id}.txt`,
        `Người kể: ${parentName}\nThập niên: ${memory.decade ?? 'Không rõ'}\nCâu hỏi: ${memory.prompt ?? ''}\nNgày: ${memory.createdAt.toLocaleDateString('vi-VN')}\n\n${transcriptContent}${summaryContent ? `\n\n--- Tóm tắt AI ---\n${summaryContent}` : ''}`,
      )
    }

    // Download and add audio file
    if (memory.audioKey) {
      try {
        const key = decrypt(memory.audioKey)
        const buffer = await getFileBuffer(key)
        const ext = key.endsWith('.webm') ? 'webm' : 'mp3'
        zip.file(`audio/${memory.id}.${ext}`, buffer)
      } catch {
        // If S3 not configured or file missing, skip silently
      }
    }

    // Download and add photo file
    if (memory.photoKey) {
      try {
        const key = decrypt(memory.photoKey)
        const buffer = await getFileBuffer(key)
        const ext = key.includes('.png') ? 'png' : 'jpg'
        zip.file(`photos/${memory.id}.${ext}`, buffer)
      } catch {
        // If S3 not configured or file missing, skip silently
      }
    }
  }

  // Add memories.json
  zip.file('memories.json', JSON.stringify(memoriesData, null, 2))

  // Add README
  const dateStr = new Date().toLocaleDateString('vi-VN')
  zip.file(
    'README.txt',
    `ROOTS (GỐC) — Xuất dữ liệu cá nhân
Ngày xuất: ${dateStr}
Chủ tài khoản: ${displayName}

NỘI DUNG:
  memories.json       — Toàn bộ ký ức dưới dạng JSON có cấu trúc
  transcripts/        — Bản ghi lời kể từng ký ức (dạng .txt)
  audio/              — File ghi âm gốc (.webm hoặc .mp3)
  photos/             — Ảnh đính kèm ký ức (.jpg hoặc .png)

Dữ liệu này thuộc quyền sở hữu của bạn theo Nghị định 13/2023/NĐ-CP và GDPR.
Bạn có thể xóa tài khoản và toàn bộ dữ liệu bất kỳ lúc nào.

Liên hệ: support@roots.vn
`,
  )

  const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
  const today = new Date().toISOString().split('T')[0]

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="roots-export-${today}.zip"`,
      'Content-Length': String(buffer.byteLength),
    },
  })
}
