import React, { useEffect, useState } from 'react';
import { useCreator } from '../../CreatorContext';
import { EmptyState } from './EmptyState';
import { SlideThumbnailRail } from './SlideThumbnailRail';
import { SlideCanvas } from './SlideCanvas';
import { TeacherControlsPanel } from './TeacherControlsPanel';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, Sparkles, Loader2 } from 'lucide-react';
import { generateSlideImage, generateSlideVoiceover } from './mediaGeneration';
import { toast } from 'sonner';

export const SlideStudio: React.FC = () => {
  const { activeLessonData, updateSlide, setCurrentStep } = useCreator();
  const [activeSlideId, setActiveSlideId] = useState<string | null>(null);

  // Auto-select first slide whenever the deck changes / loads.
  useEffect(() => {
    const slides = activeLessonData?.slides ?? [];
    if (!slides.length) {
      setActiveSlideId(null);
      return;
    }
    if (!activeSlideId || !slides.find((s) => s.id === activeSlideId)) {
      setActiveSlideId(slides[0].id);
    }
  }, [activeLessonData?.slides, activeSlideId]);

  if (!activeLessonData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="max-w-md text-center p-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">No lesson selected</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Open the Blueprint tab and click <span className="font-semibold">🎨 Build Slides</span> on any lesson to start authoring.
          </p>
          <Button className="mt-5 gap-1.5" onClick={() => setCurrentStep('blueprint')}>
            Go to Blueprint <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  const slides = activeLessonData.slides;
  const activeSlide = slides.find((s) => s.id === activeSlideId) ?? null;

  return (
    <div className="h-full flex flex-col -m-6">
      {/* Lesson header strip */}
      <div className="px-6 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              <span>{activeLessonData.cefr_level}</span>
              <span>·</span>
              <span>{activeLessonData.hub} Hub</span>
              {activeLessonData.source_lesson?.skill_focus && (
                <>
                  <span>·</span>
                  <span>{activeLessonData.source_lesson.skill_focus}</span>
                </>
              )}
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 mt-0.5 truncate">
              {activeLessonData.lesson_title}
            </h2>
            {activeLessonData.target_goal && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 inline-flex items-start gap-1.5 max-w-3xl">
                <Target className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span className="line-clamp-2">{activeLessonData.target_goal}</span>
              </p>
            )}
          </div>
          {!!slides.length && (
            <div className="text-xs text-slate-400 font-mono shrink-0">
              {slides.length} slide{slides.length === 1 ? '' : 's'}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      {!slides.length ? (
        <div className="flex-1 min-h-0">
          <EmptyState />
        </div>
      ) : (
        <div className="flex-1 min-h-0 flex">
          <SlideThumbnailRail slides={slides} activeId={activeSlideId} onSelect={setActiveSlideId} />
          {activeSlide ? (
            <>
              <SlideCanvas slide={activeSlide} onChange={(patch) => updateSlide(activeSlide.id, patch)} />
              <TeacherControlsPanel slide={activeSlide} onChange={(patch) => updateSlide(activeSlide.id, patch)} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-slate-500">
              Select a slide on the left to start editing.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
