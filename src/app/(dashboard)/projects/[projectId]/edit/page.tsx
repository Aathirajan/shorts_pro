'use client';

import { useState, useCallback } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Timeline } from '@/components/editor/Timeline';
import { VideoPreview } from '@/components/editor/VideoPreview';
import { cn, formatDuration } from '@/lib/utils';
import Link from 'next/link';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Type,
  Image,
  Music,
  Wand2,
  Zap,
  Scissors,
  Save,
  Eye,
  CheckCircle,
  AlertCircle,
  Undo2,
  Redo2,
  Download,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

interface ProjectClip {
  id: string;
  trackId: string;
  startTime: number;
  duration: number;
  name: string;
  type: 'video' | 'broll' | 'audio' | 'caption';
}

interface ProjectTrack {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'caption';
  clips: ProjectClip[];
}

// Mock project data
const mockProject = {
  id: '1',
  title: '10 AI Tools That Will Change Your Life',
  duration: 58,
  status: 'DRAFT',
  viralScore: 82,
};

// Mock timeline tracks
const mockTracks = [
  {
    id: 'video-1',
    name: 'Video',
    type: 'video' as const,
    clips: [
      { id: 'v1', trackId: 'video-1', startTime: 0, duration: 15, name: 'Intro', type: 'video' as const },
      { id: 'v2', trackId: 'video-1', startTime: 15, duration: 20, name: 'B-Roll 1', type: 'broll' as const },
      { id: 'v3', trackId: 'video-1', startTime: 35, duration: 23, name: 'Main Content', type: 'video' as const },
    ],
  },
  {
    id: 'audio-1',
    name: 'Voiceover',
    type: 'audio' as const,
    clips: [
      { id: 'a1', trackId: 'audio-1', startTime: 0, duration: 58, name: 'Voiceover', type: 'audio' as const },
    ],
  },
  {
    id: 'audio-2',
    name: 'Music',
    type: 'audio' as const,
    clips: [
      { id: 'a2', trackId: 'audio-2', startTime: 0, duration: 58, name: 'Background Music', type: 'audio' as const },
    ],
  },
  {
    id: 'captions-1',
    name: 'Captions',
    type: 'caption' as const,
    clips: [
      { id: 'c1', trackId: 'captions-1', startTime: 0, duration: 3, name: 'These 10 AI tools', type: 'caption' as const },
      { id: 'c2', trackId: 'captions-1', startTime: 3, duration: 3, name: 'will completely change', type: 'caption' as const },
      { id: 'c3', trackId: 'captions-1', startTime: 6, duration: 3, name: 'how you work', type: 'caption' as const },
      { id: 'c4', trackId: 'captions-1', startTime: 9, duration: 4, name: 'Let me show you why', type: 'caption' as const },
    ],
  },
];

const mockCaptions = [
  { id: '1', text: 'These 10 AI tools', startTime: 0, endTime: 3, style: 'bold' as const },
  { id: '2', text: 'will completely change', startTime: 3, endTime: 6, style: 'bold' as const },
  { id: '3', text: 'how you work', startTime: 6, endTime: 9, style: 'bold' as const },
  { id: '4', text: 'Let me show you why', startTime: 9, endTime: 13, style: 'bold' as const },
];

