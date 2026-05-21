'use client';

import { cn, getViralScoreColor } from '@/lib/utils';

interface ViralScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ViralScoreGauge({
  score,
  size = 'md',
  showLabel = true,
  className,
}: ViralScoreGaugeProps) {
  const sizes = {
    sm: { width: 40, strokeWidth: 4, fontSize: 10 },
    md: { width: 60, strokeWidth: 5, fontSize: 14 },
    lg: { width: 120, strokeWidth: 8, fontSize: 28 },
  };

  const { width, strokeWidth, fontSize } = sizes[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const colorClass = getViralScoreColor(score);
  const colorMap: Record<string, string> = {
    'text-accent-green': '#4ADE80',
    'text-accent-orange': '#FB923C',
    'text-accent-red': '#F87171',
  };
  const strokeColor = colorMap[colorClass] || '#888884';

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative" style={{ width, height: width / 2 }}>
        <svg
          width={width}
          height={width / 2}
          className="transform -rotate-90"
        >
          {/* Background arc */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            stroke="#E4E4E0"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference / 2} ${circumference}`}
          />
          {/* Progress arc */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference / 2} ${circumference}`}
            strokeDashoffset={offset}
            className="transition-all duration-500"
          />
        </svg>
        <div
          className="absolute inset-0 flex items-end justify-center pb-1"
          style={{ paddingBottom: size === 'lg' ? '8px' : '4px' }}
        >
          <span
            className={cn('font-display font-medium', colorClass)}
            style={{ fontSize }}
          >
            {score}
          </span>
        </div>
      </div>
      {showLabel && (
        <span className="text-[10px] text-text-muted mt-1">Viral Score</span>
      )}
    </div>
  );
}
