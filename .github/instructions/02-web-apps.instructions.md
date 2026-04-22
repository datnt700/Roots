---
applyTo: '**/*.{ts,tsx}'
---

# Next.js 16 Web App Patterns

## App Router Conventions

All interactive sections use `'use client'`. Server components are only used
in `app/layout.tsx` and `app/page.tsx` (the page itself is a thin shell).

```typescript
// ✅ CORRECT — all section components are client components
'use client'

import { useEffect, useRef, useState } from 'react'
import { useI18n } from '@/components/i18n-provider'
```

## Root Layout Rules

```typescript
// app/layout.tsx — ONLY providers and font setup
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${playfair.variable}`}>
        <I18nProvider>{children}</I18nProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}
```

- ✅ Root layout = fonts + providers + analytics only
- ❌ Do NOT add Emotion components to root layout (hydration mismatch)
- ✅ `suppressHydrationWarning` on `<html>` if needed for theme toggle

## Scroll Animation Pattern

Use `IntersectionObserver` with a `isVisible` boolean state:

```typescript
const [isVisible, setIsVisible] = useState(false)
const ref = useRef<HTMLDivElement>(null)

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) setIsVisible(true)
    },
    { threshold: 0.1 },
  )
  if (ref.current) observer.observe(ref.current)
  return () => observer.disconnect()
}, [])

// Use in styled component
const Card = styled.div<{ isVisible: boolean; index: number }>(
  ({ isVisible, index }) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(2rem)',
    transition: `all ${theme.transitions.slow}`,
    transitionDelay: `${index * 100}ms`,
  }),
)
```

## API Routes (Database Operations)

API routes in `app/api/` are used exclusively for database operations.
Keep them thin — validate input, call `db`, return JSON.

```typescript
// app/api/waitlist/route.ts
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { email, locale } = body

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const entry = await db.waitlistEntry.create({
    data: { email: email.toLowerCase().trim(), locale: locale ?? 'en' },
  })
  return NextResponse.json({ id: entry.id }, { status: 201 })
}
```

## Encryption — Sensitive Fields

Fields annotated `[ENCRYPTED]` in `prisma/schema.prisma` must be encrypted
before any DB write and decrypted after read, using `lib/crypto.ts`.

```typescript
import {
  encrypt,
  decrypt,
  hashEmail,
  encryptOptional,
  decryptOptional,
} from '@/lib/crypto'

// Writing
await db.user.create({
  data: {
    email: encrypt(rawEmail),
    emailHash: hashEmail(rawEmail), // for WHERE lookups
    displayName: encrypt(name),
  },
})

// Reading
const user = await db.user.findUnique({
  where: { emailHash: hashEmail(rawEmail) },
})
const displayName = decrypt(user.displayName)
```

Encrypted fields: `User.email`, `User.displayName`, `Parent.name`,
`Memory.audioKey`, `Memory.photoKey`, `Transcript.content`,
`Reflection.content`, `Feedback.content`, `Feedback.audioKey`.

## File Storage

All file operations go through `lib/storage.ts` (currently mocked).
S3 keys returned by `uploadFile()` must be encrypted before DB storage.

```typescript
import { uploadFile, getFileUrl } from '@/lib/storage'
import { encrypt, decrypt } from '@/lib/crypto'

// Upload
const { key } = await uploadFile(file, 'audio')
await db.memory.update({ data: { audioKey: encrypt(key) } })

// Read — returns a pre-signed URL (15 min expiry in production)
const url = await getFileUrl(decrypt(memory.audioKey!))
```

Never expose S3 object keys directly to the client.

## Prisma Client — Always Use the Singleton

```typescript
// ✅ CORRECT — import from lib/db.ts
import { db } from '@/lib/db'

// ❌ WRONG — never instantiate directly (Prisma 7 requires the PrismaPg adapter)
import { PrismaClient } from '@/generated/prisma'
const prisma = new PrismaClient() // missing adapter + creates multiple connections
```

## TypeScript

- Strict mode is enabled
- Prefix unused vars/params with `_`
- Infer return types — do not annotate `: JSX.Element`
- Use `as unknown as T` sparingly for unavoidable type casts

## Image Optimization

Images are unoptimized (`images: { unoptimized: true }` in `next.config.mjs`).
Use `<img>` or Next.js `<Image>` for static assets in `public/`.

## Font Usage

```typescript
// Use CSS variables set in layout.tsx
fontFamily: theme.fonts.serif,  // Playfair Display
fontFamily: theme.fonts.sans,   // DM Sans
```
