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

// #region agent log
function dbg(hypothesisId: string, message: string, data: Record<string, unknown>) {
  fetch('http://127.0.0.1:7629/ingest/8c53e919-2522-440d-b2cc-77379c5cee36', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '4924d4' },
    body: JSON.stringify({
      sessionId: '4924d4',
      runId: 'post-fix-2',
      hypothesisId,
      location: 'LoopClip.tsx',
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
}

function videoDiag(v: HTMLVideoElement) {
  const err = v.error;
  return {
    readyState: v.readyState,
    networkState: v.networkState,
    paused: v.paused,
    currentTime: v.currentTime,
    currentSrc: v.currentSrc,
    mediaErrorCode: err?.code ?? null,
    mediaErrorMessage: err?.message ?? null,
  };
}
// #endregion

/** Browsers allow autoplay only when muted; iOS often needs an explicit play() or a tap. */
export function LoopClip({ clip, className = '', priority = 'high' }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ref = useRef<HTMLVideoElement | null>(null);
  const playingRef = useRef(false);
  const readyHandledRef = useRef(false);
  const [activeSrc, setActiveSrc] = useState<string | undefined>(priority === 'high' ? clip.src : undefined);
  const [triedFallback, setTriedFallback] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [phase, setPhase] = useState<Phase>(priority === 'high' ? 'loading' : 'placeholder');
  const [inView, setInView] = useState(priority === 'high');

  const beginLoad = useCallback((src: string) => {
    // #region agent log
    dbg('E', 'beginLoad', { clipId: clip.id, src, priority });
    // #endregion
    readyHandledRef.current = false;
    setActiveSrc(src);
    setPhase('loading');
  }, [clip.id, priority]);

  useEffect(() => {
    playingRef.current = phase === 'playing';
    // #region agent log
    dbg('F', 'phaseChange', { clipId: clip.id, phase, inView, activeSrc, poster: clip.poster ?? null });
    // #endregion
  }, [activeSrc, clip.id, clip.poster, inView, phase]);

  useEffect(() => {
    const host = containerRef.current;
    if (!host) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        setInView(visible);
        if (visible && priority === 'low' && !activeSrc) {
          // #region agent log
          dbg('E', 'intersectionLoad', { clipId: clip.id, ratio: entry?.intersectionRatio });
          // #endregion
          beginLoad(clip.src);
        }
      },
      { rootMargin: '80px 0px', threshold: 0.35 },
    );
    io.observe(host);
    return () => io.disconnect();
  }, [activeSrc, beginLoad, clip.id, clip.src, priority]);

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
      document.querySelectorAll('video.loop-clip__video').forEach((el) => {
        if (el !== v) (el as HTMLVideoElement).pause();
      });
      setPhase('playing');
      // #region agent log
      dbg('C', 'playOk', { clipId: clip.id, ...videoDiag(v) });
      // #endregion
    } catch (err) {
      const errName = err instanceof Error ? err.name : 'unknown';
      // #region agent log
      dbg('C', 'playRejected', { clipId: clip.id, err: errName, ...videoDiag(v) });
      // #endregion
      if (errName === 'AbortError') return;
      if (!v.paused) {
        setPhase('playing');
        return;
      }
      setPhase('tap');
    }
  }, [activeSrc, clip.id, inView]);

  const retry = useCallback(() => {
    // #region agent log
    dbg('D', 'retry', { clipId: clip.id });
    // #endregion
    setTriedFallback(false);
    setRetryKey((k) => k + 1);
    beginLoad(clip.src);
  }, [beginLoad, clip.id, clip.src]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !activeSrc) return;

    if (!inView) {
      v.pause();
      return;
    }

    const onPlaying = () => setPhase('playing');
    const onWaiting = () => {
      if (!playingRef.current) setPhase('loading');
    };
    const onReady = () => {
      if (readyHandledRef.current) return;
      readyHandledRef.current = true;
      // #region agent log
      dbg('B', 'mediaReadyOnce', { clipId: clip.id, ...videoDiag(v) });
      // #endregion
      void tryPlay();
    };
    const onError = () => {
      const diag = videoDiag(v);
      // #region agent log
      dbg('A', 'mediaError', { clipId: clip.id, triedFallback, activeSrc, ...diag });
      // #endregion
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
      if (!playingRef.current) {
        // #region agent log
        dbg('D', 'loadTimeout', { clipId: clip.id, ...videoDiag(v) });
        // #endregion
        setPhase('error');
      }
    }, LOAD_TIMEOUT_MS);

    return () => {
      v.removeEventListener('playing', onPlaying);
      v.removeEventListener('waiting', onWaiting);
      v.removeEventListener('loadeddata', onReady);
      v.removeEventListener('error', onError);
      window.clearTimeout(timeout);
    };
  }, [activeSrc, beginLoad, clip.fallbackSrc, clip.id, inView, retryKey, triedFallback, tryPlay]);

  useEffect(() => {
    if (!inView || !activeSrc) return;
    const v = ref.current;
    if (!v || !v.paused || phase === 'error') return;
    if (phase === 'tap') return;
    void tryPlay();
  }, [activeSrc, inView, phase, tryPlay]);

  const preload = priority === 'high' ? 'auto' : 'metadata';
  const showOverlay = phase === 'loading' || phase === 'tap' || phase === 'error';
  const poster = clip.poster;

  return (
    <div
      ref={containerRef}
      className={`loop-clip loop-clip--${phase}${inView ? ' loop-clip--in-view' : ''}`}
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
