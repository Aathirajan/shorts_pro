import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPlanLimits } from '@/lib/planLimits';

// POST /api/avatar - Create AI avatar video from script
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { script, avatarId, voiceId } = body;

    if (!script || script.trim().length === 0) {
      return NextResponse.json(
        { error: 'Script is required' },
        { status: 400 }
      );
    }

    // Mock user ID - would come from session
    const userId = 'mock-user-id';

    // Check user's plan limits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        plan: true,
        avatarMinutesUsed: true,
        avatarMinutesLimit: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has remaining avatar minutes
    if (user.avatarMinutesLimit > 0 && user.avatarMinutesUsed >= user.avatarMinutesLimit) {
      return NextResponse.json(
        { error: 'Avatar minute limit reached. Upgrade your plan for more.', code: 'LIMIT_REACHED' },
        { status: 403 }
      );
    }

    // Estimate duration (~130 words per minute)
    const wordCount = script.trim().split(/\s+/).filter(Boolean).length;
    const estimatedMinutes = wordCount / 130;

    // Check if estimated duration exceeds remaining minutes
    if (user.avatarMinutesLimit > 0) {
      const remainingMinutes = user.avatarMinutesLimit - user.avatarMinutesUsed;
      if (estimatedMinutes > remainingMinutes) {
        return NextResponse.json(
          { error: 'Script too long for remaining avatar minutes', code: 'SCRIPT_TOO_LONG' },
          { status: 403 }
        );
      }
    }

    // Create avatar job
    const job = await prisma.avatarJob.create({
      data: {
        userId,
        script,
        avatarId: avatarId || 'default',
        voiceId: voiceId || 'default',
        status: 'QUEUED',
        duration: Math.ceil(estimatedMinutes * 60), // Store in seconds
      },
    });

    // In a real implementation, this would:
    // 1. Queue a job with Inngest
    // 2. Call an AI avatar generation service (e.g., D-ID, HeyGen)
    // 3. Process the generated video
    // 4. Update the job status and return the output URL

    return NextResponse.json({
      jobId: job.id,
      estimatedDuration: Math.ceil(estimatedMinutes * 60),
      status: 'QUEUED',
    });
  } catch (error) {
    console.error('Failed to create avatar job:', error);
    return NextResponse.json(
      { error: 'Failed to create avatar job' },
      { status: 500 }
    );
  }
}

// GET /api/avatar/:jobId - Get avatar job status
export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params;

    const job = await prisma.avatarJob.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error('Failed to fetch avatar job:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}