export default function ProjectEditorPage({
  params,
}: {
  params: { projectId: string };
}) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('captions');
  const [zoom, setZoom] = useState(1);
  const [showAudit, setShowAudit] = useState(false);
  const [tracks, setTracks] = useState<ProjectTrack[]>(mockTracks);

  const handleTimeChange = useCallback((time: number) => {
    setCurrentTime(Math.max(0, Math.min(mockProject.duration, time)));
  }, []);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleSeek = useCallback((time: number) => {
    setCurrentTime(Math.max(0, Math.min(mockProject.duration, time)));
  }, []);

  const handleClipMove = useCallback((clipId: string, newStartTime: number) => {
    setTracks((prev) =>
      prev.map((track) => ({
        ...track,
        clips: track.clips.map((clip) =>
          clip.id === clipId ? { ...clip, startTime: newStartTime } : clip
        ),
      }))
    );
  }, []);

  const handleClipDelete = useCallback((clipId: string) => {
    setTracks((prev) =>
      prev.map((track) => ({
        ...track,
        clips: track.clips.filter((clip) => clip.id !== clipId),
      }))
    );
  }, []);

  const handleClipSplit = useCallback((clipId: string, splitTime: number) => {
    setTracks((prev) =>
      prev.map((track) => {
        const clipIndex = track.clips.findIndex((c) => c.id === clipId);
        if (clipIndex === -1) return track;

        const clip = track.clips[clipIndex];
        const splitPoint = splitTime - clip.startTime;

        if (splitPoint <= 0 || splitPoint >= clip.duration) return track;

        const firstClip = { ...clip, duration: splitPoint };
        const secondClip = {
          ...clip,
          id: `${clip.id}-split`,
          startTime: clip.startTime + splitPoint,
          duration: clip.duration - splitPoint,
        };

        const newClips = [...track.clips];
        newClips.splice(clipIndex, 1, firstClip, secondClip);

        return { ...track, clips: newClips };
      })
    );
  }, []);

  return (
    <>
      <Topbar title="Video Editor" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Editor Header */}
        <div className="h-14 bg-surface border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/projects" className="text-text-muted hover:text-text">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-medium text-sm">{mockProject.title}</h1>
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span>{formatDuration(currentTime)} / {formatDuration(mockProject.duration)}</span>
                <Badge variant="default" size="sm">{mockProject.status}</Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-text-muted hover:text-text rounded-button hover:bg-surface-2">
              <Undo2 className="w-4 h-4" />
            </button>
            <button className="p-2 text-text-muted hover:text-text rounded-button hover:bg-surface-2">
              <Redo2 className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-border mx-2" />
            <Button variant="secondary" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShowAudit(!showAudit)}>
              <Eye className="w-4 h-4 mr-2" />
              Audit
            </Button>
            <Button size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Tools */}
          <div className="w-16 bg-surface border-r border-border flex flex-col items-center py-4 gap-2">
            {[
              { id: 'captions', icon: Type, label: 'Captions' },
              { id: 'broll', icon: Image, label: 'B-Roll' },
              { id: 'audio', icon: Music, label: 'Audio' },
              { id: 'ai', icon: Wand2, label: 'AI Tools' },
              { id: 'effects', icon: Zap, label: 'Effects' },
            ].map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTab(tool.id)}
                className={cn(
                  'w-12 h-12 rounded-button flex flex-col items-center justify-center gap-1 transition-colors',
                  activeTab === tool.id
                    ? 'bg-surface-2 text-text'
                    : 'text-text-muted hover:text-text hover:bg-surface-2/50'
                )}
              >
                <tool.icon className="w-5 h-5" />
                <span className="text-[10px]">{tool.label}</span>
              </button>
            ))}
          </div>

          {/* Center - Preview + Tools Panel */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Video Preview */}
            <div className="flex-1 bg-bg flex items-center justify-center p-4">
              <VideoPreview
                currentTime={currentTime}
                duration={mockProject.duration}
                isPlaying={isPlaying}
                captions={mockCaptions}
                onTimeChange={handleTimeChange}
                onPlayPause={handlePlayPause}
                onSeek={handleSeek}
              />
            </div>

            {/* Tools Panel */}
            <div className="h-64 bg-surface border-t border-border">
              <div className="h-10 border-b border-border flex items-center px-4">
                <span className="text-sm font-medium capitalize">
                  {activeTab} Tools
                </span>
              </div>
              <div className="p-4 overflow-auto">
                {activeTab === 'captions' && <CaptionsPanel />}
                {activeTab === 'broll' && <BRollPanel />}
                {activeTab === 'audio' && <AudioPanel />}
                {activeTab === 'ai' && <AIToolsPanel />}
                {activeTab === 'effects' && <EffectsPanel />}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Audit Panel (Collapsible) */}
          {showAudit && <AuditPanel />}
        </div>

        {/* Bottom - Timeline */}
        <div className="h-64 bg-surface border-t border-border">
          <Timeline
            duration={mockProject.duration}
            tracks={tracks}
            currentTime={currentTime}
            isPlaying={isPlaying}
            zoom={zoom}
            onTimeChange={handleTimeChange}
            onPlayPause={handlePlayPause}
            onClipMove={handleClipMove}
            onClipResize={(id, duration) => console.log('resize', id, duration)}
            onClipDelete={handleClipDelete}
            onClipSplit={handleClipSplit}
          />
        </div>
      </div>
    </>
  );
}

// Tool Panels
function CaptionsPanel() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Dynamic Captions</h4>
        <Button size="sm">
          <Sparkles className="w-4 h-4 mr-2" />
          Auto-Generate
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {['Bold', 'Minimal', 'Neon', 'Subtitle'].map((style) => (
          <button
            key={style}
            className="p-3 border border-border rounded-button text-left hover:border-text transition-colors"
          >
            <p className="font-medium">{style}</p>
            <p className="text-xs text-text-muted">Style preset</p>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="rounded border-border" defaultChecked />
          Add emojis automatically
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="rounded border-border" defaultChecked />
          Highlight power words
        </label>
      </div>
    </div>
  );
}

function BRollPanel() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Auto B-Roll</h4>
        <Button size="sm">
          <Sparkles className="w-4 h-4 mr-2" />
          Auto-Add
        </Button>
      </div>

      <div className="text-sm text-text-muted">
        AI will analyze your transcript and automatically add relevant B-roll footage at optimal moments.
      </div>

      <div className="border border-border rounded-card p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">B-Roll Frequency</span>
          <span className="text-sm text-text-muted">Every 3 seconds</span>
        </div>
        <input type="range" className="w-full" min="1" max="10" defaultValue="3" />
      </div>
    </div>
  );
}

