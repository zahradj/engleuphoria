import React from 'react';
import { StageMode, SmartWorksheet } from '@/services/whiteboardService';
import { ScrollSyncedIframe } from './ScrollSyncedIframe';
import { NativeGameStage } from '@/components/classroom/native-games/NativeGameStage';
import { NativeCoPlayArena } from '@/components/classroom/native-games/NativeCoPlayArena';
import DynamicSlideRenderer from '@/components/lesson-player/DynamicSlideRenderer';
import { CanvasEditor } from '@/components/admin/lesson-builder/canvas/CanvasEditor';
import { CreatorSlideRenderer } from './CreatorSlideRenderer';
import type { GeneratedSlide, HubType } from '@/components/admin/lesson-builder/ai-wizard/types';

// Slide `type` values produced natively by the 3 Creator Studios
// (PlaygroundDemo / AcademyDemo / SuccessDemo). When we detect any of these,
// we render with the matching CreatorSlideRenderer (1:1 with the studio
// preview) instead of going through the normalized DynamicSlideRenderer.
const CREATOR_NATIVE_TYPES = new Set([
  'intro', 'question', 'opinion', 'poll',
  'vocab', 'vocab_solo', 'matching',
  'reading_passage', 'listening',
  'multiple', 'truefalse', 'fill_blank', 'fill', 'sentence_builder',
  'grammar_pattern', 'error_detection', 'correction',
  'debate_scale', 'role_play', 'speaking_task', 'reflection',
  'cluster', 'canvas_game', 'living_canvas', 'scaffolded_media',
  'lesson_summary', 'phonics_focus', 'storybook', 'media_player',
  'drag', 'match', 'draw',
  'tone_compare', 'functional_pattern', 'rewrite', 'scenario', 'email_task',
]);
const isCreatorNativeSlide = (s: any) =>
  !!s && typeof s.type === 'string' && CREATOR_NATIVE_TYPES.has(s.type);

// Legacy: third-party cloud-browser URLs.
const isLegacyCoBrowseUrl = (url: string | null | undefined) =>
  !!url && /\.hyperbeam\.com\//i.test(url);

const HUB_ACCENT: Record<HubType, string> = {
  playground: 'hsl(20 99% 59%)',
  academy: 'hsl(217 91% 60%)',
  professional: 'hsl(160 84% 30%)',
} as any;

interface Slide {
  id: string;
  title?: string;
  imageUrl?: string;
  content?: any;
}

const resolveSlideImage = (slide: any): string | undefined =>
  slide?.imageUrl || slide?.image_url || slide?.custom_image_url || slide?.generated_image_url || slide?.media_url || slide?.content?.imageUrl || slide?.coverImageUrl;

/**
 * Unified slide adapter — normalizes BOTH creator-studio PPPSlide schemas
 * (slide_type / interactive_data / custom_image_url) AND legacy GeneratedSlide
 * shapes into one renderable payload that DynamicSlideRenderer understands.
 *
 * We KEEP every original field so downstream components (interactive_data
 * consumers, FrontPageSlide, etc.) keep working — we just add the canonical
 * keys the renderer expects.
 */
const normalizeLiveSlide = (slide: any, index: number): GeneratedSlide | null => {
  if (!slide) return null;
  const rawType = slide.slide_type || slide.slideType || slide.activityType || slide.type;

  // Map legacy/AI types to first-class activity types.
  const activityAlias: Record<string, string> = {
    match_halves: 'drag_and_match',
    match_words: 'drag_and_match',
    quiz_mcq: 'multiple_choice',
  };
  const activityType =
    activityAlias[rawType as string]
    || (rawType === 'drag_and_match' || rawType === 'fill_in_the_gaps'
        || rawType === 'multiple_choice' || rawType === 'drag_and_drop'
        || rawType === 'flashcard'
      ? rawType
      : slide.activityType);

  // Map slide_type aliases so the renderer's switch resolves cleanly.
  const slideTypeAlias: Record<string, string> = {
    flashcard: 'activity',
    multiple_choice: 'activity',
    drag_and_match: 'activity',
    drag_and_drop: 'activity',
    fill_in_the_gaps: 'activity',
    drawing_prompt: 'activity',
    drawing_canvas: 'core_concept',
    mascot_speech: 'core_concept',
    text_image: 'hook',
    vocab_list: 'vocabulary',
  };

  const resolvedSlideType =
    slide.slideType
    || slideTypeAlias[rawType as string]
    || (activityType ? 'activity' : (rawType || 'hook'));

  // Normalize MCQ: ensure content.options is an array of {text, isCorrect} so
  // AcademyQuiz / EditorialQuizMCQ render instead of "Interactive data missing".
  let normalizedContent: any = typeof slide.content === 'string' ? { prompt: slide.content } : { ...(slide.content || {}) };
  const interactive = slide.interactive_data || {};
  if (rawType === 'multiple_choice' || activityType === 'multiple_choice') {
    const options = interactive.options || normalizedContent.options || normalizedContent.quizOptions;
    const correctIdx = typeof interactive.correct_index === 'number'
      ? interactive.correct_index
      : typeof normalizedContent.correct_index === 'number' ? normalizedContent.correct_index : 0;
    if (Array.isArray(options)) {
      const opts = options.map((opt: any, i: number) => {
        if (typeof opt === 'string') return { text: opt, isCorrect: i === correctIdx };
        return { text: opt.text ?? String(opt), isCorrect: !!opt.isCorrect || i === correctIdx };
      });
      normalizedContent = {
        ...normalizedContent,
        quizQuestion: interactive.question || normalizedContent.quizQuestion || normalizedContent.question || slide.title,
        quizOptions: opts,
        options: opts,
        correctAnswer: opts.find((o: any) => o.isCorrect)?.text,
      };
    }
  }

  return {
    ...slide,
    id: String(slide.id ?? index + 1),
    order: slide.order ?? index + 1,
    title: String(slide.title || slide.content?.title || `Slide ${index + 1}`),
    imageUrl: resolveSlideImage(slide),
    slideType: resolvedSlideType,
    type: slide.type || activityType || rawType || 'title',
    activityType,
    slide_type: rawType,
    interactive_data: slide.interactive_data,
    content: normalizedContent,
    teacherNotes: slide.teacherNotes || slide.teacher_script || slide.teacher_instructions || '',
    keywords: Array.isArray(slide.keywords) ? slide.keywords : [],
  } as GeneratedSlide;
};

