import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from 'remotion';

export const MapsScene = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, 20, durationInFrames - 20, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const scale = interpolate(frame, [0, durationInFrames], [1.0, 1.07], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const compassOpacity = interpolate(frame, [28, 52], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const label1 = interpolate(frame, [42, 66], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const label2 = interpolate(frame, [88, 112], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const label3 = interpolate(frame, [138, 162], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const label4 = interpolate(frame, [178, 202], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const label5 = interpolate(frame, [222, 246], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const ts = {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontStyle: 'italic',
    fill: '#5c2a00',
  };

  return (
    <AbsoluteFill style={{ opacity, overflow: 'hidden' }}>
      {/* Parchment background with zoom */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, #e8cf8a 0%, #d4ae52 22%, #c89a3c 48%, #d8b858 72%, #e2ca76 100%)',
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
      }} />

      {/* Age spots / worn areas */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 14% 18%, rgba(100,48,0,0.32), transparent 34%), radial-gradient(ellipse at 82% 76%, rgba(80,38,0,0.28), transparent 30%), radial-gradient(ellipse at 44% 88%, rgba(90,42,0,0.22), transparent 26%), radial-gradient(ellipse at 78% 14%, rgba(70,32,0,0.20), transparent 28%)',
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
      }} />

      {/* Worn edges */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 48%, rgba(78,38,0,0.52) 84%, rgba(58,24,0,0.82) 100%)',
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
      }} />

      <svg
        viewBox="0 0 1920 1080"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: `scale(${scale})`, transformOrigin: 'center center' }}
      >
        {/* Map border */}
        <rect x="58" y="38" width="1804" height="1004" fill="none" stroke="#8b4810" strokeWidth="7" />
        <rect x="70" y="50" width="1780" height="980" fill="none" stroke="#a05618" strokeWidth="2" />

        {/* Grid lines */}
        {[200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800].map(x => (
          <line key={`gx${x}`} x1={x} y1={38} x2={x} y2={1042} stroke="rgba(98,52,8,0.22)" strokeWidth="1" strokeDasharray="5,9" />
        ))}
        {[138, 278, 418, 558, 698, 838, 978].map(y => (
          <line key={`gy${y}`} x1={58} y1={y} x2={1862} y2={y} stroke="rgba(98,52,8,0.22)" strokeWidth="1" strokeDasharray="5,9" />
        ))}

        {/* West Africa land mass fill */}
        <path
          d="M692,188 L734,198 L762,214 L792,234 L814,260 L824,290 L828,322 L824,358 L814,386 L808,418 L802,450 L808,482 L822,508 L852,528 L892,543 L932,553 L972,559 L1012,562 L1052,566 L1094,569 L1128,576 L1152,588 L1168,604 L1178,624 L1182,648 L1176,672 L1166,694 L1154,716 L1144,738 L1138,758 L1132,778 L1126,800 L1120,824 L1114,852 L1108,884
          L818,884 L706,854 L624,802 L618,340 L622,296 L634,260 L652,228 Z"
          fill="rgba(175,112,36,0.22)"
        />

        {/* West Africa coastline */}
        <path
          d="M692,188 L734,198 L762,214 L792,234 L814,260 L824,290 L828,322 L824,358 L814,386 L808,418 L802,450 L808,482 L822,508 L852,528 L892,543 L932,553 L972,559 L1012,562 L1052,566 L1094,569 L1128,576 L1152,588 L1168,604 L1178,624 L1182,648 L1176,672 L1166,694 L1154,716 L1144,738 L1138,758 L1132,778 L1126,800 L1120,824 L1114,852 L1108,884"
          fill="none" stroke="#6b3510" strokeWidth="3.5"
        />

        {/* Inland boundary (dashed) */}
        <path
          d="M692,188 L652,228 L634,260 L622,296 L618,340 L622,382 L632,422 L646,462 L666,498 L696,522 L728,540 L768,552 L802,556 L828,558"
          fill="none" stroke="#6b3510" strokeWidth="2.5" strokeDasharray="10,7"
        />

        {/* River (Niger River hint) */}
        <path
          d="M900,340 Q920,380 880,420 Q850,450 870,500 Q890,540 930,555"
          fill="none" stroke="#6b3510" strokeWidth="2" opacity="0.5"
        />

        {/* City dots */}
        {[[762, 348], [824, 428], [906, 498], [984, 528], [858, 524]].map(([x, y], ci) => (
          <circle key={`cd${ci}`} cx={x} cy={y} r={5} fill="#6b3510" opacity={label1} />
        ))}

        {/* ── LABELS ── */}

        {/* IUDEORUM TERRA — bold, large */}
        <text x="818" y="372" fontSize="40" fontWeight="bold" opacity={label1} {...ts} letterSpacing="2">
          IUDEORUM TERRA
        </text>

        {/* JUDAH */}
        <text x="838" y="322" fontSize="32" opacity={label2} {...ts} letterSpacing="1">
          JUDAH
        </text>

        {/* JUDA (smaller, lower area) */}
        <text x="938" y="518" fontSize="26" opacity={label3} {...ts}>
          JUDA
        </text>

        {/* NEGROLAND */}
        <text x="668" y="568" fontSize="24" opacity={label4} {...ts}>
          NEGROLAND
        </text>

        {/* REGNO DI GIUDA */}
        <text x="808" y="472" fontSize="22" opacity={label5} {...ts}>
          REGNO DI GIUDA
        </text>

        {/* Compass rose */}
        <g transform="translate(1660, 812)" opacity={compassOpacity}>
          <circle cx="0" cy="0" r="66" fill="none" stroke="#8b4810" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="50" fill="rgba(215,172,72,0.35)" stroke="#8b4810" strokeWidth="1.2" />
          {/* N */}
          <path d="M0,-50 L9,-18 L0,-24 L-9,-18 Z" fill="#6b3510" />
          {/* S */}
          <path d="M0,50 L9,18 L0,24 L-9,18 Z" fill="#8b5820" />
          {/* W */}
          <path d="M-50,0 L-18,9 L-24,0 L-18,-9 Z" fill="#8b5820" />
          {/* E */}
          <path d="M50,0 L18,9 L24,0 L18,-9 Z" fill="#8b5820" />
          {/* Diagonals */}
          <line x1="-36" y1="-36" x2="36" y2="36" stroke="#8b5820" strokeWidth="1.5" />
          <line x1="36" y1="-36" x2="-36" y2="36" stroke="#8b5820" strokeWidth="1.5" />
          <text x="-6" y="-58" fontSize="17" fill="#6b3510" fontFamily="Georgia" fontWeight="bold">N</text>
          <text x="-6" y="76" fontSize="15" fill="#8b5820" fontFamily="Georgia">S</text>
          <text x="-76" y="5" fontSize="15" fill="#8b5820" fontFamily="Georgia">W</text>
          <text x="62" y="5" fontSize="15" fill="#8b5820" fontFamily="Georgia">E</text>
        </g>

        {/* Scale bar */}
        <g transform="translate(188, 958)" opacity={compassOpacity}>
          <line x1="0" y1="0" x2="210" y2="0" stroke="#6b3510" strokeWidth="2.5" />
          <line x1="0" y1="-7" x2="0" y2="7" stroke="#6b3510" strokeWidth="2.5" />
          <line x1="105" y1="-5" x2="105" y2="5" stroke="#6b3510" strokeWidth="2" />
          <line x1="210" y1="-7" x2="210" y2="7" stroke="#6b3510" strokeWidth="2.5" />
          <rect x="0" y="-10" width="105" height="10" fill="#6b3510" opacity="0.38" />
          <text x="64" y="24" fontSize="14" fill="#6b3510" fontFamily="Georgia" fontStyle="italic">100 Leagues</text>
        </g>

        {/* Small sailing ships in ocean west of Africa */}
        <g opacity={label2}>
          <path d="M448,392 Q458,402 468,407 L508,407 Q518,402 528,392 L448,392 Z" fill="#6b3510" />
          <rect x="476" y="366" width="3.5" height="29" fill="#6b3510" />
          <rect x="462" y="372" width="30" height="3.5" fill="#6b3510" />
          <rect x="466" y="387" width="22" height="3" fill="#6b3510" />

          <path d="M398,498 Q406,507 414,511 L448,511 Q456,507 464,498 L398,498 Z" fill="#6b3510" />
          <rect x="424" y="476" width="3" height="25" fill="#6b3510" />
          <rect x="413" y="482" width="24" height="3" fill="#6b3510" />
        </g>

        {/* Ocean label */}
        <text x="248" y="548" fontSize="28" opacity={compassOpacity} {...ts} letterSpacing="6">
          MARE OCEANUM
        </text>

        {/* Decorative corner flourishes */}
        <path d="M70,50 Q100,70 120,100" fill="none" stroke="#8b4810" strokeWidth="3" opacity="0.6" />
        <path d="M1850,50 Q1820,70 1800,100" fill="none" stroke="#8b4810" strokeWidth="3" opacity="0.6" />
        <path d="M70,1030 Q100,1010 120,980" fill="none" stroke="#8b4810" strokeWidth="3" opacity="0.6" />
        <path d="M1850,1030 Q1820,1010 1800,980" fill="none" stroke="#8b4810" strokeWidth="3" opacity="0.6" />
      </svg>
    </AbsoluteFill>
  );
};
