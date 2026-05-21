'use client';

import { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/shared/StatCard';
import { ViralScoreGauge } from '@/components/shared/ViralScoreGauge';
import { ChannelWithStats } from '@/types';
import {
  Youtube,
  Plus,
  TrendingUp,
  Users,
  Eye,
  Video,
  CheckCircle,
  AlertCircle,
  Settings,
} from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';
import Link from 'next/link';

// Mock channels
const mockChannels: ChannelWithStats[] = [
  {
    id: '1',
    youtubeId: 'UC123456789',
    title: 'Tech Explained',
    description: 'Making complex technology simple and accessible',
    thumbnailUrl: null,
    subscriberCount: 125000,
    viewCount: 2500000,
    videoCount: 156,
    niche: 'Technology',
    trustScore: 87,
  },
  {
    id: '2',
    youtubeId: 'UC987654321',
    title: 'Daily Vibes',
    description: 'Daily motivation and lifestyle content',
    thumbnailUrl: null,
    subscriberCount: 45000,
    viewCount: 890000,
    videoCount: 234,
    niche: 'Lifestyle',
    trustScore: 72,
  },
];

export default function ChannelsPage() {
  const [showConnectModal, setShowConnectModal] = useState(false);

  return (
    <>
      <Topbar title="Channels" />

      <div className="flex-1 p-6 overflow-auto">
        <PageHeader
          title="Your Channels"
          description="Manage connected YouTube channels and track performance"
          actions={
            <Button onClick={() => setShowConnectModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Connect Channel
            </Button>
          }
        />

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Channels" value={mockChannels.length} />
          <StatCard
            label="Total Subscribers"
            value={mockChannels.reduce((acc, c) => acc + c.subscriberCount, 0)}
          />
          <StatCard
            label="Total Views"
            value={mockChannels.reduce((acc, c) => acc + c.viewCount, 0)}
          />
          <StatCard
            label="Avg Trust Score"
            value={Math.round(
              mockChannels.reduce((acc, c) => acc + (c.trustScore || 0), 0) /
                mockChannels.length
            )}
            delta={4.2}
          />
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockChannels.map((channel) => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      </div>
    </>
  );
}

function ChannelCard({ channel }: { channel: ChannelWithStats }) {
  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Channel Avatar */}
          <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center flex-shrink-0">
            {channel.thumbnailUrl ? (
              <img
                src={channel.thumbnailUrl}
                alt={channel.title}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <Youtube className="w-8 h-8 text-text-muted" />
            )}
          </div>

          {/* Channel Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg truncate">{channel.title}</h3>
              <CheckCircle className="w-4 h-4 text-accent-green" />
            </div>
            <p className="text-sm text-text-muted truncate">
              {channel.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="default" size="sm">{channel.niche}</Badge>
              {channel.trustScore && (
                <Badge
                  variant={
                    channel.trustScore >= 75
                      ? 'success'
                      : channel.trustScore >= 50
                      ? 'warning'
                      : 'error'
                  }
                  size="sm"
                >
                  Trust: {channel.trustScore}
                </Badge>
              )}
            </div>
          </div>

          {/* Trust Score Gauge */}
          {channel.trustScore && (
            <ViralScoreGauge
              score={channel.trustScore}
              size="md"
              showLabel={false}
            />
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
          <div>
            <div className="flex items-center gap-2 text-text-muted mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wide">Subscribers</span>
            </div>
            <p className="text-xl font-display">
              {formatNumber(channel.subscriberCount)}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-text-muted mb-1">
              <Eye className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wide">Views</span>
            </div>
            <p className="text-xl font-display">
              {formatNumber(channel.viewCount)}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-text-muted mb-1">
              <Video className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wide">Videos</span>
            </div>
            <p className="text-xl font-display">{channel.videoCount}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6">
          <Link href={`/analytics/${channel.id}`}>
            <Button variant="secondary" size="sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </Link>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </Card>
  );
}
