# YTShortsPro

> **The only YouTube Shorts platform that combines professional-grade video production with real-time algorithmic intelligence.** Strategy → Creation → Audit → Publish — in under 10 minutes.

[![TypeScript](https://img.shields.io/badge/TypeScript-98.3%25-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Remotion](https://img.shields.io/badge/Remotion-video%20rendering-blue)](https://remotion.dev/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## What is YTShortsPro?

YouTube Shorts is not an editing problem — it's a distribution problem. Thousands of well-produced videos get zero views because creators optimise for aesthetics instead of the algorithm.

YTShortsPro closes the gap between *what to make* and *how to make it perform*. It is a full-stack SaaS application with:

- **AI Production Suite** — Magic Clips, Dynamic Captions, AI Avatar Studio, Auto B-Roll
- **Algorithmic Intelligence** — Channel Trust Score, Viral Predictor, Niche Alignment Engine, Shadowban Detector
- **Programmatic Video Rendering** — Remotion Lambda-powered composition pipeline (< 60s GPU export)
- **Multi-tenant SaaS** — Four-tier subscription model with Stripe billing, plan-gated features, and AI credit metering

---

## Core User Journey

```
Step 1  Strategy   →  Review Trust Score, check niche trends
Step 2  Ingest     →  Upload / paste URL / generate AI Avatar
Step 3  Edit       →  Apply preset, captions auto-render, B-roll injected
Step 4  Audit      →  Satura Scan: Hook strength, Niche alignment, Shadowban check
Step 5  Deploy     →  One-click publish with AI-optimised metadata
```

**Target: concept → published in ≤ 10 minutes** (down from a ~240-minute manual baseline)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS + custom design tokens |
| Video Rendering | **Remotion** (compositions, captions, B-roll, avatar layers, audio sync) |
| ORM | Prisma (PostgreSQL) |
| Auth | NextAuth.js (OAuth + session management) |
| Payments | Stripe (subscriptions, upsells, invoices) |
| AI / LLM | GPT-4o / Claude (transcript analysis, Viral Predictor, Niche Alignment) |
| Transcription | Whisper API (captions + Magic Clips segmentation) |
| Video Delivery | Mux |
| Asset Storage | Cloudflare R2 (signed uploads) |
| Background Jobs | Inngest (render queue, cron jobs) |
| State Management | Zustand (editor, audio, upload, UI stores) |
| Server State | TanStack Query |
| Animations | Framer Motion |
| Charts | Recharts |

---

## Architecture

```
shorts_pro/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Login, register, OAuth callback
│   │   ├── (dashboard)/         # Full SaaS dashboard shell
│   │   │   ├── dashboard/       # Trust Score + channel overview
│   │   │   ├── projects/        # Video management (drafts, released, scheduled)
│   │   │   │   └── [projectId]/ # Editor, captions, audio, audit, publish
│   │   │   ├── magic-clips/     # URL → AI clip extraction
│   │   │   ├── avatar-studio/   # Script → AI talking head video
│   │   │   ├── analytics/       # Trust Score history + niche trends
│   │   │   ├── channels/        # Multi-channel management
│   │   │   └── settings/        # Billing, team, account
│   │   └── api/                 # Next.js API routes
│   │       ├── projects/        # CRUD + render trigger
│   │       ├── transcribe/      # Whisper transcription
│   │       ├── magic-clips/     # Clip extraction pipeline
│   │       ├── avatar/          # Avatar generation queue
│   │       ├── audit/           # Satura Scan (full algorithmic audit)
│   │       ├── publish/         # YouTube Data API v3 publish
│   │       ├── trust-score/     # Channel health computation
│   │       ├── viral-predictor/ # 1–100 score per video
│   │       ├── niche-alignment/ # Transcript vs channel history check
│   │       ├── audio/           # Upload, library, waveform generation
│   │       ├── cron/            # Daily Trust Score, OAuth refresh, usage reset
│   │       └── webhooks/        # Stripe + YouTube event handlers
│   ├── components/
│   │   ├── ui/                  # Base primitives (shadcn/ui)
│   │   ├── editor/              # VideoPreview, Timeline, CaptionEditor, BRollPanel
│   │   ├── audio/               # AudioTimeline, WaveformVisualizer, SFXPanel
│   │   ├── audit/               # SaturaScanReport, ViralScoreCard, NicheAlignmentCard
│   │   ├── magic-clips/         # URLInput, ClipCard, ClipResultsGrid
│   │   └── avatar/              # ScriptInput, AvatarPicker, AvatarPreview
│   ├── stores/                  # Zustand: editorStore, audioStore, uploadStore, uiStore
│   ├── hooks/                   # useProject, useTrustScore, useRenderStatus, useAudio, useWaveform
│   ├── lib/                     # prisma, stripe, youtube, openai, r2, mux, inngest, remotion
│   └── config/                  # plans.ts, presets.ts, prompts.ts (all LLM prompts versioned)
│
├── remotion/
│   ├── compositions/            # ShortVideo (root), CaptionTrack, BRollLayer, AvatarLayer, ZoomEffect
│   ├── audio/                   # AudioTrack, MusicLayer, SFXLayer, VoiceoverLayer
│   ├── components/              # Caption, PowerWord, EmojiOverlay, ProgressBar
│   └── lib/                     # captionParser, audioDucking, audioSync (Whisper ts → frames)
│
└── prisma/
    └── schema.prisma
```

---

## Feature Modules

### Module A — AI Production Suite

**AI Magic Clips** — Paste a long-form YouTube URL. The LLM pipeline segments the transcript, scores each moment for retention potential, and surfaces the top 5 clips as timestamped previews. One click adds any clip to the editor timeline.

**Dynamic Captions** — Audio is transcribed via Whisper. Captions render as kinetic typography using Remotion: word-by-word highlight animation, context-aware emoji injection, and "Power Word" bolding on high-impact phrases. Four style presets: Bold, Minimal, Neon, Subtitle.

**AI Avatar Studio** — Input a text script, choose from a photorealistic avatar grid, and trigger a GPU render pipeline. Output is a 9:16 MP4 dropped directly into the editor. Tier-gated: Creator = 10 min/mo, Pro = 30 min/mo, Agency = unlimited.

**Auto B-Roll & Zooms** — Keywords are extracted from the transcript and matched against a stock footage library. B-roll overlays are inserted automatically, along with snap zooms every ~3 seconds to mimic viral editing patterns. Everything is overridable in the timeline.

---

### Module B — Algorithmic Intelligence

**Channel Trust Score (0–100)** — A daily-computed composite score built from three sub-signals: Upload Consistency (cadence regularity), Metadata Accuracy (title/tag/description completeness), and Engagement Signals (CTR, average view duration, likes ratio). Displayed prominently on the dashboard and drilled into at `/analytics`.

**Niche Alignment Engine** — Each video's transcript is embedded and compared against the channel's historical transcript corpus. Returns a percentage match and keyword divergence list. If alignment is below 60%, a publish warning fires. This prevents algorithm suppression from off-niche content.

**Shadowban Detector** — Scans captions and titles for YouTube policy violation signals and unoriginal-content indicators (duplicate transcripts, watermarked footage). Returns pass / warn / fail with specific flagged segments highlighted.

**Viral Predictor (1–100)** — Scores each video's likelihood of entering the Shorts Feed. Inputs: hook strength (first 3 seconds), transcript retention shape, niche alignment percentage, and trending keyword overlap from YouTube Data API v3. Visible as a compact gauge on every video card and as a full breakdown inside the Audit Drawer.

---

## API Routes

```
POST   /api/transcribe              # Video → Whisper transcription
POST   /api/magic-clips             # Long-form URL → enqueue clip extraction
POST   /api/avatar                  # Script → enqueue AI avatar render
POST   /api/projects/[id]/render    # Trigger Remotion Lambda render
POST   /api/audit                   # Run full Satura Scan for a project
GET    /api/trust-score             # Channel health score
POST   /api/viral-predictor         # Score transcript 1–100
POST   /api/niche-alignment         # Check transcript vs channel history
POST   /api/publish/[id]            # One-click deploy to YouTube Data API v3
GET    /api/audio/library           # Browse royalty-free tracks
POST   /api/audio/upload            # Signed R2 upload URL
GET    /api/usage                   # Current AI credit consumption
```

Cron jobs (Inngest):
- `cron/trust-score` — Daily Trust Score recompute for all active channels
- `cron/token-refresh` — YouTube OAuth token refresh
- `cron/usage-reset` — Monthly AI minute cap reset per account

---

## Design System

The UI follows a refined light-mode SaaS aesthetic — soft warm grays, white card surfaces, minimal sidebar navigation, serif display font for metrics.

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#F0F0EE` | App background |
| `--surface` | `#FFFFFF` | Cards, sidebar |
| `--border` | `#E4E4E0` | All dividers |
| `--text` | `#1A1A18` | Primary text |
| `--text-muted` | `#888884` | Labels, secondary |
| `--accent-green` | `#4ADE80` | Positive deltas, success |
| `--accent-orange` | `#FB923C` | Warnings |
| `--accent-red` | `#F87171` | Errors, negative deltas |

Typography: **Fraunces** (serif, 300) for display numbers · **DM Sans** for all UI body text · **DM Sans Mono** for code/timestamps.

---

## Pricing

| Plan | Price | Videos | Intelligence | Target |
|---|---|---|---|---|
| Free | $0 | 3 (watermarked) | Basic Trust Score | Evaluation |
| Creator | $19/mo | 20 | Niche Alignment Alerts | Solo creators |
| **Pro ⭐** | $44/mo | Unlimited | Viral Predictor + Keyword Map | Growth-focused |
| Agency | $120/mo | Multi-user, Brand Kits | Unlimited Channel Audits | Teams |

Annual billing: 40% discount. Upsells: Thumbnail Expansion (+$10/mo), Ghost-Publishing (+$15/mo), AI Credit Refills (variable).

Plan limits and feature flags are centralised in `src/config/plans.ts` and enforced server-side via `lib/planLimits.ts`. Client-side access is through the `usePlanLimits()` hook.

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Stripe account (for billing)
- YouTube Data API v3 credentials
- Cloudflare R2 bucket (asset storage)
- OpenAI API key (Whisper + GPT-4o)

### Local Setup

```bash
git clone https://github.com/Aathirajan/shorts_pro.git
cd shorts_pro

npm install

cp .env.example .env.local
# Fill in all credentials

npx prisma migrate dev
npx prisma db seed          # Seeds presets, SFX library, royalty-free music metadata

npm run dev
```

App runs at `http://localhost:3000`.

### Key Environment Variables

```env
DATABASE_URL=

NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# YouTube OAuth
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=

# OpenAI (Whisper + GPT-4o)
OPENAI_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=

# Mux
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=

# Inngest
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# Remotion Lambda
REMOTION_AWS_ACCESS_KEY_ID=
REMOTION_AWS_SECRET_ACCESS_KEY=
REMOTION_S3_BUCKET=
```

### Remotion Development

```bash
npx remotion studio        # Open Remotion Studio for composition preview
npx remotion render        # Local render for testing
```

---

## Key Design Decisions

**Remotion for programmatic video** — Using React components as the rendering primitive means caption animations, B-roll overlays, zoom effects, and audio ducking are all expressed as TypeScript code. This makes the entire video compositing layer testable, versionable, and easily parameterised per preset — something FFmpeg scripting can't match for maintainability.

**All LLM prompts versioned in `config/prompts.ts`** — Every prompt sent to GPT-4o or Claude lives in a single file with explicit version comments. This makes prompt tuning auditable (git blame), prevents prompt drift across features, and allows A/B testing by swapping prompt versions without touching feature code.

**Inngest for the async pipeline** — Magic Clips, Avatar rendering, and Trust Score computation are inherently long-running and failure-prone. Inngest gives reliable job queuing, automatic retries, step-level logging, and cron scheduling without standing up a separate queue service.

**Hard GPU cost caps at the tier level** — AI Avatar minutes are the highest-margin cost driver. Caps are enforced server-side before enqueueing render jobs (not just in the UI), so no billing edge case can exceed the allowed limit.

**Route protection at the middleware layer** — `middleware.ts` handles both auth checks and plan-level feature gating centrally, so no individual route handler needs to re-implement access control logic.

---

## License

MIT © [Aathirajan](https://github.com/Aathirajan)
