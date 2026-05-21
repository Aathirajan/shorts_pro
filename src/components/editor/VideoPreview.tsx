'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn, formatDuration } from '@/lib/utils';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface VideoPreviewProps {
  src?: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  captions?: Caption[];
  onTimeChange: (time: number) => void;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
}

interface Caption {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  style?: 'bold' | 'minimal' | 'neon' | 'subtitle';
}

export function VideoPreview({
  src,
  currentTime,
  duration,
  isPlaying,
  captions = [],
  onTimeChange,
  onPlayPause,
  onSeek,
}: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [activeCaptions, setActiveCaptions] = useState<Caption[]>([]);

  // Sync video with current time
  useEffect(() => {
    if (videoRef.current) {
      const timeDiff = Math.abs(videoRef.current.currentTime - currentTime);
      if (timeDiff > 0.1) {
        videoRef.current.currentTime = currentTime;
      }
    }
  }, [currentTime]);

  // Handle play/pause
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          // Auto-play blocked
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Update active captions based on current time
  useEffect(() => {
    const active = captions.filter(
      (caption) => currentTime >= caption.startTime && currentTime <= caption.endTime
    );
    setActiveCaptions(active);
  }, [currentTime, captions]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      onTimeChange(videoRef.current.currentTime);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    onSeek(newTime);
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!isFullscreen) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  const handleSkip = (direction: 'back' | 'forward') => {
    const skipAmount = 5;
    const newTime =
      direction === 'back'
        ? Math.max(0, currentTime - skipAmount)
        : Math.min(duration, currentTime + skipAmount);
    onSeek(newTime);
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-card overflow-hidden aspect-[9/16] max-h-[calc(100vh-300px)]"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element or Placeholder */}
      {src ? (
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => onPlayPause()}
          muted={isMuted}
          playsInline
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-surface-2">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface flex items-center justify-center">
              <Play className="w-8 h-8 text-text-muted" />
            </div>
            <p className="text-text-muted text-sm">No video loaded</p>
            <p className="text-text-muted text-xs mt-1">Upload a video to preview</p>
          </div>
        </div>
      )}

      {/* Captions Overlay */}
      <div className="absolute bottom-24 left-0 right-0 flex flex-col items-center justify-end px-4 pointer-events-none">
        {activeCaptions.map((caption) => (
          <motion.div
            key={caption.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              'text-center mb-2 px-4 py-2 rounded-lg',
              caption.style === 'neon' && 'bg-black/50 text-white font-bold text-shadow-neon',
              caption.style === 'bold' && 'bg-black/70 text-white font-bold',
              caption.style === 'minimal' && 'bg-white/90 text-black font-medium',
              caption.style === 'subtitle' && 'bg-black/80 text-white',
              !caption.style && 'bg-black/70 text-white font-bold'
            )}
          >
            <span className="text-lg">{caption.text}</span>
          </motion.div>
        ))}
      </div>

      {/* Phone Frame Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 border-[8px] border-black rounded-card" />
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full" />
      </div>

      {/* Controls Overlay */}
      <motion.div
        initial={false}
        animate={{ opacity: showControls ? 1 : 0 }}
        className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"
      >
        {/* Top Controls */}
        <div className="p-4 flex items-center justify-between pointer-events-auto">
          <div className="text-white text-sm font-mono">
            {formatDuration(currentTime)} / {formatDuration(duration)}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 text-white/80 hover:text-white"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 text-white/80 hover:text-white"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Play Button */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <button
              onClick={onPlayPause}
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
            </button>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="p-4 pointer-events-auto">
          {/* Progress Bar */}
          <div
            className="h-1 bg-white/30 rounded-full cursor-pointer mb-4 hover:h-2 transition-all"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-accent-green rounded-full relative"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-accent-green rounded-full opacity-0 hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => handleSkip('back')}
              className="p-2 text-white/80 hover:text-white"
            >
              <SkipBack className="w-6 h-6" />
            </button>

            <button
              onClick={onPlayPause}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-black" fill="currentColor" />
              ) : (
                <Play className="w-6 h-6 text-black ml-1" fill="currentColor" />
              )}
            </button>

            <button
              onClick={() => handleSkip('forward')}
              className="p-2 text-white/80 hover:text-white"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Time Tooltip on hover (optional) */}
      <div className="absolute top-4 left-4 text-white/60 text-xs font-mono">
        9:16
      </div>
    </div>
  );
}

interface VideoPreviewPlaceholderProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function VideoPreviewPlaceholder({
  title = 'No video selected',
  description = 'Upload a video or create a project to start editing',
  action,
}: VideoPreviewPlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-surface-2 rounded-card border border-border p-8">
      <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center mb-4">
        <Play className="w-10 h-10 text-text-muted" />
      </div>
      <h3 className="text-lg font-medium text-text mb-2">{title}</h3>
      <p className="text-sm text-text-muted text-center mb-4">{description}</p>
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
}
