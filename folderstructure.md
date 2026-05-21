ytshortspro/
│
├── .env.local
├── .env.example
├── .gitignore
├── middleware.ts                              # Route protection + plan gating
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── package.json
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── public/
│   ├── fonts/
│   ├── icons/
│   ├── og-image.png
│   └── sfx/
│       ├── whoosh-fast.mp3
│       ├── whoosh-slow.mp3
│       ├── pop-up.mp3
│       ├── ding.mp3
│       ├── bass-hit.mp3
│       ├── tape-rewind.mp3
│       └── text-appear.mp3
│
├── remotion/
│   ├── index.ts                              # Registers all compositions
│   ├── remotion.config.ts
│   │
│   ├── compositions/
│   │   ├── ShortVideo.tsx                    # Master composition (root)
│   │   ├── CaptionTrack.tsx
│   │   ├── BRollLayer.tsx
│   │   ├── AvatarLayer.tsx
│   │   └── ZoomEffect.tsx
│   │
│   ├── audio/
│   │   ├── AudioTrack.tsx                    # Master audio composition layer
│   │   ├── MusicLayer.tsx                    # Background music + fade in/out
│   │   ├── SFXLayer.tsx                      # Frame-triggered sound effects
│   │   └── VoiceoverLayer.tsx                # AI voiceover / avatar voice sync
│   │
│   ├── components/
│   │   ├── Caption.tsx
│   │   ├── PowerWord.tsx
│   │   ├── EmojiOverlay.tsx
│   │   └── ProgressBar.tsx
│   │
│   └── lib/
│       ├── calculateMetadata.ts
│       ├── captionParser.ts
│       ├── transitions.ts
│       ├── audioDucking.ts                   # Lowers music volume under speech
│       └── audioSync.ts                      # Whisper timestamps → frame numbers
│
└── src/
    │
    ├── app/
    │   │
    │   ├── layout.tsx
    │   ├── page.tsx                          # Marketing homepage
    │   ├── globals.css
    │   │
    │   ├── (auth)/
    │   │   ├── login/page.tsx
    │   │   ├── register/page.tsx
    │   │   └── callback/page.tsx             # OAuth callback
    │   │
    │   ├── (dashboard)/
    │   │   ├── layout.tsx                    # Sidebar + topbar shell
    │   │   │
    │   │   ├── dashboard/
    │   │   │   └── page.tsx                  # Trust Score + channel overview
    │   │   │
    │   │   ├── projects/
    │   │   │   ├── page.tsx                  # All projects list
    │   │   │   ├── new/page.tsx              # Create project (upload/URL/avatar)
    │   │   │   └── [projectId]/
    │   │   │       ├── page.tsx              # Project detail
    │   │   │       ├── edit/page.tsx         # Full editor (captions, b-roll, audio)
    │   │   │       ├── captions/page.tsx     # Dedicated caption editor
    │   │   │       ├── audio/page.tsx        # Audio mixer view
    │   │   │       ├── audit/page.tsx        # Satura Scan results
    │   │   │       └── publish/page.tsx      # Metadata + one-click deploy
    │   │   │
    │   │   ├── magic-clips/
    │   │   │   ├── page.tsx                  # Paste URL → clip extraction
    │   │   │   └── [jobId]/page.tsx          # Clip results + export
    │   │   │
    │   │   ├── avatar-studio/
    │   │   │   ├── page.tsx                  # Script input + avatar selector
    │   │   │   └── [avatarJobId]/page.tsx    # Preview + export
    │   │   │
    │   │   ├── analytics/
    │   │   │   ├── page.tsx                  # Trust Score history + trends
    │   │   │   └── [channelId]/page.tsx      # Per-channel deep analytics
    │   │   │
    │   │   ├── channels/
    │   │   │   ├── page.tsx                  # All connected YouTube channels
    │   │   │   └── [channelId]/page.tsx      # Channel settings + niche config
    │   │   │
    │   │   ├── library/
    │   │   │   └── page.tsx                  # Royalty-free audio + asset library
    │   │   │
    │   │   ├── presets/
    │   │   │   ├── page.tsx                  # Browse / manage presets
    │   │   │   └── [presetId]/page.tsx       # Individual preset editor
    │   │   │
    │   │   ├── folders/
    │   │   │   └── page.tsx                  # Asset folder manager
    │   │   │
    │   │   └── settings/
    │   │       ├── page.tsx                  # Account settings
    │   │       ├── billing/page.tsx          # Subscription + upsells + invoices
    │   │       └── team/page.tsx             # Agency: invite + manage members
    │   │
    │   └── api/
    │       │
    │       ├── auth/
    │       │   └── [...nextauth]/route.ts
    │       │
    │       ├── webhooks/
    │       │   ├── stripe/route.ts
    │       │   └── youtube/route.ts
    │       │
    │       ├── projects/
    │       │   ├── route.ts                  # GET all / POST create
    │       │   └── [projectId]/
    │       │       ├── route.ts              # GET / PATCH / DELETE
    │       │       └── render/route.ts       # POST → trigger Remotion render
    │       │
    │       ├── captions/
    │       │   └── route.ts                  # GET / POST / PATCH captions
    │       │
    │       ├── audio/
    │       │   ├── upload/route.ts           # Upload custom audio → R2
    │       │   ├── library/route.ts          # Browse royalty-free library
    │       │   └── waveform/route.ts         # Generate waveform data for timeline
    │       │
    │       ├── transcribe/
    │       │   └── route.ts                  # POST video → Whisper transcription
    │       │
    │       ├── magic-clips/
    │       │   └── route.ts                  # POST URL → enqueue clip extraction
    │       │
    │       ├── avatar/
    │       │   └── route.ts                  # POST script → enqueue avatar gen
    │       │
    │       ├── audit/
    │       │   └── route.ts                  # POST projectId → run Satura Scan
    │       │
    │       ├── publish/
    │       │   └── route.ts                  # POST → YouTube Data API publish
    │       │
    │       ├── trust-score/
    │       │   └── route.ts                  # GET channelId → compute score
    │       │
    │       ├── viral-predictor/
    │       │   └── route.ts                  # POST transcript → score 1–100
    │       │
    │       ├── niche-alignment/
    │       │   └── route.ts                  # POST transcript + channelId → check
    │       │
    │       ├── channels/
    │       │   ├── route.ts
    │       │   └── [channelId]/route.ts
    │       │
    │       ├── presets/
    │       │   ├── route.ts                  # GET all / POST create
    │       │   └── [presetId]/route.ts       # GET / PATCH / DELETE
    │       │
    │       ├── folders/
    │       │   ├── route.ts
    │       │   └── [folderId]/
    │       │       └── assets/route.ts
    │       │
    │       ├── upload/
    │       │   └── route.ts                  # POST → signed R2 upload URL
    │       │
    │       ├── usage/
    │       │   └── route.ts                  # GET current AI credit usage
    │       │
    │       └── cron/
    │           ├── trust-score/route.ts      # Daily Trust Score recompute
    │           ├── token-refresh/route.ts    # YouTube OAuth token refresh
    │           └── usage-reset/route.ts      # Monthly AI minute cap reset
    │
    ├── components/
    │   │
    │   ├── ui/                               # Primitive shadcn/ui components
    │   │   ├── Button.tsx
    │   │   ├── Badge.tsx
    │   │   ├── Card.tsx
    │   │   ├── Input.tsx
    │   │   ├── Modal.tsx
    │   │   ├── Tooltip.tsx
    │   │   ├── Tabs.tsx
    │   │   ├── Dropdown.tsx
    │   │   ├── Spinner.tsx
    │   │   ├── Progress.tsx
    │   │   ├── Avatar.tsx
    │   │   └── index.ts
    │   │
    │   ├── shared/                           # Cross-feature reusable components
    │   │   ├── UpgradePrompt.tsx             # Shown when hitting plan cap
    │   │   ├── EmptyState.tsx
    │   │   ├── ConfirmDialog.tsx
    │   │   ├── FileDropzone.tsx
    │   │   └── StatusBadge.tsx               # Render job / audit status
    │   │
    │   ├── layout/
    │   │   ├── Sidebar.tsx
    │   │   ├── Topbar.tsx
    │   │   ├── MobileNav.tsx
    │   │   └── PageHeader.tsx
    │   │
    │   ├── dashboard/
    │   │   ├── TrustScoreWidget.tsx
    │   │   ├── ChannelHealthCard.tsx
    │   │   ├── RecentProjects.tsx
    │   │   └── QuickActions.tsx
    │   │
    │   ├── editor/
    │   │   ├── VideoPreview.tsx              # Remotion Player embed
    │   │   ├── Timeline.tsx                  # Master timeline (video + audio lanes)
    │   │   ├── AudioTrackRow.tsx             # Audio lane inside timeline
    │   │   ├── CaptionEditor.tsx
    │   │   ├── TranscriptEditor.tsx          # Edit raw Whisper transcript
    │   │   ├── PresetSelector.tsx
    │   │   ├── BRollPanel.tsx
    │   │   └── ExportPanel.tsx
    │   │
    │   ├── audio/
    │   │   ├── AudioTimeline.tsx             # Waveform + region selector
    │   │   ├── MusicPicker.tsx               # Browse + preview tracks
    │   │   ├── VoiceoverRecorder.tsx         # Record or upload custom VO
    │   │   ├── SFXPanel.tsx                  # Drag-and-drop sound effects
    │   │   ├── WaveformVisualizer.tsx        # Canvas waveform render
    │   │   └── VolumeControl.tsx             # Per-track volume + mute
    │   │
    │   ├── audit/
    │   │   ├── SaturaScanReport.tsx
    │   │   ├── HookScoreCard.tsx
    │   │   ├── NicheAlignmentCard.tsx
    │   │   ├── ShadowbanCheckCard.tsx
    │   │   └── ViralScoreCard.tsx
    │   │
    │   ├── publish/
    │   │   ├── MetadataForm.tsx
    │   │   ├── SchedulePicker.tsx
    │   │   └── PublishButton.tsx
    │   │
    │   ├── magic-clips/
    │   │   ├── URLInput.tsx
    │   │   ├── ClipCard.tsx
    │   │   └── ClipResultsGrid.tsx
    │   │
    │   ├── avatar/
    │   │   ├── ScriptInput.tsx
    │   │   ├── AvatarPicker.tsx
    │   │   └── AvatarPreview.tsx
    │   │
    │   ├── analytics/
    │   │   ├── TrustScoreChart.tsx
    │   │   ├── RetentionChart.tsx
    │   │   └── NicheDriftChart.tsx
    │   │
    │   └── billing/
    │       ├── PlanCard.tsx
    │       ├── UsageMeter.tsx
    │       └── UpsellBanner.tsx
    │
    ├── lib/
    │   ├── prisma.ts                         # Prisma client singleton
    │   ├── auth.ts                           # NextAuth config + session helpers
    │   ├── stripe.ts                         # Stripe client + plan helpers
    │   ├── youtube.ts                        # YouTube Data API v3 wrapper
    │   ├── openai.ts                         # GPT-4o + Whisper + embeddings
    │   ├── r2.ts                             # Cloudflare R2 upload helpers
    │   ├── mux.ts                            # Mux video delivery client
    │   ├── queue.ts                          # Inngest job queue client
    │   ├── remotion.ts                       # Remotion Lambda render trigger
    │   ├── encryption.ts                     # Encrypt YouTube refresh tokens
    │   ├── rateLimit.ts                      # Protect AI endpoints from abuse
    │   ├── planLimits.ts                     # getPlanLimits(userId) — server-side
    │   └── utils.ts                          # cn(), formatDuration(), slugify()
    │
    ├── hooks/
    │   ├── useProject.ts
    │   ├── useTrustScore.ts
    │   ├── useRenderStatus.ts                # Polls render job progress
    │   ├── useChannels.ts
    │   ├── useUpload.ts                      # Chunked upload + progress
    │   ├── useAudio.ts                       # Audio playback + sync state
    │   ├── useWaveform.ts                    # Waveform data fetching
    │   ├── useTranscript.ts                  # Transcript editing state
    │   ├── usePlanLimits.ts                  # Feature access — client-side
    │   └── useCronStatus.ts                  # Background job health
    │
    ├── stores/
    │   ├── editorStore.ts                    # Active project + timeline state
    │   ├── audioStore.ts                     # Audio tracks + playback state
    │   ├── uploadStore.ts                    # Upload queue + progress
    │   └── uiStore.ts                        # Sidebar, modals, toasts
    │
    ├── types/
    │   ├── project.ts
    │   ├── channel.ts
    │   ├── audit.ts
    │   ├── audio.ts                          # AudioTrack, SFX, MusicTrack
    │   ├── transcript.ts                     # Word, Segment, Caption
    │   ├── billing.ts                        # Plan, Usage, Invoice
    │   ├── remotion.ts                       # Composition prop types
    │   └── api.ts                            # Request / response shapes
    │
    └── config/
        ├── plans.ts                          # Tier definitions + feature flags + caps
        ├── presets.ts                        # Default edit preset configs
        ├── prompts.ts                        # All LLM prompts versioned here
        └── constants.ts
│
└── scripts/
    ├── seed-presets.ts
    ├── seed-sfx-library.ts                   # Loads SFX metadata into DB
    ├── seed-music-library.ts                 # Seeds royalty-free track metadata
    └── sync-youtube-channels.ts