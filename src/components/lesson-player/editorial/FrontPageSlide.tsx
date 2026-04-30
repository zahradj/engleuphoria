import React from 'react';
import { getEditorialTheme } from './editorialHubTheme';
import { GraduationCap } from 'lucide-react';

interface FrontPageSlideProps {
  lessonTitle: string;
  topic?: string;
  level?: string;
  hub?: string;
  coverImageUrl?: string;
}

export default function FrontPageSlide({ lessonTitle, topic, level, hub, coverImageUrl }: FrontPageSlideProps) {
  const theme = getEditorialTheme(hub);

  return (
    <div className="relative w-full h-full min-h-[520px] flex flex-col items-center justify-center overflow-hidden rounded-2xl">
      {/* Background image or gradient */}
      {coverImageUrl ? (
        <img
          src={coverImageUrl}
          alt="Lesson cover"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${theme.primary}22 0%, ${theme.primaryLight} 50%, ${theme.primary}11 100%)`,
          }}
        />
      )}

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-8 text-center max-w-3xl">
        {/* Logo area */}
        <div className="flex items-center gap-2 text-white/80">
          <GraduationCap className="w-6 h-6" />
          <span className="text-sm font-semibold tracking-widest uppercase">Engleuphoria</span>
        </div>

        {/* Level badge */}
        {level && (
          <span
            className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{ backgroundColor: theme.primary, color: 'white' }}
          >
            {level}
          </span>
        )}

        {/* Title */}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
          {lessonTitle}
        </h1>

        {/* Topic subtitle */}
        {topic && topic !== lessonTitle && (
          <p className="text-lg md:text-xl text-white/80 font-light">{topic}</p>
        )}

        {/* Hub badge */}
        <span className="mt-4 px-5 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium border border-white/30">
          {theme.label}
        </span>
      </div>
    </div>
  );
}
