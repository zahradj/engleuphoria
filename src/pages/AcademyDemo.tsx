import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Loader2, ChevronLeft, ChevronRight, Sun, Moon, Check, X } from 'lucide-react';
import { useAcademyAudio } from '@/hooks/useAcademyAudio';

/**
 * Academy Engine — teen-focused (12–17, A1–B1), 60-minute, 7-block lesson system.
 *
 * Strict design constraints:
 *  - Mature, sleek, dark-mode-first. Indigo/Purple identity.
 *  - No childish bubbles, no confetti, no bouncy animations.
 *  - Audio is RESTRAINED: only on vocab / reading_passage / listening slides,
 *    and never auto-plays.
 *  - Every slide has one goal.
 *
 * Edit the SLIDES array below to swap the lesson — the engine is content-driven.
 */

// ─── Schema ──────────────────────────────────────────────────────────────────
export type Block = 'warmup' | 'vocab' | 'reading' | 'grammar' | 'practice' | 'interactive' | 'speaking';

export const BLOCKS: { id: Block; label: string }[] = [
  { id: 'warmup', label: 'Warm-up' },
  { id: 'vocab', label: 'Vocab' },
  { id: 'reading', label: 'Reading' },
  { id: 'grammar', label: 'Grammar' },
  { id: 'practice', label: 'Practice' },
  { id: 'interactive', label: 'Interactive' },
  { id: 'speaking', label: 'Speaking' },
];

/**
 * ClusterActivity — one mini-task inside a `cluster` slide.
 * Allows 3–6 related exercises to live on a single slide so a slide acts like
 * a focused, dense practice page rather than a single-question card.
 */
export type ClusterActivity =
  | { type: 'mcq'; question: string; options: string[]; answer: string; explanation?: string }
  | { type: 'fill'; text: string; answer: string; explanation?: string }
  | { type: 'tf'; statement: string; answer: boolean; explanation?: string }
  | { type: 'build'; prompt?: string; words: string[]; answer: string[] };

export type Slide =
  | { type: 'intro'; block: Block; title: string; subtitle?: string }
  | { type: 'question'; block: Block; prompt: string; placeholder?: string }
  | { type: 'poll'; block: Block; prompt: string; options: { label: string; pct: number }[] }
  | { type: 'opinion'; block: Block; prompt: string }
  | { type: 'vocab'; block: Block; word: string; definition: string; example?: string }
  | { type: 'matching'; block: Block; prompt: string; pairs: { left: string; right: string }[] }
  | { type: 'reading_passage'; block: Block; title: string; passage: string }
  | { type: 'listening'; block: Block; prompt: string; transcript: string }
  | { type: 'truefalse'; block: Block; statement: string; answer: boolean }
  | { type: 'multiple'; block: Block; question: string; options: string[]; answer: string }
  | { type: 'grammar_pattern'; block: Block; title: string; rows: { a: string; b: string }[]; rule?: string }
  | { type: 'error_detection'; block: Block; prompt: string; sentence: string; wrongIndex: number }
  | { type: 'correction'; block: Block; prompt: string; wrong: string; answer: string }
  | { type: 'fill_blank'; block: Block; prompt: string; before: string; after: string; answer: string }
  | { type: 'sentence_builder'; block: Block; prompt: string; words: string[]; answer: string[] }
  | { type: 'debate_scale'; block: Block; prompt: string }
  | { type: 'role_play'; block: Block; title: string; lineA: string; lineB: string }
  | { type: 'speaking_task'; block: Block; prompt: string; starters?: string[] }
  | { type: 'reflection'; block: Block; prompt: string }
  | { type: 'cluster'; block: Block; title: string; content?: string; activities: ClusterActivity[] };

