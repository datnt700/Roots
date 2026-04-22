## Description

<!-- Provide a brief description of the changes in this PR -->

## Type of Change

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New section / feature
- [ ] 📝 Copy / translation update
- [ ] 🎨 Style update (Emotion, theme tokens)
- [ ] ♻️ Code refactor (no functional changes)
- [ ] ⚡ Performance improvement
- [ ] 🔧 Build/configuration change

## Related Issues

Closes #

## Changes Made

-
-
-

## Screenshots (if applicable)

<!-- Add before/after screenshots for visual changes -->

## Checklist

- [ ] All user-visible text uses `t()` — no hardcoded strings
- [ ] All styled components use `theme.*` tokens — no raw CSS values
- [ ] New translation keys added to all 3 locales (en, vi, fr)
- [ ] Animated elements use `$isVisible` (transient `$` prefix)
- [ ] DB calls only in `app/api/` routes via `db` from `lib/db.ts`
- [ ] Schema changes include a migration (`npx prisma migrate dev`)
- [ ] `pnpm build` passes locally
- [ ] `pnpm lint` passes with no errors
- [ ] Commits follow conventional commits (`feat:`, `fix:`, `style:`, etc.)

## Testing

- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Tested language switcher (en/vi/fr)
- [ ] Tested light/dark mode (if applicable)
