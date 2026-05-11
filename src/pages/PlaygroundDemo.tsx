import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Volume2 } from 'lucide-react';
import { usePlaygroundAudio } from '@/hooks/usePlaygroundAudio';
import type { CanvasGameSlide, LivingCanvasSlide, ScaffoldedMediaSlide } from '@/components/creator-studio/shared/canvasSchema';

/**
 * Playground Engine — content-driven, AI-enhanced mini app.
 *
 * Layers:
 *   🎨 Engine (this file): renderer, navigation, branded UI (Tailwind).
 *   🧩 Content: SLIDES JSON below.
 *   🤖 AI services: ElevenLabs voice via usePlaygroundAudio hook.
 */

// ─── Types — upgraded schema ─────────────────────────────────────────────────
export interface SlideVoice { text: string; autoPlay?: boolean }
export interface SlideFeedback { correct?: string; wrong?: string }

export type Slide =
  | { type: 'intro'; title: string; text?: string; image_url?: string; voice?: SlideVoice }
  | {
      type: 'multiple';
      question: string;
      image_url?: string;
      options: string[];
      answer: string;
      voice?: SlideVoice;
      feedback?: SlideFeedback;
    }
  | {
      type: 'truefalse';
      statement: string;
      image_url?: string;
      answer: boolean;
      voice?: SlideVoice;
      feedback?: SlideFeedback;
    }
  | {
      type: 'fill';
      text: string;
      image_url?: string;
      answer: string;
      voice?: SlideVoice;
      feedback?: SlideFeedback;
    }
  | {
      type: 'drag';
      instruction: string;
      word: string;
      image_url: string; // AI-generated cartoon for the target word
      voice?: SlideVoice;
      feedback?: SlideFeedback;
    }
  | {
      type: 'match';
      instruction: string;
      pairs: { word: string; image_url: string }[];
      voice?: SlideVoice;
      feedback?: SlideFeedback;
    }
  | { type: 'draw'; prompt: string; image_url?: string; voice?: SlideVoice }
  | {
      type: 'storybook';
      title?: string;
      topic?: string;
      pages: { page_number: number; text: string; image_url?: string; audio_url?: string; image_prompt?: string }[];
      voice?: SlideVoice;
    }
  | {
      type: 'media_player';
      title?: string;
      media_url: string;
      media_kind: 'youtube' | 'audio' | 'video';
      transcript?: string;
      voice?: SlideVoice;
    }
  | {
      type: 'lesson_summary';
      title?: string;
      vocab_recap: string[];
      grammar_recap?: string;
      takeaway?: string;
      voice?: SlideVoice;
    }
  | {
      type: 'vocab_solo';
      word: string;
      definition?: string;
      image_url?: string;
      audio_url?: string;
      voice?: SlideVoice;
    }
  | {
      type: 'phonics_focus';
      phoneme?: string;
      grapheme?: string;
      sound_ipa?: string;
      label?: string;
      example_words?: string[];
      audio_url?: string;
      example_audio?: Record<string, string>;
      voice?: SlideVoice;
    }
  | (CanvasGameSlide & { voice?: SlideVoice })
  | (LivingCanvasSlide & { voice?: SlideVoice })
  | (ScaffoldedMediaSlide & { voice?: SlideVoice });

// ─── Dynamic lesson content ──────────────────────────────────────────────────
const SLIDES: Slide[] = [
  {
    type: 'intro',
    title: '👋 Hello, friend!',
    text: "Let's play and learn English!",
    voice: { text: "Hello friend! Let's play and learn English!", autoPlay: true },
  },
  {
    type: 'multiple',
    question: 'What is this? 🐶',
    options: ['dog', 'cat', 'apple'],
    answer: 'dog',
    voice: { text: 'What is this?', autoPlay: true },
    feedback: { correct: 'Great job! It is a dog!', wrong: 'Try again!' },
  },
  {
    type: 'truefalse',
    statement: 'This is a cat 🐱',
    answer: true,
    voice: { text: 'This is a cat. True or false?', autoPlay: true },
  },
  {
    type: 'fill',
    text: 'My name is ____',
    answer: 'Alex',
    voice: { text: 'Say: My name is Alex', autoPlay: true },
  },
  {
    type: 'drag',
    instruction: 'Drag the word onto the picture',
    word: 'APPLE',
    image_url: '/playground/placeholder-dropzone.svg',
    voice: { text: 'Drag the word apple onto the picture', autoPlay: true },
  },
  {
    type: 'match',
    instruction: 'Tap a word, then tap its picture',
    pairs: [
      { word: 'DOG', image_url: '/playground/placeholder-dropzone.svg' },
      { word: 'CAT', image_url: '/playground/placeholder-dropzone.svg' },
      { word: 'SUN', image_url: '/playground/placeholder-dropzone.svg' },
      { word: 'STAR', image_url: '/playground/placeholder-dropzone.svg' },
    ],
    voice: { text: 'Match the words to the pictures!', autoPlay: true },
  },
  {
    type: 'draw',
    prompt: 'Draw your favourite animal!',
    voice: { text: 'Draw your favourite animal!', autoPlay: true },
  },
];

