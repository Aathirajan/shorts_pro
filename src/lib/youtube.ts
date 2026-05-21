import { google } from 'googleapis';
import { prisma } from './prisma';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
);

const youtube = google.youtube({
  version: 'v3',
  auth: oauth2Client,
});

// Get YouTube auth URL for channel connection
export function getYouTubeAuthUrl(userId: string): string {
  const scopes = [
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube',
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state: userId,
    prompt: 'consent',
  });

  return url;
}

// Exchange code for tokens
export async function exchangeCode(code: string): Promise<{
  access_token: string;
  refresh_token: string;
  expiry_date: number;
}> {
  const { tokens } = await oauth2Client.getToken(code);

  if (!tokens.access_token || !tokens.refresh_token) {
    throw new Error('Failed to get tokens');
  }

  return {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expiry_date: tokens.expiry_date || Date.now() + 3600 * 1000,
  };
}

// Refresh access token
export async function refreshAccessToken(refreshToken: string): Promise<{
  access_token: string;
  expiry_date: number;
}> {
  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  const { credentials } = await oauth2Client.refreshAccessToken();

  return {
    access_token: credentials.access_token || '',
    expiry_date: credentials.expiry_date || Date.now() + 3600 * 1000,
  };
}

// Get channel info
export async function getChannelInfo(accessToken: string) {
  oauth2Client.setCredentials({ access_token: accessToken });

  const response = await youtube.channels.list({
    part: ['snippet', 'statistics', 'contentDetails'],
    mine: true,
  });

  const channel = response.data.items?.[0];
  if (!channel) {
    throw new Error('No channel found');
  }

  return {
    youtubeId: channel.id || '',
    title: channel.snippet?.title || '',
    description: channel.snippet?.description || '',
    thumbnailUrl: channel.snippet?.thumbnails?.high?.url || '',
    subscriberCount: channel.statistics?.subscriberCount
      ? parseInt(channel.statistics.subscriberCount)
      : 0,
    viewCount: channel.statistics?.viewCount
      ? parseInt(channel.statistics.viewCount)
      : 0,
    videoCount: channel.statistics?.videoCount
      ? parseInt(channel.statistics.videoCount)
      : 0,
  };
}

// Upload video to YouTube
export async function uploadVideo(
  accessToken: string,
  videoPath: string,
  metadata: {
    title: string;
    description: string;
    tags: string[];
    categoryId: string;
    privacyStatus: 'public' | 'unlisted' | 'private';
  }
): Promise<string> {
  oauth2Client.setCredentials({ access_token: accessToken });

  const response = await youtube.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title: metadata.title,
        description: metadata.description,
        tags: metadata.tags,
        categoryId: metadata.categoryId,
      },
      status: {
        privacyStatus: metadata.privacyStatus,
        selfDeclaredMadeForKids: false,
      },
    },
    media: {
      body: require('fs').createReadStream(videoPath),
    },
  });

  return response.data.id || '';
}

// Get video analytics
export async function getVideoAnalytics(
  accessToken: string,
  videoId: string
) {
  oauth2Client.setCredentials({ access_token: accessToken });

  const response = await youtube.videos.list({
    part: ['statistics'],
    id: [videoId],
  });

  const video = response.data.items?.[0];
  if (!video) {
    throw new Error('Video not found');
  }

  return {
    viewCount: video.statistics?.viewCount
      ? parseInt(video.statistics.viewCount)
      : 0,
    likeCount: video.statistics?.likeCount
      ? parseInt(video.statistics.likeCount)
      : 0,
    commentCount: video.statistics?.commentCount
      ? parseInt(video.statistics.commentCount)
      : 0,
  };
}

// Get channel videos
export async function getChannelVideos(
  accessToken: string,
  maxResults: number = 50
) {
  oauth2Client.setCredentials({ access_token: accessToken });

  // Get uploads playlist ID
  const channelResponse = await youtube.channels.list({
    part: ['contentDetails'],
    mine: true,
  });

  const uploadsPlaylistId =
    channelResponse.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

  if (!uploadsPlaylistId) {
    return [];
  }

  // Get videos from uploads playlist
  const playlistResponse = await youtube.playlistItems.list({
    part: ['snippet', 'contentDetails'],
    playlistId: uploadsPlaylistId,
    maxResults,
  });

  const videoIds =
    playlistResponse.data.items?.map(
      (item) => item.contentDetails?.videoId || ''
    ) || [];

  // Get detailed video info
  const videosResponse = await youtube.videos.list({
    part: ['snippet', 'statistics'],
    id: videoIds,
  });

  return (
    videosResponse.data.items?.map((video) => ({
      id: video.id || '',
      title: video.snippet?.title || '',
      description: video.snippet?.description || '',
      publishedAt: video.snippet?.publishedAt || '',
      viewCount: video.statistics?.viewCount
        ? parseInt(video.statistics.viewCount)
        : 0,
      likeCount: video.statistics?.likeCount
        ? parseInt(video.statistics.likeCount)
        : 0,
      commentCount: video.statistics?.commentCount
        ? parseInt(video.statistics.commentCount)
        : 0,
    })) || []
  );
}

// Schedule token refresh
export async function scheduleTokenRefresh(channelId: string) {
  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
  });

  if (!channel?.refreshToken || !channel.tokenExpiresAt) {
    return;
  }

  // Refresh if expiring in less than 1 hour
  const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
  if (channel.tokenExpiresAt < oneHourFromNow) {
    const { access_token, expiry_date } = await refreshAccessToken(
      channel.refreshToken
    );

    await prisma.channel.update({
      where: { id: channelId },
      data: {
        accessToken: access_token,
        tokenExpiresAt: new Date(expiry_date),
      },
    });
  }
}
