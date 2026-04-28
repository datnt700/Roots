# Safe Deployment Checklist (Vercel + Neon PostgreSQL)

## 1. Local environment safety

- Ensure `.env.local` exists and contains only local values.
- Ensure `.env.local` is never committed (already gitignored).
- Ensure `.env` does not contain real credentials.

## 2. Environment variables

All environments use a single `DATABASE_URL` pointing to the correct Neon database.
Do NOT use `DEV_DATABASE_URL` or `PROD_DATABASE_URL` — the project uses one variable name.

Required variables in Vercel (Project → Settings → Environment Variables):

| Variable              | Description                                             |
| --------------------- | ------------------------------------------------------- |
| `DATABASE_URL`        | Neon PostgreSQL connection string (`sslmode=require`)   |
| `AUTH_SECRET`         | next-auth secret — `npx auth secret`                   |
| `NEXTAUTH_URL`        | Production URL (e.g. `https://roots.vn`)                |
| `ENCRYPTION_KEY`      | 64-char hex — `openssl rand -hex 32`                   |
| `EMAIL_HASH_PEPPER`   | 64-char hex — `openssl rand -hex 32`                   |
| `OPENAI_API_KEY`      | OpenAI — Whisper, GPT-4o, TTS                          |
| `ANTHROPIC_API_KEY`   | Anthropic — Claude Sonnet (summarization)              |
| `AWS_ACCESS_KEY_ID`   | AWS IAM user for S3                                     |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret                                        |
| `AWS_REGION`          | S3 bucket region (e.g. `ap-southeast-1`)               |
| `AWS_S3_BUCKET`       | S3 bucket name                                          |
| `RESEND_API_KEY`      | Resend email API key                                    |
| `RESEND_FROM`         | Verified sender address (e.g. `no-reply@roots.vn`)     |
| `GOOGLE_CLIENT_ID`    | Google OAuth client ID                                  |
| `GOOGLE_CLIENT_SECRET`| Google OAuth client secret                              |

## 3. Run database migrations on production

After configuring `DATABASE_URL` on Vercel (or locally with `DATABASE_URL` pointing to Neon):

```powershell
# Apply all pending migrations to the production database
npx prisma migrate deploy
```

Do NOT run `npx prisma migrate dev` against production — use `migrate deploy`.

## 4. Pre-deploy verification

- Run `pnpm lint`.
- Run `pnpm build`.
- Confirm no secrets are present in tracked files (`git diff HEAD`).
- Confirm `prisma/migrations/` contains all expected migrations.

## 5. Post-deploy checks

- Sign in with Google OAuth — confirm auth flow works end-to-end.
- Trigger a test waitlist submission on the landing page.
- Confirm new row is written to the Neon DB (check via `npx prisma studio` or Neon console).
- Check Vercel function logs for database connection errors.
- Test the parent QR flow: generate a QR sticker, scan, complete a voice session.
- Confirm email notifications fire (check Resend dashboard).

## 6. Secret hygiene

- If a credential was previously committed or shared, rotate it immediately.
- Replace old credentials in provider dashboards and Vercel env vars.
- Regenerate `ENCRYPTION_KEY` only if you re-encrypt all existing DB records —
  changing this key will make all existing encrypted data unreadable.
