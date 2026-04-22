---
description: Create a new UI component for the ROOTS landing page
name: component-creation
argument-hint: Component name and purpose
agent: agent
model: Claude Sonnet 4.5
tools: ['search', 'usages']
---

# Component Creation Prompt

Create a new UI component for the ROOTS (GỐC) landing page.

## Context Files

- #file:../.github/instructions/02-web-apps.instructions.md - Next.js patterns
- #file:../.github/instructions/06-styling.instructions.md - Styling guidelines
- #file:../components/ui/ - Existing primitives for reference
- #file:../lib/theme.ts - Design tokens

## Expected Output

Deliver a production-ready component with:

1. **Component file** — `components/ui/{component-name}.tsx`
2. **TypeScript types** — Props interface exported from same file
3. **Emotion styling** — Using theme tokens only
4. **Accessibility** — ARIA labels, keyboard support where applicable

## Component Structure

```
components/ui/
  {component-name}.tsx    # Component + types in one file
```

## Component Template

```typescript
'use client';

import styled from '@emotion/styled';
import { theme } from '@/lib/theme';

interface ComponentProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const StyledComponent = styled.div<{ $variant: string }>(({ $variant }) => ({
  padding: theme.spacing[4],
  borderRadius: theme.radius.md,
  color: $variant === 'primary' ? theme.colors.primaryForeground : theme.colors.foreground,
  backgroundColor: $variant === 'primary' ? theme.colors.primary : theme.colors.card,
}));

export function Component({ children, variant = 'primary' }: ComponentProps) {
  return <StyledComponent $variant={variant}>{children}</StyledComponent>;
}
```

## Pre-Flight Checklist

- [ ] Does this component already exist in `components/ui/`?
- [ ] Can this be composed from existing components (Button, Badge, etc.)?
- [ ] Is this reusable, or should it live in the section file directly?

## Rules

- ✅ Use `$` prefix for transient styled props
- ✅ Use `theme.*` tokens — no raw CSS values
- ✅ Export component and types from same file
- ❌ No separate `.styles.ts` files needed for this project
- ❌ No Storybook needed
