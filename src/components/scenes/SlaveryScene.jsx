import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from 'remotion';

export const SlaveryScene = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, 20, durationInFrames - 20, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const w = frame * 1.3;   // wave time
  const sw = frame * 0.6;  // slow wave

  return (
    <AbsoluteFill style={{ opacity, overflow: 'hidden' }}>
      {/* Dark stormy sky */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #040710 0%, #08101e 22%, #0d1828 48%, #121e32 66%, #0c1424 100%)',
      }} />

      {/* Heavy storm clouds */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '58%',
        background: 'radial-gradient(ellipse at 32% 28%, rgba(22,28,48,0.92), transparent 52%), radial-gradient(ellipse at 68% 18%, rgba(18,24,44,0.88), transparent 48%), radial-gradient(ellipse at 52% 46%, rgba(14,20,40,0.72), transparent 58%), radial-gradient(ellipse at 18% 50%, rgba(20,26,46,0.68), transparent 44%)',
      }} />

      {/* Dark water */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '42%',
        background: 'linear-gradient(180deg, #0d1528 0%, #070e1c 38%, #040910 100%)',
      }} />

      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>

        {/* Wave 1 */}
        <path
          d={`M0,${638 + Math.sin(w * 0.052) * 9}
              Q240,${620 + Math.sin(w * 0.068 + 1.0) * 11} 480,${638 + Math.sin(w * 0.058) * 9}
              Q720,${656 + Math.sin(w * 0.078 + 2.0) * 11} 960,${638 + Math.sin(w * 0.052) * 9}
              Q1200,${620 + Math.sin(w * 0.068 + 3.0) * 11} 1440,${638 + Math.sin(w * 0.058) * 9}
              Q1680,${656 + Math.sin(w * 0.078 + 4.0) * 11} 1920,${638 + Math.sin(w * 0.052) * 9}
              L1920,1080 L0,1080 Z`}
          fill="rgba(14,24,48,0.62)"
        />

        {/* Wave 2 */}
        <path
          d={`M0,${678 + Math.sin(sw * 0.042 + 2.0) * 13}
              Q320,${658 + Math.sin(sw * 0.058 + 1.0) * 15} 640,${678 + Math.sin(sw * 0.046) * 13}
              Q960,${698 + Math.sin(sw * 0.072 + 3.0) * 15} 1280,${678 + Math.sin(sw * 0.042) * 13}
              Q1600,${658 + Math.sin(sw * 0.058 + 2.0) * 15} 1920,${678 + Math.sin(sw * 0.046) * 13}
              L1920,1080 L0,1080 Z`}
          fill="rgba(9,16,36,0.72)"
        />

        {/* SLAVE SHIP SILHOUETTE — large and ominous */}

        {/* Hull */}
        <path
          d="M674,593 Q698,634 730,650 L1190,650 Q1222,634 1246,593 Q1204,578 960,572 Q716,578 674,593 Z"
          fill="#030710"
        />
        {/* Lower hull curve */}
        <path
          d="M730,650 L1190,650 L1214,698 L706,698 Z"
          fill="#020508"
        />
        {/* Deck rail */}
        <rect x="686" y="582" width="548" height="14" fill="#030710" />

        {/* Hatches on deck */}
        {[750, 860, 960, 1060, 1150].map((x, hi) => (
          <rect key={`h${hi}`} x={x} y={578} width={28} height={8} fill="#05101e" rx={1} />
        ))}

        {/* CENTER MAST */}
        <rect x="956" y="322" width="9" height="264" fill="#030710" />
        {/* FORE MAST */}
        <rect x="828" y="358" width="8" height="228" fill="#030710" />
        {/* AFT MAST */}
        <rect x="1084" y="344" width="8" height="242" fill="#030710" />
        {/* Bowsprit */}
        <line x1="802" y1="494" x2="646" y2="428" stroke="#030710" strokeWidth="8" />

        {/* Yard arms — center mast */}
        <rect x="868" y="394" width="185" height="6" fill="#030710" />
        <rect x="880" y="446" width="160" height="6" fill="#030710" />
        <rect x="892" y="494" width="136" height="5" fill="#030710" />

        {/* Yard arms — fore mast */}
        <rect x="748" y="422" width="154" height="5" fill="#030710" />
        <rect x="759" y="468" width="130" height="5" fill="#030710" />

        {/* Yard arms — aft mast */}
        <rect x="1006" y="408" width="154" height="5" fill="#030710" />
        <rect x="1018" y="453" width="130" height="5" fill="#030710" />

        {/* Sails (furled, dark) */}
        <path d="M869,400 L1052,400 L1040,450 L881,450 Z" fill="rgba(3,7,16,0.95)" />
        <path d="M881,450 L1040,450 L1040,497 L881,494 Z" fill="rgba(3,7,16,0.92)" />
        <path d="M749,428 L901,428 L901,471 L749,467 Z" fill="rgba(3,7,16,0.95)" />
        <path d="M1007,414 L1159,414 L1159,456 L1007,452 Z" fill="rgba(3,7,16,0.95)" />

        {/* Rigging lines */}
        <line x1="960" y1="328" x2="686" y2="584" stroke="rgba(3,7,16,0.7)" strokeWidth="2" />
        <line x1="960" y1="328" x2="1234" y2="584" stroke="rgba(3,7,16,0.7)" strokeWidth="2" />
        <line x1="832" y1="362" x2="686" y2="584" stroke="rgba(3,7,16,0.5)" strokeWidth="1.5" />
        <line x1="1088" y1="348" x2="1234" y2="584" stroke="rgba(3,7,16,0.5)" strokeWidth="1.5" />

        {/* Chains draped over side */}
        <path
          d={`M750,590 Q758,610 750,630 Q742,650 750,670`}
          fill="none" stroke="rgba(8,18,36,0.8)" strokeWidth="5"
        />
        <path
          d={`M810,590 Q818,615 810,640 Q802,665 810,690`}
          fill="none" stroke="rgba(8,18,36,0.8)" strokeWidth="5"
        />

        {/* Distant second ship */}
        <g opacity="0.45">
          <path d="M1480,640 Q1492,658 1506,664 L1644,664 Q1658,658 1670,640 L1480,640 Z" fill="#030710" />
          <rect x="1487" y="634" width="183" height="8" fill="#030710" />
          <rect x="1570" y="450" width="6" height="188" fill="#030710" />
          <rect x="1512" y="470" width="5" height="168" fill="#030710" />
          <rect x="1628" y="460" width="5" height="178" fill="#030710" />
          <rect x="1530" y="496" width="82" height="4" fill="#030710" />
          <rect x="1595" y="484" width="72" height="4" fill="#030710" />
        </g>

        {/* Sea mist at waterline */}
        <rect x="0" y="628" width="1920" height="40"
          fill="url(#mistGrad)"
          opacity="0.35"
        />
        <defs>
          <linearGradient id="mistGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(20,35,68,0)" />
            <stop offset="50%" stopColor="rgba(20,35,68,0.4)" />
            <stop offset="100%" stopColor="rgba(20,35,68,0)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Cold blue vignette */}
      <AbsoluteFill style={{
        background: 'radial-gradient(ellipse at center, transparent 22%, rgba(3,6,14,0.78) 100%)',
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};
