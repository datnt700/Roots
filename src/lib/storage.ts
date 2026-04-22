/**
 * lib/storage.ts — File storage via AWS S3
 *
 * Security rules (GDPR Art.32 / Decree 13/2023 Art.26):
 *   - Bucket must have SSE-AES256 enabled (server-side encryption — bucket config, not code).
 *   - Bucket must DENY s3:GetObject without a pre-signed URL (block all public access).
 *   - Pre-signed URLs expire in 15 minutes — never return permanent public URLs.
 *   - Encrypt the S3 object key before storing it in the database (lib/crypto.ts).
 *   - GDPR right to erasure: call deleteFile() when a Memory/User/Parent is deleted.
 *
 * Required env vars:
 *   AWS_REGION              e.g. ap-southeast-1
 *   AWS_ACCESS_KEY_ID       IAM key with s3:PutObject / s3:GetObject / s3:DeleteObject
 *   AWS_SECRET_ACCESS_KEY
 *   S3_BUCKET               bucket name
 */

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'

export type StorageFolder = 'audio' | 'photo' | 'feedback'

export interface UploadResult {
  /**
   * S3 object key — always encrypt this value before storing in the database.
   * Example:  db.memory.create({ data: { audioKey: encrypt(result.key) } })
   */
  key: string
}

// Singleton S3 client — reused across requests in the same Lambda/Edge instance
function getClient(): S3Client {
  if (
    !process.env.AWS_REGION ||
    !process.env.AWS_ACCESS_KEY_ID ||
    !process.env.AWS_SECRET_ACCESS_KEY ||
    !process.env.S3_BUCKET
  ) {
    throw new Error(
      'Missing S3 env vars. Set AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET.',
    )
  }
  return new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  })
}

/**
 * Upload a file to S3 and return its object key.
 * The key is NOT encrypted here — encrypt it before writing to the DB.
 */
export async function uploadFile(
  file: Buffer | Blob,
  folder: StorageFolder,
): Promise<UploadResult> {
  const client = getClient()
  const key = `${folder}/${randomUUID()}`

  const body =
    file instanceof Blob ? Buffer.from(await file.arrayBuffer()) : file

  await client.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      Body: body,
      ServerSideEncryption: 'AES256', // SSE-S3 — requires bucket to have SSE enabled
    }),
  )

  return { key }
}

/**
 * Generate a 15-minute pre-signed URL for a stored file.
 * Always use this — never expose the raw S3 key or a public URL.
 */
export async function getFileUrl(key: string): Promise<string> {
  const client = getClient()
  return getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: process.env.S3_BUCKET!, Key: key }),
    { expiresIn: 900 }, // 15 minutes
  )
}

/**
 * Download a file from S3 and return it as a Buffer.
 * Used server-side only (e.g. Whisper transcription pipeline).
 * Never expose this to client responses — use getFileUrl() for that.
 */
export async function getFileBuffer(key: string): Promise<Buffer> {
  const client = getClient()
  const response = await client.send(
    new GetObjectCommand({ Bucket: process.env.S3_BUCKET!, Key: key }),
  )
  const stream = response.Body
  if (!stream) throw new Error(`S3 object not found: ${key}`)
  // Collect the readable stream into a Buffer
  const chunks: Uint8Array[] = []
  for await (const chunk of stream as AsyncIterable<Uint8Array>) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}

/**
 * Permanently delete a file from S3.
 * GDPR right to erasure — call this whenever a Memory, User, or Parent is deleted.
 */
export async function deleteFile(key: string): Promise<void> {
  const client = getClient()
  await client.send(
    new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET!, Key: key }),
  )
}
