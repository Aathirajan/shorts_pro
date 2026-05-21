import { Plan } from '@prisma/client';

export interface PlanLimits {
  monthlyVideos: number;
  monthlyAvatarMinutes: number;
  monthlyMagicClips: number;
  hasWatermark: boolean;
  features: {
    dynamicCaptions: boolean;
    autoBRoll: boolean;
    aiAvatar: boolean;
    nicheAlignment: boolean;
    viralPredictor: boolean;
    shadowbanDetector: boolean;
    keywordMap: boolean;
    ghostPublishing: boolean;
    multiChannel: boolean;
    teamMembers: number;
  };
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  FREE: {
    monthlyVideos: 3,
    monthlyAvatarMinutes: 0,
    monthlyMagicClips: 3,
    hasWatermark: true,
    features: {
      dynamicCaptions: true,
      autoBRoll: false,
      aiAvatar: false,
      nicheAlignment: false,
      viralPredictor: false,
      shadowbanDetector: false,
      keywordMap: false,
      ghostPublishing: false,
      multiChannel: false,
      teamMembers: 0,
    },
  },
  CREATOR: {
    monthlyVideos: 20,
    monthlyAvatarMinutes: 10,
    monthlyMagicClips: 20,
    hasWatermark: false,
    features: {
      dynamicCaptions: true,
      autoBRoll: true,
      aiAvatar: true,
      nicheAlignment: true,
      viralPredictor: false,
      shadowbanDetector: false,
      keywordMap: false,
      ghostPublishing: false,
      multiChannel: false,
      teamMembers: 0,
    },
  },
  PRO: {
    monthlyVideos: -1, // Unlimited
    monthlyAvatarMinutes: 30,
    monthlyMagicClips: -1, // Unlimited
    hasWatermark: false,
    features: {
      dynamicCaptions: true,
      autoBRoll: true,
      aiAvatar: true,
      nicheAlignment: true,
      viralPredictor: true,
      shadowbanDetector: true,
      keywordMap: true,
      ghostPublishing: false,
      multiChannel: true,
      teamMembers: 0,
    },
  },
  AGENCY: {
    monthlyVideos: -1, // Unlimited
    monthlyAvatarMinutes: -1, // Unlimited
    monthlyMagicClips: -1, // Unlimited
    hasWatermark: false,
    features: {
      dynamicCaptions: true,
      autoBRoll: true,
      aiAvatar: true,
      nicheAlignment: true,
      viralPredictor: true,
      shadowbanDetector: true,
      keywordMap: true,
      ghostPublishing: true,
      multiChannel: true,
      teamMembers: 10,
    },
  },
};

export function getPlanLimits(plan: Plan): PlanLimits {
  return PLAN_LIMITS[plan];
}

export function hasFeature(
  plan: Plan,
  feature: Exclude<keyof PlanLimits['features'], 'teamMembers'>
): boolean {
  return PLAN_LIMITS[plan].features[feature];
}

export function getPlanPrice(plan: Plan, billingCycle: 'monthly' | 'yearly'): number {
  const prices: Record<Plan, { monthly: number; yearly: number }> = {
    FREE: { monthly: 0, yearly: 0 },
    CREATOR: { monthly: 19, yearly: 137 }, // 40% discount
    PRO: { monthly: 44, yearly: 317 },
    AGENCY: { monthly: 120, yearly: 864 },
  };

  return prices[plan][billingCycle];
}

export function canCreateVideo(
  plan: Plan,
  currentVideoCount: number
): boolean {
  const limits = PLAN_LIMITS[plan];
  if (limits.monthlyVideos === -1) return true;
  return currentVideoCount < limits.monthlyVideos;
}

export function canUseAvatar(
  plan: Plan,
  minutesUsed: number
): boolean {
  const limits = PLAN_LIMITS[plan];
  if (limits.monthlyAvatarMinutes === -1) return true;
  return minutesUsed < limits.monthlyAvatarMinutes;
}

export function canUseMagicClips(
  plan: Plan,
  clipsUsed: number
): boolean {
  const limits = PLAN_LIMITS[plan];
  if (limits.monthlyMagicClips === -1) return true;
  return clipsUsed < limits.monthlyMagicClips;
}
