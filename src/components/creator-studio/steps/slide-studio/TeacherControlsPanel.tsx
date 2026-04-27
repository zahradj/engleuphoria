import React, { useRef, useState } from 'react';
import {
  Mic, Type, ListChecks, Pencil, ImageIcon, Layers, LayoutTemplate, Plus, Minus,
  Volume2, Sparkles, Video, Upload, Copy, Check, Loader2, Trash2,
} from 'lucide-react';
import {
  PPPSlide,
  SlideType,
  LayoutStyle,
  MCQData,
  FlashcardData,
  DrawingData,
} from '../../CreatorContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PHASE_STYLES, normalizePhase } from './phaseTheme';
import { cn } from '@/lib/utils';
import { useCreator } from '../../CreatorContext';
import { uploadSlideAsset } from './uploadSlideAsset';
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

const TYPE_OPTIONS: { value: SlideType; label: string; Icon: React.ElementType }[] = [
  { value: 'text_image', label: 'Story / Reading (Mascot Speech)', Icon: ImageIcon },
  { value: 'flashcard', label: 'Flashcard Flip', Icon: Layers },
  { value: 'drawing_prompt', label: 'Drawing Canvas', Icon: Pencil },
  { value: 'multiple_choice', label: 'Multiple Choice Game', Icon: ListChecks },
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
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={addOption}
            disabled={mcq.options.length >= 6}
            className="h-7 px-2 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
        </div>
        <ul className="space-y-1.5">
          {mcq.options.map((opt, i) => {
            const isCorrect = i === mcq.correct_index;
            return (
              <li
                key={i}
                className={cn(
                  'flex items-center gap-2 rounded-lg border p-2',
                  isCorrect
                    ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900',
                )}
              >
                <input
                  type="radio"
                  name={`mcq-${slide.id}`}
                  checked={isCorrect}
                  onChange={() => update({ correct_index: i })}
                  className="h-4 w-4 accent-emerald-500"
                  aria-label={`Mark option ${String.fromCharCode(65 + i)} as correct`}
                />
                <span className="text-[10px] font-mono text-slate-400 w-3">
                  {String.fromCharCode(65 + i)}
                </span>
                <Input
                  value={opt}
                  onChange={(e) => setOption(i, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  className="h-8 text-sm"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => removeOption(i)}
                  disabled={mcq.options.length <= 2}
                  className="h-7 w-7 p-0 text-slate-400 hover:text-red-500"
                  aria-label="Remove option"
                >
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
        <Textarea
          rows={3}
          value={back}
          onChange={(e) => update({ back: e.target.value })}
          placeholder="e.g. a round red fruit"
          className="text-sm resize-none"
        />
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
      <Textarea
        rows={4}
        value={prompt}
        onChange={(e) => onChange({ interactive_data: { prompt: e.target.value }, content: e.target.value })}
        placeholder="What should learners draw?"
        className="text-sm resize-none"
      />
    </div>
  );
};

// ----------------- Main panel -----------------

export const TeacherControlsPanel: React.FC<Props> = ({ slide, onChange }) => {
  const phaseKey = normalizePhase(slide.phase as string);
  const style = PHASE_STYLES[phaseKey];

  const handleTypeChange = (next: SlideType) => {
    if (next === slide.slide_type) return;
    if (next === 'multiple_choice') onChange({ slide_type: next, interactive_data: { ...DEFAULT_MCQ } });
    else if (next === 'flashcard') onChange({ slide_type: next, interactive_data: { ...DEFAULT_FLASHCARD } });
    else if (next === 'drawing_prompt')
      onChange({ slide_type: next, interactive_data: { ...DEFAULT_DRAWING }, content: DEFAULT_DRAWING.prompt });
    else onChange({ slide_type: next, interactive_data: {} });
  };

  return (
    <aside className="w-[340px] shrink-0 h-full overflow-y-auto bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-5 space-y-5">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
          Phase
        </div>
        <span className={cn('inline-flex text-xs font-bold px-2 py-1 rounded', style.chip)}>{style.label}</span>
        <p className="text-[11px] text-slate-400 mt-1.5">Phase is locked by the blueprint.</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Slide Type</Label>
          <Select value={slide.slide_type ?? 'text_image'} onValueChange={(v) => handleTypeChange(v as SlideType)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
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
          <Select
            value={slide.layout_style ?? 'full_background'}
            onValueChange={(v) => onChange({ layout_style: v as LayoutStyle })}
          >
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
        ) : (
          <TextImageEditor slide={slide} onChange={onChange} />
        )}
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 inline-flex items-center gap-1.5">
          <Mic className="h-3 w-3" /> Teacher Script
        </Label>
        <Textarea
          rows={5}
          value={slide.teacher_script ?? slide.teacher_instructions ?? ''}
          onChange={(e) => onChange({ teacher_script: e.target.value })}
          placeholder="2–3 high-energy sentences for the teacher to read…"
          className="resize-none text-sm leading-relaxed"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 inline-flex items-center gap-1.5">
          <Type className="h-3 w-3" /> Visual Keyword
        </Label>
        <Input
          value={slide.visual_keyword ?? ''}
          onChange={(e) => onChange({ visual_keyword: e.target.value })}
          placeholder="e.g. autumn forest"
        />
        <p className="text-[11px] text-slate-400">Fallback only — used when no custom asset is uploaded.</p>
      </div>

      {/* ----- Multimodal Media Lab ----- */}
      <MediaLab slide={slide} onChange={onChange} />
    </aside>
  );
};

// ============================================================
// MEDIA LAB — ElevenLabs script + AI prompts + asset uploader
// ============================================================

const CopyableField: React.FC<{
  label: string;
  icon: React.ElementType;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  rows?: number;
}> = ({ label, icon: Icon, value, onChange, placeholder, rows = 3 }) => {
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
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 inline-flex items-center gap-1.5">
          <Icon className="h-3 w-3" /> {label}
        </Label>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!value}
          className="text-[10px] inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 disabled:opacity-40"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <Textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="text-sm resize-none leading-relaxed"
      />
    </div>
  );
};

const MediaLab: React.FC<Props> = ({ slide, onChange }) => {
  const { activeLessonData } = useCreator();
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const triggerUpload = () => fileRef.current?.click();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-uploading the same file
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      toast.error('File is too large (25 MB max).');
      return;
    }

    try {
      setUploading(true);
      const lessonId = activeLessonData?.lesson_id ?? activeLessonData?.source_lesson?.id ?? 'draft';
      const { url, kind } = await uploadSlideAsset(file, lessonId);
      if (kind === 'video') {
        onChange({ custom_video_url: url, custom_image_url: undefined });
        toast.success('Video uploaded — autoplaying on the slide.');
      } else {
        onChange({ custom_image_url: url, custom_video_url: undefined });
        toast.success('Image uploaded.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const clearAsset = () => onChange({ custom_image_url: undefined, custom_video_url: undefined });
  const hasAsset = !!(slide.custom_image_url || slide.custom_video_url);

  return (
    <div className="rounded-xl border-2 border-violet-200 dark:border-violet-900/40 bg-violet-50/60 dark:bg-violet-950/20 p-3 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-violet-600" />
        <span className="text-xs font-extrabold uppercase tracking-widest text-violet-700 dark:text-violet-300">
          Multimodal Media Lab
        </span>
      </div>

      <CopyableField
        label="ElevenLabs Script (TTS)"
        icon={Volume2}
        value={slide.elevenlabs_script ?? ''}
        onChange={(v) => onChange({ elevenlabs_script: v })}
        placeholder='e.g. "A says ah, Apple!"'
        rows={2}
      />

      <CopyableField
        label="Image Prompt"
        icon={ImageIcon}
        value={slide.image_generation_prompt ?? ''}
        onChange={(v) => onChange({ image_generation_prompt: v })}
        placeholder="Detailed prompt for text-to-image (Nano Banana, Midjourney…)"
        rows={3}
      />

      <CopyableField
        label="Video Prompt"
        icon={Video}
        value={slide.video_generation_prompt ?? ''}
        onChange={(v) => onChange({ video_generation_prompt: v })}
        placeholder="Prompt for text-to-video (Veo, Runway…). Short looping animation."
        rows={3}
      />

      {/* Upload zone */}
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 inline-flex items-center gap-1.5">
          <Upload className="h-3 w-3" /> Uploaded Asset
        </Label>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm"
          className="hidden"
          onChange={handleFile}
        />
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={triggerUpload}
            disabled={uploading}
            className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-bold"
          >
            {uploading ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Upload className="h-4 w-4 mr-1.5" />}
            {uploading ? 'Uploading…' : hasAsset ? 'Replace Asset' : 'Upload Asset'}
          </Button>
          {hasAsset && (
            <Button
              type="button"
              variant="ghost"
              onClick={clearAsset}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              aria-label="Remove uploaded asset"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        {hasAsset && (
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
            ✓ {slide.custom_video_url ? 'Video' : 'Image'} live on the slide
          </p>
        )}
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Generate the image/video in your preferred AI tool using the prompts above, then upload here.
          Videos autoplay and loop in the central quiz container.
        </p>
      </div>
    </div>
  );
};
