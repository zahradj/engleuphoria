import { useEffect, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PreviewMode } from './PreviewModeToggle';

interface Props<TSlide> {
  mode: PreviewMode;
  slides: TSlide[];
  /** Index of the slide currently selected in the editor (used as start
   *  position when entering Play Mode and as the only slide shown in
   *  Editor View). */
  startIndex: number;
  /** Render a single slide. Receives the slide and its index so the host
   *  can pass any required props (theme, etc.) to the underlying
   *  SlideRenderer. */
  renderSlide: (slide: TSlide, index: number) => ReactNode;
  hub: 'playground' | 'academy' | 'success';
}

/**
 * Right-column preview pane for both creators.
 * - Editor View: shows the active slide statically (existing behaviour).
 * - Play Mode: wraps the same renderer with deck navigation + restart so
 *   the creator can experience the lesson exactly like a student.
 *
 * Note: actual answer-checking and audio are handled inside each hub's
 * SlideRenderer — this component only provides the deck shell.
 */
export function PlayablePreviewPane<TSlide>({
  mode,
  slides,
  startIndex,
  renderSlide,
  hub,
}: Props<TSlide>) {
  const [playIndex, setPlayIndex] = useState(startIndex);

  // When entering Play Mode, jump to the slide the user was editing.
  useEffect(() => {
    if (mode === 'play') setPlayIndex(startIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Clamp if slides shrink.
  useEffect(() => {
    if (playIndex >= slides.length) setPlayIndex(Math.max(0, slides.length - 1));
  }, [slides.length, playIndex]);

  if (slides.length === 0) {
    return (
      <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 min-h-[420px] flex items-center justify-center text-sm text-slate-400">
        No slides yet
      </div>
    );
  }

  if (mode === 'editor') {
    const idx = Math.min(startIndex, slides.length - 1);
    return <>{renderSlide(slides[idx], idx)}</>;
  }

  // Play Mode
  const current = slides[playIndex];
  const accent =
    hub === 'playground'
      ? { ring: 'border-orange-300', dot: 'bg-orange-500', btn: 'bg-orange-500 hover:bg-orange-600 text-white' }
      : { ring: 'border-indigo-300', dot: 'bg-indigo-600', btn: 'bg-indigo-600 hover:bg-indigo-700 text-white' };

  return (
    <div className="space-y-3">
      <div
        key={playIndex}
        className={cn(
          'rounded-xl bg-white border-2 p-4 min-h-[420px] flex items-center justify-center',
          accent.ring,
        )}
      >
        <div className="w-full">{renderSlide(current, playIndex)}</div>
      </div>

      {/* Deck controls */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setPlayIndex((i) => Math.max(0, i - 1))}
          disabled={playIndex === 0}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Prev
        </button>

        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
          <span className={cn('inline-block w-1.5 h-1.5 rounded-full', accent.dot)} />
          Slide {playIndex + 1} / {slides.length}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPlayIndex(0)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            title="Restart deck"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setPlayIndex((i) => Math.min(slides.length - 1, i + 1))}
            disabled={playIndex >= slides.length - 1}
            className={cn(
              'inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed',
              accent.btn,
            )}
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
