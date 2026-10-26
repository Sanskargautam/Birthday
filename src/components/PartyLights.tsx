import type { CSSProperties } from 'react';

const BULB_COLORS = ['#ff6b9d', '#ffd166', '#7dd3c0', '#9b5de5', '#00bbf9', '#f15bb5'];

export function PartyLights() {
  return (
    <>
      <div className="party-bokeh" aria-hidden>
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} className={`party-bokeh__orb party-bokeh__orb--${i % 4}`} />
        ))}
      </div>
      <ul className="party-lights" aria-hidden>
        {Array.from({ length: 20 }, (_, i) => (
          <li
            key={i}
            className="party-lights__bulb"
            style={{ '--bulb': BULB_COLORS[i % BULB_COLORS.length], '--i': i } as CSSProperties}
          />
        ))}
      </ul>
    </>
  );
}
