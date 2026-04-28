---
applyTo: '**/*'
---

# Common Pitfalls & Solutions

## Quick Reference

| Problem | ❌ Wrong | ✅ Correct |
|---|---|---|
| Hardcoded strings | `<h1>Our Story</h1>` | `<h1>{t('hero.headline')}</h1>` |
| Wrong i18n import | `import { useI18n } from '@/components/i18n-provider'` | `import { useTranslations } from 'next-intl'` |
| Wrong i18n data location | Edit `lib/i18n.ts` | Edit `messages/{locale}/{namespace}.json` |
| Missing locale | Add key only to `en` | Add key to `en`, `vi`, AND `fr` |
| Raw colors | `color: '#3d6b4f'` | `color: theme.colors.primary` |
| Raw spacing | `padding: '32px'` | `padding: theme.spacing[8]` |
| Flat card background | `backgroundColor: theme.colors.card` | Glass surface — see 06-styling.instructions.md |
| Hover on all devices | `'&:hover': { ... }` | `'@media (hover: hover)': { '&:hover': { ... } }` |
| Emotion in root layout | Emotion component in `layout.tsx` | `'use client'` in component files |
| Missing $ prefix | `<Box isVisible={true} />` | `<Box $isVisible={true} />` |
| Missing shouldForwardProp | `styled.div<{ $hero: boolean }>` | `styled('div', { shouldForwardProp: p => p !== '$hero' })<{ $hero: boolean }>` |
| Multiple PrismaClient | `new PrismaClient()` in route | Import `db` from `@/lib/db` |
| Plaintext sensitive field | `{ email: raw }` | `{ email: encrypt(raw), emailHash: hashEmail(raw) }` |
| Raw token in DB | `{ token: rawToken }` | `{ tokenHash: hashToken(rawToken) }` |
| Public S3 URL | Expose S3 key as-is | Encrypt key in DB; serve via `getFileUrl(decrypt(key))` |
| Styles in page.tsx | `const Card = styled.div(...)` in page.tsx | Move to `page.styles.ts` |

## Detailed Explanations

### i18n: next-intl (NOT custom useI18n)

```typescript
// ❌ WRONG — old pattern, no longer used
import { useI18n } from '@/components/i18n-provider'
const { t } = useI18n()
t('hero.headlineLine1')

// ✅ CORRECT — next-intl
import { useTranslations } from 'next-intl'
const t = useTranslations('hero') // namespace = filename in messages/
t('headlineLine1')                // key inside messages/en/hero.json
```

Translation files are at `messages/{locale}/{namespace}.json` — NOT in `lib/i18n.ts`.

### Missing Locale Keys

When adding a new key, add it to all 3 locales:

```
// messages/en/timeline.json  → { "albums": "Albums" }
// messages/vi/timeline.json  → { "albums": "Album" }
// messages/fr/timeline.json  → { "albums": "Albums" }
```

### Flat Card Background → Glass Surface

```typescript
// ❌ WRONG — breaks the layered glass look
const Card = styled.div({
  backgroundColor: theme.colors.card,
  borderRadius: theme.radius['2xl'],
})

// ✅ CORRECT — glass surface
const Card = styled.div({
  backgroundColor: 'var(--glass-bg)',
  backdropFilter: 'blur(14px) saturate(1.4)',
  WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
  border: '1px solid var(--glass-border)',
  boxShadow: 'var(--glass-shadow), var(--glass-inset)',
  borderRadius: theme.radius['2xl'],
})
```

### Hover on Touch Devices

```typescript
// ❌ WRONG — hover fires on touch/tap on mobile, causing stuck states
'&:hover': { transform: 'translateY(-2px)' },

// ✅ CORRECT — only fires with a real pointer (mouse/trackpad)
'@media (hover: hover)': {
  '&:hover': { transform: 'translateY(-2px)' },
},
```

### Emotion Hydration Mismatch

```typescript
// ❌ WRONG — Emotion styled component in root layout causes SSR/CSR mismatch
// src/app/layout.tsx
const StyledBody = styled.body({ ... })
export default function RootLayout({ children }) {
  return <html><StyledBody>{children}</StyledBody></html>
}

// ✅ CORRECT — use EmotionRegistry + className in root layout
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${playfair.variable}`}>
        <EmotionRegistry>
          <ThemeProvider>{children}</ThemeProvider>
        </EmotionRegistry>
      </body>
    </html>
  )
}
```

### Transient Props

```typescript
// ❌ WRONG — $hero forwarded to DOM, React warning
const Card = styled.div<{ $hero: boolean }>(({ $hero }) => ({
  gridColumn: $hero ? 'span 2' : 'span 1',
}))
<Card $hero={true} />

// ✅ CORRECT — shouldForwardProp prevents DOM forwarding
const Card = styled('div', {
  shouldForwardProp: (p) => p !== '$hero',
})<{ $hero: boolean }>(({ $hero }) => ({
  gridColumn: $hero ? 'span 2' : 'span 1',
}))
```

### Multiple Prisma Client Instances

```typescript
// ❌ WRONG — missing adapter AND creates a new DB connection pool on every request
import { PrismaClient } from '@/generated/prisma'
const prisma = new PrismaClient()

// ✅ CORRECT — reuse the singleton (adapter is wired up in src/lib/db.ts)
import { db } from '@/lib/db'
```

### Encrypting Sensitive Fields

```typescript
import { encrypt, decrypt, hashEmail } from '@/lib/crypto'

// ❌ WRONG — storing personal data as plaintext
await db.user.create({ data: { email: 'user@example.com', displayName: 'Minh' } })

// ✅ CORRECT — encrypt before write, hash for lookup
await db.user.create({
  data: {
    email: encrypt('user@example.com'),
    emailHash: hashEmail('user@example.com'),
    displayName: encrypt('Minh'),
  },
})
```

### Token Storage

```typescript
// ❌ WRONG — raw token stored
await db.parentSession.create({ data: { token: rawToken } })

// ✅ CORRECT — only the hash stored; raw token goes in the QR URL
const rawToken = randomBytes(32).toString('hex')
await db.parentSession.create({ data: { tokenHash: hashToken(rawToken) } })
```

### Styled Components in page.tsx

```typescript
// ❌ WRONG — styled components defined in page.tsx
// src/app/app/timeline/page.tsx
const Card = styled.div({ ... })   // should be in page.styles.ts

// ✅ CORRECT — import from sibling .styles.ts
// src/app/app/timeline/page.styles.ts  ← all styled components here
// src/app/app/timeline/page.tsx
import { Card } from './page.styles'
```

## Fixed Technology Decisions

- **Framework**: Next.js 16 (App Router) — no changes
- **Styling**: Emotion ONLY — no Tailwind, SCSS, or CSS modules
- **i18n**: `next-intl` with `useTranslations()` — NOT custom `useI18n`
- **State**: React `useState`/`useEffect` — no Redux, Zustand
- **Database**: Neon PostgreSQL via Prisma — always `db` from `src/lib/db.ts`
- **Auth**: next-auth v5 — `useSession` / `signOut` from `next-auth/react`
- **API**: API routes in `src/app/api/` for DB operations — no server actions
