import { NextRequest, NextResponse } from 'next/server';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

// Initialize R2 client
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT || '',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'ytshortspro';

// POST /api/upload - Get signed URL for file upload
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filename, contentType } = body;

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'Filename and content type are required' },
        { status: 400 }
      );
    }

    // Validate content type
    const allowedTypes = [
      'video/mp4',
      'video/quicktime',
      'video/avi',
      'video/x-matroska',
      'video/webm',
      'audio/mpeg',
      'audio/wav',
      'image/jpeg',
      'image/png',
    ];

    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      );
    }

    // Mock user ID - would come from session
    const userId = 'mock-user-id';

    // Generate unique filename
    const timestamp = Date.now();
    const uniqueFilename = `${userId}/${timestamp}-${filename}`;

    // Create signed URL for upload
    const putCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: uniqueFilename,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(r2Client, putCommand, {
      expiresIn: 3600, // 1 hour
    });

    // Construct public URL
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${uniqueFilename}`;

    return NextResponse.json({
      uploadUrl,
      fileUrl: publicUrl,
      key: uniqueFilename,
    });
  } catch (error) {
    console.error('Failed to generate upload URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
