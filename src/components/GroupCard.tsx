import type { CSSProperties } from 'react';
import { fromAuthor, friendProfile, groupCardMessages } from '../content/messages';
import { FestiveHead } from './FestiveHead';

export function GroupCard() {
  return (
    <section id="cards" className="section group-card-section">
      <FestiveHead title="Your birthday letter" subtitle={`From ${fromAuthor.name}, with love.`} />
      <div className="group-card-outer glass-panel">
        <header className="group-card-cover">
          <p className="group-card-cover__eyebrow">✦ 27 · 27 October ✦</p>
          <h3>For Ruu, on her {friendProfile.age}th</h3>
          <p className="group-card-cover__sub">Read slow. This is the part I mean.</p>
        </header>
        <div className="group-card-signatures">
          {groupCardMessages.map((m, i) => (
            <blockquote
              key={m.id}
              className="signature-card"
              style={{ '--sig-accent': m.accent, '--sig-i': i } as CSSProperties}
            >
              <p className="signature-card__message">{m.message}</p>
              <footer>
                <strong>{m.from}</strong>
                <span>{m.subtitle}</span>
              </footer>
            </blockquote>
          ))}
        </div>
        <p className="group-card-footer">Always — {fromAuthor.signoff}</p>
      </div>
    </section>
  );
}
