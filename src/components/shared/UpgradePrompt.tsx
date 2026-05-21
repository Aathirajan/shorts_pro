'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Sparkles } from 'lucide-react';

interface UpgradePromptProps {
  feature: string;
  description?: string;
  currentPlan: string;
  requiredPlan: string;
  className?: string;
}

export function UpgradePrompt({
  feature,
  description,
  currentPlan,
  requiredPlan,
  className,
}: UpgradePromptProps) {
  return (
    <div
      className={cn(
        'bg-surface rounded-card border border-border p-6 text-center',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-accent-orange/20 flex items-center justify-center mx-auto mb-4">
        <Sparkles className="w-6 h-6 text-accent-orange" />
      </div>

      <h3 className="font-display text-lg text-text mb-2">
        Upgrade to use {feature}
      </h3>

      {description && (
        <p className="text-sm text-text-muted mb-4 max-w-sm mx-auto">
          {description}
        </p>
      )}

      <div className="flex items-center justify-center gap-2 text-sm mb-4">
        <span className="text-text-muted">Current:</span>
        <span className="font-medium text-text">{currentPlan}</span>
        <span className="text-text-muted">→</span>
        <span className="font-medium text-accent-green">{requiredPlan}</span>
      </div>

      <Link href="/settings/billing">
        <Button>Upgrade Now</Button>
      </Link>
    </div>
  );
}
