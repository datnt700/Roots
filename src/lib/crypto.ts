/**
 * lib/crypto.ts — Field-level encryption and hashing utilities
 *
 * Legal basis:
 *   - EU GDPR Article 32: "encryption of personal data" as a technical measure
 *   - Vietnam Decree 13/2023/NĐ-CP Article 26: technical measures for personal data protection
 *
 * Algorithm: AES-256-GCM (authenticated encryption — detects tampering)
 * Key length: 256-bit (32 bytes), provided as 64-char hex via ENCRYPTION_KEY env var
 *
 * Fields annotated [ENCRYPTED] in schema.prisma must go through encrypt()/decrypt().
 * Fields annotated [HASHED] must go through hashEmail(), hashToken(), or hashPassword().
 *
 * Generate keys:
 *   ENCRYPTION_KEY:    openssl rand -hex 32
 *   EMAIL_HASH_PEPPER: openssl rand -hex 32
 */

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY_LENGTH = 32 // 256 bits
const IV_LENGTH = 12 // 96 bits — recommended for GCM
const TAG_LENGTH = 16 // 128-bit authentication tag

// ─── Key management ──────────────────────────────────────────────────────────

function getEncryptionKey(): Buffer {
  const hex = process.env.ENCRYPTION_KEY
  if (!hex || hex.length !== 64) {
    throw new Error(
      'ENCRYPTION_KEY must be a 64-char hex string (32 bytes).\n' +
        'Generate with: openssl rand -hex 32',
    )
  }
  return Buffer.from(hex, 'hex').subarray(0, KEY_LENGTH)
}

// ─── Symmetric encryption (AES-256-GCM) ──────────────────────────────────────

/**
 * Encrypts a plaintext string.
 * Output format: base64(iv):base64(authTag):base64(ciphertext)
 *
 * Use for: email, displayName, parentName, audioKey, photoKey,
 *          transcript content, reflection content, feedback content/audioKey.
 */
export function encrypt(plaintext: string): string {
  const key = getEncryptionKey()
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, key, iv)

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ])
  const tag = cipher.getAuthTag()

  return [
    iv.toString('base64'),
    tag.toString('base64'),
    encrypted.toString('base64'),
  ].join(':')
}

/**
 * Decrypts a ciphertext produced by encrypt().
 * Throws if the ciphertext has been tampered with (GCM auth tag mismatch).
 */
export function decrypt(ciphertext: string): string {
  const key = getEncryptionKey()
  const parts = ciphertext.split(':')
  if (parts.length !== 3) throw new Error('Invalid ciphertext format')

  const [ivB64, tagB64, encryptedB64] = parts
  const iv = Buffer.from(ivB64, 'base64')
  const tag = Buffer.from(tagB64, 'base64')
  const encrypted = Buffer.from(encryptedB64, 'base64')

  const decipher = createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(tag)

  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString(
    'utf8',
  )
}

/**
 * Encrypts a value only if it is not null/undefined.
 * Convenience wrapper for optional fields.
 */
export function encryptOptional(
  value: string | null | undefined,
): string | null {
  if (value == null) return null
  return encrypt(value)
}

/**
 * Decrypts a value only if it is not null.
 */
export function decryptOptional(
  value: string | null | undefined,
): string | null {
  if (value == null) return null
  return decrypt(value)
}

// ─── Email hashing ────────────────────────────────────────────────────────────

/**
 * One-way hash of an email address for DB lookup without decryption.
 * Store in User.emailHash; query with WHERE emailHash = hashEmail(input).
 *
 * Uses SHA-256 + a server-side pepper (EMAIL_HASH_PEPPER env var).
 * The pepper prevents rainbow-table attacks on the hash column.
 */
export function hashEmail(email: string): string {
  const pepper = process.env.EMAIL_HASH_PEPPER ?? ''
  return createHash('sha256')
    .update(email.toLowerCase().trim() + pepper)
    .digest('hex')
}

// ─── Token hashing ────────────────────────────────────────────────────────────

/**
 * One-way hash for QR session tokens stored in ParentSession.tokenHash.
 * The raw token is sent in the QR URL; only the hash is persisted.
 *
 * Usage:
 *   const token = randomBytes(32).toString('hex')   // send in QR URL
 *   await db.parentSession.create({ data: { tokenHash: hashToken(token) } })
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

// ─── Password hashing (scrypt) ────────────────────────────────────────────────

const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 } // OWASP-recommended
const SCRYPT_KEY_LEN = 64

/**
 * Derives a password hash using scrypt (OWASP recommended: N=16384, r=8, p=1).
 * Store result in User.passwordHash.
 *
 * Format: hex(salt):hex(derivedKey)
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(
    password,
    salt,
    SCRYPT_KEY_LEN,
    SCRYPT_PARAMS,
  ).toString('hex')
  return `${salt}:${hash}`
}

/**
 * Verifies a password against a stored hash.
 * Uses timingSafeEqual to prevent timing-oracle attacks.
 */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  try {
    const derived = scryptSync(password, salt, SCRYPT_KEY_LEN, SCRYPT_PARAMS)
    return timingSafeEqual(derived, Buffer.from(hash, 'hex'))
  } catch {
    return false
  }
}
