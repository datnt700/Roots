# ROOTS (GỐC) - AI Coding Agent Instructions

## 👤 Your Role

You are a **Senior Full-Stack Engineer** working on ROOTS (GỐC), the first
digital museum for family heritage and ancestral storytelling in Vietnam.

- **Ownership mindset**: You own the entire product — landing page + app
- **Move fast, maintain quality**: Ship quickly while keeping code clean
- **User-first**: Curator/child screens = calm and trustworthy; parent screens = warm and inviting
- **Design matters**: Follow `DESIGN.md` — Nostalgic Modernism with glass + clay surfaces

**Development Environment:** Windows + PowerShell.

---

## 🤖 AI Development Tools

- **Instructions** (`.github/instructions/*.instructions.md`) — rules loaded automatically by file path
- **Prompt Files** (`.github/prompts/*.prompt.md`) — reusable task templates
- **Agent Personas** (`.github/agents/*.agent.md`) — specialized AI roles
- **Design System** (`DESIGN.md` at project root) — visual guidelines, surface types, tokens

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

messages/           # next-intl translation files
  en/               # English — one JSON per feature namespace
  vi/               # Vietnamese
  fr/               # French

src/
  auth.ts           # next-auth v5 config
  app/
    layout.tsx      # Root layout — fonts, EmotionRegistry, providers
    page.tsx        # Landing page — assembles all sections
    globals.css     # CSS custom properties (glass, clay, light/dark theme)
    api/            # API routes (DB operations only)
    login/          # Auth login page
    parent/         # Parent capture session (QR → voice → transcript)
    app/            # Authenticated family dashboard
      layout.tsx    # AppShell (sidebar + SessionProvider)
      page.tsx      # Dashboard (bento grid stats + quick actions)
      page.styles.ts
      timeline/     # Memory timeline
      studio/       # Memory studio (view + edit)
      feedback/     # Family feedback feed
      parents/      # Parent album slot management
      record/       # Recording session
  components/
    app-shell.tsx        # Sidebar nav + main wrapper layout
    app-shell.styles.ts  # All sidebar/AppShell styled components
    navbar.tsx           # Landing page navbar
    hero-section.tsx
    problem-section.tsx
    solution-section.tsx
    competitive-section.tsx
    tech-section.tsx
    final-cta-section.tsx
    footer.tsx
    emotion-registry.tsx # Emotion SSR registry (required in layout)
    session-provider.tsx # next-auth SessionProvider wrapper
    theme-provider.tsx
    ui/                  # Reusable primitives (Button, Badge, etc.)
  hooks/
    use-mobile.ts
    use-toast.ts
    use-user-id.ts
  i18n/
    request.ts           # next-intl config
  lib/
    db.ts               # Prisma client singleton — always import from here
    crypto.ts           # AES-256-GCM encrypt/decrypt + hash helpers
    storage.ts          # S3 upload/read/delete (currently mocked)
    theme.ts            # Design tokens (colors, glass, clay, fonts, spacing, radii)
    utils.ts
  generated/prisma/     # Auto-generated Prisma client — DO NOT edit

public/             # Static assets
DESIGN.md           # Design system guideline — read before any UI work
```

---

## 🎨 Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Emotion (`@emotion/react`, `@emotion/styled`) |
| UI Kit | Custom components in `src/components/ui/` |
| i18n | **next-intl** — `useTranslations()` hook, messages in `messages/` |
| Auth | **next-auth v5** — `useSession`/`signOut` from `next-auth/react` |
| Database | Neon PostgreSQL + Prisma ORM |
| Fonts | DM Sans + Playfair Display (Google Fonts) |
| Analytics | Vercel Analytics |
| Deployment | Vercel |
| Design System | Nostalgic Modernism — glass + clay surfaces (see `DESIGN.md`) |

---

## 🌍 i18n (next-intl)

The app supports **English (en)**, **Vietnamese (vi)**, and **French (fr)**.

```typescript
// ✅ CORRECT — next-intl in client components
import { useTranslations } from 'next-intl'
const t = useTranslations('timeline') // matches messages/en/timeline.json

