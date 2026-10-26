import type { CSSProperties } from 'react';

/** Deterministic polaroid-style offsets — reads organic, stays stable across filters. */
const LAYOUT = [
  { w: 44, rot: -5, dx: 0, dy: 0, z: 2, dur: 7.2 },
  { w: 38, rot: 4, dx: 4, dy: 12, z: 1, dur: 8.1 },
  { w: 48, rot: -2, dx: -3, dy: 6, z: 3, dur: 6.8 },
  { w: 40, rot: 6, dx: 2, dy: 18, z: 2, dur: 7.6 },
  { w: 46, rot: -4, dx: -5, dy: 8, z: 4, dur: 9 },
  { w: 36, rot: 3, dx: 6, dy: 14, z: 1, dur: 7 },
  { w: 50, rot: -6, dx: 0, dy: 20, z: 3, dur: 8.4 },
  { w: 42, rot: 2, dx: -4, dy: 4, z: 2, dur: 6.5 },
  { w: 39, rot: -3, dx: 3, dy: 16, z: 1, dur: 7.8 },
];

export function collagePieceStyle(index: number): CSSProperties {
  const p = LAYOUT[index % LAYOUT.length];
  return {
    '--collage-w': `${p.w}%`,
    '--collage-rot': `${p.rot}deg`,
    '--collage-dx': `${p.dx}px`,
    '--collage-dy': `${p.dy}px`,
    '--collage-z': p.z,
    '--float-dur': `${p.dur}s`,
    '--stagger': `${Math.min(index * 0.04, 0.8)}s`,
    zIndex: p.z,
  } as CSSProperties;
}
