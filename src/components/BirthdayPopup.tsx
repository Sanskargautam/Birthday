import { useEffect, useState } from 'react';
import { fromAuthor, headerCopy } from '../content/messages';
import { fireConfetti } from '../utils/confetti';

const STORAGE_KEY = 'ruu-bday-popup-v3';

export function BirthdayPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const t = window.setTimeout(() => setOpen(true), 400);
    return () => window.clearTimeout(t);
  }, []);

  const close = () => {
    sessionStorage.setItem(STORAGE_KEY, '1');
    setOpen(false);
    fireConfetti(1.1);
  };

  if (!open) return null;

  return (
    <div className="bday-popup bday-popup--open" role="dialog" aria-modal="true" aria-labelledby="bday-popup-title">
      <div className="bday-popup__card">
        <p className="bday-popup__eyebrow">{headerCopy.wishDate}</p>
        <h2 id="bday-popup-title">{headerCopy.wishTitle}</h2>
        <p className="bday-popup__sub bday-popup__sub--punch">{headerCopy.punchline}</p>
        <p className="bday-popup__sub">
          {fromAuthor.name} made this for your birthday — come in when you’re ready.
        </p>
        <button type="button" className="btn btn--primary" onClick={close}>
          Let’s celebrate ♡
        </button>
      </div>
    </div>
  );
}
