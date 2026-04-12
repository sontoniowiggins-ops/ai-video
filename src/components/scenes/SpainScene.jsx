import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from 'remotion';

export const SpainScene = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, 20, durationInFrames - 20, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const sunGlow = Math.sin(frame * 0.04) * 0.08 + 0.92;
  const sunY = 60 + frame * 0.06;
  const shimmer = frame * 0.9;

  return (
    <AbsoluteFill style={{ opacity, overflow: 'hidden' }}>
      {/* Golden sunset sky */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #180900 0%, #3c1700 14%, #7a3600 30%, #c46e00 48%, #e88c00 62%, #f5ae2c 70%, #e89020 78%, #c06c00 87%, #784000 95%, #482800 100%)',
      }} />

      {/* Sun orb */}
      <div style={{
        position: 'absolute',
        left: '74%', top: `${sunY}%`,
        width: 118, height: 118,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(255,248,200,${sunGlow}), rgba(255,200,80,0.88) 38%, rgba(255,155,35,0.62) 68%, transparent)`,
        transform: 'translate(-50%, -50%)',
        filter: 'blur(2px)',
      }} />

      {/* Sun halo */}
      <div style={{
        position: 'absolute',
        left: '74%', top: `${sunY}%`,
        width: 480, height: 280,
        borderRadius: '50%',
        background: `radial-gradient(ellipse, rgba(255,155,35,${0.32 * sunGlow}), transparent 58%)`,
        transform: 'translate(-50%, -50%)',
        filter: 'blur(28px)',
      }} />

      {/* Harbor glow on water */}
      <div style={{
        position: 'absolute', top: '62%', left: '45%', right: 0, height: '14%',
        background: 'linear-gradient(180deg, rgba(255,145,28,0.38), transparent)',
        filter: 'blur(14px)',
      }} />

      {/* Dark harbor water */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '34%',
        background: 'linear-gradient(180deg, #3c1900 0%, #1e0c00 33%, #0d0500 100%)',
      }} />

      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {/* Water shimmer */}
        {Array.from({ length: 9 }, (_, i) => {
          const y = 718 + i * 28 + Math.sin(shimmer * 0.055 + i) * 5;
          const so = 0.10 + Math.sin(shimmer * 0.11 + i * 1.6) * 0.07;
          return (
            <line key={`ws${i}`}
              x1={1040 + i * 18} y1={y} x2={1920} y2={y + 9}
              stroke={`rgba(255,175,75,${so})`} strokeWidth={2 + i % 2}
            />
          );
        })}

        {/* Stone dock / quay */}
        <path
          d="M0,840 L0,1080 L1920,1080 L1920,840 L1800,828 L1700,818 L1400,816 L800,816 L600,823 L400,828 L200,834 Z"
          fill="#110900"
        />
        <path
          d="M0,838 L200,832 L400,826 L600,821 L800,814 L1400,814 L1700,816 L1800,826 L1920,836"
          stroke="#1c1000" strokeWidth="4" fill="none"
        />

        {/* Crowd on dock */}
        {Array.from({ length: 48 }, (_, i) => {
          const x = 28 + i * 36 + (i % 3) * 7;
          const h = 52 + (i % 5) * 13;
          const y = 813 - h;
          return (
            <g key={`p${i}`}>
              <rect x={x} y={y} width={6} height={h} fill="#090500" />
              <circle cx={x + 3} cy={y - 5} r={5} fill="#090500" />
            </g>
          );
        })}

        {/* Dock bollards */}
        {[95, 290, 490, 690, 1000, 1200, 1400, 1600, 1800].map((x, bi) => (
          <rect key={`bl${bi}`} x={x} y={793} width={11} height={28} fill="#090500" />
        ))}

        {/* SHIP 1 — large center */}
        <path d="M758,608 Q778,648 808,666 L1152,666 Q1182,648 1202,608 Q1162,593 960,586 Q758,593 758,608 Z" fill="#0c0700" />
        <path d="M808,666 L1152,666 L1178,720 L782,720 Z" fill="#090500" />
        <rect x="768" y="598" width="432" height="13" fill="#0c0700" />
        {/* Masts */}
        <rect x="956" y="338" width="9" height="265" fill="#0c0700" />
        <rect x="854" y="372" width="8" height="230" fill="#0c0700" />
        <rect x="1058" y="358" width="8" height="246" fill="#0c0700" />
        <line x1="808" y1="498" x2="656" y2="437" stroke="#0c0700" strokeWidth="7" />
        {/* Yards */}
        <rect x="868" y="408" width="182" height="6" fill="#0c0700" />
        <rect x="880" y="458" width="157" height="5" fill="#0c0700" />
        <rect x="890" y="505" width="132" height="5" fill="#0c0700" />
        <rect x="773" y="438" width="147" height="5" fill="#0c0700" />
        <rect x="784" y="484" width="122" height="5" fill="#0c0700" />
        <rect x="1012" y="424" width="147" height="5" fill="#0c0700" />
        <rect x="1023" y="469" width="122" height="5" fill="#0c0700" />
        {/* Sails */}
        <path d="M869,414 L1049,414 L1037,463 L881,463 Z" fill="rgba(12,7,0,0.92)" />
        <path d="M881,463 L1037,463 L1037,508 L881,505 Z" fill="rgba(12,7,0,0.88)" />
        <path d="M774,444 L920,444 L920,487 L774,483 Z" fill="rgba(12,7,0,0.92)" />
        <path d="M1013,430 L1158,430 L1158,473 L1013,469 Z" fill="rgba(12,7,0,0.92)" />
        <path d="M960,338 L996,349 L960,364 Z" fill="#1a0c00" />

        {/* SHIP 2 — right */}
        <path d="M1218,628 Q1236,662 1258,676 L1492,676 Q1514,662 1532,628 L1218,628 Z" fill="#090500" />
        <path d="M1258,676 L1492,676 L1512,720 L1238,720 Z" fill="#070400" />
        <rect x="1228" y="620" width="304" height="10" fill="#090500" />
        <rect x="1367" y="373" width="7" height="252" fill="#090500" />
        <rect x="1288" y="398" width="7" height="228" fill="#090500" />
        <rect x="1446" y="388" width="7" height="237" fill="#090500" />
        <line x1="1248" y1="518" x2="1147" y2="463" stroke="#090500" strokeWidth="6" />
        <rect x="1303" y="426" width="132" height="5" fill="#090500" />
        <rect x="1315" y="471" width="108" height="4" fill="#090500" />
        <rect x="1238" y="452" width="106" height="4" fill="#090500" />
        <rect x="1419" y="438" width="106" height="4" fill="#090500" />
        <path d="M1304,431 L1435,431 L1435,474 L1304,471 Z" fill="rgba(9,5,0,0.92)" />
        <path d="M1239,457 L1343,457 L1343,495 L1239,491 Z" fill="rgba(9,5,0,0.92)" />
        <path d="M1420,443 L1524,443 L1524,482 L1420,478 Z" fill="rgba(9,5,0,0.92)" />

        {/* SHIP 3 — left */}
        <path d="M158,618 Q176,654 198,667 L472,667 Q494,654 512,618 L158,618 Z" fill="#090500" />
        <path d="M198,667 L472,667 L494,716 L176,716 Z" fill="#070400" />
        <rect x="168" y="610" width="344" height="10" fill="#090500" />
        <rect x="333" y="368" width="7" height="246" fill="#090500" />
        <rect x="246" y="398" width="7" height="216" fill="#090500" />
        <rect x="420" y="386" width="7" height="230" fill="#090500" />
        <line x1="216" y1="508" x2="103" y2="456" stroke="#090500" strokeWidth="6" />
        <rect x="268" y="426" width="122" height="5" fill="#090500" />
        <rect x="279" y="469" width="101" height="4" fill="#090500" />
        <rect x="386" y="434" width="106" height="4" fill="#090500" />
        <path d="M269,431 L390,431 L390,472 L269,469 Z" fill="rgba(9,5,0,0.92)" />
        <path d="M387,439 L491,439 L491,477 L387,474 Z" fill="rgba(9,5,0,0.92)" />

        {/* Golden water reflections */}
        <ellipse cx="960" cy="755" rx="420" ry="26" fill="rgba(195,95,18,0.14)" />
        <ellipse cx="1375" cy="775" rx="210" ry="18" fill="rgba(175,75,12,0.10)" />
        <ellipse cx="330" cy="760" rx="180" ry="16" fill="rgba(175,75,12,0.10)" />
      </svg>

      <AbsoluteFill style={{
        background: 'radial-gradient(ellipse at center, transparent 18%, rgba(8,4,0,0.82) 100%)',
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};
