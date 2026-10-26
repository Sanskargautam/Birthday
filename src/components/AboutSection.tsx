import { aboutCopy, friendProfile } from '../content/messages';
import { FestiveHead } from './FestiveHead';

export function AboutSection() {
  return (
    <section id="about" className="section page-card page-card--celebrate">
      <FestiveHead title={aboutCopy.title} />
      <p className="about-nickname">
        For <span>{friendProfile.nickname}</span>, today and always
      </p>
      {aboutCopy.paragraphs.map((p) => (
        <p key={p} className="about-p">{p}</p>
      ))}
    </section>
  );
}
