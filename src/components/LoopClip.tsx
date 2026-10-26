import { useState } from 'react';
import type { VideoClip } from '../generated/videoClips';

type Props = {
  clip: VideoClip;
  className?: string;
};

/** Browsers allow autoplay only when muted. */
export function LoopClip({ clip, className = '' }: Props) {
  const [src, setSrc] = useState(clip.src);
  const [triedFallback, setTriedFallback] = useState(false);

  return (
    <video
      className={className}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-label={clip.label}
      onError={() => {
        if (!triedFallback && clip.fallbackSrc && src !== clip.fallbackSrc) {
          setTriedFallback(true);
          setSrc(clip.fallbackSrc);
        }
      }}
    />
  );
}

export const HEADER_LOOP_CLIP_ID = '02';
