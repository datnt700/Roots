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
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const maxDuration = 60

const MAX_PARENT_TURNS = 4

type Turn = { role: 'ai' | 'parent'; text: string }

function systemPrompt(
  parentName: string,
  studentName: string,
  relationship: string,
  photoDescription?: string,
): string {
  const photoCtx = photoDescription
    ? `\n\nBối cảnh: ${parentName} đã chia sẻ một tấm ảnh — "${photoDescription}". Hãy tham chiếu tự nhiên đến tấm ảnh này khi phù hợp.`
    : ''
  return `Bạn là Roots — người bạn nhỏ mà ${studentName} gửi về để cùng ${parentName} lưu lại những câu chuyện quý giá của gia đình mình.

Nhiệm vụ: Dẫn dắt ${parentName} (${relationship} của ${studentName}) kể lại kỷ niệm qua cuộc trò chuyện ấm áp, tự nhiên — như đứa cháu nhỏ lễ phép đang ngồi nghe ${relationship} kể chuyện.

Công thức mỗi lượt:
1. Đồng cảm chân thành (1 câu ngắn): "Dạ, con hiểu rồi ạ.", "Ôi thú vị quá bác nhỉ." — phù hợp với nội dung vừa chia sẻ
2. Hỏi về CẢM XÚC — không phải sự kiện: "Lúc đó ${parentName} có lo không?", "Điều đó có ý nghĩa thế nào với ${parentName}?"
3. Nếu ${parentName} ngập ngừng: "Không sao đâu ${parentName} ạ, bác cứ kể những gì bác nhớ thôi. Cảm xúc của bác mới là điều ${studentName} trân trọng nhất."

Quy tắc bắt buộc:
- Xưng "con", gọi "${parentName}" — lễ phép như đứa cháu trong nhà
- Luôn dùng "dạ", "ạ"
- Tối đa 3 câu ngắn gọn. Giọng ấm áp như gọi điện tâm tình, không phải phỏng vấn
- TUYỆT ĐỐI không đề cập "AI", "robot", "ứng dụng", "phần mềm", "hệ thống", "Roots"
- Chỉ trả về lời thoại thuần — không markdown, không ngoặc, không stage direction${photoCtx}`
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
    const photo = formData.get('photo') as File | null
    const photoDescription = (formData.get('photoDescription') as string) || undefined

    if (!token || !parentName || !studentName) {
      logger.warn('dialogue', 'POST called with missing required fields')
      return NextResponse.json(
        { error: 'token, parentName, studentName are required' },
        { status: 400 },
      )
    }

    // 1. Validate QR token
    const tokenHash = hashToken(token)
    const session = await db.parentSession.findUnique({ where: { tokenHash } })
    if (!session || session.expiresAt < new Date()) {
      logger.warn('dialogue', 'Invalid or expired QR token')
      return NextResponse.json(
        { error: 'Invalid or expired QR token' },
        { status: 401 },
      )
    }

    const turns: Turn[] = JSON.parse(turnsJson)

    // 2. Greeting turn — no audio + no history → personalized opening (Vision if photo provided)
    if (!audio && turns.length === 0) {
      const staticGreeting = `Dạ chào ${parentName} ạ! Con là Roots — người bạn nhỏ mà ${studentName} nhờ ở đây để lắng nghe và lưu lại những câu chuyện quý giá của gia đình mình. ${studentName} ở xa nhưng lúc nào cũng nhớ đến những câu chuyện của ${parentName}. ${parentName} có thể kể cho con nghe — trong cuộc đời của ${parentName}, có kỷ niệm nào mà bác hay nhớ đến nhất không ạ?`
      if (photo && photo.size > 0 && process.env.OPENAI_API_KEY) {
        try {
          const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
          const photoBuffer = await photo.arrayBuffer()
          const photoBase64 = Buffer.from(photoBuffer).toString('base64')
          const mimeType = photo.type || 'image/jpeg'
          const visionResult = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'image_url',
                    image_url: { url: `data:${mimeType};base64,${photoBase64}`, detail: 'low' },
                  },
                  {
                    type: 'text',
                    text: `Bạn là Roots — người bạn nhỏ mà ${studentName} gửi về để giúp ${parentName} (${relationship} của ${studentName}) kể lại kỷ niệm gia đình.\n\n${parentName} vừa chia sẻ một tấm ảnh. Hãy làm 2 việc và trả về JSON:\n1. Mô tả ngắn tấm ảnh trong 1 câu tiếng Việt (field "photoDescription")\n2. Tạo lời chào mở đầu (3-4 câu) theo kịch bản (field "greeting"):\n   - Giới thiệu bản thân là Roots, người bạn nhỏ mà ${studentName} gửi về\n   - Nhắc ${parentName} rằng ${studentName} ở xa nhưng rất trân trọng từng câu chuyện\n   - Nhận xét tự nhiên ấm áp về tấm ảnh ("Con thấy trong ảnh...")\n   - Hỏi mở: "${parentName} có thể kể cho con nghe — tấm ảnh này gắn với kỷ niệm gì vậy ạ?"\n   - Xưng "con", gọi "${parentName}", luôn dùng "dạ/ạ", giọng như đứa cháu nhỏ lễ phép`,
                  },
                ],
              },
            ],
            max_tokens: 400,
            response_format: { type: 'json_object' },
          })
          const parsed = JSON.parse(visionResult.choices[0].message.content ?? '{}') as {
            photoDescription?: string
            greeting?: string
          }
          logger.info('dialogue', 'Vision greeting generated', { hasDescription: !!parsed.photoDescription })
          return NextResponse.json({
            aiMessage: parsed.greeting ?? staticGreeting,
            isComplete: false,
            photoDescription: parsed.photoDescription,
          })
        } catch (visionErr) {
          logger.warn('dialogue', 'GPT Vision failed — falling back to static greeting')
          // Vision failed — fall through to static greeting
        }
      }
      logger.info('dialogue', 'Static greeting returned')
      return NextResponse.json({ aiMessage: staticGreeting, isComplete: false })
    }

    if (!process.env.OPENAI_API_KEY) {
      logger.error('dialogue', 'OPENAI_API_KEY not configured')
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
      logger.debug('dialogue', 'Whisper transcription complete', { chars: transcript.length })
    }

    // 4. Count parent turns to know if this is the last one
    const parentTurnCount =
      turns.filter((t) => t.role === 'parent').length + (transcript ? 1 : 0)
    const isComplete = parentTurnCount >= MAX_PARENT_TURNS

    // 5. Build GPT-4o message history
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt(parentName, studentName, relationship, photoDescription) },
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

    logger.info('dialogue', 'GPT-4o response generated', { parentTurnCount, isComplete, hasTranscript: !!transcript, aiChars: aiMessage.length })
    return NextResponse.json({ transcript, aiMessage, isComplete })
  } catch (err) {
    logger.error('dialogue', 'Dialogue pipeline failed', {}, err)
    return NextResponse.json(
      { error: 'Failed to process dialogue' },
      { status: 500 },
    )
  }
}
