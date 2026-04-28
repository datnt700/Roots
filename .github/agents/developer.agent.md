---
description: >
  General developer for ROOTS (GỐC). Implements features and fixes across
  the landing page and authenticated app following established patterns.
name: Developer
model: Claude Sonnet 4.5
---

# Developer Agent — ROOTS (GỐC)

You implement features and fixes for ROOTS (GỐC) — landing page + family app.

## Quick Reference

```powershell
pnpm dev                              # Start dev server (localhost:3000)
pnpm build                            # Production build
pnpm lint                             # Lint check
npx prisma generate                   # Generate client after schema change
npx prisma migrate dev --name <desc>  # Create + apply migration
npx prisma studio                     # Visual DB browser
```

## Implementation Checklist

Before writing code:

- [ ] Read `DESIGN.md` — glass/clay surfaces, hover rules, animation patterns
- [ ] Read `.github/copilot-instructions.md`
- [ ] Read `.github/instructions/06-styling.instructions.md` (Emotion patterns)
- [ ] Check `src/lib/theme.ts` for design tokens (`theme.glass.*`, `theme.clay.*`)
- [ ] Check `messages/en/*.json` for existing translation keys
- [ ] Check `src/components/ui/` for reusable components

After writing code:

- [ ] All strings use `t()` from `useTranslations()` — no hardcoded text
- [ ] All styles use `theme.*` tokens — no raw values
- [ ] Cards use glass surface (`var(--glass-bg)` + backdrop-filter) — not `theme.colors.card`
- [ ] Hover effects wrapped in `'@media (hover: hover)'` — no bare `'&:hover'`
- [ ] New translations added to `messages/en/`, `messages/vi/`, `messages/fr/`
- [ ] Transient styled props use `$` prefix + `shouldForwardProp`
- [ ] `'use client'` at top of component file
- [ ] Styled components in `page.styles.ts`, JSX in `page.tsx` (for app pages)
- [ ] DB calls only in `src/app/api/` routes via `db` from `@/lib/db`
- [ ] `npx prisma generate` run after any schema change
- [ ] `pnpm lint` passes

## Key Patterns

```typescript
// App page template
// page.styles.ts
'use client'
import styled from '@emotion/styled'
import { theme } from '@/lib/theme'

export const Card = styled.div({
  backgroundColor: 'var(--glass-bg)',
  backdropFilter: 'blur(14px) saturate(1.4)',
  WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
  border: '1px solid var(--glass-border)',
  boxShadow: 'var(--glass-shadow), var(--glass-inset)',
  borderRadius: theme.radius['2xl'],
  '@media (hover: hover)': {
    '&:hover': { transform: 'translateY(-2px)', boxShadow: `${theme.shadows.md}, var(--glass-inset)` },
  },
  '&:active': { transform: 'scale(0.98)', opacity: 0.8 },
})

// page.tsx
'use client'
import { useTranslations } from 'next-intl'
import { Card } from './page.styles'

export default function MyPage() {
  const t = useTranslations('myNamespace')
  return <Card>{t('title')}</Card>
}
```
