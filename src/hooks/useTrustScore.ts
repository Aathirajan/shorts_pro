import { useQuery } from '@tanstack/react-query';

interface TrustScoreData {
  score: number;
  consistency: number;
  metadata: number;
  engagement: number;
  trend: number[];
  calculatedAt: string;
}

interface ChannelTrustScoreResponse {
  trustScore: TrustScoreData;
}

export function useTrustScore(channelId?: string) {
  const { data, isLoading, error } = useQuery<ChannelTrustScoreResponse>({
    queryKey: ['trustScore', channelId],
    queryFn: async () => {
      if (!channelId) {
        throw new Error('Channel ID is required');
      }
      const response = await fetch(`/api/trust-score?channelId=${channelId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch trust score');
      }
      return response.json();
    },
    enabled: !!channelId,
  });

  return {
    trustScore: data?.trustScore,
    isLoading,
    error,
  };
}
