---
applyTo: '**/*'
---

# ROOTS (GỐC) - Architecture & Project Structure

## What Is This Project?

ROOTS (GỐC) is a **digital family heritage platform** — the first digital
museum for ancestral storytelling in Vietnam. It ships as a single Next.js app
containing two surfaces:

1. **Marketing landing page** (`/`) — static sections (Hero, Problem, Solution,
   Competitive, Tech, FinalCTA) promoting the product to visitors.
2. **Family Heritage App** (`/app/*`) — authenticated dashboard where families
   record stories, view timelines, and curate memories.

The backend is a Neon PostgreSQL database accessed via Prisma ORM.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Emotion (`@emotion/styled`, `@emotion/react`)
- **UI Primitives**: Custom components in `src/components/ui/` (shadcn-style)
- **i18n**: `next-intl` — messages in `messages/{locale}/*.json`, `useTranslations()` hook
- **Auth**: next-auth v5 — config in `src/auth.ts`; `useSession` / `signOut` from `next-auth/react`
- **Database**: Neon PostgreSQL + Prisma ORM
- **Fonts**: DM Sans (sans-serif) + Playfair Display (serif) via Google Fonts
- **Analytics**: Vercel Analytics (production only)
- **Deployment**: Vercel
- **Design System**: Nostalgic Modernism (glass + clay surfaces) — see `DESIGN.md`

## Directory Structure

```
prisma/
  schema.prisma       # Prisma schema — models and datasource config
  migrations/         # Migration history
prisma.config.ts      # Prisma CLI config

messages/             # next-intl translation files
  en/                 # English — one JSON per feature area
    app.json, hero.json, navbar.json, problem.json, solution.json,
    competitive.json, tech.json, finalCta.json, footer.json,
    timeline.json, studio.json, feedback.json, parents.json,
    record.json, dashboard.json
  vi/                 # Vietnamese — same structure
  fr/                 # French — same structure

src/
  auth.ts             # next-auth v5 config
  proxy.ts            # Edge proxy (if needed)

  app/
    layout.tsx        # Root layout — fonts, providers, analytics
    page.tsx          # Landing page — assembles all sections
    globals.css       # CSS custom properties (light/dark theme tokens)
    loading.tsx, error.tsx, not-found.tsx, forbidden.tsx

    api/
      waitlist/route.ts        # POST /api/waitlist
      # ... other API routes

    login/            # Auth login page
    parent/           # Parent-facing capture session
    app/              # Authenticated family dashboard
      layout.tsx      # App shell (sidebar + main content)
      page.tsx        # Dashboard (stats bento + quick actions)
      page.styles.ts  # Dashboard styled components
      timeline/       # Memory timeline page
      studio/         # Memory studio (view + edit memories)
      feedback/       # Family feedback feed
      parents/        # Manage parent album slots
      record/         # Recording session (QR → voice → transcript)

  components/
    app-shell.tsx        # AppShell layout — sidebar nav + main wrapper
    app-shell.styles.ts  # All sidebar/layout styled components
    navbar.tsx           # Landing page navbar
    hero-section.tsx     # Hero section
    problem-section.tsx
    solution-section.tsx
    competitive-section.tsx
    tech-section.tsx
    final-cta-section.tsx
    footer.tsx
    emotion-registry.tsx  # Emotion SSR registry (required)
    session-provider.tsx  # next-auth SessionProvider wrapper
    theme-provider.tsx    # Theme toggle
    ui/                   # Reusable primitives (Button, Badge, Input, ...)

  hooks/
    use-mobile.ts        # Mobile breakpoint detection
    use-toast.ts         # Toast notifications
    use-user-id.ts       # Authenticated user ID helper

  i18n/
    request.ts           # next-intl config (locale detection)

  lib/
    db.ts                # Prisma client singleton — ALWAYS import from here
    crypto.ts            # AES-256-GCM encrypt/decrypt + hash helpers
    storage.ts           # S3 upload/read/delete (currently mocked)
    theme.ts             # Design tokens — colors, glass, clay, fonts, spacing, radii, shadows
    utils.ts             # Utility functions (cn, etc.)
    email.ts             # Email helpers
    logger.ts            # Logger singleton
    recording-cache.ts   # Temp recording state cache
    i18n.ts              # Locale type helpers (not translation data — data is in messages/)

  generated/
    prisma/              # Auto-generated Prisma client — DO NOT edit manually

public/                  # Static assets
DESIGN.md                # Design system guideline — read before any UI work
```

## Key Design Decisions

1. **`'use client'`** on all interactive components — animations, auth hooks, i18n.
2. **App pages live at `src/app/app/`** — protected by next-auth; layout.tsx wraps
   them in `AppShell` (sidebar + `SessionProvider`).
3. **Styled components split into `.styles.ts`** — every app page has `page.styles.ts`
   alongside `page.tsx`. Do NOT define styled components inside `page.tsx`.
4. **Design system**: Glass surfaces for reading/curator screens; Clay surfaces for
   parent-facing primary actions. Documented fully in `DESIGN.md`.
5. **CSS variables in `src/app/globals.css`** — `--glass-bg`, `--glass-border`,
   `--glass-shadow`, `--glass-inset`, `--clay-highlight`, `--clay-depth`.
6. **Design tokens in `src/lib/theme.ts`** — also has `theme.glass.*` and
   `theme.clay.*` shorthand objects. Never hardcode hex or px values.
7. **Single Prisma client** — always import `db` from `src/lib/db.ts`.
8. **Encrypted PII** — fields marked `[ENCRYPTED]` in schema use `encrypt()`/
   `hashEmail()` from `src/lib/crypto.ts` before DB write.

## Database Layer

Prisma connects to a **Neon PostgreSQL** database. The connection string lives
in `.env` as `DATABASE_URL`.

```
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
ENCRYPTION_KEY="<64-char hex>"
EMAIL_HASH_PEPPER="<64-char hex>"
AUTH_SECRET="<random secret for next-auth>"
```

- Models are defined in `prisma/schema.prisma`
- The generated client is in `src/generated/prisma/` (gitignored)
- Always access the DB via the singleton in `src/lib/db.ts`
- Fields marked `[ENCRYPTED]` must be encrypted before write; hashed for lookup
- API routes in `app/api/` are the only place DB calls should live

## API Routes (DB Operations Only)

API routes exist solely to write/read from the database. Client components call
them via `fetch`. No complex business logic — keep routes thin.

```typescript
// app/api/waitlist/route.ts
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, locale } = await request.json()
  const entry = await db.waitlistEntry.create({ data: { email, locale } })
  return NextResponse.json({ id: entry.id })
}
```

## Adding a New Section

1. Create `components/{section-name}-section.tsx`
2. Add translations to all 3 locales in `lib/i18n.ts`
3. Import and render in `app/page.tsx`
4. Export any new types from the file directly (no separate types file needed)

## i18n Architecture

```typescript
// lib/i18n.ts — defines types and all translations
export type Locale = 'en' | 'vi' | 'fr';
export const translations = { en: {...}, vi: {...}, fr: {...} };

// components/i18n-provider.tsx — React context
const { t, locale, setLocale } = useI18n();

// Usage in any component
const { t } = useI18n();
<h1>{t('hero.headlineLine1')}</h1>
```