function AudioPanel() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Audio Mix</h4>
        <Button variant="secondary" size="sm">
          <Music className="w-4 h-4 mr-2" />
          Add Music
        </Button>
      </div>

      {[
        { label: 'Voiceover', value: 80 },
        { label: 'Background Music', value: 30 },
        { label: 'Sound Effects', value: 60 },
      ].map((track) => (
        <div key={track.label} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>{track.label}</span>
            <span className="text-text-muted">{track.value}%</span>
          </div>
          <input
            type="range"
            className="w-full"
            min="0"
            max="100"
            defaultValue={track.value}
          />
        </div>
      ))}

      <div className="flex items-center gap-2 pt-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="rounded border-border" defaultChecked />
          Enable audio ducking
        </label>
      </div>
    </div>
  );
}

function AIToolsPanel() {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">AI Enhancement</h4>

      <div className="grid grid-cols-4 gap-3">
        {[
          { name: 'Magic Clips', desc: 'Extract best moments' },
          { name: 'Smart Cut', desc: 'Remove dead air' },
          { name: 'Auto Zoom', desc: 'Add zoom effects' },
          { name: 'AI Avatar', desc: 'Generate talking head' },
        ].map((tool) => (
          <button
            key={tool.name}
            className="p-3 border border-border rounded-button text-left hover:border-text transition-colors"
          >
            <p className="font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-green" />
              {tool.name}
            </p>
            <p className="text-xs text-text-muted">{tool.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function EffectsPanel() {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">Visual Effects</h4>

      <div className="grid grid-cols-6 gap-2">
        {[
          'None',
          'Cinematic',
          'Vibrant',
          'Vintage',
          'B&W',
          'Film',
        ].map((effect) => (
          <button
            key={effect}
            className="p-3 border border-border rounded-button text-center hover:border-text transition-colors"
          >
            <div className="w-8 h-8 bg-surface-2 rounded mx-auto mb-2" />
            <span className="text-xs">{effect}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function AuditPanel() {
  return (
    <div className="w-80 bg-surface border-l border-border flex flex-col">
      <div className="h-14 border-b border-border flex items-center justify-between px-4">
        <span className="font-medium">Algorithmic Audit</span>
        <Badge variant="success">Ready</Badge>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Hook Strength */}
        <div className="p-4 bg-surface-2 rounded-card">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Hook Strength</span>
            <span className="text-accent-green font-bold">8/10</span>
          </div>
          <div className="w-full h-2 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-accent-green" style={{ width: '80%' }} />
          </div>
          <p className="text-xs text-text-muted mt-2">Strong opening, engaging hook</p>
        </div>

        {/* Niche Alignment */}
        <div className="p-4 bg-surface-2 rounded-card">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Niche Alignment</span>
            <span className="text-accent-green font-bold">85%</span>
          </div>
          <div className="w-full h-2 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-accent-green" style={{ width: '85%' }} />
          </div>
          <p className="text-xs text-text-muted mt-2">Well aligned with channel history</p>
        </div>

        {/* Shadowban Check */}
        <div className="p-4 bg-surface-2 rounded-card">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-accent-green" />
            <span className="font-medium">Shadowban Check</span>
          </div>
          <p className="text-xs text-text-muted">No policy violations detected</p>
        </div>

        {/* Viral Predictor */}
        <div className="p-4 bg-surface-2 rounded-card">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Viral Score</span>
            <span className="text-accent-green font-bold text-2xl">82</span>
          </div>
          <p className="text-xs text-text-muted">High potential for Shorts Feed</p>
        </div>

        {/* Recommendations */}
        <div>
          <h5 className="font-medium mb-3">Recommendations</h5>
          <div className="space-y-2">
            {[
              'Add more text hooks at 0:15',
              'Increase pacing in middle section',
              'Add trending sound effect',
            ].map((rec, i) => (
              <div
                key={i}
                className="flex items-start gap-2 p-2 bg-surface-2 rounded"
              >
                <AlertCircle className="w-4 h-4 text-accent-orange flex-shrink-0 mt-0.5" />
                <span className="text-sm">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
