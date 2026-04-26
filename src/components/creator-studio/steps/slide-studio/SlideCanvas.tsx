import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PPPSlide, MCQData, FlashcardData, DrawingData } from '../../CreatorContext';
import { PHASE_STYLES, normalizePhase } from './phaseTheme';
import { cn } from '@/lib/utils';
import { Pencil, GripHorizontal, X, CheckCircle2, ImageOff } from 'lucide-react';
import { MascotSpeech } from './MascotSpeech';

type ViewMode = 'student' | 'teacher';

interface Props {
  slide: PPPSlide;
  onChange: (patch: Partial<PPPSlide>) => void;
}

const VIEW_KEY: Record<ViewMode, string> = { student: '👁️ Student View', teacher: '🎓 Teacher View' };

// Vibrant, kid-friendly fallback gradients (used when the image fails to load).
const FALLBACK_GRADIENTS = [
  'bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300',
  'bg-gradient-to-br from-amber-200 via-orange-300 to-rose-300',
  'bg-gradient-to-br from-emerald-200 via-teal-300 to-sky-300',
  'bg-gradient-to-br from-fuchsia-300 via-violet-300 to-indigo-300',
  'bg-gradient-to-br from-yellow-200 via-lime-300 to-emerald-300',
  'bg-gradient-to-br from-pink-300 via-rose-300 to-orange-300',
] as const;

function pickGradient(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return FALLBACK_GRADIENTS[Math.abs(hash) % FALLBACK_GRADIENTS.length];
}

function bgUrlFor(slide: PPPSlide): string | null {
  if (slide.custom_image_url) return slide.custom_image_url;
  const kw = (slide.visual_keyword || '').trim();
  if (!kw) return null;
  const tags = encodeURIComponent(kw.split(/\s+/).filter(Boolean).join(',') + ',kids');
  // LoremFlickr is a stable Creative Commons image proxy, friendly for prototyping.
  return `https://loremflickr.com/1024/768/${tags}`;
}

// ---------- Background renderer with graceful fallback ----------

