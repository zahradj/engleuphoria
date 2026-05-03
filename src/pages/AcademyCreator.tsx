import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ChevronUp, ChevronDown, Copy, Download, Upload, Code2, X, Play, Sparkles, Loader2 } from 'lucide-react';
import {
  SlideRenderer,
  themeMap,
  BLOCKS,
  type Slide,
  type Block,
  type ClusterActivity,
} from './AcademyDemo';
import { SOCIAL_MEDIA_LESSON } from '@/data/academyLessons/socialMediaHabits';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Academy Slide Creator — clean teacher-facing authoring tool.
 * Mirrors the structure of PlaygroundCreator but Academy-themed.
 */

type SlideType = Slide['type'];

const SLIDE_TYPES: { type: SlideType; label: string; defaultBlock: Block }[] = [
  { type: 'intro',            label: 'Intro / Title',          defaultBlock: 'warmup' },
  { type: 'question',         label: 'Open Question',          defaultBlock: 'warmup' },
  { type: 'opinion',          label: 'Opinion Prompt',         defaultBlock: 'warmup' },
  { type: 'poll',             label: 'Poll',                   defaultBlock: 'warmup' },
  { type: 'vocab',            label: 'Vocabulary',             defaultBlock: 'vocab' },
  { type: 'matching',         label: 'Matching',               defaultBlock: 'vocab' },
  { type: 'reading_passage',  label: 'Reading Passage',        defaultBlock: 'reading' },
  { type: 'listening',        label: 'Listening',              defaultBlock: 'reading' },
  { type: 'multiple',         label: 'Multiple Choice',        defaultBlock: 'practice' },
  { type: 'truefalse',        label: 'True / False',           defaultBlock: 'practice' },
  { type: 'grammar_pattern',  label: 'Grammar Pattern',        defaultBlock: 'grammar' },
  { type: 'error_detection',  label: 'Error Detection',        defaultBlock: 'grammar' },
  { type: 'correction',       label: 'Correction',             defaultBlock: 'grammar' },
  { type: 'fill_blank',       label: 'Fill the Blank',         defaultBlock: 'practice' },
  { type: 'sentence_builder', label: 'Sentence Builder',       defaultBlock: 'practice' },
  { type: 'debate_scale',     label: 'Debate Scale (1–5)',     defaultBlock: 'interactive' },
  { type: 'role_play',        label: 'Role Play',              defaultBlock: 'interactive' },
  { type: 'speaking_task',    label: 'Speaking Task',          defaultBlock: 'speaking' },
  { type: 'reflection',      label: 'Reflection',             defaultBlock: 'speaking' },
  { type: 'cluster',          label: 'Cluster (multi-task)',   defaultBlock: 'practice' },
];

