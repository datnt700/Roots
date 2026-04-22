---
applyTo: '**/*'
---

# Development Workflow

## Commands

```powershell
# Install dependencies
pnpm install

# Start dev server (localhost:3000)
pnpm dev

# Build for production
pnpm build

# Run linting
pnpm lint

# Start production server (after build)
pnpm start
```

## Adding a New Section

1. Create `components/{name}-section.tsx` with `'use client'` directive
2. Add all translation keys to all 3 locales in `lib/i18n.ts`
3. Import and add to `app/page.tsx`

## Adding Dependencies

```powershell
# Add a dependency
pnpm add <package-name>

# Add a dev dependency
pnpm add -D <package-name>
```

No monorepo catalog — just regular pnpm. Version can be explicit in `package.json`.

## Git Workflow (Conventional Commits)

```powershell
git checkout -b feat/your-feature
git add .
git commit -m "feat: add pricing section"
git push origin feat/your-feature
```

Commit types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `chore`

Examples:

- `feat: add testimonials section`
- `fix: correct French translation for hero`
- `style: align competitive section cards`
- `chore: update Next.js to 16.3`

## Environment Variables

Local dev: create `.env.local` at project root.

```
NEXT_PUBLIC_WAITLIST_URL=https://your-form.com
```

Production: set in Vercel dashboard.

## Deployment

Deployed on **Vercel**. Push to `main` → automatic production deploy.

```powershell
# Test build locally before pushing
pnpm build

# Check for lint errors
pnpm lint
```

## TypeScript Best Practices

```typescript
// ✅ Infer return types
export const Component = ({ children }: Props) => <div>{children}</div>;

// ✅ Prefix unused with _
export const Component = ({ value, variant: _variant }: Props) => <div>{value}</div>;

// ✅ Omit unused error params
try { new URL(input); } catch { return null; }
```
