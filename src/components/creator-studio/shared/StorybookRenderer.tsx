import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type StorybookPage = {
  page_number: number;
  text: string;
  image_url?: string;
  audio_url?: string;
  image_prompt?: string;
};

export type StorybookSlideShape = {
  type: 'storybook';
  title?: string;
  topic?: string;
  pages: StorybookPage[];
};

type Hub = 'playground' | 'academy' | 'success';

interface Props {
  slide: StorybookSlideShape;
  hub: Hub;
  /** called once when the user reaches the final page */
  onComplete?: () => void;
}

const HUB_THEME: Record<Hub, { wrap: string; arrow: string; pageNum: string; bodyFont: string; titleColor: string }> = {
  playground: {
    wrap: 'bg-gradient-to-br from-yellow-100 via-orange-100 to-amber-50 border-orange-300',
    arrow: 'bg-orange-500 hover:bg-orange-600 text-white',
    pageNum: 'text-orange-600',
    bodyFont: 'text-2xl md:text-3xl font-extrabold leading-snug text-slate-800',
    titleColor: 'text-orange-600',
  },
  academy: {
    wrap: 'bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-indigo-300',
    arrow: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    pageNum: 'text-indigo-600',
    bodyFont: 'text-lg leading-relaxed text-slate-800',
    titleColor: 'text-indigo-700',
  },
  success: {
    wrap: 'bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-emerald-300',
    arrow: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    pageNum: 'text-emerald-700',
    bodyFont: 'font-serif text-lg leading-relaxed text-slate-800',
    titleColor: 'text-emerald-700',
  },
};

export function StorybookRenderer({ slide, hub, onComplete }: Props) {
  const theme = HUB_THEME[hub];
  const pages = slide.pages || [];
  const [idx, setIdx] = useState(0);
  const [completedFired, setCompletedFired] = useState(false);

  if (pages.length === 0) {
    return (
      <div className={`w-full rounded-3xl border-4 p-10 text-center ${theme.wrap}`}>
        <div className="text-5xl mb-3">📖</div>
        <p className="text-slate-600 font-semibold">No story pages yet — generate one in the editor.</p>
      </div>
    );
  }

  const safeIdx = Math.min(idx, pages.length - 1);
  const page = pages[safeIdx];
  const isFirst = safeIdx === 0;
  const isLast = safeIdx === pages.length - 1;

  const next = () => {
    if (isLast) {
      if (!completedFired) {
        setCompletedFired(true);
        onComplete?.();
      }
      return;
    }
    const n = safeIdx + 1;
    setIdx(n);
    if (n === pages.length - 1 && !completedFired) {
      setCompletedFired(true);
      onComplete?.();
    }
  };

  // Hub-specific layouts
  if (hub === 'playground') {
    return (
      <div className={`w-full rounded-3xl border-4 ${theme.wrap} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`text-xs font-extrabold uppercase tracking-wider ${theme.titleColor}`}>📖 {slide.title || 'Story'}</div>
          <div className={`text-sm font-extrabold ${theme.pageNum}`}>Page {safeIdx + 1} / {pages.length}</div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={safeIdx}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center"
          >
            <div className="rounded-2xl overflow-hidden border-4 border-orange-300 bg-white aspect-square flex items-center justify-center">
              {page.image_url ? (
                <img src={page.image_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="text-7xl">🖼️</div>
              )}
            </div>
            <div className={`${theme.bodyFont} text-center md:text-left`}>{page.text}</div>
          </motion.div>
        </AnimatePresence>
        {page.audio_url && (
          <audio controls src={page.audio_url} className="w-full mt-4" />
        )}
        <div className="mt-4 flex items-center justify-between">
          <button onClick={() => setIdx(Math.max(0, safeIdx - 1))} disabled={isFirst} className={`rounded-full p-3 disabled:opacity-30 ${theme.arrow}`}>
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button onClick={next} disabled={isLast} className={`rounded-full p-3 disabled:opacity-30 ${theme.arrow}`}>
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>
      </div>
    );
  }

  if (hub === 'academy') {
    return (
      <div className={`w-full rounded-2xl border-2 ${theme.wrap} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl font-bold ${theme.titleColor}`}>📖 {slide.title || 'Story'}</h3>
          <span className={`text-xs font-bold ${theme.pageNum}`}>{safeIdx + 1} / {pages.length}</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={safeIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-[40%_1fr] gap-5">
            <div className="rounded-xl overflow-hidden border border-indigo-200 bg-white aspect-square">
              {page.image_url ? <img src={page.image_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-5xl">🖼️</div>}
            </div>
            <div>
              <div className={theme.bodyFont}>{page.text}</div>
              {page.audio_url && <audio controls src={page.audio_url} className="w-full mt-4" />}
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-5 flex items-center justify-between">
          <button onClick={() => setIdx(Math.max(0, safeIdx - 1))} disabled={isFirst} className={`rounded-lg px-4 py-2 text-sm font-bold disabled:opacity-30 ${theme.arrow}`}>← Prev</button>
          <button onClick={next} disabled={isLast} className={`rounded-lg px-4 py-2 text-sm font-bold disabled:opacity-30 ${theme.arrow}`}>Next →</button>
        </div>
      </div>
    );
  }

  // success — case study
  return (
    <div className={`w-full rounded-2xl border ${theme.wrap} p-7`}>
      <div className="flex items-center justify-between border-b border-emerald-200 pb-3 mb-4">
        <h3 className={`text-xl font-bold ${theme.titleColor}`}>Case Study · {slide.title || 'Scenario'}</h3>
        <span className={`text-xs font-semibold tracking-wide ${theme.pageNum}`}>PAGE {safeIdx + 1} OF {pages.length}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={safeIdx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-[1fr_45%] gap-6 items-start">
          <div>
            <div className={theme.bodyFont}>{page.text}</div>
            {page.audio_url && <audio controls src={page.audio_url} className="w-full mt-4" />}
          </div>
          <div className="rounded-lg overflow-hidden border border-emerald-200 bg-white aspect-[4/3]">
            {page.image_url ? <img src={page.image_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-5xl">📊</div>}
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="mt-6 flex items-center justify-between">
        <button onClick={() => setIdx(Math.max(0, safeIdx - 1))} disabled={isFirst} className={`rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-30 ${theme.arrow}`}>← Previous</button>
        <button onClick={next} disabled={isLast} className={`rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-30 ${theme.arrow}`}>Continue →</button>
      </div>
    </div>
  );
}

export default StorybookRenderer;
