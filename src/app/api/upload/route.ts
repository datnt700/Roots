/**
 * POST /api/upload — receive a file blob and upload it to S3.
 *
 * Accepts: multipart/form-data with:
 *   file   — the binary file
 *   folder — 'audio' | 'photo' | 'feedback'
 *
 * Returns: { key: string } — the RAW S3 object key.
 * The caller must encrypt this key before writing it to the database.
 *
 * Security:
 *   - Max 50 MB enforced (audio recordings should be far below this)
 *   - Only audio/* and image/* MIME types accepted
 *   - Route is protected by middleware (session required)
 */
import { NextResponse } from 'next/server'
import { uploadFile, StorageFolder } from '@/lib/storage'
import { logger } from '@/lib/logger'

const MAX_BYTES = 50 * 1024 * 1024 // 50 MB
const ALLOWED_MIME = /^(audio\/|image\/)/

export async function POST(request: Request) {
  const t0 = Date.now()
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const folder = (formData.get('folder') ?? 'audio') as StorageFolder

    if (!(file instanceof File)) {
      logger.warn('upload', 'No file provided in upload request')
      return NextResponse.json({ error: 'file is required' }, { status: 400 })
    }

    if (!ALLOWED_MIME.test(file.type)) {
      logger.warn('upload', 'Rejected disallowed MIME type', { type: file.type })
      return NextResponse.json(
        { error: 'Only audio and image files are accepted' },
        { status: 415 },
      )
    }

    if (file.size > MAX_BYTES) {
      logger.warn('upload', 'File exceeds size limit', { sizeBytes: file.size })
      return NextResponse.json(
        { error: 'File exceeds 50 MB limit' },
        { status: 413 },
      )
    }

    const validFolders: StorageFolder[] = ['audio', 'photo', 'feedback']
    if (!validFolders.includes(folder)) {
      logger.warn('upload', 'Invalid folder specified', { folder })
      return NextResponse.json({ error: 'Invalid folder' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const { key } = await uploadFile(buffer, folder)

    logger.info('upload', 'File uploaded to S3', { folder, sizeBytes: file.size, mimeType: file.type, ms: Date.now() - t0 })
    return NextResponse.json({ key }, { status: 201 })
  } catch (err) {
    logger.error('upload', 'Upload to S3 failed', { ms: Date.now() - t0 }, err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
