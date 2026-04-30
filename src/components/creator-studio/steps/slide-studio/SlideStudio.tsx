import React, { useEffect, useMemo, useState } from 'react';
import { useCreator } from '../../CreatorContext';
import { EmptyState } from './EmptyState';
import { SlideCanvas } from './SlideCanvas';
import { TeacherControlsPanel } from './TeacherControlsPanel';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, Sparkles, Loader2, Image as ImageIcon, ListChecks, Pencil, Layers } from 'lucide-react';
import { generateAllMedia } from './mediaGeneration';
import { toast } from 'sonner';
import { SlideErrorBoundary } from '@/components/common/SlideErrorBoundary';
import { useSlidePrefetch, type SlideAssets } from '@/hooks/useSlidePrefetch';
import { useHubTheme } from '@/hooks/useHubTheme';
import { cn } from '@/lib/utils';
import PhaseTracker from '@/components/lesson-player/PhaseTracker';
import { PHASE_STYLES, normalizePhase } from './phaseTheme';


const TYPE_ICON: Record<string, React.ElementType> = {
  text_image: ImageIcon,
  multiple_choice: ListChecks,
  drawing_prompt: Pencil,
  flashcard: Layers,
};

const SlideStudioInner: React.FC = () => {
  const { activeLessonData, updateSlide, setCurrentStep } = useCreator();
  const [activeSlideId, setActiveSlideId] = useState<string | null>(null);
  const [autoGenerating, setAutoGenerating] = useState(false);
  const autoGenTriggered = React.useRef(false);
  const { theme } = useHubTheme();

  const slides = activeLessonData?.slides ?? [];

  useEffect(() => {
    if (!slides.length) {
      setActiveSlideId(null);
      return;
    }
    if (!activeSlideId || !slides.find((s) => s.id === activeSlideId)) {
      setActiveSlideId(slides[0].id);
    }
  }, [slides, activeSlideId]);

  // ── No-Click Auto-Image Pipeline ──
  // When slides first populate, auto-generate media for any slide missing images
  useEffect(() => {
    if (autoGenTriggered.current || autoGenerating || !slides.length || !activeLessonData) return;
    const needsMedia = slides.some(
      (s) => !s.custom_image_url && (s.visual_keyword || '').trim().length > 0
    );
    if (!needsMedia) return;
    autoGenTriggered.current = true;
    const run = async () => {
      setAutoGenerating(true);
      try {
        const lessonId = activeLessonData.lesson_id ?? activeLessonData.source_lesson?.id ?? 'draft';
        const hub = activeLessonData.hub ?? 'Academy';
        const { results } = await generateAllMedia(lessonId, hub, slides as unknown as Array<Record<string, unknown>>, false);
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
        toast.success('✨ AI Art Director finished composing the deck.');
      } catch (e) {
        console.error('[auto-media]', e);
        toast.error(`Auto-generate failed: ${(e as Error).message}`);
      } finally {
        setAutoGenerating(false);
      }
    };
    run();
  }, [slides, activeLessonData, autoGenerating, updateSlide]);

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

  const activeSlide = slides.find((s) => s.id === activeSlideId) ?? null;
  const activeIndex = activeSlide ? slides.findIndex((s) => s.id === activeSlide.id) : -1;

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

  const handleAutoGenerate = async () => {
    if (autoGenerating || !slides.length) return;
    const lessonId = activeLessonData.lesson_id ?? activeLessonData.source_lesson?.id ?? 'draft';
    const hub = activeLessonData.hub ?? 'Academy';
    setAutoGenerating(true);
    toast.message('🎨 AI Art Director is composing the deck…', {
      description: `Generating images & fetching videos for ${slides.length} slides.`,
    });
    try {
      const { results, summary } = await generateAllMedia(lessonId, hub, slides as unknown as Array<Record<string, unknown>>, false);
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
        toast.warning(`Done with ${summary.errors} issue${summary.errors === 1 ? '' : 's'}`, {
          description: `🖼️ ${summary.images} images · 🎬 ${summary.videos} videos · ⏭️ ${summary.skipped} skipped.`,
        });
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
  };

  return (
    <div className={cn('h-full flex flex-col -m-6 hub-surface', theme.themeClass, theme.font)}>
      {/* ── Lesson header strip ── */}
      <div className="px-6 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center justify-between gap-4 flex-wrap">
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
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-50 truncate">
              {activeLessonData.lesson_title}
            </h2>
          </div>
          {!!slides.length && (
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-slate-400 font-mono">
                {slides.length} slide{slides.length === 1 ? '' : 's'}
              </span>
              <Button
                onClick={handleAutoGenerate}
                disabled={autoGenerating || !slides.length}
                className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-400 text-white font-extrabold shadow-lg shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50 transition-shadow border-0"
              >
                {autoGenerating ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1.5" />}
                ✨ Auto-Generate All Media
              </Button>
            </div>
          )}
        </div>
        {!!slides.length && (
          <div className="mt-2">
            <PhaseTracker
              slides={slides as any}
              currentIndex={Math.max(0, activeIndex)}
              onJumpToPhase={(idx) => setActiveSlideId(slides[idx]?.id ?? null)}
            />
          </div>
        )}
      </div>

      {/* ── Body: Left Sidebar (controls) + Center Stage (preview) ── */}
      {!slides.length ? (
        <div className="flex-1 min-h-0">
          <EmptyState />
        </div>
      ) : (
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex-1 min-h-0 flex">
            {/* Left Sidebar — Teacher Controls (20%) */}
            {activeSlide && (
              <aside className="w-[280px] xl:w-[320px] shrink-0 h-full overflow-y-auto border-r border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
                <TeacherControlsPanel slide={activeSlide} onChange={(patch) => updateSlide(activeSlide.id, patch)} />
              </aside>
            )}

            {/* Center Stage — Gray canvas with scaled App-Card preview (80%) */}
            {activeSlide ? (
              <SlideErrorBoundary resetKey={activeSlide.id} label="this slide" onSkip={goToNextSlide}>
                <SlideCanvas slide={activeSlide} onChange={(patch) => updateSlide(activeSlide.id, patch)} />
              </SlideErrorBoundary>
            ) : (
              <div className="flex-1 flex items-center justify-center text-sm text-slate-500">
                Select a slide below to start editing.
              </div>
            )}
          </div>

          {/* ── Bottom Timeline — Horizontal scrollable slide thumbnails ── */}
          <div className="shrink-0 h-[100px] border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
            <div className="h-full overflow-x-auto px-3 py-2 flex items-center gap-2">
              {slides.map((s, i) => {
                const active = s.id === activeSlideId;
                const phaseKey = normalizePhase(s.phase as string);
                const style = PHASE_STYLES[phaseKey];
                const Icon = TYPE_ICON[s.slide_type ?? 'text_image'] ?? ImageIcon;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveSlideId(s.id)}
                    className={cn(
                      'shrink-0 w-[120px] h-[78px] rounded-xl border-2 p-2 flex flex-col justify-between transition-all text-left',
                      style.gradient,
                      active
                        ? `${style.ring} ring-2 border-transparent shadow-lg scale-105`
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm',
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className={cn('text-[8px] font-bold px-1 py-0.5 rounded', style.chip)}>
                        {style.label}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">#{i + 1}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-auto">
                      <Icon className="h-3 w-3 text-slate-500 shrink-0" />
                      <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-200 truncate">
                        {s.title || 'Untitled'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
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
