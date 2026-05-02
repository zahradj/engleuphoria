import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ImmersiveLessonReader } from '@/components/student/lesson-reader/ImmersiveLessonReader';
import LessonPlayerContainer from '@/components/lesson-player/LessonPlayerContainer';
import { StoryBookViewer, StoryPage, StoryLayout, StoryVisualStyle } from '@/components/student/story-viewer/StoryBookViewer';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HubType, GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';

interface LessonData {
  id: string;
  title: string;
  description: string | null;
  content: any;
  difficulty_level: string;
  target_system: string;
  duration_minutes: number | null;
  ai_metadata: any;
}

const LessonReaderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchLesson = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('curriculum_lessons')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        setError('Lesson not found');
      } else {
        setLesson(data as LessonData);
      }
      setLoading(false);
    };
    fetchLesson();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-lg text-muted-foreground">{error || 'Lesson not found'}</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  // ── Story-kind lessons get the dedicated immersive viewer ──
  const isStory = lesson.ai_metadata?.kind === 'story';
  const slides: GeneratedSlide[] | null = lesson.content?.slides || null;
  const hub: HubType = (lesson.content?.hub || lesson.target_system || 'playground') as HubType;

  if (isStory && slides && slides.length > 0) {
    const meta = lesson.ai_metadata || {};
    const rawStyle = meta.visual_style;
    const allowed = ['classic', 'comic_western', 'manga_rtl', 'webtoon', 'picture_book', 'comic_spread'];
    let visualStyle: StoryVisualStyle = (allowed.includes(rawStyle) ? rawStyle : 'classic') as StoryVisualStyle;
    // Auto-pick premium reader by hub when style is the default
    if (visualStyle === 'classic') {
      if (hub === 'playground' || hub === 'kids') visualStyle = 'picture_book';
      else if (hub === 'academy' || hub === 'teen' || hub === 'teens') visualStyle = 'comic_spread';
    }
    const storyLayout: StoryLayout = meta.story_layout === 'classic' ? 'classic' : 'immersive';
    const pages = normalizeSlidesToStoryPages(slides);
    const cover = meta.coverImageUrl || pages.find((p) => p.imageUrl)?.imageUrl;
    return (
      <StoryBookViewer
        title={lesson.title}
        pages={pages}
        layout={storyLayout}
        visualStyle={visualStyle}
        coverImageUrl={cover}
        onExit={() => navigate(-1)}
      />
    );
  }

  if (slides && slides.length > 0) {
    return (
      <LessonPlayerContainer
        slides={slides}
        hub={hub}
        lessonTitle={lesson.title}
        lessonId={lesson.id}
        studentId={user?.id}
        onComplete={(score) => {
        }}
        onExit={() => navigate(-1)}
      />
    );
  }

  // ── Fallback: markdown-based immersive reader ──
  const markdownContent = typeof lesson.content === 'string'
    ? lesson.content
    : lesson.content?.markdown || lesson.content?.text || JSON.stringify(lesson.content, null, 2);

  const track = lesson.target_system === 'kids' ? 'kids'
    : lesson.target_system === 'teen' ? 'teens'
    : 'adults';

  const coverImageUrl = lesson.ai_metadata?.coverImageUrl || null;

  return (
    <ImmersiveLessonReader
      lessonId={lesson.id}
      title={lesson.title}
      content={markdownContent}
      track={track}
      level={lesson.difficulty_level}
      coverImageUrl={coverImageUrl}
      durationMinutes={lesson.duration_minutes}
      onBack={() => navigate(-1)}
    />
  );
};

// ────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────

/**
 * Normalize the StoryCreator slide shape into StoryPage[].
 * - text_image / presentation slides become narrative pages.
 * - multiple_choice (review) slides attach as `mcq` to the previous narrative page,
 *   or stand alone as a comprehension-only page if none precedes them.
 */
function normalizeSlidesToStoryPages(slides: any[]): StoryPage[] {
  const pages: StoryPage[] = [];
  for (const s of slides) {
    const slideType = s?.slide_type || s?.type;
    const isMcq =
      slideType === 'multiple_choice' ||
      (s?.interactive_data && Array.isArray(s.interactive_data.options));

    if (isMcq) {
      const data = s.interactive_data || {};
      const mcq = {
        question: data.question || s.content || s.title || 'Question',
        options: Array.isArray(data.options) ? data.options : [],
        correct_index: typeof data.correct_index === 'number' ? data.correct_index : 0,
      };
      const last = pages[pages.length - 1];
      if (last && !last.mcq) {
        last.mcq = mcq;
      } else {
        pages.push({ title: s.title, text: '', mcq });
      }
      continue;
    }

    const text = s?.content || s?.teacher_script || '';
    const imageUrl =
      s?.image_url ||
      s?.imageUrl ||
      s?.media?.image_url ||
      s?.interactive_data?.image_url ||
      undefined;
    const panels = Array.isArray(s?.interactive_data?.panels)
      ? s.interactive_data.panels
      : undefined;
    pages.push({
      title: s?.title,
      text: typeof text === 'string' ? text : String(text ?? ''),
      imageUrl,
      panels,
    });
  }
  return pages;
}

export default LessonReaderPage;

