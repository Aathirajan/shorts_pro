'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Bell, Crown } from 'lucide-react';

interface TopbarProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function Topbar({ title, description, actions, className }: TopbarProps) {
  return (
    <header
      className={cn(
        'h-16 bg-surface border-b border-border flex items-center justify-between px-6',
        className
      )}
    >
      <div>
        <h1 className="font-display text-xl text-text">{title}</h1>
        {description && (
          <p className="text-sm text-text-muted">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Plan Badge */}
        <Badge variant="success" className="hidden sm:flex">
          <Crown className="w-3 h-3 mr-1" />
          Pro
        </Badge>

        {/* Notifications */}
        <button className="relative p-2 text-text-muted hover:text-text transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-red rounded-full" />
        </button>

        {/* New Project Button */}
        <Link href="/projects/new">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            New Project
          </Button>
        </Link>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-surface-2 border border-border flex items-center justify-center">
          <span className="text-sm font-medium text-text">U</span>
        </div>
      </div>
    </header>
  );
}
