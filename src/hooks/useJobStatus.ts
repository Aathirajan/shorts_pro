'use client';

import { useState, useEffect, useCallback } from 'react';

type JobType = 'RenderJob' | 'MagicClipJob' | 'AvatarJob';
type JobStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

interface JobState {
  id: string;
  status: JobStatus;
  progress: number;
  error: string | null;
  outputUrl?: string;
  renderUrl?: string;
  clips?: any[];
}

interface UseJobStatusOptions {
  jobId: string | null;
  jobType: JobType;
  pollInterval?: number;
  onComplete?: (job: JobState) => void;
  onError?: (error: string) => void;
}

export function useJobStatus({
  jobId,
  jobType,
  pollInterval = 2000,
  onComplete,
  onError,
}: UseJobStatusOptions) {
  const [job, setJob] = useState<JobState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStatus = useCallback(async () => {
    if (!jobId) return;

    setIsLoading(true);
    try {
      let endpoint = '';
      switch (jobType) {
        case 'RenderJob':
          endpoint = `/api/projects/${jobId}/render/status`;
          break;
        case 'MagicClipJob':
          endpoint = `/api/magic-clips/${jobId}`;
          break;
        case 'AvatarJob':
          endpoint = `/api/avatar/${jobId}`;
          break;
      }

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Failed to fetch status');

      const data = await response.json();
      setJob(data);

      if (data.status === 'COMPLETED') {
        onComplete?.(data);
      } else if (data.status === 'FAILED') {
        onError?.(data.error || 'Job failed');
      }
    } catch (error) {
      console.error('Failed to fetch job status:', error);
    } finally {
      setIsLoading(false);
    }
  }, [jobId, jobType, onComplete, onError]);

  useEffect(() => {
    if (!jobId) {
      setJob(null);
      return;
    }

    // Initial fetch
    fetchStatus();

    // Poll while job is active
    const interval = setInterval(() => {
      if (job?.status === 'COMPLETED' || job?.status === 'FAILED') {
        clearInterval(interval);
        return;
      }
      fetchStatus();
    }, pollInterval);

    return () => clearInterval(interval);
  }, [jobId, fetchStatus, pollInterval, job?.status]);

  return {
    job,
    isLoading,
    refresh: fetchStatus,
  };
}
