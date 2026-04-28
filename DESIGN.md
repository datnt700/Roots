# ROOTS — Design System & Guidelines

> **Concept: Nostalgic Modernism**
> Warm, organic warmth of Vietnamese heritage materials (aged paper, lacquer, bamboo) met with sharp,
> contemporary interaction patterns. The UI should feel like a **curated museum** — calm, trustworthy,
> beautiful — not a startup app.

---

## 1. Color Palette

All colors are CSS custom properties defined in `src/app/globals.css`. **Never hardcode hex values** — always reference via `theme.colors.*`.

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--background` | `#f7f5f2` Heritage Cream | `#1a1816` | Page background |
| `--foreground` | `#2d2a26` Charcoal | `#f5f3f0` | Body text, headings |
| `--primary` | `#3d6b4f` Deep Moss Green | `#6b9b7a` | CTAs, active states, links |
| `--accent` | `#c17f4e` Amber | `#d4a574` | Highlights, badges, secondary accents |
| `--muted` | `#e5e1db` | `#363432` | Subtle backgrounds, hover states |
| `--muted-foreground` | `#6b6560` | `#a3a09c` | Secondary text, labels |
| `--card` | `#fcfbf9` | `#242220` | **Avoid for cards — use glass surfaces instead** |
| `--border` | `#ddd8d1` | `#3d3b39` | Dividers, input borders |
| `--destructive` | `#dc2626` | `#b91c1c` | Errors, delete, recording-active |

### Chart / data colors (reference only)
```
Green:   #3d6b4f   (primary)
Amber:   #c17f4e   (accent)
Sage:    #8b9a84
Cream:   #d4c8b8
Warm gray: #6b6560
```

---

## 2. Typography

Two fonts, used intentionally:

| Role | Font | Token | Usage |
|---|---|---|---|
| **Display / Titles** | Playfair Display (serif) | `theme.fonts.serif` | `h1`, page titles, stats values, card pull-quotes |
| **UI / Body** | DM Sans (sans) | `theme.fonts.sans` | All other text — labels, body, nav |
| **Code** | Geist Mono | `theme.fonts.mono` | Rarely needed |

### Type scale
```
Section labels:  0.75rem, uppercase, letter-spacing 0.08em, muted-foreground
Page titles:     1.5–1.75rem, fontFamily: serif, weight 700
Subheadings:     1.125rem, serif, weight 700
Body:            0.875–0.9375rem, line-height 1.5–1.6
Captions:        0.75rem, muted-foreground
Micro labels:    0.6875rem, uppercase, letter-spacing 0.07em, weight 600
```

---

## 3. Surface Types

There are **three** surface treatments. Each has a specific context.

---

### 3.1 Glass Surface — curator & child screens

Used on: dashboard cards, studio memory cards, timeline cards, feedback cards, sticky headers, sidebar.

```typescript
// Emotion CSS object — copy-paste pattern:
{
  backgroundColor: 'var(--glass-bg)',          // rgba(252,251,249, 0.72) light
  backdropFilter: 'blur(14px) saturate(1.4)',
  WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
  border: '1px solid var(--glass-border)',     // rgba(255,255,255, 0.72) light
  boxShadow: 'var(--glass-shadow), var(--glass-inset)',
  borderRadius: theme.radius['2xl'],           // 1.5rem — use '2xl' for cards
}
```

**Or use the theme tokens shorthand:**
```typescript
import { theme } from '@/lib/theme'
{
  backgroundColor: theme.glass.background,
  backdropFilter: theme.glass.blur,
  WebkitBackdropFilter: theme.glass.blur,
  border: `1px solid ${theme.glass.border}`,
  boxShadow: `${theme.glass.shadow}, ${theme.glass.inset}`,
}
```

**Hover interaction on clickable glass cards:**
```typescript
'@media (hover: hover)': {
  '&:hover': {
    boxShadow: `${theme.shadows.md}, var(--glass-inset)`,
    transform: 'translateY(-2px)',   // lift
  },
},
'&:active': { transform: 'scale(0.98)', opacity: 0.8 },
```