// ─── Lesson content (edit only this) ─────────────────────────────────────────
// Topic: "How much time do you spend on your phone?" — A2 level, 36 slides.
const SLIDES: Slide[] = [
  // BLOCK 1 — Warm-up (1–3)
  { type: 'intro', block: 'warmup', title: 'Phones & You', subtitle: 'A2 · 60 min · Talk about daily phone habits' },
  { type: 'question', block: 'warmup', prompt: 'Do you use your phone every day?', placeholder: 'Yes, I…' },
  { type: 'poll', block: 'warmup', prompt: 'How many hours a day are you on your phone?', options: [
    { label: '1–2 hours', pct: 22 },
    { label: '3–5 hours', pct: 48 },
    { label: '5+ hours', pct: 30 },
  ]},

  // BLOCK 2 — Vocabulary (4–8)
  { type: 'vocab', block: 'vocab', word: 'scroll', definition: 'to move your finger up or down on a screen', example: 'I scroll through TikTok before bed.' },
  { type: 'vocab', block: 'vocab', word: 'post', definition: 'to share something online', example: 'She posts a photo every weekend.' },
  { type: 'vocab', block: 'vocab', word: 'spend time', definition: 'to use time on something', example: 'I spend time on YouTube every day.' },
  { type: 'matching', block: 'vocab', prompt: 'Match each word to its meaning.', pairs: [
    { left: 'scroll', right: 'move your finger on a screen' },
    { left: 'post', right: 'share something online' },
    { left: 'spend', right: 'use time' },
  ]},
  { type: 'multiple', block: 'vocab', question: 'What does “post” mean?', options: ['delete a photo', 'share something online', 'turn off your phone'], answer: 'share something online' },

  // BLOCK 3 — Reading + Listening (9–13)
  { type: 'reading_passage', block: 'reading', title: 'Alex’s phone day',
    passage: "Hi, I'm Alex. I spend three hours online every day. I scroll through Instagram in the morning and post photos with my friends after school. I think my phone is useful, but sometimes I use it too much." },
  { type: 'listening', block: 'reading', prompt: 'Listen to Alex describe his evening, then answer.',
    transcript: "In the evening I usually watch videos for one hour. After that I message my friends and then I go to sleep around eleven." },
  { type: 'multiple', block: 'reading', question: 'How many hours does Alex spend online each day?', options: ['One hour', 'Three hours', 'Five hours'], answer: 'Three hours' },
  { type: 'truefalse', block: 'reading', statement: 'Alex thinks he sometimes uses his phone too much.', answer: true },
  { type: 'opinion', block: 'reading', prompt: 'Is Alex’s habit healthy? Why or why not?' },

  // BLOCK 4 — Grammar (14–18)
  { type: 'grammar_pattern', block: 'grammar', title: 'Present simple — verb + s', rows: [
    { a: 'I use my phone.', b: 'He uses his phone.' },
    { a: 'You scroll a lot.', b: 'She scrolls a lot.' },
    { a: 'We post photos.', b: 'It posts updates.' },
  ], rule: 'For he / she / it, add -s to the verb.' },
  { type: 'intro', block: 'grammar', title: 'The Rule', subtitle: 'Add -s to the verb when the subject is he, she, or it.' },
  { type: 'multiple', block: 'grammar', question: 'Which sentence is correct?', options: ['She use Instagram every day.', 'She uses Instagram every day.', 'She using Instagram every day.'], answer: 'She uses Instagram every day.' },
  { type: 'error_detection', block: 'grammar', prompt: 'Tap the word with the mistake.', sentence: 'He use TikTok every night.', wrongIndex: 1 },
  { type: 'correction', block: 'grammar', prompt: 'Fix the sentence.', wrong: 'My sister post photos every day.', answer: 'My sister posts photos every day.' },

  // BLOCK 5 — Controlled Practice (19–24)
  // 🆕 Cluster slide: 4 related micro-tasks on a single page (faster, denser, smarter).
  { type: 'cluster', block: 'practice', title: 'Present Simple — Quick Drill',
    content: 'He uses Instagram. She posts photos. Apply the rule four ways below.',
    activities: [
      { type: 'mcq', question: 'She ___ every day.', options: ['use', 'uses', 'using'], answer: 'uses', explanation: "Use 'uses' for she/he/it." },
      { type: 'fill', text: 'He ___ (use) his phone.', answer: 'uses' },
      { type: 'tf', statement: 'He use TikTok.', answer: false, explanation: "Should be 'He uses TikTok.'" },
      { type: 'build', prompt: 'Build the sentence.', words: ['I', 'use', 'my', 'phone'], answer: ['I', 'use', 'my', 'phone'] },
    ],
  },
  { type: 'fill_blank', block: 'practice', prompt: 'Complete with the correct verb form.', before: 'He', after: '(use) his phone too much.', answer: 'uses' },
  { type: 'multiple', block: 'practice', question: 'She ___ Instagram every day.', options: ['use', 'uses', 'using'], answer: 'uses' },
  { type: 'sentence_builder', block: 'practice', prompt: 'Build the sentence.', words: ['phone', 'I', 'my', 'use'], answer: ['I', 'use', 'my', 'phone'] },
  { type: 'sentence_builder', block: 'practice', prompt: 'Put the words in order.', words: ['posts', 'photos', 'She', 'often'], answer: ['She', 'often', 'posts', 'photos'] },
  { type: 'matching', block: 'practice', prompt: 'Match the subject to the correct verb form.', pairs: [
    { left: 'I', right: 'use' },
    { left: 'She', right: 'uses' },
    { left: 'They', right: 'use' },
    { left: 'He', right: 'uses' },
  ]},
  { type: 'truefalse', block: 'practice', statement: '“He scroll every night.” is correct.', answer: false },

  // BLOCK 6 — Interactive (25–32)
  { type: 'debate_scale', block: 'interactive', prompt: 'Phones are good for students.' },
  { type: 'speaking_task', block: 'interactive', prompt: 'Speed challenge — 10 seconds. Say one sentence using “use”.' },
  { type: 'role_play', block: 'interactive', title: 'Role play — meeting a classmate',
    lineA: 'Hi! How much time do you spend on your phone?',
    lineB: 'I spend about ____ hours a day. And you?' },
  { type: 'speaking_task', block: 'interactive', prompt: 'You meet a new friend online. Introduce yourself in 3 sentences.', starters: ['Hi, my name is…', 'I spend…', 'I like to…'] },
  { type: 'question', block: 'interactive', prompt: 'Guess the word: “I use this every day to talk to my friends.”', placeholder: 'It is a…' },
  { type: 'error_detection', block: 'interactive', prompt: 'Find the mistake.', sentence: 'My brother spend hours on YouTube.', wrongIndex: 2 },
  { type: 'debate_scale', block: 'interactive', prompt: 'Social media makes me happy.' },
  { type: 'speaking_task', block: 'interactive', prompt: 'Mini challenge — say two sentences about your own phone habits.' },

  // BLOCK 7 — Speaking Output (33–36)
  { type: 'speaking_task', block: 'speaking', prompt: 'Talk for 60 seconds about how you use your phone.', starters: ['I use…', 'I spend…', 'I usually…'] },
  { type: 'speaking_task', block: 'speaking', prompt: 'Now describe a friend’s phone habits.', starters: ['My friend uses…', 'They post…'] },
  { type: 'speaking_task', block: 'speaking', prompt: 'Free speaking — no support. Tell us about your perfect day without a phone.' },
  { type: 'reflection', block: 'speaking', prompt: 'How did this lesson feel? Easy, challenging, or just right?' },
];

