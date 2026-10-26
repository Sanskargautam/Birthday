import { headerCopy } from '../content/messages';
import { videoClips } from '../generated/videoClips';
import { HEADER_LOOP_CLIP_ID, LoopClip } from './LoopClip';

export function HeaderLoopVideo() {
  const clip = videoClips.find((c) => c.id === HEADER_LOOP_CLIP_ID);
  if (!clip) return null;

  return (
    <section id="top" className="header-loop frame-mat frame-mat--video" aria-label="Ruu — moment on loop">
      <div className="header-loop__inner">
        <LoopClip clip={clip} className="header-loop__video" />
        <div className="header-loop__fade" aria-hidden />
        <p className="header-loop__badge" aria-hidden>27</p>
        <div className="header-loop__caption">
          <p className="header-loop__eyebrow">{headerCopy.wishDate}</p>
          <h1 className="header-loop__title">{headerCopy.wishTitle}</h1>
          <p className="header-loop__subtitle">{headerCopy.punchline}</p>
        </div>
        <a className="header-loop__scroll" href="#photos" aria-label="Scroll to photos">
          <span className="header-loop__scroll-dot" aria-hidden />
        </a>
      </div>
    </section>
  );
}
