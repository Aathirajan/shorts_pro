'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Wand2, UserCircle, Upload, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function QuickAction({ href, icon, title, description }: QuickActionProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-start gap-4 p-4 rounded-card',
        'bg-surface border border-border',
        'hover:border-text hover:shadow-card-hover',
        'transition-all duration-200'
      )}
    >
      <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-text">{title}</h4>
        <p className="text-sm text-text-muted">{description}</p>
      </div>
    </Link>
  );
}

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
  const actions = [
    {
      href: '/projects/new',
      icon: <Upload className="w-5 h-5 text-text" />,
      title: 'Upload Video',
      description: 'Upload and edit your own footage',
    },
    {
      href: '/magic-clips',
      icon: <LinkIcon className="w-5 h-5 text-text" />,
      title: 'Magic Clips',
      description: 'Extract viral moments from any URL',
    },
    {
      href: '/avatar-studio',
      icon: <UserCircle className="w-5 h-5 text-text" />,
      title: 'AI Avatar',
      description: 'Generate talking head from script',
    },
  ];

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-4', className)}>
      {actions.map((action) => (
        <QuickAction key={action.title} {...action} />
      ))}
    </div>
  );
}
