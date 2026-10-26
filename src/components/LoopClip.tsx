import { useCallback, useEffect, useRef, useState } from 'react';
import type { VideoClip } from '../generated/videoClips';

type Props = {
  clip: VideoClip;
  className?: string;
  /** Header: load sooner. Clips below the fold: defer. */
  priority?: 'high' | 'low';
};

/** Browsers allow autoplay only when muted; iOS often needs an explicit play() or a tap. */
export function LoopClip({ clip, className = '', priority = 'high' }: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [activeSrc, setActiveSrc] = useState<string | undefined>(priority === 'high' ? clip.src : undefined);
  const [triedFallback, setTriedFallback] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);

  useEffect(() => {
    if (priority === 'high' || activeSrc) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActiveSrc(clip.src);
          io.disconnect();
        }
      },
      { rootMargin: '120px 0px', threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [activeSrc, clip.src, priority]);

  const tryPlay = useCallback(async () => {
    const v = ref.current;
    if (!v || !activeSrc) return;
    setNeedsTap(false);
    try {
      await v.play();
    } catch {
      setNeedsTap(true);
    }
  }, [activeSrc]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !activeSrc) return;

    const onReady = () => {
      void tryPlay();
    };

    v.addEventListener('loadeddata', onReady);
    v.addEventListener('canplay', onReady);
    if (v.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) onReady();

    return () => {
      v.removeEventListener('loadeddata', onReady);
      v.removeEventListener('canplay', onReady);
    };
  }, [activeSrc, tryPlay]);

  const preload = priority === 'high' ? 'auto' : 'none';

  return (
    <div className={`loop-clip ${needsTap ? 'loop-clip--needs-tap' : ''}`}>
      <video
        ref={ref}
        className={className}
        muted
        loop
        playsInline
        preload={preload}
        aria-label={clip.label}
        onError={() => {
          if (!triedFallback && clip.fallbackSrc && activeSrc !== clip.fallbackSrc) {
            setTriedFallback(true);
            setActiveSrc(clip.fallbackSrc);
          }
        }}
      >
        {activeSrc ? <source src={activeSrc} type={clip.mime} /> : null}
      </video>
      {needsTap && activeSrc ? (
        <button type="button" className="loop-clip__tap" onClick={() => void tryPlay()}>
          Tap to play
        </button>
      ) : null}
    </div>
  );
}

export const HEADER_LOOP_CLIP_ID = '02';
