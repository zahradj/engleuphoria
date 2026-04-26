import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, RefreshCw, ImageOff } from 'lucide-react';
import { StudioSlide, Phase, PHASE_LABEL, unsplashUrl } from './types';

interface Props {
  slide: StudioSlide;
  index: number;
  total: number;
  onChange: (patch: Partial<StudioSlide>) => void;
}

export const SlideEditor: React.FC<Props> = ({ slide, index, total, onChange }) => {
  const [chipDraft, setChipDraft] = useState('');
  const [imgError, setImgError] = useState(false);
  const imgSrc = slide.custom_image_url || unsplashUrl(slide.visual_keyword);

  const addChip = () => {
    const v = chipDraft.trim();
    if (!v) return;
    onChange({ interactive_options: [...(slide.interactive_options || []), v] });
    setChipDraft('');
  };
  const removeChip = (i: number) => {
    const next = [...(slide.interactive_options || [])];
    next.splice(i, 1);
    onChange({ interactive_options: next });
  };

  return (
    <div className="flex-1 min-w-0 h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Slide {index + 1} of {total}
          </div>
          <Select value={slide.phase} onValueChange={(v) => onChange({ phase: v as Phase })}>
            <SelectTrigger className="w-44 bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PHASE_LABEL).map(([k, label]) => (
                <SelectItem key={k} value={k}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Image preview */}
        <div className="relative rounded-2xl overflow-hidden border border-border/50 bg-muted aspect-[16/9] shadow-lg">
          {!imgError ? (
            <img
              key={imgSrc}
              src={imgSrc}
              alt={slide.visual_keyword || slide.title || 'slide'}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
              <ImageOff className="h-10 w-10" />
              <span className="text-sm">Image failed to load</span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="text-white text-lg font-bold drop-shadow">{slide.title || 'Untitled slide'}</div>
          </div>
        </div>

        {/* Editable fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Title">
            <Input
              value={slide.title || ''}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="Slide title"
              className="bg-background/50"
            />
          </Field>

          <Field label="Visual keyword (Unsplash)">
            <div className="flex gap-2">
              <Input
                value={slide.visual_keyword || ''}
                onChange={(e) => onChange({ visual_keyword: e.target.value })}
                placeholder="e.g. coffee-shop-counter"
                className="bg-background/50"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => { setImgError(false); onChange({ visual_keyword: (slide.visual_keyword || '') + ' ' }); setTimeout(() => onChange({ visual_keyword: (slide.visual_keyword || '').trim() }), 50); }}
                title="Reload image"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </Field>
        </div>

        <Field label="Custom image URL (overrides Unsplash)">
          <Input
            value={slide.custom_image_url || ''}
            onChange={(e) => { setImgError(false); onChange({ custom_image_url: e.target.value }); }}
            placeholder="https://…"
            className="bg-background/50"
          />
        </Field>

        <Field label="Body / Student-facing content">
          <Textarea
            value={slide.content || ''}
            onChange={(e) => onChange({ content: e.target.value })}
            rows={4}
            placeholder="What the student sees on screen"
            className="bg-background/50"
          />
        </Field>

        <Field label="Teacher instructions / tips">
          <Textarea
            value={slide.teacher_instructions || ''}
            onChange={(e) => onChange({ teacher_instructions: e.target.value })}
            rows={3}
            placeholder="Hidden tips for the teacher on how to run this slide"
            className="bg-background/50"
          />
        </Field>

        <Field label="Interactive options (quiz answers, prompts, etc.)">
          <div className="flex flex-wrap gap-2 mb-2">
            {(slide.interactive_options || []).map((opt, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/30"
              >
                {opt}
                <button onClick={() => removeChip(i)} className="hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={chipDraft}
              onChange={(e) => setChipDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addChip(); } }}
              placeholder="Add option and press Enter"
              className="bg-background/50"
            />
            <Button type="button" variant="outline" size="icon" onClick={addChip}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </Field>
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
    {children}
  </div>
);
