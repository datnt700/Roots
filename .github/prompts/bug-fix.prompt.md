---
description: Systematically investigate and fix bugs in ROOTS (landing page or app)
name: bug-fix
argument-hint: Describe the bug (what happens vs what should happen)
agent: agent
model: Claude Sonnet 4.5
tools: ['search', 'usages']
---

# Bug Fix Prompt

Systematically investigate and fix bugs in ROOTS (GỐC).

## Context Files

- #file:../.github/instructions/01-architecture.instructions.md - Project structure
- #file:../.github/instructions/02-web-apps.instructions.md - Next.js + auth + i18n
- #file:../.github/instructions/06-styling.instructions.md - Emotion patterns
- #file:../.github/instructions/14-common-pitfalls.instructions.md - Common issues
- #file:../DESIGN.md - Design system

## Expected Output

1. **Root cause analysis** — what caused the bug
2. **Code fix** — minimal, targeted change
3. **Verification steps** — how to confirm the fix works

## Investigation Steps

### 1. Reproduce the Bug

- [ ] Identify which page/component is affected
- [ ] Note browser, screen size, locale (en/vi/fr) where it occurs
- [ ] Check browser console for errors or React warnings

### 2. Locate the Code

- [ ] Landing page: find component in `src/components/`
- [ ] App page: find `src/app/app/{page}/page.tsx` and `page.styles.ts`
- [ ] Check i18n keys in `messages/{locale}/{namespace}.json`
- [ ] Check theme tokens in `src/lib/theme.ts`

### 3. Common Bug Patterns

**i18n issues:**

- Missing translation key in one locale → `t('key')` returns the key string
- Using old `useI18n()` instead of `useTranslations()` → runtime error
- Wrong namespace → `useTranslations('wrong')` doesn't find keys

**Emotion/styling issues:**

- Hydration mismatch → Emotion styled component in server context
- Transient prop not prefixed with `$` or missing `shouldForwardProp` → React DOM warning
- Raw CSS value instead of theme token
- `theme.colors.card` on a card → flat look (use glass surface instead)

**Hover issues:**

- `'&:hover'` without `@media (hover: hover)` → stuck hover state on mobile touch

**Animation issues:**

- `IntersectionObserver` not disconnecting in `useEffect` cleanup
- Missing `willChange` causing jank

**API / Database issues:**

- DB call in client component → access denied
- `new PrismaClient()` instead of `db` from `@/lib/db` → missing adapter error
- Missing encryption on PII field → plaintext in DB

**Auth issues:**

- `useSession()` called outside `SessionProvider` → missing data
- Missing `NEXTAUTH_URL` or `AUTH_SECRET` env vars → auth fails silently**

- `db` imported outside of `app/api/` — must only be used in API routes
- `new PrismaClient()` instantiated directly — use `db` from `@/lib/db`
- Missing `DATABASE_URL` in `.env` — causes runtime connection error
- Schema not matching generated client — run `npx prisma generate`

**Build issues:**

- TypeScript error — check `pnpm build` output
- Lint error — check `pnpm lint` output

### 4. Fix

Make the minimal change needed. Do not refactor unrelated code.

### 5. Verify

```powershell
pnpm lint          # No lint errors
pnpm build         # Build succeeds
npx prisma generate  # If schema/client mismatch suspected
```