**Sticky glass headers** (timeline decade headers, tab bars):
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

---

### 3.2 Clay Surface — parent screens & primary action buttons

Used on: RecordButton, PlaybackBtn, Record nav button in sidebar, primary CTAs on parent-facing screens.

```typescript
// Primary (green) clay button:
{
  background: 'linear-gradient(145deg, oklch(0.52 0.12 155), oklch(0.38 0.12 155))',
  boxShadow: [
    '6px 6px 14px rgba(0,0,0,0.18)',          // outer depth
    '-3px -3px 8px var(--clay-highlight)',     // outer highlight
    'inset 2px 2px 6px var(--clay-highlight)', // inner highlight
    'inset -3px -3px 8px var(--clay-depth)',   // inner depth
  ].join(', '),
  borderRadius: theme.radius['2xl'],  // or full for round buttons
  color: '#fff',
  fontWeight: 600,
}

// Pressed state:
'&:active': {
  transform: 'scale(0.97)',
  boxShadow: [
    '2px 2px 6px rgba(0,0,0,0.14)',
    '-1px -1px 4px var(--clay-highlight)',
    'inset 4px 4px 10px var(--clay-depth)',
    'inset -2px -2px 6px var(--clay-highlight)',
  ].join(', '),
},

// Danger / recording-active (red):
{
  background: 'linear-gradient(145deg, #ef4444, #b91c1c)',
  boxShadow: [
    '6px 6px 14px rgba(220,38,38,0.28)',
    '-3px -3px 8px var(--clay-highlight)',
    'inset 2px 2px 6px var(--clay-highlight)',
    'inset -3px -3px 8px rgba(0,0,0,0.22)',
  ].join(', '),
}
```

**Or use theme tokens:**
```typescript
{
  background: theme.clay.primaryBg,
  boxShadow: theme.clay.primaryShadow,
  // pressed:
  '&:active': { boxShadow: theme.clay.pressedShadow },
}
```

---

### 3.3 Flat Surface — fallback only

```typescript
// Only use for non-interactive informational areas or inner sections of glass cards
{
  backgroundColor: theme.colors.muted,
  borderRadius: theme.radius.xl,
}
```

**Do NOT use `theme.colors.card` for cards** — it's a flat opaque color that breaks
the layered, airy feel. Use glass instead.

---

## 4. Layout Patterns

### Page wrapper
```typescript
export const Page = styled.div({
  padding: `${theme.spacing[4]} ${theme.spacing[4]} ${theme.spacing[8]}`,
  maxWidth: '56rem',   // dashboard, parents — wider
  // maxWidth: '48rem', // studio
  // maxWidth: '44rem', // feedback — narrow, focused
  // maxWidth: '40rem', // record — most focused
  width: '100%',
  margin: '0 auto',
  '@media (min-width: 768px)': {
    padding: `${theme.spacing[8]} ${theme.spacing[6]}`,
  },
})
```

### Bento grid
The dashboard uses an asymmetric bento grid. General rule:
- Mobile: 2-column grid
- Desktop: 4-column grid
- "Hero" or "featured" tile: `gridColumn: 'span 2'` — taller, slight gradient tint

```typescript
// Stats bento:
display: 'grid',
gridTemplateColumns: 'repeat(2, 1fr)',
gap: theme.spacing[3],
'@media (min-width: 640px)': { gridTemplateColumns: 'repeat(4, 1fr)' },

// Action bento (hero item spans full row on mobile):
// $featured tile: gridColumn: 'span 2', minHeight: '8rem'
// regular tile:   minHeight: '6.5rem'
```

### Section titles
```typescript
// UPPERCASE micro label above a section
fontSize: '0.875rem',
fontWeight: 600,
letterSpacing: '0.04em',
textTransform: 'uppercase',
color: theme.colors.mutedForeground,
```

---

## 5. Animation

