---
description: Refactor code to improve maintainability following ROOTS patterns
name: refactor-code
argument-hint: Describe what to refactor and why
agent: agent
model: Claude Sonnet 4.5
tools: ['search', 'usages']
---

# Refactor Code Prompt

Refactor code in the ROOTS (GỐC) landing page to improve maintainability.

## Context Files

- #file:../.github/instructions/02-web-apps.instructions.md - Next.js patterns
- #file:../.github/instructions/06-styling.instructions.md - Emotion patterns
- #file:../.github/instructions/14-common-pitfalls.instructions.md - Anti-patterns

## Refactoring Goals

- Replace hardcoded values with `theme.*` tokens
- Replace hardcoded strings with `t()` i18n calls
- Extract reusable styled components if duplicated 3+ times
- Add `$` prefix to transient styled props
- Clean up `useEffect` / `IntersectionObserver` patterns

## Common Refactors

### 1. Raw values → theme tokens

```typescript
// ❌ Before
const Card = styled.div({ padding: '32px', borderRadius: '12px' })

// ✅ After
const Card = styled.div({
  padding: theme.spacing[8],
  borderRadius: theme.radius['2xl'],
})
```

### 2. Hardcoded string → i18n

```typescript
// ❌ Before
<h2>Why Roots?</h2>

// ✅ After
<h2>{t('competitive.sectionTitle')}</h2>
// (plus add key to lib/i18n.ts in all 3 locales)
```

### 3. Transient prop prefix

```typescript
// ❌ Before
const Box = styled.div<{ isVisible: boolean }>(({ isVisible }) => ({...}));
<Box isVisible={true} />

// ✅ After
const Box = styled.div<{ $isVisible: boolean }>(({ $isVisible }) => ({...}));
<Box $isVisible={true} />
```

### 4. Stagger animation pattern

```typescript
// ❌ Before — magic numbers
transitionDelay: `${index * 100}ms`,

// ✅ After — explicit and readable
const STAGGER_MS = 100;
transitionDelay: `${index * STAGGER_MS}ms`,
```

## Rules

- ✅ Preserve all behavior — refactor only, no new features
- ✅ Run `pnpm lint` and `pnpm build` after refactoring
- ❌ Do not extract to separate files unless clearly needed
- ❌ Do not add dependencies