// ─── Theme ───────────────────────────────────────────────────────────────────
export type Theme = 'dark' | 'light';

export interface ThemeTokens {
  bg: string;
  card: string;
  text: string;
  muted: string;
  chip: string;
  inputBg: string;
  btnGhost: string;
}

export const themeMap: Record<'dark' | 'light', ThemeTokens> = {
  dark: {
    bg: 'bg-slate-950',
    card: 'bg-slate-900 border-slate-800',
    text: 'text-slate-100',
    muted: 'text-slate-400',
    chip: 'bg-slate-800 text-slate-300',
    inputBg: 'bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500',
    btnGhost: 'border border-slate-700 text-slate-200 hover:border-indigo-500 hover:text-indigo-300',
  },
  light: {
    bg: 'bg-slate-50',
    card: 'bg-white border-slate-200',
    text: 'text-slate-900',
    muted: 'text-slate-500',
    chip: 'bg-slate-100 text-slate-700',
    inputBg: 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400',
    btnGhost: 'border border-slate-300 text-slate-700 hover:border-indigo-500 hover:text-indigo-600',
  },
};

// ─── Audio button (shared by vocab / reading / listening) ────────────────────
function ListenButton({ text, label = 'Listen', variant = 'pill' }: { text: string; label?: string; variant?: 'pill' | 'block' }) {
  const { playVoice, isPlaying, isLoading } = useAcademyAudio();
  const base = 'inline-flex items-center gap-2 font-medium rounded-md transition focus:outline-none focus:ring-2 focus:ring-indigo-500';
  const sizes = variant === 'block'
    ? 'px-5 py-3 text-base bg-indigo-600 hover:bg-indigo-500 text-white'
    : 'px-3 py-1.5 text-sm bg-indigo-600/90 hover:bg-indigo-500 text-white';
  return (
    <button onClick={() => playVoice(text)} className={`${base} ${sizes}`} aria-label={label}>
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />}
      <span>{isPlaying ? 'Playing…' : label}</span>
    </button>
  );
}

// ─── Slide components ───────────────────────────────────────────────────────
function Intro({ slide, t }: { slide: Extract<Slide, { type: 'intro' }>; t: ThemeTokens }) {
  return (
    <div className="space-y-4">
      <div className={`text-xs uppercase tracking-widest ${t.muted}`}>{slide.block}</div>
      <h1 className={`text-3xl md:text-5xl font-semibold ${t.text}`}>{slide.title}</h1>
      {slide.subtitle && <p className={`text-lg ${t.muted}`}>{slide.subtitle}</p>}
    </div>
  );
}

function QuestionSlide({ slide, t }: { slide: Extract<Slide, { type: 'question' }>; t: ThemeTokens }) {
  const [val, setVal] = useState('');
  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className={`text-2xl md:text-3xl font-semibold ${t.text}`}>{slide.prompt}</h2>
      <textarea
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder={slide.placeholder ?? 'Type your answer…'}
        className={`w-full min-h-[120px] rounded-md border px-4 py-3 text-base outline-none focus:border-indigo-500 ${t.inputBg}`}
      />
    </div>
  );
}

