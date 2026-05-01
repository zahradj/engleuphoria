import React from 'react';
import { getEditorialTheme } from './editorialHubTheme';
import logoWhite from '@/assets/logo-white.png';

interface FrontPageSlideProps {
  lessonTitle: string;
  topic?: string;
  level?: string;
  hub?: string;
  coverImageUrl?: string;
  unitNumber?: number | string;
  unitTitle?: string;
}

/**
 * Cinematic, full-bleed front page for every lesson.
 * - Full-page background image (or themed gradient fallback)
 * - Dark gradient overlay for text legibility
 * - Engleuphoria logo top-left
 * - CEFR + Hub badge top-right
 * - Centered hero title + unit subtitle
 */
export default function FrontPageSlide({
  lessonTitle,
  topic,
  level,
  hub,
  coverImageUrl,
  unitNumber,
  unitTitle,
}: FrontPageSlideProps) {
  const theme = getEditorialTheme(hub);
  const unitLine =
    unitTitle && unitNumber != null
      ? `Unit ${unitNumber}: ${unitTitle}`
      : unitTitle ||
        (unitNumber != null ? `Unit ${unitNumber}` : topic && topic !== lessonTitle ? topic : '');

  return (
    <div className="relative w-full h-full min-h-[520px] overflow-hidden rounded-2xl">
      {/* ── Full-bleed background ─────────────────────────────────── */}
      {coverImageUrl ? (
        <img
          src={coverImageUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryLight} 60%, ${theme.primary} 100%)`,
          }}
        />
      )}

      {/* ── Cinematic dark gradient overlay for legibility ──────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/75" />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, ${theme.primary}33 100%)`,
        }}
      />

      {/* ── Top-left: Engleuphoria logo ─────────────────────────── */}
      <div className="absolute top-5 left-6 z-20 flex items-center gap-2">
        <img
          src={logoWhite}
          alt="Engleuphoria"
          className="h-9 md:h-11 w-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
        />
      </div>

      {/* ── Top-right: CEFR Level + Hub badge ───────────────────── */}
      <div className="absolute top-5 right-6 z-20 flex items-center gap-2">
        {level && (
          <span
            className="px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-widest text-white shadow-lg"
            style={{ backgroundColor: theme.primary }}
          >
            {level}
          </span>
        )}
        <span className="px-3 py-1.5 rounded-lg bg-white/15 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest border border-white/30 shadow-lg">
          {theme.label}
        </span>
      </div>

      {/* ── Centered hero content ───────────────────────────────── */}
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-8 text-center">
        {unitLine && (
          <p
            className="mb-4 text-[11px] md:text-xs font-bold uppercase tracking-[0.35em] text-white/80"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}
          >
            {unitLine}
          </p>
        )}

        <h1
          className="font-serif text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] max-w-4xl"
          style={{ textShadow: '0 4px 24px rgba(0,0,0,0.55)' }}
        >
          {lessonTitle}
        </h1>

        {topic && topic !== lessonTitle && unitLine && unitLine !== topic && (
          <p
            className="mt-5 text-base md:text-lg text-white/85 font-light max-w-2xl"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
          >
            {topic}
          </p>
        )}

        {/* Hub accent bar */}
        <div
          className="mt-7 h-1 w-20 rounded-full"
          style={{ backgroundColor: theme.primary, boxShadow: `0 0 20px ${theme.primary}` }}
        />
      </div>
    </div>
  );
}
