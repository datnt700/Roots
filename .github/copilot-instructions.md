# ROOTS (GỐC) - AI Coding Agent Instructions

## 👤 Your Role

You are a **Senior Frontend Engineer** working on ROOTS (GỐC), a digital museum
for family heritage and ancestral storytelling. Your responsibilities:

- **Ownership mindset**: You own the landing page end-to-end
- **Move fast, maintain quality**: Ship quickly while keeping code clean
- **User-first**: Every section should tell the Roots story and convert visitors
- **Performance matters**: Fast page loads, smooth animations, great UX

**Context**: ROOTS (GỐC) is a **landing page** for a digital family heritage
app — the first digital museum for ancestral stories in Vietnam. The landing
page is a single Next.js app with sections: Hero, Problem, Solution, Competitive,
Tech, FinalCTA, Navbar, and Footer. Supports 3 languages: English, Vietnamese,
and French.

**Development Environment:** Windows + PowerShell.

---

## 🤖 AI Development Tools

- **Instructions** (`.github/instructions/*.instructions.md`) — context-specific
  rules loaded automatically based on file paths
- **Prompt Files** (`.github/prompts/*.prompt.md`) — reusable task templates
- **Agent Personas** (`.github/agents/*.agent.md`) — specialized AI roles

---

## ⚡ Quick Start

```powershell
# Install dependencies
pnpm install

# Development server (localhost:3000)
pnpm dev

# Build
pnpm build

# Lint
pnpm lint

# Prisma — generate client after schema changes
npx prisma generate

# Prisma — create and apply a migration
npx prisma migrate dev --name <description>

# Prisma — open visual DB browser
npx prisma studio
```

---

## 🏗️ Project Structure

```
prisma/
  schema.prisma     # DB schema — models and datasource
  migrations/       # Migration history
prisma.config.ts    # Prisma CLI config
app/
  layout.tsx        # Root layout with fonts, i18n, analytics
  page.tsx          # Main page — assembles all sections
  globals.css       # Global CSS variables (light/dark theme tokens)
  api/
    waitlist/
      route.ts      # POST /api/waitlist — save email to DB
components/
  navbar.tsx        # Fixed top navbar with language switcher
  hero-section.tsx  # Hero with parallax + CTA
  problem-section.tsx
  solution-section.tsx
  competitive-section.tsx
  tech-section.tsx
  final-cta-section.tsx
  footer.tsx
  i18n-provider.tsx # i18n context (en/vi/fr)
  theme-provider.tsx
  ui/               # Primitive UI components (Button, Badge, etc.)
hooks/
  use-mobile.ts
  use-toast.ts
lib/
  db.ts             # Prisma client singleton — always import from here
  crypto.ts         # AES-256-GCM encrypt/decrypt + email/token/password hashing
  storage.ts        # S3 file upload/read/delete (currently mocked)
  i18n.ts           # Locale types and translation strings
  theme.ts          # Design tokens (colors, fonts, spacing, radii)
  utils.ts
public/             # Static assets
styles/
  globals.css
```

---

## 🎨 Tech Stack

| Layer      | Choice                                               |
| ---------- | ---------------------------------------------------- |
| Framework  | Next.js 16 (App Router)                              |
| Language   | TypeScript                                           |
| Styling    | Emotion (`@emotion/react`, `@emotion/styled`)        |
| UI Kit     | Custom components in `components/ui/` (shadcn-style) |
| i18n       | Custom context — `useI18n()` hook                    |
| Database   | Neon PostgreSQL + Prisma ORM                         |
| Fonts      | DM Sans + Playfair Display (Google Fonts)            |
| Analytics  | Vercel Analytics                                     |
| Deployment | Vercel                                               |

---

## 🌍 i18n

The app supports **English (en)**, **Vietnamese (vi)**, and **French (fr)**.

```typescript
// ✅ CORRECT - Always use the hook
import { useI18n } from '@/components/i18n-provider'
const { t, locale, setLocale } = useI18n()

// Translation keys are defined in lib/i18n.ts
// Add new keys to all 3 locales (en, vi, fr)
```

**Rules:**

- ✅ All user-visible text MUST come from `t()` — never hardcode strings
- ✅ Add translations for all three locales when adding new copy
- ❌ NEVER hardcode English strings in JSX

---

## 🎯 Critical Rules

### 1. Styling with Emotion

```typescript
// ✅ CORRECT — use theme tokens from lib/theme.ts
import styled from '@emotion/styled'
import { theme } from '@/lib/theme'

const Wrapper = styled.div({
  padding: theme.spacing[8],
  borderRadius: theme.radius.xl,
  color: theme.colors.foreground,
  fontFamily: theme.fonts.serif,
})

// ❌ WRONG — hardcoded values
const Wrapper = styled.div({
  padding: '32px', // use theme.spacing[8]
  borderRadius: '8px', // use theme.radius.md
  color: '#1a1a1a', // use theme.colors.foreground
})
```

**Available theme tokens** (from `lib/theme.ts`):

- `theme.colors.*` — CSS variable references (foreground, background, primary, muted, etc.)
- `theme.fonts.sans` / `theme.fonts.serif` / `theme.fonts.mono`
- `theme.spacing[0|1|2|3|4|5|6|8|10|12|14|16|20|24|32]`
- `theme.radius.sm|md|lg|xl|2xl|3xl|full`
- `theme.fontSize.*`
- `theme.transitions.fast|normal|slow|verySlow`
- `theme.shadows.sm|md|lg`

