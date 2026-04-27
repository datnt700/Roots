# ROOTS (GỐC) — Digital Family Heritage Museum

> The first digital museum for ancestral stories in Vietnam. Families separated by distance can preserve and share memories across generations — with the help of AI.

---

## What Is ROOTS?

ROOTS lets a child living abroad send a physical QR sticker to their parents or grandparents back home. The elder scans the sticker with their phone — no app install needed — and an AI assistant greets them by voice in Vietnamese, guides them through a natural conversation, and records their life stories. The child then receives a transcribed, AI-summarized memory in their personal digital museum.

**Core loop:**
1. Child creates a parent profile and generates a QR sticker
2. Sticker is printed and physically attached to a photo album page
3. Elder scans QR → AI greets them in Vietnamese → records voice story + optional photo
4. Child reviews transcript, AI summary, and tags in their Studio
5. Child sends a voice/text response → parent receives it next time they scan

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Emotion (`@emotion/react`, `@emotion/styled`) |
| Database | Neon PostgreSQL + Prisma ORM |
| Auth | Auth.js v5 — Google, Facebook, Apple, Credentials |
| AI — Transcription | OpenAI Whisper-1 |
| AI — Summarization | Anthropic Claude Sonnet 4.5 |
| AI — Dialogue | OpenAI GPT-4o |
| AI — Voice | OpenAI TTS (voice: nova) |
| File Storage | AWS S3 (SSE-AES256, private, pre-signed URLs) |
| i18n | next-intl — English, Vietnamese, French |
| Deployment | Vercel |
| Analytics | Vercel Analytics |

---

## Project Structure

```
prisma/
  schema.prisma           # DB schema — 9 models (see Data Models below)
  migrations/             # Migration history
src/
  auth.ts                 # Auth.js config — providers, JWT, session callbacks
  middleware.ts           # Edge middleware — protects /app/*, allows /parent/*
  app/
    layout.tsx            # Root layout — fonts, i18n, analytics, SessionProvider
    page.tsx              # Landing page (assembles all sections)
    globals.css           # CSS variable tokens (light/dark theme)
    api/                  # All API routes (see API Reference below)
    app/                  # Authenticated app pages (/app/*)
    login/                # Login/register page
    parent/[token]/       # Public QR flow for parents (no login needed)
  components/             # Landing sections + app shell + UI primitives
  hooks/
    use-user-id.ts        # useUserId() — reads userId from Auth.js session
    use-mobile.ts
    use-toast.ts
  lib/
    crypto.ts             # AES-256-GCM encrypt/decrypt + email/token/password hashing
    db.ts                 # Prisma singleton (always import from here)
    email.ts             # Transactional email via Resend — new-memory notification + help-request alert
    recording-cache.ts    # IndexedDB helper — offline-first blob cache for parent QR flow
    storage.ts            # S3 upload/read/delete + pre-signed URLs
    theme.ts              # Design tokens (colors, fonts, spacing, radius, shadows)
    logger.ts             # Structured logging (JSON in prod, colorized in dev)
  i18n/
    request.ts            # next-intl server config
messages/
  en/ vi/ fr/             # Translation files per language per section
```

---

## Data Models

| Model | Purpose | Sensitive Fields |
|---|---|---|
| `WaitlistEntry` | Landing page email capture | — |
| `User` | Authenticated student account | `email` [ENCRYPTED], `displayName` [ENCRYPTED], `passwordHash` [HASHED] |
| `Account` | OAuth provider links (Auth.js) | — |
| `Parent` | Elder profile (bố/mẹ/ông/bà) | `name` [ENCRYPTED] |
| `MemorySlot` | One QR sticker = one album page | `coverPhotoKey` [ENCRYPTED], `tokenHash` [HASHED] |
| `Memory` | A recorded story session | `audioKey` [ENCRYPTED], `photoKey` [ENCRYPTED] |
| `Transcript` | Whisper transcription output | `content` [ENCRYPTED] |
| `AiSummary` | Claude-generated title/tags | `title` [ENCRYPTED], `summary` [ENCRYPTED] |
| `Reflection` | Student's personal notes | `content` [ENCRYPTED] |
| `Feedback` | Student's response to parent | `content` [ENCRYPTED], `audioKey` [ENCRYPTED] |
| `Reaction` | Heart reaction (1 per memory) | — |

All [ENCRYPTED] fields use **AES-256-GCM** via `lib/crypto.ts` before DB write.
All [HASHED] fields use **SHA-256** or **scrypt** — never reversible.

---

## API Reference

| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `/api/waitlist` | POST | Public | Save landing page email |
| `/api/auth/*` | — | Public | Auth.js OAuth flow |
| `/api/auth/register` | POST | Public | Email/password registration |
| `/api/dashboard` | GET | Session | Aggregate stats + recent activity |
| `/api/parents` | GET, POST | Session | List / create parent profiles |
| `/api/memories` | GET, POST | Session | List / create memory recordings |
| `/api/upload` | POST | Session | Upload audio or photo to S3 (50MB limit) |
| `/api/transcribe` | POST | Session | Whisper transcription of a memory |
| `/api/summarize` | POST | Session | Claude summarization (title, summary, tags) |
| `/api/feedback` | GET, POST | Session | List / send feedback to parent |
| `/api/feedback/stream` | GET | Session | SSE stream — real-time new-feedback count |
| `/api/reactions` | POST | Session | Heart reaction (idempotent) |
| `/api/slots` | GET, POST, PATCH | Session | QR slot management |
| `/api/parent-sessions` | GET, POST | Session | Generate / validate QR tokens |
| `/api/dialogue` | POST | QR Token | AI-led conversation in parent QR flow |
| `/api/tts` | POST | Public | OpenAI TTS → Vietnamese audio stream |
| `/api/export` | GET | Session (userId param) | Download all user data as ZIP (memories.json + transcripts + audio + photos) |
| `/api/help-request` | POST | QR Token | Parent taps "Gọi cho con" → sends alert email to student via Resend |

---

## App Pages

| Route | Purpose |
|---|---|
| `/` | Landing page (Hero, Problem, Solution, Comparison, Tech, CTA) |
| `/login` | Sign in / register (OAuth + email/password) |
| `/app` | Dashboard — stats, recent memories, quick actions |
| `/app/record` | Record a new memory (audio + photo + parent selector) |
| `/app/studio` | Browse, review, and annotate memories + AI summaries |
| `/app/timeline` | Memories grouped chronologically by decade |
| `/app/feedback` | Feedback from parents — listen, mark played |
| `/app/parents` | Manage parent profiles, generate QR stickers, upload child photo for sticker, print A4 sticker sheet |
| `/parent/[token]` | Public parent recording flow (no login); IndexedDB offline retry; "Gọi cho con" help button |
| `/parent/[token]/done` | Post-recording thank-you screen |

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- A [Neon](https://neon.tech) PostgreSQL database
- API keys: OpenAI, Anthropic, AWS S3 (see `.env` for full list)

### Install & Run

```powershell
# Install dependencies
pnpm install

# Generate Prisma client
npx prisma generate

# Apply DB migrations (requires DATABASE_URL in .env)
npx prisma migrate dev

# Start dev server
pnpm dev
```

### Environment Variables

Copy `.env` to `.env.local` and fill in all values:

```env
# Database
DATABASE_URL=             # Neon PostgreSQL connection string

# Encryption (generate with: openssl rand -hex 32)
ENCRYPTION_KEY=           # 64-char hex — AES-256 key
EMAIL_HASH_PEPPER=        # 64-char hex — SHA-256 pepper

# Auth.js (generate with: npx auth secret)
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_FACEBOOK_ID=
AUTH_FACEBOOK_SECRET=
AUTH_APPLE_ID=
AUTH_APPLE_SECRET=

# AI
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-southeast-1
S3_BUCKET=
```

### Common Commands

```powershell
pnpm dev                          # Dev server (localhost:3000)
pnpm build                        # Production build
pnpm lint                         # ESLint
npx prisma studio                 # Visual DB browser
npx prisma migrate dev --name X   # Create + apply migration
npx prisma generate               # Regenerate Prisma client after schema change
```

---

## Security

- **Field-level encryption** — AES-256-GCM on all PII before DB write
- **Password hashing** — scrypt (N=32768, timing-safe comparison)
- **QR tokens** — only SHA-256 hash stored; raw token lives only in the QR URL
- **S3 access** — 15-minute pre-signed URLs; bucket is fully private (no public ACL)
- **GDPR** — right to erasure: `deleteFile()` cascades through DB
- **Edge auth** — middleware validates JWT without DB round-trip
- **Compliant with** Vietnam Decree 13/2023/NĐ-CP (personal data protection)

---

## i18n

Three languages are supported: **English (en)**, **Vietnamese (vi)**, **French (fr)**.

Translation files live in `messages/{en,vi,fr}/*.json`. All user-visible strings must come from `useTranslations()` — never hardcoded.

The app defaults to **Vietnamese** (`locale: 'vi'`). The AI systems (Whisper language hint, TTS voice, Claude system prompt) are all tuned for Vietnamese.

---

## Deployment

Deployed on **Vercel**. Push to `main` → auto-deploy.

```powershell
pnpm build        # Verify locally first
git add .
git commit -m "feat: your change"
git push origin main
```

Add all environment variables to **Vercel → Project → Settings → Environment Variables** before the first deploy.
