import React, { useEffect, useMemo, useState } from 'react';
import { useCreator } from '../../CreatorContext';
import { EmptyState } from './EmptyState';
import { SlideThumbnailRail } from './SlideThumbnailRail';
import { SlideCanvas } from './SlideCanvas';
import { TeacherControlsPanel } from './TeacherControlsPanel';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, Sparkles, Loader2 } from 'lucide-react';
import { generateSlideImage, generateSlideVoiceover, generateAllMedia } from './mediaGeneration';
import { toast } from 'sonner';
import { SlideErrorBoundary } from '@/components/common/SlideErrorBoundary';
import { useSlidePrefetch, type SlideAssets } from '@/hooks/useSlidePrefetch';
import { useHubTheme } from '@/hooks/useHubTheme';
import { cn } from '@/lib/utils';
import PhaseTracker from '@/components/lesson-player/PhaseTracker';

const SlideStudioInner: React.FC = () => {
  const { activeLessonData, updateSlide, setCurrentStep } = useCreator();
  const [activeSlideId, setActiveSlideId] = useState<string | null>(null);
  const [autoGenerating, setAutoGenerating] = useState(false);
  const { theme } = useHubTheme();

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
  const activeIndex = activeSlide ? slides.findIndex((s) => s.id === activeSlide.id) : -1;

  // Build asset bundles for the prefetcher (next 2 slides preload silently).
  const prefetchAssets: SlideAssets[] = useMemo(
    () =>
      slides.map((s) => ({
        imageUrl: s.custom_image_url ?? null,
        audioUrl: s.audio_url ?? null,
        videoUrl: s.custom_video_url ?? null,
      })),
    [slides],
  );
  useSlidePrefetch(prefetchAssets, activeIndex, 2);

  const goToNextSlide = () => {
    if (activeIndex < 0 || activeIndex >= slides.length - 1) return;
    setActiveSlideId(slides[activeIndex + 1].id);
  };
  return (
    <div className={cn('h-full flex flex-col -m-6 hub-surface', theme.themeClass, theme.font)}>
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
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-slate-400 font-mono">
                {slides.length} slide{slides.length === 1 ? '' : 's'}
              </span>
              <Button
                onClick={async () => {
                  if (autoGenerating || !slides.length) return;
                  const lessonId = activeLessonData.lesson_id ?? activeLessonData.source_lesson?.id ?? 'draft';
                  const hub = activeLessonData.hub ?? 'Academy';
                  setAutoGenerating(true);
                  toast.message('🎨 AI Art Director is composing the deck…', {
                    description: `Generating images & fetching videos for ${slides.length} slides.`,
                  });
                  try {
                    const { results, summary } = await generateAllMedia(lessonId, hub, slides, false);
                    // Apply each per-slide patch.
                    for (const r of results) {
                      if (r.error || r.skipped) continue;
                      const patch: Record<string, unknown> = {};
                      if (r.custom_image_url) {
                        patch.custom_image_url = r.custom_image_url;
                        patch.custom_video_url = undefined;
                        patch.youtube_video_id = undefined;
                      }
                      if (r.youtube_video_id) {
                        patch.youtube_video_id = r.youtube_video_id;
                        patch.youtube_embed_url = r.youtube_embed_url;
                        patch.youtube_title = r.youtube_title;
                        patch.youtube_thumbnail = r.youtube_thumbnail;
                        patch.custom_image_url = undefined;
                        patch.custom_video_url = undefined;
                      }
                      if (Object.keys(patch).length) updateSlide(r.slideId, patch);
                    }
                    if (summary.errors > 0) {
                      toast.warning(
                        `Done with ${summary.errors} issue${summary.errors === 1 ? '' : 's'}`,
                        { description: `🖼️ ${summary.images} images · 🎬 ${summary.videos} videos · ⏭️ ${summary.skipped} skipped.` },
                      );
                    } else {
                      toast.success('Deck media ready ✨', {
                        description: `🖼️ ${summary.images} images · 🎬 ${summary.videos} videos · ⏭️ ${summary.skipped} skipped.`,
                      });
                    }
                  } catch (e) {
                    toast.error(`Auto-generate failed: ${(e as Error).message}`);
                  } finally {
                    setAutoGenerating(false);
                  }
                }}
                disabled={autoGenerating || !slides.length}
                className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-400 text-white font-extrabold shadow-lg shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50 transition-shadow border-0"
              >
                {autoGenerating
                  ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  : <Sparkles className="h-4 w-4 mr-1.5" />}
                ✨ Auto-Generate All Media
              </Button>
            </div>
          )}
        </div>
        {!!slides.length && (
          <div className="mt-3">
            <PhaseTracker
              slides={slides as any}
              currentIndex={Math.max(0, activeIndex)}
              onJumpToPhase={(idx) => setActiveSlideId(slides[idx]?.id ?? null)}
            />
          </div>
        )}
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
              <SlideErrorBoundary
                resetKey={activeSlide.id}
                label="this slide"
                onSkip={goToNextSlide}
              >
                <SlideCanvas slide={activeSlide} onChange={(patch) => updateSlide(activeSlide.id, patch)} />
              </SlideErrorBoundary>
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

/**
 * Public Studio export — wraps the entire studio in a friendly Error Boundary
 * so a single corrupt slide cannot white-screen the whole creator app.
 */
export const SlideStudio: React.FC = () => (
  <SlideErrorBoundary label="the studio">
    <SlideStudioInner />
  </SlideErrorBoundary>
);

