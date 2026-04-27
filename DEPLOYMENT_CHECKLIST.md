# Safe Deployment Checklist (Vercel + Database)

## 1. Local environment safety

- Ensure `.env.local` exists and contains only local values.
- Ensure `.env.local` is never committed (already gitignored).
- Ensure `.env` does not contain real credentials.

## 2. Database separation

- Development uses `DEV_DATABASE_URL` (local machine).
- Production uses `PROD_DATABASE_URL` (Vercel only).
- Confirm dev and prod point to different database names/instances.

## 3. Initialize schemas in the correct environment

- Initialize development DB:
  - `pnpm db:init:dev`
- Initialize production DB from a trusted environment:
  - `pnpm db:init:prod`
- Verify `waitlist` table exists in both environments.

## 4. Configure Vercel production variables

- Open Vercel -> Project -> Settings -> Environment Variables.
- Add `PROD_DATABASE_URL` for `Production`.
- Optional: add separate value for `Preview` if desired.
- Do not add `DEV_DATABASE_URL` in Vercel production.

## 5. Pre-deploy verification

- Run `pnpm lint`.
- Run `pnpm build`.
- Confirm no secrets are present in tracked files.

## 6. Post-deploy checks

- Trigger a test waitlist submission in production.
- Confirm new row is written only to production DB.
- Check app logs for database connection errors.

## 7. Secret hygiene

- If a credential was previously committed or shared, rotate it immediately.
- Replace old credentials in provider dashboards and Vercel env vars.
