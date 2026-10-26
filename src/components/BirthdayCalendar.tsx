import { birthdayDay, birthdayMonth, birthdayYear } from '../siteConfig';
import { FestiveHead } from './FestiveHead';

const WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function BirthdayCalendar() {
  const first = new Date(birthdayYear, birthdayMonth - 1, 1);
  const daysInMonth = new Date(birthdayYear, birthdayMonth, 0).getDate();
  const startPad = first.getDay();
  const monthLabel = first.toLocaleString('default', { month: 'long', year: 'numeric' });

  const cells: (number | null)[] = [...Array(startPad).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <section id="date" className="section page-card page-card--celebrate">
      <FestiveHead title="The day that matters" subtitle="27 on the 27th." />
      <div className="cal-widget" aria-label={`Calendar ${monthLabel}`}>
        <p className="cal-widget__month">{monthLabel}</p>
        <div className="cal-widget__weekdays">
          {WEEK.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="cal-widget__grid">
          {cells.map((day, i) => {
            if (day === null) return <span key={`e-${i}`} className="cal-cell cal-cell--empty" />;
            const special = day === birthdayDay;
            return (
              <div
                key={day}
                className={`cal-cell ${special ? 'cal-cell--special' : 'cal-cell--crossed'}`}
                aria-label={special ? `Birthday, ${monthLabel} ${day}` : undefined}
              >
                <span className="cal-cell__num">{day}</span>
                {!special && <span className="cal-cell__x" aria-hidden>×</span>}
              </div>
            );
          })}
        </div>
        <p className="cal-widget__note">
          <strong>{birthdayDay} {monthLabel.split(' ')[0]}</strong> — blocked for celebration only.
        </p>
      </div>
    </section>
  );
}
