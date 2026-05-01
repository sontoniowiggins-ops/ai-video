import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from 'remotion';

export const AmericasScene = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, 20, durationInFrames - 20, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Ships sail in from right toward shore (left)
  const ship1X = interpolate(frame, [0, durationInFrames], [1500, 420], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const ship2X = interpolate(frame, [0, durationInFrames], [1720, 640], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const ship3X = interpolate(frame, [0, durationInFrames], [1860, 780], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const wf = frame * 0.7;

  return (
    <AbsoluteFill style={{ opacity, overflow: 'hidden' }}>

      {/* Bright Caribbean sky — golden sunrise */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #1a3a6e 0%, #2a5298 14%, #4a82c8 32%, #6eb4e8 50%, #a8d4f0 64%, #d4ecf8 72%, #e8c87a 82%, #e0a040 90%, #c87820 100%)',
      }} />

      {/* Sun rising on horizon */}
      <div style={{
        position: 'absolute',
        left: '72%', top: '62%',
        width: 180, height: 180,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #fff8e0 0%, #ffe080 28%, #ffb820 55%, rgba(255,140,0,0) 75%)',
        transform: 'translate(-50%, -50%)',
        filter: 'blur(4px)',
      }} />

      {/* Turquoise Caribbean water */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '42%',
        background: 'linear-gradient(180deg, #1a9878 0%, #0f7a60 28%, #0a5a48 58%, #063c30 100%)',
      }} />

      {/* Water shimmer / sunlight reflection */}
      <div style={{
        position: 'absolute', bottom: '28%', left: '40%', right: 0, height: '8%',
        background: 'linear-gradient(90deg, transparent, rgba(255,220,80,0.22), rgba(255,240,120,0.35), rgba(255,220,80,0.18), transparent)',
        filter: 'blur(6px)',
      }} />

      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>

        {/* Ocean waves */}
        <path
          d={`M0,${640 + Math.sin(wf * 0.045) * 8}
              Q480,${624 + Math.sin(wf * 0.058 + 1.0) * 10} 960,${640 + Math.sin(wf * 0.045) * 8}
              Q1440,${656 + Math.sin(wf * 0.068 + 2.0) * 10} 1920,${640 + Math.sin(wf * 0.045) * 8}
              L1920,1080 L0,1080 Z`}
          fill="rgba(10,80,60,0.45)"
        />
        <path
          d={`M0,${682 + Math.sin(wf * 0.038 + 2.0) * 12}
              Q640,${664 + Math.sin(wf * 0.052 + 1.2) * 14} 1280,${682 + Math.sin(wf * 0.038) * 12}
              Q1600,${700 + Math.sin(wf * 0.062) * 14} 1920,${682 + Math.sin(wf * 0.038) * 12}
              L1920,1080 L0,1080 Z`}
          fill="rgba(6,52,40,0.55)"
        />

        {/* LUSH TROPICAL COASTLINE — green and bright */}
        <path
          d="M0,652 L40,640 L82,632 L126,638 L172,644 L218,636 L264,628 L312,634 L358,640 L404,634 L452,628 L498,634 L546,640 L592,634 L638,626 L684,632 L730,638 L776,644 L822,640 L868,635 L914,640 L960,646 L0,1080 Z"
          fill="#1a4a1e"
        />
        <path
          d="M0,648 L960,646 L1006,640 L1054,634 L1100,638 L1150,642 L1200,638 L1252,644 L0,1080 Z"
          fill="#163c1a"
        />

        {/* Distant jungle hills */}
        <path
          d="M0,600 Q80,568 160,556 Q240,544 320,552 Q400,560 480,548 Q560,536 640,544 Q720,552 800,558 Q880,564 960,556 L960,648 L0,652 Z"
          fill="#1e5822"
        />
        <path
          d="M0,572 Q60,548 130,540 Q200,532 280,538 Q360,544 440,536 Q520,528 600,536 Q680,544 760,540 Q840,536 920,542 L960,556 L960,600 L0,600 Z"
          fill="#246828"
        />

        {/* TALL PALM TREES on shore */}
        {[40, 110, 195, 295, 400, 510, 620, 740, 860].map((x, pi) => {
          const h = 130 + (pi % 3) * 28;
          const lean = (pi % 2 === 0 ? 1 : -1) * (14 + (pi % 3) * 5);
          const baseY = 636 - (pi % 4) * 5;
          const tipX = x + lean;
          const tipY = baseY - h;
          return (
            <g key={`pt${pi}`}>
              <line x1={x} y1={baseY} x2={tipX} y2={tipY} stroke="#0e2e10" strokeWidth={8 + pi % 3} />
              {[-80, -50, -20, 10, 40, 70, 100, 125].map((ang, fi) => {
                const rad = (ang * Math.PI) / 180;
                const fl = 60 + (fi % 3) * 18;
                return (
                  <line key={`pf${fi}`}
                    x1={tipX} y1={tipY}
                    x2={tipX + Math.cos(rad - 0.3) * fl}
                    y2={tipY + Math.abs(Math.sin(rad - 0.3)) * fl * 0.6 + 8}
                    stroke="#1a4a1c"
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
          );
        })}

        {/* === SHIP 1 — large, main ship, clearly visible === */}
        <g transform={`translate(${ship1X - 960}, 0)`}>
          {/* Hull */}
          <path d="M860,570 Q880,608 904,622 L1056,622 Q1080,608 1100,570 L860,570 Z" fill="#4a3010" />
          <path d="M904,622 L1056,622 L1074,672 L886,672 Z" fill="#3a2408" />
          {/* Deck */}
          <rect x="870" y="562" width="200" height="12" fill="#5a3c14" />
          {/* Masts */}
          <rect x="952" y="330" width="8" height="236" fill="#3a2408" />
          <rect x="892" y="354" width="7" height="212" fill="#3a2408" />
          <rect x="1014" y="342" width="7" height="224" fill="#3a2408" />
          {/* Bowsprit */}
          <line x1="874" y1="482" x2="740" y2="424" stroke="#3a2408" strokeWidth="7" />
          {/* SAILS — cream/white colored, very visible */}
          <path d="M913,338 L1039,338 L1042,380 L910,376 Z" fill="rgba(240,228,190,0.95)" />
          <path d="M913,384 L1038,384 L1040,468 L912,464 Z" fill="rgba(235,222,180,0.92)" />
          <path d="M844,360 L948,360 L950,452 L842,448 Z" fill="rgba(232,218,176,0.90)" />
          <path d="M980,348 L1086,348 L1088,440 L978,436 Z" fill="rgba(232,218,176,0.90)" />
          <path d="M742,428 L870,428 L872,480 L740,475 Z" fill="rgba(228,214,172,0.85)" />
          {/* Rigging lines */}
          <line x1="960" y1="330" x2="870" y2="562" stroke="#3a2408" strokeWidth="2" opacity="0.7" />
          <line x1="960" y1="330" x2="1050" y2="562" stroke="#3a2408" strokeWidth="2" opacity="0.7" />
          <line x1="960" y1="330" x2="740" y2="428" stroke="#3a2408" strokeWidth="2" opacity="0.6" />
        </g>

        {/* === SHIP 2 — medium ship behind === */}
        <g transform={`translate(${ship2X - 960}, 0)`} opacity="0.88">
          <path d="M880,592 Q896,618 914,628 L1046,628 Q1064,618 1080,592 L880,592 Z" fill="#402a0c" />
          <path d="M914,628 L1046,628 L1060,668 L900,668 Z" fill="#30200a" />
          <rect x="888" y="585" width="192" height="10" fill="#4a3010" />
          <rect x="964" y="388" width="7" height="200" fill="#30200a" />
          <rect x="910" y="408" width="6" height="180" fill="#30200a" />
          <rect x="1020" y="396" width="6" height="192" fill="#30200a" />
          <line x1="892" y1="496" x2="788" y2="452" stroke="#30200a" strokeWidth="6" />
          <path d="M928,412 L1032,412 L1034,488 L926,484 Z" fill="rgba(235,220,178,0.90)" />
          <path d="M862,456 L960,456 L962,520 L860,516 Z" fill="rgba(230,215,172,0.85)" />
          <path d="M992,428 L1090,428 L1092,500 L990,496 Z" fill="rgba(230,215,172,0.85)" />
        </g>

        {/* === SHIP 3 — small ship in distance === */}
        <g transform={`translate(${ship3X - 960}, 0)`} opacity="0.70">
          <path d="M900,610 Q912,630 924,637 L1010,637 Q1022,630 1034,610 L900,610 Z" fill="#382208" />
          <rect x="906" y="604" width="128" height="9" fill="#402808" />
          <rect x="960" y="452" width="5.5" height="155" fill="#382208" />
          <rect x="920" y="468" width="5" height="138" fill="#382208" />
          <rect x="1000" y="460" width="5" height="147" fill="#382208" />
          <path d="M924,472 L1010,472 L1012,524 L922,520 Z" fill="rgba(228,212,168,0.88)" />
          <path d="M884,492 L960,492 L962,540 L882,536 Z" fill="rgba(224,208,164,0.82)" />
        </g>

        {/* Horizon haze */}
        <ellipse cx="960" cy="638" rx="960" ry="18" fill="rgba(180,230,210,0.18)" />

      </svg>

      {/* Soft warm vignette */}
      <AbsoluteFill style={{
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,20,10,0.55) 100%)',
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};
