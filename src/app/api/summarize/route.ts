/**
 * POST /api/summarize — run Claude to generate title, summary, and tags from a transcript.
 *
 * Body: { memoryId: string }
 *
 * Pipeline:
 *   1. Load transcript from DB for this memory, decrypt content
 *   2. Call Claude claude-sonnet-4-5 with a structured JSON prompt
 *   3. Parse the JSON response: { title, summary, tags }
 *   4. Encrypt title + summary, upsert into AiSummary table
 *
 * Fire-and-forget: /api/transcribe calls this after saving the transcript.
 * The client polls the Studio page; no blocking wait required.
 *
 * Required env: ANTHROPIC_API_KEY
 */
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { db } from '@/lib/db'
import { decrypt, encrypt } from '@/lib/crypto'
import { logger } from '@/lib/logger'

const MODEL = 'claude-sonnet-4-5'

function getAnthropic(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not set')
  }
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

const SYSTEM_PROMPT = `Bạn là một trợ lý AI đang giúp một du học sinh Việt Nam lưu giữ ký ức gia đình.
Bạn nhận được một đoạn phiên âm (transcript) của giọng kể chuyện từ bố/mẹ/ông/bà của họ.

Hãy phân tích transcript và trả về JSON với cấu trúc sau (KHÔNG có markdown, chỉ JSON thuần):
{
  "title": "Tiêu đề ngắn gọn 4-8 từ, bằng tiếng Việt, ấm áp và cụ thể",
  "summary": "2-3 câu tóm tắt bằng tiếng Việt, viết theo ngôi thứ ba ('Bố/Mẹ kể về...'), giọng văn ấm áp và trân trọng",
  "tags": ["tag1", "tag2", ...] // 3-6 tag tiếng Việt: địa danh, thập niên, chủ đề, cảm xúc, nhân vật
}

Quy tắc:
- title: không quá 8 từ, không dấu chấm câu cuối
- summary: tối đa 3 câu, không dùng từ "transcript" hay "đoạn phiên âm"
- tags: lowercase, cụ thể (e.g. "hà nội", "thập niên 80", "tuổi thơ", "tình yêu", "công việc đầu tiên")
- Nếu transcript quá ngắn hoặc không rõ nghĩa, vẫn cố gắng tóm tắt những gì có thể`

interface ClaudeOutput {
  title: string
  summary: string
  tags: string[]
}

function parseClaudeJson(text: string): ClaudeOutput {
  // Claude may wrap in markdown code blocks despite instructions — strip them
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
  const parsed = JSON.parse(cleaned) as Partial<ClaudeOutput>

  if (typeof parsed.title !== 'string' || !parsed.title.trim()) {
    throw new Error('Missing title in Claude response')
  }
  if (typeof parsed.summary !== 'string' || !parsed.summary.trim()) {
    throw new Error('Missing summary in Claude response')
  }
  if (!Array.isArray(parsed.tags)) {
    parsed.tags = []
  }

  return {
    title: parsed.title.trim(),
    summary: parsed.summary.trim(),
    tags: parsed.tags
      .filter((t): t is string => typeof t === 'string')
      .map((t) => t.toLowerCase().trim())
      .slice(0, 6),
  }
}

export async function POST(request: Request) {
  const t0 = Date.now()
  try {
    const body = (await request.json()) as { memoryId?: string }
    const { memoryId } = body

    if (!memoryId) {
      logger.warn('summarize', 'POST called without memoryId')
      return NextResponse.json(
        { error: 'memoryId is required' },
        { status: 400 },
      )
    }

    // 1. Load transcript
    const transcript = await db.transcript.findUnique({
      where: { memoryId },
    })

    if (!transcript) {
      logger.warn('summarize', 'Transcript not found', { memoryId })
      return NextResponse.json(
        { error: 'Transcript not found — run /api/transcribe first' },
        { status: 404 },
      )
    }

    const rawContent = decrypt(transcript.content)

    if (!rawContent.trim()) {
      logger.warn('summarize', 'Transcript content is empty', { memoryId })
      return NextResponse.json(
        { error: 'Transcript content is empty' },
        { status: 422 },
      )
    }

    // 2. Call Claude
    const anthropic = getAnthropic()

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Transcript:\n\n${rawContent}`,
        },
      ],
    })

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : ''

    if (!responseText) {
      throw new Error('Claude returned empty response')
    }

    // 3. Parse structured output
    const output = parseClaudeJson(responseText)

    // 4. Encrypt and upsert AiSummary
    await db.aiSummary.upsert({
      where: { transcriptId: transcript.id },
      create: {
        transcriptId: transcript.id,
        title: encrypt(output.title),
        summary: encrypt(output.summary),
        tags: output.tags,
        model: MODEL,
      },
      update: {
        title: encrypt(output.title),
        summary: encrypt(output.summary),
        tags: output.tags,
        model: MODEL,
        updatedAt: new Date(),
      },
    })

    logger.info('summarize', 'AI summary generated and saved', { memoryId, tags: output.tags, ms: Date.now() - t0 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Summarization failed'
    logger.error('summarize', 'Claude summarization failed', { ms: Date.now() - t0 }, err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
