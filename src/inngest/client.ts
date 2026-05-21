import { Inngest } from 'inngest';
import { prisma } from '@/lib/prisma';

// Create Inngest client
export const inngest = new Inngest({
  id: 'ytshortspro',
  name: 'YTShortsPro',
  eventKey: process.env.INNGEST_EVENT_KEY,
});

// Helper to track job progress
export async function updateJobProgress(
  jobId: string,
  jobType: 'RenderJob' | 'AvatarJob' | 'MagicClipJob',
  progress: number
) {
  const model = prisma[jobType.toLowerCase() as keyof typeof prisma] as any;
  await model.update({
    where: { id: jobId },
    data: { progress },
  });
}

// Helper to complete job
export async function completeJob(
  jobId: string,
  jobType: 'RenderJob' | 'AvatarJob' | 'MagicClipJob',
  outputUrl: string
) {
  const model = prisma[jobType.toLowerCase() as keyof typeof prisma] as any;
  await model.update({
    where: { id: jobId },
    data: {
      status: 'COMPLETED',
      progress: 100,
      outputUrl,
      completedAt: new Date(),
    },
  });
}

// Helper to fail job
export async function failJob(
  jobId: string,
  jobType: 'RenderJob' | 'AvatarJob' | 'MagicClipJob',
  error: string
) {
  const model = prisma[jobType.toLowerCase() as keyof typeof prisma] as any;
  await model.update({
    where: { id: jobId },
    data: {
      status: 'FAILED',
      error,
    },
  });
}
