import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Volume2, Loader2, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { cn } from '@/lib/utils';

export type StoryLayout = 'classic' | 'immersive';

export interface StoryPage {
  title?: string;
  text: string;
  imageUrl?: string;
  mcq?: {
    question: string;
    options: string[];
    correct_index: number;
  };
}

interface StoryBookViewerProps {
  title: string;
  pages: StoryPage[];
  layout?: StoryLayout;
  coverImageUrl?: string;
  onExit?: () => void;
}

const FALLBACK_BG =
  'linear-gradient(135deg, hsl(262 60% 18%), hsl(280 50% 28%), hsl(220 55% 22%))';

export const StoryBookViewer: React.FC<StoryBookViewerProps> = ({
  title,
  pages,
  layout = 'immersive',
  coverImageUrl,
  onExit,
}) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [mcqAnswered, setMcqAnswered] = useState<Record<number, number>>({});
  const tts = useTextToSpeech();

  const safePages = useMemo(() => pages.filter((p) => p && (p.text || p.mcq)), [pages]);
  const total = safePages.length;
  const page = safePages[pageIndex];
  const pageImage = page?.imageUrl || coverImageUrl;

  // Stop narration on page change / unmount
  useEffect(() => {
    return () => {
      tts.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goTo(pageIndex + 1);
      else if (e.key === 'ArrowLeft') goTo(pageIndex - 1);
      else if (e.key === 'Escape' && onExit) onExit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, total]);

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        This story has no pages yet.
      </div>
    );
  }

  const goTo = (next: number) => {
    if (next < 0 || next >= total) return;
    tts.stop();
    setDirection(next > pageIndex ? 1 : -1);
    setPageIndex(next);
  };

  const handlePlayNarration = () => {
    if (tts.isPlaying) {
      tts.stop();
      return;
    }
    if (page.text) tts.speak(page.text, { speed: 0.95 });
  };

  const isImmersive = layout === 'immersive';

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      style={{
        background: isImmersive && pageImage ? undefined : FALLBACK_BG,
      }}
    >
      {/* Immersive: full-bleed background image with Ken Burns */}
      {isImmersive && pageImage && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${pageIndex}`}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${pageImage})` }}
          />
        </AnimatePresence>
      )}
      {isImmersive && pageImage && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 pointer-events-none" />
      )}

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/70">
            Story
          </span>
          <span className="hidden sm:block text-sm font-semibold text-white/90 truncate max-w-md">
            {title}
          </span>
        </div>
        {onExit && (
          <button
            onClick={onExit}
            className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md p-2 transition-colors"
            aria-label="Exit story"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* Page dots */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
        {safePages.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              i === pageIndex ? 'w-8 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60',
            )}
            aria-label={`Go to page ${i + 1}`}
          />
        ))}
      </div>

      {/* Edge arrows */}
      <button
        onClick={() => goTo(pageIndex - 1)}
        disabled={pageIndex === 0}
        className={cn(
          'group absolute left-0 top-0 bottom-0 z-20 w-16 sm:w-24 flex items-center justify-center',
          'disabled:opacity-0 disabled:pointer-events-none transition-opacity',
        )}
        aria-label="Previous page"
      >
        <span className="rounded-full bg-white/10 group-hover:bg-white/25 backdrop-blur-md p-3 transition-all group-hover:-translate-x-0.5">
          <ChevronLeft className="w-6 h-6 text-white" />
        </span>
      </button>
      <button
        onClick={() => goTo(pageIndex + 1)}
        disabled={pageIndex === total - 1}
        className={cn(
          'group absolute right-0 top-0 bottom-0 z-20 w-16 sm:w-24 flex items-center justify-center',
          'disabled:opacity-0 disabled:pointer-events-none transition-opacity',
        )}
        aria-label="Next page"
      >
        <span className="rounded-full bg-white/10 group-hover:bg-white/25 backdrop-blur-md p-3 transition-all group-hover:translate-x-0.5">
          <ChevronRight className="w-6 h-6 text-white" />
        </span>
      </button>

      {/* Page content with crossfade + slide */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={pageIndex}
          custom={direction}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -direction * 40 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-10 flex"
        >
          {isImmersive ? (
            <ImmersiveCard
              page={page}
              pageIndex={pageIndex}
              total={total}
              ttsLoading={tts.isLoading}
              ttsPlaying={tts.isPlaying}
              onPlay={handlePlayNarration}
              mcqAnswered={mcqAnswered}
              setMcqAnswered={setMcqAnswered}
            />
          ) : (
            <ClassicSplit
              page={page}
              pageImage={pageImage}
              pageIndex={pageIndex}
              total={total}
              ttsLoading={tts.isLoading}
              ttsPlaying={tts.isPlaying}
              onPlay={handlePlayNarration}
              mcqAnswered={mcqAnswered}
              setMcqAnswered={setMcqAnswered}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────
// Sub-layouts
// ────────────────────────────────────────────────────────────────────────

interface SubProps {
  page: StoryPage;
  pageIndex: number;
  total: number;
  ttsLoading: boolean;
  ttsPlaying: boolean;
  onPlay: () => void;
  mcqAnswered: Record<number, number>;
  setMcqAnswered: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}

const NarrationButton: React.FC<{
  loading: boolean;
  playing: boolean;
  onClick: () => void;
  variant?: 'light' | 'dark';
}> = ({ loading, playing, onClick, variant = 'dark' }) => {
  const Icon = loading ? Loader2 : playing ? Square : Volume2;
  return (
    <Button
      onClick={onClick}
      size="lg"
      className={cn(
        'rounded-full font-semibold gap-2 shadow-lg',
        variant === 'dark'
          ? 'bg-white text-slate-900 hover:bg-white/90'
          : 'bg-slate-900 text-white hover:bg-slate-800',
      )}
    >
      <Icon className={cn('w-5 h-5', loading && 'animate-spin')} />
      {loading ? 'Loading…' : playing ? 'Stop' : 'Play Narration'}
    </Button>
  );
};

const McqBlock: React.FC<{
  pageIndex: number;
  mcq: NonNullable<StoryPage['mcq']>;
  answered: number | undefined;
  onAnswer: (i: number) => void;
  variant: 'light' | 'dark';
}> = ({ mcq, answered, onAnswer, variant }) => (
  <div className="space-y-3 mt-4">
    <p className={cn('text-sm font-bold', variant === 'dark' ? 'text-white' : 'text-slate-900')}>
      {mcq.question}
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {mcq.options.map((opt, i) => {
        const picked = answered === i;
        const correct = answered != null && i === mcq.correct_index;
        const wrong = picked && i !== mcq.correct_index;
        return (
          <button
            key={i}
            onClick={() => answered == null && onAnswer(i)}
            disabled={answered != null}
            className={cn(
              'text-left px-4 py-2.5 rounded-xl text-sm font-medium border transition-all',
              variant === 'dark'
                ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50',
              correct && 'bg-emerald-500/90 border-emerald-300 text-white',
              wrong && 'bg-rose-500/90 border-rose-300 text-white',
              answered != null && !picked && !correct && 'opacity-60',
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  </div>
);

const ImmersiveCard: React.FC<SubProps> = ({
  page,
  pageIndex,
  total,
  ttsLoading,
  ttsPlaying,
  onPlay,
  mcqAnswered,
  setMcqAnswered,
}) => (
  <div className="relative w-full h-full flex items-end justify-center px-4 sm:px-12 pb-10 sm:pb-16">
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="w-full max-w-3xl rounded-3xl bg-black/45 backdrop-blur-xl border border-white/15 shadow-2xl p-6 sm:p-8 text-white"
    >
      {page.title && (
        <h3 className="text-xs font-bold tracking-[0.18em] uppercase text-white/60 mb-3">
          {page.title}
        </h3>
      )}
      <p className="text-lg sm:text-xl leading-relaxed font-medium text-white/95 whitespace-pre-line">
        {page.text}
      </p>

      {page.mcq && (
        <McqBlock
          pageIndex={pageIndex}
          mcq={page.mcq}
          answered={mcqAnswered[pageIndex]}
          onAnswer={(i) => setMcqAnswered((prev) => ({ ...prev, [pageIndex]: i }))}
          variant="dark"
        />
      )}

      <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/15">
        <NarrationButton
          loading={ttsLoading}
          playing={ttsPlaying}
          onClick={onPlay}
          variant="dark"
        />
        <span className="text-xs font-semibold tracking-wider text-white/60">
          {pageIndex + 1} / {total}
        </span>
      </div>
    </motion.div>
  </div>
);

const ClassicSplit: React.FC<SubProps & { pageImage?: string }> = ({
  page,
  pageImage,
  pageIndex,
  total,
  ttsLoading,
  ttsPlaying,
  onPlay,
  mcqAnswered,
  setMcqAnswered,
}) => (
  <div className="relative w-full h-full flex flex-col md:flex-row bg-[#fdfbf6]">
    <div className="relative w-full md:w-1/2 h-1/3 md:h-full bg-slate-200 overflow-hidden">
      {pageImage ? (
        <img
          src={pageImage}
          alt={page.title || `Page ${pageIndex + 1}`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
          No illustration
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent md:bg-none" />
    </div>

    <div className="relative w-full md:w-1/2 h-2/3 md:h-full flex flex-col justify-center px-8 sm:px-14 py-10 overflow-y-auto">
      <div className="max-w-xl mx-auto w-full">
        {page.title && (
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-slate-500 mb-4">
            {page.title}
          </h3>
        )}
        <p
          className="text-xl sm:text-2xl leading-[1.7] text-slate-800 whitespace-pre-line"
          style={{ fontFamily: "'Lora', 'Georgia', serif" }}
        >
          {page.text}
        </p>

        {page.mcq && (
          <McqBlock
            pageIndex={pageIndex}
            mcq={page.mcq}
            answered={mcqAnswered[pageIndex]}
            onAnswer={(i) => setMcqAnswered((prev) => ({ ...prev, [pageIndex]: i }))}
            variant="light"
          />
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
          <NarrationButton
            loading={ttsLoading}
            playing={ttsPlaying}
            onClick={onPlay}
            variant="light"
          />
          <span className="text-xs font-semibold tracking-wider text-slate-400">
            Page {pageIndex + 1} of {total}
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default StoryBookViewer;
