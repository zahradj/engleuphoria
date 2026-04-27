import React, { useRef, useState } from 'react';
import { PPPSlide, MCQData, FlashcardData, DrawingData } from '../../CreatorContext';
import { PHASE_STYLES, normalizePhase } from './phaseTheme';
import { cn } from '@/lib/utils';
import { Pencil, GripHorizontal, X, CheckCircle2, ImageOff, Volume2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type ViewMode = 'student' | 'teacher';

interface Props {
  slide: PPPSlide;
  onChange: (patch: Partial<PPPSlide>) => void;
}

const VIEW_KEY: Record<ViewMode, string> = { student: '👁️ Student View', teacher: '🎓 Teacher View' };

// Shared font stack — clean, rounded, Duolingo-like.
const FONT_STACK = "font-['Nunito',_'Quicksand',_'Varela_Round',_sans-serif]";

// Foreground image URL (rendered as <img>, never as background).
function imageUrlFor(slide: PPPSlide): string | null {
  if (slide.custom_image_url) return slide.custom_image_url;
  const kw = (slide.visual_keyword || '').trim();
  if (!kw) return null;
  const tags = encodeURIComponent(kw.split(/\s+/).filter(Boolean).join(',') + ',illustration');
  return `https://loremflickr.com/600/400/${tags}`;
}

// ---------- Foreground media: video preferred, then image ----------

const SlideMedia: React.FC<{ slide: PPPSlide }> = ({ slide }) => {
  const [errored, setErrored] = useState(false);

  if (slide.custom_video_url && !errored) {
    return (
      <video
        key={slide.custom_video_url}
        src={slide.custom_video_url}
        autoPlay
        loop
        muted
        playsInline
        onError={() => setErrored(true)}
        className="mx-auto rounded-2xl shadow-md object-cover w-full max-w-sm h-48 sm:h-56 bg-slate-100"
      />
    );
  }

  const url = imageUrlFor(slide);
  if (!url || errored) return null;
  return (
    <img
      src={url}
      alt={slide.visual_keyword || slide.title || 'Slide visual'}
      onError={() => setErrored(true)}
      className="mx-auto rounded-2xl shadow-md object-cover w-full max-w-sm h-48 sm:h-56 bg-slate-100"
      loading="lazy"
    />
  );
};

// ---------- Play Sound button (ElevenLabs via generate-speech edge function) ----------

const PlaySoundButton: React.FC<{ slide: PPPSlide }> = ({ slide }) => {
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const text = (slide.elevenlabs_script || slide.content || slide.title || '').trim();
  if (!text) return null;

  const handlePlay = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('generate-speech', {
        body: { text },
      });
      if (error) throw error;

      // The function returns binary audio/mpeg; supabase.functions.invoke gives us a Blob.
      const blob = data instanceof Blob ? data : new Blob([data as ArrayBuffer], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => URL.revokeObjectURL(url);
      await audio.play();
    } catch (err) {
      console.error('Play sound error:', err);
      toast.error('Could not play audio. Check ElevenLabs API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handlePlay}
      disabled={loading}
      className={cn(
        'inline-flex items-center gap-2 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900',
        'px-4 py-2 text-sm font-extrabold border-2 border-b-4 border-amber-300 border-b-amber-500',
        'transition-all hover:-translate-y-0.5 active:translate-y-1 active:border-b-2 disabled:opacity-60',
      )}
      title={text}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
      Play Sound
    </button>
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

// ---------- Bouncy 3D button (Duolingo-style) ----------

// Each option uses a flat pastel surface with a darker bottom border for depth.
const MCQ_OPTION_PALETTE = [
  { face: 'bg-white text-slate-800', border: 'border-slate-300', bottom: 'border-b-slate-400' },
  { face: 'bg-sky-50 text-sky-900', border: 'border-sky-300', bottom: 'border-b-sky-500' },
  { face: 'bg-amber-50 text-amber-900', border: 'border-amber-300', bottom: 'border-b-amber-500' },
  { face: 'bg-emerald-50 text-emerald-900', border: 'border-emerald-300', bottom: 'border-b-emerald-500' },
  { face: 'bg-pink-50 text-pink-900', border: 'border-pink-300', bottom: 'border-b-pink-500' },
  { face: 'bg-violet-50 text-violet-900', border: 'border-violet-300', bottom: 'border-b-violet-500' },
];

const bouncyBtn =
  'w-full rounded-2xl border-2 border-b-4 px-4 py-4 font-extrabold text-base sm:text-lg transition-all ' +
  'hover:-translate-y-0.5 active:translate-y-1 active:border-b-2 select-none';

// ---------- interactive renderers ----------

const MCQBlock: React.FC<{ slide: PPPSlide; mode: ViewMode }> = ({ slide, mode }) => {
  const data = asMCQ(slide);
  return (
    <div className={cn('space-y-5', FONT_STACK)}>
      {data.question && (
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 text-center leading-snug">
          {data.question}
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {data.options.map((opt, i) => {
          const palette = MCQ_OPTION_PALETTE[i % MCQ_OPTION_PALETTE.length];
          const isCorrect = i === data.correct_index;
          const showCorrect = mode === 'teacher' && isCorrect;
          return (
            <button
              key={i}
              type="button"
              className={cn(
                bouncyBtn,
                palette.face,
                palette.border,
                palette.bottom,
                showCorrect && 'ring-4 ring-emerald-400 ring-offset-2',
              )}
            >
              <span className="flex items-center gap-3">
                <span className="h-7 w-7 rounded-lg bg-white border-2 border-current/20 grid place-items-center text-sm font-extrabold shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1 text-left">
                  {opt || <em className="opacity-50 font-normal">empty</em>}
                </span>
                {showCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />}
              </span>
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
    <div className={cn('flex flex-col items-center gap-4', FONT_STACK)}>
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
          <div className="absolute inset-0 backface-hidden rounded-3xl bg-white border-2 border-b-4 border-slate-300 border-b-slate-400 shadow-md flex items-center justify-center p-6">
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 text-center">
              {front || <em className="opacity-50 font-normal">front</em>}
            </span>
          </div>
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl bg-sky-50 border-2 border-b-4 border-sky-300 border-b-sky-500 shadow-md flex items-center justify-center p-6">
            <span className="text-2xl sm:text-3xl font-bold text-sky-900 text-center leading-snug">
              {back || <em className="opacity-50 font-normal">back</em>}
            </span>
          </div>
        </div>
      </button>
      <span className="text-xs uppercase tracking-widest font-bold text-slate-500">
        {mode === 'teacher' ? 'Teacher view: showing back' : flipped ? '↻ Tap to flip back' : '✨ Tap to flip!'}
      </span>
    </div>
  );
};

const DrawingBlock: React.FC<{ slide: PPPSlide }> = ({ slide }) => {
  const { prompt } = asDrawing(slide);
  return (
    <div className={cn('space-y-4', FONT_STACK)}>
      {prompt && (
        <p className="text-lg sm:text-xl font-bold text-slate-800 text-center leading-snug">
          {prompt}
        </p>
      )}
      <div className="rounded-3xl bg-slate-50 border-2 border-dashed border-slate-300 p-6 sm:p-8 flex flex-col items-center justify-center gap-2 min-h-[180px]">
        <Pencil className="h-10 w-10 text-slate-400" />
        <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Drawing Canvas</p>
        <p className="text-xs text-slate-400">Students draw their answer here</p>
      </div>
    </div>
  );
};

const TextBlock: React.FC<{ slide: PPPSlide }> = ({ slide }) => {
  if (!slide.content) {
    return (
      <p className={cn('text-base sm:text-lg text-slate-400 italic text-center', FONT_STACK)}>
        Add a friendly sentence in the right panel…
      </p>
    );
  }
  return (
    <p className={cn('text-lg sm:text-xl font-semibold text-slate-700 text-center leading-relaxed whitespace-pre-wrap', FONT_STACK)}>
      {slide.content}
    </p>
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
      return <TextBlock slide={slide} />;
  }
};

// ---------- title field ----------

const TitleField: React.FC<{ slide: PPPSlide; onChange: (p: Partial<PPPSlide>) => void }> = ({
  slide,
  onChange,
}) => (
  <input
    type="text"
    value={slide.title ?? ''}
    onChange={(e) => onChange({ title: e.target.value })}
    placeholder="Slide title…"
    className={cn(
      'bg-transparent text-2xl sm:text-3xl font-extrabold tracking-tight outline-none border-0 rounded-md px-1 w-full text-center',
      'text-slate-900 placeholder:text-slate-400 focus:bg-slate-100',
      FONT_STACK,
    )}
  />
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
      className="absolute z-20 w-[320px] rounded-2xl bg-slate-950/90 backdrop-blur-xl text-white border border-white/15 shadow-2xl"
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

  const hasImage = !!(slide.custom_image_url || (slide.visual_keyword || '').trim());

  return (
    <section className="flex-1 min-w-0 h-full overflow-y-auto bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Top bar: phase + dual-view toggle */}
        <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
          <span className={cn('text-[11px] font-bold uppercase tracking-widest px-2 py-1 rounded', style.chip)}>
            {style.label}
          </span>

          <div className="inline-flex items-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-0.5 text-xs font-semibold shadow-sm">
            {(['student', 'teacher'] as ViewMode[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setMode(v)}
                className={cn(
                  'px-3 py-1.5 rounded-full transition',
                  mode === v
                    ? 'bg-slate-900 text-white shadow'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
                )}
              >
                {VIEW_KEY[v]}
              </button>
            ))}
          </div>

          <span className="text-[11px] font-mono text-slate-400 inline-flex items-center gap-1.5">
            {!hasImage && <ImageOff className="h-3 w-3" aria-label="No visual keyword set" />}
            {slide.slide_type ?? 'text_image'}
          </span>
        </div>

        {/* Workspace: clean off-white surface, app screen floats in the middle */}
        <div
          className="relative rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-inner"
          style={{ minHeight: '70vh' }}
        >
          <div className="relative h-full w-full flex items-start sm:items-center justify-center p-6 sm:p-10 overflow-y-auto">
            {/* Centered "Quiz App" container */}
            <div className={cn(
              'w-full max-w-2xl mx-auto bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6',
              FONT_STACK,
            )}>
              <SlideMedia slide={slide} />
              <TitleField slide={slide} onChange={onChange} />
              <InteractiveBlock slide={slide} mode={mode} />
              <div className="flex justify-center pt-2">
                <PlaySoundButton slide={slide} />
              </div>
            </div>
          </div>

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