// ─── Animations ──────────────────────────────────────────────────────────────
const correctAnim = { scale: [1, 1.08, 1], transition: { duration: 0.4 } };
const wrongAnim = { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } };

function fireConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#FE6A2F', '#FFB703', '#FEFBDD', '#FFD166'],
  });
}

// ─── Voice button ────────────────────────────────────────────────────────────
function VoiceButton({ text }: { text?: string }) {
  const { playVoice, isPlaying } = usePlaygroundAudio();
  if (!text) return null;
  return (
    <button
      onClick={() => playVoice(text)}
      className="absolute top-4 right-4 w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg flex items-center justify-center transition-transform active:scale-95"
      aria-label="Listen"
    >
      <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
    </button>
  );
}

// ─── Auto-play wrapper ───────────────────────────────────────────────────────
function useAutoVoice(voice?: SlideVoice) {
  const { playVoice } = usePlaygroundAudio();
  useEffect(() => {
    if (voice?.autoPlay && voice.text) {
      const t = setTimeout(() => playVoice(voice.text), 350);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voice?.text, voice?.autoPlay]);
}

// ─── Games ───────────────────────────────────────────────────────────────────
export interface PlaygroundLessonContext {
  lessonTitle?: string;
  level?: string;
  unitNumber?: number | string;
  unitTitle?: string;
  lessonNumber?: number | string;
}

function Intro({
  slide,
  lessonContext,
}: {
  slide: Extract<Slide, { type: 'intro' }>;
  lessonContext?: PlaygroundLessonContext;
}) {
  useAutoVoice(slide.voice);

  const ctx = lessonContext || {};
  const headline = ctx.lessonTitle || slide.title;
  const subtitle = slide.text;

  const unitLessonLine = (() => {
    const parts: string[] = [];
    if (ctx.unitNumber != null) parts.push(`Unit ${ctx.unitNumber}`);
    if (ctx.unitTitle) parts.push(ctx.unitTitle);
    if (ctx.lessonNumber != null) parts.push(`Lesson ${ctx.lessonNumber}`);
    return parts.join(' · ');
  })();

  // Playground palette: lime + purple accent on warm cream
  const PRIMARY = '#84CC16';
  const ACCENT = '#A855F7';

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-white grid grid-cols-1 md:grid-cols-2 min-h-[360px] border border-orange-100">
      {/* LEFT — full-bleed image */}
      <div className="relative h-full min-h-[280px] w-full bg-orange-50 overflow-hidden">
        {slide.image_url ? (
          <img
            src={slide.image_url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-7xl"
            style={{
              background: `linear-gradient(135deg, ${PRIMARY}33, ${ACCENT}33)`,
              color: PRIMARY,
            }}
            aria-hidden
          >
            🎨
          </div>
        )}
        <div
          className="absolute bottom-0 left-0 right-0 h-1.5"
          style={{ background: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})` }}
        />
      </div>

      {/* RIGHT — metadata panel */}
      <div
        className="relative h-full w-full px-6 md:px-10 py-8 flex flex-col justify-center"
        style={{
          background: `linear-gradient(180deg, #FFFFFF 0%, ${PRIMARY}0A 100%)`,
        }}
      >
        {/* Logo top-right */}
        <div className="absolute top-4 right-5 flex items-center gap-2">
          <span
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-white font-black text-sm shadow-sm"
            style={{ backgroundColor: PRIMARY }}
            aria-hidden
          >
            E
          </span>
          <span className="text-sm font-extrabold tracking-tight text-slate-800">
            EnglEuphoria
          </span>
        </div>

        <div className="flex flex-col gap-3 max-w-md mt-10 md:mt-0">
          {ctx.level && (
            <span
              className="inline-flex self-start items-center px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-lime-100 text-lime-800"
            >
              {ctx.level}
            </span>
          )}

          {unitLessonLine && (
            <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              {unitLessonLine}
            </p>
          )}

          <h1 className="font-extrabold text-3xl md:text-4xl lg:text-5xl text-orange-600 leading-[1.05] drop-shadow-sm">
            {headline}
          </h1>

          {subtitle && (
            <p className="text-base md:text-lg text-slate-700 font-medium leading-relaxed">
              {subtitle}
            </p>
          )}

          <div
            className="mt-2 h-1 w-20 rounded-full"
            style={{ background: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})` }}
          />
        </div>
      </div>
    </div>
  );
}

function MultipleChoice({ slide }: { slide: Extract<Slide, { type: 'multiple' }> }) {
  // Per project rule: do NOT auto-speak full questions/sentences in Playground.
  // Only the vocabulary word is spoken (on tap of an option).
  const { playCorrect, playWrong } = usePlaygroundAudio();
  const [picked, setPicked] = useState<string | null>(null);
  const correct = picked === slide.answer;

  const handle = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    if (opt === slide.answer) {
      fireConfetti();
      playCorrect(slide.feedback?.correct);
    } else {
      playWrong(slide.feedback?.wrong);
    }
  };

  return (
    <motion.div
      animate={picked ? (correct ? correctAnim : wrongAnim) : undefined}
      className="flex flex-col items-center gap-8 w-full"
    >
      {slide.image_url && (
        <img src={slide.image_url} alt="" className="w-44 h-44 rounded-2xl object-cover shadow-md" />
      )}
      <h2 className="text-4xl font-bold text-slate-800 text-center">{slide.question}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
        {slide.options.map((opt, i) => {
          const isPicked = picked === opt;
          const isAnswer = opt === slide.answer;
          const optImg = (slide as any).option_images?.[i] as string | undefined;
          let cls = 'bg-orange-500 hover:bg-orange-600';
          if (picked && isAnswer) cls = 'bg-green-500';
          else if (isPicked && !isAnswer) cls = 'bg-red-500';
          else if (picked) cls = 'bg-orange-300';
          return (
            <button
              key={opt}
              onClick={() => handle(opt)}
              className={`${cls} text-white font-bold rounded-2xl shadow-md p-4 transition-all active:scale-95 flex flex-col items-center gap-2`}
            >
              {optImg && (
                <img src={optImg} alt={opt} className="w-24 h-24 rounded-xl object-cover bg-white/20" />
              )}
              <span className="text-2xl">{opt}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

function TrueFalse({ slide }: { slide: Extract<Slide, { type: 'truefalse' }> }) {
  useAutoVoice(slide.voice);
  const { playCorrect, playWrong } = usePlaygroundAudio();
  const [picked, setPicked] = useState<boolean | null>(null);
  const correct = picked === slide.answer;

  const handle = (val: boolean) => {
    if (picked !== null) return;
    setPicked(val);
    if (val === slide.answer) { fireConfetti(); playCorrect(slide.feedback?.correct); }
    else playWrong(slide.feedback?.wrong);
  };

  return (
    <motion.div
      animate={picked !== null ? (correct ? correctAnim : wrongAnim) : undefined}
      className="flex flex-col items-center gap-8"
    >
      {slide.image_url && (
        <img src={slide.image_url} alt="" className="w-44 h-44 rounded-2xl object-cover shadow-md" />
      )}
      <h2 className="text-4xl font-bold text-slate-800 text-center">{slide.statement}</h2>
      <div className="flex gap-6">
        <button
          onClick={() => handle(true)}
          className="bg-green-500 hover:bg-green-600 text-white text-2xl font-bold rounded-2xl shadow-md px-12 py-6 active:scale-95 transition"
        >
          ✓ True
        </button>
        <button
          onClick={() => handle(false)}
          className="bg-red-500 hover:bg-red-600 text-white text-2xl font-bold rounded-2xl shadow-md px-12 py-6 active:scale-95 transition"
        >
          ✗ False
        </button>
      </div>
    </motion.div>
  );
}

function FillBlank({ slide }: { slide: Extract<Slide, { type: 'fill' }> }) {
  useAutoVoice(slide.voice);
  const { playCorrect, playWrong } = usePlaygroundAudio();
  const [val, setVal] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const correct = val.trim().toLowerCase() === slide.answer.toLowerCase();
  const [parts] = useState(() => slide.text.split('____'));

  const submit = () => {
    if (!val.trim()) return;
    setSubmitted(true);
    if (correct) { fireConfetti(); playCorrect(); } else playWrong();
  };

  return (
    <motion.div
      animate={submitted ? (correct ? correctAnim : wrongAnim) : undefined}
      className="flex flex-col items-center gap-8"
    >
      {(slide as any).image_url && (
        <img src={(slide as any).image_url} alt="" className="w-44 h-44 rounded-2xl object-cover shadow-md" />
      )}
      <div className="text-4xl font-bold text-slate-800 flex items-center gap-3 flex-wrap justify-center">
        <span>{parts[0]}</span>
        <input
          value={val}
          onChange={(e) => { setVal(e.target.value); setSubmitted(false); }}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          className={`border-b-4 border-orange-500 px-3 py-1 text-center bg-transparent outline-none w-48 text-orange-600 ${submitted ? (correct ? 'border-green-500' : 'border-red-500') : ''}`}
          placeholder="..."
        />
        <span>{parts[1]}</span>
      </div>
      <button
        onClick={submit}
        className="bg-orange-500 hover:bg-orange-600 text-white text-xl font-bold rounded-xl shadow-md px-8 py-3 active:scale-95 transition"
      >
        Check
      </button>
    </motion.div>
  );
}

function DragDrop({ slide }: { slide: Extract<Slide, { type: 'drag' }> }) {
  useAutoVoice(slide.voice);
  const { playCorrect, playWrong } = usePlaygroundAudio();
  const [done, setDone] = useState(false);
  const [wrong, setWrong] = useState(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.getData('text/plain');
    if (dropped === slide.word) {
      setDone(true);
      fireConfetti();
      playCorrect(slide.feedback?.correct);
    } else {
      setWrong(true);
      playWrong(slide.feedback?.wrong);
      setTimeout(() => setWrong(false), 500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <h2 className="text-3xl font-bold text-slate-800 text-center">{slide.instruction}</h2>
      <div className="flex items-center justify-around w-full max-w-3xl gap-8 flex-wrap">
        <motion.div
          animate={wrong ? wrongAnim : done ? correctAnim : undefined}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className={`p-4 rounded-3xl border-4 border-dashed transition flex flex-col items-center justify-center w-56 h-56 ${done ? 'border-green-500 bg-green-50' : 'border-orange-400 bg-orange-50'}`}
        >
          <img
            src={done ? slide.image_url : '/playground/placeholder-dropzone.svg'}
            alt={done ? slide.word : 'Drop here'}
            className="w-40 h-40 object-contain rounded-xl"
          />
          {done && <div className="text-xl font-bold text-green-600 mt-2">{slide.word}</div>}
        </motion.div>
        {!done && (
          <div
            draggable
            onDragStart={(e) => e.dataTransfer.setData('text/plain', slide.word)}
            className="cursor-grab active:cursor-grabbing bg-orange-500 text-white text-3xl font-extrabold rounded-2xl shadow-lg px-8 py-6 select-none flex flex-col items-center gap-2"
          >
            <img src={slide.image_url} alt="" className="w-20 h-20 object-cover rounded-lg shadow-sm bg-white/30 p-1" />
            <span>{slide.word}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function MatchGame({ slide }: { slide: Extract<Slide, { type: 'match' }> }) {
  useAutoVoice(slide.voice);
  const { playCorrect, playWrong } = usePlaygroundAudio();
  const matches = useMemo(() => [...slide.pairs].sort(() => Math.random() - 0.5), [slide.pairs]);
  const [selWord, setSelWord] = useState<string | null>(null);
  const [solved, setSolved] = useState<Record<string, true>>({});
  const [shake, setShake] = useState(false);

  const tryPair = (word: string, imageUrl: string) => {
    const correct = slide.pairs.some((p) => p.word === word && p.image_url === imageUrl);
    if (correct) {
      setSolved((s) => ({ ...s, [word]: true }));
      fireConfetti();
      playCorrect();
    } else {
      setShake(true);
      playWrong();
      setTimeout(() => setShake(false), 400);
    }
    setSelWord(null);
  };

  return (
    <motion.div animate={shake ? wrongAnim : undefined} className="flex flex-col items-center gap-6 w-full">
      <h2 className="text-3xl font-bold text-slate-800 text-center">{slide.instruction}</h2>
      <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
        <div className="flex flex-col gap-3">
          {slide.pairs.map((p) => (
            <button
              key={p.word}
              disabled={!!solved[p.word]}
              onClick={() => setSelWord(p.word)}
              className={`text-2xl font-bold rounded-xl shadow-md py-4 transition active:scale-95 ${
                solved[p.word] ? 'bg-green-500 text-white' :
                selWord === p.word ? 'bg-yellow-400 text-slate-900 ring-4 ring-orange-500' :
                'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {p.word}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {matches.map((p) => {
            const used = !!solved[p.word];
            return (
              <button
                key={p.image_url + p.word}
                disabled={used || !selWord}
                onClick={() => selWord && tryPair(selWord, p.image_url)}
                className={`rounded-xl shadow-md p-2 transition active:scale-95 flex items-center justify-center ${
                  used ? 'bg-green-100 opacity-50' : 'bg-yellow-200 hover:bg-yellow-300'
                }`}
              >
                <img
                  src={p.image_url}
                  alt={p.word}
                  className="rounded-lg shadow-sm h-24 w-24 object-cover bg-white"
                />
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function DrawGame({ slide }: { slide: Extract<Slide, { type: 'draw' }> }) {
  useAutoVoice(slide.voice);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#FE6A2F';
  }, []);

  const pos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const t = 'touches' in e ? e.touches[0] : (e as React.MouseEvent);
    return {
      x: ((t.clientX - rect.left) / rect.width) * canvas.width,
      y: ((t.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    drawing.current = true;
    last.current = pos(e);
  };
  const move = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !last.current) return;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };
  const end = () => { drawing.current = false; last.current = null; };

  const clear = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && canvasRef.current) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <h2 className="text-3xl font-bold text-slate-800 text-center">{slide.prompt}</h2>
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
        onTouchStart={start} onTouchMove={move} onTouchEnd={end}
        className="bg-white border-4 border-orange-400 rounded-2xl shadow-md cursor-crosshair touch-none w-full max-w-3xl"
        style={{ aspectRatio: '2 / 1' }}
      />
      <button
        onClick={clear}
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl px-6 py-2 shadow-md active:scale-95 transition"
      >
        Clear
      </button>
    </div>
  );
}

