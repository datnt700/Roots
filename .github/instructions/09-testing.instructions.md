---
applyTo: '**/*.test.{ts,tsx},**/*.spec.{ts,tsx}'
---

# Testing Guidelines

## Stack

No testing framework is currently installed.
If tests are needed, use **Vitest** + **React Testing Library**.

## What to Test

Focus on the pieces with actual logic:

1. **`useMobile` hook** — breakpoint detection
2. **Utility functions** in `src/lib/utils.ts`
3. **Crypto functions** in `src/lib/crypto.ts` — encrypt/decrypt round-trips, hash determinism
4. **API routes** — validate input handling and DB responses (with mock db)
5. **Auth flows** — token verification (with next-auth test helpers)

## What NOT to Test

- Styled components (visual-only)
- Section layout (no logic)
- Translation strings in `messages/` (they are the source of truth)

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