interface StageContentProps {
  mode: StageMode;
  slides: Slide[];
  currentSlideIndex: number;
  embeddedUrl: string | null;
  roomId: string;
  userId: string;
  role: 'teacher' | 'student';
  iframeUnlocked?: boolean;
  worksheet?: SmartWorksheet | null;
  rawSlides?: any[];
  hubType?: HubType;
}

/**
 * Renders whatever the teacher has put on the Main Stage:
 * - 'slide' → current lesson slide (premium renderer when raw data available)
 * - 'web'   → co-browsing iframe
 * - 'blank' → empty whiteboard surface
 * - 'native_game_*' → fully-synced AI-generated mini-game
 */
export const StageContent: React.FC<StageContentProps> = ({
  mode,
  slides,
  currentSlideIndex,
  embeddedUrl,
  roomId,
  userId,
  role,
  iframeUnlocked = false,
  worksheet = null,
  rawSlides,
  hubType = 'academy',
}) => {
  if (mode.startsWith('native_game_')) {
    return (
      <NativeGameStage
        mode={mode}
        worksheet={worksheet}
        roomId={roomId}
        userId={userId}
        role={role}
      />
    );
  }

  if (mode === 'web') {
    // Default Co-Play path: native Supabase-Realtime arena.
    // Legacy Hyperbeam embed URLs are intercepted here too — we ignore the
    // dead URL and render the native arena instead.
    if (!embeddedUrl || isLegacyCoBrowseUrl(embeddedUrl)) {
      return (
        <NativeCoPlayArena
          classroomId={roomId}
          userId={userId}
          role={role}
          game="memory_match"
          pairs={worksheet?.memory_match ?? []}
          accent={HUB_ACCENT[hubType] ?? HUB_ACCENT.academy}
        />
      );
    }
    // Plain external URL → use the scroll-synced iframe (read-only embed).
    return (
      <ScrollSyncedIframe
        url={embeddedUrl}
        roomId={roomId}
        userId={userId}
        role={role}
        interactive={iframeUnlocked}
      />
    );
  }

  if (mode === 'blank') {
    return <div className="absolute inset-0 bg-white" />;
  }

  const rawSrc = rawSlides?.[currentSlideIndex] ?? slides[currentSlideIndex];
  const currentSlide = normalizeLiveSlide(rawSrc, currentSlideIndex);
  if (!currentSlide) return <div className="absolute inset-0 bg-white" />;

  // Canvas-builder slides: render the saved layout in read-only mode.
  const canvasElements = (rawSrc as any)?.canvasElements;
  if (Array.isArray(canvasElements) && canvasElements.length > 0) {
    return (
      <div className="absolute inset-0 bg-white w-full h-full">
        <CanvasEditor
          slide={{
            ...(rawSrc as any),
            id: String((rawSrc as any).id ?? currentSlideIndex + 1),
            order: (rawSrc as any).order ?? currentSlideIndex,
            type: (rawSrc as any).type || 'image',
            teacherNotes: (rawSrc as any).teacherNotes || '',
            keywords: (rawSrc as any).keywords || [],
          }}
          onUpdateSlide={() => {}}
          readOnly
        />
      </div>
    );
  }

  // Creator-native slides (Playground / Academy / Success Demo schemas):
  // render with the same SlideRenderer the studio uses so layout and
  // interactive activities are identical to the creator preview.
  if (isCreatorNativeSlide(rawSrc)) {
    return (
      <div className="absolute inset-0 bg-white w-full h-full overflow-y-auto">
        <CreatorSlideRenderer slide={rawSrc} hub={hubType} theme="light" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-white w-full h-full overflow-y-auto">
      <div className="min-h-full w-full flex items-stretch justify-stretch">
        <DynamicSlideRenderer
          slide={currentSlide}
          hub={hubType}
          onCorrectAnswer={() => {}}
          onIncorrectAnswer={() => {}}
          onComplete={() => {}}
        />
      </div>
    </div>
  );
};
