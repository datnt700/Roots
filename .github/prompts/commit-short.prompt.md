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

| Changed file                         | Scope         |
| ------------------------------------ | ------------- |
| `components/hero-section.tsx`        | `hero`        |
| `components/navbar.tsx`              | `navbar`      |
| `components/problem-section.tsx`     | `problem`     |
| `components/solution-section.tsx`    | `solution`    |
| `components/competitive-section.tsx` | `competitive` |
| `components/tech-section.tsx`        | `tech`        |
| `components/final-cta-section.tsx`   | `cta`         |
| `components/footer.tsx`              | `footer`      |
| `lib/i18n.ts`                        | `i18n`        |
| `lib/theme.ts`                       | `theme`       |
| `components/ui/**`                   | `ui`          |
| `package.json`                       | `deps`        |

## Examples

```
feat(hero): add scroll-triggered headline animation
fix(i18n): add missing fr translations for tech section
style(navbar): increase logo font size on desktop
chore(deps): bump @emotion/styled to 11.14.1
```