// ─── Renderer ────────────────────────────────────────────────────────────────
import { StorybookRenderer } from '@/components/creator-studio/shared/StorybookRenderer';
import { MediaPlayerRenderer } from '@/components/creator-studio/shared/MediaPlayerRenderer';
import { LivingCanvas } from '@/components/creator-studio/shared/LivingCanvas';
import { ScaffoldedPlayer } from '@/components/creator-studio/shared/ScaffoldedPlayer';
import { VisualFlashcard } from '@/components/creator-studio/shared/VisualFlashcard';
import { PhonicsFocusCard } from '@/components/creator-studio/shared/PhonicsFocusCard';

export function SlideRenderer({ slide, onStorybookComplete, onCanvasSolved, onMediaPassed, lessonContext }: {
  slide: Slide;
  onStorybookComplete?: () => void;
  onCanvasSolved?: () => void;
  onMediaPassed?: () => void;
  lessonContext?: PlaygroundLessonContext;
}) {
  switch (slide.type) {
    case 'intro': return <Intro slide={slide} lessonContext={lessonContext} />;
    case 'multiple': return <MultipleChoice slide={slide} />;
    case 'truefalse': return <TrueFalse slide={slide} />;
    case 'fill': return <FillBlank slide={slide} />;
    case 'drag': return <DragDrop slide={slide} />;
    case 'match': return <MatchGame slide={slide} />;
    case 'draw': return <DrawGame slide={slide} />;
    case 'storybook': return <StorybookRenderer slide={slide as any} hub="playground" onComplete={onStorybookComplete} />;
    case 'media_player': return <MediaPlayerRenderer slide={slide as any} hub="playground" />;
    case 'canvas_game':
    case 'living_canvas':
      return <LivingCanvas slide={slide as any} hub="playground" onAllSolved={onCanvasSolved} />;
    case 'scaffolded_media':
      return <ScaffoldedPlayer slide={slide as any} hub="playground" onAllSegmentsPassed={onMediaPassed} />;
    case 'vocab_solo':
      return <VisualFlashcard slide={slide as any} hub="playground" />;
    case 'phonics_focus':
      return <PhonicsFocusCard slide={slide as any} hub="playground" />;
    case 'lesson_summary': return <PlaygroundSummary slide={slide} />;
  }
}

