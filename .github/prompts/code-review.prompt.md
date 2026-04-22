---
description: Perform a thorough code review of changes to the ROOTS landing page
name: code-review
argument-hint: Paste the diff or describe the changes to review
agent: agent
model: Claude Sonnet 4.5
tools: ['search', 'usages']
---

# Code Review Prompt

Perform a thorough code review following ROOTS (GỐC) project standards.

## Context Files

- #file:../.github/instructions/01-architecture.instructions.md
- #file:../.github/instructions/02-web-apps.instructions.md
- #file:../.github/instructions/06-styling.instructions.md
- #file:../.github/instructions/14-common-pitfalls.instructions.md

## Review Checklist

### 1. i18n

- [ ] All user-visible strings use `t()` — no hardcoded text
- [ ] New translation keys added to all 3 locales (en, vi, fr)
- [ ] No missing keys in `lib/i18n.ts`

### 2. Styling

- [ ] All styled components use `theme.*` tokens — no raw CSS values
- [ ] Transient props use `$` prefix (e.g., `$isVisible`)
- [ ] No Tailwind classes, inline styles with raw values, or CSS modules

### 3. Component Structure

- [ ] `'use client'` directive at top
- [ ] Imports from `@/lib/theme`, `@/components/i18n-provider`
- [ ] Styled components defined at module level (not inside render)
- [ ] `IntersectionObserver` cleaned up in `useEffect` return

### 4. Performance

- [ ] No unnecessary re-renders (stable refs, memoization where needed)
- [ ] No heavy dependencies added
- [ ] Images use `public/` directory

### 5. TypeScript

- [ ] No `any` types without justification
- [ ] Unused params prefixed with `_`
- [ ] Types inferred where obvious

### 6. Database / API Routes

- [ ] DB calls only inside `app/api/` routes — never in client components
- [ ] Always imports `db` from `@/lib/db` — never `new PrismaClient()`
- [ ] Input validated before `db.*` calls (at minimum: type check + trim)
- [ ] Schema changes include a migration file
- [ ] No server actions — use API routes + `fetch` from client

### 7. Build

- [ ] `pnpm build` passes
- [ ] `pnpm lint` passes

## Review Output Format

```
## Summary
[Brief description of what the change does]

## Issues Found
### Critical
- [Issue + location + fix]

### Warnings
- [Minor issue + suggestion]

## Approved / Changes Requested
```
