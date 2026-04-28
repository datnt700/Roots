---
description: Generate a conventional commit message for ROOTS changes (landing page or app)
name: commit-message
argument-hint: Describe what changed or paste the diff
agent: agent
model: Claude Sonnet 4.5
---

# Commit Message Prompt

Generate a conventional commit message for changes to ROOTS (GỐC).

## Format

```
<type>(<scope>): <subject>

[optional body]
```

## Types

| Type       | When to use                               |
| ---------- | ----------------------------------------- |
| `feat`     | New section, new feature, new translation |
| `fix`      | Bug fix                                   |
| `style`    | Styling changes (Emotion, theme tokens)   |
| `refactor` | Code restructure (no behavior change)     |
| `perf`     | Performance improvement                   |
| `chore`    | Dependency updates, config changes        |
| `docs`     | README or documentation update            |

## Scopes

### Landing Page

| Scope         | Files                                            |
| ------------- | ------------------------------------------------ |
| `hero`        | `src/components/hero-section.tsx`                |
| `navbar`      | `src/components/navbar.tsx`                      |
| `problem`     | `src/components/problem-section.tsx`             |
| `solution`    | `src/components/solution-section.tsx`            |
| `competitive` | `src/components/competitive-section.tsx`         |
| `tech`        | `src/components/tech-section.tsx`                |
| `cta`         | `src/components/final-cta-section.tsx`           |
| `footer`      | `src/components/footer.tsx`                      |

### App Pages

| Scope        | Files                                            |
| ------------ | ------------------------------------------------ |
| `dashboard`  | `src/app/app/page.tsx`, `src/app/app/page.styles.ts` |
| `timeline`   | `src/app/app/timeline/`                          |
| `studio`     | `src/app/app/studio/`                            |
| `feedback`   | `src/app/app/feedback/`                          |
| `parents`    | `src/app/app/parents/`                           |
| `record`     | `src/app/app/record/`                            |
| `parent`     | `src/app/parent/`                                |
| `auth`       | `src/auth.ts`, `src/app/login/`                  |
| `app-shell`  | `src/components/app-shell.tsx`                   |

### Shared

| Scope    | Files                                            |
| -------- | ------------------------------------------------ |
| `i18n`   | `messages/{locale}/*.json`                       |
| `theme`  | `src/lib/theme.ts`                               |
| `ui`     | `src/components/ui/*`                            |
| `db`     | `prisma/schema.prisma`, `src/lib/db.ts`          |
| `api`    | `src/app/api/*`                                  |
| `deps`   | `package.json`, `pnpm-lock.yaml`                 |
| `ci`     | `.github/workflows/*`                            |

## Examples

```
feat(hero): add animated subtitle with French translation
fix(navbar): correct mobile menu close on link click
style(competitive): align card heights using flex
chore(deps): update Next.js to 16.3.0
feat(i18n): add Vietnamese translations for tech section
feat(studio): add reflection editing with optimistic UI
fix(parent): bump font size to 1.125rem for elderly readability
style(dashboard): convert bento tiles to glass surface
```
