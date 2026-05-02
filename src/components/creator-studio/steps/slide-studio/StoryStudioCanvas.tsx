import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreator } from '../../CreatorContext';
import { TeacherControlsPanel } from './TeacherControlsPanel';
import { Button } from '@/components/ui/button';
import { ExternalLink, BookOpen, Sparkles, Loader2, Save } from 'lucide-react';
import { StoryBookViewer } from '@/components/student/story-viewer/StoryBookViewer';
import {
  normalizeSlidesToStoryPages,
  resolveStoryVisualStyle,
} from '@/components/student/story-viewer/storyPageUtils';
import { generateAllMedia } from './mediaGeneration';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const StoryStudioCanvas: React.FC = () => {
  const { activeLessonData, updateSlide, isDirty } = useCreator();
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);
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
        </div>
        <div className="flex items-center gap-2">
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
