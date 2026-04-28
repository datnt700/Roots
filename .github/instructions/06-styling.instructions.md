---
applyTo: '**/*.{ts,tsx}'
---

# Emotion Styling Patterns

> **Read `DESIGN.md` at the project root for the full design system.**
> This file covers the coding patterns; DESIGN.md covers the "why" and visual guidelines.

## Core Rule: Always Use Theme Tokens

NEVER use raw CSS values. ALWAYS reference `theme.*` from `src/lib/theme.ts`.

```typescript
import styled from '@emotion/styled'
import { theme } from '@/lib/theme'

// ✅ CORRECT
const Card = styled.div({
  padding: theme.spacing[6],
  borderRadius: theme.radius['2xl'],
  color: theme.colors.foreground,
  boxShadow: theme.shadows.md,
  transition: `all ${theme.transitions.fast}`,
  fontFamily: theme.fonts.serif,
})

// ❌ WRONG — hardcoded values
const Card = styled.div({
  padding: '24px',
  borderRadius: '12px',
  color: '#2d2a26',
})
```

## File Convention: Separate `.styles.ts` Files

App pages (`src/app/app/*/`) separate styled components into a sibling file:

```
src/app/app/timeline/
  page.tsx          ← imports from page.styles.ts, uses useTranslations()
  page.styles.ts    ← ALL styled components for this page
```

Shared layout components (`src/components/`) may use a `.styles.ts` sibling too:
```
app-shell.tsx
app-shell.styles.ts
```

**Never define styled components inside page.tsx** — keep them in `.styles.ts`.

## Surface Types

There are **three** surface treatments. Choose based on context.

### 1. Glass Surface — use for almost ALL cards & panels

```typescript
// Copy-paste pattern for glass cards:
const Card = styled.div({
  backgroundColor: 'var(--glass-bg)',
  backdropFilter: 'blur(14px) saturate(1.4)',
  WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
  border: '1px solid var(--glass-border)',
  boxShadow: 'var(--glass-shadow), var(--glass-inset)',
  borderRadius: theme.radius['2xl'],
})

// Or via theme shorthand:
const Card = styled.div({
  backgroundColor: theme.glass.background,
  backdropFilter: theme.glass.blur,
  WebkitBackdropFilter: theme.glass.blur,
  border: `1px solid ${theme.glass.border}`,
  boxShadow: `${theme.glass.shadow}, ${theme.glass.inset}`,
  borderRadius: theme.radius['2xl'],
})
```

**Hover on clickable glass cards** — ALWAYS wrap in `@media (hover: hover)`:
```typescript
'@media (hover: hover)': {
  '&:hover': {
    boxShadow: `${theme.shadows.md}, var(--glass-inset)`,
    transform: 'translateY(-2px)',
  },
},
'&:active': { transform: 'scale(0.98)', opacity: 0.8 },
```

**Sticky glass headers** (tab bars, decade headers):
```typescript
{
  position: 'sticky',
  top: 0,
  zIndex: 10,
  backgroundColor: 'var(--glass-bg)',
  backdropFilter: 'blur(16px) saturate(1.4)',
  WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
  borderBottom: '1px solid var(--glass-border)',
}
```

### 2. Clay Surface — parent-facing primary actions ONLY

```typescript
// Primary green clay (RecordButton, sidebar Record nav):
{
  background: theme.clay.primaryBg,
  boxShadow: theme.clay.primaryShadow,
  borderRadius: theme.radius['2xl'],  // or theme.radius.full for round
  color: '#fff',
  fontWeight: 600,
  '&:active': { boxShadow: theme.clay.pressedShadow, transform: 'scale(0.97)' },
}

// Danger / recording-active red clay:
{
  background: theme.clay.dangerBg,
  boxShadow: '6px 6px 14px rgba(220,38,38,0.28), -3px -3px 8px var(--clay-highlight), inset 2px 2px 6px var(--clay-highlight), inset -3px -3px 8px rgba(0,0,0,0.22)',
}
```

### 3. Flat — fallback only (non-card informational areas)

```typescript
// Only for inner sections of cards, not for top-level surfaces
{
  backgroundColor: theme.colors.muted,
  borderRadius: theme.radius.xl,
}
```

**❌ NEVER use `theme.colors.card` for card backgrounds** — it's a flat opaque
color that breaks the layered glass feel.

## Hover Rule: Always `@media (hover: hover)`

