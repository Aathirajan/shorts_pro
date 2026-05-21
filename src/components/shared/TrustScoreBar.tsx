'use client';

import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/Progress';

interface TrustScoreBarProps {
  label: string;
  score: number;
  className?: string;
}

export function TrustScoreBar({ label, score, className }: TrustScoreBarProps) {
  const getVariant = () => {
    if (score >= 75) return 'success';
    if (score >= 50) return 'warning';
    return 'error';
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-text">{label}</span>
        <span
          className={cn(
            'text-sm font-medium',
            score >= 75 && 'text-accent-green',
            score >= 50 && score < 75 && 'text-accent-orange',
            score < 50 && 'text-accent-red'
          )}
        >
          {score}/100
        </span>
      </div>
      <Progress value={score} max={100} variant={getVariant()} size="sm" />
    </div>
  );
}
