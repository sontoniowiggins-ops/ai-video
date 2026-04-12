import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from 'remotion';

export const AmericasScene = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, 20, durationInFrames - 20, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Ships drift in from the right toward shore
  const ship1X = interpolate(frame, [0, durationInFrames], [860, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const ship2X = interpolate(frame, [0, durationInFrames], [1020, 180], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const wf = frame * 0.85;

  return (
    <AbsoluteFill style={{ opacity, overflow: 'hidden' }}>
      {/* Overcast tropical sky */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #1a2535 0%, #253445 24%, #2d3c52 48%, #344758 68%, #2a3a4e 86%, #1e2c3e 100%)',
      }} />

      {/* Overcast cloud layers */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '62%',
        background: 'radial-gradient(ellipse at 28% 22%, rgba(48,62,88,0.62), transparent 44%), radial-gradient(ellipse at 68% 32%, rgba(44,58,84,0.58), transparent 42%), radial-gradient(ellipse at 50% 12%, rgba(52,66,92,0.52), transparent 50%), radial-gradient(ellipse at 15% 48%, rgba(40,54,78,0.48), transparent 38%)',
      }} />

      {/* Dark ocean */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
        background: 'linear-gradient(180deg, #1e2d40 0%, #142030 42%, #0c1826 100%)',
      }} />

      {/* Horizon mist */}
      <div style={{
        position: 'absolute', top: '54%', left: 0, right: 0, height: '10%',
        background: 'linear-gradient(180deg, transparent, rgba(38,58,88,0.38), transparent)',
        filter: 'blur(16px)',
      }} />

      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>

        {/* Ocean waves */}
        <path
          d={`M0,${644 + Math.sin(wf * 0.052) * 7}
              Q480,${628 + Math.sin(wf * 0.064 + 1.0) * 9} 960,${644 + Math.sin(wf * 0.052) * 7}
              Q1440,${660 + Math.sin(wf * 0.074 + 2.0) * 9} 1920,${644 + Math.sin(wf * 0.052) * 7}
              L1920,1080 L0,1080 Z`}
          fill="rgba(18,32,52,0.58)"
        />
        <path
          d={`M0,${685 + Math.sin(wf * 0.042 + 2.0) * 11}
              Q640,${668 + Math.sin(wf * 0.058 + 1.2) * 13} 1280,${685 + Math.sin(wf * 0.042) * 11}
              Q1600,${702 + Math.sin(wf * 0.068) * 13} 1920,${685 + Math.sin(wf * 0.042) * 11}
              L1920,1080 L0,1080 Z`}
          fill="rgba(12,22,40,0.68)"
        />

        {/* Distant coast (right side — the New World shore) */}
        <path
          d="M1280,650 Q1320,636 1360,626 L1400,622 L1448,628 L1492,622 L1540,614 L1588,618 L1636,624 L1680,618 L1728,612 L1776,618 L1824,624 L1872,618 L1920,614 L1920,1080 L1280,1080 Z"
          fill="#0c1a26"
        />

        {/* Main coastline — left/center with tropical vegetation */}
        <path
          d="M0,648 L44,636 L88,628 L132,634 L176,640 L222,632 L268,624 L316,630 L362,636 L408,630 L454,624 L502,630 L548,636 L594,630 L640,622 L688,628 L734,634 L780,640 L826,635 L872,630 L918,635 L964,640 L1010,635 L1058,630 L1106,634 L1156,638 L1206,635 L1256,640 L1280,648 L1280,1080 L0,1080 Z"
          fill="#0a1820"
        />

        {/* PALM TREES along coast */}
        {[60, 145, 242, 372, 494, 628, 768, 916, 1064, 1188].map((x, pi) => {
          const h = 102 + (pi % 3) * 22;
          const lean = (pi % 2 === 0 ? 1 : -1) * (12 + (pi % 3) * 4);
          const baseY = 630 - (pi % 4) * 4;
          const tipX = x + lean;
          const tipY = baseY - h;
          return (
            <g key={`pt${pi}`}>
              {/* Trunk */}
              <line x1={x} y1={baseY} x2={tipX} y2={tipY} stroke="#0a1820" strokeWidth={7 + pi % 2} />
              {/* Fronds */}
              {[-75, -45, -15, 15, 45, 75, 105, 130].map((ang, fi) => {
                const rad = (ang * Math.PI) / 180;
                const fl = 54 + (fi % 3) * 14;
                return (
                  <line
                    key={`pf${fi}`}
                    x1={tipX} y1={tipY}
                    x2={tipX + Math.cos(rad - 0.25) * fl}
                    y2={tipY + Math.abs(Math.sin(rad - 0.25)) * fl * 0.55 + 6}
                    stroke="#0a1820"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
          );
        })}

        {/* SHIP 1 — larger, approaching center */}
        <g transform={`translate(${ship1X}, 0)`}>
          <path d="M880,598 Q900,630 922,642 L1038,642 Q1060,630 1080,598 L880,598 Z" fill="#09131e" />
          <path d="M922,642 L1038,642 L1054,686 L906,686 Z" fill="#07101a" />
          <rect x="890" y="590" width="180" height="11" fill="#09131e" />
          <rect x="956" y="368" width="7" height="226" fill="#09131e" />
          <rect x="898" y="394" width="6" height="200" fill="#09131e" />
          <rect x="1014" y="382" width="6" height="212" fill="#09131e" />
          <line x1="878" y1="502" x2="754" y2="446" stroke="#09131e" strokeWidth="6" />
          <rect x="912" y="422" width="126" height="5" fill="#09131e" />
          <rect x="920" y="466" width="108" height="4" fill="#09131e" />
          <rect x="840" y="448" width="108" height="5" fill="#09131e" />
          <rect x="978" y="436" width="108" height="5" fill="#09131e" />
          <path d="M913,427 L1037,427 L1037,469 L913,466 Z" fill="rgba(9,19,30,0.94)" />
          <path d="M841,454 L947,454 L947,492 L841,488 Z" fill="rgba(9,19,30,0.94)" />
          <path d="M979,441 L1085,441 L1085,479 L979,476 Z" fill="rgba(9,19,30,0.94)" />
        </g>

        {/* SHIP 2 — smaller, slightly behind and right */}
        <g transform={`translate(${ship2X}, 0)`} opacity="0.75">
          <path d="M900,618 Q916,642 932,650 L1008,650 Q1024,642 1040,618 L900,618 Z" fill="#09131e" />
          <rect x="908" y="611" width="132" height="9" fill="#09131e" />
          <rect x="970" y="436" width="5.5" height="178" fill="#09131e" />
          <rect x="924" y="456" width="5" height="158" fill="#09131e" />
          <rect x="1016" y="447" width="5" height="168" fill="#09131e" />
          <line x1="910" y1="530" x2="820" y2="490" stroke="#09131e" strokeWidth="5" />
          <rect x="940" y="476" width="90" height="4" fill="#09131e" />
          <rect x="1000" y="468" width="85" height="4" fill="#09131e" />
          <path d="M941,480 L1029,480 L1029,514 L941,511 Z" fill="rgba(9,19,30,0.94)" />
        </g>

        {/* Shore mist */}
        <ellipse cx="640" cy="642" rx="580" ry="22" fill="rgba(30,52,80,0.28)" />

        {/* Rain streaks (light) */}
        {Array.from({ length: 14 }, (_, ri) => {
          const rainX = ((ri * 137 + frame * 8) % 1920);
          return (
            <line key={`r${ri}`}
              x1={rainX} y1={0}
              x2={rainX - 22} y2={400}
              stroke="rgba(48,72,108,0.12)"
              strokeWidth="1.5"
            />
          );
        })}
      </svg>

      {/* Cold blue vignette */}
      <AbsoluteFill style={{
        background: 'radial-gradient(ellipse at center, transparent 22%, rgba(4,8,18,0.76) 100%)',
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};
