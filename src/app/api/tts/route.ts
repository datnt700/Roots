/**
 * POST /api/tts — convert text to speech via OpenAI TTS.
 *
 * Body: { text: string }
 * Response: audio/mpeg binary stream
 *
 * Public route — no auth required.
 * Used by the parent QR recording flow to play AI greetings and responses.
 *
 * Cost: ~$0.015 per 1 000 characters (tts-1 model).
 * Required env: OPENAI_API_KEY
 */
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { text?: string }
    const text = body?.text

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 })
    }

    if (text.length > 1000) {
      return NextResponse.json(
        { error: 'text too long (max 1 000 chars)' },
        { status: 400 },
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'TTS not configured — set OPENAI_API_KEY' },
        { status: 503 },
      )
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const speech = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova', // warm, empathetic female voice
      input: text.trim(),
      speed: 0.92, // slightly slower for elderly listeners
    })

    const buffer = Buffer.from(await speech.arrayBuffer())

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('[tts]', err)
    return NextResponse.json({ error: 'TTS failed' }, { status: 500 })
  }
}
