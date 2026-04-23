/**
 * POST /api/dialogue — AI-led conversation facilitator for parent QR sessions.
 *
 * Accepts multipart/form-data:
 *   token        — raw QR token (validates the parent session)
 *   parentName   — parent's decrypted name (received from /api/parent-sessions)
 *   studentName  — student's name
 *   relationship — e.g. 'bố' | 'mẹ' | 'ông' | 'bà'
 *   turns        — JSON string of Turn[] (conversation history so far)
 *   audio?       — parent's audio File for this turn (optional on greeting)
 *
 * Pipeline:
 *   1. Validate QR token against DB
 *   2. If no audio + no turns → return opening greeting (no AI call needed)
 *   3. Transcribe parent audio via Whisper-1 (if provided)
 *   4. Build GPT-4o conversation → empathetic response + follow-up question
 *
 * Returns: { transcript?: string, aiMessage: string, isComplete: boolean }
 *
 * Public route — authenticated by QR token (no Auth.js session required).
 * Required env: OPENAI_API_KEY
 */
import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { db } from '@/lib/db'
import { hashToken } from '@/lib/crypto'

export const runtime = 'nodejs'
export const maxDuration = 60

const MAX_PARENT_TURNS = 4

type Turn = { role: 'ai' | 'parent'; text: string }

function systemPrompt(
  parentName: string,
  studentName: string,
  relationship: string,
): string {
  return `Bạn đang đóng vai "trợ lý nhỏ" của ${studentName} — một ứng dụng ấm áp tên là Roots, giúp lưu giữ ký ức gia đình.

Nhiệm vụ: Dẫn dắt ${parentName} (${relationship} của ${studentName}) kể lại kỷ niệm qua cuộc trò chuyện tự nhiên, ấm cúng.

Quy tắc bắt buộc:
- Xưng "con", gọi "${parentName}" — đúng như đứa con nhỏ đang gọi điện hỏi thăm ${relationship}
- Luôn dùng "dạ", "ạ" để tỏ sự lễ phép và gần gũi
- Sau khi ${parentName} chia sẻ: (1) đáp lại bằng 1 câu đồng cảm ngắn, (2) hỏi thêm về CẢM XÚC — không phải sự kiện
- Câu hỏi tập trung vào cảm xúc: "lúc đó ${parentName} có lo không?", "điều đó có ý nghĩa thế nào với ${parentName}?"
- Giọng ấm áp, chân thành — như đứa con gọi điện tâm tình, không phải phỏng vấn
- Tuyệt đối không đề cập "AI", "robot", "ứng dụng", "phần mềm", "hệ thống"
- Tối đa 3 câu. Chỉ trả về lời thoại thuần — không có thêm bất kỳ gì khác.`
}

function openingMessage(
  parentName: string,
  studentName: string,
  relationship: string,
): string {
  const variants = [
    `Dạ chào ${parentName} ạ! Con là trợ lý nhỏ của ${studentName} đây. ${studentName} nhờ con gọi cho ${relationship} để xin kể một câu chuyện — để ${studentName} có thể giữ lại mãi mãi. ${parentName} có vài phút không ạ? Con muốn hỏi — trong cuộc đời của ${relationship}, có kỷ niệm nào mà ${relationship} hay nhớ đến nhất không ạ?`,
    `Chào ${parentName} ạ! Con đang gọi thay cho ${studentName} ở xa đây ạ. ${studentName} rất nhớ ${relationship} và muốn lưu lại tiếng kể chuyện của ${relationship}. Bác có thể kể cho con nghe — hồi trẻ ${relationship} từng trải qua điều gì khiến ${relationship} tự hào hoặc nhớ mãi đến tận bây giờ không ạ?`,
  ]
  return variants[Math.floor(Math.random() * variants.length)]
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const token = formData.get('token') as string
    const parentName = formData.get('parentName') as string
    const studentName = formData.get('studentName') as string
    const relationship = (formData.get('relationship') as string) || 'bố'
    const turnsJson = (formData.get('turns') as string) || '[]'
    const audio = formData.get('audio') as File | null

    if (!token || !parentName || !studentName) {
      return NextResponse.json(
        { error: 'token, parentName, studentName are required' },
        { status: 400 },
      )
    }

    // 1. Validate QR token
    const tokenHash = hashToken(token)
    const session = await db.parentSession.findUnique({ where: { tokenHash } })
    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Invalid or expired QR token' },
        { status: 401 },
      )
    }

    const turns: Turn[] = JSON.parse(turnsJson)

    // 2. Greeting turn — no audio + no history → return opening message immediately
    if (!audio && turns.length === 0) {
      return NextResponse.json({
        aiMessage: openingMessage(parentName, studentName, relationship),
        isComplete: false,
      })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'AI not configured — set OPENAI_API_KEY' },
        { status: 503 },
      )
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    // 3. Transcribe parent's audio if provided
    let transcript: string | undefined
    if (audio && audio.size > 0) {
      const transcription = await openai.audio.transcriptions.create({
        model: 'whisper-1',
        file: audio,
        language: 'vi',
        response_format: 'text',
      })
      const raw =
        typeof transcription === 'string'
          ? transcription
          : (transcription as { text: string }).text
      transcript = raw.trim()
    }

    // 4. Count parent turns to know if this is the last one
    const parentTurnCount =
      turns.filter((t) => t.role === 'parent').length + (transcript ? 1 : 0)
    const isComplete = parentTurnCount >= MAX_PARENT_TURNS

    // 5. Build GPT-4o message history
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt(parentName, studentName, relationship) },
    ]

    for (const turn of turns) {
      messages.push({
        role: turn.role === 'ai' ? 'assistant' : 'user',
        content: turn.text,
      })
    }

    if (transcript) {
      messages.push({ role: 'user', content: transcript })
    }

    // Inject closing instruction on final turn
    if (isComplete) {
      messages.push({
        role: 'user',
        content: `[Đây là lượt cuối. Hãy cảm ơn ${parentName} thật ấm áp, nói rằng ${studentName} sẽ rất vui khi được nghe, và kết thúc nhẹ nhàng. Không hỏi thêm câu nào nữa.]`,
      })
    }

    // 6. Generate AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      max_tokens: 200,
      temperature: 0.85,
    })

    const aiMessage =
      completion.choices[0].message.content?.trim() ??
      `Dạ, con cảm ơn ${parentName} ạ!`

    return NextResponse.json({ transcript, aiMessage, isComplete })
  } catch (err) {
    console.error('[dialogue]', err)
    return NextResponse.json(
      { error: 'Failed to process dialogue' },
      { status: 500 },
    )
  }
}
