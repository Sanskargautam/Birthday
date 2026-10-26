import { useState } from 'react';
import { fromAuthor, memoryQuestSteps } from '../content/messages';
import { fireConfetti } from '../utils/confetti';
import { FestiveHead } from './FestiveHead';

export function MemoryQuest() {
  const [unlocked, setUnlocked] = useState<Set<string>>(() => new Set());

  const unlock = (stepId: string) => {
    const next = new Set(unlocked);
    next.add(stepId);
    setUnlocked(next);
    if (next.size === memoryQuestSteps.length) {
      fireConfetti(1.3);
      window.setTimeout(() => {
        document.querySelector('#cards')?.scrollIntoView({ behavior: 'smooth' });
      }, 600);
    }
  };

  return (
    <section id="quest" className="section page-card page-card--glass page-card--celebrate">
      <FestiveHead
        title="Little knots to untie"
        subtitle={`Four little surprises from ${fromAuthor.name} — then your letter opens below.`}
      />
      <ol className="quest-list">
        {memoryQuestSteps.map((step, index) => {
          const open = unlocked.has(step.id);
          return (
            <li key={step.id} className={`quest-step ${open ? 'quest-step--open' : ''}`}>
              {!open ? (
                <button type="button" className="quest-step__lock" onClick={() => unlock(step.id)}>
                  <span className="quest-step__num">{index + 1}</span>
                  <span>
                    <strong>{step.title}</strong>
                    <small>{step.teaser}</small>
                  </span>
                </button>
              ) : (
                <article className="quest-step__reveal">
                  <div className="frame-mat frame-mat--compact">
                    <div className="photo-frame photo-frame--quest">
                      <img src={step.photo} alt="" loading="lazy" decoding="async" />
                    </div>
                  </div>
                  <div className="quest-step__text">
                    <p className="quest-step__quote">{step.whisper}</p>
                  </div>
                </article>
              )}
            </li>
          );
        })}
      </ol>
      {unlocked.size === memoryQuestSteps.length ? (
        <p className="quest-done" role="status">All untied — your letter is right below.</p>
      ) : (
        <p className="quest-skip">
          <a href="#cards">Skip to the letter</a>
        </p>
      )}
    </section>
  );
}
