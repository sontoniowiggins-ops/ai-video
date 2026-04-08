import { Composition } from 'remotion';
import { SephardicVideo } from './Video';
import { SCENES, FPS, TOTAL_DURATION_FRAMES } from './scenes';

export const RemotionRoot = () => {
  return (
    <>
      {/* YouTube — 16:9 landscape */}
      <Composition
        id="SephardicYouTube"
        component={SephardicVideo}
        durationInFrames={TOTAL_DURATION_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ platform: 'youtube' }}
      />

      {/* TikTok — 9:16 vertical */}
      <Composition
        id="SephardicTikTok"
        component={SephardicVideo}
        durationInFrames={TOTAL_DURATION_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ platform: 'tiktok' }}
      />
    </>
  );
};
