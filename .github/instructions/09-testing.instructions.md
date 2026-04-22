---
applyTo: '**/*.test.{ts,tsx},**/*.spec.{ts,tsx}'
---

# Testing Guidelines

## Stack

This is a simple landing page with no testing framework currently installed.
If tests are needed, use **Vitest** + **React Testing Library**.

## What to Test

Focus on the few pieces of logic in this project:

1. **`useI18n` hook** — locale switching, `t()` function returns correct string
2. **`useMobile` hook** — breakpoint detection
3. **Utility functions** in `lib/utils.ts`

## What NOT to Test

- Styled components (visual-only)
- Section layout (no logic)
- Static translation strings (they are the source of truth)

## Adding Vitest

```powershell
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom
```

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
})
```

## Example Test

```typescript
import { render, screen } from '@testing-library/react';
import { I18nProvider } from '@/components/i18n-provider';

test('renders navbar logo', () => {
  render(
    <I18nProvider>
      <Navbar />
    </I18nProvider>
  );
  expect(screen.getByText('ROOTS')).toBeInTheDocument();
});
```
