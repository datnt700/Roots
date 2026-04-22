---
description: Implement a new section or feature for the ROOTS landing page
name: feature-development
argument-hint: Describe the section or feature to implement
agent: agent
model: Claude Sonnet 4.5
tools: ['search', 'usages']
---

# Feature Development Prompt

Implement a new section or feature for the ROOTS (GỐC) landing page.

## Context Files

- #file:../.github/instructions/01-architecture.instructions.md - Project structure
- #file:../.github/instructions/02-web-apps.instructions.md - Next.js patterns
- #file:../.github/instructions/06-styling.instructions.md - Emotion styling
- #file:../.github/instructions/14-common-pitfalls.instructions.md - Avoid mistakes
- #file:../lib/i18n.ts - Existing translation keys
- #file:../lib/theme.ts - Design tokens

## Expected Output

Deliver a complete, working feature with:

1. **Section component** — `components/{name}-section.tsx` with `'use client'`
2. **Translation keys** — Added to all 3 locales (en, vi, fr) in `lib/i18n.ts`
3. **Page integration** — Imported and rendered in `app/page.tsx`
4. **Scroll animations** — IntersectionObserver + staggered transitionDelay

## Task Steps

### 1. Research Phase

- [ ] Review relevant instruction files
- [ ] Check existing sections for patterns to follow
- [ ] Check `lib/theme.ts` for available design tokens
- [ ] Check `components/ui/` for reusable primitives (Button, Badge, etc.)

### 2. Translation Keys

Add ALL translation strings to `lib/i18n.ts`:

- Add to `en`, `vi`, AND `fr` — never leave a locale incomplete
- Follow existing naming conventions (`sectionName.key`)

### 3. Component Implementation

```typescript
'use client';

import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '@/lib/theme';
import { useI18n } from '@/components/i18n-provider';

export function NewSection() {
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

  return <Section ref={ref}>...</Section>;
}
```

### 4. Integration

Add to `app/page.tsx` in logical position within the page flow.

## Quality Checklist

- [ ] All strings use `t()` — no hardcoded text
- [ ] All styled components use `theme.*` tokens — no raw values
- [ ] All 3 locales have translations
- [ ] Animated elements use `$isVisible` (transient prop with `$` prefix)
- [ ] Component has `'use client'` directive
- [ ] No API routes, no server actions, no database calls
