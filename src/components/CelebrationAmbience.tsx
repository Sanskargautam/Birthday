const CONFETTI_COUNT = 10;

export function CelebrationAmbience() {
  return (
    <div className="celebration-ambience" aria-hidden>
      <div className="celebration-ambience__stitch" />
      <div className="celebration-ambience__glow celebration-ambience__glow--gold" />
      <div className="celebration-ambience__glow celebration-ambience__glow--rose" />
      <div className="celebration-ambience__glow celebration-ambience__glow--lilac" />
      <div className="celebration-ambience__glow celebration-ambience__glow--mint" />
      {Array.from({ length: CONFETTI_COUNT }, (_, i) => (
        <span
          key={i}
          className={`celebration-ambience__confetti celebration-ambience__confetti--${(i % 5) + 1}`}
          style={{ '--i': i } as import('react').CSSProperties}
        />
      ))}
    </div>
  );
}
