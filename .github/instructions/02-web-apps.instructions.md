---
applyTo: '**/*.{ts,tsx}'
---

# Next.js 16 Web App Patterns

## App Router Conventions

All interactive sections use `'use client'`. Server components are only used
in `app/layout.tsx` and `app/page.tsx` (the page itself is a thin shell).

```typescript
// ✅ CORRECT — all section components are client components
'use client'

import { useEffect, useRef, useState } from 'react'
import { useI18n } from '@/components/i18n-provider'
```

## Root Layout Rules

```typescript
// app/layout.tsx — ONLY providers and font setup
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${playfair.variable}`}>
        <I18nProvider>{children}</I18nProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}
```

- ✅ Root layout = fonts + providers + analytics only
- ❌ Do NOT add Emotion components to root layout (hydration mismatch)
- ✅ `suppressHydrationWarning` on `<html>` if needed for theme toggle

## Scroll Animation Pattern

Use `IntersectionObserver` with a `isVisible` boolean state:

```typescript
const [isVisible, setIsVisible] = useState(false)
const ref = useRef<HTMLDivElement>(null)

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) setIsVisible(true)
    },
    { threshold: 0.1 },
  )
  if (ref.current) observer.observe(ref.current)
  return () => observer.disconnect()
}, [])

// Use in styled component
const Card = styled.div<{ isVisible: boolean; index: number }>(
  ({ isVisible, index }) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(2rem)',
    transition: `all ${theme.transitions.slow}`,
    transitionDelay: `${index * 100}ms`,
  }),
)
```

## No API Routes

This landing page has no API routes. For waitlist or contact forms, use
external services (Mailchimp, Resend, Typeform, etc.) directly from the client.

## TypeScript

- Strict mode is enabled
- Prefix unused vars/params with `_`
- Infer return types — do not annotate `: JSX.Element`
- Use `as unknown as T` sparingly for unavoidable type casts

## Image Optimization

Images are unoptimized (`images: { unoptimized: true }` in `next.config.mjs`).
Use `<img>` or Next.js `<Image>` for static assets in `public/`.

## Font Usage

```typescript
// Use CSS variables set in layout.tsx
fontFamily: theme.fonts.serif,  // Playfair Display
fontFamily: theme.fonts.sans,   // DM Sans
```
