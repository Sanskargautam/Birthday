import { surpriseFallbackMessage } from '../content/messages';
import { videoClips } from '../generated/videoClips';
import { HEADER_LOOP_CLIP_ID, LoopClip } from './LoopClip';
import { FestiveHead } from './FestiveHead';

export function SurpriseVideo() {
  const clips = videoClips.filter((c) => c.id !== HEADER_LOOP_CLIP_ID);

  return (
    <section id="surprise" className="section section--celebrate-band section--tight">
      <FestiveHead title="More clips" subtitle={clips.length > 1 ? `${clips.length} loops` : undefined} />
      {clips.length > 0 ? (
        <div className={`loop-clips ${clips.length > 1 ? 'loop-clips--grid' : ''}`}>
          {clips.map((clip) => (
            <figure key={clip.id} className="loop-clip-frame frame-mat frame-mat--video">
              <div className="loop-clip-frame__inner">
                <LoopClip clip={clip} className="loop-clip-frame__video" priority="low" />
              </div>
            </figure>
          ))}
        </div>
      ) : (
        <div className="surprise-message">
          <p>{surpriseFallbackMessage}</p>
        </div>
      )}
    </section>
  );
}