function makeSlide(type: SlideType): Slide {
  const block = SLIDE_TYPES.find((s) => s.type === type)!.defaultBlock;
  switch (type) {
    case 'intro': return { type, block, title: 'New section', subtitle: '' };
    case 'question': return { type, block, prompt: 'Open question…', placeholder: '' };
    case 'opinion': return { type, block, prompt: 'What do you think about…?' };
    case 'poll': return { type, block, prompt: 'Poll question…', options: [{ label: 'Option A', pct: 33 }, { label: 'Option B', pct: 34 }, { label: 'Option C', pct: 33 }] };
    case 'vocab': return { type, block, word: 'word', definition: 'simple definition', example: 'Example sentence.' };
    case 'matching': return { type, block, prompt: 'Match the pairs.', pairs: [{ left: 'A', right: '1' }, { left: 'B', right: '2' }] };
    case 'reading_passage': return { type, block, title: 'Reading title', passage: 'Short reading passage goes here…' };
    case 'listening': return { type, block, prompt: 'Listen and answer.', transcript: 'Audio transcript text used for TTS playback.' };
    case 'multiple': return { type, block, question: 'Question?', options: ['A', 'B', 'C'], answer: 'A' };
    case 'truefalse': return { type, block, statement: 'Statement is true.', answer: true };
    case 'grammar_pattern': return { type, block, title: 'Pattern title', rows: [{ a: 'Example 1', b: 'Example 2' }], rule: 'Rule explanation.' };
    case 'error_detection': return { type, block, prompt: 'Tap the wrong word.', sentence: 'He go to school.', wrongIndex: 1 };
    case 'correction': return { type, block, prompt: 'Fix the sentence.', wrong: 'She go home.', answer: 'She goes home.' };
    case 'fill_blank': return { type, block, prompt: 'Complete the sentence.', before: 'He', after: 'to school.', answer: 'goes' };
    case 'sentence_builder': return { type, block, prompt: 'Order the words.', words: ['I', 'a', 'have', 'phone'], answer: ['I', 'have', 'a', 'phone'] };
    case 'debate_scale': return { type, block, prompt: 'Statement to debate.' };
    case 'role_play': return { type, block, title: 'Role play', lineA: 'Speaker A line.', lineB: 'Speaker B line.' };
    case 'speaking_task': return { type, block, prompt: 'Speak about…', starters: ['I think…', 'In my opinion…'] };
    case 'reflection': return { type, block, prompt: 'Reflect on what you learned.' };
    case 'cluster': return { type, block, title: 'Quick Drill', content: 'Apply the rule four ways below.', activities: [
      { type: 'mcq', question: 'She ___ every day.', options: ['use', 'uses', 'using'], answer: 'uses', explanation: "Use 'uses' for she/he/it." },
      { type: 'fill', text: 'He ___ (use) his phone.', answer: 'uses' },
      { type: 'tf', statement: 'He use TikTok.', answer: false },
      { type: 'build', prompt: 'Build the sentence.', words: ['I', 'use', 'my', 'phone'], answer: ['I', 'use', 'my', 'phone'] },
    ]};
  }
}

function slideTitle(s: Slide): string {
  switch (s.type) {
    case 'intro': return s.title;
    case 'reading_passage': return s.title;
    case 'role_play': return s.title;
    case 'grammar_pattern': return s.title;
    case 'vocab': return s.word;
    case 'multiple': return s.question;
    case 'truefalse': return s.statement;
    case 'correction': return s.wrong;
    case 'cluster': return s.title;
    default: return (s as any).prompt ?? s.type;
  }
}

const inputCls = 'w-full border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-lg px-3 py-2 outline-none text-slate-900 bg-white text-sm transition';
const labelCls = 'block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className={labelCls}>{label}</span>{children}</label>;
}

