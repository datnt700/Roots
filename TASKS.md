# ROOTS (GỐC) — Task Tracker

> Last updated: 2026-04-27
> Status legend: ✅ Done · 🔄 Partial · ❌ Not started · 🚧 In progress · 🔒 Blocked on credentials

---

## 🙋 Your Personal Checklist (things only YOU can do)

Do these in order — each unlocks the next.

### Step 1 — Database

- [ ] Go to [console.neon.tech](https://console.neon.tech) → sign up / log in
- [ ] Create a new project (pick region closest to Vietnam: `aws-ap-southeast-1`)
- [ ] Go to **Connection Details** → copy the `postgresql://...` string
- [ ] Paste it as `DATABASE_URL` in `.env` and `.env.local`
- [ ] Run in terminal: `npx prisma migrate dev --name add-account-model`

### Step 2 — Encryption keys (run in terminal, copy output)

- [ ] `npx auth secret` → paste result as `AUTH_SECRET` in `.env.local`
- [ ] `openssl rand -hex 32` → paste as `ENCRYPTION_KEY`
- [ ] `openssl rand -hex 32` (again) → paste as `EMAIL_HASH_PEPPER`

### Step 3 — Google OAuth

- [ ] Go to [console.cloud.google.com](https://console.cloud.google.com) → create project "Roots"
- [ ] **APIs & Services → Credentials → Create OAuth 2.0 Client ID** (Web application)
- [ ] Add authorized redirect: `http://localhost:3000/api/auth/callback/google`
- [ ] Add authorized redirect: `https://yourdomain.com/api/auth/callback/google`
- [ ] Copy **Client ID** → `AUTH_GOOGLE_ID`, **Client Secret** → `AUTH_GOOGLE_SECRET`

### Step 4 — Facebook OAuth

- [ ] Go to [developers.facebook.com](https://developers.facebook.com) → My Apps → Create App
- [ ] App type: **Consumer** → add **Facebook Login** product
- [ ] Valid OAuth Redirect URI: `https://yourdomain.com/api/auth/callback/facebook`
- [ ] Copy **App ID** → `AUTH_FACEBOOK_ID`, **App Secret** → `AUTH_FACEBOOK_SECRET`

### Step 5 — Apple OAuth

- [ ] Go to [developer.apple.com](https://developer.apple.com) → Certificates, Identifiers & Profiles
- [ ] Create a **Services ID** (e.g. `com.yourapp.web`) → enable Sign In with Apple
- [ ] Add Return URL: `https://yourdomain.com/api/auth/callback/apple`
- [ ] Create a **Key** with Sign In with Apple enabled → download `.p8` file
- [ ] In PowerShell: `[Convert]::ToBase64String([IO.File]::ReadAllBytes("AuthKey_XXX.p8"))` → paste as `AUTH_APPLE_SECRET`
- [ ] `AUTH_APPLE_ID` = your Services ID (e.g. `com.yourapp.web`)

### Step 6 — OpenAI

- [ ] Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys) → Create new secret key
- [ ] Paste as `OPENAI_API_KEY` in `.env.local`
- [ ] Add billing credits (Whisper costs ~$0.006/min)

### Step 7 — AWS S3

- [ ] Go to [console.aws.amazon.com](https://console.aws.amazon.com) → S3 → **Create bucket**
  - Region: `ap-southeast-1`
  - Block all public access: ✅ ON
  - Default encryption: **SSE-S3 (AES-256)** ✅ ON
- [ ] Go to **IAM → Users → Create user** (e.g. `roots-app`)
- [ ] Attach this inline policy (replace `YOUR_BUCKET`):
  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
        "Resource": "arn:aws:s3:::YOUR_BUCKET/*"
      }
    ]
  }
  ```
- [ ] **Create access key** → paste `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY`
- [ ] Paste bucket name as `S3_BUCKET`

### Step 8 — Vercel deployment

- [ ] Go to [vercel.com](https://vercel.com) → project → **Settings → Environment Variables**
- [ ] Add every variable from `.env.local` (all 14 vars) to Vercel
- [ ] Push to `main` → verify build passes

### Step 9 — Test end-to-end locally

- [ ] `pnpm dev` → open `http://localhost:3000`
- [ ] Sign in with Google → confirm redirect to `/app`
- [ ] Go to Record → record audio → save → check Studio for transcript (takes ~10s)
- [ ] Check `/api/feedback/stream` shows SSE connection in Network tab

---

## Milestone 1 — "Xương sống" (Backbone)

| #   | Task                           | Status | Notes                                                                                                          |
| --- | ------------------------------ | ------ | -------------------------------------------------------------------------------------------------------------- |
| 1.1 | Neon DB schema (all models)    | ✅     | 9 models: WaitlistEntry, User, Parent, ParentSession, Memory, Transcript, Reflection, Feedback, Album, Account |
| 1.2 | Run Prisma migration           | ❌     | `npx prisma migrate dev --name add-account-model` — needs real `DATABASE_URL`                                  |
| 1.3 | Auth.js (NextAuth v5) — config | ✅     | `src/auth.ts` — Google, Facebook, Apple, Credentials; JWT strategy                                             |
| 1.4 | Auth.js — login page UI        | ✅     | `src/app/login/page.tsx` — OAuth buttons + email/password + register tab                                       |
| 1.5 | Auth.js — register API route   | ✅     | `POST /api/auth/register` — scrypt hash, AES-256-GCM encrypt, emailHash                                        |
| 1.6 | Auth.js — middleware           | ✅     | `src/middleware.ts` — protects `/app/*`, allows `/parent/*` and `/api/tts`                                     |
| 1.7 | AWS S3 — real integration      | ✅     | `lib/storage.ts` — uploadFile, getFileUrl, getFileBuffer, deleteFile; 15-min pre-signed URLs                   |
| 1.8 | QR routing — parent flow       | ✅     | `POST /api/parent-sessions`, `/parent/[token]`, `/parent/[token]/done`                                         |
| 1.9 | Field-level encryption         | ✅     | `lib/crypto.ts` — AES-256-GCM, hashEmail, hashToken, hashPassword, encryptOptional                             |
| 1.10 | Session wired to all app pages | ✅     | `useUserId()` hook — reads `session.user.id` via Auth.js `useSession()`. Used in all 5 app pages              |

---

## Milestone 2 — "Dòng chảy" (Flow)

| #   | Task                              | Status | Notes                                                                               |
| --- | --------------------------------- | ------ | ----------------------------------------------------------------------------------- |
| 2.1 | Recording Station UI              | ✅     | Claymorphism mic button, waveform, photo upload, decade chips                       |
| 2.2 | Real MediaRecorder (browser mic)  | ✅     | `src/app/app/record/page.tsx` — getUserMedia, MediaRecorder, audio playback         |
| 2.3 | File upload to S3                 | ✅     | `POST /api/upload` — audio + photo → S3, returns raw key                            |
| 2.4 | Memory create with encrypted keys | ✅     | `POST /api/memories` — encrypts audioKey/photoKey before DB write                   |
| 2.5 | Whisper AI transcription          | ✅     | `POST /api/transcribe` — decrypt key → S3 → Whisper-1 (Vietnamese) → encrypt → DB   |
| 2.6 | Claude AI summarization           | ✅     | `POST /api/summarize` — transcript → Claude Sonnet 4.5 → title/summary/tags → `AiSummary` table |
| 2.7 | Parent QR recording flow          | ✅     | `/parent/[token]` — AI-led conversation, photo upload, session save                 |
| 2.8 | AI Voice Prompting (TTS)          | ✅     | `POST /api/tts` — OpenAI TTS (voice: nova, Vietnamese); parent page plays greeting on load |
| 2.9 | Interactive Dialogue Flow         | ✅     | `POST /api/dialogue` — multipart: token + turns + audio/photo; Whisper → GPT-4o → AI response; multi-turn context |

---

## Milestone 3 — "Bảo tàng số" (Digital Museum)

| #   | Task                                    | Status | Notes                                                            |
| --- | --------------------------------------- | ------ | ---------------------------------------------------------------- |
| 3.1 | Dashboard — real data                   | ✅     | `GET /api/dashboard` — parents, recent memories, stats, unplayed feedback in parallel; skeleton loading |
| 3.2 | Memory Studio UI                        | ✅     | Filter chips (All/Processed/Pending), transcript, reflection editing, heart reaction, delete |
| 3.3 | Studio wired to real DB                 | ✅     | `GET /api/memories` — full decrypt (audioKey, photoKey, transcript, aiSummary, reflection); parentName included |
| 3.4 | Timeline — real data                    | ✅     | `GET /api/memories` — grouped by `decade` field; RELATIONSHIP_EMOJI/COLOR helpers; skeleton loading |
| 3.5 | QR Print Sticker template               | ✅     | `handlePrint` in parents page — 3-sticker A4 layout, Playfair Display + DM Sans, gradient brand bar, Vietnamese instructions |
| 3.6 | Export All Data as ZIP                  | ✅     | `GET /api/export?userId=` — memories.json + transcripts/*.txt + audio/* + photos/*; `jszip`; "Xuất dữ liệu" button on dashboard |
| 3.7 | Offline retry — parent QR page         | ✅     | `lib/recording-cache.ts` — IndexedDB cache; auto-save before network call, auto-retry on reconnect, OfflineBanner in `/parent/[token]` |
| 3.8 | Email notifications — new memory        | ✅     | `lib/email.ts` (Resend SDK); `sendNewMemoryEmail` fired fire-and-forget in `POST /api/slots/save` after memory create; needs `RESEND_API_KEY` |
| 3.9 | Parent help button                      | ✅     | Phone button in `/parent/[token]` TopBar → `POST /api/help-request` → `sendHelpRequestEmail` to student; single-tap, shows "Đã gửi" after |
| 3.10 | Sticker photo customization            | ✅     | File upload in QR modal → base64 data URL → injected as round avatar `<img class="child-photo">` in each sticker frame in `handlePrint` |
| 3.11 | Page transitions (View Transitions API) | ❌     | CSS-native, no extra deps needed                                 |
| 3.12 | AI Photo Enhancement                    | ❌     | Replicate / Sharp — not started                                  |
| 3.13 | Album PDF export                        | ❌     | PDF generation — not started                                     |

---

## Milestone 4 — "Nhịp đập" (Heartbeat)

| #   | Task                          | Status | Notes                                                            |
| --- | ----------------------------- | ------ | ---------------------------------------------------------------- |
| 4.1 | Feedback page UI + real data  | ✅     | `GET /api/feedback` — full decrypt, parentName, relationship, dateLabel; skeleton loading; audio player |
| 4.2 | Feedback content encryption   | ✅     | `POST /api/feedback` — encryptOptional(content) before DB write  |
| 4.3 | Real-time notifications (SSE) | ✅     | `GET /api/feedback/stream` — 3s DB poll, 25s keepalive ping, unread banner in UI |
| 4.4 | Push notifications (mobile)   | ❌     | Web Push API — not started                                       |
| 4.5 | AI Nudging — proactive outreach | ❌   | Vercel Cron + Zalo OA or Twilio SMS — personalised daily reminders; AI references parent name + specific memory |
| 4.6 | Memory Synthesis              | ❌     | GPT-4o post-session tóm tắt → `Transcript.summary`; push to dashboard via SSE; no need to listen to full audio |

---

## Infrastructure & Config

| #   | Task                                        | Status | Notes                                       |
| --- | ------------------------------------------- | ------ | ------------------------------------------- |
| I1  | `.env` + `.env.local` templates             | ✅     | All 14 vars documented with sources         |
| I2  | Fill real DATABASE_URL                      | 🔒     | Neon Console → Connection Details           |
| I3  | Generate AUTH_SECRET                        | 🔒     | `npx auth secret`                           |
| I4  | Generate ENCRYPTION_KEY + EMAIL_HASH_PEPPER | 🔒     | `openssl rand -hex 32` (×2)                 |
| I5  | Google OAuth credentials                    | 🔒     | console.cloud.google.com                    |
| I6  | Facebook OAuth credentials                  | 🔒     | developers.facebook.com                     |
| I7  | Apple OAuth credentials                     | 🔒     | developer.apple.com                         |
| I8  | OpenAI API key                              | 🔒     | platform.openai.com/api-keys — used for Whisper, GPT-4o, TTS    |
| I9  | Anthropic API key                           | 🔒     | console.anthropic.com — used for Claude Sonnet (summarization)   |
| I10 | AWS IAM user + S3 bucket                    | 🔒     | Region `ap-southeast-1`, SSE-AES256, block all public access, IAM policy |
| I11 | Add all vars to Vercel dashboard            | 🔒     | Project Settings → Environment Variables    |
| I12 | Run Prisma migration on real DB             | 🔒     | After I2: `npx prisma migrate dev`          |
| I13 | Resend API key + verified sender domain     | 🔒     | [resend.com](https://resend.com) → API Keys → `RESEND_API_KEY`; verify sender domain for `RESEND_FROM` |

---

## Immediate Next Steps (in order)

1. **Fill credentials** — do I2→I13 above (database first, then auth, then API keys)
2. **Run migration** — `npx prisma migrate dev` — requires `DATABASE_URL`
3. **Test end-to-end** — `pnpm dev`, sign in with Google, record audio, check Studio transcript
4. **Set `RESEND_API_KEY`** — add to `.env.local` + Vercel; verify sender domain for `RESEND_FROM`
5. **Page transitions (3.11)** — View Transitions API in `app/layout.tsx` (CSS, no extra deps)
6. **Push notifications (4.4)** — Web Push API for mobile new-memory alerts
7. **AI Nudging (4.5)** — Vercel Cron + Zalo OA or Twilio SMS — personalised daily reminders
8. **Memory Synthesis (4.6)** — GPT-4o post-session summary → `Transcript.summary`; push to dashboard via SSE
9. **AI Photo Enhancement (3.12)** — Replicate / Sharp — restore and upscale scanned family photos
10. **Album PDF export (3.13)** — PDF generation from memories for physical printing

---

## Routes Map

| Route                              | Type             | Auth                 |
| ---------------------------------- | ---------------- | -------------------- |
| `/`                                | Static (landing) | Public               |
| `/login`                           | Static           | Public               |
| `/app`                             | Static           | 🔒 Session           |
| `/app/record`                      | Static           | 🔒 Session           |
| `/app/studio`                      | Static           | 🔒 Session           |
| `/app/timeline`                    | Static           | 🔒 Session           |
| `/app/feedback`                    | Static           | 🔒 Session           |
| `/parent/[token]`                  | Dynamic          | Public (token-gated) |
| `/parent/[token]/done`             | Dynamic          | Public               |
| `POST /api/waitlist`               | API              | Public               |
| `POST /api/auth/register`          | API              | Public               |
| `GET/POST /api/auth/[...nextauth]` | API              | Public               |
| `GET/POST /api/memories`           | API              | 🔒                   |
| `GET/POST /api/feedback`           | API              | 🔒                   |
| `GET /api/feedback/stream`         | SSE              | 🔒                   |
| `POST /api/upload`                 | API              | 🔒                   |
| `POST /api/transcribe`             | API              | 🔒                   |
| `GET/POST /api/parents`            | API              | 🔒                   |
| `GET/POST /api/parent-sessions`    | API              | 🔒                   |
| `POST /api/tts`                    | API (stream)     | Public (token-gated) |
| `POST /api/dialogue`               | API (stream SSE) | Public (token-gated) |
| `GET /api/export`                  | API              | Session (userId param) |
| `GET /api/reactions`               | API              | 🔒                     |
| `GET/POST/PATCH /api/slots`        | API              | 🔒                     |
| `POST /api/summarize`              | API              | 🔒                     |
