import { Composition } from 'remotion';
import { VideoComposition, VIDEO_CONFIG } from './VideoComposition';
import './styles.css';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ShortVideo"
        component={VideoComposition}
        durationInFrames={VIDEO_CONFIG.durationInFrames}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        defaultProps={{
          videoSrc: '',
          captions: [],
          audioTracks: [],
          bRollClips: [],
          captionsStyle: 'bold',
          captionsColor: '#FFFFFF',
          showEmojis: true,
          highlightPowerWords: true,
        }}
      />
    </>
  );
};
