---
description: Generate a short one-line conventional commit message
name: commit-short
argument-hint: Brief description of the change
agent: agent
model: Claude Sonnet 4.5
---

# Short Commit Message Prompt

Generate a concise one-line conventional commit message for ROOTS (GỐC).

## Format

`<type>(<scope>): <subject>`

## Rules

- Subject in lowercase imperative: "add", "fix", "update" (not "Added" or "Adds")
- Max 72 characters total
- Scope based on which section/file changed

## Quick Scope Reference

| Changed file / area                          | Scope         |
| -------------------------------------------- | ------------- |
| `src/components/hero-section.tsx`            | `hero`        |
| `src/components/navbar.tsx`                  | `navbar`      |
| `src/components/problem-section.tsx`         | `problem`     |
| `src/components/solution-section.tsx`        | `solution`    |
| `src/components/competitive-section.tsx`     | `competitive` |
| `src/components/tech-section.tsx`            | `tech`        |
| `src/components/final-cta-section.tsx`       | `cta`         |
| `src/components/footer.tsx`                  | `footer`      |
| `src/app/app/page.tsx`                       | `dashboard`   |
| `src/app/app/timeline/`                      | `timeline`    |
| `src/app/app/studio/`                        | `studio`      |
| `src/app/app/feedback/`                      | `feedback`    |
| `src/app/app/parents/`                       | `parents`     |
| `src/app/app/record/`                        | `record`      |
| `src/app/parent/`                            | `parent`      |
| `src/components/app-shell.tsx`               | `app-shell`   |
| `src/auth.ts`, `src/app/login/`              | `auth`        |
| `messages/{locale}/*.json`                   | `i18n`        |
| `src/lib/theme.ts`                           | `theme`       |
| `src/components/ui/**`                       | `ui`          |
| `src/app/api/`                               | `api`         |
| `prisma/schema.prisma`                       | `db`          |
| `package.json`                               | `deps`        |

## Examples

```
feat(hero): add scroll-triggered headline animation
fix(i18n): add missing fr translations for tech section
style(navbar): increase logo font size on desktop
chore(deps): bump @emotion/styled to 11.14.1
feat(studio): add reflection editing with autosave
fix(parent): bump font sizes to 1.125rem for readability
style(dashboard): convert bento cards to glass surface
```
