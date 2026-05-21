import { renderMedia, selectComposition } from '@remotion/renderer';
import { bundle } from '@remotion/bundler';
import path from 'path';
import { VIDEO_CONFIG } from '../../remotion/VideoComposition';

export interface RenderOptions {
  videoSrc: string;
  captions: Array<{
    id: string;
    text: string;
    startTime: number;
    endTime: number;
    words: Array<{
      word: string;
      startTime: number;
      endTime: number;
    }>;
  }>;
  audioTracks: Array<{
    id: string;
    url: string;
    volume: number;
    startTime: number;
  }>;
  bRollClips?: Array<{
    id: string;
    src: string;
    startTime: number;
    duration: number;
    type: 'video' | 'image';
  }>;
  captionsStyle?: 'bold' | 'minimal' | 'neon' | 'subtitle';
  captionsColor?: string;
  showEmojis?: boolean;
  highlightPowerWords?: boolean;
  outputFileName: string;
}

export async function renderVideo(options: RenderOptions): Promise<{
  outputPath: string;
  durationInFrames: number;
}> {
  const bundled = await bundle({
    entryPoint: path.join(process.cwd(), 'remotion', 'index.ts'),
    webpackOverride: (config) => config,
  });

  const composition = await selectComposition({
    serveUrl: bundled,
    id: 'ShortVideo',
    inputProps: {
      videoSrc: options.videoSrc,
      captions: options.captions,
      audioTracks: options.audioTracks,
      bRollClips: options.bRollClips || [],
      captionsStyle: options.captionsStyle || 'bold',
      captionsColor: options.captionsColor || '#FFFFFF',
      showEmojis: options.showEmojis ?? true,
      highlightPowerWords: options.highlightPowerWords ?? true,
    },
  });

  const outputPath = path.join(
    process.cwd(),
    'tmp',
    'renders',
    options.outputFileName
  );

  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps: {
      videoSrc: options.videoSrc,
      captions: options.captions,
      audioTracks: options.audioTracks,
      bRollClips: options.bRollClips || [],
      captionsStyle: options.captionsStyle || 'bold',
      captionsColor: options.captionsColor || '#FFFFFF',
      showEmojis: options.showEmojis ?? true,
      highlightPowerWords: options.highlightPowerWords ?? true,
    },
  });

  return {
    outputPath,
    durationInFrames: composition.durationInFrames,
  };
}

// Calculate render progress
export function calculateRenderProgress(
  currentFrame: number,
  totalFrames: number
): number {
  return Math.round((currentFrame / totalFrames) * 100);
}

// Estimate render time based on video duration and complexity
export function estimateRenderTime(
  durationInSeconds: number,
  hasCaptions: boolean,
  hasAudioEffects: boolean
): number {
  // Base time: 0.5x real-time for simple renders
  let multiplier = 0.5;

  // Add overhead for features
  if (hasCaptions) multiplier += 0.2;
  if (hasAudioEffects) multiplier += 0.1;

  // Cap at 2x for safety
  multiplier = Math.min(multiplier, 2.0);

  return durationInSeconds * multiplier;
}
