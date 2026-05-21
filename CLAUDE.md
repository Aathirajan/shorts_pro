# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

YTShortsPro is a YouTube Shorts platform combining professional-grade video production with algorithmic intelligence. The stack is **Next.js 14 + React + TypeScript + Tailwind CSS** with **Remotion** for video rendering.

## Architecture Summary

### Core Layers

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend: Next.js 14 App Router + React + TypeScript       │
│  State: Zustand (global) + TanStack Query (server cache)    │
│  Styling: Tailwind CSS + Framer Motion + Recharts           │
├─────────────────────────────────────────────────────────────┤
│  Video Engine: Remotion (programmatic video rendering)      │
├─────────────────────────────────────────────────────────────┤
│  Backend: Next.js API Routes + Prisma ORM                   │
│  Queue: Inngest (background jobs for AI/renders)            │
├─────────────────────────────────────────────────────────────┤
│  External Services:                                         │
│  - YouTube Data API v3 (analytics, publishing)              │
│  - OpenAI/Whisper (transcription, LLM analysis)             │
│  - Stripe (subscriptions + usage billing)                   │
│  - Cloudflare R2 (asset storage)                            │
│  - Mux (video delivery)                                     │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

- `/src/app` — Next.js App Router routes (auth, dashboard, API endpoints)
- `/src/components` — UI primitives, layout shells, feature-specific components
- `/src/lib` — Service clients (Prisma, Stripe, YouTube, OpenAI, R2, Inngest)
- `/src/hooks` — React hooks for data fetching and state
- `/src/stores` — Zustand stores for global state
- `/src/types` — TypeScript type definitions
- `/src/config` — Plan tiers, LLM prompts, constants
- `/remotion` — Video compositions, audio layers, render logic
- `/prisma` — Database schema and migrations

## Feature Modules

### Module A: AI Production Suite
- **Magic Clips**: Extract viral moments from long-form URLs
- **Dynamic Captions**: Kinetic typography with emoji mapping
- **AI Avatar Studio**: Script → photorealistic talking head
- **Auto B-Roll & Zooms**: Keyword-triggered overlays

### Module B: Algorithmic Intelligence
- **Channel Trust Score**: 0-100 health metric (consistency, metadata, engagement)
- **Niche Alignment**: Transcript comparison vs channel history
- **Shadowban Detector**: Policy violation scan
- **Viral Predictor**: 1-100 score based on trending data

## Development Patterns

### API Route Structure
All API endpoints follow Next.js App Router conventions:
- `GET/POST/PUT/DELETE` handled via `route.ts`
- Request validation at entry point
- Plan gating via `middleware.ts` for premium features
- AI credit limits enforced server-side (`planLimits.ts`)

### Component Architecture
- Primitive UI components in `/components/ui` (Button, Card, Modal, etc.)
- Shared components in `/components/shared` (EmptyState, ConfirmDialog, etc.)
- Feature components co-located by domain (`/components/editor/*`, `/components/audit/*`)

### State Management
- **Zustand**: Ephemeral UI state (sidebar open, active tool, modals)
- **TanStack Query**: Server state with caching/mutation
- Avoid prop drilling — prefer stores for cross-component state

### Video Rendering Flow
```
User triggers export → POST /api/projects/[id]/render
  → Inngest queues job → Remotion Lambda renders
  → Poll status via useRenderStatus hook
  → Store result in R2, return Mux playback URL
```

## Key Constraints

- **GPU render target**: < 60 seconds per video
- **AI Avatar minutes**: Strictly capped per plan tier (margin protection)
- **LLM token budget**: Truncate transcripts beyond 8k tokens
- **Plan gates**: Free (3 watermarked), Creator (20), Pro (unlimited), Agency (multi-user)

## Pricing Tiers

| Plan | Price | Videos/mo | Avatar Minutes | Intelligence |
|------|-------|-----------|----------------|--------------|
| Free | $0 | 3 (watermarked) | 0 | Basic Trust Score |
| Creator | $19/mo | 20 | 10 | Niche Alerts |
| Pro | $44/mo | Unlimited | 30 | Viral Predictor + Keyword Map |
| Agency | $120/mo | Unlimited | Unlimited | Multi-channel audits |

Annual billing: 40% discount.

## API Endpoints Reference

```
POST   /api/clips/extract          # Magic Clips from URL
POST   /api/avatar/render          # AI Avatar generation
POST   /api/audit/:videoId         # Full Algorithmic Audit
GET    /api/trust/:channelId       # Trust Score computation
GET    /api/viral/:videoId         # Viral Predictor score
POST   /api/publish/:videoId       # YouTube publish
POST   /api/projects/[id]/render   # Trigger Remotion render
GET    /api/usage                  # AI credit usage check
```

## Cron Jobs

- `/api/cron/trust-score` — Daily Trust Score recomputation
- `/api/cron/token-refresh` — YouTube OAuth refresh
- `/api/corn/usage-reset` — Monthly AI minute cap reset

## Design System

- **Colors**: Warm grays (#F0F0EE bg, #FFFFFF surface), green accent (#4ADE80)
- **Typography**: Fraunces (display), DM Sans (UI), DM Sans Mono (code)
- **Radius**: 14px cards, 8px buttons, 100px pills
- **Elevation**: Border-based (no shadows except modals)
