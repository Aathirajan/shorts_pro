'use client';

import { Topbar } from '@/components/layout/Topbar';
import { StatCard } from '@/components/shared/StatCard';
import {
  TrustScoreWidget,
  RecentProjects,
  QuickActions,
} from '@/components/dashboard';
import { useProjects } from '@/hooks/useProjects';
import { useSession } from 'next-auth/react';
import { Spinner } from '@/components/ui';

export default function DashboardPage() {
  const { data: session } = useSession();
  const { projects, isLoading: projectsLoading } = useProjects();

  // Calculate stats from real data
  const avgTrustScore = projects.length > 0
    ? Math.round(projects.reduce((acc, p) => acc + (p.viralScore || 50), 0) / projects.length)
    : 0;

  const avgViralScore = projects.length > 0
    ? Math.round(projects.reduce((acc, p) => acc + (p.viralScore || 0), 0) / projects.length)
    : 0;

  // Get published projects for trust score calculation
  const publishedProjects = projects.filter(p => p.status === 'PUBLISHED');

  if (projectsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Topbar title="Dashboard" />

      <div className="flex-1 p-6 overflow-auto">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Trust Score"
            value={avgTrustScore || '--'}
            delta={4.2}
            deltaLabel="vs last month"
            sparklineData={[72, 75, 78, 80, 84, avgTrustScore || 87]}
          />
          <StatCard
            label="Viral Predictor Avg"
            value={avgViralScore || '--'}
            delta={8.5}
            deltaLabel="vs last month"
          />
          <StatCard
            label="Idea to Post Time"
            value={9}
            suffix=" min"
            delta={-12}
            deltaLabel="vs last month"
          />
          <StatCard
            label="Niche Lift"
            value={2.1}
            suffix="x"
            delta={0.3}
            deltaLabel="vs last month"
          />
        </div>

        {/* Quick Actions */}
        <QuickActions className="mb-6" />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentProjects projects={projects} />
          </div>

          <div>
            <TrustScoreWidget
              score={avgTrustScore || 0}
              consistency={85}
              metadata={78}
              engagement={82}
              trend={[72, 75, 78, 80, 84, avgTrustScore || 87]}
            />
          </div>
        </div>
      </div>
    </>
  );
}
