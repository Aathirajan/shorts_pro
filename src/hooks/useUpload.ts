'use client';

import { useState, useCallback } from 'react';

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface UseUploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
}

export function useUpload(options: UseUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);

  const upload = useCallback(
    async (file: File, fileType: 'video' | 'audio' | 'image') => {
      setIsUploading(true);
      setProgress(null);

      try {
        // Get presigned URL
        const presignedResponse = await fetch('/api/upload/presigned', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            fileType,
          }),
        });

        if (!presignedResponse.ok) {
          throw new Error('Failed to get upload URL');
        }

        const { uploadUrl, publicUrl } = await presignedResponse.json();

        // Upload file to R2
        const xhr = new XMLHttpRequest();

        return new Promise<string>((resolve, reject) => {
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const progressData = {
                loaded: event.loaded,
                total: event.total,
                percentage: Math.round((event.loaded / event.total) * 100),
              };
              setProgress(progressData);
              options.onProgress?.(progressData);
            }
          });

          xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
              options.onSuccess?.(publicUrl);
              resolve(publicUrl);
            } else {
              const error = new Error('Upload failed');
              options.onError?.(error);
              reject(error);
            }
          });

          xhr.addEventListener('error', () => {
            const error = new Error('Upload failed');
            options.onError?.(error);
            reject(error);
          });

          xhr.open('PUT', uploadUrl);
          xhr.setRequestHeader('Content-Type', file.type);
          xhr.send(file);
        });
      } finally {
        setIsUploading(false);
        setProgress(null);
      }
    },
    [options]
  );

  return {
    upload,
    isUploading,
    progress,
  };
}
