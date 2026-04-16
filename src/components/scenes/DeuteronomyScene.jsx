import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from 'remotion';

export const DeuteronomyScene = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, 20, durationInFrames - 20, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const cloudDrift = (frame * 0.07) % 8;

  // Lightning: flash at specific frame intervals
  const flashFrames = [44, 45, 46, 122, 123, 244, 245, 246, 394, 395, 396];
  const isFlash = flashFrames.includes(frame % 500);
  const flashBrightness = isFlash ? (frame % 2 === 0 ? 0.38 : 0.22) : 0;

  // Purple electric glow that pulses
  const purpleGlow = interpolate(
    Math.sin(frame * 0.12) * 0.5 + 0.5,
    [0, 1],
    [0.12, 0.24]
  );

  return (
    <AbsoluteFill style={{ opacity, overflow: 'hidden' }}>
      {/* Dark stormy sky — deep purple-black */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #050208 0%, #0c071a 18%, #140b26 42%, #1a1032 62%, #0e0818 80%, #060410 100%)',
      }} />

      {/* Rolling storm clouds */}
      <div style={{
        position: 'absolute', top: 0,
        left: `-${cloudDrift}%`, right: `-${cloudDrift}%`,
        height: '72%',
        background: 'radial-gradient(ellipse at 28% 26%, rgba(28,18,52,0.92), transparent 42%), radial-gradient(ellipse at 62% 18%, rgba(24,14,48,0.86), transparent 46%), radial-gradient(ellipse at 82% 38%, rgba(32,20,56,0.82), transparent 40%), radial-gradient(ellipse at 48% 52%, rgba(18,11,36,0.72), transparent 54%), radial-gradient(ellipse at 15% 52%, rgba(22,14,44,0.68), transparent 42%)',
      }} />

      {/* Lightning flash overlay */}
      {isFlash && (
        <AbsoluteFill style={{
          background: `rgba(210,215,255,${flashBrightness})`,
          pointerEvents: 'none',
        }} />
      )}

      {/* Electric purple glow around peak */}
      <div style={{
        position: 'absolute',
        left: '50%', top: '32%',
        width: 420, height: 180,
        borderRadius: '50%',
        background: `radial-gradient(ellipse, rgba(120,80,220,${purpleGlow + (isFlash ? 0.2 : 0)}), transparent 62%)`,
        transform: 'translate(-50%, -50%)',
        filter: 'blur(24px)',
      }} />

      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>

        {/* Lightning bolt */}
        {isFlash && (
          <path
            d="M1040,42 L968,348 L1012,348 L928,658 L964,658 L880,912"
            stroke={`rgba(220,228,255,${flashBrightness * 2.2})`}
            strokeWidth="4.5"
            fill="none"
          />
        )}

        {/* Background mountains (hazy, far) */}
        <path
          d="M0,1080 L0,900 L100,888 L220,868 L360,840 L500,812 L620,788 L720,768 L820,748 L900,732 L960,720 L1020,732 L1100,748 L1200,768 L1320,788 L1460,812 L1600,840 L1740,868 L1860,888 L1920,900 L1920,1080 Z"
          fill="#090518"
        />

        {/* Main mountain silhouette */}
        <path
          d="M0,1080 L0,848 L130,844 L268,828 L418,804 L558,774 L668,742 L768,706 L854,668 L920,628 L956,578 L962,560
             L968,578 L1004,628 L1068,666 L1148,704 L1242,742 L1358,776 L1488,806 L1628,828 L1768,844 L1888,848 L1920,848 L1920,1080 Z"
          fill="#06030e"
        />

        {/* Glow around Moses figure */}
        <ellipse cx="960" cy="490" rx="60" ry="80"
          fill={`rgba(140,100,255,${purpleGlow * 1.4 + (isFlash ? 0.3 : 0)})`}
          filter="url(#glow)"
        />
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* FIGURE ON PEAK — Moses / prophet, FULL BODY visible above mountain */}
        <g transform="translate(960, 518)">
          {/* Staff (behind body) */}
          <line x1="14" y1="-80" x2="26" y2="44" stroke="#c8b8ff" strokeWidth="5" strokeLinecap="round" />
          {/* Flowing robe — full length */}
          <path d="M-10,-40 L-20,0 L-16,44 L0,38 L16,44 L20,0 L10,-40 Z" fill="#c8b8ff" />
          {/* Body */}
          <rect x="-8" y="-82" width="16" height="46" fill="#c8b8ff" rx="3"/>
          {/* Head */}
          <circle cx="0" cy="-96" r="13" fill="#c8b8ff" />
          {/* Arms raised in Y shape — prophet calling heaven */}
          <line x1="0" y1="-60" x2="-46" y2="-108" stroke="#c8b8ff" strokeWidth="8" strokeLinecap="round" />
          <line x1="0" y1="-60" x2="46" y2="-108" stroke="#c8b8ff" strokeWidth="8" strokeLinecap="round" />
        </g>

        {/* CROWD at mountain base */}
        {Array.from({ length: 64 }, (_, i) => {
          const x = 372 + i * 19 + (i % 4) * 4;
          const h = 26 + (i % 6) * 9;
          const y = 848 - h - (i % 4) * 3;
          return (
            <g key={`cr${i}`}>
              <rect x={x} y={y} width={5} height={h} fill="#06030e" />
              <circle cx={x + 2.5} cy={y - 4.5} r={4.5} fill="#06030e" />
            </g>
          );
        })}

        {/* Second crowd group on right */}
        {Array.from({ length: 38 }, (_, i) => {
          const x = 1094 + i * 19 + (i % 3) * 5;
          const h = 22 + (i % 5) * 8;
          const y = 848 - h - (i % 3) * 4;
          return (
            <g key={`cr2${i}`}>
              <rect x={x} y={y} width={4} height={h} fill="#06030e" />
              <circle cx={x + 2} cy={y - 4} r={4} fill="#06030e" />
            </g>
          );
        })}

        {/* Rolling dark clouds at horizon */}
        <ellipse cx="300" cy="780" rx="280" ry="60" fill="rgba(12,7,24,0.55)" />
        <ellipse cx="1620" cy="772" rx="260" ry="55" fill="rgba(12,7,24,0.50)" />
        <ellipse cx="960" cy="760" rx="320" ry="44" fill="rgba(14,8,28,0.48)" />
      </svg>

      {/* Dark edge vignette */}
      <AbsoluteFill style={{
        background: 'radial-gradient(ellipse at center 38%, transparent 18%, rgba(0,0,0,0.82) 100%)',
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};
