import { useVideoConfig, useCurrentFrame, Video, Audio, staticFile, interpolate, spring } from 'remotion';
import { CaptionSegment, AudioTrack } from '../src/types';

export const VIDEO_CONFIG = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 30 * 60, // 60 seconds default
};

// Power words that trigger visual emphasis
const POWER_WORDS = [
  'amazing', 'incredible', 'unbelievable', 'shocking', 'secret',
  'free', 'instant', 'now', 'must', 'need', 'want', 'love',
  'hate', 'best', 'worst', 'most', 'never', 'always', 'guaranteed',
  'proven', 'results', 'fast', 'quick', 'easy', 'simple',
];

interface BRollClip {
  id: string;
  startTime: number;
  duration: number;
  src: string;
  type: 'video' | 'image';
}

interface VideoCompositionProps {
  videoSrc?: string;
  captions?: CaptionSegment[];
  audioTracks?: AudioTrack[];
  bRollClips?: BRollClip[];
  captionsStyle?: 'bold' | 'minimal' | 'neon' | 'subtitle';
  captionsColor?: string;
  showEmojis?: boolean;
  highlightPowerWords?: boolean;
}

export const VideoComposition: React.FC<VideoCompositionProps> = ({
  videoSrc = '',
  captions = [],
  audioTracks = [],
  bRollClips = [],
  captionsStyle = 'bold',
  captionsColor = '#FFFFFF',
  showEmojis = true,
  highlightPowerWords = true,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const currentFrame = useCurrentFrame();
  const currentTime = currentFrame / fps;

  // Find current caption
  const currentCaption = captions.find(
    (cap) => currentTime >= cap.startTime && currentTime < cap.endTime
  );

  // Find active B-roll
  const activeBRoll = bRollClips.find(
    (clip) => currentTime >= clip.startTime && currentTime < clip.startTime + clip.duration
  );

  // Check if word is a power word
  const isPowerWord = (word: string) => {
    if (!highlightPowerWords) return false;
    return POWER_WORDS.some(
      (pw) => word.toLowerCase().includes(pw) || pw.includes(word.toLowerCase())
    );
  };

  // Render caption with style
  const renderCaption = (caption: CaptionSegment) => {
    const words = caption.text.split(' ');
    const progressInCaption = (currentTime - caption.startTime) / (caption.endTime - caption.startTime);
    const wordsToShow = Math.ceil(progressInCaption * words.length);

    switch (captionsStyle) {
      case 'bold':
        return (
          <div className="caption-bold">
            {words.map((word, i) => {
              const isActive = i < wordsToShow;
              const isPower = isPowerWord(word);
              return (
                <span
                  key={i}
                  className={`caption-word ${isActive ? 'active' : ''} ${isPower ? 'power-word' : ''}`}
                  style={{
                    opacity: isActive ? 1 : 0.3,
                    transform: isActive ? 'scale(1)' : 'scale(0.95)',
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        );
      case 'minimal':
        return (
          <div className="caption-minimal">
            {caption.text}
          </div>
        );
      case 'neon':
        return (
          <div className="caption-neon" style={{ color: captionsColor }}>
            {caption.text}
          </div>
        );
      case 'subtitle':
        return (
          <div className="caption-subtitle">
            {caption.text}
          </div>
        );
      default:
        return caption.text;
    }
  };

  return (
    <div className="video-container">
      {/* Base video layer */}
      {videoSrc && (
        <Video
          src={videoSrc}
          startFrom={0}
          endAt={durationInFrames}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}

      {/* B-Roll overlay layer */}
      {activeBRoll && (
        <div
          className="broll-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
          }}
        >
          {activeBRoll.type === 'video' ? (
            <Video
              src={activeBRoll.src}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <img
              src={activeBRoll.src}
              alt="B-roll"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}
        </div>
      )}

      {/* Caption overlay */}
      {currentCaption && (
        <div className="captions-container" style={{ zIndex: 20 }}>
          <div
            className="caption-text"
            style={{
              color: captionsColor,
              textShadow: captionsStyle === 'bold' ? '0 4px 8px rgba(0,0,0,0.5)' : 'none',
            }}
          >
            {renderCaption(currentCaption)}
          </div>
        </div>
      )}

      {/* Audio tracks */}
      {audioTracks.map((track, index) => (
        <Audio
          key={track.id}
          src={track.url}
          volume={track.volume}
          startFrom={track.startTime * fps}
        />
      ))}
    </div>
  );
};
