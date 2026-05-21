import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPresignedUploadUrl, generateFileKey } from '@/lib/r2';

// POST /api/upload/presigned - Get presigned URL for upload
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
    const { filename, contentType, fileType } = body;

    if (!filename || !contentType || !fileType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate file key
    const key = generateFileKey(
      session.user.id,
      fileType,
      filename
    );

    // Generate presigned URL (valid for 1 hour)
    const uploadUrl = await getPresignedUploadUrl(key, contentType, 3600);

    // Return public URL that will be available after upload
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    return NextResponse.json({
      uploadUrl,
      publicUrl,
      key,
    });
  } catch (error) {
    console.error('Failed to generate presigned URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
