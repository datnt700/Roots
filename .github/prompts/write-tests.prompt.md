---
description: Write tests for ROOTS landing page logic
name: write-tests
argument-hint: What to test (hook name, utility function, or component)
agent: agent
model: Claude Sonnet 4.5
tools: ['search']
---

# Write Tests Prompt

Write tests for ROOTS (GỐC) landing page logic.

## Test Stack

If not yet installed:

```powershell
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
```

## What to Test

Focus on logic, not layout:

1. **`useI18n` hook** — locale switching, `t()` returns correct string
2. **`useMobile` hook** — breakpoint detection
3. **`lib/utils.ts`** — utility functions
4. **i18n completeness** — all 3 locales have all required keys

## What NOT to Test

- Styled components (no logic)
- Static sections (just JSX)
- CSS/visual output

## Test Templates

### Hook test

```typescript
import { renderHook, act } from '@testing-library/react';
import { I18nProvider } from '@/components/i18n-provider';
import { useI18n } from '@/components/i18n-provider';

const wrapper = ({ children }) => <I18nProvider>{children}</I18nProvider>;

test('switches locale', () => {
  const { result } = renderHook(() => useI18n(), { wrapper });
  expect(result.current.locale).toBe('en');
  act(() => result.current.setLocale('vi'));
  expect(result.current.locale).toBe('vi');
});
```

### i18n completeness test

```typescript
import { translations } from '@/lib/i18n'

test('all locales have same keys', () => {
  const enKeys = JSON.stringify(Object.keys(translations.en).sort())
  const viKeys = JSON.stringify(Object.keys(translations.vi).sort())
  const frKeys = JSON.stringify(Object.keys(translations.fr).sort())
  expect(viKeys).toBe(enKeys)
  expect(frKeys).toBe(enKeys)
})
```

### Utility test

```typescript
import { cn } from '@/lib/utils'

test('cn merges class names', () => {
  expect(cn('foo', 'bar')).toBe('foo bar')
  expect(cn('foo', undefined, 'bar')).toBe('foo bar')
})
```
