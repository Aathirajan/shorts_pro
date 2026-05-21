import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getYouTubeAuthUrl,
  exchangeCode,
  getChannelInfo,
  scheduleTokenRefresh,
} from '@/lib/youtube';
import { prisma } from '@/lib/prisma';

// GET /api/youtube/auth - Get OAuth URL
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = getYouTubeAuthUrl(session.user.id);
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Failed to get auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to get auth URL' },
      { status: 500 }
    );
  }
}

// POST /api/youtube/callback - Handle OAuth callback
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
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code required' },
        { status: 400 }
      );
    }

    // Exchange code for tokens
    const tokens = await exchangeCode(code);

    // Get channel info
    const channelInfo = await getChannelInfo(tokens.access_token);

    // Check if channel already exists
    const existingChannel = await prisma.channel.findUnique({
      where: { youtubeId: channelInfo.youtubeId },
    });

    if (existingChannel) {
      // Update tokens
      await prisma.channel.update({
        where: { id: existingChannel.id },
        data: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          tokenExpiresAt: new Date(tokens.expiry_date),
        },
      });

      return NextResponse.json({ channel: existingChannel });
    }

    // Create new channel
    const channel = await prisma.channel.create({
      data: {
        userId: session.user.id,
        youtubeId: channelInfo.youtubeId,
        title: channelInfo.title,
        description: channelInfo.description,
        thumbnailUrl: channelInfo.thumbnailUrl,
        subscriberCount: channelInfo.subscriberCount,
        viewCount: channelInfo.viewCount,
        videoCount: channelInfo.videoCount,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiresAt: new Date(tokens.expiry_date),
      },
    });

    return NextResponse.json({ channel });
  } catch (error) {
    console.error('Failed to connect channel:', error);
    return NextResponse.json(
      { error: 'Failed to connect channel' },
      { status: 500 }
    );
  }
}
