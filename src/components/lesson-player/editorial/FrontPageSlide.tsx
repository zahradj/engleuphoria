import React from 'react';
import { getEditorialTheme } from './editorialHubTheme';
import logoMark from '@/assets/logo-white.png';

interface FrontPageSlideProps {
  lessonTitle: string;
  topic?: string;
  level?: string;
  hub?: string;
  coverImageUrl?: string;
  unitNumber?: number | string;
  unitTitle?: string;
  subtitle?: string;
}

/**
 * Editorial Front Page — light, simple, image-first.
 *
 * Layout (matches the reference screenshot):
 *   ┌─────────────────────────────────────────────┐
 *   │  [logo]                       [LEVEL] [HUB] │
 *   │                                             │
 *   │                ╭───────────╮                │
 *   │                │   COVER   │                │
 *   │                ╰───────────╯                │
 *   │                                             │
 *   │            New Words for New Friends!       │
 *   │            Hello everyone! Today …          │
 *   │                                             │
 *   └─────────────────────────────────────────────┘
 */
export default function FrontPageSlide({
  lessonTitle,
  topic,
  level,
  hub,
  coverImageUrl,
  unitNumber,
  unitTitle,
  subtitle,
}: FrontPageSlideProps) {
  const theme = getEditorialTheme(hub);
  const unitLine =
    unitTitle && unitNumber != null
      ? `Unit ${unitNumber} · ${unitTitle}`
      : unitTitle ||
        (unitNumber != null ? `Unit ${unitNumber}` : '');

  return (
    <div
      className="relative w-full h-full min-h-[520px] overflow-hidden rounded-2xl bg-white"
      style={{
        background: `radial-gradient(ellipse at top, ${theme.primary}14 0%, transparent 55%), linear-gradient(180deg, #ffffff 0%, ${theme.primary}0A 100%)`,
      }}
    >
      {/* ── Top bar: logo (left) · level + hub badge (right) ───────── */}
      <div className="absolute top-4 left-5 right-5 z-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-white font-black text-sm"
            style={{ backgroundColor: theme.primary }}
            aria-hidden
          >
            E
          </span>
          <span className="text-sm font-extrabold tracking-tight text-slate-800">
            EnglEuphoria
          </span>
        </div>
        <div className="flex items-center gap-2">
          {level && (
            <span
              className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest text-white"
              style={{ backgroundColor: theme.primary }}
            >
              {level}
            </span>
          )}
          <span
            className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest border bg-white/70 backdrop-blur-sm"
            style={{ color: theme.primary, borderColor: `${theme.primary}40` }}
          >
            {theme.label}
          </span>
        </div>
      </div>

      {/* ── Vertical stack: cover image · title · subtitle ─────────── */}
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-6 pt-16 pb-8 text-center">
        {/* Cover illustration */}
        <div
          className="relative mb-6 w-full max-w-[640px] aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100"
          style={{ boxShadow: `0 12px 40px -12px ${theme.primary}55` }}
        >
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt={lessonTitle}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center text-5xl"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}22, ${theme.primaryLight ?? theme.primary}33)`,
                color: theme.primary,
              }}
              aria-hidden
            >
              📖
            </div>
          )}
        </div>

        {unitLine && (
          <p className="mb-2 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.35em] text-slate-500">
            {unitLine}
          </p>
        )}

        <h1
          className="font-serif text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.05] max-w-3xl"
        >
          {lessonTitle}
        </h1>

        {(subtitle || (topic && topic !== lessonTitle)) && (
          <p className="mt-4 text-sm md:text-lg text-slate-600 font-light max-w-2xl leading-relaxed">
            {subtitle || topic}
          </p>
        )}

        {/* Hub accent bar */}
        <div
          className="mt-6 h-1 w-16 rounded-full"
          style={{ backgroundColor: theme.primary }}
        />
      </div>
    </div>
  );
}
