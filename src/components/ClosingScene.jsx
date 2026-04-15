import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill, staticFile } from 'remotion';

// Final scene — full screen sunset image with closing statement
export const ClosingScene = ({ lines = [], image, platform = 'youtube' }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const isVertical = platform === 'tiktok';

  const bgOpacity = interpolate(
    frame,
    [0, 30, durationInFrames - 25, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const visibleLines = lines.filter((l) => l !== '');

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <AbsoluteFill style={{ opacity: bgOpacity }}>
        <img
          src={staticFile(`images/${image}`)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          flexDirection: 'column',
          paddingBottom: isVertical ? 240 : 100,
          gap: 14,
          paddingLeft: 60,
          paddingRight: 60,
        }}
      >
        {visibleLines.map((line, i) => {
          const startFrame = 30 + i * 22;
          const opacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          const isLast = i === visibleLines.length - 1;

          return (
            <div
              key={i}
              style={{
                opacity,
                color: isLast ? '#D4A832' : '#FFFFFF',
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: isVertical
                  ? isLast ? 62 : 46
                  : isLast ? 56 : 40,
                fontWeight: isLast ? '700' : '400',
                fontStyle: isLast ? 'normal' : 'italic',
                textAlign: 'center',
                textShadow: '2px 2px 16px rgba(0,0,0,1)',
                letterSpacing: isLast ? '0.08em' : '0.04em',
                lineHeight: 1.3,
              }}
            >
              {line}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
