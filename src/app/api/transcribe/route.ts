/**
 * POST /api/transcribe — transcribe a memory's audio recording via OpenAI Whisper.
 *
 * Body: { memoryId: string }
 *
 * Pipeline:
 *   1. Load memory from DB, decrypt audioKey
 *   2. Download audio buffer from S3
 *   3. Send to OpenAI Whisper (whisper-1)
 *   4. Encrypt transcript content and upsert into Transcript table
 *   5. Mark memory as isProcessed = true
 *
 * Required env: OPENAI_API_KEY
 *
 * Security: route protected by middleware (session required).
 * Transcript content is [ENCRYPTED] — personal voice data (GDPR Art.4).
 */
import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { db } from '@/lib/db'
import { decrypt, encrypt } from '@/lib/crypto'
import { getFileBuffer } from '@/lib/storage'

function getOpenAI(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set')
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { memoryId } = body as { memoryId: string }

    if (!memoryId) {
      return NextResponse.json(
        { error: 'memoryId is required' },
        { status: 400 },
      )
    }

    // 1. Load memory and verify it has an audio key
    const memory = await db.memory.findUnique({ where: { id: memoryId } })
    if (!memory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 })
    }
    if (!memory.audioKey) {
      return NextResponse.json(
        { error: 'Memory has no audio recording' },
        { status: 422 },
      )
    }

    // 2. Decrypt S3 key and download audio
    const rawKey = decrypt(memory.audioKey)
    const audioBuffer = await getFileBuffer(rawKey)

    // 3. Send to Whisper — wrap buffer as a File for the SDK
    const openai = getOpenAI()
    const audioFile = new File([audioBuffer], 'recording.webm', {
      type: 'audio/webm',
    })

    const result = await openai.audio.transcriptions.create({
      model: 'whisper-1',
      file: audioFile,
      language: 'vi', // Vietnamese primary; Whisper auto-detects if wrong
      response_format: 'text',
    })

    const transcriptText =
      typeof result === 'string' ? result : (result as { text: string }).text

    if (!transcriptText?.trim()) {
      return NextResponse.json(
        { error: 'Whisper returned empty transcript' },
        { status: 422 },
      )
    }

    // 4. Encrypt and upsert transcript
    await db.transcript.upsert({
      where: { memoryId },
      create: {
        memoryId,
        content: encrypt(transcriptText.trim()),
        language: 'vi',
      },
      update: {
        content: encrypt(transcriptText.trim()),
        updatedAt: new Date(),
      },
    })

    // 5. Mark memory as processed
    await db.memory.update({
      where: { id: memoryId },
      data: { isProcessed: true },
    })

    // 6. Fire-and-forget Claude summarization — non-blocking, best-effort
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/summarize`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memoryId }),
      },
    ).catch(() => {
      /* summarization failure is non-critical */
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Transcription failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
