---
applyTo: '**/*'
---

# Common Pitfalls & Solutions

## Quick Reference

| Problem                   | ❌ Wrong                          | ✅ Correct                                           |
| ------------------------- | --------------------------------- | ---------------------------------------------------- |
| Hardcoded strings         | `<h1>Our Story</h1>`              | `<h1>{t('hero.headline')}</h1>`                      |
| Raw colors                | `color: '#3d6b4f'`                | `color: theme.colors.primary`                        |
| Raw spacing               | `padding: '32px'`                 | `padding: theme.spacing[8]`                          |
| Raw border-radius         | `borderRadius: '12px'`            | `borderRadius: theme.radius.lg`                      |
| Missing locale            | Add key only to `en`              | Add key to `en`, `vi`, AND `fr`                      |
| Emotion in root           | Emotion component in `layout.tsx` | Use `'use client'` in section components             |
| Missing $ prefix          | `<Box isVisible={true} />`        | `<Box $isVisible={true} />`                          |
| Multiple PrismaClient     | `new PrismaClient()` in route     | Import `db` from `@/lib/db`                          |
| Plaintext sensitive field | `{ email: raw }` in db.create     | `{ email: encrypt(raw), emailHash: hashEmail(raw) }` |
| Raw token in DB           | `{ tokenHash: rawToken }`         | `{ tokenHash: hashToken(rawToken) }`                 |
| Public S3 URL             | Expose S3 key as-is               | Encrypt key in DB; serve via `getFileUrl()`          |
| Heavy dependencies        | `import _ from 'lodash'`          | Use native JS                                        |

## Detailed Explanations

### Hardcoded User-Facing Strings

```typescript
// ❌ WRONG — breaks i18n, untranslatable
<h1>Preserve Your Family's Story</h1>

// ✅ CORRECT — translatable
const { t } = useI18n();
<h1>{t('hero.headlineLine1')}</h1>
```

### Missing Locale Keys

When adding a new translation key, you MUST add it to all 3 locales in `lib/i18n.ts`.

```typescript
// ❌ WRONG — only English added
const translations = {
  en: { newSection: { title: 'New Title' } },
  vi: {}, // missing
  fr: {}, // missing
}

// ✅ CORRECT — all 3 locales
const translations = {
  en: { newSection: { title: 'New Title' } },
  vi: { newSection: { title: 'Tiêu đề mới' } },
  fr: { newSection: { title: 'Nouveau titre' } },
}
```

### Emotion Hydration Mismatch

```typescript
// ❌ WRONG — Emotion component in root layout causes SSR/CSR mismatch
// app/layout.tsx
const StyledBody = styled.body({ ... });
export default function RootLayout({ children }) {
  return <html><StyledBody>{children}</StyledBody></html>;
}

// ✅ CORRECT — use className + CSS variables in root layout
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${playfair.variable}`}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
```

### Transient Props

```typescript
// ❌ WRONG — isVisible forwarded to DOM, React warning
const Card = styled.div<{ isVisible: boolean }>(({ isVisible }) => ({
  opacity: isVisible ? 1 : 0,
}));
<Card isVisible={true} />

// ✅ CORRECT — $ prefix prevents DOM forwarding
const Card = styled.div<{ $isVisible: boolean }>(({ $isVisible }) => ({
  opacity: $isVisible ? 1 : 0,
}));
<Card $isVisible={true} />
```

### Multiple Prisma Client Instances

```typescript
// ❌ WRONG — missing adapter AND creates a new DB connection pool on every request
import { PrismaClient } from '@/generated/prisma'
const prisma = new PrismaClient()

// ✅ CORRECT — reuse the singleton (adapter is wired up in lib/db.ts)
import { db } from '@/lib/db'
```

Prisma 7 requires a `PrismaPg` adapter for standard PostgreSQL connections.
The singleton in `lib/db.ts` handles both the adapter and connection reuse.

### Encrypting Sensitive Fields

Fields marked `[ENCRYPTED]` in `prisma/schema.prisma` must never be stored as plaintext.

```typescript
import { encrypt, decrypt, hashEmail, encryptOptional } from '@/lib/crypto'

// ❌ WRONG — storing personal data as plaintext
await db.user.create({
  data: { email: 'user@example.com', displayName: 'Minh' },
})

// ✅ CORRECT — encrypt before write, hash email for lookup
await db.user.create({
  data: {
    email: encrypt('user@example.com'),
    emailHash: hashEmail('user@example.com'), // for WHERE lookups
    displayName: encrypt('Minh'),
  },
})

// ✅ CORRECT — decrypt after read
const user = await db.user.findUnique({
  where: { emailHash: hashEmail(input) },
})
const email = decrypt(user.email) // only decrypt when you need to display it
```

### Token Storage

Never store raw QR tokens or session tokens in the database.

```typescript
import { randomBytes } from 'crypto'
import { hashToken } from '@/lib/crypto'

// ❌ WRONG — raw token stored
await db.parentSession.create({ data: { token: rawToken } })

// ✅ CORRECT — only the hash is stored; raw token goes in the QR URL
const rawToken = randomBytes(32).toString('hex')
await db.parentSession.create({ data: { tokenHash: hashToken(rawToken) } })
// QR URL: /record?token=<rawToken>
```

### S3 Keys — Encrypt in DB, Pre-sign for Access

```typescript
import { uploadFile, getFileUrl } from '@/lib/storage'
import { encrypt, decrypt } from '@/lib/crypto'

// ✅ Upload: encrypt key before storing
const { key } = await uploadFile(audioBlob, 'audio')
await db.memory.update({ where: { id }, data: { audioKey: encrypt(key) } })

// ✅ Read: decrypt key, then get pre-signed URL
const memory = await db.memory.findUnique({ where: { id } })
const url = await getFileUrl(decrypt(memory.audioKey)) // never expose raw key
```

- **Framework**: Next.js 16 — no Turbopack needed for this project
- **Styling**: Emotion ONLY — no Tailwind, no SCSS, no CSS modules
- **i18n**: Custom `useI18n()` — no next-intl, no i18next
- **State**: React useState/useEffect — no Redux, no Zustand
- **Database**: Neon PostgreSQL via Prisma — always use `db` from `lib/db.ts`
- **API**: Thin Next.js API routes in `app/api/` for DB operations only
