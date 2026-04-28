---
applyTo: '**/*.{ts,tsx}'
---

# Next.js 16 Web App Patterns

## App Router Conventions

All interactive components use `'use client'`. Server components are used only
in layout files and thin page shells.

```typescript
// ✅ CORRECT — client component
'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
```

## Two Surfaces: Landing vs App

| Surface | Path | Auth | i18n namespace |
|---|---|---|---|
| Landing page | `src/app/page.tsx` | None | Loaded via `getTranslations` / layout |
| App dashboard | `src/app/app/**` | Required (next-auth) | Per-page namespace |

**App pages** are protected by next-auth and wrapped by `AppShell` in
`src/app/app/layout.tsx`. Each page has `page.tsx` + `page.styles.ts`.

## i18n with next-intl

Translation files live in `messages/{locale}/*.json` (NOT in `lib/i18n.ts`).

```typescript
// ✅ CORRECT — use next-intl in client components
'use client'
import { useTranslations } from 'next-intl'

export function MyComponent() {
  const t = useTranslations('myNamespace') // matches messages/en/myNamespace.json
  return <h1>{t('title')}</h1>
}
```

**Rules:**
- Keys go in `messages/en/{namespace}.json`, `messages/vi/{namespace}.json`, `messages/fr/{namespace}.json`
- The namespace is the filename without `.json` (e.g., `messages/en/timeline.json` → `useTranslations('timeline')`)
- **Never** hardcode user-facing strings; always use `t('key')`
- Always add new keys to all 3 locales: en, vi, fr

```json
// messages/en/record.json
{ "start": "Start Recording", "stop": "Stop" }

// messages/vi/record.json  ← must add
{ "start": "Bắt đầu ghi", "stop": "Dừng" }

// messages/fr/record.json  ← must add
{ "start": "Commencer", "stop": "Arrêter" }
```

## Auth (next-auth v5)

```typescript
// In client components — check session
'use client'
import { useSession, signOut } from 'next-auth/react'

export function UserMenu() {
  const { data: session } = useSession()
  const name = session?.user?.name ?? 'You'
  return <button onClick={() => signOut()}>Sign out {name}</button>
}
```

Auth config is in `src/auth.ts`. The `SessionProvider` wraps all app pages
via `src/components/session-provider.tsx`.

## Root Layout Rules

```typescript
// src/app/layout.tsx — providers only, NO Emotion components
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${playfair.variable}`}>
        <EmotionRegistry>
          <ThemeProvider>{children}</ThemeProvider>
        </EmotionRegistry>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
```

- ✅ `EmotionRegistry` (from `src/components/emotion-registry.tsx`) is required for SSR
- ❌ Do NOT add Emotion styled components directly to root layout

## Scroll Animation Pattern (Landing page sections)

```typescript
const [isVisible, setIsVisible] = useState(false)
const ref = useRef<HTMLDivElement>(null)

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
    { threshold: 0.1 },
  )
  if (ref.current) observer.observe(ref.current)
  return () => observer.disconnect()
}, [])
```

## API Routes (Database Operations)

API routes in `src/app/api/` are used exclusively for database operations.
Keep them thin — validate input, call `db`, return JSON.

```typescript
// src/app/api/waitlist/route.ts
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

- ✅ DB access ONLY inside `src/app/api/` routes
- ❌ No server actions — use API routes + `fetch` from client
- ❌ No React Query — plain `fetch` in client components is fine

## Encryption — Sensitive Fields

Fields annotated `[ENCRYPTED]` in `prisma/schema.prisma` must be encrypted
before any DB write and decrypted after read, using `src/lib/crypto.ts`.

```typescript
import { encrypt, decrypt, hashEmail } from '@/lib/crypto'

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

All file operations go through `src/lib/storage.ts` (currently mocked).
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
// ✅ CORRECT — import from src/lib/db.ts
import { db } from '@/lib/db'

// ❌ WRONG — never instantiate directly
import { PrismaClient } from '@/generated/prisma'
const prisma = new PrismaClient() // missing adapter + creates multiple connections
```

## TypeScript

- Strict mode is enabled
- Prefix unused vars/params with `_`
- Infer return types — do not annotate `: JSX.Element`
- Avoid `any` without justification

## Font Usage

```typescript
// Use CSS variables set in layout.tsx
fontFamily: theme.fonts.serif,  // Playfair Display
fontFamily: theme.fonts.sans,   // DM Sans
```
