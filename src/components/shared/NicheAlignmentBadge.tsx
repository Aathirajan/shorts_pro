'use client';

import { cn } from '@/lib/utils';

type NicheStatus = 'aligned' | 'warning' | 'blocked';

interface NicheAlignmentBadgeProps {
  status: NicheStatus;
  percentage?: number;
  className?: string;
}

export function NicheAlignmentBadge({
  status,
  percentage,
  className,
}: NicheAlignmentBadgeProps) {
  const config = {
    aligned: {
      bg: 'bg-accent-green/20',
      text: 'text-accent-green',
      label: 'Aligned',
    },
    warning: {
      bg: 'bg-accent-orange/20',
      text: 'text-accent-orange',
      label: 'Off-niche risk',
    },
    blocked: {
      bg: 'bg-accent-red/20',
      text: 'text-accent-red',
      label: 'Suppression likely',
    },
  };

  const { bg, text, label } = config[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 rounded-pill text-xs font-medium',
        bg,
        text,
        className
      )}
    >
      {percentage !== undefined && (
        <span className="mr-1">{Math.round(percentage)}%</span>
      )}
      {label}
    </span>
  );
}
