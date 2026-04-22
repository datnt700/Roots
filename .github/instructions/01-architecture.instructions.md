---
applyTo: '**/*'
---

# ROOTS (GỐC) - Architecture & Project Structure

## What Is This Project?

ROOTS (GỐC) is a **marketing landing page** for a digital family heritage app.
It is the first digital museum for ancestral storytelling in Vietnam.

The landing page is a **single Next.js 16 app** with a PostgreSQL database
(Neon) accessed via Prisma ORM — primarily for waitlist signups.

## Tech Stack

- **Framework**: Next.js 16 (App Router, `'use client'` for interactive pages)
- **Language**: TypeScript (strict mode via tsconfig.json)
- **Styling**: Emotion (`@emotion/styled`, `@emotion/react`)
- **UI Primitives**: Custom components in `components/ui/` (shadcn-style)
- **i18n**: Custom React context — 3 locales: `en`, `vi`, `fr`
- **Database**: Neon PostgreSQL + Prisma ORM
- **Fonts**: DM Sans (sans-serif) + Playfair Display (serif) via Google Fonts
- **Analytics**: Vercel Analytics (production only)
- **Deployment**: Vercel

## Directory Structure

```
prisma/
  schema.prisma       # Prisma schema — models and datasource config
  migrations/         # Prisma migration history
prisma.config.ts      # Prisma CLI config (datasource URL from env)

app/
  layout.tsx          # Root layout — fonts, i18n provider, analytics
  page.tsx            # Home page — assembles all sections
  globals.css         # CSS custom properties (light/dark theme tokens)
  api/
    waitlist/
      route.ts        # POST /api/waitlist — save email to DB

components/
  navbar.tsx          # Fixed sticky navbar with language switcher + mobile menu
  hero-section.tsx    # Full-viewport hero with parallax background + CTA
  problem-section.tsx # Pain point cards with emotional quote
  solution-section.tsx# Step-by-step solution with scroll progress
  competitive-section.tsx # Side-by-side comparison with competitors
  tech-section.tsx    # Technology features grid
  final-cta-section.tsx # Closing call-to-action
  footer.tsx          # Site footer
  i18n-provider.tsx   # i18n context (locale state, t() function)
  theme-provider.tsx  # Theme toggle provider
  ui/                 # Primitive UI components (Button, Badge, Input, etc.)

hooks/
  use-mobile.ts       # Mobile breakpoint detection
  use-toast.ts        # Toast notifications

lib/
  db.ts               # Prisma client singleton — always import from here
  crypto.ts           # AES-256-GCM encrypt/decrypt + hashEmail/hashToken/hashPassword
  storage.ts          # S3 file upload/read/delete (currently mocked)
  i18n.ts             # Locale types + all translation strings (en/vi/fr)
  theme.ts            # Design tokens — colors, fonts, spacing, radii, shadows
  utils.ts            # Utility functions (cn, etc.)

src/generated/prisma/ # Auto-generated Prisma client — DO NOT edit manually
public/               # Static assets (icons, images)
styles/
  globals.css         # Global styles
```

## Key Design Decisions

1. **All sections are `'use client'`** — animations, scroll observers, and i18n
   require browser APIs.
2. **No server components in sections** — the page is essentially a static SPA.
3. **Scroll-triggered animations** — `IntersectionObserver` + CSS transitions
   with `transitionDelay` for stagger effects.
4. **Design tokens in `lib/theme.ts`** — Never use raw values; always reference
   `theme.*`.
5. **CSS variables in `globals.css`** — Colors are CSS variables to support
   light/dark mode; `theme.colors.*` references them.
6. **Single Prisma client instance** — Always import `db` from `lib/db.ts`;
   never instantiate `PrismaClient` directly in components or routes.

## Database Layer

Prisma connects to a **Neon PostgreSQL** database. The connection string lives
in `.env` as `DATABASE_URL`.

```
# .env
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

- Models are defined in `prisma/schema.prisma`
- The generated client is in `src/generated/prisma/` (gitignored)
- Always access the DB via the singleton in `lib/db.ts`
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
