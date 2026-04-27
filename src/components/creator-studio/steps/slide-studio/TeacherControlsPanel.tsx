import React, { useRef, useState } from 'react';
import {
  Mic, Type, ListChecks, Pencil, ImageIcon, Layers, LayoutTemplate, Plus, Minus,
  Volume2, Sparkles, Video, Upload, Copy, Check, Loader2, Trash2, Music, Wand2,
  FileText, Palette, Headphones, Play,
} from 'lucide-react';
import {
  PPPSlide, SlideType, LayoutStyle,
  MCQData, FlashcardData, DrawingData,
  DragAndMatchData, DragAndMatchPair, FillInTheGapsData,
  isGameSlideType,
} from '../../CreatorContext';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PHASE_STYLES, normalizePhase } from './phaseTheme';
import { cn } from '@/lib/utils';
import { useCreator } from '../../CreatorContext';
import { uploadSlideAsset } from './uploadSlideAsset';
import {
  generateSlideImage, generateSlideVoiceover, generateSlideMusic,
} from './mediaGeneration';
import { toast } from 'sonner';

interface Props {
  slide: PPPSlide;
  onChange: (patch: Partial<PPPSlide>) => void;
}

const DEFAULT_MCQ: MCQData = {
  question: 'Which option is correct?',
  options: ['Option A', 'Option B', 'Option C', 'Option D'],
  correct_index: 0,
};
const DEFAULT_FLASHCARD: FlashcardData = { front: 'apple', back: 'a round red fruit' };
const DEFAULT_DRAWING: DrawingData = { prompt: 'Draw your answer in your notebook and share with the class.' };
const DEFAULT_DRAG_MATCH: DragAndMatchData = {
  instruction: 'Drag each word to its match!',
  pairs: [
    { left_item: '', right_item: '' },
    { left_item: '', right_item: '' },
    { left_item: '', right_item: '' },
  ],
};
const DEFAULT_FILL_GAPS: FillInTheGapsData = {
  instruction: 'Fill in the gap!',
  sentence_parts: ['The cat is on the ', '.'],
  missing_word: 'mat',
  distractors: ['hat', 'rat'],
};

const TYPE_OPTIONS: { value: SlideType; label: string; Icon: React.ElementType }[] = [
  { value: 'text_image', label: 'Story / Reading (Mascot Speech)', Icon: ImageIcon },
  { value: 'flashcard', label: 'Flashcard Flip', Icon: Layers },
  { value: 'drawing_prompt', label: 'Drawing Canvas', Icon: Pencil },
  { value: 'multiple_choice', label: 'Multiple Choice Game', Icon: ListChecks },
  { value: 'drag_and_match', label: 'Drag & Match Game', Icon: Layers },
  { value: 'fill_in_the_gaps', label: 'Fill in the Gaps', Icon: Type },
];

const LAYOUT_OPTIONS: { value: LayoutStyle; label: string }[] = [
  { value: 'full_background', label: 'Full Background' },
  { value: 'center_card', label: 'Center Card' },
  { value: 'split_left', label: 'Split — Image Left' },
  { value: 'split_right', label: 'Split — Image Right' },
];

// ----------------- Type-specific editors -----------------

const TextImageEditor: React.FC<Props> = ({ slide, onChange }) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">On-slide content</Label>
    <Textarea
      rows={5}
      value={slide.content ?? ''}
      onChange={(e) => onChange({ content: e.target.value })}
      placeholder="1–3 short sentences for the slide…"
      className="text-sm resize-none"
    />
  </div>
);