// Translation files live in messages/{locale}/{namespace}.json
// Add new keys to ALL 3 locales: en, vi, fr
```

**Rules:**
- ✅ All user-visible text from `t('key')` — never hardcode strings
- ✅ Keys in `messages/en/*.json`, `messages/vi/*.json`, `messages/fr/*.json`
- ❌ Do NOT use the old `useI18n()` from `@/components/i18n-provider` — it no longer exists
- ❌ Do NOT edit `lib/i18n.ts` for translations — only locale type helpers live there

---

## 🎯 Critical Rules

### 1. Styling with Emotion + Design System

Read **`DESIGN.md`** before any UI work. Key rules:

```typescript
// ✅ CORRECT — glass surface for cards (the standard)
const Card = styled.div({
  backgroundColor: 'var(--glass-bg)',
  backdropFilter: 'blur(14px) saturate(1.4)',
  WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
  border: '1px solid var(--glass-border)',
  boxShadow: 'var(--glass-shadow), var(--glass-inset)',
  borderRadius: theme.radius['2xl'],
})

// ✅ CORRECT — hover only on pointer devices (never bare &:hover on cards)
'@media (hover: hover)': {
  '&:hover': { transform: 'translateY(-2px)' },
},

// ❌ WRONG — flat opaque card
backgroundColor: theme.colors.card,

// ❌ WRONG — hover fires on mobile touch
'&:hover': { transform: 'translateY(-2px)' },
```

**Token shortcuts:**
- `theme.glass.*` — glass surface tokens
- `theme.clay.*` — clay surface tokens (parent-facing primary actions only)
- `theme.colors.*` — color CSS vars
- `theme.spacing[N]`, `theme.radius.*`, `theme.transitions.*`, `theme.shadows.*`

### 2. Component + File Structure

```typescript
// App pages: styled components in .styles.ts, JSX in page.tsx
// src/app/app/timeline/page.styles.ts  ← ALL styled components
// src/app/app/timeline/page.tsx        ← imports from .styles.ts

// ✅ CORRECT — 'use client' + next-intl
'use client'
import { useTranslations } from 'next-intl'
import { Card, PageTitle } from './page.styles'

export default function TimelinePage() {
  const t = useTranslations('timeline')
  return <Card><PageTitle>{t('title')}</PageTitle></Card>
}
```

### 3. Database with Prisma + Neon

```typescript
// ✅ CORRECT — always import the singleton
import { db } from '@/lib/db'

// In an API route (src/app/api/waitlist/route.ts):
export async function POST(request: Request) {
  const { email, locale } = await request.json()
  const entry = await db.waitlistEntry.create({
    data: { email: email.toLowerCase().trim(), locale: locale ?? 'en' },
  })
  return NextResponse.json({ id: entry.id }, { status: 201 })
}

// ❌ WRONG — never instantiate PrismaClient directly
import { PrismaClient } from '@/generated/prisma'
const prisma = new PrismaClient() // wrong — missing adapter!
```

**Rules:**
- ✅ Always use `db` from `src/lib/db.ts`
- ✅ DB access only in `src/app/api/` routes — never in client components
- ✅ Run `npx prisma generate` after every schema change
- ❌ No server actions — use API routes + `fetch` from client

### 4. Encryption (GDPR + Decree 13/2023/NĐ-CP)

```typescript
import { encrypt, decrypt, hashEmail, hashToken } from '@/lib/crypto'

// ✅ Encrypt before write, hash for lookup
await db.user.create({
  data: {
    email: encrypt(rawEmail),
    emailHash: hashEmail(rawEmail),
    displayName: encrypt(name),
  },
})

// ✅ QR tokens: only hash stored
const rawToken = randomBytes(32).toString('hex')
await db.parentSession.create({ data: { tokenHash: hashToken(rawToken) } })

// ✅ S3 keys: encrypt in DB, pre-sign for access
const { key } = await uploadFile(file, 'audio')
await db.memory.update({ data: { audioKey: encrypt(key) } })
const url = await getFileUrl(decrypt(memory.audioKey!))
```

Encrypted fields: `User.email/displayName`, `Parent.name`,
`Memory.audioKey/photoKey`, `Transcript.content`, `Reflection.content`,
`Feedback.content/audioKey`.

### 5. Auth (next-auth v5)

```typescript
// Client component — read session
import { useSession, signOut } from 'next-auth/react'
const { data: session } = useSession()
const name = session?.user?.name ?? 'You'

// Auth config: src/auth.ts
// SessionProvider: wrapped in src/components/session-provider.tsx → src/app/app/layout.tsx
```

Required env vars: `AUTH_SECRET`, `NEXTAUTH_URL`.

### 6. Environment Variables

```
DATABASE_URL=       # Neon PostgreSQL connection string
ENCRYPTION_KEY=     # 64-char hex — openssl rand -hex 32
EMAIL_HASH_PEPPER=  # 64-char hex — openssl rand -hex 32
AUTH_SECRET=        # next-auth secret — openssl rand -base64 32
NEXTAUTH_URL=       # http://localhost:3000 (local)
```

### 7. Performance

- ✅ `IntersectionObserver` + CSS transitions for scroll animations
- ✅ `willChange: 'transform, opacity'` on animated elements
- ✅ `@media (hover: hover)` wrapper on all hover effects
- ✅ Keep bundle small — avoid heavy libraries

---

## 📋 Instruction Files

| File | Applies To | Content |
|---|---|---|
| `01-architecture.instructions.md` | `**/*` | Full project structure |
| `02-web-apps.instructions.md` | `**/*.{ts,tsx}` | Next.js + next-intl + auth patterns |
| `06-styling.instructions.md` | `**/*.{ts,tsx}` | Emotion + glass/clay surfaces |
| `09-testing.instructions.md` | `**/*.test.*` | Testing guidelines |
| `10-dev-workflow.instructions.md` | `**/*` | Dev commands, Git workflow |
| `14-common-pitfalls.instructions.md` | `**/*` | Common mistakes to avoid |

---

## 🚀 Deployment

Deployed on **Vercel**. Push to `main` → auto-deploy.

```powershell
# Verify build locally before pushing
pnpm build

# Commit using conventional commits
git add .
git commit -m "feat: add timeline albums tab"
git push origin main
```
