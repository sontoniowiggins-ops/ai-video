import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from 'remotion';

// Standalone background for the opening prophecy scene — ancient parchment with candlelight
export const ScrollScene = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, 20, durationInFrames - 20, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Candle flicker
  const flicker = Math.sin(frame * 0.22) * 0.06 + Math.sin(frame * 0.35) * 0.04 + 0.90;
  const flickerX = Math.sin(frame * 0.18) * 12;
  const flickerY = Math.sin(frame * 0.28) * 6;

  // Slow parchment drift (Ken Burns on background)
  const bgScale = interpolate(frame, [0, durationInFrames], [1.0, 1.05], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity, overflow: 'hidden' }}>
      {/* Deep shadow background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: '#0e0700',
      }} />

      {/* Parchment / scroll surface */}
      <div style={{
        position: 'absolute',
        left: '18%', top: '12%',
        width: '64%', height: '76%',
        background: 'linear-gradient(145deg, #e2ca82 0%, #cfa84a 22%, #c29038 48%, #d4aa55 72%, #dfc472 100%)',
        borderRadius: '4px',
        transform: `scale(${bgScale})`,
        transformOrigin: 'center center',
        boxShadow: '0 0 80px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.8)',
      }} />

      {/* Age spots on parchment */}
      <div style={{
        position: 'absolute',
        left: '18%', top: '12%',
        width: '64%', height: '76%',
        borderRadius: '4px',
        background: 'radial-gradient(ellipse at 12% 15%, rgba(90,44,0,0.28), transparent 30%), radial-gradient(ellipse at 85% 78%, rgba(72,34,0,0.24), transparent 26%), radial-gradient(ellipse at 60% 18%, rgba(62,28,0,0.20), transparent 22%), radial-gradient(ellipse at 30% 82%, rgba(80,38,0,0.22), transparent 24%)',
        transform: `scale(${bgScale})`,
        transformOrigin: 'center center',
      }} />

      {/* Worn edges on parchment */}
      <div style={{
        position: 'absolute',
        left: '18%', top: '12%',
        width: '64%', height: '76%',
        borderRadius: '4px',
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(62,28,0,0.48) 82%, rgba(42,16,0,0.78) 100%)',
        transform: `scale(${bgScale})`,
        transformOrigin: 'center center',
      }} />

      {/* Scroll roll shadows (top and bottom) */}
      <div style={{
        position: 'absolute',
        left: '18%', top: '12%',
        width: '64%', height: '18px',
        background: 'linear-gradient(180deg, rgba(20,8,0,0.7), transparent)',
        borderRadius: '4px 4px 0 0',
        transform: `scale(${bgScale})`,
        transformOrigin: 'top center',
      }} />
      <div style={{
        position: 'absolute',
        left: '18%', bottom: '12%',
        width: '64%', height: '18px',
        background: 'linear-gradient(0deg, rgba(20,8,0,0.7), transparent)',
        borderRadius: '0 0 4px 4px',
        transform: `scale(${bgScale})`,
        transformOrigin: 'bottom center',
      }} />

      {/* Candlelight glow — warm orange light from below-left */}
      <div style={{
        position: 'absolute',
        left: `calc(22% + ${flickerX}px)`,
        bottom: `calc(8% + ${flickerY}px)`,
        width: 380, height: 380,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(255,168,28,${0.58 * flicker}), rgba(220,100,12,${0.32 * flicker}) 45%, transparent 70%)`,
        transform: 'translate(-50%, 50%)',
        filter: 'blur(18px)',
      }} />

      {/* Second candle — right side */}
      <div style={{
        position: 'absolute',
        right: `calc(20% + ${-flickerX * 0.7}px)`,
        bottom: `calc(9% + ${flickerY * 0.6}px)`,
        width: 260, height: 260,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(255,155,22,${0.44 * flicker}), rgba(200,85,8,${0.24 * flicker}) 45%, transparent 68%)`,
        transform: 'translate(50%, 50%)',
        filter: 'blur(14px)',
      }} />

      {/* Ambient warm fill */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at center 80%, rgba(180,80,12,${0.14 * flicker}), transparent 55%)`,
      }} />

      {/* Ink writing lines on parchment (suggestion of Hebrew script) */}
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        {/* Script lines — subtle, barely visible under the text overlay */}
        {[380, 420, 460, 500, 542, 580, 620, 660, 700].map((y, li) => (
          <line
            key={`sl${li}`}
            x1="372" y1={y}
            x2={1480 - (li % 3) * 30} y2={y}
            stroke="rgba(80,36,0,0.12)"
            strokeWidth="1.5"
          />
        ))}

        {/* Decorative border on parchment */}
        <rect
          x="352" y="130"
          width="1216" height="820"
          fill="none"
          stroke="rgba(80,36,0,0.18)"
          strokeWidth="3"
          rx="2"
        />
        <rect
          x="368" y="146"
          width="1184" height="788"
          fill="none"
          stroke="rgba(80,36,0,0.10)"
          strokeWidth="1.5"
          rx="1"
        />
      </svg>

      {/* Dark vignette around whole scene */}
      <AbsoluteFill style={{
        background: 'radial-gradient(ellipse at center, transparent 28%, rgba(0,0,0,0.85) 100%)',
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};
