import { useCallback, useEffect, useRef, useState } from 'react';
import type { VideoClip } from '../generated/videoClips';

type Props = {
  clip: VideoClip;
  className?: string;
  /** Header: load sooner. Clips below the fold: defer. */
  priority?: 'high' | 'low';
};

type Phase = 'placeholder' | 'loading' | 'playing' | 'tap' | 'error';

const LOAD_TIMEOUT_MS = 22_000;

/** Browsers allow autoplay only when muted; iOS often needs an explicit play() or a tap. */
export function LoopClip({ clip, className = '', priority = 'high' }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ref = useRef<HTMLVideoElement | null>(null);
  const playingRef = useRef(false);
  const readyHandledRef = useRef(false);
  const autoPlay = priority === 'high';
  const [activeSrc, setActiveSrc] = useState<string | undefined>(priority === 'high' ? clip.src : undefined);
  const [triedFallback, setTriedFallback] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [phase, setPhase] = useState<Phase>(priority === 'high' ? 'loading' : 'placeholder');
  const [inView, setInView] = useState(priority === 'high');

  const beginLoad = useCallback((src: string) => {
    readyHandledRef.current = false;
    setActiveSrc(src);
    setPhase('loading');
  }, []);

  useEffect(() => {
    playingRef.current = phase === 'playing';
  }, [phase]);

  useEffect(() => {
    const host = containerRef.current;
    if (!host) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        setInView(visible);
        if (visible && priority === 'low' && !activeSrc) {
          beginLoad(clip.src);
        }
        if (!visible) ref.current?.pause();
      },
      { rootMargin: '80px 0px', threshold: 0.35 },
    );
    io.observe(host);
    return () => io.disconnect();
  }, [activeSrc, beginLoad, clip.src, priority]);

  const tryPlay = useCallback(async () => {
    const v = ref.current;
    if (!v || !activeSrc || !inView) return;
    if (!v.paused && !v.ended) {
      setPhase('playing');
      return;
    }
    setPhase('loading');
    try {
      await v.play();
      if (v.paused) {
        setPhase('tap');
        return;
      }
      setPhase('playing');
    } catch (err) {
      const errName = err instanceof Error ? err.name : 'unknown';
      if (errName === 'AbortError') return;
      if (!v.paused) {
        setPhase('playing');
        return;
      }
      setPhase('tap');
    }
  }, [activeSrc, inView]);

  const retry = useCallback(() => {
    setTriedFallback(false);
    setRetryKey((k) => k + 1);
    beginLoad(clip.src);
  }, [beginLoad, clip.src]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !activeSrc) return;

    const onPlaying = () => {
      if (!v.paused) setPhase('playing');
    };
    const onWaiting = () => {
      if (!playingRef.current) setPhase('loading');
    };
    const onReady = () => {
      if (readyHandledRef.current) return;
      readyHandledRef.current = true;
      if (autoPlay && inView) void tryPlay();
      else setPhase('tap');
    };
    const onError = () => {
      if (!triedFallback && clip.fallbackSrc && activeSrc !== clip.fallbackSrc) {
        setTriedFallback(true);
        beginLoad(clip.fallbackSrc);
        return;
      }
      setPhase('error');
    };

    v.addEventListener('playing', onPlaying);
    v.addEventListener('waiting', onWaiting);
    v.addEventListener('loadeddata', onReady);
    v.addEventListener('error', onError);

    if (v.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) onReady();

    const timeout = window.setTimeout(() => {
      if (!playingRef.current && phase !== 'tap') {
        setPhase(autoPlay ? 'error' : 'tap');
      }
    }, LOAD_TIMEOUT_MS);

    return () => {
      v.removeEventListener('playing', onPlaying);
      v.removeEventListener('waiting', onWaiting);
      v.removeEventListener('loadeddata', onReady);
      v.removeEventListener('error', onError);
      window.clearTimeout(timeout);
    };
  }, [activeSrc, autoPlay, beginLoad, clip.fallbackSrc, inView, phase, retryKey, triedFallback, tryPlay]);

  useEffect(() => {
    if (!autoPlay || !inView || !activeSrc) return;
    const v = ref.current;
    if (!v || !v.paused || phase === 'error' || phase === 'tap') return;
    void tryPlay();
  }, [activeSrc, autoPlay, inView, phase, tryPlay]);

  const preload = priority === 'high' ? 'auto' : 'metadata';
  const showOverlay = phase === 'loading' || phase === 'tap' || phase === 'error';
  const poster = clip.poster;
  const showPoster = poster && (phase !== 'playing' || !inView);

  return (
    <div
      ref={containerRef}
      className={`loop-clip loop-clip--${phase}${inView ? ' loop-clip--in-view' : ''}${showPoster ? ' loop-clip--show-poster' : ''}`}
      data-phase={phase}
    >
      {poster ? (
        <img
          className="loop-clip__frame"
          src={poster}
          alt=""
          loading={priority === 'high' ? 'eager' : 'lazy'}
          decoding="async"
        />
      ) : (
        <div className="loop-clip__placeholder" aria-hidden={phase === 'playing'}>
          <span className="loop-clip__placeholder-icon">♡</span>
          <span className="loop-clip__placeholder-label">{clip.label}</span>
        </div>
      )}

      <video
        key={`${activeSrc ?? 'idle'}-${retryKey}`}
        ref={ref}
        className={`loop-clip__video ${className}`.trim()}
        src={activeSrc}
        poster={poster}
        muted
        loop
        playsInline
        preload={preload}
        aria-label={clip.label}
      />

      {showOverlay && phase === 'loading' ? (
        <div className="loop-clip__overlay loop-clip__overlay--loading" aria-live="polite">
          <span className="loop-clip__spinner" aria-hidden />
          <span className="loop-clip__overlay-text">Loading clip…</span>
        </div>
      ) : null}

      {showOverlay && phase === 'tap' ? (
        <button type="button" className="loop-clip__overlay loop-clip__overlay--tap" onClick={() => void tryPlay()}>
          <span className="loop-clip__play-icon" aria-hidden>▶</span>
          <span className="loop-clip__overlay-text">Tap to play</span>
        </button>
      ) : null}

      {showOverlay && phase === 'error' ? (
        <button type="button" className="loop-clip__overlay loop-clip__overlay--error" onClick={retry}>
          <span className="loop-clip__overlay-text">Couldn&apos;t load — tap to retry</span>
        </button>
      ) : null}
    </div>
  );
}

export const HEADER_LOOP_CLIP_ID = '02';
