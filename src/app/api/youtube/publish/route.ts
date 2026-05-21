import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadVideo, getVideoAnalytics, scheduleTokenRefresh } from '@/lib/youtube';
import { prisma } from '@/lib/prisma';

// POST /api/youtube/publish - Publish video to YouTube
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { projectId, privacyStatus = 'public' } = body;

    // Get project details
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
      include: {
        channel: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    if (!project.channel) {
      return NextResponse.json(
        { error: 'No channel connected' },
        { status: 400 }
      );
    }

    if (!project.renderUrl) {
      return NextResponse.json(
        { error: 'Video not rendered yet' },
        { status: 400 }
      );
    }

    // Ensure token is fresh
    await scheduleTokenRefresh(project.channel.id);

    // Get updated channel with fresh token
    const channel = await prisma.channel.findUnique({
      where: { id: project.channel.id },
    });

    if (!channel?.accessToken) {
      return NextResponse.json(
        { error: 'Channel not authorized' },
        { status: 400 }
      );
    }

    // Download video from R2 to temp file
    const videoResponse = await fetch(project.renderUrl);
    const videoBuffer = await videoResponse.arrayBuffer();
    const tempPath = `/tmp/${projectId}.mp4`;
    await require('fs').promises.writeFile(tempPath, Buffer.from(videoBuffer));

    // Upload to YouTube
    const videoId = await uploadVideo(channel.accessToken, tempPath, {
      title: project.title,
      description: project.description || '',
      tags: project.tags || [],
      categoryId: project.categoryId || '22', // People & Blogs
      privacyStatus,
    });

    // Update project
    await prisma.project.update({
      where: { id: projectId },
      data: {
        youtubeVideoId: videoId,
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    // Clean up temp file
    await require('fs').promises.unlink(tempPath).catch(() => {});

    return NextResponse.json({
      success: true,
      videoId,
      url: `https://youtube.com/shorts/${videoId}`,
    });
  } catch (error) {
    console.error('Failed to publish video:', error);
    return NextResponse.json(
      { error: 'Failed to publish video' },
      { status: 500 }
    );
  }
}

// GET /api/youtube/analytics - Get YouTube analytics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID required' },
        { status: 400 }
      );
    }

    // Get project with channel
    const project = await prisma.project.findFirst({
      where: {
        youtubeVideoId: videoId,
        userId: session.user.id,
      },
      include: {
        channel: true,
      },
    });

    if (!project?.channel?.accessToken) {
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404 }
      );
    }

    // Ensure token is fresh
    await scheduleTokenRefresh(project.channel.id);

    // Get updated channel
    const channel = await prisma.channel.findUnique({
      where: { id: project.channel.id },
    });

    if (!channel?.accessToken) {
      return NextResponse.json(
        { error: 'Channel not authorized' },
        { status: 400 }
      );
    }

    const analytics = await getVideoAnalytics(channel.accessToken, videoId);

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Failed to get analytics:', error);
    return NextResponse.json(
      { error: 'Failed to get analytics' },
      { status: 500 }
    );
  }
}