const MCQEditor: React.FC<Props> = ({ slide, onChange }) => {
  const data = (slide.interactive_data ?? {}) as Partial<MCQData>;
  const mcq: MCQData = {
    question: data.question ?? '',
    options: Array.isArray(data.options) && data.options.length ? data.options : ['', '', '', ''],
    correct_index: typeof data.correct_index === 'number' ? data.correct_index : 0,
  };
  const update = (patch: Partial<MCQData>) =>
    onChange({ interactive_data: { ...mcq, ...patch } });
  const setOption = (i: number, value: string) => {
    const options = [...mcq.options];
    options[i] = value;
    update({ options });
  };
  const addOption = () => {
    if (mcq.options.length >= 6) return;
    update({ options: [...mcq.options, ''] });
  };
  const removeOption = (i: number) => {
    if (mcq.options.length <= 2) return;
    const options = mcq.options.filter((_, idx) => idx !== i);
    let correct_index = mcq.correct_index;
    if (i === mcq.correct_index) correct_index = 0;
    else if (i < mcq.correct_index) correct_index -= 1;
    update({ options, correct_index });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Question</Label>
        <Textarea
          rows={2}
          value={mcq.question}
          onChange={(e) => update({ question: e.target.value })}
          placeholder="Ask a clear question…"
          className="text-sm resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Options</Label>
          <Button type="button" size="sm" variant="ghost" onClick={addOption}
            disabled={mcq.options.length >= 6} className="h-7 px-2 text-xs">
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
        </div>
        <ul className="space-y-1.5">
          {mcq.options.map((opt, i) => {
            const isCorrect = i === mcq.correct_index;
            return (
              <li key={i} className={cn('flex items-center gap-2 rounded-lg border p-2',
                isCorrect ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900')}>
                <input type="radio" name={`mcq-${slide.id}`} checked={isCorrect}
                  onChange={() => update({ correct_index: i })}
                  className="h-4 w-4 accent-emerald-500"
                  aria-label={`Mark option ${String.fromCharCode(65 + i)} as correct`} />
                <span className="text-[10px] font-mono text-slate-400 w-3">{String.fromCharCode(65 + i)}</span>
                <Input value={opt} onChange={(e) => setOption(i, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + i)}`} className="h-8 text-sm" />
                <Button type="button" size="sm" variant="ghost" onClick={() => removeOption(i)}
                  disabled={mcq.options.length <= 2}
                  className="h-7 w-7 p-0 text-slate-400 hover:text-red-500" aria-label="Remove option">
                  <Minus className="h-3.5 w-3.5" />
                </Button>
              </li>
            );
          })}
        </ul>
        <p className="text-[11px] text-slate-400">Use the radio button to mark the correct answer.</p>
      </div>
    </div>
  );
};

const FlashcardEditor: React.FC<Props> = ({ slide, onChange }) => {
  const data = (slide.interactive_data ?? {}) as Partial<FlashcardData>;
  const front = data.front ?? '';
  const back = data.back ?? '';
  const update = (patch: Partial<FlashcardData>) =>
    onChange({ interactive_data: { front, back, ...patch } });
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Front Face</Label>
        <Input value={front} onChange={(e) => update({ front: e.target.value })} placeholder="e.g. apple" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Back Face</Label>
        <Textarea rows={3} value={back} onChange={(e) => update({ back: e.target.value })}
          placeholder="e.g. a round red fruit" className="text-sm resize-none" />
      </div>
    </div>
  );
};

const DragAndMatchEditor: React.FC<Props> = ({ slide, onChange }) => {
  const data = (slide.interactive_data ?? {}) as Partial<DragAndMatchData>;
  const instruction = data.instruction ?? '';
  const pairs: DragAndMatchPair[] = Array.isArray(data.pairs) && data.pairs.length
    ? data.pairs.map((p) => ({
        left_item: p.left_item ?? '',
        left_thumbnail_keyword: p.left_thumbnail_keyword ?? '',
        left_thumbnail_url: p.left_thumbnail_url,
        right_item: p.right_item ?? '',
        right_thumbnail_keyword: p.right_thumbnail_keyword ?? '',
        right_thumbnail_url: p.right_thumbnail_url,
      }))
    : [{ left_item: '', right_item: '' }];

  const update = (patch: Partial<DragAndMatchData>) =>
    onChange({ interactive_data: { instruction, pairs, ...patch } });
  const setPair = (i: number, patch: Partial<DragAndMatchPair>) => {
    const next = pairs.map((p, idx) => (idx === i ? { ...p, ...patch } : p));
    update({ pairs: next });
  };
  const addPair = () => {
    if (pairs.length >= 3) return;
    update({ pairs: [...pairs, { left_item: '', right_item: '' }] });
  };
  const removePair = (i: number) => {
    if (pairs.length <= 1) return;
    update({ pairs: pairs.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Instruction</Label>
        <Input value={instruction} onChange={(e) => update({ instruction: e.target.value })}
          placeholder='e.g. "Match the word to the picture!"' />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Pairs ({pairs.length}/3)
          </Label>
          <Button type="button" size="sm" variant="ghost" onClick={addPair}
            disabled={pairs.length >= 3} className="h-7 px-2 text-xs">
            <Plus className="h-3 w-3 mr-1" /> Add pair
          </Button>
        </div>
        <ul className="space-y-2">
          {pairs.map((p, i) => (
            <li key={i} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400 w-5">#{i + 1}</span>
                {p.left_thumbnail_url && (
                  <img src={p.left_thumbnail_url} alt="" className="h-7 w-7 rounded object-cover border border-slate-200" />
                )}
                <Input value={p.left_item} onChange={(e) => setPair(i, { left_item: e.target.value })}
                  placeholder="Left item" className="h-8 text-sm" />
                <span className="text-slate-400 text-sm">↔</span>
                {p.right_thumbnail_url && (
                  <img src={p.right_thumbnail_url} alt="" className="h-7 w-7 rounded object-cover border border-slate-200" />
                )}
                <Input value={p.right_item} onChange={(e) => setPair(i, { right_item: e.target.value })}
                  placeholder="Right item" className="h-8 text-sm" />
                <Button type="button" size="sm" variant="ghost" onClick={() => removePair(i)}
                  disabled={pairs.length <= 1}
                  className="h-7 w-7 p-0 text-slate-400 hover:text-red-500" aria-label="Remove pair">
                  <Minus className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input value={p.left_thumbnail_keyword ?? ''}
                  onChange={(e) => setPair(i, { left_thumbnail_keyword: e.target.value })}
                  placeholder="Left thumbnail keyword (optional)"
                  className="h-7 text-[11px]" />
                <Input value={p.right_thumbnail_keyword ?? ''}
                  onChange={(e) => setPair(i, { right_thumbnail_keyword: e.target.value })}
                  placeholder="Right thumbnail keyword (optional)"
                  className="h-7 text-[11px]" />
              </div>
            </li>
          ))}
        </ul>
        <p className="text-[11px] text-slate-400">Tablet-friendly cap: 3 pairs max. Add a thumbnail keyword to attach a small icon to that card.</p>
      </div>
    </div>
  );
};

const FillInTheGapsEditor: React.FC<Props> = ({ slide, onChange }) => {
  const data = (slide.interactive_data ?? {}) as Partial<FillInTheGapsData>;
  const instruction = data.instruction ?? '';
  const parts: [string, string] = Array.isArray(data.sentence_parts) && data.sentence_parts.length === 2
    ? [data.sentence_parts[0] ?? '', data.sentence_parts[1] ?? '']
    : ['', ''];
  const missing = data.missing_word ?? '';
  const distractors: string[] = Array.isArray(data.distractors)
    ? data.distractors.filter((x) => typeof x === 'string')
    : ['', ''];

  const update = (patch: Partial<FillInTheGapsData>) =>
    onChange({ interactive_data: { instruction, sentence_parts: parts, missing_word: missing, distractors, ...patch } });
  const setDistractor = (i: number, value: string) => {
    const next = [...distractors];
    next[i] = value;
    update({ distractors: next });
  };
  const addDistractor = () => {
    if (distractors.length >= 3) return;
    update({ distractors: [...distractors, ''] });
  };
  const removeDistractor = (i: number) => {
    if (distractors.length <= 1) return;
    update({ distractors: distractors.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Instruction</Label>
        <Input value={instruction} onChange={(e) => update({ instruction: e.target.value })}
          placeholder='e.g. "Fill in the gap!"' />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Sentence (with the gap)</Label>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <Input value={parts[0]} onChange={(e) => update({ sentence_parts: [e.target.value, parts[1]] })}
            placeholder="Before the gap…" className="h-9 text-sm" />
          <span className="text-amber-500 font-bold tracking-widest">___</span>
          <Input value={parts[1]} onChange={(e) => update({ sentence_parts: [parts[0], e.target.value] })}
            placeholder="…after the gap" className="h-9 text-sm" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-bold uppercase tracking-wider text-emerald-600">Correct word</Label>
        <Input value={missing} onChange={(e) => update({ missing_word: e.target.value })}
          placeholder="The word that fills the gap" className="h-9 text-sm border-emerald-300 bg-emerald-50/50" />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Distractors ({distractors.length}/3)</Label>
          <Button type="button" size="sm" variant="ghost" onClick={addDistractor}
            disabled={distractors.length >= 3} className="h-7 px-2 text-xs">
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
        </div>
        <ul className="space-y-1.5">
          {distractors.map((d, i) => (
            <li key={i} className="flex items-center gap-2">
              <Input value={d} onChange={(e) => setDistractor(i, e.target.value)}
                placeholder={`Distractor ${i + 1}`} className="h-8 text-sm" />
              <Button type="button" size="sm" variant="ghost" onClick={() => removeDistractor(i)}
                disabled={distractors.length <= 1}
                className="h-7 w-7 p-0 text-slate-400 hover:text-red-500" aria-label="Remove distractor">
                <Minus className="h-3.5 w-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const DrawingEditor: React.FC<Props> = ({ slide, onChange }) => {
  const data = (slide.interactive_data ?? {}) as Partial<DrawingData>;
  const prompt = data.prompt ?? slide.content ?? '';
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Drawing Prompt</Label>
      <Textarea rows={4} value={prompt}
        onChange={(e) => onChange({ interactive_data: { prompt: e.target.value }, content: e.target.value })}
        placeholder="What should learners draw?" className="text-sm resize-none" />
    </div>
  );
};

// ----------------- Helpers -----------------

const CopyButton: React.FC<{ value: string }> = ({ value }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Could not copy to clipboard.');
    }
  };
  return (
    <button type="button" onClick={handleCopy} disabled={!value}
      className="text-[10px] inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 disabled:opacity-40">
      {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
};

const PromptField: React.FC<{
  label: string; icon: React.ElementType; value: string;
  onChange: (v: string) => void; placeholder: string; rows?: number;
}> = ({ label, icon: Icon, value, onChange, placeholder, rows = 3 }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 inline-flex items-center gap-1.5">
        <Icon className="h-3 w-3" /> {label}
      </Label>
      <CopyButton value={value} />
    </div>
    <Textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder} className="text-sm resize-none leading-relaxed" />
  </div>
);

// ----------------- Main panel (tabbed Media Suite) -----------------

export const TeacherControlsPanel: React.FC<Props> = ({ slide, onChange }) => {
  const phaseKey = normalizePhase(slide.phase as string);
  const style = PHASE_STYLES[phaseKey];

  const handleTypeChange = (next: SlideType) => {
    if (next === slide.slide_type) return;
    if (next === 'multiple_choice') onChange({ slide_type: next, interactive_data: { ...DEFAULT_MCQ } });
    else if (next === 'flashcard') onChange({ slide_type: next, interactive_data: { ...DEFAULT_FLASHCARD } });
    else if (next === 'drawing_prompt')
      onChange({ slide_type: next, interactive_data: { ...DEFAULT_DRAWING }, content: DEFAULT_DRAWING.prompt });
    else if (next === 'drag_and_match')
      onChange({ slide_type: next, interactive_data: { ...DEFAULT_DRAG_MATCH, pairs: DEFAULT_DRAG_MATCH.pairs.map((p) => ({ ...p })) } });
    else if (next === 'fill_in_the_gaps')
      onChange({ slide_type: next, interactive_data: { ...DEFAULT_FILL_GAPS, sentence_parts: [...DEFAULT_FILL_GAPS.sentence_parts] as [string, string], distractors: [...DEFAULT_FILL_GAPS.distractors] } });
    else onChange({ slide_type: next, interactive_data: {} });
  };

  return (
    <aside className="w-[360px] shrink-0 h-full overflow-y-auto bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
      {/* Phase chip */}
      <div className="px-5 pt-5 pb-3 border-b border-slate-200/70 dark:border-slate-800/70">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
          Phase
        </div>
        <span className={cn('inline-flex text-xs font-bold px-2 py-1 rounded', style.chip)}>{style.label}</span>
        <p className="text-[11px] text-slate-400 mt-1.5">Phase is locked by the blueprint.</p>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="sticky top-0 z-10 grid grid-cols-3 mx-5 mt-4 bg-slate-100 dark:bg-slate-800/60">
          <TabsTrigger value="content" className="text-xs gap-1.5">
            <FileText className="h-3.5 w-3.5" /> Content
          </TabsTrigger>
          <TabsTrigger value="visuals" className="text-xs gap-1.5">
            <Palette className="h-3.5 w-3.5" /> Visuals
          </TabsTrigger>
          <TabsTrigger value="audio" className="text-xs gap-1.5">
            <Headphones className="h-3.5 w-3.5" /> Audio
          </TabsTrigger>
        </TabsList>

        {/* ========================= CONTENT TAB ========================= */}
        <TabsContent value="content" className="px-5 pb-6 space-y-5 mt-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Slide Type</Label>
              <Select value={slide.slide_type ?? 'text_image'} onValueChange={(v) => handleTypeChange(v as SlideType)}>
                <SelectTrigger>
                  <SelectValue placeholder={slide.slide_type ?? 'text_image'}>
                    {(() => {
                      const opt = TYPE_OPTIONS.find((o) => o.value === slide.slide_type);
                      return opt ? opt.label : (slide.slide_type ?? 'text_image');
                    })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map(({ value, label, Icon }) => (
                    <SelectItem key={value} value={value}>
                      <span className="inline-flex items-center gap-2"><Icon className="h-3.5 w-3.5" /> {label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 inline-flex items-center gap-1.5">
                <LayoutTemplate className="h-3 w-3" /> Layout
              </Label>
              <Select value={slide.layout_style ?? 'full_background'}
                onValueChange={(v) => onChange({ layout_style: v as LayoutStyle })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LAYOUT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Type-aware editor */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-950/40">
            {slide.slide_type === 'multiple_choice' ? (
              <MCQEditor slide={slide} onChange={onChange} />
            ) : slide.slide_type === 'flashcard' ? (
              <FlashcardEditor slide={slide} onChange={onChange} />
            ) : slide.slide_type === 'drawing_prompt' ? (
              <DrawingEditor slide={slide} onChange={onChange} />
            ) : slide.slide_type === 'drag_and_match' ? (
              <DragAndMatchEditor slide={slide} onChange={onChange} />
            ) : slide.slide_type === 'fill_in_the_gaps' ? (
              <FillInTheGapsEditor slide={slide} onChange={onChange} />
            ) : (
              <TextImageEditor slide={slide} onChange={onChange} />
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 inline-flex items-center gap-1.5">
              <Mic className="h-3 w-3" /> Teacher Script
            </Label>
            <Textarea rows={5} value={slide.teacher_script ?? slide.teacher_instructions ?? ''}
              onChange={(e) => onChange({ teacher_script: e.target.value })}
              placeholder="2–3 high-energy sentences for the teacher to read…"
              className="resize-none text-sm leading-relaxed" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 inline-flex items-center gap-1.5">
              <Type className="h-3 w-3" /> Visual Keyword
            </Label>
            <Input value={slide.visual_keyword ?? ''}
              onChange={(e) => onChange({ visual_keyword: e.target.value })}
              placeholder="e.g. autumn forest" />
            <p className="text-[11px] text-slate-400">Fallback only — used when no AI / uploaded asset exists.</p>
          </div>
        </TabsContent>

        {/* ========================= VISUALS TAB ========================= */}
        <TabsContent value="visuals" className="px-5 pb-6 space-y-4 mt-4">
          <VisualsPanel slide={slide} onChange={onChange} />
        </TabsContent>

        {/* ========================= AUDIO TAB ========================= */}
        <TabsContent value="audio" className="px-5 pb-6 space-y-4 mt-4">
          <AudioPanel slide={slide} onChange={onChange} />
        </TabsContent>
      </Tabs>
    </aside>
  );
};

// ============================================================
// VISUALS PANEL — Image (Nano Banana 2) + Video (stub) + Upload
// ============================================================

const VisualsPanel: React.FC<Props> = ({ slide, onChange }) => {
  const { activeLessonData } = useCreator();
  const lessonId = activeLessonData?.lesson_id ?? activeLessonData?.source_lesson?.id ?? 'draft';
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleGenerateImage = async () => {
    const prompt = (slide.image_generation_prompt || slide.visual_keyword || slide.title || '').trim();
    if (!prompt) {
      toast.error('Add an image prompt first.');
      return;
    }
    try {
      setGenerating(true);
      const { url } = await generateSlideImage(prompt, lessonId, slide.id);
      onChange({ custom_image_url: url, custom_video_url: undefined });
      toast.success('AI image generated and attached.');
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message || 'Image generation failed.');
    } finally {
      setGenerating(false);
    }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) { toast.error('File is too large (25 MB max).'); return; }
    try {
      setUploading(true);
      const { url, kind } = await uploadSlideAsset(file, lessonId);
      if (kind === 'video') onChange({ custom_video_url: url, custom_image_url: undefined });
      else onChange({ custom_image_url: url, custom_video_url: undefined });
      toast.success(`${kind === 'video' ? 'Video' : 'Image'} uploaded.`);
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const clearAsset = () => onChange({ custom_image_url: undefined, custom_video_url: undefined });
  const hasAsset = !!(slide.custom_image_url || slide.custom_video_url);
  const isGame = isGameSlideType(slide.slide_type);

  return (
    <div className="space-y-4">
      {isGame && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/40 px-3 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <Label className="text-xs font-bold text-amber-900 dark:text-amber-200">
                🎮 Full-screen game mode
              </Label>
              <p className="text-[11px] text-amber-700/80 dark:text-amber-300/80 mt-0.5">
                Hero image hidden so the game fills the slide. Toggle on to force one.
              </p>
            </div>
            <Switch checked={!!slide.force_hero_image}
              onCheckedChange={(v) => onChange({ force_hero_image: v })} />
          </div>
        </div>
      )}
      <PromptField
        label="Image Prompt"
        icon={ImageIcon}
        value={slide.image_generation_prompt ?? ''}
        onChange={(v) => onChange({ image_generation_prompt: v })}
        placeholder="Detailed prompt — Nano Banana 2 will generate a high-res illustration."
        rows={4}
      />
      <Button type="button" onClick={handleGenerateImage}
        disabled={generating || !(slide.image_generation_prompt || '').trim()}
        className="w-full bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-600 hover:to-violet-700 text-white font-bold">
        {generating ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Wand2 className="h-4 w-4 mr-1.5" />}
        🪄 Generate Image (AI)
      </Button>

      <div className="h-px bg-slate-200 dark:bg-slate-800" />

      <PromptField
        label="Video Prompt"
        icon={Video}
        value={slide.video_generation_prompt ?? ''}
        onChange={(v) => onChange({ video_generation_prompt: v })}
        placeholder="Short looping animation prompt (Veo / Runway)."
        rows={3}
      />
      <Button type="button" disabled
        className="w-full bg-slate-200 text-slate-500 cursor-not-allowed font-bold">
        <Video className="h-4 w-4 mr-1.5" />
        🎬 Generate Video — Coming soon
      </Button>
      <p className="text-[11px] text-slate-400 leading-relaxed -mt-2">
        Veo isn't publicly accessible yet. Generate the clip in your preferred tool and upload below.
      </p>

      <div className="h-px bg-slate-200 dark:bg-slate-800" />

      {/* Manual upload */}
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 inline-flex items-center gap-1.5">
          <Upload className="h-3 w-3" /> Upload your own
        </Label>
        <input ref={fileRef} type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm"
          className="hidden" onChange={handleFile} />
        <div className="flex gap-2">
          <Button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
            variant="outline" className="flex-1 font-bold">
            {uploading ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Upload className="h-4 w-4 mr-1.5" />}
            {uploading ? 'Uploading…' : hasAsset ? 'Replace Asset' : 'Upload Asset'}
          </Button>
          {hasAsset && (
            <Button type="button" variant="ghost" onClick={clearAsset}
              className="text-red-500 hover:text-red-700 hover:bg-red-50" aria-label="Remove uploaded asset">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        {hasAsset && (
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
            ✓ {slide.custom_video_url ? 'Video' : 'Image'} live on the slide
          </p>
        )}
      </div>
    </div>
  );
};

// ============================================================
// AUDIO PANEL — Voiceover (ElevenLabs TTS) + Background Music
// ============================================================

const AudioPanel: React.FC<Props> = ({ slide, onChange }) => {
  const { activeLessonData } = useCreator();
  const lessonId = activeLessonData?.lesson_id ?? activeLessonData?.source_lesson?.id ?? 'draft';
  const [generatingVO, setGeneratingVO] = useState(false);
  const [generatingMusic, setGeneratingMusic] = useState(false);

  const handleGenerateVoice = async () => {
    const text = (slide.elevenlabs_script || slide.content || slide.title || '').trim();
    if (!text) {
      toast.error('Add a voiceover script first.');
      return;
    }
    try {
      setGeneratingVO(true);
      const { url } = await generateSlideVoiceover(text, lessonId, slide.id);
      onChange({ audio_url: url });
      toast.success('Voiceover generated and attached.');
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message || 'Voiceover generation failed.');
    } finally {
      setGeneratingVO(false);
    }
  };

  const handleGenerateMusic = async () => {
    const prompt = (slide.music_generation_prompt || '').trim();
    if (!prompt) {
      toast.error('Add a music prompt first.');
      return;
    }
    try {
      setGeneratingMusic(true);
      const { url } = await generateSlideMusic(prompt, lessonId, slide.id, 30);
      onChange({ background_music_url: url });
      toast.success('Background track generated.');
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message || 'Music generation failed.');
    } finally {
      setGeneratingMusic(false);
    }
  };

  const previewAudio = (url?: string) => {
    if (!url) return;
    const a = new Audio(url);
    a.play().catch(() => toast.error('Could not play audio.'));
  };

  return (
    <div className="space-y-4">
      <PromptField
        label="Voiceover Script (ElevenLabs)"
        icon={Volume2}
        value={slide.elevenlabs_script ?? ''}
        onChange={(v) => onChange({ elevenlabs_script: v })}
        placeholder='e.g. "A says ah, Apple!"'
        rows={3}
      />
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <Button type="button" onClick={handleGenerateVoice} disabled={generatingVO}
          className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold">
          {generatingVO ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Mic className="h-4 w-4 mr-1.5" />}
          🗣️ Generate VoiceOver
        </Button>
        <Button type="button" variant="outline" disabled={!slide.audio_url}
          onClick={() => previewAudio(slide.audio_url)} aria-label="Preview voiceover">
          <Play className="h-4 w-4" />
        </Button>
      </div>
      {slide.audio_url && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-900/40 px-3 py-2 text-[11px] text-emerald-800 dark:text-emerald-300">
          <span>✓ Voiceover attached</span>
          <button type="button" onClick={() => onChange({ audio_url: undefined })}
            className="text-emerald-700 hover:text-red-600">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="h-px bg-slate-200 dark:bg-slate-800" />

      <PromptField
        label="Background Music Prompt"
        icon={Music}
        value={slide.music_generation_prompt ?? ''}
        onChange={(v) => onChange({ music_generation_prompt: v })}
        placeholder="e.g. A 30-second upbeat acoustic guitar track for kids"
        rows={3}
      />
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <Button type="button" onClick={handleGenerateMusic} disabled={generatingMusic}
          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold">
          {generatingMusic ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Music className="h-4 w-4 mr-1.5" />}
          🎸 Generate Background Track
        </Button>
        <Button type="button" variant="outline" disabled={!slide.background_music_url}
          onClick={() => previewAudio(slide.background_music_url)} aria-label="Preview music">
          <Play className="h-4 w-4" />
        </Button>
      </div>
      {slide.background_music_url && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-900/40 px-3 py-2 text-[11px] text-emerald-800 dark:text-emerald-300">
          <span>✓ Music attached</span>
          <button type="button" onClick={() => onChange({ background_music_url: undefined })}
            className="text-emerald-700 hover:text-red-600">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      <p className="text-[11px] text-slate-400 leading-relaxed">
        Music generation uses ElevenLabs Music (~30s tracks). Requires music access on your ElevenLabs plan.
      </p>
    </div>
  );
};
