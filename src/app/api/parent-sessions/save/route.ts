/**
 * POST /api/parent-sessions/save — persist a completed parent dialogue as a Memory.
 *
 * Accepts multipart/form-data:
 *   token        — raw QR token (authenticates the request)
 *   turns        — JSON string of Turn[] (full conversation)
 *   audio?       — latest parent audio recording (File)
 *   photo?       — optional photo (File)
 *
 * Pipeline:
 *   1. Validate QR token
 *   2. Upload audio + photo to S3 (if provided)
 *   3. Create Memory in DB (audioKey + photoKey encrypted)
 *   4. Create Transcript from all parent turns (encrypted)
 *
 * Public route — authenticated by QR token (no Auth.js session required).
 * Parents access via QR code link — they have no app account.
 *
 * Security: AES-256-GCM encryption on all personal fields (GDPR Art.32).
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashToken, encrypt, encryptOptional, decrypt } from '@/lib/crypto'
import { uploadFile } from '@/lib/storage'

export const runtime = 'nodejs'
export const maxDuration = 60

type Turn = { role: 'ai' | 'parent'; text: string }

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const token = formData.get('token') as string
    const turnsJson = (formData.get('turns') as string) || '[]'
    const audio = formData.get('audio') as File | null
    const photo = formData.get('photo') as File | null

    if (!token) {
      return NextResponse.json({ error: 'token is required' }, { status: 400 })
    }

    // 1. Validate QR token
    const tokenHash = hashToken(token)
    const session = await db.parentSession.findUnique({
      where: { tokenHash },
      include: { parent: { include: { user: true } } },
    })

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Invalid or expired QR token' },
        { status: 401 },
      )
    }

    const { parentId } = session
    const userId = session.parent.userId
    const parentName = decrypt(session.parent.name)

    const turns: Turn[] = JSON.parse(turnsJson)

    // Build transcript text from all parent turns (Whisper output per turn)
    const parentText = turns
      .filter((t) => t.role === 'parent')
      .map((t) => t.text)
      .filter(Boolean)
      .join('\n\n')

    // Use the first AI message as the "prompt" (what sparked the conversation)
    const prompt =
      turns.find((t) => t.role === 'ai')?.text?.slice(0, 500) ??
      `Cuộc trò chuyện kỷ niệm với ${parentName}`

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

    // 4. Create Memory (S3 keys encrypted before DB write)
    const memory = await db.memory.create({
      data: {
        userId,
        parentId,
        prompt,
        audioKey: encryptOptional(audioKey),
        photoKey: encryptOptional(photoKey),
        // Mark as processed since we already have the transcript text
        isProcessed: parentText.length > 0,
      },
    })

    // 5. Create Transcript from dialogue turns (encrypted — GDPR Art.4 voice data)
    if (parentText) {
      await db.transcript.create({
        data: {
          memoryId: memory.id,
          content: encrypt(parentText),
        },
      })
    }

    return NextResponse.json({ memoryId: memory.id }, { status: 201 })
  } catch (err) {
    console.error('[parent-sessions/save]', err)
    return NextResponse.json({ error: 'Failed to save session' }, { status: 500 })
  }
}
