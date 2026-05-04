import { useEffect, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, StickyNote } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PreviewMode } from './PreviewModeToggle';
import type { PreviewRole } from './PreviewRoleToggle';

interface Props<TSlide> {
  mode: PreviewMode;
  slides: TSlide[];
  startIndex: number;
  renderSlide: (slide: TSlide, index: number) => ReactNode;
  hub: 'playground' | 'academy' | 'success';
  /** Optional: when 'student', hides nav chrome and teacher notes overlay. Default 'teacher'. */
  previewRole?: PreviewRole;
  /** Optional accessor — picks the teacher_notes string off the active slide for the floating panel. */
  getTeacherNotes?: (slide: TSlide) => string | undefined;
}

export function PlayablePreviewPane<TSlide>({
  mode,
  slides,
  startIndex,
  renderSlide,
  hub,
  previewRole = 'teacher',
  getTeacherNotes,
}: Props<TSlide>) {
  const [playIndex, setPlayIndex] = useState(startIndex);

  useEffect(() => {
    if (mode === 'play') setPlayIndex(startIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

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

  const renderTeacherNotes = (slide: TSlide) => {
    if (previewRole !== 'teacher' || !getTeacherNotes) return null;
    const notes = getTeacherNotes(slide);
    if (!notes || !notes.trim()) return null;
    return (
      <div className="mt-2 rounded-lg border border-amber-300 bg-amber-50/95 backdrop-blur-sm px-3 py-2 shadow-sm flex items-start gap-2">
        <StickyNote className="w-3.5 h-3.5 text-amber-700 mt-0.5 shrink-0" />
        <div className="text-[12px] leading-snug text-amber-900">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-0.5">
            Teacher Script
          </div>
          {notes}
        </div>
      </div>
    );
  };

  if (mode === 'editor') {
    const idx = Math.min(startIndex, slides.length - 1);
    return (
      <>
        {renderSlide(slides[idx], idx)}
        {renderTeacherNotes(slides[idx])}
      </>
    );
  }

  // Play Mode
  const current = slides[playIndex];
  const accent =
    hub === 'playground'
      ? { ring: 'border-orange-300', dot: 'bg-orange-500', btn: 'bg-orange-500 hover:bg-orange-600 text-white' }
      : hub === 'academy'
      ? { ring: 'border-indigo-300', dot: 'bg-indigo-600', btn: 'bg-indigo-600 hover:bg-indigo-700 text-white' }
      : { ring: 'border-emerald-300', dot: 'bg-emerald-600', btn: 'bg-emerald-600 hover:bg-emerald-700 text-white' };

  const isStudent = previewRole === 'student';

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

      {renderTeacherNotes(current)}

      {/* Deck controls — hidden in Student view */}
      {!isStudent && (
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
      )}

      {isStudent && (
        <div className="text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Student view · navigation controlled by teacher
        </div>
      )}
    </div>
  );
}
