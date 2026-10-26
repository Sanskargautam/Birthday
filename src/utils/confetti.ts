const COLORS = ['#ff6b9d', '#ffd166', '#7dd3c0', '#9b5de5', '#00bbf9', '#fff5e8'];

export function fireConfetti(intensity = 1) {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const count = Math.floor(40 * intensity);
  const container = document.createElement('div');
  container.setAttribute('aria-hidden', 'true');
  container.className = 'confetti-layer';
  document.body.appendChild(container);

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'confetti-bit';
    el.style.left = `${Math.random() * 100}%`;
    el.style.background = COLORS[i % COLORS.length];
    el.style.animationDuration = `${1.8 + Math.random() * 1.2}s`;
    el.style.animationDelay = `${Math.random() * 0.4}s`;
    el.style.transform = `rotate(${Math.random() * 360}deg)`;
    container.appendChild(el);
  }

  window.setTimeout(() => container.remove(), 3200);
}
