---
description: Perform a thorough code review of changes to ROOTS (landing page or app)
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
- #file:../DESIGN.md

## Review Checklist

### 1. i18n

- [ ] All user-visible strings use `t()` from `useTranslations()` — no hardcoded text
- [ ] No usage of old `useI18n()` from `@/components/i18n-provider`
- [ ] New translation keys added to `messages/en/`, `messages/vi/`, `messages/fr/`
- [ ] No missing keys in any of the 3 locales

### 2. Styling

- [ ] Cards use glass surface (`var(--glass-bg)` + backdrop-filter) — not `theme.colors.card`
- [ ] Hover effects wrapped in `'@media (hover: hover)'` — no bare `'&:hover'`
- [ ] Clay surface only on parent-facing primary actions (RecordButton, sidebar Record)
- [ ] All styled components use `theme.*` tokens — no raw CSS values
- [ ] Transient props (`$prop`) use `shouldForwardProp` to prevent DOM forwarding
- [ ] No Tailwind classes, inline styles with raw values, or CSS modules

### 3. Component Structure

- [ ] App pages: styled components in `page.styles.ts`, JSX in `page.tsx`
- [ ] `'use client'` directive at top
- [ ] Imports from `@/lib/theme`, `useTranslations` from `next-intl`
- [ ] Styled components defined at module level (not inside render)
- [ ] `IntersectionObserver` cleaned up in `useEffect` return

### 4. Performance

- [ ] `willChange: 'transform, opacity'` on animated cards
- [ ] No unnecessary re-renders
- [ ] No heavy dependencies added

### 5. TypeScript

- [ ] No `any` types without justification
- [ ] Unused params prefixed with `_`

### 6. Database / API Routes

- [ ] DB calls only inside `src/app/api/` routes — never in client components
- [ ] Always imports `db` from `@/lib/db` — never `new PrismaClient()`
- [ ] Input validated before `db.*` calls
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
```
