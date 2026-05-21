'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ViralScoreGauge } from '@/components/shared/ViralScoreGauge';
import { NicheAlignmentBadge } from '@/components/shared/NicheAlignmentBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { ProjectWithRelations } from '@/types';
import { Film, ArrowRight } from 'lucide-react';
import { cn, formatRelativeTime } from '@/lib/utils';

interface RecentProjectsProps {
  projects: ProjectWithRelations[];
  className?: string;
}

export function RecentProjects({ projects, className }: RecentProjectsProps) {
  if (projects.length === 0) {
    return (
      <Card className={cn('p-6', className)}>
        <EmptyState
          icon={Film}
          title="No projects yet"
          description="Create your first project to get started with AI-powered video creation."
          action={{
            label: 'Create Project',
            onClick: () => (window.location.href = '/projects/new'),
          }}
        />
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
      DRAFT: 'default',
      PROCESSING: 'warning',
      READY: 'success',
      SCHEDULED: 'info',
      PUBLISHED: 'success',
      FAILED: 'error',
    };
    return (
      <Badge variant={variants[status] || 'default'} size="sm">
        {status.toLowerCase()}
      </Badge>
    );
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-display text-lg">Recent Projects</h3>
        <Link
          href="/projects"
          className="text-sm text-text-muted hover:text-text flex items-center transition-colors"
        >
          View all
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="divide-y divide-border">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="flex items-center gap-4 p-4 hover:bg-surface-2/50 transition-colors"
          >
            {/* Thumbnail */}
            <div className="w-16 h-9 bg-surface-2 rounded overflow-hidden flex-shrink-0">
              {project.thumbnailUrl ? (
                <img
                  src={project.thumbnailUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Film className="w-4 h-4 text-text-muted" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text truncate">
                {project.title}
              </p>
              <p className="text-xs text-text-muted">
                {formatRelativeTime(project.createdAt)}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              {project.viralScore !== null && (
                <ViralScoreGauge score={project.viralScore} size="sm" showLabel={false} />
              )}
              {project.nicheAlignment !== null && (
                <NicheAlignmentBadge
                  status={
                    project.nicheAlignment >= 0.75
                      ? 'aligned'
                      : project.nicheAlignment >= 0.6
                      ? 'warning'
                      : 'blocked'
                  }
                  percentage={project.nicheAlignment * 100}
                />
              )}
              {getStatusBadge(project.status)}
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
