/**
 * POST /api/slots/save — persist a completed parent dialogue as a Memory.
 *
 * Accepts multipart/form-data:
 *   token        — raw QR token (authenticates the request via MemorySlot)
 *   turns        — JSON string of Turn[] (full conversation)
 *   audio?       — latest parent audio recording (File)
 *   photo?       — optional photo (File)
 *
 * Pipeline:
 *   1. Validate QR token → find MemorySlot
 *   2. Upload audio + photo to S3 (if provided)
 *   3. Create Memory in DB linked to the slot (audioKey + photoKey encrypted)
 *   4. Create Transcript from all parent turns (encrypted)
 *
 * Public route — authenticated by QR token (no Auth.js session required).
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashToken, encrypt, encryptOptional, decrypt } from '@/lib/crypto'
import { uploadFile } from '@/lib/storage'
import { logger } from '@/lib/logger'
import { sendNewMemoryEmail } from '@/lib/email'

export const runtime = 'nodejs'
export const maxDuration = 60

type Turn = { role: 'ai' | 'parent'; text: string }

export async function POST(request: Request) {
  const t0 = Date.now()
  try {
    const formData = await request.formData()
    const token = formData.get('token') as string
    const turnsJson = (formData.get('turns') as string) || '[]'
    const audio = formData.get('audio') as File | null
    const photo = formData.get('photo') as File | null

    if (!token) {
      return NextResponse.json({ error: 'token is required' }, { status: 400 })
    }

    // 1. Validate QR token → resolve MemorySlot
    const tokenHash = hashToken(token)
    const slot = await db.memorySlot.findUnique({
      where: { tokenHash },
      include: { parent: { include: { user: true } } },
    })

    if (!slot) {
      logger.warn('slots/save', 'Invalid QR token on save')
      return NextResponse.json({ error: 'Invalid QR token' }, { status: 401 })
    }

    const { parentId, userId } = slot
    const parentName = decrypt(slot.parent.name)

    const turns: Turn[] = JSON.parse(turnsJson)

    // Build transcript from all parent turns
    const parentText = turns
      .filter((t) => t.role === 'parent')
      .map((t) => t.text)
      .filter(Boolean)
      .join('\n\n')

    // Use slot prompt as the memory prompt (what the student set)
    const prompt =
      slot.prompt ||
      turns.find((t) => t.role === 'ai')?.text?.slice(0, 500) ||
      `Cuộc trò chuyện với ${parentName}`

    // 2. Upload audio to S3
    let audioKey: string | undefined
    if (audio && audio.size > 0) {
      const { key } = await uploadFile(audio, 'audio')
      audioKey = key
    }

    // 3. Upload photo to S3
    let photoKey: string | undefined
    if (photo && photo.size > 0) {
      const { key } = await uploadFile(photo, 'photo')
      photoKey = key
    }

    // 4. Create Memory linked to the slot
    const memory = await db.memory.create({
      data: {
        userId,
        parentId,
        slotId: slot.id,
        prompt,
        audioKey: encryptOptional(audioKey),
        photoKey: encryptOptional(photoKey),
        isProcessed: parentText.length > 0,
      },
    })

    // 5. Create Transcript (encrypted — GDPR Art.4 voice data)
    if (parentText) {
      await db.transcript.create({
        data: {
          memoryId: memory.id,
          content: encrypt(parentText),
        },
      })
    }

    logger.info('slots/save', 'Dialogue saved as memory', {
      memoryId: memory.id,
      slotId: slot.id,
      userId,
      parentId,
      turnCount: turns.length,
      parentTurnCount: turns.filter((t) => t.role === 'parent').length,
      hasAudio: !!audioKey,
      hasPhoto: !!photoKey,
      hasTranscript: !!parentText,
      ms: Date.now() - t0,
    })

    // Fire-and-forget: notify the student by email
    const studentEmail = decrypt(slot.parent.user.email)
    const studentName = decrypt(slot.parent.user.displayName)
    sendNewMemoryEmail({
      to: studentEmail,
      studentName,
      parentName,
      relationship: slot.parent.relationship,
      decade: null,
      memoryId: memory.id,
    }).catch(() => {})

    return NextResponse.json({ memoryId: memory.id }, { status: 201 })
  } catch (err) {
    logger.error(
      'slots/save',
      'Failed to save dialogue',
      { ms: Date.now() - t0 },
      err,
    )
    return NextResponse.json(
      { error: 'Failed to save session' },
      { status: 500 },
    )
  }
}
