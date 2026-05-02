import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, BookOpen, Sparkles, AlertCircle, Link2, X, Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useCreator, CEFRLevel, ActiveLessonData, PPPSlide, MCQData } from '../CreatorContext';
import { persistLesson } from '../persistLesson';

const CEFR: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const GENRES = ['Sci-Fi', 'Fairy Tale', 'Everyday Life', 'Mystery', 'Adventure', 'Slice of Life', 'Historical', 'Comedy'];

const uid = () => `s_${Math.random().toString(36).slice(2, 10)}`;

interface CurriculumLessonOption {
  id: string;
  title: string;
  difficulty_level: string;
  target_system: string;
  vocabulary_list: any;
  grammar_pattern: string | null;
  description: string | null;
  ai_metadata: any;
}

const HUB_LABEL: Record<string, string> = {
  kids: 'Playground',
  teen: 'Academy',
  adult: 'Success Hub',
};

const difficultyToCefr = (lesson: CurriculumLessonOption): CEFRLevel => {
  const explicit = lesson.ai_metadata?.cefr_level;
  if (typeof explicit === 'string' && CEFR.includes(explicit.toUpperCase() as CEFRLevel)) {
    return explicit.toUpperCase() as CEFRLevel;
  }
  switch ((lesson.difficulty_level || '').toLowerCase()) {
    case 'beginner': return 'A1';
    case 'intermediate': return 'B1';
    case 'advanced': return 'C1';
    default: return 'B1';
  }
};

const vocabListToString = (raw: any): string => {
  if (!raw) return '';
  if (Array.isArray(raw)) {
    return raw
      .map((w) => (typeof w === 'string' ? w : w?.word || w?.term || ''))
      .filter(Boolean)
      .join(', ');
  }
  if (typeof raw === 'string') return raw;
  return '';
};

const vocabListToArray = (raw: any): string[] => {
  const s = vocabListToString(raw);
  return s.split(',').map((w) => w.trim()).filter(Boolean);
};

