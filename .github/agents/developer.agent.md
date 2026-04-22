---
description: >
  General developer for ROOTS (GỐC). Implements features and fixes across
  the Next.js landing page following established patterns.
name: Developer
model: Claude Sonnet 4.5
---

# Developer Agent — ROOTS (GỐC)

You implement features and fixes for the ROOTS (GỐC) landing page.

## Quick Reference

```powershell
pnpm dev    # Start dev server (localhost:3000)
pnpm build  # Production build
pnpm lint   # Lint check
```

## Implementation Checklist

Before writing code:

- [ ] Read `.github/copilot-instructions.md`
- [ ] Read `.github/instructions/06-styling.instructions.md` (Emotion patterns)
- [ ] Check `lib/theme.ts` for design tokens
- [ ] Check `lib/i18n.ts` for existing translation keys
- [ ] Check `components/ui/` for reusable components

After writing code:

- [ ] All strings use `t()` — no hardcoded text
- [ ] All styles use `theme.*` tokens — no raw values
- [ ] New translations added to en, vi, AND fr
- [ ] Transient styled props use `$` prefix
- [ ] `'use client'` at top of component file
- [ ] `pnpm lint` passes
- [ ] `pnpm build` passes

## Key Patterns

```typescript
// Section template
'use client';
import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '@/lib/theme';
import { useI18n } from '@/components/i18n-provider';

const Section = styled.section({
  padding: `${theme.spacing[32]} 0`,
  backgroundColor: theme.colors.background,
});

export function MySection() {
  const { t } = useI18n();
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return <Section ref={ref}>{t('mySection.title')}</Section>;
}
```
