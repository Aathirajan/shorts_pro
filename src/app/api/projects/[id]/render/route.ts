import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { inngest } from '@/inngest/client';

// POST /api/projects/[id]/render - Trigger video render
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: projectId } = params;

    // Get project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
      include: {
        captions: true,
        audioTracks: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    if (!project.sourceVideoUrl) {
      return NextResponse.json(
        { error: 'No video to render' },
        { status: 400 }
      );
    }

    // Create render job
    const renderJob = await prisma.renderJob.create({
      data: {
        userId: session.user.id,
        projectId,
        status: 'QUEUED',
        progress: 0,
      },
    });

    // Update project status
    await prisma.project.update({
      where: { id: projectId },
      data: { status: 'PROCESSING' },
    });

    // Trigger Inngest function
    await inngest.send({
      name: 'video/render.requested',
      data: {
        projectId,
        userId: session.user.id,
        jobId: renderJob.id,
      },
    });

    return NextResponse.json({
      jobId: renderJob.id,
      status: 'QUEUED',
    });
  } catch (error) {
    console.error('Failed to trigger render:', error);
    return NextResponse.json(
      { error: 'Failed to trigger render' },
      { status: 500 }
    );
  }
}

// GET /api/projects/[id]/render/status - Get render status
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: projectId } = params;

    // Get latest render job for project
    const renderJob = await prisma.renderJob.findFirst({
      where: {
        projectId,
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!renderJob) {
      return NextResponse.json(
        { error: 'No render job found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      jobId: renderJob.id,
      status: renderJob.status,
      progress: renderJob.progress,
      renderUrl: renderJob.renderUrl,
      error: renderJob.error,
    });
  } catch (error) {
    console.error('Failed to get render status:', error);
    return NextResponse.json(
      { error: 'Failed to get render status' },
      { status: 500 }
    );
  }
}
