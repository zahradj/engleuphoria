import React from 'react';
import { Logo } from '@/components/Logo';
import { GraduationCap, Briefcase, Gamepad2 } from 'lucide-react';
import type { HubType } from '@/components/admin/lesson-builder/ai-wizard/types';
import { SlideHubContext, buildHubValue } from './SlideHubContext';

const HUB_LABEL: Record<HubType, string> = {
  playground: 'Playground Hub',
  academy: 'Academy Hub',
  professional: 'Professional Hub',
};

const HUB_ICON: Record<HubType, React.ComponentType<{ className?: string }>> = {
  playground: Gamepad2,
  academy: GraduationCap,
  professional: Briefcase,
};

/**
 * Hub theme tokens — drive both the inline gradient and the CSS variables
 * (`--hub-accent`, `--hub-secondary`, `--hub-bg`) so any descendant can
 * style itself with `bg-[var(--hub-accent)]` and stay in sync when the
 * active hub changes.
 */
const HUB_TOKENS: Record<HubType, { accent: string; secondary: string; bg: string; gradient: string }> = {
  playground: {
    accent: '#f97316',
    secondary: '#fbbf24',
    bg: '#431407',
    gradient:
      'radial-gradient(at 20% 0%, #FFB066 0%, transparent 55%), radial-gradient(at 80% 100%, #FFD166 0%, transparent 55%), linear-gradient(135deg, #FE6A2F 0%, #F59E0B 100%)',
  },
  academy: {
    accent: '#a855f7',
    secondary: '#ec4899',
    bg: '#1e1b4b',
    gradient:
      'radial-gradient(at 15% 0%, #A855F7 0%, transparent 55%), radial-gradient(at 85% 100%, #6366F1 0%, transparent 55%), linear-gradient(135deg, #4C1D95 0%, #1E1B4B 100%)',
  },
  professional: {
    accent: '#3b82f6',
    secondary: '#eab308',
    bg: '#0f172a',
    gradient:
      'radial-gradient(at 20% 0%, #3B82F6 0%, transparent 55%), radial-gradient(at 80% 100%, #1D4ED8 0%, transparent 55%), linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
  },
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
  const tokens = HUB_TOKENS[hub];
  const HubIcon = HUB_ICON[hub];
  const meta = [HUB_LABEL[hub], level, unit != null ? `Unit ${unit}` : null, lesson != null ? `Lesson ${lesson}` : null]
    .filter(Boolean)
    .join(' · ');
  const progress =
    typeof slideIndex === 'number' && typeof totalSlides === 'number' && totalSlides > 0
      ? Math.min(100, Math.max(0, ((slideIndex + 1) / totalSlides) * 100))
      : null;

  // Publish hub theme as CSS variables so descendants can use `bg-[var(--hub-accent)]`.
  const cssVars = {
    background: tokens.gradient,
    ['--hub-accent' as any]: tokens.accent,
    ['--hub-secondary' as any]: tokens.secondary,
    ['--hub-bg' as any]: tokens.bg,
  } as React.CSSProperties;

  return (
    <SlideHubContext.Provider value={buildHubValue(hub)}>
      <div
        className={`slide-container ${hub} relative w-full h-full min-h-[520px] rounded-2xl overflow-hidden flex flex-col`}
        style={cssVars}
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
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="inline-flex items-center justify-center w-7 h-7 rounded-md shrink-0"
                style={{ background: 'var(--hub-accent)' }}
                aria-hidden
              >
                <HubIcon className="w-4 h-4 text-white" />
              </span>
              <span className="text-white/90 text-xs md:text-sm font-semibold tracking-wide uppercase truncate">
                {meta}
              </span>
            </div>
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
            <div
              className="w-full max-w-5xl bg-white/97 dark:bg-slate-900/95 rounded-2xl shadow-2xl p-5 md:p-8 text-slate-900 dark:text-slate-100 border-2"
              style={{ borderColor: `${tokens.accent}4D` }}
            >
              {children}
            </div>
          )}
        </div>

        {/* Progress bar */}
        {progress !== null && (
          <div className="relative z-10 h-1.5 w-full bg-white/15">
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${progress}%`, background: 'var(--hub-accent)', boxShadow: `0 0 12px ${tokens.accent}` }}
            />
          </div>
        )}
      </div>
    </SlideHubContext.Provider>
  );
}
