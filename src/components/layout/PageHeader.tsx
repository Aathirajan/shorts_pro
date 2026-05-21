'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  backHref,
  backLabel,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex items-center text-sm text-text-muted hover:text-text mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          {backLabel || 'Back'}
        </Link>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl text-text">{title}</h1>
          {description && (
            <p className="text-sm text-text-muted mt-1">{description}</p>
          )}
        </div>

        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}
