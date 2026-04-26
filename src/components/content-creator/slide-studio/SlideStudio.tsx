import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Save, Loader2, Sparkles } from 'lucide-react';
import { handleAIResponse, showAIErrorToast } from '@/lib/aiErrorHandler';
import {
  StudioSlide, StudioLesson, BlueprintHandoff, CEFRLevel, HubType, Phase,
  HUB_TARGET_SYSTEM, HUB_DIFFICULTY, HUB_DURATION, normalizePhase,
} from './types';
import { BlueprintContextBanner } from './BlueprintContextBanner';
import { SlideFilmstrip } from './SlideFilmstrip';
import { SlideEditor } from './SlideEditor';

const uid = () => `s_${Math.random().toString(36).slice(2, 10)}`;

const DEFAULT_PHASE_FOR_NEW: Phase = 'practice';

interface Props {
  onPublished?: () => void;
}

export const SlideStudio: React.FC<Props> = ({ onPublished }) => {
  const location = useLocation();
  const handoff = (location.state || {}) as BlueprintHandoff;
  const { user } = useAuth();
  const userRole = (user as any)?.role;

  const [cefrLevel, setCefrLevel] = useState<CEFRLevel>(handoff.cefr_level || 'B1');
  const [hub, setHub] = useState<HubType>(handoff.hub || 'academy');
  const [topic, setTopic] = useState(handoff.topic || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lesson, setLesson] = useState<StudioLesson | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const autoTriggered = useRef(false);

  if (userRole !== 'admin' && userRole !== 'content_creator') {
    return (
      <div className="p-12 text-center text-muted-foreground">
        The Slide Studio is restricted to admins and content creators.
      </div>
    );
  }

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a lesson topic.');
      return;
    }
    setIsGenerating(true);
    try {
      const lessonPromptParts: string[] = [];
      if (handoff.skill_focus) lessonPromptParts.push(`Skill focus: ${handoff.skill_focus}.`);
      if (handoff.learning_objective) lessonPromptParts.push(`Learning objective: ${handoff.learning_objective}.`);
      if (handoff.unit_theme) lessonPromptParts.push(`Unit theme: ${handoff.unit_theme}.`);

      const { data, error } = await supabase.functions.invoke('generate-lesson-plan', {
        body: {
          hub,
          cefr_level: cefrLevel,
          topic: topic.trim(),
          mode: 'full_deck',
          lessonPrompt: lessonPromptParts.join(' ') || undefined,
        },
      });

      if (!handleAIResponse({ data, error, onRetry: handleGenerate, context: 'Slide Studio' })) {
        setIsGenerating(false);
        return;
      }

      const ld = data.lessonData || {};
      const rawSlides = ld.slides || data.slides || [];
      const slides: StudioSlide[] = rawSlides.map((s: any) => ({
        id: uid(),
        phase: normalizePhase(s.phase || s.ppp_stage),
        slide_type: s.slide_type,
        interaction_type: s.interaction_type,
        title: s.title || s.headline || '',
        content: s.content || s.body_text || '',
        visual_keyword: s.visual_keyword || s.visual_search_keyword || '',
        teacher_instructions: s.teacher_instructions ||
          (typeof s.teacher_notes === 'string' ? s.teacher_notes : '') || '',
        interactive_options: Array.isArray(s.interactive_options) ? s.interactive_options : [],
      }));

      const newLesson: StudioLesson = {
        lesson_title: ld.lesson_title || data.lesson_title || topic.trim(),
        target_goal: ld.target_goal || data.target_goal,
        target_grammar: ld.target_grammar || data.target_grammar,
        target_vocabulary: ld.target_vocabulary || data.target_vocabulary,
        roadmap: ld.roadmap || ['Warm-up', 'Presentation', 'Practice', 'Production', 'Review'],
        slides,
      };
      setLesson(newLesson);
      setSelectedId(slides[0]?.id || null);
      toast.success(`✨ ${slides.length} PPP slides generated. Polish and publish!`);
    } catch (err: any) {
      console.error('Generation error:', err);
      showAIErrorToast(err?.message || 'Failed to generate lesson', handleGenerate, 'Slide Studio');
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-trigger generation on Blueprint handoff
  useEffect(() => {
    if (handoff.fromBlueprint && handoff.topic && !autoTriggered.current && !lesson && !isGenerating) {
      autoTriggered.current = true;
      setTimeout(() => handleGenerate(), 250);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handoff.fromBlueprint, handoff.topic]);

  const selectedIdx = useMemo(
    () => (lesson?.slides.findIndex((s) => s.id === selectedId) ?? -1),
    [lesson, selectedId]
  );
  const selectedSlide = selectedIdx >= 0 ? lesson!.slides[selectedIdx] : null;

  const updateSlide = (patch: Partial<StudioSlide>) => {
    if (!lesson || selectedIdx < 0) return;
    const next = { ...lesson, slides: [...lesson.slides] };
    next.slides[selectedIdx] = { ...next.slides[selectedIdx], ...patch };
    setLesson(next);
  };

  const ensureLesson = (): StudioLesson => {
    if (lesson) return lesson;
    const fresh: StudioLesson = {
      lesson_title: topic.trim() || 'Untitled lesson',
      slides: [],
      roadmap: ['Warm-up', 'Presentation', 'Practice', 'Production', 'Review'],
    };
    setLesson(fresh);
    return fresh;
  };

  const addBlankSlide = () => {
    const base = ensureLesson();
    const newSlide: StudioSlide = {
      id: uid(),
      phase: DEFAULT_PHASE_FOR_NEW,
      title: 'New blank slide',
      content: '',
      teacher_instructions: '',
      visual_keyword: '',
      interactive_options: [],
    };
    setLesson({ ...base, slides: [...base.slides, newSlide] });
    setSelectedId(newSlide.id);
  };

  const addActivitySlide = () => {
    const base = ensureLesson();
    const newSlide: StudioSlide = {
      id: uid(),
      phase: 'practice',
      slide_type: 'activity',
      interaction_type: 'quiz',
      title: 'Quick activity',
      content: 'Pick the correct answer.',
      teacher_instructions: 'Run a quick check-for-understanding. Praise correct answers.',
      visual_keyword: 'classroom-game',
      interactive_options: ['Option A', 'Option B', 'Option C'],
    };
    setLesson({ ...base, slides: [...base.slides, newSlide] });
    setSelectedId(newSlide.id);
  };

  const duplicateSlide = (id: string) => {
    if (!lesson) return;
    const idx = lesson.slides.findIndex((s) => s.id === id);
    if (idx < 0) return;
    const copy: StudioSlide = { ...lesson.slides[idx], id: uid(), title: (lesson.slides[idx].title || '') + ' (copy)' };
    const next = [...lesson.slides];
    next.splice(idx + 1, 0, copy);
    setLesson({ ...lesson, slides: next });
    setSelectedId(copy.id);
  };

  const deleteSlide = (id: string) => {
    if (!lesson) return;
    const idx = lesson.slides.findIndex((s) => s.id === id);
    if (idx < 0) return;
    const next = lesson.slides.filter((s) => s.id !== id);
    setLesson({ ...lesson, slides: next });
    setSelectedId(next[Math.min(idx, next.length - 1)]?.id || null);
  };

  const moveSlide = (id: string, dir: -1 | 1) => {
    if (!lesson) return;
    const idx = lesson.slides.findIndex((s) => s.id === id);
    const target = idx + dir;
    if (idx < 0 || target < 0 || target >= lesson.slides.length) return;
    const next = [...lesson.slides];
    [next[idx], next[target]] = [next[target], next[idx]];
    setLesson({ ...lesson, slides: next });
  };

  const handlePublish = async () => {
    if (!lesson || !user) return;
    if (!lesson.lesson_title.trim()) {
      toast.error('Lesson needs a title before publishing.');
      return;
    }
    if (lesson.slides.length === 0) {
      toast.error('Add at least one slide before publishing.');
      return;
    }
    setIsSaving(true);
    try {
      const insertData = {
        title: lesson.lesson_title,
        description: lesson.target_goal || null,
        content: {
          structuredData: lesson,
          generatedAt: new Date().toISOString(),
          hub,
          cefr_level: cefrLevel,
          blueprint_context: handoff.fromBlueprint ? handoff : null,
        } as Record<string, unknown>,
        target_system: HUB_TARGET_SYSTEM[hub],
        difficulty_level: HUB_DIFFICULTY[hub],
        duration_minutes: HUB_DURATION[hub],
        created_by: user.id,
        is_published: true,
        skills_focus: handoff.skill_focus
          ? [handoff.skill_focus]
          : (lesson.target_grammar ? [lesson.target_grammar] : []),
      };
      const { error } = await supabase.from('curriculum_lessons').insert(insertData as any);
      if (error) throw error;
      toast.success('✅ Published to Library!');
      onPublished?.();
    } catch (err: any) {
      console.error('Publish error:', err);
      toast.error(err.message || 'Failed to publish lesson.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] min-h-0">
      {/* Studio header */}
      <div className="flex items-center justify-between gap-3 px-6 py-3 border-b border-border/50 bg-card/40 backdrop-blur-xl">
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Step 2 · Slide Studio</div>
          <h1 className="text-lg font-bold tracking-tight truncate">
            {lesson?.lesson_title || handoff.topic || 'New lesson'}
          </h1>
        </div>
        <Button
          onClick={handlePublish}
          disabled={isSaving || !lesson || lesson.slides.length === 0}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-lg"
        >
          {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          💾 Publish to Library
        </Button>
      </div>

      {/* Banner + body */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <div className="p-6 pb-3">
          <BlueprintContextBanner
            handoff={handoff}
            topic={topic}
            setTopic={setTopic}
            cefrLevel={cefrLevel}
            setCefrLevel={setCefrLevel}
            hub={hub}
            setHub={setHub}
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
            hasSlides={!!lesson && lesson.slides.length > 0}
          />
        </div>

        {/* Filmstrip + Editor */}
        <div className="flex-1 min-h-0 flex gap-4 px-6 pb-6">
          {(lesson || isGenerating) && (
            <SlideFilmstrip
              slides={lesson?.slides || []}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onAddBlank={addBlankSlide}
              onAddActivity={addActivitySlide}
              onDuplicate={duplicateSlide}
              onDelete={deleteSlide}
              onMove={moveSlide}
            />
          )}

          <div className="flex-1 min-w-0 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl overflow-hidden">
            {isGenerating && !selectedSlide && (
              <div className="h-full flex flex-col items-center justify-center text-center p-12">
                <Loader2 className="h-10 w-10 animate-spin text-amber-500 mb-3" />
                <h3 className="font-bold text-lg">Architecting your PPP lesson…</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Cambridge-grade scaffolding, level-locked vocabulary, real activities.
                </p>
              </div>
            )}
            {!isGenerating && !selectedSlide && (
              <div className="h-full flex flex-col items-center justify-center text-center p-12">
                <Sparkles className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <h3 className="font-bold text-lg">Your slides will appear here</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  Click <strong>Auto-Generate PPP Slides with AI</strong> above, or add a blank slide manually from the filmstrip.
                </p>
              </div>
            )}
            {selectedSlide && lesson && (
              <SlideEditor
                slide={selectedSlide}
                index={selectedIdx}
                total={lesson.slides.length}
                onChange={updateSlide}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideStudio;
