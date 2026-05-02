import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreator } from '../../CreatorContext';
import { persistLesson } from '../../persistLesson';
import { TeacherControlsPanel } from './TeacherControlsPanel';
import { Button } from '@/components/ui/button';
import { ExternalLink, BookOpen, Sparkles, Loader2, Save, Library } from 'lucide-react';
import { StoryBookViewer } from '@/components/student/story-viewer/StoryBookViewer';
import {
  normalizeSlidesToStoryPages,
  resolveStoryVisualStyle,
} from '@/components/student/story-viewer/storyPageUtils';
import { generateAllMedia } from './mediaGeneration';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const StoryStudioCanvas: React.FC = () => {
  const { activeLessonData, updateSlide, setActiveLessonData, isDirty, setDirty } = useCreator();
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const autoGenTriggered = useRef(false);
  const slides = activeLessonData?.slides ?? [];
  const [activeSlideId, setActiveSlideId] = useState<string | null>(null);
  const activeSlide =
    slides.find((s) => s.id === activeSlideId) ?? slides[0] ?? null;

  const visualStyle = useMemo(
    () => resolveStoryVisualStyle(activeLessonData?.visual_style, activeLessonData?.hub),
    [activeLessonData?.visual_style, activeLessonData?.hub],
  );

  const pages = useMemo(() => normalizeSlidesToStoryPages(slides as any[]), [slides]);
  const lessonId = activeLessonData?.lesson_id;

  const slidesNeedingArt = useMemo(
    () =>
      slides.filter((s) => {
        const panels = (s as any)?.interactive_data?.panels;
        if (Array.isArray(panels) && panels.length > 0) {
          // Paneled slide needs art if ANY panel lacks an image_url.
          return panels.some((p: any) => !(p?.image_url || p?.imageUrl));
        }
        const prompt = (s as any).image_generation_prompt || (s as any).visual_keyword || '';
        return !s.custom_image_url && String(prompt).trim().length > 0;
      }),
    [slides],
  );

  const runGenerateAll = async (overwrite: boolean) => {
    if (!activeLessonData) return;
    if (generating) return;
    const targetSlides = overwrite ? slides : slidesNeedingArt;
    if (!targetSlides.length) {
      toast.message('All pages already have artwork.');
      return;
    }
    setGenerating(true);
    const tid = toast.loading(`🎨 Painting ${targetSlides.length} page${targetSlides.length === 1 ? '' : 's'}…`);
    try {
      const lid = activeLessonData.lesson_id ?? activeLessonData.source_lesson?.id ?? 'draft';
      const hub = activeLessonData.hub ?? 'Academy';
      const { results, summary } = await generateAllMedia(
        lid,
        hub,
        targetSlides as unknown as Array<Record<string, unknown>>,
        overwrite,
      );
      let applied = 0;
      for (const r of results) {
        if (r.error || r.skipped) continue;
        const sourceSlide = slides.find((s) => s.id === r.slideId) as any;
        const patch: Record<string, unknown> = {};

        // Apply per-panel images into interactive_data.panels[i].image_url
        if (Array.isArray(r.panels) && sourceSlide?.interactive_data?.panels) {
          const existing = sourceSlide.interactive_data.panels as any[];
          const merged = existing.map((p, i) => {
            const pr = r.panels!.find((x) => x.index === i);
            return pr?.image_url ? { ...p, image_url: pr.image_url } : p;
          });
          patch.interactive_data = { ...sourceSlide.interactive_data, panels: merged };
          applied += r.panels.filter((p) => !!p.image_url).length;
        }
        if (r.custom_image_url) {
          patch.custom_image_url = r.custom_image_url;
          patch.custom_video_url = undefined;
          patch.youtube_video_id = undefined;
          if (!Array.isArray(r.panels)) applied += 1;
        }
        if (Object.keys(patch).length) {
          updateSlide(r.slideId, patch);
        }
      }
      toast.success(
        `✨ Generated ${applied} image${applied === 1 ? '' : 's'} · ${summary.errors} error${summary.errors === 1 ? '' : 's'}`,
        { id: tid },
      );
    } catch (e: any) {
      toast.error(`Image generation failed: ${e?.message || 'Unknown error'}`, { id: tid });
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveToLibrary = async () => {
    if (!activeLessonData || saving) return;
    setSaving(true);
    const tid = toast.loading('📚 Saving to your library…');
    try {
      const extra: Record<string, unknown> = {};
      if (activeLessonData.visual_style) extra.visual_style = activeLessonData.visual_style;
      if (activeLessonData.story_layout) extra.story_layout = activeLessonData.story_layout;
      if (activeLessonData.parent_lesson_id !== undefined) extra.linked_lesson_id = activeLessonData.parent_lesson_id;
      if (activeLessonData.linked_lesson_title !== undefined) extra.linked_lesson_title = activeLessonData.linked_lesson_title;
      const result = await persistLesson(
        activeLessonData,
        activeLessonData.slides,
        true, // publish
        activeLessonData.kind ?? 'story',
        Object.keys(extra).length ? extra : undefined,
      );
      if (result.ok === false) {
        console.error('Save to Library failed:', result.error);
        toast.error(result.error || 'Failed to save to library', { id: tid });
        return;
      }
      if (!activeLessonData.lesson_id) {
        setActiveLessonData({ ...activeLessonData, lesson_id: result.lesson_id });
      }
      setDirty(false);
      toast.success('📚 Saved to Library', { id: tid });
    } catch (e: any) {
      console.error('Save to Library error:', e);
      toast.error(e?.message || 'Failed to save to library', { id: tid });
    } finally {
      setSaving(false);
    }
  };

  // ── No-Click Auto-Image Pipeline (story version) ──
  useEffect(() => {
    if (autoGenTriggered.current || generating || !slides.length || !activeLessonData) return;
    if (!slidesNeedingArt.length) return;
    autoGenTriggered.current = true;
    void runGenerateAll(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides, activeLessonData]);

  return (
    <div className="h-full w-full flex flex-col bg-slate-950">
      {/* Top action bar */}
      <div className="shrink-0 flex items-center justify-between gap-3 px-4 py-2 bg-slate-900 border-b border-white/10">
        <div className="flex items-center gap-2 min-w-0 text-white/90">
          <BookOpen className="h-4 w-4 text-fuchsia-300" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-200/80">
            Story Studio · {visualStyle.replace('_', ' ')}
          </span>
          <span className="text-sm font-semibold truncate">
            {activeLessonData?.lesson_title}
          </span>
          {generating && (
            <span className="ml-2 inline-flex items-center gap-1 text-[11px] font-semibold text-fuchsia-300">
              <Loader2 className="h-3 w-3 animate-spin" /> AI illustrating…
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded',
              isDirty
                ? 'bg-amber-500/20 text-amber-200'
                : 'bg-emerald-500/20 text-emerald-200',
            )}
            title={isDirty ? 'Saving shortly…' : 'All changes saved'}
          >
            {isDirty ? (
              <span className="inline-flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Saving</span>
            ) : (
              <span className="inline-flex items-center gap-1"><Save className="h-3 w-3" /> Saved</span>
            )}
          </span>
          <Button
            size="sm"
            className="gap-1.5 bg-fuchsia-500 hover:bg-fuchsia-400 text-white border-0"
            onClick={() => runGenerateAll(false)}
            disabled={generating || !slidesNeedingArt.length}
            title={
              slidesNeedingArt.length
                ? `Generate art for ${slidesNeedingArt.length} page${slidesNeedingArt.length === 1 ? '' : 's'}`
                : 'All pages already have artwork'
            }
          >
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate Images {slidesNeedingArt.length ? `(${slidesNeedingArt.length})` : ''}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 bg-white/10 text-white border-white/20 hover:bg-white/20"
            onClick={() => runGenerateAll(true)}
            disabled={generating || !slides.length}
            title="Re-generate all page artwork"
          >
            Regenerate All
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 bg-white/10 text-white border-white/20 hover:bg-white/20"
            onClick={() => {
              if (!lessonId) return;
              navigate(`/lesson/${lessonId}`);
            }}
            disabled={!lessonId}
            title={lessonId ? 'Open in student reader' : 'Save the story first'}
          >
            <ExternalLink className="h-4 w-4" /> Preview Reader
          </Button>
        </div>
      </div>

      {/* Body: live story preview + per-page editor */}
      <div className="flex-1 min-h-0 flex">
        {/* Left: live premium reader */}
        <div className="relative flex-1 min-w-0 min-h-0 bg-black">
          {pages.length > 0 ? (
            <div className="absolute inset-0">
              <StoryBookViewer
                title={activeLessonData?.lesson_title || 'Story'}
                pages={pages}
                visualStyle={visualStyle}
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-white/60 text-sm">
              No story pages yet.
            </div>
          )}
        </div>

        {/* Right: per-slide editor */}
        <aside className="w-[340px] xl:w-[360px] shrink-0 h-full overflow-y-auto border-l border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm">
          <div className="px-3 pt-3 pb-2 border-b border-slate-200 dark:border-slate-800">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
              Story Pages
            </p>
            <div className="flex flex-wrap gap-1">
              {slides.map((s, i) => {
                const active = (activeSlide?.id ?? slides[0]?.id) === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSlideId(s.id)}
                    className={cn(
                      'px-2 py-1 rounded-md text-[11px] font-bold border transition-all',
                      active
                        ? 'bg-fuchsia-500 text-white border-fuchsia-500'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-fuchsia-300',
                    )}
                  >
                    {s.slide_type === 'multiple_choice' ? `Q${i + 1}` : `P${i + 1}`}
                  </button>
                );
              })}
            </div>
          </div>
          {activeSlide && (
            <TeacherControlsPanel
              slide={activeSlide}
              onChange={(patch) => updateSlide(activeSlide.id, patch)}
            />
          )}
        </aside>
      </div>
    </div>
  );
};

export default StoryStudioCanvas;
