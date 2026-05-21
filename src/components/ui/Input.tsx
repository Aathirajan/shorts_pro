'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text mb-1.5">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex w-full rounded-button border border-border bg-surface px-3 py-2',
            'text-sm text-text placeholder:text-text-muted',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-accent-red focus-visible:ring-accent-red',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-accent-red">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
