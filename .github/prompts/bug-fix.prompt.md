---
description: Systematically investigate and fix bugs in the ROOTS landing page
name: bug-fix
argument-hint: Describe the bug (what happens vs what should happen)
agent: agent
model: Claude Sonnet 4.5
tools: ['search', 'usages']
---

# Bug Fix Prompt

Systematically investigate and fix bugs in the ROOTS (GỐC) landing page.

## Context Files

- #file:../.github/instructions/01-architecture.instructions.md - Project structure
- #file:../.github/instructions/02-web-apps.instructions.md - Next.js patterns
- #file:../.github/instructions/06-styling.instructions.md - Emotion patterns
- #file:../.github/instructions/14-common-pitfalls.instructions.md - Common issues

## Expected Output

1. **Root cause analysis** — what caused the bug
2. **Code fix** — minimal, targeted change
3. **Verification steps** — how to confirm the fix works

## Investigation Steps

### 1. Reproduce the Bug

- [ ] Identify which section/component is affected
- [ ] Note browser, screen size, locale (en/vi/fr) where it occurs
- [ ] Check browser console for errors

### 2. Locate the Code

- [ ] Find the section component in `components/`
- [ ] Check if it involves i18n keys in `lib/i18n.ts`
- [ ] Check if it involves theme tokens in `lib/theme.ts`
- [ ] Check if it involves a UI primitive in `components/ui/`

### 3. Common Bug Patterns

**i18n issues:**

- Missing translation key in one locale → `t('key')` returns undefined
- Wrong key name → check `lib/i18n.ts` TypeScript types

**Emotion/styling issues:**

- Hydration mismatch → Emotion component in server context
- Transient prop not prefixed with `$` → React DOM warning
- Raw CSS value instead of theme token

**Animation issues:**

- `isVisible` state not resetting for repeated animations
- `IntersectionObserver` not disconnecting in cleanup

**Build issues:**

- TypeScript error — check `pnpm build` output
- Lint error — check `pnpm lint` output

### 4. Fix

Make the minimal change needed. Do not refactor unrelated code.

### 5. Verify

```powershell
pnpm lint      # No lint errors
pnpm build     # Build succeeds
```
