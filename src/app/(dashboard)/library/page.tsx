'use client';

import { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/shared/EmptyState';
import { cn, formatDuration } from '@/lib/utils';
import {
  Music,
  Video,
  Image as ImageIcon,
  Upload,
  Search,
  Filter,
  Grid3X3,
  List,
  Play,
  MoreHorizontal,
} from 'lucide-react';

// Mock assets
const mockAssets = [
  {
    id: '1',
    name: 'Upbeat Intro.mp3',
    type: 'audio',
    duration: 15,
    size: 2457600,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: '2',
    name: 'City Night B-Roll.mp4',
    type: 'video',
    duration: 32,
    size: 12582912,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
  {
    id: '3',
    name: 'Subscribe Animation.mp4',
    type: 'video',
    duration: 3,
    size: 524288,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
  },
  {
    id: '4',
    name: 'Notification Sound.mp3',
    type: 'audio',
    duration: 2,
    size: 81920,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
  },
  {
    id: '5',
    name: 'Thumbnail Template.png',
    type: 'image',
    size: 1048576,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120),
  },
];

const categories = [
  { id: 'all', label: 'All Assets', icon: Grid3X3 },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'audio', label: 'Audio', icon: Music },
  { id: 'image', label: 'Images', icon: ImageIcon },
];

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredAssets = mockAssets.filter((asset) => {
    const matchesSearch = asset.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === 'all' || asset.type === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-6 h-6" />;
      case 'audio':
        return <Music className="w-6 h-6" />;
      case 'image':
        return <ImageIcon className="w-6 h-6" />;
      default:
        return <Grid3X3 className="w-6 h-6" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <Topbar title="Library" />

      <div className="flex-1 p-6 overflow-auto">
        <PageHeader
          title="Asset Library"
          description="Manage your royalty-free assets, B-roll, and custom uploads"
          actions={
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload Asset
            </Button>
          }
        />

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-button text-sm font-medium transition-colors',
                  activeCategory === category.id
                    ? 'bg-text text-surface'
                    : 'bg-surface text-text-muted hover:text-text'
                )}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  'pl-9 pr-4 py-1.5 rounded-button border border-border bg-surface',
                  'text-sm text-text placeholder:text-text-muted',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue',
                  'w-64'
                )}
              />
            </div>

            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-button',
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
                'p-2 rounded-button',
                viewMode === 'list'
                  ? 'bg-surface-2 text-text'
                  : 'text-text-muted hover:text-text'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Assets */}
        {filteredAssets.length === 0 ? (
          <EmptyState
            icon={activeCategory === 'audio' ? Music : activeCategory === 'video' ? Video : ImageIcon}
            title="No assets found"
            description="Upload your first asset to get started"
            action={{
              label: 'Upload Asset',
              onClick: () => {},
            }}
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredAssets.map((asset) => (
              <Card
                key={asset.id}
                className="group cursor-pointer hover:shadow-card-hover transition-all"
              >
                <div className="aspect-square bg-surface-2 flex items-center justify-center relative">
                  {getAssetIcon(asset.type)}

                  {'duration' in asset && asset.duration && (
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {formatDuration(asset.duration)}
                    </span>
                  )}

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div className="p-3">
                  <p className="text-sm font-medium text-text truncate">
                    {asset.name}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-text-muted capitalize">
                      {asset.type}
                    </span>
                    <span className="text-xs text-text-muted">
                      {formatFileSize(asset.size)}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="overflow-hidden">
            <div className="divide-y divide-border">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center gap-4 p-4 hover:bg-surface-2/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-surface-2 rounded flex items-center justify-center">
                    {getAssetIcon(asset.type)}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium text-text">{asset.name}</p>
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <span className="capitalize">{asset.type}</span>
                      {'duration' in asset && asset.duration && (
                        <>
                          <span>·</span>
                          <span>{formatDuration(asset.duration)}</span>
                        </>
                      )}
                      <span>·</span>
                      <span>{formatFileSize(asset.size)}</span>
                    </div>
                  </div>

                  <button className="p-2 text-text-muted hover:text-text rounded-button hover:bg-surface-2">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
