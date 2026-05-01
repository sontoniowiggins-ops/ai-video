import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from 'remotion';

export const WestAfricaScene = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, 20, durationInFrames - 20, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const sunGlow = Math.sin(frame * 0.06) * 0.10 + 0.90;
  const hazeShift = Math.sin(frame * 0.022) * 18;

  return (
    <AbsoluteFill style={{ opacity, overflow: 'hidden' }}>
      {/* Warm amber/gold sunset sky */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #180c00 0%, #3c1a00 14%, #7a3300 33%, #c45e00 52%, #e88800 66%, #f0a018 74%, #e87e0e 83%, #ae5400 91%, #682e00 100%)',
      }} />

      {/* Sun orb */}
      <div style={{
        position: 'absolute', left: '67%', top: '61%',
        width: 148, height: 148,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(255,242,148,${sunGlow}), rgba(255,178,48,0.90) 38%, rgba(255,138,18,0.68) 66%, transparent)`,
        transform: 'translate(-50%, -50%)',
        filter: 'blur(2px)',
      }} />

      {/* Sun halo */}
      <div style={{
        position: 'absolute', left: '67%', top: '61%',
        width: 520, height: 320,
        borderRadius: '50%',
        background: `radial-gradient(ellipse, rgba(255,155,30,${0.36 * sunGlow}), transparent 58%)`,
        transform: 'translate(-50%, -50%)',
        filter: 'blur(24px)',
      }} />

      {/* Heat haze */}
      <div style={{
        position: 'absolute', top: '56%', left: `${-8 + hazeShift * 0.08}%`, right: 0, height: '18%',
        background: 'linear-gradient(180deg, transparent, rgba(198,118,18,0.18), transparent)',
        filter: 'blur(22px)',
      }} />

      {/* Savanna ground */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '31%',
        background: 'linear-gradient(180deg, #5a2200 0%, #3c1600 38%, #280e00 100%)',
      }} />

      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>

        {/* Distant hills */}
        <path
          d="M0,760 Q200,720 400,740 Q600,760 800,730 Q1000,700 1200,728 Q1400,756 1600,738 Q1780,720 1920,748 L1920,1080 L0,1080 Z"
          fill="#200e00"
        />

        {/* BAOBAB TREE 1 — large, center-left */}
        <g>
          {/* Trunk */}
          <path d="M378,758 Q368,678 358,598 Q348,516 374,476 Q400,438 420,476 Q446,518 440,598 Q434,678 424,758 Z" fill="#190800" />
          <path d="M354,758 Q362,732 378,722 Q398,712 424,722 Q444,732 450,758 Z" fill="#190800" />
          {/* Main branches */}
          <line x1="388" y1="488" x2="276" y2="374" stroke="#190800" strokeWidth="24" strokeLinecap="round" />
          <line x1="392" y1="484" x2="316" y2="326" stroke="#190800" strokeWidth="20" strokeLinecap="round" />
          <line x1="406" y1="477" x2="432" y2="316" stroke="#190800" strokeWidth="22" strokeLinecap="round" />
          <line x1="416" y1="483" x2="524" y2="366" stroke="#190800" strokeWidth="21" strokeLinecap="round" />
          <line x1="418" y1="486" x2="492" y2="308" stroke="#190800" strokeWidth="17" strokeLinecap="round" />
          {/* Sub-branches */}
          <line x1="276" y1="374" x2="224" y2="312" stroke="#190800" strokeWidth="12" strokeLinecap="round" />
          <line x1="276" y1="374" x2="256" y2="296" stroke="#190800" strokeWidth="10" strokeLinecap="round" />
          <line x1="276" y1="374" x2="318" y2="300" stroke="#190800" strokeWidth="11" strokeLinecap="round" />
          <line x1="316" y1="326" x2="282" y2="258" stroke="#190800" strokeWidth="10" strokeLinecap="round" />
          <line x1="524" y1="366" x2="566" y2="296" stroke="#190800" strokeWidth="12" strokeLinecap="round" />
          <line x1="524" y1="366" x2="548" y2="280" stroke="#190800" strokeWidth="10" strokeLinecap="round" />
          <line x1="432" y1="316" x2="402" y2="250" stroke="#190800" strokeWidth="11" strokeLinecap="round" />
          <line x1="432" y1="316" x2="458" y2="246" stroke="#190800" strokeWidth="11" strokeLinecap="round" />
          <line x1="492" y1="308" x2="464" y2="240" stroke="#190800" strokeWidth="9" strokeLinecap="round" />
          <line x1="492" y1="308" x2="518" y2="235" stroke="#190800" strokeWidth="9" strokeLinecap="round" />
        </g>

        {/* BAOBAB TREE 2 — small, far left */}
        <g>
          <path d="M132,782 Q124,722 116,658 Q108,586 128,556 Q148,526 164,556 Q180,586 172,658 Q164,722 158,782 Z" fill="#190800" />
          <path d="M108,782 Q116,764 132,756 Q150,748 166,756 Q182,764 188,782 Z" fill="#190800" />
          <line x1="140" y1="564" x2="76" y2="476" stroke="#190800" strokeWidth="17" strokeLinecap="round" />
          <line x1="142" y1="560" x2="112" y2="440" stroke="#190800" strokeWidth="15" strokeLinecap="round" />
          <line x1="150" y1="555" x2="168" y2="436" stroke="#190800" strokeWidth="16" strokeLinecap="round" />
          <line x1="158" y1="560" x2="214" y2="468" stroke="#190800" strokeWidth="15" strokeLinecap="round" />
          <line x1="76" y1="476" x2="46" y2="408" stroke="#190800" strokeWidth="9" strokeLinecap="round" />
          <line x1="76" y1="476" x2="78" y2="394" stroke="#190800" strokeWidth="7" strokeLinecap="round" />
          <line x1="214" y1="468" x2="246" y2="400" stroke="#190800" strokeWidth="9" strokeLinecap="round" />
          <line x1="168" y1="436" x2="150" y2="364" stroke="#190800" strokeWidth="8" strokeLinecap="round" />
          <line x1="168" y1="436" x2="186" y2="360" stroke="#190800" strokeWidth="8" strokeLinecap="round" />
        </g>

        {/* BAOBAB TREE 3 — large, far right */}
        <g>
          <path d="M1682,762 Q1672,674 1662,588 Q1652,502 1680,462 Q1708,422 1728,462 Q1748,502 1742,588 Q1736,674 1726,762 Z" fill="#190800" />
          <path d="M1650,762 Q1660,740 1682,730 Q1702,720 1726,730 Q1748,740 1756,762 Z" fill="#190800" />
          <line x1="1674" y1="472" x2="1558" y2="356" stroke="#190800" strokeWidth="22" strokeLinecap="round" />
          <line x1="1676" y1="468" x2="1602" y2="308" stroke="#190800" strokeWidth="19" strokeLinecap="round" />
          <line x1="1688" y1="463" x2="1704" y2="308" stroke="#190800" strokeWidth="21" strokeLinecap="round" />
          <line x1="1702" y1="469" x2="1804" y2="348" stroke="#190800" strokeWidth="20" strokeLinecap="round" />
          <line x1="1704" y1="472" x2="1826" y2="318" stroke="#190800" strokeWidth="17" strokeLinecap="round" />
          <line x1="1558" y1="356" x2="1496" y2="276" stroke="#190800" strokeWidth="12" strokeLinecap="round" />
          <line x1="1558" y1="356" x2="1528" y2="268" stroke="#190800" strokeWidth="10" strokeLinecap="round" />
          <line x1="1602" y1="308" x2="1568" y2="236" stroke="#190800" strokeWidth="10" strokeLinecap="round" />
          <line x1="1804" y1="348" x2="1852" y2="272" stroke="#190800" strokeWidth="12" strokeLinecap="round" />
          <line x1="1804" y1="348" x2="1844" y2="258" stroke="#190800" strokeWidth="10" strokeLinecap="round" />
          <line x1="1704" y1="308" x2="1672" y2="238" stroke="#190800" strokeWidth="11" strokeLinecap="round" />
          <line x1="1704" y1="308" x2="1736" y2="232" stroke="#190800" strokeWidth="11" strokeLinecap="round" />
          <line x1="1826" y1="318" x2="1800" y2="246" stroke="#190800" strokeWidth="9" strokeLinecap="round" />
          <line x1="1826" y1="318" x2="1858" y2="244" stroke="#190800" strokeWidth="9" strokeLinecap="round" />
        </g>

        {/* Ground grass/scrub */}
        {Array.from({ length: 32 }, (_, i) => {
          const x = i * 62 + 14;
          const y = 782 + (i % 4) * 4;
          const h = 14 + (i % 3) * 7;
          return (
            <path key={`gr${i}`}
              d={`M${x},${y} Q${x - 5},${y - h} ${x},${y - h * 0.75} Q${x + 5},${y - h} ${x + 10},${y}`}
              fill="#190800"
            />
          );
        })}

        {/* Distant figures (3 silhouettes near tree 1) */}
        {[340, 368, 396].map((x, fi) => (
          <g key={`fig${fi}`}>
            <rect x={x} y={738} width={5} height={24} fill="#190800" />
            <circle cx={x + 2.5} cy={735} r={4} fill="#190800" />
          </g>
        ))}
      </svg>

      <AbsoluteFill style={{
        background: 'radial-gradient(ellipse at center, transparent 22%, rgba(10,4,0,0.78) 100%)',
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};
