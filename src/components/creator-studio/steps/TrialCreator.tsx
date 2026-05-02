import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Zap, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCreator, CEFRLevel, HubType, ActiveLessonData, PPPSlide } from '../CreatorContext';
import { persistLesson } from '../persistLesson';
import { cn } from '@/lib/utils';

type Demographic = 'kids' | 'teens' | 'adults';

const DEMO_TO_HUB: Record<Demographic, HubType> = {
  kids: 'playground',
  teens: 'academy',
  adults: 'success',
};

const DEMO_STYLES: Record<Demographic, { ring: string; bg: string; label: string }> = {
  kids:   { ring: 'ring-orange-500',  bg: 'bg-orange-500 text-white',   label: 'Kids · Playground' },
  teens:  { ring: 'ring-violet-500',  bg: 'bg-violet-600 text-white',   label: 'Teens · Academy' },
  adults: { ring: 'ring-emerald-500', bg: 'bg-emerald-600 text-white',  label: 'Adults · Success' },
};

const CEFR: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const uid = () => `s_${Math.random().toString(36).slice(2, 10)}`;

export const TrialCreator: React.FC = () => {
  const navigate = useNavigate();
  const { setActiveLessonData, setCurrentStep, setDirty } = useCreator();
  const [demographic, setDemographic] = useState<Demographic>('teens');
  const [cefrLevel, setCefrLevel] = useState<CEFRLevel>('B1');
  const [theme, setTheme] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setError(null);
    if (!theme.trim()) {
      setError('Please enter a theme for the trial lesson.');
      return;
    }
    setBusy(true);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke('ai-core', {
        body: {
          action: 'generate_trial_lesson',
          demographic,
          cefr_level: cefrLevel,
          theme: theme.trim(),
        },
      });
      if (fnErr) {
        const status = (fnErr as any)?.context?.status;
        if (status === 429) throw new Error('AI is heavily loaded. Please wait 10 seconds and try again.');
        if (status === 402) throw new Error('AI is temporarily at capacity, please retry shortly.');
        throw new Error(fnErr.message || 'Generation failed');
      }
      if (data?.error) throw new Error(data.error);

      const lessonJson = data?.lesson;
      if (!lessonJson || !Array.isArray(lessonJson.slides)) {
        throw new Error('AI returned an invalid trial lesson.');
      }

      const slides: PPPSlide[] = (lessonJson.slides as any[]).slice(0, 8).map((s, i) => ({
        id: uid(),
        phase: s.phase || (i === 0 ? 'warm-up' : i >= 5 ? 'review' : 'practice'),
        slide_type: s.slide_type || 'text_image',
        title: s.title || `Slide ${i + 1}`,
        content: s.content || '',
        teacher_script: s.teacher_script || '',
        visual_keyword: s.visual_keyword || '',
        image_generation_prompt: s.image_generation_prompt || '',
        interactive_data: s.interactive_data || undefined,
      }));

      const lesson: ActiveLessonData = {
        cefr_level: cefrLevel,
        hub: DEMO_TO_HUB[demographic],
        lesson_title: lessonJson.lesson_title || `Trial: ${theme.trim()}`,
        target_goal: lessonJson.target_goal || 'A 30-minute trial English lesson.',
        target_vocabulary: Array.isArray(lessonJson.target_vocabulary)
          ? lessonJson.target_vocabulary.join(', ')
          : (lessonJson.target_vocabulary || ''),
        slides,
      };

      const result = await persistLesson(lesson, slides, false, 'trial');
      if (result.ok === false) throw new Error(result.error);

      setActiveLessonData({ ...lesson, lesson_id: result.lesson_id });
      setDirty(false);
      toast.success(`Trial lesson generated: ${slides.length} slides`);
      setCurrentStep('slide-builder');
      navigate('/content-creator/slide-builder');
    } catch (e: any) {
      console.error('TrialCreator error:', e);
      setError(e?.message || 'Generation failed');
      toast.error(e?.message || 'Generation failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Trial Creator
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Generate a snappy 30-minute trial lesson — 6–8 slides, designed to convert.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur p-6 space-y-6 shadow-sm">
        {/* Demographic */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Target Demographic</Label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(DEMO_TO_HUB) as Demographic[]).map((d) => {
              const active = demographic === d;
              const s = DEMO_STYLES[d];
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDemographic(d)}
                  className={cn(
                    'rounded-xl px-3 py-3 text-sm font-semibold border-2 transition-all',
                    active
                      ? `${s.bg} border-transparent shadow`
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  )}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* CEFR */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">CEFR Level</Label>
          <Select value={cefrLevel} onValueChange={(v) => setCefrLevel(v as CEFRLevel)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CEFR.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Theme */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Theme</Label>
          <Input
            placeholder='e.g., "Ordering coffee", "Job interview", "Talking about weekends"'
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            disabled={busy}
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3 text-sm text-red-700 dark:text-red-300">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button
          onClick={handleGenerate}
          disabled={busy || !theme.trim()}
          className="w-full h-12 text-base font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
        >
          {busy ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating trial lesson…</>
          ) : (
            <><Sparkles className="h-4 w-4 mr-2" /> Generate 30-Minute Trial Lesson</>
          )}
        </Button>

        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
          Output: 6–8 slides · Hook → Vocabulary → Speaking → Wrap-up
        </p>
      </div>
    </div>
  );
};
