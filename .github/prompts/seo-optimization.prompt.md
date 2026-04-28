---
description: Optimize SEO and metadata for the ROOTS landing page
name: seo-optimization
argument-hint: What to optimize (meta tags, OG images, structured data, etc.)
agent: agent
model: Claude Sonnet 4.5
tools: ['search']
---

# SEO Optimization Prompt

Optimize SEO for the ROOTS (GỐC) landing page.

## Context Files

- #file:../src/app/layout.tsx - Current metadata
- `messages/{locale}/*.json` — Translation strings (used in meta descriptions)

## Current Setup

- **Framework**: Next.js 16 App Router
- **Metadata**: Defined in `src/app/layout.tsx` via `export const metadata`
- **URL**: Production Vercel deployment
- **Audience**: Vietnamese families + diaspora (en/vi/fr)

## SEO Checklist

### Metadata (`src/app/layout.tsx`)

- [ ] `title` — brand name + value prop (< 60 chars)
- [ ] `description` — compelling, keyword-rich (120–160 chars)
- [ ] `keywords` — relevant Vietnamese heritage / genealogy terms
- [ ] `openGraph` — title, description, image, url, type
- [ ] `twitter` — card, title, description, image
- [ ] `canonical` — production URL
- [ ] `robots` — index, follow

### Open Graph Image

Create a static OG image in `public/og-image.jpg` (1200×630px).

### Structured Data

Add JSON-LD to `app/layout.tsx` for `WebSite` or `Organization`:

```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ROOTS (GỐC)',
  url: 'https://roots.vn',
  description: 'Digital museum for family heritage in Vietnam',
  inLanguage: ['en', 'vi', 'fr'],
}
```

### Performance (Core Web Vitals)

- [ ] LCP < 2.5s — hero image preloaded
- [ ] CLS < 0.1 — fixed dimensions on images
- [ ] FID/INP — no heavy JS on initial load

### Meta Template

```typescript
export const metadata: Metadata = {
  title: 'ROOTS (GỐC) — Digital Museum for Family Heritage',
  description:
    'Preserve the voices, memories, and stories of your ancestors. The first digital family museum in Vietnam.',
  keywords: [
    'gia phả',
    'lịch sử gia đình',
    'digital heritage',
    'Vietnam genealogy',
  ],
  openGraph: {
    title: 'ROOTS (GỐC) — Digital Museum for Family Heritage',
    description:
      'Preserve the voices, memories, and stories of your ancestors.',
    url: 'https://roots.vn',
    siteName: 'ROOTS (GỐC)',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ROOTS (GỐC)',
    description: 'The first digital museum for family heritage in Vietnam.',
    images: ['/og-image.jpg'],
  },
}
```
