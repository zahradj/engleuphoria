import React, { useMemo, useRef, useState } from 'react';
import { PPPSlide, MCQData, FlashcardData, DrawingData } from '../../CreatorContext';
import { PHASE_STYLES, normalizePhase } from './phaseTheme';
import { cn } from '@/lib/utils';
import { Pencil, GripHorizontal, X, CheckCircle2 } from 'lucide-react';

type ViewMode = 'student' | 'teacher';

interface Props {
  slide: PPPSlide;
  onChange: (patch: Partial<PPPSlide>) => void;
}

const VIEW_KEY: Record<ViewMode, string> = { student: '👁️ Student View', teacher: '🎓 Teacher View' };

// ---------- helpers ----------

function bgUrlFor(slide: PPPSlide) {
  const kw = (slide.visual_keyword || 'classroom').trim().replace(/\s+/g, ',');
  return slide.custom_image_url || `https://source.unsplash.com/1600x1000/?${encodeURIComponent(kw)}`;
}

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

const MCQBlock: React.FC<{ slide: PPPSlide; mode: ViewMode }> = ({ slide, mode }) => {
  const data = asMCQ(slide);
  return (
    <div className="space-y-3">
      {data.question && (
        <p className="text-lg sm:text-xl font-bold leading-snug">{data.question}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {data.options.map((opt, i) => {
          const isCorrect = i === data.correct_index;
          const showCorrect = mode === 'teacher' && isCorrect;
          return (
            <div
              key={i}
              className={cn(
                'flex items-center gap-2 rounded-xl px-3 py-2 backdrop-blur transition',
                showCorrect ? 'bg-emerald-400/30 ring-2 ring-emerald-300' : 'bg-white/15',
              )}
            >
              <span className="h-6 w-6 rounded-md bg-white/20 grid place-items-center text-xs font-bold">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-sm sm:text-base">{opt || <em className="opacity-50">empty</em>}</span>
              {showCorrect && <CheckCircle2 className="h-4 w-4 ml-auto text-emerald-200" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FlashcardBlock: React.FC<{ slide: PPPSlide; mode: ViewMode }> = ({ slide, mode }) => {
  const [flipped, setFlipped] = useState(false);
  const { front, back } = asFlashcard(slide);
  const showBack = mode === 'teacher' || flipped;
  return (
    <button
      type="button"
      onClick={() => setFlipped((v) => !v)}
      className="group inline-flex flex-col items-start gap-2 max-w-2xl"
    >
      <div className="rounded-2xl bg-white/95 dark:bg-slate-100/95 text-slate-900 px-8 py-10 shadow-2xl min-w-[280px] min-h-[160px] flex items-center justify-center">
        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center">
          {showBack ? back || <em className="opacity-50">back</em> : front || <em className="opacity-50">front</em>}
        </span>
      </div>
      <span className="text-[11px] uppercase tracking-widest font-bold opacity-70">
        {mode === 'teacher' ? 'Showing back (teacher view)' : flipped ? 'Tap to flip back' : 'Tap to flip'}
      </span>
    </button>
  );
};

const DrawingBlock: React.FC<{ slide: PPPSlide }> = ({ slide }) => {
  const { prompt } = asDrawing(slide);
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1.5 text-xs font-semibold">
      <Pencil className="h-3.5 w-3.5" />
      <span className="truncate max-w-[60ch]">{prompt || 'Students draw their answer.'}</span>
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
      return <DrawingBlock slide={slide} />;
    default:
      return slide.content ? (
        <p className="text-base sm:text-lg leading-relaxed max-w-3xl">{slide.content}</p>
      ) : null;
  }
};

// ---------- layouts ----------

interface LayoutProps {
  slide: PPPSlide;
  onChange: (patch: Partial<PPPSlide>) => void;
  mode: ViewMode;
  bg: string;
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
      'bg-transparent text-3xl sm:text-4xl font-extrabold tracking-tight outline-none border-0 rounded-md px-1 w-full',
      light ? 'text-slate-900 placeholder:text-slate-400 focus:bg-slate-200/40' : 'text-white placeholder:text-white/50 focus:bg-white/10',
    )}
  />
);

const SplitLayout: React.FC<LayoutProps & { side: 'left' | 'right' }> = ({ slide, onChange, bg, children, side }) => {
  const ImagePane = (
    <div
      className="relative bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
      aria-hidden
    />
  );
  const ContentPane = (
    <div className="relative bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 p-8 sm:p-10 flex flex-col justify-end gap-3">
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

const CenterCardLayout: React.FC<LayoutProps> = ({ slide, onChange, bg, children }) => (
  <div className="absolute inset-0">
    <div
      className="absolute inset-0 bg-cover bg-center scale-110"
      style={{ backgroundImage: `url(${bg})`, filter: 'blur(16px) brightness(0.7)' }}
      aria-hidden
    />
    <div className="absolute inset-0 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full rounded-3xl bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-2xl p-8 sm:p-10 text-slate-900 dark:text-slate-50">
        <TitleField slide={slide} onChange={onChange} light />
        <div className="mt-3 text-slate-700 dark:text-slate-200">{children}</div>
      </div>
    </div>
  </div>
);

const FullBackgroundLayout: React.FC<LayoutProps> = ({ slide, onChange, bg, children }) => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }} aria-hidden />
    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/15" aria-hidden />
    <div className="relative h-full w-full flex flex-col justify-end p-8 sm:p-10 text-white">
      <TitleField slide={slide} onChange={onChange} />
      <div className="mt-3">{children}</div>
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
  const bg = useMemo(() => bgUrlFor(slide), [slide.visual_keyword, slide.custom_image_url]);
  const layout = slide.layout_style ?? 'full_background';

  const interactive = <InteractiveBlock slide={slide} mode={mode} />;

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

          <span className="text-[11px] font-mono text-slate-400">
            {slide.slide_type} · {layout}
          </span>
        </div>

        {/* Canvas card */}
        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
          style={{ aspectRatio: '16 / 10' }}
        >
          {layout === 'split_left' && (
            <SplitLayout side="left" slide={slide} onChange={onChange} bg={bg} mode={mode}>
              {interactive}
            </SplitLayout>
          )}
          {layout === 'split_right' && (
            <SplitLayout side="right" slide={slide} onChange={onChange} bg={bg} mode={mode}>
              {interactive}
            </SplitLayout>
          )}
          {layout === 'center_card' && (
            <CenterCardLayout slide={slide} onChange={onChange} bg={bg} mode={mode}>
              {interactive}
            </CenterCardLayout>
          )}
          {layout === 'full_background' && (
            <FullBackgroundLayout slide={slide} onChange={onChange} bg={bg} mode={mode}>
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
