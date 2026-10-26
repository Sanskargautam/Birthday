import type { CSSProperties } from 'react';
import { sliderPhotos } from '../content/messages';
import { galleryItems } from '../data/gallery';
import { FestiveHead } from './FestiveHead';

function tiltFor(index: number) {
  const rot = ((index * 17) % 9) - 4 + (index % 2) * 0.5;
  return `${rot}deg`;
}

export function MemoryStrip() {
  const sliderSet = new Set(sliderPhotos.map((s) => s.src));
  const extra = galleryItems.filter((g) => !sliderSet.has(g.src));

  return (
    <section id="moments" className="section section--memories">
      <FestiveHead title="More snapshots" subtitle={extra.length > 0 ? `${extra.length} moments` : undefined} />
      <div className="snapshot-collage">
        {extra.map((item, i) => {
          const style = { '--snap-rot': tiltFor(i) } as CSSProperties;
          return (
            <figure key={item.id} className="snapshot-collage__item" style={style}>
              <div className="snapshot-collage__mat">
                <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
              </div>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