function PlaygroundSummary({ slide }: { slide: Extract<Slide, { type: 'lesson_summary' }> }) {
  useEffect(() => {
    const t = setTimeout(() => {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }, 200);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="flex flex-col items-center text-center gap-6 w-full">
      <div className="text-8xl">🏆</div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600">{slide.title || 'Level Complete!'}</h1>
      {slide.vocab_recap?.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
          {slide.vocab_recap.slice(0, 5).map((w, i) => (
            <span
              key={w}
              className="px-5 py-2.5 rounded-full text-lg font-extrabold text-white shadow-lg"
              style={{ background: ['#FE6A2F', '#F59E0B', '#10B981', '#3B82F6', '#A855F7'][i % 5] }}
            >
              {w}
            </span>
          ))}
        </div>
      )}
      {slide.takeaway && <p className="text-xl text-slate-700 font-bold">{slide.takeaway}</p>}
      <div className="text-3xl font-extrabold text-amber-600">Great job! 🎉</div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function PlaygroundDemo() {
  const [i, setI] = useState(0);
  const [storybookDone, setStorybookDone] = useState<Record<number, boolean>>({});
  const [canvasDone, setCanvasDone] = useState<Record<number, boolean>>({});
  const [mediaDone, setMediaDone] = useState<Record<number, boolean>>({});
  const slide = SLIDES[i];
  const isStorybook = slide.type === 'storybook';
  const isCanvas = slide.type === 'canvas_game' || slide.type === 'living_canvas';
  const isScaffMedia = slide.type === 'scaffolded_media';
  const nextDisabled =
    i === SLIDES.length - 1 ||
    (isStorybook && !storybookDone[i]) ||
    (isCanvas && !canvasDone[i]) ||
    (isScaffMedia && !mediaDone[i]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 p-6 bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-200">
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="relative bg-white rounded-3xl shadow-xl w-[95%] max-w-5xl min-h-[70vh] p-10 flex items-center justify-center"
        >
          <VoiceButton text={slide.voice?.text} />
          <SlideRenderer
            slide={slide}
            onStorybookComplete={() => setStorybookDone((s) => ({ ...s, [i]: true }))}
            onCanvasSolved={() => setCanvasDone((s) => ({ ...s, [i]: true }))}
            onMediaPassed={() => setMediaDone((s) => ({ ...s, [i]: true }))}
          />
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center gap-4 bg-white rounded-full shadow-lg px-6 py-3">
        <button
          onClick={() => setI((n) => Math.max(0, n - 1))}
          disabled={i === 0}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-bold rounded-full px-5 py-2 active:scale-95 transition"
        >
          ← Back
        </button>
        <span className="font-bold text-orange-600 text-lg">
          {i + 1} / {SLIDES.length}
        </span>
        <button
          onClick={() => setI((n) => Math.min(SLIDES.length - 1, n + 1))}
          disabled={nextDisabled}
          title={
            isStorybook && !storybookDone[i] ? 'Read all storybook pages first'
            : isCanvas && !canvasDone[i] ? 'Finish the activity first'
            : isScaffMedia && !mediaDone[i] ? 'Pass every checkpoint first'
            : undefined
          }
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-bold rounded-full px-5 py-2 active:scale-95 transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
