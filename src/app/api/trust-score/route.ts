import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getChannelVideos } from '@/lib/youtube';

// GET /api/trust-score - Get trust score for a channel
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
    const channelId = searchParams.get('channelId');

    if (!channelId) {
      return NextResponse.json(
        { error: 'Channel ID is required' },
        { status: 400 }
      );
    }

    // Verify channel belongs to user
    const channel = await prisma.channel.findUnique({
      where: { id: channelId, userId: session.user.id },
    });

    if (!channel) {
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404 }
      );
    }

    // Get the latest trust score
    const trustScore = await prisma.trustScore.findFirst({
      where: { channelId },
      orderBy: { calculatedAt: 'desc' },
    });

    if (!trustScore) {
      // Return default values if no score exists
      return NextResponse.json({
        score: 0,
        consistency: 0,
        metadata: 0,
        engagement: 0,
        trend: [],
      });
    }

    // Get historical data for trend
    const history = await prisma.trustScore.findMany({
      where: { channelId },
      orderBy: { calculatedAt: 'asc' },
      take: 30,
      select: { score: true },
    });

    return NextResponse.json({
      trustScore: {
        score: trustScore.score,
        consistency: trustScore.consistency,
        metadata: trustScore.metadata,
        engagement: trustScore.engagement,
        trend: history.map((h) => h.score),
        calculatedAt: trustScore.calculatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Failed to fetch trust score:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trust score' },
      { status: 500 }
    );
  }
}

// POST /api/trust-score - Calculate trust score for a channel
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
    const { channelId } = body;

    if (!channelId) {
      return NextResponse.json(
        { error: 'Channel ID is required' },
        { status: 400 }
      );
    }

    // Get channel data
    const channel = await prisma.channel.findUnique({
      where: { id: channelId, userId: session.user.id },
      include: {
        projects: {
          where: {
            status: 'PUBLISHED',
          },
          orderBy: {
            publishedAt: 'desc',
          },
          take: 30,
        },
      },
    });

    if (!channel) {
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404 }
      );
    }

    // Try to fetch fresh data from YouTube if token available
    let freshStats = null;
    if (channel.accessToken) {
      try {
        const videos = await getChannelVideos(channel.accessToken, 30);
        freshStats = {
          videos,
          subscriberCount: channel.subscriberCount,
          viewCount: channel.viewCount,
        };
      } catch (ytError) {
        console.warn('Failed to fetch YouTube data, using cached:', ytError);
      }
    }

    // Calculate scores
    const consistency = calculateConsistencyScore(channel.projects);
    const metadata = calculateMetadataScore(channel);
    const engagement = calculateEngagementScore(channel, freshStats);
    const overallScore = Math.round((consistency + metadata + engagement) / 3);

    // Save the score
    const trustScore = await prisma.trustScore.create({
      data: {
        channelId,
        score: overallScore,
        consistency,
        metadata,
        engagement,
      },
    });

    return NextResponse.json({ trustScore });
  } catch (error) {
    console.error('Failed to calculate trust score:', error);
    return NextResponse.json(
      { error: 'Failed to calculate trust score' },
      { status: 500 }
    );
  }
}

function calculateConsistencyScore(projects: { publishedAt: Date | null }[]): number {
  if (projects.length < 2) return 50;

  const publishedProjects = projects.filter(p => p.publishedAt);
  if (publishedProjects.length < 2) return 50;

  // Calculate average days between uploads
  const intervals: number[] = [];
  for (let i = 1; i < publishedProjects.length; i++) {
    const current = publishedProjects[i - 1].publishedAt!;
    const previous = publishedProjects[i].publishedAt!;
    const days = (current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24);
    if (days >= 0) {
      intervals.push(days);
    }
  }

  if (intervals.length === 0) return 50;

  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const variance = intervals.reduce((sum, val) => sum + Math.pow(val - avgInterval, 2), 0) / intervals.length;
  const stdDev = Math.sqrt(variance);

  // Lower standard deviation = higher consistency
  const consistency = Math.max(0, Math.min(100, 100 - stdDev * 10));
  return Math.round(consistency);
}

function calculateMetadataScore(channel: {
  title: string;
  description: string | null;
  keywords: string[];
}): number {
  let score = 50;

  // Check if channel has description (min 50 chars)
  if (channel.description && channel.description.length > 50) {
    score += 25;
  }

  // Check if channel has keywords/tags
  if (channel.keywords && channel.keywords.length > 0) {
    score += 25;
  }

  return Math.min(100, score);
}

function calculateEngagementScore(
  channel: { subscriberCount: number; viewCount: number },
  freshStats?: { videos: any[]; subscriberCount: number; viewCount: number } | null
): number {
  // Use fresh stats if available
  const stats = freshStats || {
    videos: [],
    subscriberCount: channel.subscriberCount,
    viewCount: channel.viewCount,
  };

  if (stats.subscriberCount === 0) return 50;

  // Calculate average views per video
  const avgViews = stats.videos.length > 0
    ? stats.videos.reduce((sum, v) => sum + (v.viewCount || 0), 0) / stats.videos.length
    : stats.viewCount / Math.max(stats.subscriberCount, 1);

  // Engagement rate based on avg views per subscriber
  const engagementRate = avgViews / stats.subscriberCount;
  const normalizedScore = Math.min(100, engagementRate * 100);

  return Math.round(normalizedScore);
}
