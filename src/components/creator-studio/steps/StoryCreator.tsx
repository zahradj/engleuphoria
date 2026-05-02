import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, BookOpen, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCreator, CEFRLevel, ActiveLessonData, PPPSlide, MCQData } from '../CreatorContext';
import { persistLesson } from '../persistLesson';

const CEFR: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const GENRES = ['Sci-Fi', 'Fairy Tale', 'Everyday Life', 'Mystery', 'Adventure', 'Slice of Life', 'Historical', 'Comedy'];

const uid = () => `s_${Math.random().toString(36).slice(2, 10)}`;

export const StoryCreator: React.FC = () => {
  const navigate = useNavigate();
  const { setActiveLessonData, setCurrentStep, setDirty } = useCreator();
  const [cefrLevel, setCefrLevel] = useState<CEFRLevel>('B1');
  const [genre, setGenre] = useState<string>('Everyday Life');
  const [vocabInput, setVocabInput] = useState('');
  const [layoutStyle, setLayoutStyle] = useState<'classic' | 'immersive'>('immersive');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseVocab = (raw: string) =>
    raw.split(',').map((w) => w.trim()).filter(Boolean);

  const handleGenerate = async () => {
    setError(null);
    const words = parseVocab(vocabInput);
    if (words.length < 5 || words.length > 10) {
      setError('Please provide between 5 and 10 target vocabulary words (comma-separated).');
      return;
    }
    setBusy(true);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke('ai-core', {
        body: {
          action: 'generate_story',
          cefr_level: cefrLevel,
          genre,
          target_vocabulary: words,
        },
      });
      if (fnErr) {
        const status = (fnErr as any)?.context?.status;
        if (status === 429) throw new Error('AI is heavily loaded. Please wait 10 seconds and try again.');
        if (status === 402) throw new Error('AI is temporarily at capacity, please retry shortly.');
        throw new Error(fnErr.message || 'Generation failed');
      }
      if (data?.error) throw new Error(data.error);

      const story = data?.story;
      if (!story || !Array.isArray(story.slides)) {
        throw new Error('AI returned an invalid story.');
      }

      const narrativeSlides: PPPSlide[] = (story.slides as any[]).slice(0, 5).map((s, i) => ({
        id: uid(),
        phase: 'presentation',
        slide_type: 'text_image',
        title: `Page ${i + 1}`,
        content: s.narrative || '',
        teacher_script: s.narrative || '',
        visual_keyword: s.image_prompt?.split(' ').slice(0, 3).join(' ') || genre,
        image_generation_prompt: s.image_prompt || '',
      }));

      const compSlides: PPPSlide[] = (Array.isArray(story.comprehension) ? story.comprehension : [])
        .slice(0, 2)
        .map((q: any, i: number) => {
          const mcq: MCQData = {
            question: q.question || `Comprehension question ${i + 1}`,
            options: Array.isArray(q.options) ? q.options.slice(0, 4) : ['A', 'B', 'C', 'D'],
            correct_index: typeof q.correct_index === 'number' ? q.correct_index : 0,
          };
          return {
            id: uid(),
            phase: 'review',
            slide_type: 'multiple_choice',
            title: `Comprehension ${i + 1}`,
            content: mcq.question,
            interactive_data: mcq,
          };
        });

      const slides = [...narrativeSlides, ...compSlides];

      const lesson: ActiveLessonData = {
        cefr_level: cefrLevel,
        hub: 'academy',
        lesson_title: story.title || `${genre} Story (${cefrLevel})`,
        target_goal: `Graded reader: ${genre} (${cefrLevel}).`,
        target_vocabulary: words.join(', '),
        slides,
      };

      const result = await persistLesson(lesson, slides, false, 'story', { story_layout: layoutStyle });
      if (result.ok === false) throw new Error(result.error);

      setActiveLessonData({ ...lesson, lesson_id: result.lesson_id });
      setDirty(false);
      toast.success(`Story generated: ${narrativeSlides.length} pages + ${compSlides.length} quiz`);
      setCurrentStep('slide-builder');
      navigate('/content-creator/slide-builder');
    } catch (e: any) {
      console.error('StoryCreator error:', e);
      setError(e?.message || 'Generation failed');
      toast.error(e?.message || 'Generation failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-md">
          <BookOpen className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Story Creator
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Generate CEFR-graded readers with illustrations and a comprehension quiz.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur p-6 space-y-6 shadow-sm">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">CEFR Level</Label>
          <Select value={cefrLevel} onValueChange={(v) => setCefrLevel(v as CEFRLevel)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CEFR.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">Genre</Label>
          <Select value={genre} onValueChange={setGenre}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {GENRES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">
            Target Vocabulary <span className="text-slate-400 font-normal">(5–10 words, comma-separated)</span>
          </Label>
          <Input
            placeholder="e.g., curious, mountain, whisper, ancient, discover, shadow, forgotten"
            value={vocabInput}
            onChange={(e) => setVocabInput(e.target.value)}
            disabled={busy}
          />
          <p className="text-xs text-slate-500">
            {parseVocab(vocabInput).length}/10 words
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">Reader Layout</Label>
          <div className="grid grid-cols-2 gap-3">
            {([
              { key: 'immersive', label: 'Immersive', desc: 'Full-bleed image · frosted text card' },
              { key: 'classic', label: 'Classic Split', desc: '50/50 image + serif text panel' },
            ] as const).map((opt) => {
              const active = layoutStyle === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setLayoutStyle(opt.key)}
                  className={`text-left rounded-xl border-2 p-3 transition-all ${
                    active
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {opt.key === 'immersive' ? (
                      <div className="w-10 h-7 rounded bg-gradient-to-br from-violet-500 to-fuchsia-500 relative overflow-hidden">
                        <div className="absolute bottom-0.5 left-1 right-1 h-2 rounded-sm bg-black/40 backdrop-blur-sm" />
                      </div>
                    ) : (
                      <div className="w-10 h-7 rounded overflow-hidden flex">
                        <div className="w-1/2 bg-gradient-to-br from-slate-400 to-slate-600" />
                        <div className="w-1/2 bg-amber-50 flex items-center justify-center">
                          <div className="w-3/4 h-0.5 bg-slate-400 rounded" />
                        </div>
                      </div>
                    )}
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{opt.label}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{opt.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
          <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3 text-sm text-red-700 dark:text-red-300">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button
          onClick={handleGenerate}
          disabled={busy}
          className="w-full h-12 text-base font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white"
        >
          {busy ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Writing your story…</>
          ) : (
            <><Sparkles className="h-4 w-4 mr-2" /> Generate Graded Reader</>
          )}
        </Button>

        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
          Output: 4–5 illustrated pages + 2 comprehension questions
        </p>
      </div>
    </div>
  );
};
