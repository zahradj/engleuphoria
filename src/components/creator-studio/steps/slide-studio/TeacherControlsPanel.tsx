import React from 'react';
import { Mic, ImageIcon, Type, ListChecks, Pencil } from 'lucide-react';
import { PPPSlide, SlideType } from '../../CreatorContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { PHASE_STYLES, normalizePhase } from './phaseTheme';
import { cn } from '@/lib/utils';

interface Props {
  slide: PPPSlide;
  onChange: (patch: Partial<PPPSlide>) => void;
}

const DEFAULT_MCQ = JSON.stringify({
  question: 'Which option is correct?',
  options: ['Option A', 'Option B', 'Option C', 'Option D'],
  answer: 'Option A',
});

export const TeacherControlsPanel: React.FC<Props> = ({ slide, onChange }) => {
  const phaseKey = normalizePhase(slide.phase as string);
  const style = PHASE_STYLES[phaseKey];

  const handleTypeChange = (next: SlideType) => {
    if (next === slide.slide_type) return;
    if (next === 'multiple_choice') {
      onChange({ slide_type: next, content: DEFAULT_MCQ });
    } else if (next === 'drawing_prompt') {
      onChange({ slide_type: next, content: slide.content || 'Draw your answer in your notebook and share with the class.' });
    } else {
      onChange({ slide_type: next, content: slide.content || '' });
    }
  };

  return (
    <aside className="w-[320px] shrink-0 h-full overflow-y-auto bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-5 space-y-5">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
          Phase
        </div>
        <span className={cn('inline-flex text-xs font-bold px-2 py-1 rounded', style.chip)}>{style.label}</span>
        <p className="text-[11px] text-slate-400 mt-1.5">Phase is locked by the blueprint.</p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Slide Type</Label>
        <Select value={slide.slide_type ?? 'text_image'} onValueChange={(v) => handleTypeChange(v as SlideType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text_image">
              <span className="inline-flex items-center gap-2"><ImageIcon className="h-3.5 w-3.5" /> Text + Image</span>
            </SelectItem>
            <SelectItem value="multiple_choice">
              <span className="inline-flex items-center gap-2"><ListChecks className="h-3.5 w-3.5" /> Multiple Choice</span>
            </SelectItem>
            <SelectItem value="drawing_prompt">
              <span className="inline-flex items-center gap-2"><Pencil className="h-3.5 w-3.5" /> Drawing Prompt</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 inline-flex items-center gap-1.5">
          <Mic className="h-3 w-3" /> Teacher Script
        </Label>
        <Textarea
          rows={6}
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
        <p className="text-[11px] text-slate-400">1–2 words. Updates the Unsplash background.</p>
      </div>
    </aside>
  );
};
