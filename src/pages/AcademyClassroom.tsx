import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize, Minimize, Volume2, Mic } from 'lucide-react';
import {
  SlideRenderer,
  ProgressBar,
  themeMap,
  BLOCKS,
  type Slide,
  type Theme,
} from './AcademyDemo';
import { useAcademyAudio } from '@/hooks/useAcademyAudio';
import { SOCIAL_MEDIA_LESSON } from '@/data/academyLessons/socialMediaHabits';

/**
 * Academy Classroom — focused, large slide viewer for teen learners.
 * Reads slides from the preloaded lesson; can be swapped via a custom
 * deck passed in window.__ACADEMY_DECK__ (used by the creator's "Open in classroom").
 */

function getVoiceText(slide: Slide): string | null {
  if (slide.type === 'reading_passage') return slide.passage;
  if (slide.type === 'listening') return slide.transcript;
  if (slide.type === 'vocab') return `${slide.word}. ${slide.definition}.${slide.example ? ' For example. ' + slide.example : ''}`;
  return null;
}

const isSpeakingBlock = (s: Slide) =>
  s.block === 'speaking' || s.type === 'speaking_task' || s.type === 'role_play';

export default function AcademyClassroom() {
  const deck = useMemo<Slide[]>(() => {
    const custom = (window as any).__ACADEMY_DECK__;
    if (Array.isArray(custom) && custom.length > 0) return custom as Slide[];
    return SOCIAL_MEDIA_LESSON.slides;
  }, []);

  const [i, setI] = useState(0);
  const [theme] = useState<Theme>('dark');
  const [isFs, setIsFs] = useState(false);
  const t = themeMap[theme];
  const slide = deck[i];
  const { playVoice, isPlaying, isLoading } = useAcademyAudio();

  const voiceText = getVoiceText(slide);
  const showSpeak = isSpeakingBlock(slide);

  const next = () => setI((n) => Math.min(deck.length - 1, n + 1));
  const prev = () => setI((n) => Math.max(0, n - 1));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      else if (e.key.toLowerCase() === 'f') toggleFs();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => {
    const onFs = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  const toggleFs = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  return (
    <div className={`min-h-screen flex flex-col ${t.bg} ${t.text}`}>
      {/* Top bar */}
      <header className="border-b border-slate-800/60 bg-slate-950/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">E</div>
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-wide">ENGLEUPHORIA · ACADEMY</div>
              <div className="text-xs text-slate-400">{SOCIAL_MEDIA_LESSON.title} · {SOCIAL_MEDIA_LESSON.level}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-slate-400">{i + 1} / {deck.length}</span>
            <button onClick={toggleFs} className="p-2 rounded-lg border border-slate-700 hover:border-indigo-500 transition" aria-label="Fullscreen">
              {isFs ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pb-3">
          <ProgressBar currentBlock={slide.block} slideIndex={i} t={t} slides={deck} />
        </div>
      </header>

      {/* Slide canvas */}
      <main className="flex-1 flex items-center justify-center p-6 md:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className={`w-full max-w-5xl rounded-2xl border ${t.card} shadow-2xl shadow-indigo-950/30 p-8 md:p-12 min-h-[60vh] flex items-center justify-center`}
          >
            <div className="w-full">
              <div className="text-[11px] uppercase tracking-[0.2em] text-indigo-400 font-semibold mb-6 text-center">
                {BLOCKS.find((b) => b.id === slide.block)?.label}
              </div>
              <SlideRenderer slide={slide} t={t} />
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom toolbar */}
      <footer className="border-t border-slate-800/60 bg-slate-950/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-3">
          <button
            onClick={prev}
            disabled={i === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 hover:border-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>

          <div className="flex items-center gap-2">
            {voiceText && (
              <button
                onClick={() => playVoice(voiceText)}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition shadow-md shadow-indigo-900/40"
              >
                <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
                {isLoading ? 'Loading…' : 'Listen'}
              </button>
            )}
            {showSpeak && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-900/40 border border-purple-700 text-purple-200 text-sm font-semibold">
                <Mic className="w-4 h-4" /> Speak
              </div>
            )}
          </div>

          <button
            onClick={next}
            disabled={i === deck.length - 1}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold transition"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
