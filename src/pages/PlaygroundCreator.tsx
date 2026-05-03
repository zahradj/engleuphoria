import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ChevronUp, ChevronDown, Copy, Download, Upload, Eye, Code2, X, Sparkles, Loader2 } from 'lucide-react';
import { SlideRenderer, type Slide } from './PlaygroundDemo';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Playground Slide Creator
 * ------------------------
 * Authoring tool for the Playground Engine. Lets you build a deck of
 * dynamic slides (multiple choice, true/false, fill, drag, match, draw,
 * intro) with live preview, JSON editing, import/export.
 *
 * Branding: Playground hub — Orange (#FE6A2F) + Yellow (#FEFBDD).
 */

type SlideType = Slide['type'];

const SLIDE_TYPES: { type: SlideType; label: string; emoji: string }[] = [
  { type: 'intro', label: 'Intro', emoji: '👋' },
  { type: 'multiple', label: 'Multiple Choice', emoji: '🔘' },
  { type: 'truefalse', label: 'True / False', emoji: '✓' },
  { type: 'fill', label: 'Fill the Blank', emoji: '✏️' },
  { type: 'drag', label: 'Drag & Drop', emoji: '🖱️' },
  { type: 'match', label: 'Matching', emoji: '🔗' },
  { type: 'draw', label: 'Drawing', emoji: '🎨' },
];

function makeSlide(type: SlideType): Slide {
  switch (type) {
    case 'intro':
      return { type: 'intro', title: '👋 Hello!', text: 'Welcome to the lesson', voice: { text: 'Hello!', autoPlay: true } };
    case 'multiple':
      return { type: 'multiple', question: 'What is this? 🐶', options: ['dog', 'cat', 'apple'], answer: 'dog', voice: { text: 'What is this?', autoPlay: true } };
    case 'truefalse':
      return { type: 'truefalse', statement: 'This is a cat 🐱', answer: true, voice: { text: 'True or false?', autoPlay: true } };
    case 'fill':
      return { type: 'fill', text: 'My name is ____', answer: 'Alex', voice: { text: 'Fill in the blank', autoPlay: true } };
    case 'drag':
      return { type: 'drag', instruction: 'Drag the word onto the picture', word: 'APPLE', target: '🍎', voice: { text: 'Drag the word', autoPlay: true } };
    case 'match':
      return {
        type: 'match',
        instruction: 'Tap a word, then tap its picture',
        pairs: [{ word: 'DOG', match: '🐶' }, { word: 'CAT', match: '🐱' }],
        voice: { text: 'Match them!', autoPlay: true },
      };
    case 'draw':
      return { type: 'draw', prompt: 'Draw your favourite animal!', voice: { text: 'Draw something!', autoPlay: true } };
  }
}

function slideTitle(slide: Slide): string {
  switch (slide.type) {
    case 'intro': return slide.title;
    case 'multiple': return slide.question;
    case 'truefalse': return slide.statement;
    case 'fill': return slide.text;
    case 'drag': return slide.instruction;
    case 'match': return slide.instruction;
    case 'draw': return slide.prompt;
  }
}

const STARTER: Slide[] = [
  { type: 'intro', title: '👋 Hello, friend!', text: "Let's play and learn!", voice: { text: "Let's play!", autoPlay: true } },
];

export default function PlaygroundCreator() {
  const [slides, setSlides] = useState<Slide[]>(STARTER);
  const [selected, setSelected] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [jsonOpen, setJsonOpen] = useState(false);
  const [jsonDraft, setJsonDraft] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const current = slides[selected];

  const update = (patch: Partial<Slide>) => {
    setSlides((prev) => prev.map((s, i) => (i === selected ? ({ ...s, ...patch } as Slide) : s)));
  };

  const addSlide = (type: SlideType) => {
    setSlides((prev) => {
      const next = [...prev, makeSlide(type)];
      setSelected(next.length - 1);
      return next;
    });
  };

  const deleteSlide = (i: number) => {
    if (slides.length === 1) return;
    setSlides((prev) => prev.filter((_, idx) => idx !== i));
    setSelected((s) => Math.max(0, Math.min(s, slides.length - 2)));
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= slides.length) return;
    setSlides((prev) => {
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    setSelected(j);
  };

  const duplicate = (i: number) => {
    setSlides((prev) => {
      const next = [...prev];
      next.splice(i + 1, 0, JSON.parse(JSON.stringify(prev[i])));
      return next;
    });
    setSelected(i + 1);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(slides, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'playground-lesson.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('Expected non-empty array');
        setSlides(parsed);
        setSelected(0);
      } catch (e: any) {
        alert('Invalid JSON: ' + e.message);
      }
    };
    reader.readAsText(file);
  };

  const openJsonEditor = () => {
    setJsonDraft(JSON.stringify(slides, null, 2));
    setJsonError(null);
    setJsonOpen(true);
  };

  const applyJson = () => {
    try {
      const parsed = JSON.parse(jsonDraft);
      if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('Expected non-empty array of slides');
      setSlides(parsed);
      setSelected(0);
      setJsonOpen(false);
    } catch (e: any) {
      setJsonError(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b-4 border-orange-400 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white text-xl font-bold shadow-md">
              🎨
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-orange-600 leading-tight">Playground Slide Creator</h1>
              <p className="text-xs text-slate-500">Build dynamic, AI-voiced lessons for kids</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer inline-flex items-center gap-2 bg-white border-2 border-orange-300 hover:bg-orange-50 text-orange-700 font-bold rounded-xl px-4 py-2 text-sm transition active:scale-95">
              <Upload className="w-4 h-4" /> Import
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])}
              />
            </label>
            <button onClick={exportJson} className="inline-flex items-center gap-2 bg-white border-2 border-orange-300 hover:bg-orange-50 text-orange-700 font-bold rounded-xl px-4 py-2 text-sm transition active:scale-95">
              <Download className="w-4 h-4" /> Export
            </button>
            <button onClick={openJsonEditor} className="inline-flex items-center gap-2 bg-white border-2 border-orange-300 hover:bg-orange-50 text-orange-700 font-bold rounded-xl px-4 py-2 text-sm transition active:scale-95">
              <Code2 className="w-4 h-4" /> JSON
            </button>
            <button onClick={() => setPreviewOpen(true)} className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl px-4 py-2 text-sm shadow-md transition active:scale-95">
              <Eye className="w-4 h-4" /> Preview
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 p-4">
        {/* Slide list */}
        <aside className="col-span-12 md:col-span-3">
          <div className="bg-white rounded-2xl shadow-md border-2 border-orange-200 p-3">
            <h2 className="text-sm font-bold text-orange-600 px-2 py-1">SLIDES</h2>
            <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
              {slides.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`w-full text-left rounded-xl p-3 border-2 transition ${
                    i === selected ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-slate-200 hover:border-orange-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-bold text-orange-600">#{i + 1} · {s.type}</span>
                    <div className="flex gap-1 opacity-70">
                      <span onClick={(e) => { e.stopPropagation(); move(i, -1); }} className="hover:text-orange-600"><ChevronUp className="w-3.5 h-3.5" /></span>
                      <span onClick={(e) => { e.stopPropagation(); move(i, 1); }} className="hover:text-orange-600"><ChevronDown className="w-3.5 h-3.5" /></span>
                      <span onClick={(e) => { e.stopPropagation(); duplicate(i); }} className="hover:text-orange-600"><Copy className="w-3.5 h-3.5" /></span>
                      <span onClick={(e) => { e.stopPropagation(); deleteSlide(i); }} className="hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></span>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-slate-800 truncate">{slideTitle(s)}</div>
                </button>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-orange-100">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2 px-1">Add Slide</p>
              <div className="grid grid-cols-2 gap-2">
                {SLIDE_TYPES.map((t) => (
                  <button
                    key={t.type}
                    onClick={() => addSlide(t.type)}
                    className="text-xs font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg p-2 flex flex-col items-center gap-1 transition active:scale-95"
                  >
                    <span className="text-lg">{t.emoji}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Editor */}
        <section className="col-span-12 md:col-span-5">
          <div className="bg-white rounded-2xl shadow-md border-2 border-orange-200 p-5">
            <h2 className="text-sm font-bold text-orange-600 mb-4">EDIT SLIDE #{selected + 1} · {current.type.toUpperCase()}</h2>
            <SlideEditor slide={current} onChange={update} />
          </div>
        </section>

        {/* Live preview */}
        <section className="col-span-12 md:col-span-4">
          <div className="bg-white rounded-2xl shadow-md border-2 border-orange-200 p-3 sticky top-24">
            <h2 className="text-sm font-bold text-orange-600 mb-2 px-2">LIVE PREVIEW</h2>
            <div className="rounded-xl bg-gradient-to-br from-orange-400 via-amber-300 to-yellow-200 p-4 min-h-[420px] flex items-center justify-center">
              <div key={selected + current.type} className="bg-white rounded-2xl shadow-xl w-full p-4 min-h-[380px] flex items-center justify-center">
                <div className="scale-[0.85] origin-center w-full">
                  <SlideRenderer slide={current} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Fullscreen preview */}
      <AnimatePresence>
        {previewOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-center justify-center p-4"
          >
            <button onClick={() => setPreviewOpen(false)} className="absolute top-4 right-4 bg-white text-orange-600 rounded-full p-2 shadow-lg hover:bg-orange-50">
              <X className="w-5 h-5" />
            </button>
            <FullPreview slides={slides} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* JSON editor modal */}
      <AnimatePresence>
        {jsonOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-orange-200">
                <h3 className="font-bold text-orange-600">Edit Lesson JSON</h3>
                <button onClick={() => setJsonOpen(false)}><X className="w-5 h-5 text-slate-500" /></button>
              </div>
              <textarea
                value={jsonDraft}
                onChange={(e) => setJsonDraft(e.target.value)}
                className="flex-1 font-mono text-xs p-4 outline-none resize-none"
                spellCheck={false}
              />
              {jsonError && <div className="px-4 py-2 text-sm text-red-600 bg-red-50 border-t border-red-200">{jsonError}</div>}
              <div className="p-4 border-t border-orange-200 flex justify-end gap-2">
                <button onClick={() => setJsonOpen(false)} className="px-4 py-2 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={applyJson} className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md">Apply</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Slide editor (per type) ─────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">{label}</span>
      {children}
    </label>
  );
}

const inputCls = 'w-full border-2 border-orange-200 focus:border-orange-500 rounded-xl px-3 py-2 outline-none text-slate-800 bg-white';

function SlideEditor({ slide, onChange }: { slide: Slide; onChange: (p: Partial<Slide>) => void }) {
  const voice = (slide as any).voice as Slide['voice'] | undefined;
  const VoiceFields = (
    <div className="grid grid-cols-3 gap-3 pt-3 mt-3 border-t border-orange-100">
      <div className="col-span-2">
        <Field label="🔊 Voice (TTS)">
          <input
            className={inputCls}
            value={voice?.text || ''}
            placeholder="What the voice says..."
            onChange={(e) => onChange({ voice: { ...(voice || {}), text: e.target.value } } as any)}
          />
        </Field>
      </div>
      <Field label="Auto-play">
        <select
          className={inputCls}
          value={voice?.autoPlay ? 'yes' : 'no'}
          onChange={(e) => onChange({ voice: { text: voice?.text || '', autoPlay: e.target.value === 'yes' } } as any)}
        >
          <option value="yes">On</option>
          <option value="no">Off</option>
        </select>
      </Field>
    </div>
  );

  switch (slide.type) {
    case 'intro':
      return (
        <div className="space-y-3">
          <Field label="Title"><input className={inputCls} value={slide.title} onChange={(e) => onChange({ title: e.target.value } as any)} /></Field>
          <Field label="Text"><input className={inputCls} value={slide.text || ''} onChange={(e) => onChange({ text: e.target.value } as any)} /></Field>
          {VoiceFields}
        </div>
      );

    case 'multiple':
      return (
        <div className="space-y-3">
          <Field label="Question"><input className={inputCls} value={slide.question} onChange={(e) => onChange({ question: e.target.value } as any)} /></Field>
          <Field label="Options (one per line)">
            <textarea
              className={inputCls + ' h-24'}
              value={slide.options.join('\n')}
              onChange={(e) => onChange({ options: e.target.value.split('\n').filter(Boolean) } as any)}
            />
          </Field>
          <Field label="Correct Answer">
            <select className={inputCls} value={slide.answer} onChange={(e) => onChange({ answer: e.target.value } as any)}>
              {slide.options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
          {VoiceFields}
        </div>
      );

    case 'truefalse':
      return (
        <div className="space-y-3">
          <Field label="Statement"><input className={inputCls} value={slide.statement} onChange={(e) => onChange({ statement: e.target.value } as any)} /></Field>
          <Field label="Correct Answer">
            <select className={inputCls} value={slide.answer ? 'true' : 'false'} onChange={(e) => onChange({ answer: e.target.value === 'true' } as any)}>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </Field>
          {VoiceFields}
        </div>
      );

    case 'fill':
      return (
        <div className="space-y-3">
          <Field label="Sentence (use ____ for blank)"><input className={inputCls} value={slide.text} onChange={(e) => onChange({ text: e.target.value } as any)} /></Field>
          <Field label="Answer"><input className={inputCls} value={slide.answer} onChange={(e) => onChange({ answer: e.target.value } as any)} /></Field>
          {VoiceFields}
        </div>
      );

    case 'drag':
      return (
        <div className="space-y-3">
          <Field label="Instruction"><input className={inputCls} value={slide.instruction} onChange={(e) => onChange({ instruction: e.target.value } as any)} /></Field>
          <Field label="Word"><input className={inputCls} value={slide.word} onChange={(e) => onChange({ word: e.target.value } as any)} /></Field>
          <Field label="Target (emoji)"><input className={inputCls} value={slide.target} onChange={(e) => onChange({ target: e.target.value } as any)} /></Field>
          {VoiceFields}
        </div>
      );

    case 'match':
      return (
        <div className="space-y-3">
          <Field label="Instruction"><input className={inputCls} value={slide.instruction} onChange={(e) => onChange({ instruction: e.target.value } as any)} /></Field>
          <div>
            <span className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Pairs</span>
            <div className="space-y-2">
              {slide.pairs.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className={inputCls + ' flex-1'} placeholder="Word" value={p.word}
                    onChange={(e) => {
                      const next = [...slide.pairs]; next[i] = { ...p, word: e.target.value };
                      onChange({ pairs: next } as any);
                    }}
                  />
                  <input
                    className={inputCls + ' w-24 text-center text-2xl'} placeholder="🐶" value={p.match}
                    onChange={(e) => {
                      const next = [...slide.pairs]; next[i] = { ...p, match: e.target.value };
                      onChange({ pairs: next } as any);
                    }}
                  />
                  <button
                    onClick={() => onChange({ pairs: slide.pairs.filter((_, j) => j !== i) } as any)}
                    className="text-red-500 hover:bg-red-50 rounded-lg px-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => onChange({ pairs: [...slide.pairs, { word: '', match: '' }] } as any)}
              className="mt-2 text-sm font-bold text-orange-600 hover:bg-orange-50 rounded-lg px-3 py-1.5 inline-flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add pair
            </button>
          </div>
          {VoiceFields}
        </div>
      );

    case 'draw':
      return (
        <div className="space-y-3">
          <Field label="Prompt"><input className={inputCls} value={slide.prompt} onChange={(e) => onChange({ prompt: e.target.value } as any)} /></Field>
          {VoiceFields}
        </div>
      );
  }
}

// ─── Fullscreen preview deck ─────────────────────────────────────────────────
function FullPreview({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const slide = slides[i];
  return (
    <div className="w-full max-w-5xl flex flex-col items-center gap-4">
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full min-h-[60vh] p-10 flex items-center justify-center"
      >
        <SlideRenderer slide={slide} />
      </motion.div>
      <div className="flex items-center gap-4 bg-white rounded-full shadow-lg px-6 py-3">
        <button onClick={() => setI((n) => Math.max(0, n - 1))} disabled={i === 0}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-bold rounded-full px-5 py-2 active:scale-95 transition">← Back</button>
        <span className="font-bold text-orange-600 text-lg">{i + 1} / {slides.length}</span>
        <button onClick={() => setI((n) => Math.min(slides.length - 1, n + 1))} disabled={i === slides.length - 1}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-bold rounded-full px-5 py-2 active:scale-95 transition">Next →</button>
      </div>
    </div>
  );
}
