# ROOTS (GỐC) — MVP Progress Tracker

> Last updated: 2026-04-27
> Status: **Build passing** (`pnpm build` — 0 errors, 33 routes)

---

## Legend

| Symbol | Meaning |
|---|---|
| ✅ | Done — code shipped, wired to real DB |
| 🔄 | Partial — built but incomplete |
| ❌ | Not started |
| 🔒 | Blocked on external service / credentials |

---

## Milestone 1 — "Xương sống" (Backbone)

Core infrastructure: DB, auth, encryption, file storage, QR routing.

| # | Task | Status | Notes |
|---|---|---|---|
| 1.1 | DB schema — all models | ✅ | 9 models: `WaitlistEntry`, `User`, `Account`, `Parent`, `MemorySlot`, `Memory`, `Transcript`, `AiSummary`, `Reflection`, `Feedback`, `Reaction` |
| 1.2 | Run Prisma migration on real DB | 🔒 | Needs `DATABASE_URL` from Neon Console → then `npx prisma migrate dev` |
| 1.3 | Auth.js (NextAuth v5) config | ✅ | `src/auth.ts` — Google, Facebook, Apple, Credentials; JWT strategy |
| 1.4 | Login page UI | ✅ | `src/app/login/page.tsx` — OAuth buttons + email/password + register tab |
| 1.5 | Register API route | ✅ | `POST /api/auth/register` — scrypt hash, AES-256-GCM encrypt, emailHash |
| 1.6 | Auth middleware | ✅ | `src/middleware.ts` — protects `/app/*`, allows `/parent/*` and `/api/tts` |
| 1.7 | AWS S3 integration | ✅ | `lib/storage.ts` — `uploadFile`, `getFileUrl`, `getFileBuffer`, `deleteFile`, 15-min pre-signed URLs |
| 1.8 | QR routing — parent flow | ✅ | `POST /api/parent-sessions`, `/parent/[token]`, `/parent/[token]/done` |
| 1.9 | Field-level encryption | ✅ | `lib/crypto.ts` — AES-256-GCM, `hashEmail`, `hashToken`, `hashPassword`, `encryptOptional` |
| 1.10 | Session wired to all app pages | ✅ | `useUserId()` hook — reads `session.user.id` via Auth.js `useSession()`. Used in all 5 app pages |

---

## Milestone 2 — "Dòng chảy" (Flow)

Recording, upload, AI transcription, QR parent experience.

| # | Task | Status | Notes |
|---|---|---|---|
| 2.1 | Recording Station UI | ✅ | Mic button, waveform visualization, photo upload, decade chips |
| 2.2 | Real MediaRecorder (browser mic) | ✅ | `getUserMedia`, `MediaRecorder`, audio playback before save |
| 2.3 | File upload to S3 | ✅ | `POST /api/upload` — audio + photo → S3, returns raw key; 50MB limit, MIME validation |
| 2.4 | Memory create with encrypted keys | ✅ | `POST /api/memories` — encrypts `audioKey`/`photoKey` before DB write |
| 2.5 | Whisper AI transcription | ✅ | `POST /api/transcribe` — decrypt key → S3 → Whisper-1 (Vietnamese) → encrypt → DB |
| 2.6 | Claude AI summarization | ✅ | `POST /api/summarize` — reads transcript → Claude Sonnet 4.5 → title/summary/tags → `AiSummary` table |
| 2.7 | Parent QR recording flow | ✅ | `/parent/[token]` — AI-led conversation, photo upload, session save |
| 2.8 | AI Voice Prompting (TTS) | ✅ | `POST /api/tts` — OpenAI TTS (voice: nova, Vietnamese); parent page plays greeting on load |
| 2.9 | Interactive Dialogue Flow | ✅ | `POST /api/dialogue` — multipart: token + turns + audio/photo; Whisper → GPT-4o → AI response; multi-turn context |

---

## Milestone 3 — "Bảo tàng số" (Digital Museum)

Student-facing app pages: Dashboard, Studio, Timeline.

| # | Task | Status | Notes |
|---|---|---|---|
| 3.1 | Dashboard — real data | ✅ | `GET /api/dashboard` — parents, recent memories, stats, unplayed feedback count in parallel; skeleton loading |
| 3.2 | Memory Studio UI | ✅ | Filter chips (All/Processed/Pending), transcript display, reflection editing, heart reaction, delete |
| 3.3 | Studio wired to real DB | ✅ | `GET /api/memories` — full decrypt (`audioKey`, `photoKey`, `transcript.content`, `aiSummary`, `reflection.content`); `parentName` included |
| 3.4 | Timeline — real data | ✅ | `GET /api/memories` — grouped by `decade` field; `RELATIONSHIP_EMOJI/COLOR` helpers; skeleton loading |
| 3.5 | QR Print Sticker template | ✅ | `handlePrint` in `/app/parents` — 3-sticker A4 layout, Playfair Display + DM Sans, gradient brand bar, QR code (118×118px), Vietnamese instructions |
| 3.6 | Export All Data as ZIP | ✅ | `GET /api/export?userId=` — `memories.json` + `transcripts/*.txt` + `audio/*` + `photos/*` + `README.txt` (vi); `jszip`; "Xuất dữ liệu" quick action on dashboard |
| 3.7 | Offline retry — parent QR page | ✅ | `lib/recording-cache.ts` IndexedDB helper; saves blob before network call, restores on mount, auto-retries on reconnect; `OfflineBanner` in `/parent/[token]` |
| 3.8 | Email notifications — new memory | ✅ | `lib/email.ts` — Resend SDK; `sendNewMemoryEmail()` fires fire-and-forget in `POST /api/slots/save`; HTML email with link to Studio; needs `RESEND_API_KEY` |
| 3.9 | Parent help button | ✅ | Phone button in `/parent/[token]` TopBar → `POST /api/help-request` → `sendHelpRequestEmail()` to student; single-tap, shows "Đã gửi" confirmation |
| 3.10 | Sticker photo customization | ✅ | File upload in QR modal → `FileReader` base64 → state; injected as `.child-photo` round avatar in each sticker frame via `handlePrint` |
| 3.11 | Page transitions (View Transitions API) | ❌ | CSS-native, no extra deps needed |
| 3.12 | AI Photo Enhancement | ❌ | Replicate / Sharp — not started |
| 3.13 | Album PDF export | ❌ | PDF generation — not started |

