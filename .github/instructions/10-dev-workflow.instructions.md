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

## Prisma Commands

```powershell
# Generate Prisma client after schema changes
npx prisma generate

# Create and apply a migration (dev only)
npx prisma migrate dev --name <description>

# Apply existing migrations in production
npx prisma migrate deploy

# Open Prisma Studio (visual DB browser)
npx prisma studio

# Push schema without migration (prototyping)
npx prisma db push

# Introspect an existing DB
npx prisma db pull
```

> Always run `npx prisma generate` after editing `prisma/schema.prisma`.

## Adding a New Section

1. Create `components/{name}-section.tsx` with `'use client'` directive
2. Add all translation keys to all 3 locales in `lib/i18n.ts`
3. Import and add to `app/page.tsx`

## Adding a New DB Model

1. Add model to `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name <description>`
3. Create an API route in `app/api/{resource}/route.ts`
4. Import `db` from `@/lib/db` in the route

## Adding Dependencies

```powershell
# Add a dependency
pnpm add <package-name>

# Add a dev dependency
pnpm add -D <package-name>
```

No monorepo catalog — just regular pnpm. Version can be explicit in `package.json`.

## Environment Variables

```powershell
# .env — local development (gitignored)
DATABASE_URL="postgresql://..."

# .env.local — additional local overrides (also gitignored)
NEXT_PUBLIC_SOME_KEY="value"
```

Add all production env vars to Vercel dashboard under Project Settings → Environment Variables.

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