All entry animations use `fadeUp` — defined once per file at the top:

```typescript
export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(0.75rem); }
  to   { opacity: 1; transform: translateY(0); }
`
// Usage: animation: `${fadeUp} 0.4s ease both`
// Stagger: animationDelay on nth child (0ms, 50ms, 100ms, ...)
```

For grid items or cards that scale in:
```typescript
export const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.97); }
  to   { opacity: 1; transform: scale(1); }
`
```

**Icon hover micro-animation** (nav items, sidebar links, action buttons):
```typescript
'& svg': {
  transition: `transform ${theme.transitions.fast}`,
},
'&:hover': {
  '& svg': { transform: 'translateY(-1.5px)' },  // subtle lift
},
```

**Always add `willChange: 'transform, opacity'`** to animated cards to hint compositing.

---

## 6. Component Patterns

### Page header (all app pages)
```tsx
<PageHeader>
  <PageTitle>Title in serif</PageTitle>      {/* fontFamily: serif */}
  <PageSubtitle>Context in muted</PageSubtitle>
</PageHeader>
```

### Section header with "see all"
```tsx
<SectionHeader>
  <SectionTitle>SECTION NAME</SectionTitle>  {/* uppercase, 0.875rem */}
  <SeeAll href="...">See all <ChevronRight /></SeeAll>
</SectionHeader>
```

### Tabs (Timeline, Studio)
Active tab has `color: primary` + `borderBottom: 2px solid primary`. Inactive: `color: mutedForeground`. Tab bar itself uses glass sticky or muted background.

### Filter chips
```typescript
// Active: primary-tinted bg + primary border
backgroundColor: $active ? 'oklch(0.88 0.06 155 / 0.12)' : 'transparent',
border: `1.5px solid ${$active ? theme.colors.primary : theme.colors.border}`,
color: $active ? theme.colors.primary : theme.colors.mutedForeground,
borderRadius: theme.radius.full,
```

### Badges / pills
```typescript
// Read badge: green tint
backgroundColor: 'oklch(0.88 0.06 155 / 0.12)',
color: theme.colors.primary,

// Unread / new: amber tint
backgroundColor: 'oklch(0.65 0.12 50 / 0.1)',
color: theme.colors.accent,

// Always:
borderRadius: theme.radius.full,
fontSize: '0.6875rem',
fontWeight: 600,
padding: '0.2rem 0.625rem',
```

### Avatar circles (parents, users)
```typescript
// Clay gradient avatar:
background: 'linear-gradient(145deg, oklch(0.52 0.12 155), oklch(0.40 0.12 155))',
color: '#fff',
borderRadius: theme.radius.full,
// Size: 2.5rem standard, 1.875rem compact (sidebar), 1.5rem micro

// Emoji/custom color avatar:
backgroundColor: $color,  // passed as prop
```

---

## 7. Interactive States

### Clickable cards (glass surface)
```typescript
cursor: 'pointer',
transition: `all ${theme.transitions.fast}`,
'@media (hover: hover)': {
  '&:hover': {
    boxShadow: `${theme.shadows.md}, var(--glass-inset)`,
    transform: 'translateY(-2px)',
  },
},
'&:active': { transform: 'scale(0.98)', opacity: 0.8 },
```

### Sidebar nav active state
Left accent bar via `::before` pseudo-element — **not** background fill:
```typescript
'&::before': {
  content: '""',
  position: 'absolute',
  left: '4px',
  top: '22%',
  height: '56%',
  width: '3px',
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.primary,
  opacity: $active ? 1 : 0,
  transform: $active ? 'scaleY(1)' : 'scaleY(0.3)',
  transition: `opacity 150ms, transform 300ms`,
},
```

### Haptic feedback (mobile)
On any significant action (start recording, stop recording, important button press):
```typescript
const haptic = (pattern: number | number[]) => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(pattern)
  }
}
// Start action: haptic(200)           — single long buzz
// Stop / confirm: haptic([60,40,60]) — double tap
```

---

