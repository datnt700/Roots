/**
 * lib/email.ts — Transactional email via Resend
 *
 * Requires env var:
 *   RESEND_API_KEY   — from resend.com → API Keys
 *   RESEND_FROM      — verified sender e.g. "GỐC <noreply@roots.vn>"
 *
 * All emails are sent fire-and-forget — failures are logged but never
 * surface to the user. Email is a nice-to-have hook, not a hard dependency.
 */
import { Resend } from 'resend'
import { logger } from '@/lib/logger'

function getClient() {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  return new Resend(key)
}

const FROM =
  process.env.RESEND_FROM ?? 'GỐC · ROOTS <noreply@roots.vn>'

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? 'https://roots.vn'

// ─── Email: new memory notification ─────────────────────────────────────────

export async function sendNewMemoryEmail({
  to,
  studentName,
  parentName,
  relationship,
  decade,
  memoryId,
}: {
  to: string
  studentName: string
  parentName: string
  relationship: string
  decade?: string | null
  memoryId: string
}) {
  const client = getClient()
  if (!client) {
    logger.warn('email', 'RESEND_API_KEY not set — skipping new-memory email')
    return
  }

  const rel = relationshipLabel(relationship)
  const decadeText = decade ? ` về thập niên ${decade}` : ''
  const link = `${APP_URL}/app/studio`

  const html = `<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><style>
  body{font-family:system-ui,sans-serif;background:#f5f0e8;margin:0;padding:2rem}
  .card{background:#fff;border-radius:16px;padding:2rem;max-width:480px;margin:0 auto;border:1px solid #e0d8cc}
  .brand{font-size:0.75rem;font-weight:700;letter-spacing:.25em;text-transform:uppercase;color:#5a8a6a;margin-bottom:1rem}
  h1{font-size:1.25rem;font-weight:700;color:#2d2a26;margin:0 0 0.5rem}
  p{color:#5a5248;line-height:1.6;font-size:0.9375rem;margin:0 0 1rem}
  .cta{display:inline-block;padding:.625rem 1.5rem;background:#4a7c59;color:#fff;text-decoration:none;border-radius:10px;font-weight:600;font-size:.9375rem}
  .footer{margin-top:1.5rem;font-size:.75rem;color:#aaa098;text-align:center}
</style></head>
<body>
<div class="card">
  <div class="brand">GỐC · ROOTS</div>
  <h1>🌿 ${parentName} vừa kể một câu chuyện mới</h1>
  <p>${studentName} ơi,<br><br>
  ${rel} vừa hoàn thành một buổi ghi âm${decadeText}. Câu chuyện đang chờ bạn trong bộ sưu tập.</p>
  <a href="${link}" class="cta">Nghe ngay →</a>
  <div class="footer">Bạn nhận email này vì bạn là thành viên của ROOTS.<br>
  Đây là thông báo tự động — vui lòng không trả lời.</div>
</div>
</body></html>`

  try {
    await client.emails.send({
      from: FROM,
      to,
      subject: `🌿 ${parentName} vừa kể chuyện${decadeText ? ' ' + decadeText : ''} — ROOTS`,
      html,
    })
    logger.info('email', 'New-memory email sent', { to, memoryId })
  } catch (err) {
    logger.error('email', 'Failed to send new-memory email', { to, memoryId }, err)
  }
}

// ─── Email: parent help request ──────────────────────────────────────────────

export async function sendHelpRequestEmail({
  to,
  studentName,
  parentName,
  relationship,
  token,
}: {
  to: string
  studentName: string
  parentName: string
  relationship: string
  token: string
}) {
  const client = getClient()
  if (!client) {
    logger.warn('email', 'RESEND_API_KEY not set — skipping help-request email')
    return
  }

  const rel = relationshipLabel(relationship)
  const qrLink = `${APP_URL}/parent/${token}`

  const html = `<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><style>
  body{font-family:system-ui,sans-serif;background:#f5f0e8;margin:0;padding:2rem}
  .card{background:#fff;border-radius:16px;padding:2rem;max-width:480px;margin:0 auto;border:1px solid #e0d8cc}
  .brand{font-size:0.75rem;font-weight:700;letter-spacing:.25em;text-transform:uppercase;color:#5a8a6a;margin-bottom:1rem}
  .alert{background:#fef3cd;border:1px solid #f0c35a;border-radius:10px;padding:1rem;margin-bottom:1rem}
  h1{font-size:1.125rem;font-weight:700;color:#2d2a26;margin:0 0 0.5rem}
  p{color:#5a5248;line-height:1.6;font-size:0.9375rem;margin:0 0 1rem}
  .cta{display:inline-block;padding:.625rem 1.5rem;background:#e07b3a;color:#fff;text-decoration:none;border-radius:10px;font-weight:600;font-size:.9375rem}
  .footer{margin-top:1.5rem;font-size:.75rem;color:#aaa098;text-align:center}
</style></head>
<body>
<div class="card">
  <div class="brand">GỐC · ROOTS</div>
  <div class="alert">📞 Yêu cầu giúp đỡ từ ${parentName}</div>
  <p>${studentName} ơi,<br><br>
  ${rel} đang gặp khó khăn khi sử dụng ROOTS và cần sự hỗ trợ của bạn. Hãy gọi điện hoặc nhắn tin cho ${rel} sớm nhé!</p>
  <p style="font-size:.875rem;color:#7a7268">Liên kết QR dành cho ${parentName}:<br>
  <a href="${qrLink}" style="color:#4a7c59">${qrLink}</a></p>
  <div class="footer">Thông báo tự động từ ROOTS — vui lòng không trả lời email này.</div>
</div>
</body></html>`

  try {
    await client.emails.send({
      from: FROM,
      to,
      subject: `📞 ${parentName} cần giúp đỡ — ROOTS`,
      html,
    })
    logger.info('email', 'Help-request email sent', { to, token })
  } catch (err) {
    logger.error('email', 'Failed to send help-request email', { to, token }, err)
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function relationshipLabel(rel: string): string {
  const map: Record<string, string> = {
    bố: 'Bố',
    mẹ: 'Mẹ',
    ông: 'Ông',
    bà: 'Bà',
    other: 'Người thân',
  }
  return map[rel] ?? 'Người thân'
}
