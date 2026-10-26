import { useEffect, useState } from 'react';
import { sliderPhotos } from '../content/messages';

export function PhotoSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = sliderPhotos.length;

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % n), 6500);
    return () => window.clearInterval(id);
  }, [n, paused]);

  const go = (dir: -1 | 1) => setIndex((i) => (i + dir + n) % n);

  return (
    <section id="photos" className="hero-slider" aria-label="Memories with Ruu">
      <p className="hero-slider__intro">Our favourite frames</p>
      <div
        className="frame-mat hero-slider__mat"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div className="hero-slider__frame photo-frame photo-frame--hero">
        {sliderPhotos.map((slide, i) => (
          <figure
            key={slide.src}
            className={`hero-slider__slide ${i === index ? 'hero-slider__slide--on' : ''}`}
            aria-hidden={i !== index}
          >
            <img src={slide.src} alt={slide.caption} />
            <figcaption>{slide.caption}</figcaption>
          </figure>
        ))}
        <button type="button" className="hero-slider__nav hero-slider__nav--prev" onClick={() => go(-1)} aria-label="Previous photo">
          ‹
        </button>
        <button type="button" className="hero-slider__nav hero-slider__nav--next" onClick={() => go(1)} aria-label="Next photo">
          ›
        </button>
        </div>
      </div>
      <div className="hero-slider__dots" role="tablist" aria-label="Choose slide">
        {sliderPhotos.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            role="tab"
            aria-selected={i === index}
            className={`hero-slider__dot ${i === index ? 'hero-slider__dot--on' : ''}`}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
