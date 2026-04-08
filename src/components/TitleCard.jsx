import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';

export const TitleCard = ({ title, subtitle }) => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const subtitleOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      <div
        style={{
          opacity: titleOpacity,
          color: '#D4A832',
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 72,
          fontWeight: '700',
          letterSpacing: '0.15em',
          textAlign: 'center',
          textShadow: '0 0 40px rgba(212, 168, 50, 0.4)',
        }}
      >
        {title}
      </div>
      <div
        style={{
          opacity: subtitleOpacity,
          color: '#FFFFFF',
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 32,
          fontWeight: '400',
          letterSpacing: '0.35em',
          textAlign: 'center',
        }}
      >
        {subtitle}
      </div>
    </AbsoluteFill>
  );
};