## 8. Sidebar Design

The app shell sidebar (`src/components/app-shell.styles.ts`) follows these rules:

- **Glass background**: `var(--glass-bg)` + `backdrop-filter: blur(16px)`
- **Record** is always the **first** nav item, styled as a **Clay button** (most prominent)
- Below Record: thin `SidebarSeparator` + standard nav links
- Active link: left accent bar (3px, primary color) — no background fill
- Collapsed state: icons only, 4.5rem wide, text hidden via `[data-collapsed="true"] & > span { display: none }`
- Collapse button: small chevron button in logo area (right side)
- Bottom: user profile (avatar + name + role) + Settings + Logout

---

## 9. Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use `var(--glass-bg)` + backdrop-filter for all cards | Use `theme.colors.card` (flat opaque) for cards |
| Use `theme.fonts.serif` for titles and numeric values | Use sans-serif for display numbers |
| Use `theme.spacing[*]` for all spacing | Hardcode `px` values |
| Use `theme.radius['2xl']` (1.5rem) for cards | Use `border-radius: 8px` |
| Use CSS variables via `theme.colors.*` | Hardcode `#hex` values in styled components |
| Add `shouldForwardProp` when using `$` props on DOM elements | Let `$featured`, `$hero`, `$active` etc. reach the DOM |
| Wrap i18n strings in `t('key')` | Hardcode Vietnamese/English/French strings |
| Use `@media (hover: hover)` for hover effects | Apply hover on all devices (breaks touch) |
| Clay for **parent-facing** primary actions (RecordButton, sidebar Record) | Clay on secondary / passive UI elements |
| Glass for **curator / child** reading surfaces | Mixing clay and glass on the same card |

---

## 10. Tokens Quick Reference

```typescript
import { theme } from '@/lib/theme'

// Most-used tokens:
theme.colors.primary          // Deep Moss Green — #3d6b4f
theme.colors.accent           // Amber — #c17f4e
theme.colors.foreground       // Body text
theme.colors.mutedForeground  // Secondary text, labels
theme.colors.border           // Dividers
theme.colors.muted            // Subtle backgrounds

theme.fonts.serif             // Playfair Display — titles, numbers
theme.fonts.sans              // DM Sans — body text

theme.spacing[2]              // 0.5rem
theme.spacing[3]              // 0.75rem
theme.spacing[4]              // 1rem
theme.spacing[6]              // 1.5rem
theme.spacing[8]              // 2rem

theme.radius.xl               // 1rem — inputs, small cards
theme.radius['2xl']           // 1.5rem — cards, panels
theme.radius.full             // 9999px — pills, avatars, dots

theme.transitions.fast        // 150ms ease
theme.transitions.normal      // 300ms ease

theme.glass.background        // var(--glass-bg)
theme.glass.border            // var(--glass-border)
theme.glass.blur              // 'blur(14px) saturate(1.4)'
theme.glass.shadow            // var(--glass-shadow)
theme.glass.inset             // var(--glass-inset)

theme.clay.primaryBg          // green gradient
theme.clay.primaryShadow      // 4-layer clay shadow
theme.clay.dangerBg           // red gradient
theme.clay.pressedShadow      // inverted clay (pressed)
theme.clay.disabledBg         // flat desaturated gradient — button disabled state
theme.clay.disabledShadow     // minimal shadow — button disabled state
```

---

## 11. File Conventions

```
src/app/app/<page>/
  page.styles.ts   — All styled-components for this page (no separate .css files)
  page.tsx         — Component, imports from page.styles.ts

src/components/
  <component>.styles.ts  — Shared/layout components
  <component>.tsx

src/lib/theme.ts   — Single source of truth for all design tokens
src/app/globals.css — CSS custom properties (light + dark)
```

- **No Tailwind classes** in app pages
- **No inline `style={}` props** for anything more than a dynamic color value
- All animated elements: `willChange: 'transform, opacity'` on the styled component
- New pages **must** follow the glass surface pattern for cards
