import React from 'react';
import { Logo } from '@/components/Logo';
import { HUB_CONFIGS } from '@/components/admin/lesson-builder/ai-wizard/hubConfig';
import type { HubType } from '@/components/admin/lesson-builder/ai-wizard/types';
import { SlideHubContext, buildHubValue } from './SlideHubContext';

const HUB_LABEL: Record<HubType, string> = {
  playground: 'Playground',
  academy: 'Academy',
  professional: 'Success Hub',
};

const HUB_GRADIENT: Record<HubType, string> = {
  playground:
    'radial-gradient(at 20% 0%, #FFB066 0%, transparent 55%), radial-gradient(at 80% 100%, #FFD166 0%, transparent 55%), linear-gradient(135deg, #FE6A2F 0%, #F59E0B 100%)',
  academy:
    'radial-gradient(at 15% 0%, #A855F7 0%, transparent 55%), radial-gradient(at 85% 100%, #6366F1 0%, transparent 55%), linear-gradient(135deg, #4C1D95 0%, #1E1B4B 100%)',
  professional:
    'radial-gradient(at 20% 0%, #34D399 0%, transparent 55%), radial-gradient(at 80% 100%, #14B8A6 0%, transparent 55%), linear-gradient(135deg, #059669 0%, #064E3B 100%)',
};

export interface SlideShellProps {
  hub: HubType;
  children: React.ReactNode;
  level?: string;
  unit?: number | string;
  lesson?: number | string;
  slideIndex?: number;
  totalSlides?: number;
  /** When true, render children without the inner white card (full-bleed). */
  fullBleed?: boolean;
}

export default function SlideShell({
  hub,
  children,
  level,
  unit,
  lesson,
  slideIndex,
  totalSlides,
  fullBleed = false,
}: SlideShellProps) {
  const config = HUB_CONFIGS[hub];
  const meta = [HUB_LABEL[hub], level, unit != null ? `Unit ${unit}` : null, lesson != null ? `Lesson ${lesson}` : null]
    .filter(Boolean)
    .join(' · ');
  const progress =
    typeof slideIndex === 'number' && typeof totalSlides === 'number' && totalSlides > 0
      ? Math.min(100, Math.max(0, ((slideIndex + 1) / totalSlides) * 100))
      : null;

  return (
    <SlideHubContext.Provider value={buildHubValue(hub)}>
      <div
        className="relative w-full h-full min-h-[520px] rounded-2xl overflow-hidden flex flex-col"
        style={{ background: HUB_GRADIENT[hub] }}
      >
        {/* Ambient glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-20" style={{ background: '#fff' }} />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-10" style={{ background: '#fff' }} />

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-5 py-3 backdrop-blur-md bg-black/15 border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-white/95 rounded-lg px-2 py-1 shadow-sm flex items-center">
              <Logo size="small" />
            </div>
            <span className="text-white/90 text-xs md:text-sm font-semibold tracking-wide uppercase truncate">
              {meta}
            </span>
          </div>
          {progress !== null && (
            <span className="text-white/80 text-xs font-bold tabular-nums shrink-0">
              {(slideIndex ?? 0) + 1} / {totalSlides}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
          {fullBleed ? (
            <div className="w-full h-full">{children}</div>
          ) : (
            <div className="w-full max-w-5xl bg-white/97 dark:bg-slate-900/95 rounded-2xl shadow-2xl p-5 md:p-8 text-slate-900 dark:text-slate-100">
              {children}
            </div>
          )}
        </div>

        {/* Progress bar */}
        {progress !== null && (
          <div className="relative z-10 h-1.5 w-full bg-white/15">
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${progress}%`, background: config.colorPalette.primary, boxShadow: `0 0 12px ${config.colorPalette.primary}` }}
            />
          </div>
        )}
      </div>
    </SlideHubContext.Provider>
  );
}
