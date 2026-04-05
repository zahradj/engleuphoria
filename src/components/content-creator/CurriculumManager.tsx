import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { generatePPPLesson } from '@/components/admin/lesson-builder/ai-wizard/generatePPPLesson';
import { resolveHub, HUB_CONFIGS } from '@/components/admin/lesson-builder/ai-wizard/hubConfig';
import { saveToLibrary } from '@/services/lessonLibraryService';
import { WizardFormData, GeneratedSlide, HubType } from '@/components/admin/lesson-builder/ai-wizard/types';
import { CurriculumContext } from './CurriculumStep';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BookOpen, ChevronRight, Loader2, Sparkles, CheckCircle2,
  AlertCircle, Play, ArrowLeft, ArrowRight, Zap, FileSliders,
} from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { CurriculumExplorerTree, HubKey, ExplorerLesson } from './CurriculumExplorerTree';

interface CurriculumUnit {
  id: string;
  title: string;
  unit_number: number;
  age_group: string;
  cefr_level: string;
  learning_objectives: string[];
}

interface CurriculumLesson {
  id: string;
  title: string;
  unit_id: string | null;
  target_system: string;
  difficulty_level: string;
  sequence_order: number | null;
  content: any;
  is_published: boolean | null;
  duration_minutes: number | null;
}

type SlideStatus = 'needs_slides' | 'ready';

interface CurriculumManagerProps {
  curriculumContext: CurriculumContext | null;
  onBack: () => void;
  onNext: () => void;
}

