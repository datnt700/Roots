---
description: Create a new UI component for ROOTS (landing page or app page)
name: component-creation
argument-hint: Component name and purpose
agent: agent
model: Claude Sonnet 4.5
tools: ['search', 'usages']
---

# Component Creation Prompt

Create a new UI component for ROOTS (GỐC).

## Context Files

- #file:../.github/instructions/02-web-apps.instructions.md - Next.js patterns
- #file:../.github/instructions/06-styling.instructions.md - Styling guidelines
- #file:../DESIGN.md - Design system (glass/clay surfaces)
- #file:../src/components/ui/ - Existing primitives for reference
- #file:../src/lib/theme.ts - Design tokens

## Expected Output

Deliver a production-ready component with:

1. **Styles file** — `src/components/ui/{component-name}.styles.ts` (or inline if single file)
2. **Component file** — `src/components/ui/{component-name}.tsx`
3. **TypeScript types** — Props interface exported from same file
4. **Emotion styling** — Using theme tokens + glass surface for cards
5. **Accessibility** — ARIA labels, keyboard support where applicable

## Component Structure

```
src/components/ui/
  {component-name}.tsx    # Component + types
  # For complex components:
  {component-name}.styles.ts  # Styled components
```

## Component Template (App page card)

```typescript
'use client'

import styled from '@emotion/styled'
import { theme } from '@/lib/theme'

interface ComponentProps {
  children: React.ReactNode
  onClick?: () => void
}

const StyledCard = styled.div({
  // Glass surface — default for ALL cards
  backgroundColor: 'var(--glass-bg)',
  backdropFilter: 'blur(14px) saturate(1.4)',
  WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
  border: '1px solid var(--glass-border)',
  boxShadow: 'var(--glass-shadow), var(--glass-inset)',
  borderRadius: theme.radius['2xl'],
  padding: theme.spacing[4],
  cursor: 'pointer',
  transition: `all ${theme.transitions.fast}`,
  willChange: 'transform, opacity',
  '@media (hover: hover)': {
    '&:hover': {
      boxShadow: `${theme.shadows.md}, var(--glass-inset)`,
      transform: 'translateY(-2px)',
    },
  },
  '&:active': { transform: 'scale(0.98)', opacity: 0.8 },
})

export function Component({ children, onClick }: ComponentProps) {
  return <StyledCard onClick={onClick}>{children}</StyledCard>
}
```

## Pre-Flight Checklist

- [ ] Does this component already exist in `src/components/ui/`?
- [ ] Can this be composed from existing components (Button, Badge, etc.)?
- [ ] Is this reusable, or should it live in the page's `.styles.ts` directly?

## Rules

- ✅ Glass surface for card-like components (`var(--glass-bg)` + backdrop-filter)
- ✅ Clay surface ONLY for parent-facing primary actions (green gradient + clay shadow)
- ✅ `@media (hover: hover)` wrapper on all hover effects
- ✅ `willChange: 'transform, opacity'` on animated components
- ✅ `$` prefix for transient styled props + `shouldForwardProp`
- ✅ `theme.*` tokens — no raw CSS values
- ❌ No `theme.colors.card` for card backgrounds
- ❌ No bare `'&:hover'` on cards