const SlideBackground: React.FC<{ slide: PPPSlide; overlay?: React.ReactNode }> = ({ slide, overlay }) => {
  const url = useMemo(() => bgUrlFor(slide), [slide.visual_keyword, slide.custom_image_url]);
  const gradient = useMemo(() => pickGradient(slide.id), [slide.id]);
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>(url ? 'loading' : 'error');

  useEffect(() => {
    if (!url) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    const img = new Image();
    img.onload = () => setStatus('ok');
    img.onerror = () => setStatus('error');
    img.src = url;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [url]);

  const showImage = status === 'ok' && !!url;

  return (
    <div className={cn('absolute inset-0', !showImage && gradient)} aria-hidden>
      {showImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${url})` }}
        />
      )}
      {overlay}
    </div>
  );
};

// ---------- helpers ----------

function asMCQ(slide: PPPSlide): MCQData {
  const d = (slide.interactive_data ?? {}) as Partial<MCQData>;
  return {
    question: d.question ?? '',
    options: Array.isArray(d.options) && d.options.length ? d.options : ['', '', '', ''],
    correct_index: typeof d.correct_index === 'number' ? d.correct_index : 0,
  };
}
function asFlashcard(slide: PPPSlide): FlashcardData {
  const d = (slide.interactive_data ?? {}) as Partial<FlashcardData>;
  return { front: d.front ?? '', back: d.back ?? '' };
}
function asDrawing(slide: PPPSlide): DrawingData {
  const d = (slide.interactive_data ?? {}) as Partial<DrawingData>;
  return { prompt: d.prompt ?? slide.content ?? '' };
}

// ---------- interactive renderers ----------

const MCQ_OPTION_COLORS = [
  'bg-yellow-300 hover:bg-yellow-400 text-slate-900',
  'bg-sky-300 hover:bg-sky-400 text-slate-900',
  'bg-pink-300 hover:bg-pink-400 text-slate-900',
  'bg-emerald-300 hover:bg-emerald-400 text-slate-900',
  'bg-orange-300 hover:bg-orange-400 text-slate-900',
  'bg-violet-300 hover:bg-violet-400 text-slate-900',
];

const MCQBlock: React.FC<{ slide: PPPSlide; mode: ViewMode }> = ({ slide, mode }) => {
  const data = asMCQ(slide);
  return (
    <div className="space-y-4 font-['Fredoka',_'Quicksand',_sans-serif]">
      {data.question && (
        <div className="inline-block rounded-2xl bg-white/95 px-5 py-3 shadow-lg border-2 border-white">
          <p className="text-xl sm:text-2xl font-bold leading-snug text-slate-800">{data.question}</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
        {data.options.map((opt, i) => {
          const isCorrect = i === data.correct_index;
          const showCorrect = mode === 'teacher' && isCorrect;
          return (
            <button
              key={i}
              type="button"
              className={cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3.5 font-bold text-base sm:text-lg shadow-lg border-2 border-white/80 transition-transform hover:scale-[1.03] hover:-rotate-1 active:scale-95',
                MCQ_OPTION_COLORS[i % MCQ_OPTION_COLORS.length],
                showCorrect && 'ring-4 ring-emerald-500 ring-offset-2 ring-offset-transparent',
              )}
            >
              <span className="h-8 w-8 rounded-full bg-white/80 grid place-items-center text-sm font-extrabold text-slate-700 shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 text-left">
                {opt || <em className="opacity-60 font-normal">empty</em>}
              </span>
              {showCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-700 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const FlashcardBlock: React.FC<{ slide: PPPSlide; mode: ViewMode }> = ({ slide, mode }) => {
  const [flipped, setFlipped] = useState(false);
  const { front, back } = asFlashcard(slide);
  const showBack = mode === 'teacher' ? true : flipped;

  return (
    <div className="flex flex-col items-center gap-3 font-['Fredoka',_'Quicksand',_sans-serif]">
      <button
        type="button"
        onClick={() => setFlipped((v) => !v)}
        className="perspective-1000 group focus:outline-none"
        aria-label="Flip flashcard"
      >
        <div
          className={cn(
            'relative preserve-3d transition-transform duration-700 ease-out',
            'w-[300px] h-[200px] sm:w-[360px] sm:h-[240px]',
            showBack && 'rotate-y-180',
          )}
        >
          {/* Front face */}
          <div className="absolute inset-0 backface-hidden rounded-3xl bg-gradient-to-br from-yellow-300 via-orange-300 to-pink-300 shadow-2xl border-4 border-white flex items-center justify-center p-6">
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 text-center drop-shadow-sm">
              {front || <em className="opacity-60 font-normal">front</em>}
            </span>
          </div>
          {/* Back face */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl bg-white shadow-2xl border-4 border-white flex items-center justify-center p-6">
            <span className="text-2xl sm:text-3xl font-bold text-slate-800 text-center leading-snug">
              {back || <em className="opacity-60 font-normal">back</em>}
            </span>
          </div>
        </div>
      </button>
      <span className="text-xs uppercase tracking-widest font-bold text-white/90 drop-shadow bg-black/30 rounded-full px-3 py-1">
        {mode === 'teacher' ? 'Teacher view: showing back' : flipped ? '↻ Tap to flip back' : '✨ Tap to flip!'}
      </span>
    </div>
  );
};

const DrawingBlock: React.FC<{ slide: PPPSlide; phase?: string }> = ({ slide, phase }) => {
  const { prompt } = asDrawing(slide);
  return (
    <div className="space-y-4 max-w-2xl">
      <MascotSpeech phase={phase} text={prompt} placeholder="Tell students what to draw…" size="md" />
      <div className="rounded-3xl bg-white/85 border-4 border-dashed border-white p-6 sm:p-8 shadow-xl flex flex-col items-center justify-center gap-2 min-h-[160px] font-['Fredoka',_'Quicksand',_sans-serif]">
        <Pencil className="h-10 w-10 text-slate-400" />
        <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Drawing Canvas</p>
        <p className="text-xs text-slate-400">Students draw their answer here</p>
      </div>
    </div>
  );
};

const InteractiveBlock: React.FC<{ slide: PPPSlide; mode: ViewMode }> = ({ slide, mode }) => {
  switch (slide.slide_type) {
    case 'multiple_choice':
      return <MCQBlock slide={slide} mode={mode} />;
    case 'flashcard':
      return <FlashcardBlock slide={slide} mode={mode} />;
    case 'drawing_prompt':
      return <DrawingBlock slide={slide} phase={slide.phase as string} />;
    default:
      return (
        <MascotSpeech
          phase={slide.phase as string}
          text={slide.content}
          placeholder="Add a friendly sentence in the right panel…"
        />
      );
  }
};

// ---------- layouts ----------

interface LayoutProps {
  slide: PPPSlide;
  onChange: (patch: Partial<PPPSlide>) => void;
  mode: ViewMode;
  children: React.ReactNode;
}

const TitleField: React.FC<{ slide: PPPSlide; onChange: (p: Partial<PPPSlide>) => void; light?: boolean }> = ({
  slide,
  onChange,
  light,
}) => (
  <input
    type="text"
    value={slide.title ?? ''}
    onChange={(e) => onChange({ title: e.target.value })}
    placeholder="Slide title…"
    className={cn(
      "bg-transparent text-3xl sm:text-4xl font-extrabold tracking-tight outline-none border-0 rounded-md px-1 w-full font-['Fredoka',_'Quicksand',_sans-serif]",
      light
        ? 'text-slate-900 placeholder:text-slate-400 focus:bg-slate-200/40'
        : 'text-white placeholder:text-white/60 focus:bg-white/10 drop-shadow-md',
    )}
  />
);

const SplitLayout: React.FC<LayoutProps & { side: 'left' | 'right' }> = ({
  slide,
  onChange,
  children,
  side,
}) => {
  const ImagePane = (
    <div className="relative">
      <SlideBackground slide={slide} />
    </div>
  );
  const ContentPane = (
    <div className="relative bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 p-6 sm:p-8 flex flex-col justify-center gap-4 overflow-y-auto">
      <TitleField slide={slide} onChange={onChange} light />
      <div className="text-slate-700 dark:text-slate-200">{children}</div>
    </div>
  );
  return (
    <div className="absolute inset-0 grid grid-cols-2">
      {side === 'left' ? (
        <>
          {ImagePane}
          {ContentPane}
        </>
      ) : (
        <>
          {ContentPane}
          {ImagePane}
        </>
      )}
    </div>
  );
};

const CenterCardLayout: React.FC<LayoutProps> = ({ slide, onChange, children }) => (
  <div className="absolute inset-0">
    <SlideBackground
      slide={slide}
      overlay={<div className="absolute inset-0 backdrop-blur-md bg-black/20" />}
    />
    <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8 overflow-y-auto">
      <div className="max-w-3xl w-full rounded-3xl bg-white/90 dark:bg-slate-900/85 backdrop-blur-xl border-2 border-white/60 dark:border-white/10 shadow-2xl p-6 sm:p-8 text-slate-900 dark:text-slate-50">
        <TitleField slide={slide} onChange={onChange} light />
        <div className="mt-4 text-slate-700 dark:text-slate-200">{children}</div>
      </div>
    </div>
  </div>
);

const FullBackgroundLayout: React.FC<LayoutProps> = ({ slide, onChange, children }) => (
  <div className="absolute inset-0">
    <SlideBackground
      slide={slide}
      overlay={
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
      }
    />
    <div className="relative h-full w-full flex flex-col justify-end p-6 sm:p-10 text-white overflow-y-auto">
      <TitleField slide={slide} onChange={onChange} />
      <div className="mt-4">{children}</div>
    </div>
  </div>
);

// ---------- teleprompter ----------

const Teleprompter: React.FC<{ script: string; onChange: (v: string) => void }> = ({ script, onChange }) => {
  const [pos, setPos] = useState({ x: 24, y: 24 });
  const dragging = useRef<{ ox: number; oy: number } | null>(null);
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = { ox: e.clientX - pos.x, oy: e.clientY - pos.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    setPos({ x: e.clientX - dragging.current.ox, y: e.clientY - dragging.current.oy });
  };
  const onPointerUp = () => {
    dragging.current = null;
  };

  return (
    <div
      className="absolute z-20 w-[320px] rounded-2xl bg-slate-950/85 backdrop-blur-xl text-white border border-white/15 shadow-2xl"
      style={{ left: pos.x, top: pos.y }}
    >
      <div
        className="flex items-center justify-between gap-2 px-3 py-2 border-b border-white/10 cursor-grab active:cursor-grabbing select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-300">
          <GripHorizontal className="h-3.5 w-3.5" />
          Teacher Teleprompter
        </div>
        <button
          type="button"
          onClick={() => setHidden(true)}
          className="text-white/60 hover:text-white p-0.5 rounded"
          aria-label="Hide teleprompter"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <textarea
        value={script}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        className="w-full bg-transparent p-3 text-sm leading-relaxed outline-none resize-none placeholder:text-white/40"
        placeholder="2–3 high-energy sentences for the teacher to read…"
      />
    </div>
  );
};

// ---------- main canvas ----------

export const SlideCanvas: React.FC<Props> = ({ slide, onChange }) => {
  const phaseKey = normalizePhase(slide.phase as string);
  const style = PHASE_STYLES[phaseKey];
  const [mode, setMode] = useState<ViewMode>('student');
  const layout = slide.layout_style ?? 'full_background';

  const interactive = <InteractiveBlock slide={slide} mode={mode} />;
  const hasImage = !!(slide.custom_image_url || (slide.visual_keyword || '').trim());

  return (
    <section className="flex-1 min-w-0 h-full overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto">
        {/* Top bar: phase + dual-view toggle */}
        <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
          <span className={cn('text-[11px] font-bold uppercase tracking-widest px-2 py-1 rounded', style.chip)}>
            {style.label}
          </span>

          <div className="inline-flex items-center rounded-full bg-slate-200 dark:bg-slate-800 p-0.5 text-xs font-semibold">
            {(['student', 'teacher'] as ViewMode[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setMode(v)}
                className={cn(
                  'px-3 py-1.5 rounded-full transition',
                  mode === v
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 shadow'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
                )}
              >
                {VIEW_KEY[v]}
              </button>
            ))}
          </div>

          <span className="text-[11px] font-mono text-slate-400 inline-flex items-center gap-1.5">
            {!hasImage && <ImageOff className="h-3 w-3" aria-label="No visual keyword set" />}
            {slide.slide_type ?? 'text_image'} · {layout}
          </span>
        </div>

        {/* Canvas card */}
        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
          style={{ aspectRatio: '16 / 10' }}
        >
          {layout === 'split_left' && (
            <SplitLayout side="left" slide={slide} onChange={onChange} mode={mode}>
              {interactive}
            </SplitLayout>
          )}
          {layout === 'split_right' && (
            <SplitLayout side="right" slide={slide} onChange={onChange} mode={mode}>
              {interactive}
            </SplitLayout>
          )}
          {layout === 'center_card' && (
            <CenterCardLayout slide={slide} onChange={onChange} mode={mode}>
              {interactive}
            </CenterCardLayout>
          )}
          {layout === 'full_background' && (
            <FullBackgroundLayout slide={slide} onChange={onChange} mode={mode}>
              {interactive}
            </FullBackgroundLayout>
          )}

          {mode === 'teacher' && (
            <Teleprompter
              script={slide.teacher_script ?? slide.teacher_instructions ?? ''}
              onChange={(v) => onChange({ teacher_script: v })}
            />
          )}
        </div>

        <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
          {mode === 'teacher'
            ? 'Teacher view shows the teleprompter and highlights correct answers. Drag the card by its header.'
            : 'Student view renders exactly what learners will see in class.'}
        </p>
      </div>
    </section>
  );
};
