import { ProjectStatus, AuditStatus, JobStatus, Plan } from '@prisma/client';

// User Types
export interface UserWithUsage {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  plan: Plan;
  avatarMinutesUsed: number;
  avatarMinutesLimit: number;
  magicClipsUsed: number;
  magicClipsLimit: number;
}

// Project Types
export interface ProjectWithRelations {
  id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  thumbnailUrl: string | null;
  duration: number | null;
  viralScore: number | null;
  nicheAlignment: number | null;
  createdAt: Date;
  updatedAt: Date;
  channel: {
    id: string;
    title: string;
    thumbnailUrl: string | null;
  } | null;
}

// Channel Types
export interface ChannelWithStats {
  id: string;
  youtubeId: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  niche: string | null;
  trustScore: number | null;
}

// Audit Types
export interface AuditResult {
  id: string;
  status: AuditStatus;
  trustScore: number | null;
  viralScore: number | null;
  nicheAlignment: number | null;
  hookStrength: number | null;
  shadowbanRisk: string | null;
  issues: AuditIssue[] | null;
  recommendations: string[] | null;
  createdAt: Date;
  completedAt: Date | null;
}

export interface AuditIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  fix?: string;
}

// Caption Types
export interface CaptionWord {
  word: string;
  startTime: number;
  endTime: number;
  confidence: number;
}

export interface CaptionSegment {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  words: CaptionWord[];
}

// Audio Types
export interface AudioTrack {
  id: string;
  type: 'music' | 'sfx' | 'voiceover';
  name: string;
  url: string;
  volume: number;
  startTime: number;
  endTime: number | null;
}

// Stats Types
export interface DashboardStats {
  trustScore: number;
  trustScoreDelta: number;
  viralScoreAvg: number;
  viralScoreDelta: number;
  ideaToPostTime: number;
  ideaToPostDelta: number;
  nicheLift: number;
  recentProjects: ProjectWithRelations[];
}

// Viral Predictor Types
export interface ViralPrediction {
  score: number;
  breakdown: {
    hookStrength: number;
    retention: number;
    nicheAlignment: number;
    trendingOverlap: number;
  };
  recommendations: string[];
}

// Magic Clips Types
export interface MagicClip {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  thumbnailUrl: string | null;
  retentionScore: number;
}

// Avatar Types
export interface AvatarVoice {
  id: string;
  name: string;
  previewUrl: string;
  accent: string;
  gender: 'male' | 'female' | 'neutral';
}

export interface Avatar {
  id: string;
  name: string;
  thumbnailUrl: string;
  previewVideoUrl: string;
  isPremium: boolean;
}

// Job Types
export interface JobStatusUpdate {
  id: string;
  status: JobStatus;
  progress: number;
  error: string | null;
}

// Plan Types
export interface PlanComparison {
  plan: Plan;
  name: string;
  price: number;
  yearlyPrice: number;
  features: string[];
  popular?: boolean;
}
