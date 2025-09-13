'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

/**
 * WHY: Keep speed user-adjustable and persistent without forking TTS internals.
 * We listen for new <audio> nodes and set .playbackRate on play & on mutations.
 */

type Ctx = { rate: number; setRate: (n: number) => void };
const PlaybackSpeedCtx = createContext<Ctx | null>(null);

const STORAGE_KEY = 'tts.playbackRate';
const clamp = (v: number, min = 0.5, max = 2.0) => Math.min(max, Math.max(min, v));

function applyRateToAudios(rate: number, root: Document | HTMLElement = document) {
  const audios = root.querySelectorAll('audio');
  audios.forEach((a) => {
    try {
      // Some browsers may ignore on certain codecs; harmless if so
      // Only set if different to avoid restarting decoders on some engines
      if (a.playbackRate !== rate) a.playbackRate = rate;
    } catch {}
  });
}

export const PlaybackSpeedProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [rate, _setRate] = useState<number>(() => {
    const saved = Number(globalThis?.localStorage?.getItem(STORAGE_KEY) ?? '1');
    return Number.isFinite(saved) ? clamp(saved) : 1;
  });

  const obsRef = useRef<MutationObserver | null>(null);

  const setRate = useCallback((n: number) => {
    const v = clamp(Number(n));
    _setRate(v);
    try { localStorage.setItem(STORAGE_KEY, String(v)); } catch {}
    applyRateToAudios(v);
    // Broadcast to other tabs
    try { new BroadcastChannel('tts-rate').postMessage({ rate: v }); } catch {}
  }, []);

  useEffect(() => {
    // Initial sweep
    applyRateToAudios(rate);

    const onPlay = (e: Event) => {
      const t = e.target as HTMLAudioElement | null;
      if (!t) return;
      try { if (t.playbackRate !== rate) t.playbackRate = rate; } catch {}
    };
    document.addEventListener('play', onPlay, true);

    // Observe for new audio nodes
    obsRef.current = new MutationObserver((m) => {
      for (const rec of m) {
        rec.addedNodes.forEach((n) => {
          if (!(n instanceof HTMLElement)) return;
          if (n.tagName?.toLowerCase() === 'audio') applyRateToAudios(rate, n);
          // also scan subtree
          applyRateToAudios(rate, n);
        });
      }
    });
    obsRef.current.observe(document.documentElement, { childList: true, subtree: true });

    // Cross-tab sync
    let ch: BroadcastChannel | null = null;
    try {
      ch = new BroadcastChannel('tts-rate');
      ch.onmessage = (ev) => {
        const r = Number(ev?.data?.rate);
        if (Number.isFinite(r)) _setRate(clamp(r));
      };
    } catch {}

    return () => {
      document.removeEventListener('play', onPlay, true);
      obsRef.current?.disconnect();
      if (ch) ch.close();
    };
  }, [rate]);

  const value = useMemo<Ctx>(() => ({ rate, setRate }), [rate, setRate]);
  return <PlaybackSpeedCtx.Provider value={value}>{children}</PlaybackSpeedCtx.Provider>;
};

export const usePlaybackSpeed = () => {
  const v = useContext(PlaybackSpeedCtx);
  if (!v) throw new Error('usePlaybackSpeed must be used within PlaybackSpeedProvider');
  return v;
};