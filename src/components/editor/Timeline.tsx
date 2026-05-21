'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useDragControls, PanInfo } from 'framer-motion';
import { cn, formatDuration } from '@/lib/utils';
import {
  Scissors,
  Trash2,
  Copy,
  GripVertical,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TimelineClip {
  id: string;
  trackId: string;
  startTime: number;
  duration: number;
  name: string;
  color?: string;
  thumbnailUrl?: string;
  type: 'video' | 'audio' | 'caption' | 'broll';
}

interface TimelineTrack {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'caption';
  clips: TimelineClip[];
  isMuted?: boolean;
  volume?: number;
}

interface TimelineProps {
  duration: number; // Total duration in seconds
  tracks: TimelineTrack[];
  currentTime: number;
  isPlaying: boolean;
  zoom: number;
  onTimeChange: (time: number) => void;
  onPlayPause: () => void;
  onClipMove: (clipId: string, newStartTime: number) => void;
  onClipResize: (clipId: string, newDuration: number) => void;
  onClipDelete: (clipId: string) => void;
  onClipSplit: (clipId: string, splitTime: number) => void;
}

const TRACK_HEIGHT = 64;
const RULER_HEIGHT = 32;
const HEADER_WIDTH = 120;
const MIN_CLIP_WIDTH = 40;
const PIXELS_PER_SECOND = 10; // Base scale

export function Timeline({
  duration,
  tracks,
  currentTime,
  isPlaying,
  zoom,
  onTimeChange,
  onPlayPause,
  onClipMove,
  onClipResize,
  onClipDelete,
  onClipSplit,
}: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [hoverTime, setHoverTime] = useState<number | null>(null);

  const pixelsPerSecond = PIXELS_PER_SECOND * zoom;
  const timelineWidth = duration * pixelsPerSecond;

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!containerRef.current || isDraggingPlayhead) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - HEADER_WIDTH + containerRef.current.scrollLeft;
    const time = Math.max(0, Math.min(duration, x / pixelsPerSecond));
    onTimeChange(time);
  };

  const handlePlayheadDrag = (_: unknown, info: PanInfo) => {
    if (!containerRef.current) return;

    const newTime = Math.max(0, Math.min(duration, currentTime + info.delta.x / pixelsPerSecond));
    onTimeChange(newTime);
  };

  const generateTimeMarkers = () => {
    const markers = [];
    const step = zoom < 0.5 ? 10 : zoom < 1 ? 5 : 1;

    for (let i = 0; i <= duration; i += step) {
      markers.push(
        <div
          key={i}
          className="absolute top-0 bottom-0 border-l border-border"
          style={{ left: i * pixelsPerSecond }}
        >
          <span className="absolute top-1 left-1 text-[10px] text-text-muted font-mono">
            {formatDuration(i)}
          </span>
        </div>
      );
    }
    return markers;
  };

  return (
    <div className="flex flex-col h-full bg-surface border-t border-border">
      {/* Timeline Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onPlayPause}>
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <div className="h-6 w-px bg-border mx-2" />
          <Button variant="ghost" size="sm">
            <SkipBack className="w-4 h-4" />
          </Button>
          <span className="text-sm font-mono text-text w-20 text-center">
            {formatDuration(currentTime)}
          </span>
          <span className="text-text-muted">/</span>
          <span className="text-sm font-mono text-text-muted w-20 text-center">
            {formatDuration(duration)}
          </span>
          <Button variant="ghost" size="sm">
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" disabled={zoom <= 0.25}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-text-muted w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="ghost" size="sm" disabled={zoom >= 4}>
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Timeline Tracks */}
      <div className="flex-1 overflow-auto">
        <div className="flex min-h-full">
          {/* Track Headers */}
          <div className="w-[120px] flex-shrink-0 border-r border-border bg-surface-2 sticky left-0 z-10">
            <div className="h-[32px] border-b border-border flex items-center px-3">
              <span className="text-xs font-medium text-text-muted">TRACKS</span>
            </div>
            {tracks.map((track) => (
              <div
                key={track.id}
                className="flex items-center px-3 border-b border-border"
                style={{ height: TRACK_HEIGHT }}>
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-text-muted" />
                  <span className="text-sm font-medium text-text truncate">{track.name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline Content */}
          <div
            ref={containerRef}
            className="flex-1 relative overflow-x-auto"
            onClick={handleTimelineClick}
          >
            <div style={{ width: timelineWidth + HEADER_WIDTH, minHeight: '100%' }}>
              {/* Time Ruler */}
              <div
                className="h-[32px] border-b border-border relative bg-surface-2 sticky top-0 z-10"
                style={{ width: timelineWidth }}
              >
                {generateTimeMarkers()}
              </div>

              {/* Tracks */}
              <div className="relative">
                {tracks.map((track) => (
                  <TimelineTrackRow
                    key={track.id}
                    track={track}
                    pixelsPerSecond={pixelsPerSecond}
                    selectedClipId={selectedClipId}
                    onClipSelect={setSelectedClipId}
                    onClipMove={onClipMove}
                    onClipResize={onClipResize}
                    onClipDelete={onClipDelete}
                    onClipSplit={onClipSplit}
                    currentTime={currentTime}
                  />
                ))}

                {/* Playhead */}
                <motion.div
                  className="absolute top-0 bottom-0 w-px bg-accent-red z-20 cursor-ew-resize"
                  style={{ left: currentTime * pixelsPerSecond }}
                  drag="x"
                  dragConstraints={containerRef}
                  dragElastic={0}
                  onDragStart={() => setIsDraggingPlayhead(true)}
                  onDragEnd={() => setIsDraggingPlayhead(false)}
                  onDrag={handlePlayheadDrag}
                >
                  <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-accent-red rounded-full" />
                  <div className="absolute top-6 -left-8 bg-accent-red text-white text-xs px-1.5 py-0.5 rounded">
                    {formatDuration(currentTime)}
                  </div>
                </motion.div>

                {/* Current Time Indicator Line */}
                <div
                  className="absolute top-0 bottom-0 w-px bg-accent-red/30 pointer-events-none z-10"
                  style={{ left: currentTime * pixelsPerSecond }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TimelineTrackRowProps {
  track: TimelineTrack;
  pixelsPerSecond: number;
  selectedClipId: string | null;
  onClipSelect: (id: string | null) => void;
  onClipMove: (clipId: string, newStartTime: number) => void;
  onClipResize: (clipId: string, newDuration: number) => void;
  onClipDelete: (clipId: string) => void;
  onClipSplit: (clipId: string, splitTime: number) => void;
  currentTime: number;
}

function TimelineTrackRow({
  track,
  pixelsPerSecond,
  selectedClipId,
  onClipSelect,
  onClipMove,
  onClipResize,
  onClipDelete,
  onClipSplit,
  currentTime,
}: TimelineTrackRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={trackRef}
      className="border-b border-border relative"
      style={{ height: TRACK_HEIGHT }}
    >
      {track.clips.map((clip) => (
        <TimelineClip
          key={clip.id}
          clip={clip}
          pixelsPerSecond={pixelsPerSecond}
          isSelected={selectedClipId === clip.id}
          onSelect={() => onClipSelect(clip.id)}
          onMove={(newStartTime) => onClipMove(clip.id, newStartTime)}
          onResize={(newDuration) => onClipResize(clip.id, newDuration)}
          onDelete={() => onClipDelete(clip.id)}
          onSplit={() => onClipSplit(clip.id, currentTime)}
        />
      ))}
    </div>
  );
}

interface TimelineClipProps {
  clip: TimelineClip;
  pixelsPerSecond: number;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (newStartTime: number) => void;
  onResize: (newDuration: number) => void;
  onDelete: () => void;
  onSplit: () => void;
}

function TimelineClip({
  clip,
  pixelsPerSecond,
  isSelected,
  onSelect,
  onMove,
  onResize,
  onDelete,
  onSplit,
}: TimelineClipProps) {
  const clipRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });

  const width = Math.max(MIN_CLIP_WIDTH, clip.duration * pixelsPerSecond);
  const left = clip.startTime * pixelsPerSecond;

  const getClipColor = () => {
    switch (clip.type) {
      case 'video':
        return 'bg-accent-blue/20 border-accent-blue/50';
      case 'audio':
        return 'bg-accent-orange/20 border-accent-orange/50';
      case 'caption':
        return 'bg-accent-green/20 border-accent-green/50';
      case 'broll':
        return 'bg-purple-500/20 border-purple-500/50';
      default:
        return 'bg-surface-2 border-border';
    }
  };

  const handleDrag = (_: unknown, info: PanInfo) => {
    if (isResizing) return;
    const newStartTime = Math.max(0, clip.startTime + info.delta.x / pixelsPerSecond);
    onMove(newStartTime);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  useEffect(() => {
    const handleClickOutside = () => setShowContextMenu(false);
    if (showContextMenu) {
      window.addEventListener('click', handleClickOutside);
      return () => window.removeEventListener('click', handleClickOutside);
    }
  }, [showContextMenu]);

  return (
    <>
      <motion.div
        ref={clipRef}
        className={cn(
          'absolute top-1 bottom-1 rounded border cursor-move overflow-hidden group',
          getClipColor(),
          isSelected && 'ring-2 ring-text z-10'
        )}
        style={{ left, width }}
        drag="x"
        dragMomentum={false}
        dragElastic={0}
        onDrag={handleDrag}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onContextMenu={handleContextMenu}
      >
        {/* Clip Content */}
        <div className="h-full flex flex-col p-1.5 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-text truncate flex-1">
              {clip.name}
            </span>
          </div>
          <span className="text-[10px] text-text-muted">
            {formatDuration(clip.duration)}
          </span>
        </div>

        {/* Thumbnail (if available) */}
        {clip.thumbnailUrl && (
          <img
            src={clip.thumbnailUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}

        {/* Resize Handle - Right */}
        <div
          className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize opacity-0 group-hover:opacity-100 hover:bg-text/20"
          onMouseDown={() => setIsResizing(true)}
          onMouseUp={() => setIsResizing(false)}
        />

        {/* Selected Actions */}
        {isSelected && (
          <div className="absolute -top-6 left-0 flex items-center gap-1 bg-surface border border-border rounded shadow-modal p-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSplit();
              }}
              className="p-1 hover:bg-surface-2 rounded"
              title="Split at playhead"
            >
              <Scissors className="w-3 h-3 text-text" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 hover:bg-accent-red/10 rounded"
              title="Delete"
            >
              <Trash2 className="w-3 h-3 text-accent-red" />
            </button>
            <button className="p-1 hover:bg-surface-2 rounded" title="Duplicate">
              <Copy className="w-3 h-3 text-text" />
            </button>
          </div>
        )}
      </motion.div>

      {/* Context Menu */}
      {showContextMenu && (
        <div
          className="fixed z-50 bg-surface border border-border rounded-card shadow-modal py-1 min-w-[160px]"
          style={{ left: contextMenuPos.x, top: contextMenuPos.y }}
        >
          <button
            onClick={() => {
              onSplit();
              setShowContextMenu(false);
            }}
            className="w-full px-3 py-2 text-left text-sm text-text hover:bg-surface-2 flex items-center gap-2"
          >
            <Scissors className="w-4 h-4" />
            Split at playhead
          </button>
          <button
            onClick={() => {
              onDelete();
              setShowContextMenu(false);
            }}
            className="w-full px-3 py-2 text-left text-sm text-accent-red hover:bg-accent-red/10 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <hr className="my-1 border-border" />
          <button className="w-full px-3 py-2 text-left text-sm text-text hover:bg-surface-2 flex items-center gap-2">
            <Copy className="w-4 h-4" />
            Duplicate
          </button>
        </div>
      )}
    </>
  );
}
