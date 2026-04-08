import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';

// Renders lines of text one at a time, each fading in
export const TextOverlay = ({ lines = [], platform = 'youtube' }) => {
  const frame = useCurrentFrame();
  const isVertical = platform === 'tiktok';

  const visibleLines = lines.filter((l) => l !== '');
  const framesPerLine = 20;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: isVertical ? 220 : 80,
        paddingLeft: 60,
        paddingRight: 60,
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {visibleLines.map((line, i) => {
        const startFrame = i * framesPerLine;
        const opacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={i}
            style={{
              opacity,
              color: '#FFFFFF',
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: isVertical ? 52 : 44,
              fontWeight: '700',
              textAlign: 'center',
              textShadow: '2px 2px 12px rgba(0,0,0,0.95), 0 0 30px rgba(0,0,0,0.8)',
              letterSpacing: '0.04em',
              lineHeight: 1.3,
            }}
          >
            {line}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
