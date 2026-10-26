import { useState, type FormEvent } from 'react';
import { birthdayGiftOptions, fromAuthor, friendProfile } from '../content/messages';
import { fireConfetti } from '../utils/confetti';
import { saveGiftPicks } from '../utils/saveGiftPicks';
import { FestiveHead } from './FestiveHead';

type Status = 'idle' | 'saving' | 'sent' | 'error';

export function ContactWish() {
  const [name, setName] = useState(friendProfile.nickname);
  const [picked, setPicked] = useState<Set<string>>(() => new Set());
  const [whisper, setWhisper] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const toggle = (id: string) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selected = birthdayGiftOptions.filter((g) => picked.has(g.id));

  const send = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (picked.size === 0 && !whisper.trim()) {
      setError('Pick at least one gift, or leave a whisper for him.');
      setStatus('error');
      return;
    }

    setStatus('saving');
    try {
      await saveGiftPicks({
        name: name.trim() || friendProfile.nickname,
        gifts: selected.map((g) => g.title),
        giftIds: selected.map((g) => g.id),
        whisper: whisper.trim(),
      });
      setStatus('sent');
      fireConfetti(1.25);
    } catch (err) {
      const msg = err instanceof Error && err.message === 'timeout'
        ? 'The server was waking up (free hosting). Refresh the page, wait until the site loads, then tap Save again.'
        : 'Could not save right now — refresh and try again.';
      setError(msg);
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <section id="gift" className="section page-card page-card--celebrate gift-panel">
        <div className="gift-sent" role="status">
          <p className="gift-sent__title">Sent to {fromAuthor.name}</p>
          <p className="gift-sent__sub">Your picks are on their way — get ready to be spoiled.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="gift" className="section page-card page-card--celebrate gift-panel">
      <FestiveHead title="Pick your birthday gifts" subtitle={`${fromAuthor.name} will get your list.`} />
      <form className="gift-form" onSubmit={send}>
        <fieldset className="gift-form__choices">
          <legend className="gift-form__legend">Tap everything that sounds like you (more than one is okay)</legend>
          <div className="gift-grid">
            {birthdayGiftOptions.map((opt) => {
              const on = picked.has(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={`gift-card ${on ? 'gift-card--on' : ''}`}
                  aria-pressed={on}
                  onClick={() => toggle(opt.id)}
                >
                  <span className="gift-card__check" aria-hidden>{on ? '✓' : ''}</span>
                  <span className="gift-card__title">{opt.title}</span>
                  <span className="gift-card__detail">{opt.detail}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="wish-form__field gift-form__whisper">
          <span>A whisper for {fromAuthor.name} (optional)</span>
          <textarea
            value={whisper}
            onChange={(e) => setWhisper(e.target.value)}
            rows={4}
            placeholder="Anything else you want him to know today…"
          />
        </label>

        <label className="wish-form__field">
          <span>Your name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        {error ? <p className="gift-form__error" role="alert">{error}</p> : null}

        <button type="submit" className="btn btn--primary gift-form__submit" disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving…' : 'Save my picks'}
        </button>
      </form>
    </section>
  );
}
