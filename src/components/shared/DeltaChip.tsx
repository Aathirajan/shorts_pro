'use client';

import { cn } from '@/lib/utils';

interface DeltaChipProps {
  value: number;
  label?: string;
  className?: string;
}

export function DeltaChip({ value, label, className }: DeltaChipProps) {
  const isPositive = value >= 0;
  const absValue = Math.abs(value);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span
        className={cn(
          'inline-flex items-center px-2 py-0.5 rounded-pill text-xs font-medium',
          isPositive
            ? 'bg-accent-green/20 text-accent-green'
            : 'bg-accent-red/20 text-accent-red'
        )}
      >
        <span className="mr-0.5">{isPositive ? '↑' : '↓'}</span>
        {absValue.toFixed(1)}%
      </span>
      {label && (
        <span className="text-xs text-text-muted">{label}</span>
      )}
    </div>
  );
}
