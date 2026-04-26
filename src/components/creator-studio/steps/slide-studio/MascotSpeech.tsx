import React from 'react';
import { cn } from '@/lib/utils';

const PHASE_MASCOTS: Record<string, string> = {
  'warm-up': '🦊',
  presentation: '🦉',
  practice: '🐻',
  production: '🤖',
  review: '🐼',
};

interface Props {
  phase?: string;
  text?: string;
  placeholder?: string;
  size?: 'md' | 'lg';
  className?: string;
}

/**
 * Joyful mascot + speech bubble pairing used inside the Slide Studio canvas.
 * The mascot stands on the left and "talks" to the student via a rounded
 * white speech bubble with a tail pointing back toward it.
 */
export const MascotSpeech: React.FC<Props> = ({
  phase,
  text,
  placeholder = "Type a friendly sentence the mascot will say…",
  size = 'lg',
  className,
}) => {
  const mascot = PHASE_MASCOTS[(phase ?? '').toLowerCase()] ?? '🦊';
  const mascotSize = size === 'lg' ? 'text-7xl sm:text-8xl' : 'text-5xl sm:text-6xl';
  const bubblePad = size === 'lg' ? 'px-6 py-5 sm:px-8 sm:py-6' : 'px-4 py-3 sm:px-5 sm:py-4';
  const bubbleText = size === 'lg' ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg';

  return (
    <div
      className={cn(
        'flex items-end gap-3 sm:gap-4',
        "font-['Fredoka',_'Quicksand',_'Nunito',_sans-serif]",
        className,
      )}
    >
      {/* Mascot */}
      <div
        className={cn(
          'shrink-0 select-none drop-shadow-xl transition-transform hover:scale-110 hover:-rotate-3',
          mascotSize,
        )}
        aria-hidden
      >
        <span className="inline-block animate-[bounce_2.4s_ease-in-out_infinite]">{mascot}</span>
      </div>

      {/* Speech bubble */}
      <div
        className={cn(
          'relative max-w-2xl rounded-3xl bg-white text-slate-800 shadow-xl border-2 border-white/80',
          bubblePad,
        )}
      >
        {/* Tail pointing toward the mascot (bottom-left) */}
        <span
          aria-hidden
          className="absolute -left-2 bottom-4 h-5 w-5 rotate-45 bg-white border-l-2 border-b-2 border-white/80 rounded-sm shadow-[-2px_2px_4px_rgba(0,0,0,0.06)]"
        />
        <p
          className={cn(
            'relative leading-snug font-semibold whitespace-pre-wrap break-words',
            bubbleText,
            !text && 'italic text-slate-400 font-normal',
          )}
        >
          {text || placeholder}
        </p>
      </div>
    </div>
  );
};
