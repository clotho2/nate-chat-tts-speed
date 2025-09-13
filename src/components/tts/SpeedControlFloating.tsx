'use client';

import React, { useId, useState } from 'react';

import { usePlaybackSpeed } from './PlaybackSpeedProvider';

/**
 * A non-intrusive floating speed slider (0.5x–2.0x). Visible across the app.
 * Minimal Tailwind; matches Lobe Chat aesthetics.
 */
export default function SpeedControlFloating() {
  const { rate, setRate } = usePlaybackSpeed();
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="fixed bottom-4 right-4 z-[60] select-none">
      <div
        className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur rounded-xl shadow-lg border border-black/5 dark:border-white/5 p-3 w-56"
        hidden={!open}
      >
        <div className="text-xs font-medium text-neutral-600 dark:text-neutral-300 mb-2">
          Playback speed
        </div>
        <div className="flex items-center gap-2">
          <input
            className="w-full"
            id={id}
            max={2}
            min={0.5}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            step={0.05}
            type="range"
            value={rate}
          />
          <div className="w-12 text-right tabular-nums text-sm font-medium text-neutral-700 dark:text-neutral-200">
            {rate.toFixed(2)}×
          </div>
        </div>
        <div className="mt-2 text-[10px] text-neutral-500 dark:text-neutral-400">
          Applies to new & current audio.
        </div>
      </div>

      <button
        aria-label="Playback speed"
        className="h-10 w-10 rounded-full shadow-md border border-black/5 dark:border-white/10 bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-800 grid place-items-center"
        onClick={() => setOpen((v) => !v)}
        title="Playback speed"
        type="button"
      >
        {/* simple speedometer icon */}
        <svg
          className="h-5 w-5 text-neutral-700 dark:text-neutral-200"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7V3zm0 6a1 1 0 0 0-.894.553l-3 6A1 1 0 0 0 9 17h6a1 1 0 0 0 .894-1.447l-3-6A1 1 0 0 0 12 9z" />
        </svg>
      </button>
    </div>
  );
}
