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
```

---

## 🏗️ Project Structure

```
app/
  layout.tsx        # Root layout with fonts, i18n, analytics
  page.tsx          # Main page — assembles all sections
  globals.css       # Global CSS variables (light/dark theme tokens)
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

### 3. No Backend / No Database

This is a **static landing page**. There is no database, no API routes, no
server actions, and no authentication.

- ❌ No Prisma, no PostgreSQL, no Docker required
- ❌ No React Query, no server actions
- ✅ Data is static — defined in `lib/i18n.ts` translations
- ✅ Any form submissions (waitlist) go to external services (Mailchimp, etc.)

### 4. Environment Variables

Use `process.env.NEXT_PUBLIC_*` for any client-visible env vars. Add them
to `.env.local` for local dev and to Vercel for production.

```typescript
// ✅ OK for this simple project (no complex env validation needed)
const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID
```

### 5. Performance

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
