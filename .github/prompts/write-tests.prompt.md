---
description: Write tests for ROOTS app logic (hooks, utilities, crypto, API routes)
name: write-tests
argument-hint: What to test (hook name, utility function, API route, or component)
agent: agent
model: Claude Sonnet 4.5
tools: ['search']
---

# Write Tests Prompt

Write tests for ROOTS (GỐC) logic — landing page and family app.

## Test Stack

If not yet installed:

```powershell
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
```

## What to Test

Focus on logic, not layout:

1. **`useMobile` hook** — breakpoint detection
2. **`lib/utils.ts`** — utility functions
3. **`lib/crypto.ts`** — encrypt/decrypt round-trip, hash stability
4. **i18n completeness** — all 3 locales have all required keys in `messages/`
5. **API routes** — POST/GET handlers with mocked `db` from `@/lib/db`

## What NOT to Test

- Styled components (no logic)
- Static sections (just JSX)
- CSS/visual output
- `useTranslations()` at runtime (next-intl is a library, not your code)

## Test Templates

### Hook test

```typescript
import { renderHook } from '@testing-library/react';
import { useMobile } from '@/hooks/use-mobile';

test('detects mobile breakpoint', () => {
  Object.defineProperty(window, 'innerWidth', { value: 400, writable: true });
  const { result } = renderHook(() => useMobile());
  expect(result.current).toBe(true);
});
```

### Crypto round-trip test

```typescript
import { encrypt, decrypt, hashEmail, hashToken } from '@/lib/crypto'

test('encrypt/decrypt round-trip', () => {
  const original = 'test@example.com'
  const ciphertext = encrypt(original)
  expect(ciphertext).not.toBe(original)
  expect(decrypt(ciphertext)).toBe(original)
})

test('hashEmail is stable and deterministic', () => {
  const hash1 = hashEmail('test@example.com')
  const hash2 = hashEmail('test@example.com')
  expect(hash1).toBe(hash2)
  expect(hash1).not.toBe('test@example.com')
})

test('hashToken is stable', () => {
  const token = 'abc123'
  expect(hashToken(token)).toBe(hashToken(token))
})
```

### i18n completeness test

```typescript
import en from '../../messages/en/timeline.json'
import vi from '../../messages/vi/timeline.json'
import fr from '../../messages/fr/timeline.json'

test('all locales have same keys as English', () => {
  const enKeys = JSON.stringify(Object.keys(en).sort())
  expect(JSON.stringify(Object.keys(vi).sort())).toBe(enKeys)
  expect(JSON.stringify(Object.keys(fr).sort())).toBe(enKeys)
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

### API route test

```typescript
import { POST } from '@/app/api/waitlist/route'
import { db } from '@/lib/db'

vi.mock('@/lib/db', () => ({
  db: { waitlistEntry: { create: vi.fn().mockResolvedValue({ id: '1' }) } }
}))

test('POST /api/waitlist creates entry', async () => {
  const req = new Request('http://localhost/api/waitlist', {
    method: 'POST',
    body: JSON.stringify({ email: 'test@example.com', locale: 'en' }),
  })
  const res = await POST(req)
  expect(res.status).toBe(201)
  expect(db.waitlistEntry.create).toHaveBeenCalledWith({
    data: expect.objectContaining({ locale: 'en' })
  })
})
```