export default function AcademyCreator() {
  const navigate = useNavigate();
  const [slides, setSlides] = useState<Slide[]>(SOCIAL_MEDIA_LESSON.slides);
  const [title, setTitle] = useState(SOCIAL_MEDIA_LESSON.title);
  const [level, setLevel] = useState(SOCIAL_MEDIA_LESSON.level);
  const [selected, setSelected] = useState(0);
  const [jsonOpen, setJsonOpen] = useState(false);
  const [jsonDraft, setJsonDraft] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const t = themeMap.light;
  const current = slides[selected];

  const grouped = useMemo(() => {
    const m: Record<Block, { slide: Slide; idx: number }[]> = { warmup: [], vocab: [], reading: [], grammar: [], practice: [], interactive: [], speaking: [] };
    slides.forEach((s, idx) => m[s.block].push({ slide: s, idx }));
    return m;
  }, [slides]);

  const update = (patch: Partial<Slide>) =>
    setSlides((p) => p.map((s, i) => (i === selected ? ({ ...s, ...patch } as Slide) : s)));

  const addSlide = (type: SlideType) => {
    setSlides((p) => {
      const next = [...p, makeSlide(type)];
      setSelected(next.length - 1);
      return next;
    });
    setPickerOpen(false);
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= slides.length) return;
    setSlides((p) => { const n = [...p]; [n[i], n[j]] = [n[j], n[i]]; return n; });
    setSelected(j);
  };
  const dup = (i: number) => {
    setSlides((p) => { const n = [...p]; n.splice(i + 1, 0, JSON.parse(JSON.stringify(p[i]))); return n; });
    setSelected(i + 1);
  };
  const del = (i: number) => {
    if (slides.length === 1) return;
    setSlides((p) => p.filter((_, x) => x !== i));
    setSelected((s) => Math.max(0, Math.min(s, slides.length - 2)));
  };

  const exportJson = () => {
    const payload = { id: 'custom-' + Date.now(), title, level, durationMin: 60, slides };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.json`; a.click();
    URL.revokeObjectURL(url);
  };
  const importJson = (file: File) => {
    const r = new FileReader();
    r.onload = () => {
      try {
        const p = JSON.parse(String(r.result));
        const s = Array.isArray(p) ? p : p.slides;
        if (!Array.isArray(s) || s.length === 0) throw new Error('Expected slides array');
        setSlides(s);
        if (p.title) setTitle(p.title);
        if (p.level) setLevel(p.level);
        setSelected(0);
      } catch (e: any) { alert('Invalid JSON: ' + e.message); }
    };
    r.readAsText(file);
  };

  const openClassroom = () => {
    (window as any).__ACADEMY_DECK__ = slides;
    navigate('/academy-classroom');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">E</div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-indigo-600 tracking-wider uppercase">Academy · Slide Creator</div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-bold text-slate-900 bg-transparent outline-none border-b border-transparent focus:border-indigo-400 w-full"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <select value={level} onChange={(e) => setLevel(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 bg-white">
              <option>A1</option><option>A2</option><option>B1</option><option>A2 / B1</option>
            </select>
            <label className="cursor-pointer inline-flex items-center gap-2 border border-slate-300 hover:border-indigo-400 text-slate-700 font-semibold rounded-lg px-3 py-2 text-sm transition">
              <Upload className="w-4 h-4" /> Import
              <input type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])} />
            </label>
            <button onClick={exportJson} className="inline-flex items-center gap-2 border border-slate-300 hover:border-indigo-400 text-slate-700 font-semibold rounded-lg px-3 py-2 text-sm transition">
              <Download className="w-4 h-4" /> Export
            </button>
            <button onClick={() => { setJsonDraft(JSON.stringify(slides, null, 2)); setJsonError(null); setJsonOpen(true); }}
              className="inline-flex items-center gap-2 border border-slate-300 hover:border-indigo-400 text-slate-700 font-semibold rounded-lg px-3 py-2 text-sm transition">
              <Code2 className="w-4 h-4" /> JSON
            </button>
            <button onClick={openClassroom} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg px-4 py-2 text-sm shadow-md transition">
              <Play className="w-4 h-4" /> Open in Classroom
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-4 p-4">
        {/* Left: slide list grouped by block */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3">
            <div className="flex items-center justify-between px-2 py-1 mb-2">
              <h2 className="text-xs font-bold text-indigo-600 tracking-wider uppercase">Slides · {slides.length}</h2>
              <button onClick={() => setPickerOpen(true)}
                className="inline-flex items-center gap-1 text-indigo-600 hover:bg-indigo-50 rounded-md px-2 py-1 text-xs font-bold">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            <div className="space-y-3 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
              {BLOCKS.map((b) => {
                const items = grouped[b.id];
                if (items.length === 0) return null;
                return (
                  <div key={b.id}>
                    <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase px-2 mb-1">{b.label}</div>
                    <div className="space-y-1">
                      {items.map(({ slide: s, idx }) => (
                        <button key={idx} onClick={() => setSelected(idx)}
                          className={`w-full text-left rounded-lg p-2 border transition ${
                            idx === selected ? 'border-indigo-500 bg-indigo-50' : 'border-transparent hover:bg-slate-50'
                          }`}>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                            <span className="font-semibold text-indigo-500">#{idx + 1} · {s.type}</span>
                            <div className="flex gap-0.5 opacity-0 group-hover:opacity-100">
                              <span onClick={(e) => { e.stopPropagation(); move(idx, -1); }} className="hover:text-indigo-600 cursor-pointer"><ChevronUp className="w-3 h-3" /></span>
                              <span onClick={(e) => { e.stopPropagation(); move(idx, 1); }} className="hover:text-indigo-600 cursor-pointer"><ChevronDown className="w-3 h-3" /></span>
                              <span onClick={(e) => { e.stopPropagation(); dup(idx); }} className="hover:text-indigo-600 cursor-pointer"><Copy className="w-3 h-3" /></span>
                              <span onClick={(e) => { e.stopPropagation(); del(idx); }} className="hover:text-red-500 cursor-pointer"><Trash2 className="w-3 h-3" /></span>
                            </div>
                          </div>
                          <div className="text-xs text-slate-700 truncate font-medium">{slideTitle(s)}</div>
                          <div className="flex gap-1 mt-1">
                            <button onClick={(e) => { e.stopPropagation(); move(idx, -1); }} className="text-slate-400 hover:text-indigo-600"><ChevronUp className="w-3 h-3" /></button>
                            <button onClick={(e) => { e.stopPropagation(); move(idx, 1); }} className="text-slate-400 hover:text-indigo-600"><ChevronDown className="w-3 h-3" /></button>
                            <button onClick={(e) => { e.stopPropagation(); dup(idx); }} className="text-slate-400 hover:text-indigo-600"><Copy className="w-3 h-3" /></button>
                            <button onClick={(e) => { e.stopPropagation(); del(idx); }} className="text-slate-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Middle: editor */}
        <section className="col-span-12 lg:col-span-5">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-indigo-600 tracking-wider uppercase">
                Edit · #{selected + 1} · {current.type}
              </h2>
              <select
                value={current.block}
                onChange={(e) => update({ block: e.target.value as Block } as any)}
                className="text-xs font-semibold border border-slate-300 rounded-md px-2 py-1 bg-white"
              >
                {BLOCKS.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
              </select>
            </div>
            <SlideEditor slide={current} onChange={update} />
          </div>
        </section>

        {/* Right: live preview */}
        <section className="col-span-12 lg:col-span-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 sticky top-24">
            <h2 className="text-xs font-bold text-indigo-600 tracking-wider uppercase mb-2 px-2">Live Preview</h2>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 min-h-[450px] flex items-center justify-center">
              <div className="w-full">
                <div className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-semibold mb-3 text-center">
                  {BLOCKS.find((b) => b.id === current.block)?.label}
                </div>
                <SlideRenderer slide={current} t={t} />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Add-slide picker modal */}
      {pickerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPickerOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Add a slide</h3>
              <button onClick={() => setPickerOpen(false)}><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {SLIDE_TYPES.map((s) => (
                <button key={s.type} onClick={() => addSlide(s.type)}
                  className="text-left p-3 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition">
                  <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">{s.defaultBlock}</div>
                  <div className="text-sm font-semibold text-slate-800">{s.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* JSON modal */}
      {jsonOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900">Edit Lesson JSON</h3>
              <button onClick={() => setJsonOpen(false)}><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <textarea value={jsonDraft} onChange={(e) => setJsonDraft(e.target.value)}
              className="flex-1 font-mono text-xs p-4 outline-none resize-none" spellCheck={false} />
            {jsonError && <div className="px-4 py-2 text-sm text-red-600 bg-red-50 border-t border-red-200">{jsonError}</div>}
            <div className="p-4 border-t border-slate-200 flex justify-end gap-2">
              <button onClick={() => setJsonOpen(false)} className="px-4 py-2 rounded-lg border border-slate-300 font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={() => {
                try {
                  const p = JSON.parse(jsonDraft);
                  if (!Array.isArray(p) || p.length === 0) throw new Error('Expected non-empty array of slides');
                  setSlides(p); setSelected(0); setJsonOpen(false);
                } catch (e: any) { setJsonError(e.message); }
              }} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md">Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Type-aware editor ─────────────────────────────────────────────────────
function SlideEditor({ slide, onChange }: { slide: Slide; onChange: (p: Partial<Slide>) => void }) {
  switch (slide.type) {
    case 'intro':
      return (
        <div className="space-y-3">
          <Field label="Title"><input className={inputCls} value={slide.title} onChange={(e) => onChange({ title: e.target.value } as any)} /></Field>
          <Field label="Subtitle"><input className={inputCls} value={slide.subtitle || ''} onChange={(e) => onChange({ subtitle: e.target.value } as any)} /></Field>
        </div>
      );
    case 'question':
      return (
        <div className="space-y-3">
          <Field label="Prompt"><input className={inputCls} value={slide.prompt} onChange={(e) => onChange({ prompt: e.target.value } as any)} /></Field>
          <Field label="Placeholder"><input className={inputCls} value={slide.placeholder || ''} onChange={(e) => onChange({ placeholder: e.target.value } as any)} /></Field>
        </div>
      );
    case 'opinion':
    case 'reflection':
    case 'debate_scale':
      return <Field label="Prompt"><textarea className={inputCls + ' h-24'} value={slide.prompt} onChange={(e) => onChange({ prompt: e.target.value } as any)} /></Field>;

    case 'poll':
      return (
        <div className="space-y-3">
          <Field label="Prompt"><input className={inputCls} value={slide.prompt} onChange={(e) => onChange({ prompt: e.target.value } as any)} /></Field>
          <div>
            <span className={labelCls}>Options & %</span>
            <div className="space-y-2">
              {slide.options.map((o, i) => (
                <div key={i} className="flex gap-2">
                  <input className={inputCls + ' flex-1'} value={o.label}
                    onChange={(e) => { const n = [...slide.options]; n[i] = { ...o, label: e.target.value }; onChange({ options: n } as any); }} />
                  <input type="number" className={inputCls + ' w-20'} value={o.pct}
                    onChange={(e) => { const n = [...slide.options]; n[i] = { ...o, pct: Number(e.target.value) }; onChange({ options: n } as any); }} />
                  <button onClick={() => onChange({ options: slide.options.filter((_, j) => j !== i) } as any)} className="text-red-500 hover:bg-red-50 rounded-lg px-2"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            <button onClick={() => onChange({ options: [...slide.options, { label: 'New option', pct: 0 }] } as any)}
              className="mt-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded px-2 py-1 inline-flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add option
            </button>
          </div>
        </div>
      );

    case 'vocab':
      return (
        <div className="space-y-3">
          <Field label="Word"><input className={inputCls} value={slide.word} onChange={(e) => onChange({ word: e.target.value } as any)} /></Field>
          <Field label="Definition"><input className={inputCls} value={slide.definition} onChange={(e) => onChange({ definition: e.target.value } as any)} /></Field>
          <Field label="Example"><input className={inputCls} value={slide.example || ''} onChange={(e) => onChange({ example: e.target.value } as any)} /></Field>
        </div>
      );

    case 'matching':
      return (
        <div className="space-y-3">
          <Field label="Prompt"><input className={inputCls} value={slide.prompt} onChange={(e) => onChange({ prompt: e.target.value } as any)} /></Field>
          <div>
            <span className={labelCls}>Pairs</span>
            <div className="space-y-2">
              {slide.pairs.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <input className={inputCls + ' flex-1'} placeholder="Left" value={p.left}
                    onChange={(e) => { const n = [...slide.pairs]; n[i] = { ...p, left: e.target.value }; onChange({ pairs: n } as any); }} />
                  <input className={inputCls + ' flex-1'} placeholder="Right" value={p.right}
                    onChange={(e) => { const n = [...slide.pairs]; n[i] = { ...p, right: e.target.value }; onChange({ pairs: n } as any); }} />
                  <button onClick={() => onChange({ pairs: slide.pairs.filter((_, j) => j !== i) } as any)} className="text-red-500 hover:bg-red-50 rounded-lg px-2"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            <button onClick={() => onChange({ pairs: [...slide.pairs, { left: '', right: '' }] } as any)}
              className="mt-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded px-2 py-1 inline-flex items-center gap-1"><Plus className="w-3 h-3" /> Add pair</button>
          </div>
        </div>
      );

    case 'reading_passage':
      return (
        <div className="space-y-3">
          <Field label="Title"><input className={inputCls} value={slide.title} onChange={(e) => onChange({ title: e.target.value } as any)} /></Field>
          <Field label="Passage"><textarea className={inputCls + ' h-40'} value={slide.passage} onChange={(e) => onChange({ passage: e.target.value } as any)} /></Field>
        </div>
      );

    case 'listening':
      return (
        <div className="space-y-3">
          <Field label="Prompt"><input className={inputCls} value={slide.prompt} onChange={(e) => onChange({ prompt: e.target.value } as any)} /></Field>
          <Field label="Transcript (used for voice playback)"><textarea className={inputCls + ' h-32'} value={slide.transcript} onChange={(e) => onChange({ transcript: e.target.value } as any)} /></Field>
        </div>
      );

    case 'multiple':
      return (
        <div className="space-y-3">
          <Field label="Question"><input className={inputCls} value={slide.question} onChange={(e) => onChange({ question: e.target.value } as any)} /></Field>
          <Field label="Options (one per line)">
            <textarea className={inputCls + ' h-24'} value={slide.options.join('\n')}
              onChange={(e) => onChange({ options: e.target.value.split('\n').filter(Boolean) } as any)} />
          </Field>
          <Field label="Correct Answer">
            <select className={inputCls} value={slide.answer} onChange={(e) => onChange({ answer: e.target.value } as any)}>
              {slide.options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
        </div>
      );

    case 'truefalse':
      return (
        <div className="space-y-3">
          <Field label="Statement"><input className={inputCls} value={slide.statement} onChange={(e) => onChange({ statement: e.target.value } as any)} /></Field>
          <Field label="Answer">
            <select className={inputCls} value={slide.answer ? 'true' : 'false'} onChange={(e) => onChange({ answer: e.target.value === 'true' } as any)}>
              <option value="true">True</option><option value="false">False</option>
            </select>
          </Field>
        </div>
      );

    case 'grammar_pattern':
      return (
        <div className="space-y-3">
          <Field label="Title"><input className={inputCls} value={slide.title} onChange={(e) => onChange({ title: e.target.value } as any)} /></Field>
          <Field label="Rule"><input className={inputCls} value={slide.rule || ''} onChange={(e) => onChange({ rule: e.target.value } as any)} /></Field>
          <div>
            <span className={labelCls}>Comparison rows</span>
            <div className="space-y-2">
              {slide.rows.map((r, i) => (
                <div key={i} className="flex gap-2">
                  <input className={inputCls + ' flex-1'} placeholder="Column A" value={r.a}
                    onChange={(e) => { const n = [...slide.rows]; n[i] = { ...r, a: e.target.value }; onChange({ rows: n } as any); }} />
                  <input className={inputCls + ' flex-1'} placeholder="Column B" value={r.b}
                    onChange={(e) => { const n = [...slide.rows]; n[i] = { ...r, b: e.target.value }; onChange({ rows: n } as any); }} />
                  <button onClick={() => onChange({ rows: slide.rows.filter((_, j) => j !== i) } as any)} className="text-red-500 hover:bg-red-50 rounded-lg px-2"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            <button onClick={() => onChange({ rows: [...slide.rows, { a: '', b: '' }] } as any)} className="mt-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded px-2 py-1 inline-flex items-center gap-1"><Plus className="w-3 h-3" /> Add row</button>
          </div>
        </div>
      );

    case 'error_detection':
      return (
        <div className="space-y-3">
          <Field label="Prompt"><input className={inputCls} value={slide.prompt} onChange={(e) => onChange({ prompt: e.target.value } as any)} /></Field>
          <Field label="Sentence"><input className={inputCls} value={slide.sentence} onChange={(e) => onChange({ sentence: e.target.value } as any)} /></Field>
          <Field label={`Wrong word index (0…${slide.sentence.split(' ').length - 1})`}>
            <input type="number" className={inputCls} value={slide.wrongIndex} onChange={(e) => onChange({ wrongIndex: Number(e.target.value) } as any)} />
          </Field>
          <div className="text-xs text-slate-500">Words: {slide.sentence.split(' ').map((w, i) => <span key={i} className={i === slide.wrongIndex ? 'text-red-500 font-bold' : ''}>{w} </span>)}</div>
        </div>
      );

    case 'correction':
      return (
        <div className="space-y-3">
          <Field label="Prompt"><input className={inputCls} value={slide.prompt} onChange={(e) => onChange({ prompt: e.target.value } as any)} /></Field>
          <Field label="Wrong sentence"><input className={inputCls} value={slide.wrong} onChange={(e) => onChange({ wrong: e.target.value } as any)} /></Field>
          <Field label="Correct sentence"><input className={inputCls} value={slide.answer} onChange={(e) => onChange({ answer: e.target.value } as any)} /></Field>
        </div>
      );

    case 'fill_blank':
      return (
        <div className="space-y-3">
          <Field label="Prompt"><input className={inputCls} value={slide.prompt} onChange={(e) => onChange({ prompt: e.target.value } as any)} /></Field>
          <div className="grid grid-cols-3 gap-2">
            <Field label="Before"><input className={inputCls} value={slide.before} onChange={(e) => onChange({ before: e.target.value } as any)} /></Field>
            <Field label="Answer"><input className={inputCls} value={slide.answer} onChange={(e) => onChange({ answer: e.target.value } as any)} /></Field>
            <Field label="After"><input className={inputCls} value={slide.after} onChange={(e) => onChange({ after: e.target.value } as any)} /></Field>
          </div>
        </div>
      );

    case 'sentence_builder':
      return (
        <div className="space-y-3">
          <Field label="Prompt"><input className={inputCls} value={slide.prompt} onChange={(e) => onChange({ prompt: e.target.value } as any)} /></Field>
          <Field label="Word bank (comma separated, will be shuffled)">
            <input className={inputCls} value={slide.words.join(', ')}
              onChange={(e) => onChange({ words: e.target.value.split(',').map((w) => w.trim()).filter(Boolean) } as any)} />
          </Field>
          <Field label="Correct order (comma separated)">
            <input className={inputCls} value={slide.answer.join(', ')}
              onChange={(e) => onChange({ answer: e.target.value.split(',').map((w) => w.trim()).filter(Boolean) } as any)} />
          </Field>
        </div>
      );

    case 'role_play':
      return (
        <div className="space-y-3">
          <Field label="Title"><input className={inputCls} value={slide.title} onChange={(e) => onChange({ title: e.target.value } as any)} /></Field>
          <Field label="Speaker A"><input className={inputCls} value={slide.lineA} onChange={(e) => onChange({ lineA: e.target.value } as any)} /></Field>
          <Field label="Speaker B"><input className={inputCls} value={slide.lineB} onChange={(e) => onChange({ lineB: e.target.value } as any)} /></Field>
        </div>
      );

    case 'speaking_task':
      return (
        <div className="space-y-3">
          <Field label="Prompt"><textarea className={inputCls + ' h-20'} value={slide.prompt} onChange={(e) => onChange({ prompt: e.target.value } as any)} /></Field>
          <Field label="Sentence starters (one per line, optional)">
            <textarea className={inputCls + ' h-24'} value={(slide.starters || []).join('\n')}
              onChange={(e) => onChange({ starters: e.target.value.split('\n').filter(Boolean) } as any)} />
          </Field>
        </div>
      );

    case 'cluster': {
      const update = (next: ClusterActivity[]) => onChange({ activities: next } as any);
      const blank = (type: ClusterActivity['type']): ClusterActivity => {
        switch (type) {
          case 'mcq': return { type, question: 'New question?', options: ['A', 'B', 'C'], answer: 'A' };
          case 'fill': return { type, text: 'Fill ___ blank.', answer: 'the' };
          case 'tf': return { type, statement: 'New statement.', answer: true };
          case 'build': return { type, prompt: 'Build the sentence.', words: ['I', 'am', 'here'], answer: ['I', 'am', 'here'] };
        }
      };
      return (
        <div className="space-y-3">
          <Field label="Slide title"><input className={inputCls} value={slide.title} onChange={(e) => onChange({ title: e.target.value } as any)} /></Field>
          <Field label="Intro / context (optional)">
            <textarea className={inputCls + ' h-16'} value={slide.content || ''} onChange={(e) => onChange({ content: e.target.value } as any)} />
          </Field>
          <div>
            <span className={labelCls}>Activities ({slide.activities.length})</span>
            <div className="space-y-3">
              {slide.activities.map((a, i) => (
                <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">#{i + 1} · {a.type}</span>
                    <button onClick={() => update(slide.activities.filter((_, j) => j !== i))} className="text-red-500 hover:bg-red-50 rounded px-2 py-1 text-xs"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                  {a.type === 'mcq' && (
                    <>
                      <input className={inputCls} value={a.question} onChange={(e) => { const n = [...slide.activities]; n[i] = { ...a, question: e.target.value }; update(n); }} />
                      <input className={inputCls} value={a.options.join(', ')} placeholder="Options (comma separated)"
                        onChange={(e) => { const opts = e.target.value.split(',').map((w) => w.trim()).filter(Boolean); const n = [...slide.activities]; n[i] = { ...a, options: opts }; update(n); }} />
                      <input className={inputCls} value={a.answer} placeholder="Correct answer (must match an option)"
                        onChange={(e) => { const n = [...slide.activities]; n[i] = { ...a, answer: e.target.value }; update(n); }} />
                      <input className={inputCls} value={a.explanation || ''} placeholder="Explanation when wrong (optional)"
                        onChange={(e) => { const n = [...slide.activities]; n[i] = { ...a, explanation: e.target.value }; update(n); }} />
                    </>
                  )}
                  {a.type === 'fill' && (
                    <>
                      <input className={inputCls} value={a.text} placeholder="Sentence with ___"
                        onChange={(e) => { const n = [...slide.activities]; n[i] = { ...a, text: e.target.value }; update(n); }} />
                      <input className={inputCls} value={a.answer} placeholder="Answer"
                        onChange={(e) => { const n = [...slide.activities]; n[i] = { ...a, answer: e.target.value }; update(n); }} />
                    </>
                  )}
                  {a.type === 'tf' && (
                    <>
                      <input className={inputCls} value={a.statement} placeholder="Statement"
                        onChange={(e) => { const n = [...slide.activities]; n[i] = { ...a, statement: e.target.value }; update(n); }} />
                      <select className={inputCls} value={a.answer ? 'true' : 'false'}
                        onChange={(e) => { const n = [...slide.activities]; n[i] = { ...a, answer: e.target.value === 'true' }; update(n); }}>
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
                    </>
                  )}
                  {a.type === 'build' && (
                    <>
                      <input className={inputCls} value={a.prompt || ''} placeholder="Prompt"
                        onChange={(e) => { const n = [...slide.activities]; n[i] = { ...a, prompt: e.target.value }; update(n); }} />
                      <input className={inputCls} value={a.words.join(', ')} placeholder="Word bank (comma separated)"
                        onChange={(e) => { const words = e.target.value.split(',').map((w) => w.trim()).filter(Boolean); const n = [...slide.activities]; n[i] = { ...a, words }; update(n); }} />
                      <input className={inputCls} value={a.answer.join(', ')} placeholder="Correct order (comma separated)"
                        onChange={(e) => { const answer = e.target.value.split(',').map((w) => w.trim()).filter(Boolean); const n = [...slide.activities]; n[i] = { ...a, answer }; update(n); }} />
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {(['mcq', 'fill', 'tf', 'build'] as const).map((tp) => (
                <button key={tp} onClick={() => update([...slide.activities, blank(tp)])}
                  className="text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg px-3 py-1.5 inline-flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add {tp.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }
  }
}
