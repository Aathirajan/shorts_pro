# YTShortsPro — Claude Code Design Document
**Version:** 1.0 · **Stack:** React + TypeScript · **Date:** March 2026

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [Target Personas](#2-target-personas)
3. [Design System](#3-design-system)
4. [Screen Inventory](#4-screen-inventory)
5. [Component Library](#5-component-library)
6. [Feature Modules](#6-feature-modules)
7. [User Journey](#7-user-journey)
8. [Pricing & Plans](#8-pricing--plans)
9. [Technical Architecture](#9-technical-architecture)
10. [KPIs & Success Metrics](#10-kpis--success-metrics)
11. [Build Order](#11-build-order)

---

## 1. Product Vision

YTShortsPro closes the loop between **what to make** and **how to make it perform** — the only YouTube Shorts platform combining professional-grade video production with real-time algorithmic intelligence.

| Differentiator | vs. Submagic | vs. Satura |
|---|---|---|
| Their gap | Great editing, no strategy | Great data, no creation tools |
| Our edge | Same editing quality + algorithmic intelligence | Same data + production suite to act on it immediately |

> **Core promise:** We sell one thing — **Views.**

---

## 2. Target Personas

### ⚡ The Scaler
- Manages 5+ faceless channels simultaneously
- Needs bulk speed, high Trust Scores, zero manual editing overhead
- **Best plan:** Agency ($120/mo)
- **Key features:** Multi-channel dashboard, Brand Kits, Unlimited Channel Audits

### 🎙️ The Repurposer
- Podcasters and long-form creators extracting viral clips
- Wants clips without re-watching hours of footage
- **Best plan:** Creator ($19/mo)
- **Key features:** AI Magic Clips, Dynamic Captions

### 📊 The Data-Driven Creator
- Analytical users who want to understand *why* a video underperformed
- Wants a concrete fix, not vague warnings
- **Best plan:** Pro ($44/mo)
- **Key features:** Viral Predictor, Keyword Map, Niche Alignment Engine

---

## 3. Design System

### Aesthetic Direction

Inspired by the reference UI: clean light-mode SaaS, soft warm grays, white card surfaces, minimal sidebar navigation, green accent for positive metrics. The tone is **refined minimalism** — precision over ornamentation.

---

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#F0F0EE` | App background |
| `--surface` | `#FFFFFF` | Cards, sidebar |
| `--surface-2` | `#F7F7F5` | Subtle inset areas |
| `--border` | `#E4E4E0` | All dividers and borders |
| `--text` | `#1A1A18` | Primary text, active nav |
| `--text-muted` | `#888884` | Labels, secondary copy |
| `--accent-green` | `#4ADE80` | Positive deltas, success states |
| `--accent-orange` | `#FB923C` | Warnings, mid-tier alerts |
| `--accent-red` | `#F87171` | Errors, negative deltas |
| `--accent-blue` | `#60A5FA` | Info states, links |

---

### Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| Display / Numbers | Fraunces (serif) | 300 | 28–42px |
| UI Body | DM Sans | 400 / 500 / 600 | 13–15px |
| Code / Mono | DM Sans Mono | 400 | 12–13px |
| Nav labels | DM Sans | 600, uppercase | 10–11px |

---

### Spacing & Radius

```
--radius:     14px   (cards, modals)
--radius-sm:  8px    (buttons, inputs, small chips)
--radius-pill: 100px  (tags, badges, delta chips)

Base unit: 4px
Common spacing: 8 / 12 / 16 / 20 / 24 / 32 / 48px
```

---

### Elevation

- **Level 0** — Background `#F0F0EE`, no shadow
- **Level 1** — Cards: `border: 1px solid #E4E4E0`, no shadow
- **Level 2** — Modals / dropdowns: `box-shadow: 0 8px 32px rgba(0,0,0,0.08)`
- **Highlighted card** — `border-color: #1A1A18; box-shadow: 0 0 0 1px #1A1A18`

---

## 4. Screen Inventory

### 4.1 Strategic Dashboard (Home)

**Route:** `/dashboard`

**Purpose:** First view after login. Shows channel health at a glance.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  SIDEBAR  │  PAGE TITLE: "Dashboard"                    │
│           │                                             │
│ Dashboard │  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ > Product │  │Trust     │ │Viral     │ │Idea→Post │   │
│   Overview│  │Score  87 │ │Predictor │ │Time 9min │   │
│   Drafts3 │  │↑ 4.2%    │ │74/100    │ │↓ 12%     │   │
│   Released│  └──────────┘ └──────────┘ └──────────┘   │
│   Scheduled│                                            │
│ Customers │  ┌──────────────────────────────────────┐  │
│ Shop      │  │  Channel Activity (line chart)       │  │
│ Income    │  └──────────────────────────────────────┘  │
│ Promote   │                                             │
└─────────────────────────────────────────────────────────┘
```

**Key components:**
- Sidebar with collapsible nav sections and badge counts
- 4-column stat card row (Trust Score, Viral Predictor avg, Idea-to-Post time, Niche Lift)
- Line chart: upload consistency over 30 days
- Recent videos table with per-video Viral Score and Niche status

---

### 4.2 Product / Video Management

**Route:** `/product`

**Sub-routes:**
| Route | Description |
|---|---|
| `/product/overview` | Summary stats + activity log |
| `/product/drafts` | Unfinished videos with badge count |
| `/product/released` | Published videos with performance data |
| `/product/comments` | Aggregated YouTube comment inbox |
| `/product/scheduled` | Queued posts with scheduled timestamps |

**Overview layout mirrors the reference UI:**
- Large "Earning" (total estimated revenue from views) stat with sparkline
- "Customer" (subscriber count) stat beside it
- Product activity feed below

---

### 4.3 Video Editor

**Route:** `/editor/:videoId`

**Layout:** Split-panel

```
┌──────────────────────────────────────────────────────────┐
│  ← Back   Video Editor                    [Audit] [Post] │
├───────────────────┬──────────────────────────────────────┤
│  TIMELINE PANEL   │  PREVIEW (9:16 phone frame)          │
│                   │                                      │
│  [AI Tools]       │       ┌──────────┐                  │
│  ├ Magic Clips    │       │          │                  │
│  ├ B-Roll        │       │  Video   │                  │
│  ├ Captions      │       │  Preview │                  │
│  └ Zoom Snap     │       │          │                  │
│                   │       └──────────┘                  │
│  [Presets]        │                                      │
│  Timeline ━━━━━   │  Captions: [kinetic text overlay]   │
└───────────────────┴──────────────────────────────────────┘
```

---

### 4.4 Algorithmic Audit Panel

**Triggered from:** Editor → "Audit" button

**Displayed as:** Right-side drawer (480px wide)

**Sections:**
1. **Hook Strength** — Score 1–10, flagged phrases highlighted
2. **Niche Alignment** — % match to channel history, pass/warn/fail
3. **Shadowban Scan** — Policy violation flags, unoriginal content signals
4. **Viral Predictor Score** — 1–100 gauge with live trending context
5. **Recommended Actions** — Ordered list of concrete fixes

---

### 4.5 AI Avatar Studio

**Route:** `/avatar`

- Text script input (with word count and estimated duration)
- Avatar selector grid (photorealistic heads, 6 options on Creator, unlimited on Pro+)
- Voice selector (tone, accent, speed)
- Preview render (GPU-accelerated, < 60s target)
- Output drops into the editor timeline

---

### 4.6 Channel Trust Score Dashboard

**Route:** `/trust`

- Single large score (0–100) with trend sparkline
- Score breakdown: Upload Consistency / Metadata Accuracy / Engagement Signals (3 sub-bars)
- 30-day history chart
- Action items: ordered checklist of what to fix to improve score

---

### 4.7 Pricing & Upgrade

**Route:** `/upgrade`

- 4-column plan cards (Free / Creator / Pro ⭐ / Agency)
- Annual toggle (shows 40% discount)
- Upsell add-on rows below: Thumbnail Expansion, Ghost-Publishing, AI Credit Refills

---

## 5. Component Library

### 5.1 Sidebar

```tsx
<Sidebar>
  <SidebarLogo />
  <SidebarSection label="Product">
    <SidebarItem icon={<OverviewIcon />} label="Overview" href="/product/overview" />
    <SidebarItem icon={<DraftIcon />} label="Drafts" href="/product/drafts" badge={3} />
    <SidebarItem label="Released" href="/product/released" />
    <SidebarItem label="Comments" href="/product/comments" />
    <SidebarItem label="Scheduled" href="/product/scheduled" badge={8} badgeColor="green" />
  </SidebarSection>
  <SidebarSection label="Intelligence">
    <SidebarItem label="Trust Score" href="/trust" />
    <SidebarItem label="Niche Alignment" href="/niche" />
  </SidebarSection>
</Sidebar>
```

**Props for `SidebarItem`:**

| Prop | Type | Notes |
|---|---|---|
| `label` | string | Nav text |
| `href` | string | Route |
| `icon` | ReactNode | Optional icon |
| `badge` | number | Optional count pill |
| `badgeColor` | `"orange" \| "green"` | Defaults to orange |
| `active` | boolean | Auto-detected from route |

---

### 5.2 StatCard

Mirrors the reference UI's earning/customer cards exactly.

```tsx
<StatCard
  label="Trust Score"
  value={87}
  delta={+4.2}
  deltaLabel="vs last month"
  sparklineData={[72, 75, 78, 80, 84, 87]}
/>
```

| Prop | Type | Notes |
|---|---|---|
| `label` | string | e.g. "Trust Score" |
| `value` | number \| string | Large display number |
| `delta` | number | Positive = green chip, negative = red chip |
| `deltaLabel` | string | e.g. "vs last year" |
| `sparklineData` | number[] | Mini SVG line chart |
| `prefix` | string | e.g. `"$"` |

---

### 5.3 DeltaChip

```tsx
<DeltaChip value={+36.8} label="vs last year" />
// renders: ↑ 36.8%  vs last year   (green pill)

<DeltaChip value={-12.1} label="vs last month" />
// renders: ↓ 12.1%  vs last month  (red pill)
```

---

### 5.4 ViralScoreGauge

A circular gauge 1–100. Color transitions: 0–40 red → 41–70 orange → 71–100 green.

```tsx
<ViralScoreGauge score={74} size={120} />
```

---

### 5.5 NicheAlignmentBadge

```tsx
<NicheAlignmentBadge status="aligned" />   // green
<NicheAlignmentBadge status="warning" />   // orange — "Off-niche risk"
<NicheAlignmentBadge status="blocked" />   // red   — "Suppression likely"
```

---

### 5.6 TrustScoreBar

Sub-component used inside the Trust Score dashboard.

```tsx
<TrustScoreBar label="Upload Consistency" score={91} />
<TrustScoreBar label="Metadata Accuracy"  score={78} />
<TrustScoreBar label="Engagement Signals" score={84} />
```

Bar color: green if ≥ 75, orange if 50–74, red if < 50.

---

### 5.7 VideoTable

Shared table for Drafts, Released, Scheduled views.

**Columns:**

| Column | Type | Notes |
|---|---|---|
| Thumbnail | image | 16:9 thumbnail (cropped) |
| Title | string | Truncated at 50 chars |
| Viral Score | `ViralScoreGauge` (compact) | 1–100 |
| Niche | `NicheAlignmentBadge` | aligned / warning / blocked |
| Status | tag | Draft / Scheduled / Live |
| Views | number | Formatted (e.g. 12.4k) |
| Actions | icon buttons | Edit / Audit / Delete |

---

### 5.8 AuditDrawer

```tsx
<AuditDrawer videoId={id} open={auditOpen} onClose={() => setAuditOpen(false)} />
```

Slides in from the right at 480px. Sections separated by thin dividers. Each finding has a severity icon (✅ / ⚠️ / 🚫) and a one-line fix recommendation.

---

## 6. Feature Modules

### Module A — AI Production Suite

#### A1. AI Magic Clips
- **Input:** Long-form YouTube URL or uploaded file
- **Output:** Top 5 timestamped clip segments, ranked by predicted retention
- **UX:** Paste URL → loading state (GPU) → clip grid with preview thumbnails → one-click "Add to Editor"
- **API:** YouTube oEmbed for metadata; internal LLM pipeline for transcript segmentation

#### A2. Dynamic Captions
- Auto-generated from audio transcription (Whisper or equivalent)
- Kinetic typography: word-by-word highlight animation
- Emoji mapping: context-aware emoji injected at sentence boundaries
- "Power Word" highlighting: bold + color on high-impact words
- **Editor control:** Style presets (Bold, Minimal, Neon, Subtitle)

#### A3. AI Avatar Studio
- Text script → photorealistic talking head video
- GPU render target: < 60 seconds
- **Tier gate:** Creator = 10 avatar minutes/mo; Pro = 30 min/mo; Agency = unlimited
- Output format: MP4 (9:16) dropped directly into editor timeline

#### A4. Auto B-Roll & Zooms
- Analyzes transcript for visual keywords → fetches stock footage
- Snap zoom injected every ~3 seconds automatically
- Creator can override or remove individual B-roll clips in timeline

---

### Module B — Algorithmic Intelligence

#### B1. Channel Trust Score
- **Formula inputs:** Upload consistency (cadence regularity), metadata accuracy (title/tag completeness), engagement signals (CTR, AVD, likes ratio)
- **Range:** 0–100 integer, updated daily
- **Display:** Dashboard header + `/trust` deep-dive page

#### B2. Niche Alignment Engine
- Compares current video transcript against channel's historical transcript corpus
- Returns alignment percentage and keyword divergence list
- **Trigger:** Runs automatically before Audit step; blocks publish with warning if < 60% aligned

#### B3. Shadowban Detector
- Scans caption text and title for YouTube policy violation signals
- Flags "unoriginal content" indicators (duplicate transcripts, watermarked footage detected)
- Returns a pass/warn/fail result with specific flagged segments highlighted

#### B4. Viral Predictor
- Scores each video 1–100 on likelihood to enter the Shorts Feed
- Uses live trending data from YouTube Data API v3
- **Inputs:** Hook strength (first 3s), retention curve shape, niche alignment score, trending keyword overlap
- **Displayed on:** Video card (compact), Audit Drawer (full breakdown)

---

## 7. User Journey

```
Step 1 — Strategy
  Review Trust Score dashboard
  → Identify what algorithm is currently rewarding

Step 2 — Ingest
  Upload footage / paste URL for Magic Clips / script an AI Avatar
  → Input Layer

Step 3 — Edit
  Apply a Preset
  → AI removes dead air, adds B-roll, renders captions
  → Creative Engine

Step 4 — Audit
  Run Audit Scan
  → Validates Hook strength, Niche alignment, policy compliance
  → Algorithmic Audit Drawer

Step 5 — Deploy
  One-click publish
  → AI-optimised title, tags, and scheduled release time
  → Distribution Layer
```

**Target time from concept to published:** ≤ 10 minutes (down from 240 min baseline)

---

## 8. Pricing & Plans

| Plan | Price | Videos | Intelligence | Best For |
|---|---|---|---|---|
| **Free** | $0 | 3 (watermarked) | Basic Trust Score | Try before buying |
| **Creator** | $19/mo | 20, Standard Presets | Niche Alignment Alerts | Solo creators |
| **Pro ⭐** | $44/mo | Unlimited, no watermark | Viral Predictor + Keyword Map | Serious growth |
| **Agency** | $120/mo | Multi-user, Brand Kits | Unlimited Channel Audits | Teams & Scalers |

**Annual billing:** 40% discount — implement toggle on `/upgrade` page.

### Upsell Add-ons

| Add-on | Price | Description |
|---|---|---|
| AI Credit Refills | Variable | For users who exhaust Magic Clips or Avatar minutes |
| Thumbnail Expansion | +$10/mo | Thumbmagic integration for high-CTR covers |
| Ghost-Publishing | +$15/mo | AI schedules and publishes at optimal algorithmic time |

---

## 9. Technical Architecture

### Frontend

```
React 18 + TypeScript
Vite (build)
React Router v6 (routing)
Zustand (global state)
TanStack Query (server state + caching)
Tailwind CSS (utility styling)
Framer Motion (animations)
Recharts (sparklines, line charts)
```

### Backend / APIs

| Service | Purpose |
|---|---|
| YouTube Data API v3 | Real-time channel analytics, publishing, trending data |
| Whisper API | Audio transcription for captions and Magic Clips |
| LLM Pipeline (GPT-4o / Claude) | Transcript analysis, Niche Alignment, Viral Predictor scoring |
| GPU Render Service | Video export — target < 60 seconds per video |
| Multi-Tier Asset Storage | Raw asset management across channels (S3-compatible) |

### Cost Controls

- **Hard cap on AI Avatar minutes** per Creator tier account to protect GPU margins
- **LLM token budgets** per audit run — truncate transcripts beyond 8k tokens
- **COGS tracking:** GPU render time + LLM tokens = primary COGS drivers; surface in admin dashboard

### Key API Routes

```
POST   /api/clips/extract          # Magic Clips from URL
POST   /api/avatar/render          # AI Avatar generation
POST   /api/audit/:videoId         # Full Algorithmic Audit
GET    /api/trust/:channelId       # Trust Score
GET    /api/viral/:videoId         # Viral Predictor score
POST   /api/publish/:videoId       # One-click publish to YouTube
GET    /api/channels               # Multi-channel list (Agency)
```

---

## 10. KPIs & Success Metrics

| KPI | Definition | Target |
|---|---|---|
| **Retention Rate** | Avg watch % per Short | ≥ 60% average view duration |
| **Idea-to-Post Time** | Minutes from concept to published | 240 min → ≤ 10 min |
| **Niche Lift** | Subscriber growth: Alignment ON vs. OFF | 2× differential |
| **Trust Score Trend** | Weekly channel health trajectory | Steady upward trend over 30 days |
| **AI Credit Utilisation** | % of users hitting tier cap per cycle | Informs upsell and margin risk |

---

## 11. Build Order

### Phase 1 — Shell & Auth (Week 1)
- [ ] Project scaffold: Vite + React + TypeScript + Tailwind
- [ ] Sidebar layout with nav sections and badge counts
- [ ] Auth flow (sign up / log in / plan selection)
- [ ] Design token CSS variables applied globally

### Phase 2 — Dashboard & Trust Score (Week 2)
- [ ] StatCard component with sparkline
- [ ] DeltaChip component
- [ ] TrustScoreBar and breakdown page (`/trust`)
- [ ] YouTube Data API v3 integration (channel analytics)
- [ ] Trust Score calculation logic

### Phase 3 — Video Management (Week 3)
- [ ] VideoTable with all columns
- [ ] Drafts / Released / Scheduled sub-routes
- [ ] NicheAlignmentBadge and ViralScoreGauge (compact)
- [ ] Scheduled post queue with timestamps

### Phase 4 — AI Production Suite (Weeks 4–5)
- [ ] Magic Clips — URL input → clip extraction → clip grid
- [ ] Dynamic Captions — transcription + kinetic typography renderer
- [ ] Auto B-Roll & Zooms — keyword extraction + stock footage overlay
- [ ] AI Avatar Studio — script input + avatar selector + GPU render pipeline

### Phase 5 — Algorithmic Audit (Week 6)
- [ ] AuditDrawer component
- [ ] Niche Alignment Engine (LLM pipeline)
- [ ] Shadowban Detector
- [ ] Viral Predictor score (full breakdown)
- [ ] Hook Strength analyser (first 3s transcript)

### Phase 6 — Publish & Monetisation (Week 7)
- [ ] One-click publish to YouTube (Data API v3)
- [ ] Ghost-Publishing scheduler (cron + optimal time algorithm)
- [ ] Pricing page with annual toggle
- [ ] Upsell add-on checkout (Stripe)
- [ ] AI Credit metering and hard caps

### Phase 7 — Agency & Multi-Channel (Week 8)
- [ ] Multi-channel switcher in sidebar
- [ ] Brand Kits per channel
- [ ] Unlimited Channel Audit access for Agency tier
- [ ] Multi-user invite and roles

---

*YTShortsPro Design Document — Claude Code Build Spec v1.0*