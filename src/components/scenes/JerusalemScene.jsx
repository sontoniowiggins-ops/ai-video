import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from 'remotion';

// Deterministic pseudo-random from string seed
const rand = (seed) => {
  let h = 0;
  const s = String(seed);
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return ((h >>> 0) / 0xffffffff);
};

export const JerusalemScene = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, 20, durationInFrames - 20, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const glowPulse = Math.sin(frame * 0.15) * 0.12 + 0.88;

  // Fire particles — deterministic positions, animated by frame
  const fireParticles = Array.from({ length: 20 }, (_, i) => {
    const x = rand(`jfx${i}`) * 95 + 2;
    const speed = rand(`jfs${i}`) * 1.4 + 0.7;
    const size = rand(`jfsz${i}`) * 32 + 10;
    const phase = rand(`jfp${i}`) * 90;
    const isLarge = i < 6;

    const yProgress = ((frame * speed * 0.45 + phase) % 85);
    const pOpacity = interpolate(yProgress, [0, 12, 72, 85], [0, 0.88, 0.28, 0], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
    const scale = interpolate(yProgress, [0, 85], [1.1, 0.15], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
    const wobble = Math.sin(frame * 0.09 + i * 1.7) * 7;

    const c1 = isLarge ? 'rgba(255,190,20,0.95)' : 'rgba(255,110,10,0.9)';
    const c2 = isLarge ? 'rgba(255,80,0,0.6)' : 'rgba(200,30,0,0.5)';

    return (
      <div
        key={`fp${i}`}
        style={{
          position: 'absolute',
          left: `${x}%`,
          bottom: `${23 + yProgress}%`,
          width: isLarge ? size * 1.8 : size,
          height: isLarge ? size * 3 : size * 2.2,
          background: `radial-gradient(ellipse at bottom, ${c1}, ${c2} 55%, transparent)`,
          borderRadius: '50% 50% 28% 28% / 62% 62% 38% 38%',
          opacity: pOpacity * glowPulse,
          transform: `scale(${scale}) translateX(${wobble}px)`,
          filter: 'blur(1.5px)',
        }}
      />
    );
  });

  return (
    <AbsoluteFill style={{ opacity, overflow: 'hidden' }}>
      {/* Crimson sky */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #0d0000 0%, #2e0400 18%, #6c1200 38%, #b02600 58%, #da4200 74%, #a82e00 88%, #5a1600 100%)',
      }} />

      {/* Fire glow on horizon */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 50% 76%, rgba(255,90,0,${0.32 * glowPulse}) 0%, rgba(190,45,0,0.14) 38%, transparent 68%)`,
      }} />

      {/* Drifting smoke */}
      <div style={{
        position: 'absolute', top: '8%',
        left: `-${(frame * 0.14) % 110}%`,
        width: '240%', height: '48%',
        background: 'radial-gradient(ellipse at 38% 48%, rgba(28,6,0,0.58), transparent 58%), radial-gradient(ellipse at 72% 28%, rgba(22,4,0,0.48), transparent 54%)',
        filter: 'blur(28px)',
      }} />

      {fireParticles}

      {/* Jerusalem silhouette */}
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        {/* Lower city */}
        <path
          d="M0,1080 L0,758 L90,758 L90,738 L145,738 L145,708 L196,708 L210,678 L258,678 L258,658 L308,658 L326,638 L386,638 L406,618 L458,618 L476,598 L528,598 L548,578 L608,578
           L618,568 L652,568 L668,552 L708,552 L718,542 L758,542 L768,552
           L808,552 L826,538 L868,538 L886,528 L928,528 L946,538 L976,538 L994,552 L1034,552 L1052,542 L1094,542 L1104,552 L1146,552 L1162,558 L1204,558
           L1224,572 L1264,572 L1284,588 L1326,588 L1356,602 L1384,618 L1406,638 L1448,638 L1466,652 L1506,668 L1538,688 L1566,708 L1608,728 L1648,748 L1688,762 L1728,772 L1770,778 L1810,778 L1848,758 L1888,758 L1920,758 L1920,1080 Z"
          fill="#090000"
        />

        {/* Temple mount platform */}
        <rect x="726" y="452" width="468" height="88" fill="#090000" />

        {/* Temple main body */}
        <rect x="858" y="320" width="204" height="138" fill="#090000" />
        {/* Temple portico */}
        <rect x="892" y="274" width="136" height="56" fill="#090000" />
        {/* Holy of Holies */}
        <rect x="924" y="240" width="72" height="44" fill="#090000" />
        {/* Pinnacle */}
        <rect x="948" y="218" width="24" height="30" fill="#090000" />

        {/* Columns */}
        {[868, 888, 908, 958, 978, 998, 1018, 1038].map((x, ci) => (
          <rect key={`tc${ci}`} x={x} y={338} width={8} height={114} fill="#140000" />
        ))}

        {/* Side walls */}
        <rect x="558" y="535" width="168" height="88" fill="#090000" />
        <rect x="1194" y="535" width="168" height="88" fill="#090000" />

        {/* Wall towers */}
        <rect x="528" y="484" width="48" height="142" fill="#090000" />
        <rect x="630" y="504" width="38" height="122" fill="#090000" />
        <rect x="1252" y="504" width="38" height="122" fill="#090000" />
        <rect x="1344" y="484" width="48" height="142" fill="#090000" />

        {/* Rising smoke columns */}
        {[645, 808, 960, 1108, 1258].map((x, si) => {
          const cy = 498 - ((frame * (0.38 + si * 0.06) + si * 44) % 520);
          return (
            <ellipse
              key={`sm${si}`}
              cx={x + Math.sin(frame * 0.022 + si) * 14}
              cy={cy}
              rx={24 + si * 5}
              ry={48 + si * 8}
              fill={`rgba(24,4,0,${0.44 - si * 0.025})`}
            />
          );
        })}
      </svg>

      {/* Vignette */}
      <AbsoluteFill style={{
        background: 'radial-gradient(ellipse at center, transparent 22%, rgba(0,0,0,0.78) 100%)',
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};
