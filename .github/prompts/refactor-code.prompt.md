---
description: Refactor code to improve maintainability following ROOTS patterns
name: refactor-code
argument-hint: Describe what to refactor and why
agent: agent
model: Claude Sonnet 4.5
tools: ['search', 'usages']
---

# Refactor Code Prompt

Refactor code in the ROOTS (GỐC) codebase to improve maintainability.

## Context Files

- #file:../.github/instructions/02-web-apps.instructions.md - Next.js + auth + i18n
- #file:../.github/instructions/06-styling.instructions.md - Emotion + glass/clay
- #file:../.github/instructions/14-common-pitfalls.instructions.md - Anti-patterns
- #file:../DESIGN.md - Design system

## Refactoring Goals

- Replace hardcoded values with `theme.*` tokens
- Replace hardcoded strings with `t()` from `useTranslations()` (next-intl)
- Flat cards → glass surface (`var(--glass-bg)` + backdrop-filter)
- Bare `'&:hover'` → `'@media (hover: hover)': { '&:hover': ... }`
- Add `$` prefix to transient styled props + `shouldForwardProp`
- Move styled components from `page.tsx` → `page.styles.ts`
- Extract reusable styled components if duplicated 3+ times
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

// ✅ After — in page.tsx
const t = useTranslations('competitive')
<h2>{t('sectionTitle')}</h2>
// Also add key to messages/en/, messages/vi/, messages/fr/
```

### 3. Flat card → glass surface

```typescript
// ❌ Before
const Card = styled.div({ backgroundColor: theme.colors.card, borderRadius: theme.radius['2xl'] })

// ✅ After
const Card = styled.div({
  backgroundColor: 'var(--glass-bg)',
  backdropFilter: 'blur(14px) saturate(1.4)',
  WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
  border: '1px solid var(--glass-border)',
  boxShadow: 'var(--glass-shadow), var(--glass-inset)',
  borderRadius: theme.radius['2xl'],
})
```

### 4. Hover on all devices → hover media query

```typescript
// ❌ Before
'&:hover': { transform: 'translateY(-2px)' }

// ✅ After
'@media (hover: hover)': {
  '&:hover': { transform: 'translateY(-2px)' }
}
```

### 5. Transient prop prefix + shouldForwardProp

```typescript
// ❌ Before
const Box = styled.div<{ isVisible: boolean }>(({ isVisible }) => ({...}))
<Box isVisible={true} />

// ✅ After
const Box = styled('div', {
  shouldForwardProp: (p) => p !== '$isVisible',
})<{ $isVisible: boolean }>(({ $isVisible }) => ({...}))
<Box $isVisible={true} />
```

## Rules

- ✅ Preserve all behavior — refactor only, no new features
- ✅ Run `pnpm lint` and `pnpm build` after refactoring
- ❌ Do not extract to separate files unless clearly needed
- ❌ Do not add dependencies