export const CurriculumManager: React.FC<CurriculumManagerProps> = ({
  curriculumContext,
  onBack,
  onNext,
}) => {
  const [units, setUnits] = useState<CurriculumUnit[]>([]);
  const [lessons, setLessons] = useState<CurriculumLesson[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingLessonId, setGeneratingLessonId] = useState<string | null>(null);
  const [batchGenerating, setBatchGenerating] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0, lessonTitle: '' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch units filtered by context
      let unitQuery = supabase.from('curriculum_units').select('*').order('unit_number');
      if (curriculumContext?.ageGroup) {
        unitQuery = unitQuery.eq('age_group', curriculumContext.ageGroup);
      }
      const { data: unitData } = await unitQuery;
      const fetchedUnits = (unitData || []) as CurriculumUnit[];
      setUnits(fetchedUnits);

      // Select first unit by default
      if (fetchedUnits.length > 0 && !selectedUnitId) {
        setSelectedUnitId(fetchedUnits[0].id);
      }

      // Fetch all lessons for these units
      if (fetchedUnits.length > 0) {
        const unitIds = fetchedUnits.map(u => u.id);
        const { data: lessonData } = await supabase
          .from('curriculum_lessons')
          .select('*')
          .in('unit_id', unitIds)
          .order('sequence_order');
        setLessons((lessonData || []) as CurriculumLesson[]);
      }
    } catch (err) {
      console.error('Failed to fetch curriculum data:', err);
    } finally {
      setLoading(false);
    }
  }, [curriculumContext]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getLessonStatus = (lesson: CurriculumLesson): SlideStatus => {
    const hasSlides = lesson.content?.slides && Array.isArray(lesson.content.slides) && lesson.content.slides.length > 0;
    return hasSlides ? 'ready' : 'needs_slides';
  };

  const selectedUnit = units.find(u => u.id === selectedUnitId);
  const unitLessons = lessons.filter(l => l.unit_id === selectedUnitId);
  const needsSlides = unitLessons.filter(l => getLessonStatus(l) === 'needs_slides');
  const readyCount = unitLessons.filter(l => getLessonStatus(l) === 'ready').length;

  const resolveHubFromContext = (): HubType => {
    if (curriculumContext?.ageGroup === 'kids') return 'playground';
    if (curriculumContext?.ageGroup === 'teens') return 'academy';
    return 'professional';
  };

  const generateSlidesForLesson = async (lesson: CurriculumLesson): Promise<GeneratedSlide[] | null> => {
    try {
      const hub = resolveHubFromContext();
      const cefrLevel = lesson.difficulty_level || curriculumContext?.level || 'beginner';

      // Extract topic from lesson content or title
      const topic = lesson.content?.vocabularyTheme || lesson.title.replace(/^\d+\.\d+\s*/, '');

      const levelMap: Record<string, 'beginner' | 'intermediate' | 'advanced'> = {
        beginner: 'beginner', elementary: 'beginner', 'pre-intermediate': 'intermediate',
        intermediate: 'intermediate', A1: 'beginner', A2: 'beginner', B1: 'intermediate', B2: 'advanced',
      };
      const ageMap: Record<string, 'kids' | 'teens' | 'adults'> = {
        kids: 'kids', teens: 'teens', adults: 'adults',
      };

      const formData: WizardFormData = {
        topic,
        level: levelMap[cefrLevel] || 'beginner',
        ageGroup: ageMap[curriculumContext?.ageGroup || 'kids'] || 'kids',
      };

      const plan = generatePPPLesson(formData);

      // Save slides into the lesson's content
      const updatedContent = {
        ...lesson.content,
        slides: plan.slides,
        hub,
        generatedAt: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('curriculum_lessons')
        .update({ content: updatedContent, is_published: true } as any)
        .eq('id', lesson.id);

      if (error) throw error;

      // Also save to library for student access
      try {
        await saveToLibrary(
          lesson.title,
          hub,
          cefrLevel,
          plan.slides,
          undefined, // thumbnail
        );
      } catch {
        // Library save is optional
      }

      return plan.slides;
    } catch (err) {
      console.error('Failed to generate slides for lesson:', lesson.title, err);
      return null;
    }
  };

  const handleGenerateSingle = async (lesson: CurriculumLesson) => {
    setGeneratingLessonId(lesson.id);
    const slides = await generateSlidesForLesson(lesson);
    if (slides) {
      toast.success(`Slides generated for "${lesson.title}"`);
      await fetchData();
    } else {
      toast.error(`Failed to generate slides for "${lesson.title}"`);
    }
    setGeneratingLessonId(null);
  };

  const handleGenerateAll = async () => {
    if (needsSlides.length === 0) return;
    setBatchGenerating(true);
    setBatchProgress({ current: 0, total: needsSlides.length, lessonTitle: '' });

    let successCount = 0;
    for (let i = 0; i < needsSlides.length; i++) {
      const lesson = needsSlides[i];
      setBatchProgress({ current: i + 1, total: needsSlides.length, lessonTitle: lesson.title });

      const slides = await generateSlidesForLesson(lesson);
      if (slides) successCount++;

      // Small delay to avoid overwhelming the UI
      await new Promise(r => setTimeout(r, 300));
    }

    setBatchGenerating(false);
    await fetchData();
    toast.success(`Generated slides for ${successCount}/${needsSlides.length} lessons!`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (units.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Step 2: Curriculum Manager</h1>
          <p className="text-muted-foreground mt-1">No curriculum found. Go back to Step 1 to generate one.</p>
        </div>
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Blueprint
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileSliders className="h-6 w-6 text-primary" />
            Curriculum Manager
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Select a unit, review lessons, and generate interactive slides.
          </p>
        </div>
        {curriculumContext && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{curriculumContext.ageGroup}</Badge>
            <Badge variant="outline">{curriculumContext.level}</Badge>
          </div>
        )}
      </div>

      {/* Batch Generate bar */}
      {batchGenerating && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex items-center gap-3 mb-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm font-medium text-foreground">
                Generating: {batchProgress.lessonTitle} ({batchProgress.current}/{batchProgress.total})
              </span>
            </div>
            <Progress value={(batchProgress.current / batchProgress.total) * 100} className="h-2" />
          </CardContent>
        </Card>
      )}

      {/* Main Layout: Sidebar + Content */}
      <div className="grid grid-cols-12 gap-4" style={{ minHeight: 480 }}>
        {/* Sidebar: Curriculum Explorer Tree */}
        <div className="col-span-4 lg:col-span-3">
          <Card className="h-full overflow-hidden">
            <CurriculumExplorerTree
              onLessonSelect={(lesson) => {
                // Find the unit for this lesson and select it
                const unit = units.find(u => lessons.some(l => l.unit_id === u.id && l.id === lesson.id));
                if (unit) setSelectedUnitId(unit.id);
              }}
              onGenerateLesson={(lesson) => {
                const matched = lessons.find(l => l.id === lesson.id);
                if (matched) handleGenerateSingle(matched);
              }}
              selectedLessonId={null}
              generatingLessonIds={new Set(generatingLessonId ? [generatingLessonId] : [])}
              onHubChange={(hub) => {
                // Optionally update context when hub changes
              }}
            />
          </Card>
        </div>

        {/* Main Content: Lessons */}
        <div className="col-span-8 lg:col-span-9">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg">{selectedUnit?.title || 'Select a Unit'}</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {readyCount}/{unitLessons.length} lessons ready · {needsSlides.length} need slides
                </p>
              </div>
              {needsSlides.length > 0 && (
                <Button
                  onClick={handleGenerateAll}
                  disabled={batchGenerating}
                  className="gap-2"
                  size="sm"
                >
                  {batchGenerating ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
                  ) : (
                    <><Zap className="h-4 w-4" /> Generate All Slides ({needsSlides.length})</>
                  )}
                </Button>
              )}
            </CardHeader>
            <ScrollArea className="h-[400px]">
              <div className="px-4 pb-4 space-y-2">
                <AnimatePresence>
                  {unitLessons.map((lesson, i) => {
                    const status = getLessonStatus(lesson);
                    const isGenerating = generatingLessonId === lesson.id;
                    const slideCount = lesson.content?.slides?.length || 0;

                    return (
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors"
                      >
                        {/* Status indicator */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          status === 'ready' ? 'bg-emerald-500/15 text-emerald-600' : 'bg-destructive/10 text-destructive'
                        }`}>
                          {status === 'ready' ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <AlertCircle className="h-4 w-4" />
                          )}
                        </div>

                        {/* Lesson info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {lesson.sequence_order ? `${lesson.sequence_order}. ` : ''}{lesson.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {status === 'ready' ? (
                              <span className="text-[11px] text-emerald-600 font-medium">Ready to Teach · {slideCount} slides</span>
                            ) : (
                              <span className="text-[11px] text-destructive font-medium">Needs Slides</span>
                            )}
                            {lesson.content?.grammarFocus && (
                              <Badge variant="outline" className="text-[10px] h-4 px-1.5">{lesson.content.grammarFocus}</Badge>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          {status === 'needs_slides' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleGenerateSingle(lesson)}
                              disabled={isGenerating || batchGenerating}
                              className="gap-1.5 text-xs h-8"
                            >
                              {isGenerating ? (
                                <><Loader2 className="h-3 w-3 animate-spin" /> Generating...</>
                              ) : (
                                <><Sparkles className="h-3 w-3" /> Generate</>
                              )}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="gap-1.5 text-xs h-8 text-emerald-600"
                              onClick={() => {
                                // Could preview the lesson
                                window.open(`/lesson/${lesson.id}`, '_blank');
                              }}
                            >
                              <Play className="h-3 w-3" /> Preview
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {unitLessons.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
                    <p>No lessons in this unit yet.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-border">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back: Blueprint
        </Button>
        <Button onClick={onNext} className="gap-2">
          Next: Content Library
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