export const StoryCreator: React.FC = () => {
  const navigate = useNavigate();
  const { setActiveLessonData, setCurrentStep, setDirty } = useCreator();
  const [cefrLevel, setCefrLevel] = useState<CEFRLevel>('B1');
  const [genre, setGenre] = useState<string>('Everyday Life');
  const [vocabInput, setVocabInput] = useState('');
  const [layoutStyle, setLayoutStyle] = useState<'classic' | 'immersive'>('immersive');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Linked lesson picker ──
  const [lessons, setLessons] = useState<CurriculumLessonOption[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [linkedLessonId, setLinkedLessonId] = useState<string | null>(null);
  const linkedLesson = useMemo(
    () => lessons.find((l) => l.id === linkedLessonId) || null,
    [lessons, linkedLessonId],
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      setLessonsLoading(true);
      const { data, error: e } = await supabase
        .from('curriculum_lessons')
        .select('id, title, difficulty_level, target_system, vocabulary_list, grammar_pattern, description, ai_metadata')
        .eq('is_published', true)
        .order('target_system')
        .order('difficulty_level')
        .order('title')
        .limit(500);
      if (!alive) return;
      if (!e && Array.isArray(data)) {
        // exclude existing stories
        const filtered = data.filter((l: any) => (l?.ai_metadata?.kind ?? 'standard') !== 'story');
        setLessons(filtered as CurriculumLessonOption[]);
      }
      setLessonsLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  const handleSelectLesson = (id: string) => {
    const lesson = lessons.find((l) => l.id === id);
    setLinkedLessonId(id);
    setPickerOpen(false);
    if (!lesson) return;

    // Auto-fill CEFR
    setCefrLevel(difficultyToCefr(lesson));

    // Auto-fill vocab only if the teacher hasn't typed anything yet
    if (!vocabInput.trim()) {
      const vocab = vocabListToString(lesson.vocabulary_list);
      if (vocab) setVocabInput(vocab);
    }
  };

  const clearLinkedLesson = () => setLinkedLessonId(null);

  const grouped = useMemo(() => {
    const groups: Record<string, CurriculumLessonOption[]> = { kids: [], teen: [], adult: [] };
    for (const l of lessons) {
      const key = (l.target_system in groups) ? l.target_system : 'adult';
      groups[key].push(l);
    }
    return groups;
  }, [lessons]);

  const parseVocab = (raw: string) =>
    raw.split(',').map((w) => w.trim()).filter(Boolean);

  const handleGenerate = async () => {
    setError(null);
    const manualWords = parseVocab(vocabInput);

    // Merge linked lesson vocab (deduped, case-insensitive)
    const linkedVocab = linkedLesson ? vocabListToArray(linkedLesson.vocabulary_list) : [];
    const seen = new Set<string>();
    const words: string[] = [];
    for (const w of [...manualWords, ...linkedVocab]) {
      const k = w.toLowerCase();
      if (!seen.has(k)) { seen.add(k); words.push(w); }
    }

    if (words.length < 5 || words.length > 12) {
      setError('Please provide between 5 and 12 target vocabulary words (comma-separated, including any from the linked lesson).');
      return;
    }
    setBusy(true);
    try {
      const linked_lesson_payload = linkedLesson ? {
        id: linkedLesson.id,
        title: linkedLesson.title,
        topic: linkedLesson.ai_metadata?.topic ?? linkedLesson.title,
        description: linkedLesson.description,
        vocabulary: linkedVocab,
        grammar_pattern: linkedLesson.grammar_pattern,
        cefr_level: difficultyToCefr(linkedLesson),
      } : undefined;

      const { data, error: fnErr } = await supabase.functions.invoke('ai-core', {
        body: {
          action: 'generate_story',
          cefr_level: cefrLevel,
          genre,
          target_vocabulary: words,
          linked_lesson: linked_lesson_payload,
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
        hub: linkedLesson
          ? (linkedLesson.target_system === 'kids' ? 'playground'
            : linkedLesson.target_system === 'teen' ? 'academy'
            : 'success')
          : 'academy',
        lesson_title: story.title || `${genre} Story (${cefrLevel})`,
        target_goal: linkedLesson
          ? `Graded reader linked to: ${linkedLesson.title}`
          : `Graded reader: ${genre} (${cefrLevel}).`,
        target_vocabulary: words.join(', '),
        slides,
        parent_lesson_id: linkedLessonId,
      };

      const result = await persistLesson(lesson, slides, false, 'story', {
        story_layout: layoutStyle,
        linked_lesson_id: linkedLessonId,
        linked_lesson_title: linkedLesson?.title ?? null,
      });
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

        {/* ── Linked lesson picker (very top) ── */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Link2 className="h-4 w-4 text-violet-500" />
            Link to Curriculum Lesson <span className="text-slate-400 font-normal">(optional)</span>
          </Label>

          {linkedLesson ? (
            <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/30 p-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <Badge variant="secondary" className="text-[10px] font-bold bg-violet-200 text-violet-800 dark:bg-violet-800/50 dark:text-violet-200 border-0">
                    {HUB_LABEL[linkedLesson.target_system] ?? linkedLesson.target_system}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px] font-bold bg-white dark:bg-slate-800 border-0 text-slate-700 dark:text-slate-200">
                    {difficultyToCefr(linkedLesson)}
                  </Badge>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {linkedLesson.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  CEFR & vocabulary auto-filled below.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={clearLinkedLesson}
                className="shrink-0 h-8 w-8 p-0 rounded-full"
                aria-label="Unlink lesson"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={pickerOpen}
                  className="w-full justify-between font-normal"
                  disabled={lessonsLoading}
                >
                  {lessonsLoading
                    ? 'Loading lessons…'
                    : 'Select a lesson to base this story on…'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search lessons by title…" />
                  <CommandList>
                    <CommandEmpty>No lessons found.</CommandEmpty>
                    {(['kids', 'teen', 'adult'] as const).map((hub) => {
                      const items = grouped[hub];
                      if (!items || items.length === 0) return null;
                      return (
                        <CommandGroup key={hub} heading={HUB_LABEL[hub]}>
                          {items.map((l) => (
                            <CommandItem
                              key={l.id}
                              value={`${l.title} ${l.difficulty_level}`}
                              onSelect={() => handleSelectLesson(l.id)}
                              className="flex items-center gap-2"
                            >
                              <Check
                                className={cn(
                                  'h-4 w-4',
                                  linkedLessonId === l.id ? 'opacity-100 text-violet-500' : 'opacity-0',
                                )}
                              />
                              <span className="flex-1 truncate">{l.title}</span>
                              <Badge variant="outline" className="text-[10px] shrink-0">
                                {difficultyToCefr(l)}
                              </Badge>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      );
                    })}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        </div>

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
            Target Vocabulary <span className="text-slate-400 font-normal">(5–12 words, comma-separated)</span>
          </Label>
          <Input
            placeholder="e.g., curious, mountain, whisper, ancient, discover, shadow, forgotten"
            value={vocabInput}
            onChange={(e) => setVocabInput(e.target.value)}
            disabled={busy}
          />
          <p className="text-xs text-slate-500">
            {parseVocab(vocabInput).length}/12 words
            {linkedLesson && ' (linked-lesson vocab will be merged automatically)'}
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

        {error && (
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
