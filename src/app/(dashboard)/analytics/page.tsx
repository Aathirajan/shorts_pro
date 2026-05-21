'use client';

import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/shared/StatCard';
import { TrustScoreBar } from '@/components/shared/TrustScoreBar';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

// Mock data
const trustScoreHistory = [
  { date: 'Mar 1', score: 72 },
  { date: 'Mar 5', score: 75 },
  { date: 'Mar 10', score: 78 },
  { date: 'Mar 15', score: 80 },
  { date: 'Mar 20', score: 84 },
  { date: 'Mar 21', score: 87 },
];

const uploadConsistency = [
  { date: 'Week 1', uploads: 3 },
  { date: 'Week 2', uploads: 5 },
  { date: 'Week 3', uploads: 4 },
  { date: 'Week 4', uploads: 6 },
];

const engagementData = [
  { date: 'Mar 1', views: 1200, likes: 85, comments: 12 },
  { date: 'Mar 5', views: 1800, likes: 120, comments: 18 },
  { date: 'Mar 10', views: 2400, likes: 165, comments: 24 },
  { date: 'Mar 15', views: 3200, likes: 210, comments: 32 },
  { date: 'Mar 20', views: 4100, likes: 285, comments: 45 },
  { date: 'Mar 21', views: 4800, likes: 340, comments: 52 },
];

export default function AnalyticsPage() {
  return (
    <>
      <Topbar title="Analytics" />

      <div className="flex-1 p-6 overflow-auto">
        <PageHeader
          title="Channel Analytics"
          description="Track your channel performance and Trust Score"
        />

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Trust Score"
            value={87}
            delta={4.2}
            deltaLabel="vs last month"
            sparklineData={[72, 75, 78, 80, 84, 87]}
          />
          <StatCard
            label="Total Views"
            value={17500}
            delta={23.5}
            deltaLabel="vs last month"
          />
          <StatCard
            label="Avg Engagement"
            value={7.2}
            suffix="%"
            delta={1.5}
            deltaLabel="vs last month"
          />
          <StatCard
            label="Videos Published"
            value={18}
            delta={12.5}
            deltaLabel="vs last month"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trust Score History */}
          <Card className="p-6">
            <h3 className="font-display text-lg mb-4">Trust Score History</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trustScoreHistory}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4ADE80" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E0" />
                  <XAxis dataKey="date" stroke="#888884" fontSize={12} />
                  <YAxis domain={[0, 100]} stroke="#888884" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E4E4E0',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#4ADE80"
                    fillOpacity={1}
                    fill="url(#colorScore)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Score Breakdown */}
          <Card className="p-6">
            <h3 className="font-display text-lg mb-4">Score Breakdown</h3>
            <div className="space-y-6">
              <TrustScoreBar label="Upload Consistency" score={91} />
              <TrustScoreBar label="Metadata Accuracy" score={78} />
              <TrustScoreBar label="Engagement Signals" score={84} />
              <TrustScoreBar label="Content Quality" score={86} />
              <TrustScoreBar label="Audience Retention" score={82} />
            </div>
          </Card>

          {/* Engagement Over Time */}
          <Card className="p-6">
            <h3 className="font-display text-lg mb-4">Engagement Over Time</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E0" />
                  <XAxis dataKey="date" stroke="#888884" fontSize={12} />
                  <YAxis stroke="#888884" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E4E4E0',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#60A5FA"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="likes"
                    stroke="#4ADE80"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Upload Consistency */}
          <Card className="p-6">
            <h3 className="font-display text-lg mb-4">Upload Consistency</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={uploadConsistency}>
                  <defs>
                    <linearGradient id="colorUploads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E0" />
                  <XAxis dataKey="date" stroke="#888884" fontSize={12} />
                  <YAxis stroke="#888884" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E4E4E0',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="uploads"
                    stroke="#60A5FA"
                    fillOpacity={1}
                    fill="url(#colorUploads)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
