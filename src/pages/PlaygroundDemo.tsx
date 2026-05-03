import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Volume2 } from 'lucide-react';
import { usePlaygroundAudio } from '@/hooks/usePlaygroundAudio';

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
  | { type: 'intro'; title: string; text?: string; voice?: SlideVoice }
  | {
      type: 'multiple';
      question: string;
      image?: string;
      options: string[];
      answer: string;
      voice?: SlideVoice;
      feedback?: SlideFeedback;
    }
  | {
      type: 'truefalse';
      statement: string;
      answer: boolean;
      voice?: SlideVoice;
      feedback?: SlideFeedback;
    }
  | {
      type: 'fill';
      text: string;
      answer: string;
      voice?: SlideVoice;
      feedback?: SlideFeedback;
    }
  | {
      type: 'drag';
      instruction: string;
      word: string;
      target: string; // emoji or image url
      voice?: SlideVoice;
      feedback?: SlideFeedback;
    }
  | {
      type: 'match';
      instruction: string;
      pairs: { word: string; match: string }[];
      voice?: SlideVoice;
      feedback?: SlideFeedback;
    }
  | { type: 'draw'; prompt: string; voice?: SlideVoice };

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
    target: '🍎',
    voice: { text: 'Drag the word apple onto the picture', autoPlay: true },
  },
  {
    type: 'match',
    instruction: 'Tap a word, then tap its picture',
    pairs: [
      { word: 'DOG', match: '🐶' },
      { word: 'CAT', match: '🐱' },
      { word: 'SUN', match: '☀️' },
      { word: 'STAR', match: '⭐' },
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
function Intro({ slide }: { slide: Extract<Slide, { type: 'intro' }> }) {
  useAutoVoice(slide.voice);
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h1 className="text-6xl md:text-7xl font-extrabold text-orange-600 drop-shadow-sm">
        {slide.title}
      </h1>
      {slide.text && <p className="text-2xl text-slate-700">{slide.text}</p>}
    </div>
  );
}

function MultipleChoice({ slide }: { slide: Extract<Slide, { type: 'multiple' }> }) {
  useAutoVoice(slide.voice);
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
      <h2 className="text-4xl font-bold text-slate-800 text-center">{slide.question}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
        {slide.options.map((opt) => {
          const isPicked = picked === opt;
          const isAnswer = opt === slide.answer;
          let cls = 'bg-orange-500 hover:bg-orange-600';
          if (picked && isAnswer) cls = 'bg-green-500';
          else if (isPicked && !isAnswer) cls = 'bg-red-500';
          else if (picked) cls = 'bg-orange-300';
          return (
            <button
              key={opt}
              onClick={() => handle(opt)}
              className={`${cls} text-white text-2xl font-bold rounded-2xl shadow-md p-6 transition-all active:scale-95`}
            >
              {opt}
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
      <div className="flex items-center justify-around w-full max-w-3xl gap-8">
        <motion.div
          animate={wrong ? wrongAnim : done ? correctAnim : undefined}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className={`text-9xl p-8 rounded-3xl border-4 border-dashed transition ${done ? 'border-green-500 bg-green-50' : 'border-orange-400 bg-orange-50'}`}
        >
          {slide.target}
          {done && <div className="text-2xl font-bold text-green-600 mt-2">{slide.word}</div>}
        </motion.div>
        {!done && (
          <div
            draggable
            onDragStart={(e) => e.dataTransfer.setData('text/plain', slide.word)}
            className="cursor-grab active:cursor-grabbing bg-orange-500 text-white text-3xl font-extrabold rounded-2xl shadow-lg px-8 py-6 select-none"
          >
            {slide.word}
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

  const tryPair = (word: string, match: string) => {
    const correct = slide.pairs.some((p) => p.word === word && p.match === match);
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
                key={p.match}
                disabled={used || !selWord}
                onClick={() => selWord && tryPair(selWord, p.match)}
                className={`text-4xl rounded-xl shadow-md py-4 transition active:scale-95 ${
                  used ? 'bg-green-100 opacity-50' : 'bg-yellow-200 hover:bg-yellow-300'
                }`}
              >
                {p.match}
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
function SlideRenderer({ slide }: { slide: Slide }) {
  switch (slide.type) {
    case 'intro': return <Intro slide={slide} />;
    case 'multiple': return <MultipleChoice slide={slide} />;
    case 'truefalse': return <TrueFalse slide={slide} />;
    case 'fill': return <FillBlank slide={slide} />;
    case 'drag': return <DragDrop slide={slide} />;
    case 'match': return <MatchGame slide={slide} />;
    case 'draw': return <DrawGame slide={slide} />;
  }
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function PlaygroundDemo() {
  const [i, setI] = useState(0);
  const slide = SLIDES[i];

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
          <SlideRenderer slide={slide} />
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
          disabled={i === SLIDES.length - 1}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-bold rounded-full px-5 py-2 active:scale-95 transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
