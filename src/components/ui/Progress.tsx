'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: 'sm' | 'md';
  variant?: 'default' | 'success' | 'warning' | 'error';
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, size = 'md', variant = 'default', ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const sizes = {
      sm: 'h-1.5',
      md: 'h-2',
    };

    const variants = {
      default: 'bg-accent-blue',
      success: 'bg-accent-green',
      warning: 'bg-accent-orange',
      error: 'bg-accent-red',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'w-full overflow-hidden rounded-full bg-surface-2',
          sizes[size],
          className
        )}
        {...props}
      >
        <div
          className={cn('h-full transition-all duration-300', variants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress };
