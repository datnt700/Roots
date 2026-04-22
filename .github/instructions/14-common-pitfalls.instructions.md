---
applyTo: '**/*'
---

# Common Pitfalls & Solutions

## Quick Reference

| Problem            | ❌ Wrong                          | ✅ Correct                               |
| ------------------ | --------------------------------- | ---------------------------------------- |
| Hardcoded strings  | `<h1>Our Story</h1>`              | `<h1>{t('hero.headline')}</h1>`          |
| Raw colors         | `color: '#3d6b4f'`                | `color: theme.colors.primary`            |
| Raw spacing        | `padding: '32px'`                 | `padding: theme.spacing[8]`              |
| Raw border-radius  | `borderRadius: '12px'`            | `borderRadius: theme.radius.lg`          |
| Missing locale     | Add key only to `en`              | Add key to `en`, `vi`, AND `fr`          |
| Emotion in root    | Emotion component in `layout.tsx` | Use `'use client'` in section components |
| Missing $ prefix   | `<Box isVisible={true} />`        | `<Box $isVisible={true} />`              |
| Backend thinking   | API route / server action         | Static data in `lib/i18n.ts`             |
| Heavy dependencies | `import _ from 'lodash'`          | Use native JS                            |

## Detailed Explanations

### Hardcoded User-Facing Strings

```typescript
// ❌ WRONG — breaks i18n, untranslatable
<h1>Preserve Your Family's Story</h1>

// ✅ CORRECT — translatable
const { t } = useI18n();
<h1>{t('hero.headlineLine1')}</h1>
```

### Missing Locale Keys

When adding a new translation key, you MUST add it to all 3 locales in `lib/i18n.ts`.

```typescript
// ❌ WRONG — only English added
const translations = {
  en: { newSection: { title: 'New Title' } },
  vi: {}, // missing
  fr: {}, // missing
}

// ✅ CORRECT — all 3 locales
const translations = {
  en: { newSection: { title: 'New Title' } },
  vi: { newSection: { title: 'Tiêu đề mới' } },
  fr: { newSection: { title: 'Nouveau titre' } },
}
```

### Emotion Hydration Mismatch

```typescript
// ❌ WRONG — Emotion component in root layout causes SSR/CSR mismatch
// app/layout.tsx
const StyledBody = styled.body({ ... });
export default function RootLayout({ children }) {
  return <html><StyledBody>{children}</StyledBody></html>;
}

// ✅ CORRECT — use className + CSS variables in root layout
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${playfair.variable}`}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
```

### Transient Props

```typescript
// ❌ WRONG — isVisible forwarded to DOM, React warning
const Card = styled.div<{ isVisible: boolean }>(({ isVisible }) => ({
  opacity: isVisible ? 1 : 0,
}));
<Card isVisible={true} />

// ✅ CORRECT — $ prefix prevents DOM forwarding
const Card = styled.div<{ $isVisible: boolean }>(({ $isVisible }) => ({
  opacity: $isVisible ? 1 : 0,
}));
<Card $isVisible={true} />
```

### Adding Backend Concepts

```typescript
// ❌ WRONG — this is a static landing page
// app/api/waitlist/route.ts — No API routes needed!

// ✅ CORRECT — point directly to external service
<form action="https://yourlist.mailchimp.com/..." method="POST">
  <input type="email" name="EMAIL" />
  <button type="submit">{t('cta.joinWaitlist')}</button>
</form>
```

## Stack Reminder

- **Framework**: Next.js 16 — no Turbopack needed for this project
- **Styling**: Emotion ONLY — no Tailwind, no SCSS, no CSS modules
- **i18n**: Custom `useI18n()` — no next-intl, no i18next
- **State**: React useState/useEffect — no Redux, no Zustand
- **Data**: Static strings in `lib/i18n.ts` — no database, no API
