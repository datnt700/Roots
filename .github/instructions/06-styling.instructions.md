---
applyTo: '**/*.{ts,tsx}'
---

# Emotion Styling Patterns

## Core Rule: Always Use Theme Tokens

NEVER use raw CSS values. ALWAYS reference `theme.*` from `lib/theme.ts`.

```typescript
import styled from '@emotion/styled'
import { theme } from '@/lib/theme'

// ✅ CORRECT
const Card = styled.div({
  padding: theme.spacing[8],
  borderRadius: theme.radius.xl,
  color: theme.colors.foreground,
  backgroundColor: theme.colors.card,
  boxShadow: theme.shadows.md,
  transition: `all ${theme.transitions.normal}`,
  fontFamily: theme.fonts.serif,
})

// ❌ WRONG — hardcoded values
const Card = styled.div({
  padding: '32px',
  borderRadius: '12px',
  color: '#1a1a1a',
})
```

## Available Theme Tokens

```typescript
// Colors (CSS variable references)
theme.colors.background // var(--background)
theme.colors.foreground // var(--foreground)
theme.colors.primary // var(--primary)
theme.colors.primaryForeground // var(--primary-foreground)
theme.colors.secondary // var(--secondary)
theme.colors.muted // var(--muted)
theme.colors.mutedForeground // var(--muted-foreground)
theme.colors.card // var(--card)
theme.colors.border // var(--border)
theme.colors.destructive // var(--destructive)

// Fonts
theme.fonts.sans // DM Sans (body text)
theme.fonts.serif // Playfair Display (headings, brand)
theme.fonts.mono // Geist Mono (code)

// Spacing (rem values)
theme.spacing[1] // 0.25rem
theme.spacing[2] // 0.5rem
theme.spacing[3] // 0.75rem
theme.spacing[4] // 1rem
theme.spacing[5] // 1.25rem
theme.spacing[6] // 1.5rem
theme.spacing[8] // 2rem
theme.spacing[10] // 2.5rem
theme.spacing[12] // 3rem
theme.spacing[16] // 4rem
theme.spacing[20] // 5rem
theme.spacing[24] // 6rem
theme.spacing[32] // 8rem

// Radii
theme.radius.sm // 0.5rem
theme.radius.md // 0.625rem
theme.radius.lg // 0.75rem
theme.radius.xl // 1rem
theme.radius['2xl'] // 1.5rem
theme.radius['3xl'] // 2rem
theme.radius.full // 9999px

// Transitions
theme.transitions.fast // 150ms ease
theme.transitions.normal // 200ms ease
theme.transitions.slow // 300ms ease
theme.transitions.verySlow // 500ms ease

// Shadows
theme.shadows.sm
theme.shadows.md
theme.shadows.lg
```

## Responsive Design

Use media query strings inline:

```typescript
const Section = styled.section({
  padding: `${theme.spacing[16]} 0`,
  '@media (min-width: 768px)': {
    padding: `${theme.spacing[24]} 0`,
  },
  '@media (min-width: 1024px)': {
    padding: `${theme.spacing[32]} 0`,
  },
})
```

Common breakpoints: `768px` (md), `1024px` (lg), `1280px` (xl).

## Transient Props ($ prefix for styled-component-only props)

```typescript
const Box = styled.div<{ $isActive: boolean }>(({ $isActive }) => ({
  opacity: $isActive ? 1 : 0.5,
}));

// ✅ $ prefix prevents prop from being forwarded to DOM
<Box $isActive={true} />
```

## Keyframe Animations

```typescript
import { keyframes } from '@emotion/react'

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`

const AnimatedDiv = styled.div({
  animation: `${fadeIn} 0.6s ease forwards`,
})
```

## CSS Variables (from globals.css)

Brand colors defined as CSS custom properties for light/dark mode support.
Do NOT use `oklch()` values directly in Emotion — use CSS variable references
via `theme.colors.*`.

```typescript
// ✅ Use theme color tokens
backgroundColor: theme.colors.background,

// ✅ Acceptable for one-off opacity adjustments where no token exists
backgroundColor: 'oklch(0.92 0.015 80 / 0.3)',
```
