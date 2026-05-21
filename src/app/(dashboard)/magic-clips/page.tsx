'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { EmptyState } from '@/components/shared/EmptyState';
import { MagicClip } from '@/types';
import { Link as LinkIcon, Play, Clock, Download, Scissors, Film } from 'lucide-react';
import { cn, formatDuration } from '@/lib/utils';

// Mock extracted clips
const mockClips: MagicClip[] = [
  {
    id: '1',
    startTime: 120,
    endTime: 165,
    duration: 45,
    thumbnailUrl: null,
    retentionScore: 94,
  },
  {
    id: '2',
    startTime: 245,
    endTime: 295,
    duration: 50,
    thumbnailUrl: null,
    retentionScore: 89,
  },
  {
    id: '3',
    startTime: 420,
    endTime: 470,
    duration: 50,
    thumbnailUrl: null,
    retentionScore: 85,
  },
  {
    id: '4',
    startTime: 580,
    endTime: 625,
    duration: 45,
    thumbnailUrl: null,
    retentionScore: 82,
  },
  {
    id: '5',
    startTime: 720,
    endTime: 770,
    duration: 50,
    thumbnailUrl: null,
    retentionScore: 78,
  },
];

export default function MagicClipsPage() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedClips, setSelectedClips] = useState<string[]>([]);

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
      clearInterval(interval);
    }, 5500);
  };

  const toggleClipSelection = (clipId: string) => {
    setSelectedClips((prev) =>
      prev.includes(clipId)
        ? prev.filter((id) => id !== clipId)
        : [...prev, clipId]
    );
  };

  const handleExport = () => {
    router.push('/projects/1/edit');
  };

  return (
    <>
      <Topbar title="Magic Clips" />

      <div className="flex-1 p-6 overflow-auto">
        <PageHeader
          title="AI Magic Clips"
          description="Extract the most viral moments from any YouTube video"
        />

        {!showResults ? (
          <div className="max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Paste YouTube URL</CardTitle>
                <p className="text-sm text-text-muted">
                  We'll analyze the video and extract the top 5 most engaging moments
                </p>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleExtract} className="space-y-6">
                  <div className="flex gap-3">
                    <Input
                      placeholder="https://youtube.com/watch?v=..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="flex-1"
                      icon={<LinkIcon className="w-4 h-4" />}
                      required
                    />
                    <Button type="submit" isLoading={isLoading}>
                      <Scissors className="w-4 h-4 mr-2" />
                      Extract
                    </Button>
                  </div>

                  {isLoading && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted">Analyzing video...</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} />
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <Clock className="w-3 h-3" />
                        <span>Transcribing audio with Whisper...</span>
                      </div>
                    </div>
                  )}
                </form>

                {/* Supported platforms */}
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-xs text-text-muted uppercase tracking-wide mb-3">
                    Supported platforms
                  </p>
                  <div className="flex gap-4">
                    {['YouTube', 'TikTok', 'Instagram'].map((platform) => (
                      <span
                        key={platform}
                        className="px-3 py-1.5 bg-surface-2 rounded-button text-sm text-text-muted"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent extractions */}
            <div className="mt-8">
              <h3 className="font-display text-lg mb-4">Recent Extractions</h3>
              <EmptyState
                icon={Film}
                title="No recent extractions"
                description="Extract clips from a video to see them here"
              />
            </div>
          </div>
        ) : (
          <div>
            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-xl">Top 5 Viral Moments</h3>
                <p className="text-sm text-text-muted">
                  Extracted from your video · {selectedClips.length} selected
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setShowResults(false)}>
                  Extract Another
                </Button>
                {selectedClips.length > 0 && (
                  <Button onClick={handleExport}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Selected
                  </Button>
                )}
              </div>
            </div>

            {/* Clips grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockClips.map((clip, index) => (
                <ClipCard
                  key={clip.id}
                  clip={clip}
                  rank={index + 1}
                  isSelected={selectedClips.includes(clip.id)}
                  onToggle={() => toggleClipSelection(clip.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function ClipCard({
  clip,
  rank,
  isSelected,
  onToggle,
}: {
  clip: MagicClip;
  rank: number;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const getRankColor = () => {
    if (rank === 1) return 'bg-accent-green text-white';
    if (rank === 2) return 'bg-accent-orange text-white';
    if (rank === 3) return 'bg-accent-blue text-white';
    return 'bg-surface-2 text-text-muted';
  };

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all',
        isSelected && 'ring-2 ring-text'
      )}
      onClick={onToggle}
    >
      <div className="aspect-video bg-surface-2 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <Film className="w-8 h-8 text-text-muted" />
        </div>

        {/* Rank badge */}
        <div
          className={cn(
            'absolute top-3 left-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
            getRankColor()
          )}
        >
          #{rank}
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {formatDuration(clip.duration)}
        </div>

        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play className="w-10 h-10 text-white" />
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-text flex items-center justify-center">
            <svg className="w-4 h-4 text-surface" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-text">Clip {rank}</p>
            <p className="text-xs text-text-muted">
              {formatDuration(clip.startTime)} - {formatDuration(clip.endTime)}
            </p>
          </div>
          <Badge variant="success" size="sm">
            {clip.retentionScore}% retention
          </Badge>
        </div>
      </div>
    </Card>
  );
}
