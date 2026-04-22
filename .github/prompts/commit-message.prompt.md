---
description: Generate a conventional commit message for ROOTS landing page changes
name: commit-message
argument-hint: Describe what changed or paste the diff
agent: agent
model: Claude Sonnet 4.5
---

# Commit Message Prompt

Generate a conventional commit message for changes to the ROOTS (GỐC) landing page.

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

| Scope         | Files                                |
| ------------- | ------------------------------------ |
| `hero`        | `components/hero-section.tsx`        |
| `navbar`      | `components/navbar.tsx`              |
| `problem`     | `components/problem-section.tsx`     |
| `solution`    | `components/solution-section.tsx`    |
| `competitive` | `components/competitive-section.tsx` |
| `tech`        | `components/tech-section.tsx`        |
| `cta`         | `components/final-cta-section.tsx`   |
| `footer`      | `components/footer.tsx`              |
| `i18n`        | `lib/i18n.ts`                        |
| `theme`       | `lib/theme.ts`                       |
| `ui`          | `components/ui/*`                    |
| `deps`        | `package.json`, `pnpm-lock.yaml`     |
| `ci`          | `.github/workflows/*`                |

## Examples

```
feat(hero): add animated subtitle with French translation
fix(navbar): correct mobile menu close on link click
style(competitive): align card heights using flex
chore(deps): update Next.js to 16.3.0
feat(i18n): add Vietnamese translations for tech section
```