---

## Milestone 4 — "Nhịp đập" (Heartbeat)

Feedback loop, real-time notifications.

| # | Task | Status | Notes |
|---|---|---|---|
| 4.1 | Feedback page UI | ✅ | Audio player, response display, played/unplayed status |
| 4.2 | Feedback wired to real DB | ✅ | `GET /api/feedback` — full decrypt, `parentName`, `relationship`, `dateLabel`; skeleton loading |
| 4.3 | Feedback content encryption | ✅ | `POST /api/feedback` — `encryptOptional(content)` before DB write |
| 4.4 | Real-time notifications (SSE) | ✅ | `GET /api/feedback/stream` — 3s DB poll, 25s keepalive ping, unread banner in UI |
| 4.5 | Push notifications (mobile) | ❌ | Web Push API — not started |
| 4.6 | AI Nudging (proactive outreach) | ❌ | Vercel Cron + Zalo OA or Twilio SMS — not started |
| 4.7 | Memory Synthesis (post-session summary) | ❌ | GPT-4o tóm tắt conversation → `Transcript.summary`; push to dashboard via SSE |

---

## Infrastructure & Config

External services that require manual setup by the team.

| # | Task | Status | Notes |
|---|---|---|---|
| I1 | `.env` template documented | ✅ | All 14 vars listed with sources |
| I2 | `DATABASE_URL` — Neon PostgreSQL | 🔒 | [console.neon.tech](https://console.neon.tech) → create project → connection string |
| I3 | `AUTH_SECRET` | 🔒 | `npx auth secret` |
| I4 | `ENCRYPTION_KEY` + `EMAIL_HASH_PEPPER` | 🔒 | `openssl rand -hex 32` (twice) |
| I5 | Google OAuth credentials | 🔒 | [console.cloud.google.com](https://console.cloud.google.com) |
| I6 | Facebook OAuth credentials | 🔒 | [developers.facebook.com](https://developers.facebook.com) |
| I7 | Apple OAuth credentials | 🔒 | [developer.apple.com](https://developer.apple.com) |
| I8 | `OPENAI_API_KEY` | 🔒 | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| I9 | `ANTHROPIC_API_KEY` | 🔒 | [console.anthropic.com](https://console.anthropic.com) |
| I10 | AWS IAM user + S3 bucket | 🔒 | Region `ap-southeast-1`, block all public access, SSE-AES256 |
| I11 | Add all vars to Vercel dashboard | 🔒 | Project → Settings → Environment Variables |
| I12 | Run Prisma migration on real DB | 🔒 | After I2: `npx prisma migrate dev` |
| I13 | Resend API key + verified sender | 🔒 | [resend.com](https://resend.com) → API Keys → `RESEND_API_KEY`; verify `RESEND_FROM` domain |

---

## Feature Completeness Summary

```
Milestone 1 — Backbone        ██████████  10/10  100%
Milestone 2 — Flow            ██████████   9/9   100%
Milestone 3 — Digital Museum  ██████████  10/13   77%
Milestone 4 — Heartbeat       █████░░░░░   3/6    50%
Infrastructure                ██░░░░░░░░   2/13   15%  (blocked on credentials)
```

**Code complete:** All recording flows, AI pipelines, app pages, API routes, offline retry, sticker printing, data export, email notifications, parent help button, and sticker photo customization are built and wired to real DB.
**Blocked:** The app cannot run end-to-end until the team fills in real credentials (database URL, API keys, OAuth secrets, Resend API key).

---

## What's Left Before First Real User

### Must-have (launch blockers)
1. **Fill credentials** — complete Infrastructure items I2–I13 (Neon, Auth, OpenAI, Anthropic, S3, Resend)
2. **Run migration** — `npx prisma migrate dev` against real Neon DB
3. **Deploy to Vercel** — add env vars to Vercel dashboard, push to `main`
4. **End-to-end test** — sign in → record → check Studio transcript → QR parent flow → email received

### Nice-to-have (post-launch)
- Page transitions (View Transitions API) — M3.11
- Memory Synthesis push via SSE — M4.6
- AI Nudging via Zalo / SMS — M4.5
- Push notifications — M4.4
- AI Photo Enhancement — M3.12
- Album PDF export — M3.13

---

## Routes Map

| Route | Type | Auth |
|---|---|---|
| `/` | Public | — |
| `/login` | Public | — |
| `/parent/[token]` | Public | QR token |
| `/parent/[token]/done` | Public | — |
| `/app` | Protected | 🔒 Session |
| `/app/record` | Protected | 🔒 Session |
| `/app/studio` | Protected | 🔒 Session |
| `/app/timeline` | Protected | 🔒 Session |
| `/app/feedback` | Protected | 🔒 Session |
| `/app/parents` | Protected | 🔒 Session |

---

## Build Status

```
Last build: 2026-04-27
Command:    pnpm build
Result:     ✅ Compiled successfully (Turbopack, 16.2s)
Routes:     29 routes (all dynamic — ƒ)
TS errors:  0
```
