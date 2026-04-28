---
description: Implement a new section or feature for ROOTS (landing page or authenticated app)
name: feature-development
argument-hint: Describe the section or feature to implement
agent: agent
model: Claude Sonnet 4.5
tools: ['search', 'usages']
---

# Feature Development Prompt

Implement a new section or feature for ROOTS (GỐC).

## Context Files

- #file:../.github/instructions/01-architecture.instructions.md - Project structure
- #file:../.github/instructions/02-web-apps.instructions.md - Next.js + auth + i18n
- #file:../.github/instructions/06-styling.instructions.md - Emotion + glass/clay
- #file:../.github/instructions/14-common-pitfalls.instructions.md - Avoid mistakes
- #file:../DESIGN.md - Design system (must read before any UI work)
- #file:../src/lib/theme.ts - Design tokens

## Expected Output

Deliver a complete, working feature with:

1. **For landing page sections**: `src/components/{name}-section.tsx` with `'use client'`
2. **For app pages**: `src/app/app/{name}/page.tsx` + `src/app/app/{name}/page.styles.ts`
3. **Translation keys** — Added to all 3 locales (`messages/en/`, `messages/vi/`, `messages/fr/`)
4. **Glass surface** — All cards use glass pattern (not `theme.colors.card`)
5. **Hover behavior** — All hover effects wrapped in `'@media (hover: hover)'`

## Task Steps

### 1. Research Phase

- [ ] Read `DESIGN.md` — understand glass/clay surface rules
- [ ] Check `src/lib/theme.ts` for available tokens (`theme.glass.*`, `theme.clay.*`)
- [ ] Check `messages/en/*.json` for existing translation namespaces
- [ ] Check `src/components/ui/` for reusable primitives (Button, Badge, etc.)

### 2. Translation Keys

Add ALL translation strings to the appropriate `messages/{locale}/{namespace}.json`:

```json
// messages/en/newFeature.json
{ "title": "New Feature", "description": "..." }

// messages/vi/newFeature.json  ← must add
{ "title": "Tính năng mới", "description": "..." }

// messages/fr/newFeature.json  ← must add
{ "title": "Nouvelle fonctionnalité", "description": "..." }
```

### 3. Component Implementation

**App page template:**
```typescript
// page.styles.ts
import styled from '@emotion/styled'
import { theme } from '@/lib/theme'

export const Card = styled.div({
  backgroundColor: 'var(--glass-bg)',
  backdropFilter: 'blur(14px) saturate(1.4)',
  WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
  border: '1px solid var(--glass-border)',
  boxShadow: 'var(--glass-shadow), var(--glass-inset)',
  borderRadius: theme.radius['2xl'],
  willChange: 'transform, opacity',
  '@media (hover: hover)': {
    '&:hover': { transform: 'translateY(-2px)', boxShadow: `${theme.shadows.md}, var(--glass-inset)` },
  },
  '&:active': { transform: 'scale(0.98)', opacity: 0.8 },
})

// page.tsx
'use client'
import { useTranslations } from 'next-intl'
import { Card } from './page.styles'

export default function NewPage() {
  const t = useTranslations('newFeature')
  return <Card>{t('title')}</Card>
}
```

**Landing page section template:**
```typescript
'use client'
import { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { theme } from '@/lib/theme'
import { useTranslations } from 'next-intl'

export function NewSection() {
  const t = useTranslations('newFeature')
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

  return <section ref={ref}>{t('title')}</section>
}
```

### 4. Integration

- Landing page section: add to `src/app/page.tsx`
- App page: add nav item to `src/components/app-shell.tsx` NAV_ITEMS

## Quality Checklist

- [ ] No hardcoded strings — all via `t()`
- [ ] No `theme.colors.card` on cards — use glass
- [ ] No bare `'&:hover'` — use `'@media (hover: hover)'`
- [ ] `willChange` on animated elements
- [ ] Translations in all 3 locales
- [ ] `pnpm build` passes

- [ ] All strings use `t()` — no hardcoded text
- [ ] All styled components use `theme.*` tokens — no raw values
- [ ] All 3 locales have translations
- [ ] Animated elements use `$isVisible` (transient prop with `$` prefix)
- [ ] Component has `'use client'` directive
- [ ] No API routes, no server actions, no database calls