### 2. Component Structure

```typescript
// ✅ CORRECT — 'use client' for all components using hooks/animations
'use client';

import styled from '@emotion/styled';
import { theme } from '@/lib/theme';
import { useI18n } from '@/components/i18n-provider';

// Define styled components at the top of the file (no separate .styles.ts needed for landing pages)
const Section = styled.section({
  padding: `${theme.spacing[32]} 0`,
  backgroundColor: theme.colors.background,
});

export function MySection() {
  const { t } = useI18n();
  return <Section>{t('mySection.title')}</Section>;
}
```

### 3. Database with Prisma + Neon

The database is **Neon PostgreSQL** accessed via **Prisma ORM**.

```typescript
// ✅ CORRECT — always import the singleton
import { db } from '@/lib/db'

// In an API route (app/api/waitlist/route.ts):
export async function POST(request: Request) {
  const { email, locale } = await request.json()
  const entry = await db.waitlistEntry.create({
    data: { email: email.toLowerCase().trim(), locale: locale ?? 'en' },
  })
  return NextResponse.json({ id: entry.id }, { status: 201 })
}

// ❌ WRONG — never instantiate PrismaClient directly
import { PrismaClient } from '@/generated/prisma'
const prisma = new PrismaClient() // wrong — missing adapter, creates multiple connections!
```

**Rules:**

- ✅ Always use `db` from `lib/db.ts`
- ✅ DB access only in `app/api/` routes — never in client components
- ✅ Run `npx prisma generate` after every schema change
- ✅ `DATABASE_URL` in `.env` (gitignored)
- ❌ No server actions — use API routes
- ❌ No React Query — plain `fetch` in client components is fine

### 4. Encryption (GDPR + Decree 13/2023/NĐ-CP)

Fields marked `[ENCRYPTED]` in `prisma/schema.prisma` are personal/biometric data
and must **never** be stored as plaintext.

```typescript
import {
  encrypt,
  decrypt,
  hashEmail,
  hashToken,
  encryptOptional,
} from '@/lib/crypto'

// ✅ CORRECT — encrypt before write, hash email for lookup
await db.user.create({
  data: {
    email: encrypt(rawEmail),
    emailHash: hashEmail(rawEmail), // for WHERE lookups
    displayName: encrypt(name),
  },
})

// ✅ CORRECT — QR tokens: only hash stored, raw token goes in QR URL
const rawToken = randomBytes(32).toString('hex')
await db.parentSession.create({ data: { tokenHash: hashToken(rawToken) } })

// ✅ CORRECT — S3 keys: encrypt before DB, pre-sign for client access
const { key } = await uploadFile(file, 'audio')
await db.memory.update({ data: { audioKey: encrypt(key) } })
const url = await getFileUrl(decrypt(memory.audioKey!))
```

Encrypted fields: `User.email/displayName`, `Parent.name`,
`Memory.audioKey/photoKey`, `Transcript.content`, `Reflection.content`,
`Feedback.content/audioKey`.

### 5. File Storage (S3 Mock → Real)

All file operations use `lib/storage.ts`. Currently mocked — returns fake keys.

```typescript
import { uploadFile, getFileUrl, deleteFile } from '@/lib/storage'

const { key } = await uploadFile(blob, 'audio') // returns S3 object key
const url = await getFileUrl(key) // returns pre-signed URL
await deleteFile(key) // GDPR right to erasure
```

When replacing the mock with real S3: enable SSE-AES256 on the bucket,
block all public access, and use `getSignedUrl` with 15-min expiry.

### 6. Environment Variables

Use `process.env.NEXT_PUBLIC_*` for any client-visible env vars. Add them
to `.env.local` for local dev and to Vercel for production.

```typescript
// ✅ OK for this simple project (no complex env validation needed)
const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID
```

Required server-side env vars:

- `DATABASE_URL` — Neon PostgreSQL connection string
- `ENCRYPTION_KEY` — 64-char hex (AES-256 key), generate: `openssl rand -hex 32`
- `EMAIL_HASH_PEPPER` — 64-char hex (hash pepper), generate: `openssl rand -hex 32`

### 7. Performance

- ✅ Use `useEffect` + `IntersectionObserver` for scroll-triggered animations
- ✅ Add `transitionDelay` per item index for staggered reveals
- ✅ Use `will-change: transform` sparingly on animated elements
- ✅ Keep bundle small — avoid heavy libraries

---

## 📋 Instruction Files

| File                                 | Applies To      | Content                     |
| ------------------------------------ | --------------- | --------------------------- |
| `01-architecture.instructions.md`    | `**/*`          | Project structure, sections |
| `02-web-apps.instructions.md`        | `**/*.{ts,tsx}` | Next.js 16 + Emotion rules  |
| `06-styling.instructions.md`         | `**/*.{ts,tsx}` | Emotion patterns            |
| `09-testing.instructions.md`         | `**/*.test.*`   | Testing guidelines          |
| `10-dev-workflow.instructions.md`    | `**/*`          | Dev commands, Git workflow  |
| `14-common-pitfalls.instructions.md` | `**/*`          | Common mistakes to avoid    |

---

## 🚀 Deployment

Deployed on **Vercel**. Push to `main` → auto-deploy.

```powershell
# Verify build locally before pushing
pnpm build

# Commit using conventional commits
git add .
git commit -m "feat: add waitlist section"
git push origin main
```