```typescript
// ❌ WRONG — fires on touch devices too
'&:hover': { transform: 'translateY(-2px)' },

// ✅ CORRECT — only fires on pointer devices
'@media (hover: hover)': {
  '&:hover': { transform: 'translateY(-2px)' },
},
```

## Available Theme Tokens

```typescript
// Colors (CSS variable references)
theme.colors.background       // var(--background)
theme.colors.foreground       // var(--foreground)
theme.colors.primary          // var(--primary)  — Deep Moss Green #3d6b4f
theme.colors.accent           // var(--accent)   — Amber #c17f4e
theme.colors.muted            // var(--muted)
theme.colors.mutedForeground  // var(--muted-foreground)
theme.colors.border           // var(--border)
theme.colors.destructive      // var(--destructive)

// Glass surface tokens
theme.glass.background        // var(--glass-bg)
theme.glass.border            // var(--glass-border)
theme.glass.blur              // 'blur(14px) saturate(1.4)'
theme.glass.shadow            // var(--glass-shadow)
theme.glass.inset             // var(--glass-inset)

// Clay surface tokens
theme.clay.primaryBg          // green gradient
theme.clay.primaryShadow      // 4-layer clay shadow
theme.clay.dangerBg           // red gradient
theme.clay.pressedShadow      // inverted clay (pressed state)

// Fonts
theme.fonts.sans              // DM Sans (body text)
theme.fonts.serif             // Playfair Display (headings, numbers)
theme.fonts.mono              // Geist Mono (code)

// Spacing (rem values)
theme.spacing[1]   // 0.25rem
theme.spacing[2]   // 0.5rem
theme.spacing[3]   // 0.75rem
theme.spacing[4]   // 1rem
theme.spacing[5]   // 1.25rem
theme.spacing[6]   // 1.5rem
theme.spacing[8]   // 2rem
theme.spacing[10]  // 2.5rem
theme.spacing[12]  // 3rem
theme.spacing[16]  // 4rem

// Radii
theme.radius.sm     // 0.5rem
theme.radius.md     // 0.625rem
theme.radius.lg     // 0.75rem
theme.radius.xl     // 1rem
theme.radius['2xl'] // 1.5rem — use for all cards
theme.radius['3xl'] // 2rem
theme.radius.full   // 9999px — pills, avatars

// Transitions
theme.transitions.fast      // 150ms ease
theme.transitions.normal    // 200ms ease
theme.transitions.slow      // 300ms ease
theme.transitions.verySlow  // 500ms ease

// Shadows
theme.shadows.sm
theme.shadows.md
theme.shadows.lg
```

## Responsive Design

```typescript
const Section = styled.section({
  padding: `${theme.spacing[8]} ${theme.spacing[4]}`,
  '@media (min-width: 768px)': {
    padding: `${theme.spacing[16]} ${theme.spacing[6]}`,
  },
})
```

Common breakpoints: `640px` (sm), `768px` (md), `1024px` (lg).

## Transient Props ($ prefix)

```typescript
// ✅ $ prefix prevents prop from forwarding to the DOM
const Box = styled('div', {
  shouldForwardProp: (p) => p !== '$isActive',
})<{ $isActive: boolean }>(({ $isActive }) => ({
  opacity: $isActive ? 1 : 0.5,
}))

<Box $isActive={true} />

// For multiple transient props, list them all in shouldForwardProp:
shouldForwardProp: (p) => !['$hero', '$featured', '$active'].includes(p as string)
```

## Keyframe Animations

```typescript
import { keyframes } from '@emotion/react'

// Entry animation — use on most cards/items
export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(0.75rem); }
  to   { opacity: 1; transform: translateY(0); }
`

// Grid items that scale in
export const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.97); }
  to   { opacity: 1; transform: scale(1); }
`

// Usage:
animation: `${fadeUp} 0.4s ease both`
animationDelay: `${index * 50}ms`  // stagger
willChange: 'transform, opacity'   // always add on animated elements
```

## CSS Variables (from src/app/globals.css)

Colors and glass/clay tokens defined as CSS custom properties for
light/dark mode support. Glass tokens:

```css
--glass-bg: rgba(252, 251, 249, 0.72)   /* light mode */
--glass-border: rgba(255, 255, 255, 0.72)
--glass-shadow: 0 2px 16px -2px rgba(61, 107, 79, 0.1)
--glass-inset: inset 0 1px 0 rgba(255, 255, 255, 0.65)
--clay-highlight: rgba(255, 255, 255, 0.22)
--clay-depth: rgba(0, 0, 0, 0.18)
```
