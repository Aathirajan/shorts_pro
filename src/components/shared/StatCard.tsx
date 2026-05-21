'use client';

import { Card } from '@/components/ui/Card';
import { DeltaChip } from './DeltaChip';
import { cn, formatNumber } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number | string;
  delta?: number;
  deltaLabel?: string;
  prefix?: string;
  suffix?: string;
  sparklineData?: number[];
  className?: string;
}

export function StatCard({
  label,
  value,
  delta,
  deltaLabel,
  prefix = '',
  suffix = '',
  sparklineData,
  className,
}: StatCardProps) {
  const displayValue = typeof value === 'number' ? formatNumber(value) : value;

  // Simple sparkline SVG
  const renderSparkline = () => {
    if (!sparklineData || sparklineData.length < 2) return null;

    const min = Math.min(...sparklineData);
    const max = Math.max(...sparklineData);
    const range = max - min || 1;
    const width = 80;
    const height = 30;

    const points = sparklineData.map((val, i) => {
      const x = (i / (sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    });

    const isPositive = sparklineData[sparklineData.length - 1] >= sparklineData[0];
    const color = isPositive ? '#4ADE80' : '#F87171';

    return (
      <svg
        width={width}
        height={height}
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50"
        viewBox={`0 0 ${width} ${height}`}
      >
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points.join(' ')}
        />
      </svg>
    );
  };

  return (
    <Card className={cn('p-5 relative overflow-hidden', className)}>
      {renderSparkline()}
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
          {label}
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-display font-light text-text">
            {prefix}
            {displayValue}
            {suffix}
          </span>
        </div>

        {delta !== undefined && (
          <DeltaChip value={delta} label={deltaLabel} />
        )}
      </div>
    </Card>
  );
}
