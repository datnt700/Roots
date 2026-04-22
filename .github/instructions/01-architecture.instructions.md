---
applyTo: '**/*'
---

# ROOTS (GỐC) - Architecture & Project Structure

## What Is This Project?

ROOTS (GỐC) is a **marketing landing page** for a digital family heritage app.
It is the first digital museum for ancestral storytelling in Vietnam.

The landing page is a **single Next.js 16 app** — no monorepo, no backend, no
database.

## Tech Stack

- **Framework**: Next.js 16 (App Router, `'use client'` for interactive pages)
- **Language**: TypeScript (strict mode via tsconfig.json)
- **Styling**: Emotion (`@emotion/styled`, `@emotion/react`)
- **UI Primitives**: Custom components in `components/ui/` (shadcn-style)
- **i18n**: Custom React context — 3 locales: `en`, `vi`, `fr`
- **Fonts**: DM Sans (sans-serif) + Playfair Display (serif) via Google Fonts
- **Analytics**: Vercel Analytics (production only)
- **Deployment**: Vercel

## Directory Structure

```
app/
  layout.tsx          # Root layout — fonts, i18n provider, analytics
  page.tsx            # Home page — assembles all sections
  globals.css         # CSS custom properties (light/dark theme tokens)

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
  i18n.ts             # Locale types + all translation strings (en/vi/fr)
  theme.ts            # Design tokens — colors, fonts, spacing, radii, shadows
  utils.ts            # Utility functions (cn, etc.)

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
