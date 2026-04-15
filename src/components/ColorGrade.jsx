import { AbsoluteFill } from 'remotion';

// Cinematic color overlays — warm → cold progression through the story
const GRADES = {
  warm:        { filter: 'sepia(0.25) saturate(1.3)',                         overlay: 'rgba(180, 100, 20, 0.08)' },
  fire:        { filter: 'sepia(0.15) saturate(1.5) hue-rotate(-5deg)',       overlay: 'rgba(200, 80, 10, 0.12)' },
  'warm-to-dark': { filter: 'sepia(0.2) saturate(1.1)',                       overlay: 'rgba(140, 70, 10, 0.10)' },
  'warm-gold': { filter: 'sepia(0.3) saturate(1.4) brightness(1.05)',         overlay: 'rgba(210, 140, 20, 0.10)' },
  sepia:       { filter: 'sepia(0.5) saturate(0.9) brightness(0.95)',         overlay: 'rgba(160, 100, 30, 0.12)' },
  cold:        { filter: 'saturate(0.5) hue-rotate(190deg) brightness(0.75)', overlay: 'rgba(10, 30, 80, 0.20)' },
  black:       { filter: 'none',                                               overlay: 'transparent' },
};

export const ColorGrade = ({ grade = 'warm', children }) => {
  const { filter, overlay } = GRADES[grade] || GRADES.warm;

  return (
    <AbsoluteFill style={{ filter }}>
      {children}
      <AbsoluteFill
        style={{ backgroundColor: overlay, pointerEvents: 'none' }}
      />
    </AbsoluteFill>
  );
};
