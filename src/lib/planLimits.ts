import { prisma } from './prisma';
import { Plan } from '@prisma/client';

export interface PlanLimits {
  videosPerMonth: number;
  avatarMinutesPerMonth: number;
  magicClipsPerMonth: number;
  viralPredictor: boolean;
  nicheAlignment: boolean;
  shadowbanDetector: boolean;
  watermark: boolean;
  multiChannel: boolean;
}

const planLimitsMap: Record<Plan, PlanLimits> = {
  FREE: {
    videosPerMonth: 3,
    avatarMinutesPerMonth: 0,
    magicClipsPerMonth: 0,
    viralPredictor: false,
    nicheAlignment: false,
    shadowbanDetector: false,
    watermark: true,
    multiChannel: false,
  },
  CREATOR: {
    videosPerMonth: 20,
    avatarMinutesPerMonth: 10,
    magicClipsPerMonth: 20,
    viralPredictor: false,
    nicheAlignment: true,
    shadowbanDetector: false,
    watermark: false,
    multiChannel: false,
  },
  PRO: {
    videosPerMonth: Infinity,
    avatarMinutesPerMonth: 30,
    magicClipsPerMonth: Infinity,
    viralPredictor: true,
    nicheAlignment: true,
    shadowbanDetector: true,
    watermark: false,
    multiChannel: false,
  },
  AGENCY: {
    videosPerMonth: Infinity,
    avatarMinutesPerMonth: Infinity,
    magicClipsPerMonth: Infinity,
    viralPredictor: true,
    nicheAlignment: true,
    shadowbanDetector: true,
    watermark: false,
    multiChannel: true,
  },
};

export async function getPlanLimits(userId: string): Promise<PlanLimits & { plan: Plan }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return {
    ...planLimitsMap[user.plan],
    plan: user.plan,
  };
}

export function getPlanLimitsSync(plan: Plan): PlanLimits {
  return planLimitsMap[plan];
}

export async function checkFeatureAccess(
  userId: string,
  feature: keyof PlanLimits
): Promise<{ allowed: boolean; reason?: string }> {
  const limits = await getPlanLimits(userId);

  if (typeof limits[feature] === 'boolean') {
    if (!limits[feature]) {
      return {
        allowed: false,
        reason: 'This feature is not available on your current plan. Upgrade to access it.',
      };
    }
    return { allowed: true };
  }

  // For numeric limits, check usage
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      avatarMinutesUsed: true,
      magicClipsUsed: true,
    },
  });

  if (!user) {
    return { allowed: false, reason: 'User not found' };
  }

  if (feature === 'avatarMinutesPerMonth' && limits.avatarMinutesPerMonth !== Infinity) {
    if (user.avatarMinutesUsed >= limits.avatarMinutesPerMonth) {
      return {
        allowed: false,
        reason: 'Avatar minute limit reached. Upgrade your plan for more.',
      };
    }
  }

  if (feature === 'magicClipsPerMonth' && limits.magicClipsPerMonth !== Infinity) {
    if (user.magicClipsUsed >= limits.magicClipsPerMonth) {
      return {
        allowed: false,
        reason: 'Magic clips limit reached. Upgrade your plan for more.',
      };
    }
  }

  return { allowed: true };
}
