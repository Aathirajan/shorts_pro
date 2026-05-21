'use client';

import { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ViralScoreGauge } from '@/components/shared/ViralScoreGauge';
import { NicheAlignmentBadge } from '@/components/shared/NicheAlignmentBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { useProjects } from '@/hooks/useProjects';
import {
  Film,
  Play,
  Edit,
  Trash2,
  Grid3X3,
  List,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import { cn, formatRelativeTime, formatDuration } from '@/lib/utils';
import { ProjectWithRelations } from '@/types';

type ViewMode = 'grid' | 'list';
type FilterStatus = 'all' | 'draft' | 'ready' | 'published';

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filter, setFilter] = useState<FilterStatus>('all');
  const { projects, isLoading, deleteProject } = useProjects();

  const filteredProjects = projects.filter((project) => {
    if (filter === 'all') return true;
    return project.status.toLowerCase() === filter;
  });

  const handleDelete = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(projectId);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
      DRAFT: 'default',
      PROCESSING: 'warning',
      READY: 'success',
      SCHEDULED: 'info',
      PUBLISHED: 'success',
      FAILED: 'error',
    };
    return variants[status] || 'default';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Topbar title="Projects" />

      <div className="flex-1 p-6 overflow-auto">
        <PageHeader
          title="All Projects"
          description="Manage your video projects and drafts"
          actions={
            <Link href="/projects/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </Link>
          }
        />

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {(['all', 'draft', 'ready', 'published'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={cn(
                  'px-3 py-1.5 rounded-button text-sm font-medium transition-colors',
                  filter === status
                    ? 'bg-text text-surface'
                    : 'bg-surface text-text-muted hover:text-text'
                )}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-button transition-colors',
                viewMode === 'grid'
                  ? 'bg-surface-2 text-text'
                  : 'text-text-muted hover:text-text'
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-button transition-colors',
                viewMode === 'list'
                  ? 'bg-surface-2 text-text'
                  : 'text-text-muted hover:text-text'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Projects Grid/List */}
        {filteredProjects.length === 0 ? (
          <EmptyState
            icon={Film}
            title="No projects found"
            description="Create your first project to get started."
            action={{
              label: 'Create Project',
              onClick: () => (window.location.href = '/projects/new'),
            }}
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <Card className="overflow-hidden">
            <div className="divide-y divide-border">
              {filteredProjects.map((project) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  getStatusBadge={getStatusBadge}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </Card>
        )}
      </div>
    </>
  );
}

function ProjectCard({ project }: { project: ProjectWithRelations }) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="group overflow-hidden hover:shadow-card-hover transition-all">
        <div className="aspect-video bg-surface-2 relative">
          {project.thumbnailUrl ? (
            <img
              src={project.thumbnailUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Film className="w-8 h-8 text-text-muted" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Play className="w-12 h-12 text-white" />
          </div>
          {project.duration && (
            <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {formatDuration(project.duration)}
            </span>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-medium text-text truncate">{project.title}</h3>
          <p className="text-xs text-text-muted mt-1">
            {formatRelativeTime(project.createdAt)}
          </p>

          <div className="flex items-center gap-2 mt-3">
            <Badge variant="default" size="sm">
              {project.status.toLowerCase()}
            </Badge>
            {project.viralScore && (
              <Badge variant="success" size="sm">
                Score: {project.viralScore}
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

function ProjectRow({
  project,
  getStatusBadge,
  onDelete,
}: {
  project: ProjectWithRelations;
  getStatusBadge: (status: string) => 'default' | 'success' | 'warning' | 'error' | 'info';
  onDelete: (projectId: string) => void;
}) {
  return (
    <div className="flex items-center gap-4 p-4 hover:bg-surface-2/50 transition-colors">
      {/* Thumbnail */}
      <Link href={`/projects/${project.id}`}>
        <div className="w-24 h-14 bg-surface-2 rounded overflow-hidden flex-shrink-0 relative group">
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
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Play className="w-6 h-6 text-white" />
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link href={`/projects/${project.id}`}>
          <p className="font-medium text-text truncate hover:text-accent-blue">
            {project.title}
          </p>
        </Link>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span>{formatRelativeTime(project.createdAt)}</span>
          {project.duration && (
            <>
              <span>·</span>
              <span>{formatDuration(project.duration)}</span>
            </>
          )}
        </div>
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
        <Badge variant={getStatusBadge(project.status)} size="sm">
          {project.status.toLowerCase()}
        </Badge>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Link href={`/projects/${project.id}/edit`}>
          <button className="p-2 text-text-muted hover:text-text rounded-button hover:bg-surface-2">
            <Edit className="w-4 h-4" />
          </button>
        </Link>
        <button
          onClick={() => onDelete(project.id)}
          className="p-2 text-text-muted hover:text-accent-red rounded-button hover:bg-surface-2"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
