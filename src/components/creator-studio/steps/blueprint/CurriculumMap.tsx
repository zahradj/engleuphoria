import React, { useState } from 'react';
import { Loader2, BookOpen, Palette, Target, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useCreator, CurriculumData, BlueprintLessonRef } from '../../CreatorContext';
import { SkillBadge } from './SkillBadge';
import { persistBlueprintAsDrafts } from '../../persistBlueprint';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Props {
  data: CurriculumData | null;
  loading: boolean;
}

export const CurriculumMap: React.FC<Props> = ({ data, loading }) => {
  const { setActiveLessonData, setCurrentStep } = useCreator();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

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

  const handleSaveBlueprint = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const result = await persistBlueprintAsDrafts(data);
      toast.success(`🎉 Blueprint saved! ${result.totalCount} draft lessons created.`);
      navigate('/content-creator');
    } catch (err: any) {
      console.error('Blueprint save error:', err);
      toast.error(err?.message || 'Failed to save blueprint.');
    } finally {
      setSaving(false);
    }
  };

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

        {/* Save Blueprint Button */}
        <Button
          size="lg"
          onClick={handleSaveBlueprint}
          disabled={saving}
          className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
        >
          {saving ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving…</>
          ) : (
            <><Save className="w-5 h-5 mr-2" /> Save Entire Blueprint to Library</>
          )}
        </Button>
      </div>
    </>
  );
};
