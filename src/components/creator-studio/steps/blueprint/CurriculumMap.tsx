import React, { useEffect, useRef, useState } from 'react';
import { Loader2, BookOpen, Palette, Target, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useCreator, CurriculumData, BlueprintLessonRef } from '../../CreatorContext';
import { SkillBadge } from './SkillBadge';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  data: CurriculumData | null;
  loading: boolean;
}

export const CurriculumMap: React.FC<Props> = ({ data, loading }) => {
  const { setActiveLessonData, setCurrentStep } = useCreator();
  const navigate = useNavigate();
  const autoSavedRef = useRef<string | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [savedCount, setSavedCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  const handleBuildSlides = (lesson: BlueprintLessonRef) => {
    if (!data) return;
    setActiveLessonData({
      source_lesson: lesson,
      cefr_level: data.cefr_level,
      hub: data.hub,
      lesson_title: lesson.title,
      target_goal: lesson.objective || lesson.learning_objective,
      slides: [],
      roadmap: ['Warm-up', 'Presentation', 'Practice', 'Production', 'Review'],
    });
    setCurrentStep('slide-builder');
    toast.success(`Opening Slide Studio for "${lesson.title}"…`);
  };

  const saveBlueprintToLibrary = async (
    payload: CurriculumData,
    opts: { silent?: boolean; navigateAfter?: boolean } = {},
  ): Promise<{ ok: boolean; count: number; error?: string }> => {
    // Normalize hub → target_system used by Master Library
    const hubToTargetSystem = (hub: string): string => {
      const h = (hub || '').toLowerCase();
      if (h === 'playground' || h === 'kids') return 'kids';
      if (h === 'academy' || h === 'teen' || h === 'teens') return 'teen';
      if (h === 'success' || h === 'adult' || h === 'adults' || h === 'professional') return 'adult';
      return h || 'teen';
    };

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData.user) {
      if (!opts.silent) toast.error('You must be signed in to save the blueprint.');
      return { ok: false, count: 0, error: 'not-signed-in' };
    }
    const uid = userData.user.id;
    const targetSystem = hubToTargetSystem(payload.hub);
    const cefr = (payload.cefr_level || 'A1').toUpperCase();
    // CHECK constraint on curriculum_lessons.difficulty_level only allows
    // 'beginner' | 'intermediate' | 'advanced'. Map CEFR → bucket.
    const cefrToDifficulty = (c: string): 'beginner' | 'intermediate' | 'advanced' => {
      if (['A1', 'A2'].includes(c)) return 'beginner';
      if (['B1', 'B2'].includes(c)) return 'intermediate';
      return 'advanced'; // C1, C2, fallback
    };
    const difficulty = cefrToDifficulty(cefr);

    const lessonsToInsert = payload.units.flatMap((unit, uIdx) => {
      const unitNumber = unit.unit_number ?? uIdx + 1;
      return unit.lessons.map((lesson, lIdx) => {
        const lessonNumber = lIdx + 1;
        // Strict sequential global order: U1L1=101, U1L2=102, U2L1=201...
        // Keeps unit grouping AND lesson order intact via a single column.
        const globalOrder = unitNumber * 100 + lessonNumber;
        return {
          title: lesson.title,
          description: lesson.objective || lesson.learning_objective || null,
          target_system: targetSystem,
          difficulty_level: difficulty,
          is_published: false,
          created_by: uid,
          sequence_order: globalOrder,
          skills_focus: lesson.skill_focus ? [lesson.skill_focus] : [],
          content: { slides: [], homework_missions: [] },
          ai_metadata: {
            blueprint_ref: lesson,
            cefr_level: cefr,
            unit_title: unit.unit_title,
            unit_number: unitNumber,
            lesson_number: lessonNumber,
            curriculum_title: payload.curriculum_title,
            theme_hint: payload.theme_hint ?? null,
            hub: payload.hub,
          },
        };
      });
    });

    try {
      const { data: inserted, error } = await supabase
        .from('curriculum_lessons')
        .insert(lessonsToInsert as any)
        .select('id, title');
      console.log('Library Save Result:', { inserted, error, count: lessonsToInsert.length, silent: opts.silent });
      if (error) throw error;

      const count = inserted?.length ?? lessonsToInsert.length;
      if (!opts.silent) {
        toast.success(`Blueprint saved! ${count} draft lessons added to your library.`);
      }
      if (opts.navigateAfter) {
        setCurrentStep('library');
        navigate('/content-creator/library');
      }
      return { ok: true, count };
    } catch (err: any) {
      console.error('SAVE TO LIBRARY error:', err);
      if (!opts.silent) {
        toast.error(err?.message || JSON.stringify(err) || 'Unknown SQL error');
      }
      return { ok: false, count: 0, error: err?.message || 'unknown' };
    }
  };

  const forceSaveToLibrary = async () => {
    if (isSaving || hasSaved) return;
    if (!data) {
      toast.error('No curriculum lessons to save.');
      return;
    }
    setIsSaving(true);
    try {
      const res = await saveBlueprintToLibrary(data, { navigateAfter: false });
      if (res.ok) {
        setHasSaved(true);
        toast.success(`✅ Saved ${res.count} lessons. Opening library…`);
        setTimeout(() => navigate('/content-creator/library'), 1000);
        // Intentionally keep isSaving=true so button stays locked during redirect
      } else {
        setIsSaving(false);
      }
    } catch (err) {
      setIsSaving(false);
    }
  };

  // ── Auto-save: as soon as a fresh blueprint arrives, persist all
  // lessons to the Master Library as drafts (no button click required).
  useEffect(() => {
    if (!data || loading) return;
    const fingerprint =
      `${data.curriculum_title}::${data.cefr_level}::${data.hub}::` +
      `${data.units.length}::${data.units.reduce((n, u) => n + u.lessons.length, 0)}`;
    if (autoSavedRef.current === fingerprint) return;
    autoSavedRef.current = fingerprint;

    setAutoSaveStatus('saving');
    saveBlueprintToLibrary(data, { silent: true }).then((res) => {
      if (res.ok) {
        setAutoSaveStatus('saved');
        setSavedCount(res.count);
        toast.success(`Auto-saved ${res.count} lessons to your Master Library as drafts.`);
      } else {
        setAutoSaveStatus('error');
        toast.error(`Auto-save failed: ${res.error ?? 'unknown error'}. You can retry below.`);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loading]);



  if (loading && !data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-sky-500 mb-3" />
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-50">Architecting your curriculum…</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Spaced repetition, skill rotation, and CEFR-locked vocabulary.
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
        <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
          <BookOpen className="h-6 w-6 text-slate-400" />
        </div>
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-50">Your Curriculum Map will appear here</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md">
          Configure the level, age group, and theme on the left, then click <strong>Generate Master Blueprint</strong>.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-widest text-sky-500">
            {data.cefr_level} · {data.hub}
          </div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 truncate">
            {data.curriculum_title}
          </h2>
          {data.theme_hint && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Theme: {data.theme_hint}</p>
          )}
        </div>
        <div className="text-right text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <div><strong className="text-slate-900 dark:text-slate-50">{data.units.length}</strong> units</div>
          <div><strong className="text-slate-900 dark:text-slate-50">{data.units.reduce((n, u) => n + u.lessons.length, 0)}</strong> lessons</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* ── Auto-save status banner ───────────────────────────── */}
        {autoSaveStatus !== 'idle' && (
          <div
            className={
              'mb-5 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ' +
              (autoSaveStatus === 'saved'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200'
                : autoSaveStatus === 'saving'
                ? 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900/50 dark:bg-sky-950/30 dark:text-sky-200'
                : 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-200')
            }
          >
            {autoSaveStatus === 'saving' && (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Auto-saving all lessons to your Master Library…</span>
              </>
            )}
            {autoSaveStatus === 'saved' && (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span className="flex-1">
                  <strong>{savedCount} draft lessons</strong> were automatically saved to your Master Library. Edit and publish them anytime.
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-emerald-700 hover:bg-emerald-100 dark:text-emerald-200 dark:hover:bg-emerald-900/40"
                  onClick={() => {
                    setCurrentStep('library');
                    navigate('/content-creator/library');
                  }}
                >
                  Open Library →
                </Button>
              </>
            )}
            {autoSaveStatus === 'error' && (
              <span className="flex-1">Auto-save didn't go through. Tap retry below.</span>
            )}
          </div>
        )}

        <Accordion type="multiple" defaultValue={data.units.map((u) => u.id)} className="space-y-3">
          {data.units.map((unit, uIdx) => (
            <AccordionItem
              key={unit.id}
              value={unit.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-100 dark:hover:bg-slate-900/60 [&[data-state=open]]:bg-slate-100 dark:[&[data-state=open]]:bg-slate-900/60">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow text-white font-bold text-sm flex-shrink-0">
                    {unit.unit_number ?? uIdx + 1}
                  </div>
                  <div className="min-w-0 text-left">
                    <div className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-50 truncate">
                      {unit.unit_title}
                    </div>
                    {unit.theme && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        🎯 {unit.theme} · {unit.lessons.length} lessons
                      </div>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-0 pb-4">
                <ul className="space-y-2">
                  {unit.lessons.map((lesson, lIdx) => (
                    <li
                      key={lesson.id}
                      className="group rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 flex items-start gap-3"
                    >
                      <div className="h-7 w-7 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                        {lesson.lesson_number ?? lIdx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">
                            {lesson.title}
                          </h4>
                          <SkillBadge skill={lesson.skill_focus} />
                        </div>
                        {(lesson.objective || lesson.learning_objective) && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-start gap-1.5">
                            <Target className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            <span>{lesson.objective || lesson.learning_objective}</span>
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleBuildSlides(lesson)}
                        className="shrink-0 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-sm"
                      >
                        <Palette className="h-3.5 w-3.5 mr-1" />
                        Build Slides
                      </Button>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <button
          onClick={forceSaveToLibrary}
          className="w-full py-4 mt-8 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg rounded-xl shadow-lg"
        >
          {autoSaveStatus === 'saved'
            ? '✅ Save Again & Open Library'
            : autoSaveStatus === 'error'
            ? '🔁 Retry Save to Library'
            : '💾 Save to Library & Open'}
        </button>
      </div>
    </>
  );
};