function PollSlide({ slide, t }: { slide: Extract<Slide, { type: 'poll' }>; t: ThemeTokens }) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="space-y-6 max-w-2xl w-full">
      <h2 className={`text-2xl md:text-3xl font-semibold ${t.text}`}>{slide.prompt}</h2>
      <div className="space-y-3">
        {slide.options.map((opt, i) => {
          const active = picked === i;
          const showResults = picked !== null;
          return (
            <button
              key={opt.label}
              onClick={() => setPicked(i)}
              className={`relative w-full text-left rounded-md border overflow-hidden transition ${active ? 'border-indigo-500' : 'border-slate-700 hover:border-indigo-500/60'}`}
            >
              {showResults && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${opt.pct}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`absolute inset-y-0 left-0 ${active ? 'bg-indigo-600/40' : 'bg-slate-800'}`}
                />
              )}
              <div className="relative flex justify-between items-center px-4 py-3">
                <span className={`font-medium ${t.text}`}>{opt.label}</span>
                {showResults && <span className={`text-sm ${t.muted}`}>{opt.pct}%</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function OpinionSlide({ slide, t }: { slide: Extract<Slide, { type: 'opinion' }>; t: ThemeTokens }) {
  const [picked, setPicked] = useState<string | null>(null);
  const opts = ['Agree', 'Not sure', 'Disagree'];
  return (
    <div className="space-y-6 max-w-2xl w-full">
      <h2 className={`text-2xl md:text-3xl font-semibold ${t.text}`}>{slide.prompt}</h2>
      <div className="flex flex-wrap gap-3">
        {opts.map((o) => (
          <button
            key={o}
            onClick={() => setPicked(o)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${
              picked === o ? 'bg-indigo-600 text-white' : t.btnGhost
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function VocabSlide({ slide, t }: { slide: Extract<Slide, { type: 'vocab' }>; t: ThemeTokens }) {
  return (
    <div className="space-y-6 max-w-2xl w-full">
      <div className={`text-xs uppercase tracking-widest ${t.muted}`}>Vocabulary</div>
      <div className="flex items-center gap-4 flex-wrap">
        <h2 className={`text-4xl md:text-5xl font-semibold ${t.text}`}>{slide.word}</h2>
        <ListenButton text={slide.word} label="Listen" />
      </div>
      <p className={`text-xl ${t.text}`}>{slide.definition}</p>
      {slide.example && (
        <p className={`text-base italic border-l-2 border-indigo-500 pl-4 ${t.muted}`}>
          “{slide.example}”
        </p>
      )}
    </div>
  );
}

function MatchingSlide({ slide, t }: { slide: Extract<Slide, { type: 'matching' }>; t: ThemeTokens }) {
  const rights = useMemo(() => [...slide.pairs].sort(() => Math.random() - 0.5), [slide.pairs]);
  const [selL, setSelL] = useState<string | null>(null);
  const [solved, setSolved] = useState<Record<string, true>>({});
  const [wrong, setWrong] = useState<string | null>(null);

  const tryPair = (left: string, right: string) => {
    if (slide.pairs.some((p) => p.left === left && p.right === right)) {
      setSolved((s) => ({ ...s, [left]: true }));
    } else {
      setWrong(right);
      setTimeout(() => setWrong(null), 400);
    }
    setSelL(null);
  };

  return (
    <div className="space-y-6 w-full max-w-3xl">
      <h2 className={`text-2xl md:text-3xl font-semibold ${t.text}`}>{slide.prompt}</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          {slide.pairs.map((p) => (
            <button
              key={p.left}
              disabled={!!solved[p.left]}
              onClick={() => setSelL(p.left)}
              className={`w-full text-left px-4 py-3 rounded-md border transition ${
                solved[p.left] ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300' :
                selL === p.left ? 'border-indigo-500 bg-indigo-500/10 text-indigo-200' :
                'border-slate-700 hover:border-indigo-500/60 ' + t.text
              }`}
            >
              {p.left}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {rights.map((p) => {
            const used = !!solved[p.left];
            const isWrong = wrong === p.right;
            return (
              <button
                key={p.right}
                disabled={used || !selL}
                onClick={() => selL && tryPair(selL, p.right)}
                className={`w-full text-left px-4 py-3 rounded-md border transition ${
                  used ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 opacity-60' :
                  isWrong ? 'border-red-500 bg-red-500/10 text-red-300' :
                  'border-slate-700 hover:border-indigo-500/60 ' + t.text
                }`}
              >
                {p.right}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ReadingSlide({ slide, t }: { slide: Extract<Slide, { type: 'reading_passage' }>; t: ThemeTokens }) {
  return (
    <div className="space-y-5 max-w-2xl w-full">
      <div className={`text-xs uppercase tracking-widest ${t.muted}`}>Reading</div>
      <h2 className={`text-2xl md:text-3xl font-semibold ${t.text}`}>{slide.title}</h2>
      <ListenButton text={slide.passage} label="Listen to the passage" variant="block" />
      <p className={`text-lg leading-relaxed ${t.text}`}>{slide.passage}</p>
    </div>
  );
}

function ListeningSlide({ slide, t }: { slide: Extract<Slide, { type: 'listening' }>; t: ThemeTokens }) {
  const [showTranscript, setShowTranscript] = useState(false);
  return (
    <div className="space-y-5 max-w-2xl w-full">
      <div className={`text-xs uppercase tracking-widest ${t.muted}`}>Listening</div>
      <h2 className={`text-2xl md:text-3xl font-semibold ${t.text}`}>{slide.prompt}</h2>
      <ListenButton text={slide.transcript} label="Play audio" variant="block" />
      <button onClick={() => setShowTranscript((s) => !s)} className={`text-sm underline ${t.muted} hover:text-indigo-400`}>
        {showTranscript ? 'Hide transcript' : 'Show transcript'}
      </button>
      {showTranscript && <p className={`italic border-l-2 border-indigo-500 pl-4 ${t.muted}`}>{slide.transcript}</p>}
    </div>
  );
}

function TrueFalseSlide({ slide, t }: { slide: Extract<Slide, { type: 'truefalse' }>; t: ThemeTokens }) {
  const [picked, setPicked] = useState<boolean | null>(null);
  const correct = picked !== null && picked === slide.answer;
  return (
    <div className="space-y-6 max-w-2xl w-full">
      <h2 className={`text-2xl md:text-3xl font-semibold ${t.text}`}>{slide.statement}</h2>
      <div className="flex gap-3">
        {[true, false].map((v) => {
          const active = picked === v;
          const isAnswer = picked !== null && v === slide.answer;
          let cls = t.btnGhost;
          if (active && correct) cls = 'bg-emerald-600 text-white border-emerald-600';
          else if (active && !correct) cls = 'bg-red-600 text-white border-red-600';
          else if (picked !== null && isAnswer) cls = 'border border-emerald-500 text-emerald-300';
          return (
            <button key={String(v)} onClick={() => picked === null && setPicked(v)} className={`px-6 py-2.5 rounded-md font-medium transition ${cls}`}>
              {v ? 'True' : 'False'}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MultipleSlide({ slide, t }: { slide: Extract<Slide, { type: 'multiple' }>; t: ThemeTokens }) {
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div className="space-y-6 max-w-2xl w-full">
      <h2 className={`text-2xl md:text-3xl font-semibold ${t.text}`}>{slide.question}</h2>
      <div className="space-y-2">
        {slide.options.map((opt) => {
          const active = picked === opt;
          const isAnswer = opt === slide.answer;
          let cls = `border-slate-700 hover:border-indigo-500/60 ${t.text}`;
          if (picked && active && isAnswer) cls = 'border-emerald-500 bg-emerald-500/10 text-emerald-200';
          else if (picked && active && !isAnswer) cls = 'border-red-500 bg-red-500/10 text-red-200';
          else if (picked && isAnswer) cls = 'border-emerald-500/50 text-emerald-300';
          return (
            <button
              key={opt}
              onClick={() => picked === null && setPicked(opt)}
              className={`w-full text-left px-4 py-3 rounded-md border transition ${cls}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GrammarPatternSlide({ slide, t }: { slide: Extract<Slide, { type: 'grammar_pattern' }>; t: ThemeTokens }) {
  return (
    <div className="space-y-6 max-w-3xl w-full">
      <div className={`text-xs uppercase tracking-widest ${t.muted}`}>Grammar</div>
      <h2 className={`text-2xl md:text-3xl font-semibold ${t.text}`}>{slide.title}</h2>
      <div className="grid grid-cols-2 gap-3">
        {slide.rows.map((r, i) => (
          <div key={i} className={`px-4 py-3 rounded-md border ${t.card.replace('bg-', 'bg-')} border-slate-700`}>
            <div className={`text-base ${t.text}`}>{r.a}</div>
          </div>
        )).flatMap((node, i) => [node,
          <div key={`b${i}`} className="px-4 py-3 rounded-md border border-indigo-500/40 bg-indigo-500/5">
            <div className="text-base text-indigo-200">{slide.rows[i].b}</div>
          </div>
        ])}
      </div>
      {slide.rule && <p className={`text-sm ${t.muted}`}>{slide.rule}</p>}
    </div>
  );
}

function ErrorDetectionSlide({ slide, t }: { slide: Extract<Slide, { type: 'error_detection' }>; t: ThemeTokens }) {
  const words = slide.sentence.split(/\s+/);
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="space-y-6 max-w-2xl w-full">
      <h2 className={`text-2xl md:text-3xl font-semibold ${t.text}`}>{slide.prompt}</h2>
      <div className="flex flex-wrap gap-2 text-xl">
        {words.map((w, i) => {
          const isPicked = picked === i;
          const isWrong = i === slide.wrongIndex;
          let cls = `border-slate-700 hover:border-indigo-500 ${t.text}`;
          if (picked !== null && isPicked && isWrong) cls = 'border-emerald-500 bg-emerald-500/10 text-emerald-200';
          else if (picked !== null && isPicked && !isWrong) cls = 'border-red-500 bg-red-500/10 text-red-200';
          else if (picked !== null && isWrong) cls = 'border-emerald-500/60 text-emerald-300';
          return (
            <button key={i} onClick={() => picked === null && setPicked(i)} className={`px-3 py-1.5 rounded-md border transition ${cls}`}>
              {w}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CorrectionSlide({ slide, t }: { slide: Extract<Slide, { type: 'correction' }>; t: ThemeTokens }) {
  const [val, setVal] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const correct = submitted && val.trim().toLowerCase().replace(/[.!?]/g, '') === slide.answer.toLowerCase().replace(/[.!?]/g, '');
  return (
    <div className="space-y-6 max-w-2xl w-full">
      <h2 className={`text-2xl md:text-3xl font-semibold ${t.text}`}>{slide.prompt}</h2>
      <p className={`text-lg italic border-l-2 border-red-500 pl-4 ${t.muted}`}>{slide.wrong}</p>
      <input
        value={val}
        onChange={(e) => { setVal(e.target.value); setSubmitted(false); }}
        placeholder="Write the corrected sentence…"
        className={`w-full rounded-md border px-4 py-3 outline-none focus:border-indigo-500 ${t.inputBg} ${
          submitted ? (correct ? 'border-emerald-500' : 'border-red-500') : ''
        }`}
      />
      <button onClick={() => setSubmitted(true)} className="px-5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium">
        Check
      </button>
      {submitted && (
        <div className={`text-sm flex items-center gap-2 ${correct ? 'text-emerald-400' : 'text-red-400'}`}>
          {correct ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          {correct ? 'Correct.' : `Try again. Expected: ${slide.answer}`}
        </div>
      )}
    </div>
  );
}

function FillBlankSlide({ slide, t }: { slide: Extract<Slide, { type: 'fill_blank' }>; t: ThemeTokens }) {
  const [val, setVal] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const correct = submitted && val.trim().toLowerCase() === slide.answer.toLowerCase();
  return (
    <div className="space-y-6 max-w-2xl w-full">
      <h2 className={`text-2xl md:text-3xl font-semibold ${t.text}`}>{slide.prompt}</h2>
      <div className={`text-2xl ${t.text} flex items-center gap-3 flex-wrap`}>
        <span>{slide.before}</span>
        <input
          value={val}
          onChange={(e) => { setVal(e.target.value); setSubmitted(false); }}
          onKeyDown={(e) => e.key === 'Enter' && setSubmitted(true)}
          className={`w-32 px-3 py-1.5 rounded-md border text-center outline-none focus:border-indigo-500 ${t.inputBg} ${
            submitted ? (correct ? 'border-emerald-500' : 'border-red-500') : ''
          }`}
        />
        <span>{slide.after}</span>
      </div>
      <button onClick={() => setSubmitted(true)} className="px-5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium">
        Check
      </button>
    </div>
  );
}

function SentenceBuilderSlide({ slide, t }: { slide: Extract<Slide, { type: 'sentence_builder' }>; t: ThemeTokens }) {
  const shuffled = useMemo(() => [...slide.words].sort(() => Math.random() - 0.5), [slide.words]);
  const [bank, setBank] = useState<string[]>(shuffled);
  const [answer, setAnswer] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const correct = checked && answer.join(' ') === slide.answer.join(' ');

  const pick = (w: string, i: number) => {
    setBank((b) => b.filter((_, idx) => idx !== i));
    setAnswer((a) => [...a, w]);
    setChecked(false);
  };
  const unpick = (w: string, i: number) => {
    setAnswer((a) => a.filter((_, idx) => idx !== i));
    setBank((b) => [...b, w]);
    setChecked(false);
  };
  const reset = () => { setBank(shuffled); setAnswer([]); setChecked(false); };

  return (
    <div className="space-y-6 max-w-2xl w-full">
      <h2 className={`text-2xl md:text-3xl font-semibold ${t.text}`}>{slide.prompt}</h2>
      <div className={`min-h-[60px] rounded-md border-2 border-dashed p-3 flex flex-wrap gap-2 ${
        checked ? (correct ? 'border-emerald-500' : 'border-red-500') : 'border-slate-700'
      }`}>
        {answer.length === 0 && <span className={`text-sm ${t.muted}`}>Tap words below to build the sentence.</span>}
        {answer.map((w, i) => (
          <button key={`${w}-${i}`} onClick={() => unpick(w, i)} className="px-3 py-1.5 rounded-md bg-indigo-600/20 border border-indigo-500/50 text-indigo-200">
            {w}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {bank.map((w, i) => (
          <button key={`${w}-${i}`} onClick={() => pick(w, i)} className={`px-3 py-1.5 rounded-md border transition ${t.btnGhost}`}>
            {w}
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={() => setChecked(true)} disabled={answer.length !== slide.answer.length} className="px-5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-medium">
          Check
        </button>
        <button onClick={reset} className={`px-5 py-2 rounded-md text-sm ${t.btnGhost}`}>Reset</button>
      </div>
    </div>
  );
}

function DebateScaleSlide({ slide, t }: { slide: Extract<Slide, { type: 'debate_scale' }>; t: ThemeTokens }) {
  const labels = ['Strongly\ndisagree', 'Disagree', 'Neutral', 'Agree', 'Strongly\nagree'];
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="space-y-8 max-w-2xl w-full">
      <h2 className={`text-2xl md:text-3xl font-semibold ${t.text}`}>{slide.prompt}</h2>
      <div className="grid grid-cols-5 gap-2">
        {labels.map((l, i) => (
          <button
            key={i}
            onClick={() => setPicked(i)}
            className={`px-2 py-3 rounded-md text-xs font-medium whitespace-pre-line transition ${
              picked === i ? 'bg-indigo-600 text-white' : t.btnGhost
            }`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

function RolePlaySlide({ slide, t }: { slide: Extract<Slide, { type: 'role_play' }>; t: ThemeTokens }) {
  return (
    <div className="space-y-6 max-w-2xl w-full">
      <div className={`text-xs uppercase tracking-widest ${t.muted}`}>Role play</div>
      <h2 className={`text-2xl md:text-3xl font-semibold ${t.text}`}>{slide.title}</h2>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <span className="px-2 py-1 rounded text-xs font-semibold bg-indigo-600 text-white">A</span>
          <p className={`text-lg ${t.text}`}>{slide.lineA}</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="px-2 py-1 rounded text-xs font-semibold bg-pink-600 text-white">B</span>
          <p className={`text-lg ${t.text}`}>{slide.lineB}</p>
        </div>
      </div>
    </div>
  );
}

function SpeakingTaskSlide({ slide, t }: { slide: Extract<Slide, { type: 'speaking_task' }>; t: ThemeTokens }) {
  return (
    <div className="space-y-6 max-w-2xl w-full">
      <div className={`text-xs uppercase tracking-widest ${t.muted}`}>Speaking</div>
      <h2 className={`text-2xl md:text-3xl font-semibold ${t.text}`}>{slide.prompt}</h2>
      {slide.starters && slide.starters.length > 0 && (
        <div className={`rounded-md border border-slate-700 p-4 space-y-2`}>
          <div className={`text-xs uppercase tracking-widest ${t.muted}`}>Sentence starters</div>
          {slide.starters.map((s) => (
            <div key={s} className={`text-base ${t.text}`}>· {s}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReflectionSlide({ slide, t }: { slide: Extract<Slide, { type: 'reflection' }>; t: ThemeTokens }) {
  const opts = ['Easy', 'Just right', 'Challenging'];
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div className="space-y-6 max-w-2xl w-full">
      <div className={`text-xs uppercase tracking-widest ${t.muted}`}>Reflection</div>
      <h2 className={`text-2xl md:text-3xl font-semibold ${t.text}`}>{slide.prompt}</h2>
      <div className="flex flex-wrap gap-3">
        {opts.map((o) => (
          <button key={o} onClick={() => setPicked(o)} className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${
            picked === o ? 'bg-indigo-600 text-white' : t.btnGhost
          }`}>{o}</button>
        ))}
      </div>
      {picked && <p className={`text-sm ${t.muted}`}>Lesson complete. Great work.</p>}
    </div>
  );
}

// ─── Cluster slide (multi-activity) ─────────────────────────────────────────
function ClusterMCQ({ a, t }: { a: Extract<ClusterActivity, { type: 'mcq' }>; t: ThemeTokens }) {
  const [picked, setPicked] = useState<string | null>(null);
  const correct = picked === a.answer;
  return (
    <div className={`rounded-lg border ${t.card} p-4 space-y-3`}>
      <p className={`text-base font-medium ${t.text}`}>{a.question}</p>
      <div className="flex flex-wrap gap-2">
        {a.options.map((opt) => {
          const active = picked === opt;
          let cls = `px-3 py-1.5 rounded-md text-sm border transition ${t.btnGhost}`;
          if (picked && active && correct) cls = 'px-3 py-1.5 rounded-md text-sm border border-emerald-500 bg-emerald-500/10 text-emerald-200';
          else if (picked && active && !correct) cls = 'px-3 py-1.5 rounded-md text-sm border border-red-500 bg-red-500/10 text-red-200';
          else if (picked && opt === a.answer) cls = 'px-3 py-1.5 rounded-md text-sm border border-emerald-500/50 text-emerald-300';
          return <button key={opt} onClick={() => picked === null && setPicked(opt)} className={cls}>{opt}</button>;
        })}
      </div>
      {picked !== null && (
        <p className={`text-sm ${correct ? 'text-emerald-400' : 'text-red-400'}`}>
          {correct ? '✓ Correct.' : (a.explanation ?? 'Try again.')}
        </p>
      )}
    </div>
  );
}

function ClusterFill({ a, t }: { a: Extract<ClusterActivity, { type: 'fill' }>; t: ThemeTokens }) {
  const [val, setVal] = useState('');
  const submitted = val.trim().length > 0;
  const correct = val.trim().toLowerCase() === a.answer.trim().toLowerCase();
  return (
    <div className={`rounded-lg border ${t.card} p-4 space-y-3`}>
      <p className={`text-base font-medium ${t.text}`}>{a.text}</p>
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Type your answer…"
        className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-indigo-500 ${t.inputBg}`}
      />
      {submitted && (
        <p className={`text-sm ${correct ? 'text-emerald-400' : 'text-red-400'}`}>
          {correct ? '✓ Correct.' : (a.explanation ?? `Answer: ${a.answer}`)}
        </p>
      )}
    </div>
  );
}

function ClusterTF({ a, t }: { a: Extract<ClusterActivity, { type: 'tf' }>; t: ThemeTokens }) {
  const [picked, setPicked] = useState<boolean | null>(null);
  const correct = picked !== null && picked === a.answer;
  return (
    <div className={`rounded-lg border ${t.card} p-4 space-y-3`}>
      <p className={`text-base font-medium ${t.text}`}>{a.statement}</p>
      <div className="flex gap-2">
        {[true, false].map((v) => {
          const active = picked === v;
          let cls = `px-4 py-1.5 rounded-md text-sm font-medium transition ${t.btnGhost}`;
          if (active && correct) cls = 'px-4 py-1.5 rounded-md text-sm font-medium bg-emerald-600 text-white';
          else if (active && !correct) cls = 'px-4 py-1.5 rounded-md text-sm font-medium bg-red-600 text-white';
          return <button key={String(v)} onClick={() => picked === null && setPicked(v)} className={cls}>{v ? 'True' : 'False'}</button>;
        })}
      </div>
      {picked !== null && (
        <p className={`text-sm ${correct ? 'text-emerald-400' : 'text-red-400'}`}>
          {correct ? '✓ Correct.' : (a.explanation ?? 'Not quite.')}
        </p>
      )}
    </div>
  );
}

function ClusterBuild({ a, t }: { a: Extract<ClusterActivity, { type: 'build' }>; t: ThemeTokens }) {
  const [picked, setPicked] = useState<number[]>([]);
  const sentence = picked.map((i) => a.words[i]).join(' ');
  const submitted = picked.length === a.words.length;
  const correct = submitted && JSON.stringify(picked.map((i) => a.words[i])) === JSON.stringify(a.answer);
  const reset = () => setPicked([]);
  const toggle = (i: number) => {
    if (picked.includes(i)) setPicked(picked.filter((x) => x !== i));
    else setPicked([...picked, i]);
  };
  return (
    <div className={`rounded-lg border ${t.card} p-4 space-y-3`}>
      <p className={`text-base font-medium ${t.text}`}>{a.prompt ?? 'Build the sentence.'}</p>
      <div className="flex flex-wrap gap-2">
        {a.words.map((w, i) => {
          const used = picked.includes(i);
          return (
            <button
              key={i}
              disabled={used}
              onClick={() => toggle(i)}
              className={`px-3 py-1.5 rounded-md text-sm border transition ${used ? 'opacity-30 line-through' : t.btnGhost}`}
            >
              {w}
            </button>
          );
        })}
      </div>
      <div className={`min-h-[2rem] px-3 py-2 rounded-md border border-dashed border-slate-700 text-sm ${t.text}`}>
        {sentence || <span className={t.muted}>Tap words to build…</span>}
      </div>
      <div className="flex items-center gap-3">
        <button onClick={reset} className={`text-xs underline ${t.muted}`}>Reset</button>
        {submitted && (
          <span className={`text-sm ${correct ? 'text-emerald-400' : 'text-red-400'}`}>
            {correct ? '✓ Correct.' : `Try: ${a.answer.join(' ')}`}
          </span>
        )}
      </div>
    </div>
  );
}

function ClusterSlide({ slide, t }: { slide: Extract<Slide, { type: 'cluster' }>; t: ThemeTokens }) {
  return (
    <div className="space-y-5 w-full max-w-3xl">
      <div className="space-y-2">
        <div className={`text-xs uppercase tracking-widest ${t.muted}`}>{slide.block}</div>
        <h2 className={`text-2xl md:text-3xl font-semibold ${t.text}`}>{slide.title}</h2>
        {slide.content && <p className={`text-base ${t.muted}`}>{slide.content}</p>}
      </div>
      <div className="grid gap-3">
        {slide.activities.map((a, i) => {
          switch (a.type) {
            case 'mcq': return <ClusterMCQ key={i} a={a} t={t} />;
            case 'fill': return <ClusterFill key={i} a={a} t={t} />;
            case 'tf': return <ClusterTF key={i} a={a} t={t} />;
            case 'build': return <ClusterBuild key={i} a={a} t={t} />;
          }
        })}
      </div>
    </div>
  );
}

// ─── Renderer ───────────────────────────────────────────────────────────────
export function SlideRenderer({ slide, t }: { slide: Slide; t: ThemeTokens }) {
  switch (slide.type) {
    case 'intro': return <Intro slide={slide} t={t} />;
    case 'question': return <QuestionSlide slide={slide} t={t} />;
    case 'poll': return <PollSlide slide={slide} t={t} />;
    case 'opinion': return <OpinionSlide slide={slide} t={t} />;
    case 'vocab': return <VocabSlide slide={slide} t={t} />;
    case 'matching': return <MatchingSlide slide={slide} t={t} />;
    case 'reading_passage': return <ReadingSlide slide={slide} t={t} />;
    case 'listening': return <ListeningSlide slide={slide} t={t} />;
    case 'truefalse': return <TrueFalseSlide slide={slide} t={t} />;
    case 'multiple': return <MultipleSlide slide={slide} t={t} />;
    case 'grammar_pattern': return <GrammarPatternSlide slide={slide} t={t} />;
    case 'error_detection': return <ErrorDetectionSlide slide={slide} t={t} />;
    case 'correction': return <CorrectionSlide slide={slide} t={t} />;
    case 'fill_blank': return <FillBlankSlide slide={slide} t={t} />;
    case 'sentence_builder': return <SentenceBuilderSlide slide={slide} t={t} />;
    case 'debate_scale': return <DebateScaleSlide slide={slide} t={t} />;
    case 'role_play': return <RolePlaySlide slide={slide} t={t} />;
    case 'speaking_task': return <SpeakingTaskSlide slide={slide} t={t} />;
    case 'reflection': return <ReflectionSlide slide={slide} t={t} />;
  }
}

// ─── Progress bar ───────────────────────────────────────────────────────────
export function ProgressBar({ currentBlock, slideIndex, t, slides = SLIDES }: { currentBlock: Block; slideIndex: number; t: ThemeTokens; slides?: Slide[] }) {
  const blockSlides = slides.reduce<Record<Block, number[]>>((acc, s, i) => {
    acc[s.block] = acc[s.block] || [];
    acc[s.block].push(i);
    return acc;
  }, { warmup: [], vocab: [], reading: [], grammar: [], practice: [], interactive: [], speaking: [] });

  const currentBlockIdx = BLOCKS.findIndex((b) => b.id === currentBlock);
  const slidesInBlock = blockSlides[currentBlock] ?? [];
  const localPos = slidesInBlock.indexOf(slideIndex);
  const localPct = slidesInBlock.length > 0 ? ((localPos + 1) / slidesInBlock.length) * 100 : 0;

  return (
    <div className="w-full grid grid-cols-7 gap-1">
      {BLOCKS.map((b, i) => {
        const isCurrent = b.id === currentBlock;
        const isDone = i < currentBlockIdx;
        return (
          <div key={b.id} className="space-y-1.5">
            <div className={`h-1.5 rounded-full overflow-hidden ${isDone ? 'bg-indigo-600' : 'bg-slate-800'}`}>
              {isCurrent && (
                <motion.div
                  className="h-full bg-indigo-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${localPct}%` }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
            <div className={`text-[10px] md:text-xs uppercase tracking-wider text-center ${
              isCurrent ? 'text-indigo-300 font-semibold' : isDone ? t.muted : t.muted + ' opacity-60'
            }`}>
              {b.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function AcademyDemo() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [i, setI] = useState(0);
  const t = themeMap[theme];
  const slide = SLIDES[i];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setI((n) => Math.min(SLIDES.length - 1, n + 1));
      if (e.key === 'ArrowLeft') setI((n) => Math.max(0, n - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const blockLabel = BLOCKS.find((b) => b.id === slide.block)?.label ?? '';

  return (
    <div className={`min-h-screen ${t.bg} ${t.text} font-sans flex flex-col`}>
      {/* subtle indigo mesh backdrop (dark mode only) */}
      {theme === 'dark' && (
        <div className="pointer-events-none fixed inset-0 opacity-40"
             style={{ backgroundImage: 'radial-gradient(at 20% 10%, rgba(99,102,241,0.25), transparent 50%), radial-gradient(at 80% 90%, rgba(168,85,247,0.18), transparent 50%)' }} />
      )}

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">A</div>
              <div>
                <div className="text-sm font-semibold">Academy</div>
                <div className={`text-xs ${t.muted}`}>60 min · A2 · Phones & You</div>
              </div>
            </div>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className={`p-2 rounded-md ${t.btnGhost}`} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
          <ProgressBar currentBlock={slide.block} slideIndex={i} t={t} />
        </div>
      </header>

      {/* Slide */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className={`w-full max-w-4xl rounded-xl border ${t.card} px-8 py-12 md:px-12 md:py-16 min-h-[420px] flex items-center justify-center`}
          >
            <SlideRenderer slide={slide} t={t} />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer nav */}
      <footer className="relative z-10 border-t border-slate-800/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setI((n) => Math.max(0, n - 1))}
            disabled={i === 0}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium disabled:opacity-30 ${t.btnGhost}`}
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <div className={`text-sm ${t.muted}`}>
            <span className="font-semibold text-indigo-400">{blockLabel}</span>
            <span className="mx-2">·</span>
            <span>{i + 1} / {SLIDES.length}</span>
          </div>
          <button
            onClick={() => setI((n) => Math.min(SLIDES.length - 1, n + 1))}
            disabled={i === SLIDES.length - 1}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-30"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
