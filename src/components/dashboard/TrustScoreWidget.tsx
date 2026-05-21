'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { TrustScoreBar } from '@/components/shared/TrustScoreBar';
import { Button } from '@/components/ui/Button';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { cn, getTrustScoreLabel } from '@/lib/utils';

interface TrustScoreWidgetProps {
  score: number;
  consistency: number;
  metadata: number;
  engagement: number;
  trend: number[];
  className?: string;
}

export function TrustScoreWidget({
  score,
  consistency,
  metadata,
  engagement,
  trend,
  className,
}: TrustScoreWidgetProps) {
  const label = getTrustScoreLabel(score);

  return (
    <Card className={cn('p-6', className)}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">
            Channel Trust Score
          </p>
          <div className="flex items-baseline gap-3">
            <span
              className={cn(
                'text-5xl font-display font-light',
                score >= 75 && 'text-accent-green',
                score >= 50 && score < 75 && 'text-accent-orange',
                score < 50 && 'text-accent-red'
              )}
            >
              {score}
            </span>
            <span className="text-sm text-text-muted">/ 100</span>
          </div>
          <p className="text-sm text-text mt-1">{label}</p>
        </div>

        {/* Trend indicator */}
        <div className="flex items-center gap-1 text-accent-green">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">+{trend[trend.length - 1] - trend[0]}%</span>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="space-y-4 mb-6">
        <TrustScoreBar label="Upload Consistency" score={consistency} />
        <TrustScoreBar label="Metadata Accuracy" score={metadata} />
        <TrustScoreBar label="Engagement Signals" score={engagement} />
      </div>

      <Link href="/analytics">
        <Button variant="ghost" className="w-full">
          View detailed analytics
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </Card>
  );
}
