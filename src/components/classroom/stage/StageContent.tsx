import React from 'react';
import { StageMode, SmartWorksheet } from '@/services/whiteboardService';
import { ScrollSyncedIframe } from './ScrollSyncedIframe';
import { MultiplayerWebStage } from './MultiplayerWebStage';
import { NativeGameStage } from '@/components/classroom/native-games/NativeGameStage';
import DynamicSlideRenderer from '@/components/lesson-player/DynamicSlideRenderer';
import type { GeneratedSlide, HubType } from '@/components/admin/lesson-builder/ai-wizard/types';

const isHyperbeamUrl = (url: string | null | undefined) =>
  !!url && /\.hyperbeam\.com\//i.test(url);

interface Slide {
  id: string;
  title?: string;
  imageUrl?: string;
  content?: any;
}

const resolveSlideImage = (slide: any): string | undefined =>
  slide?.imageUrl || slide?.image_url || slide?.generated_image_url || slide?.custom_image_url || slide?.media_url || slide?.content?.imageUrl;

const normalizeLiveSlide = (slide: any, index: number): GeneratedSlide | null => {
  if (!slide) return null;
  const rawType = slide.slide_type || slide.slideType || slide.activityType || slide.type;
  const activityType =
    rawType === 'match_halves' ? 'drag_and_match'
    : rawType === 'drag_and_match' || rawType === 'fill_in_the_gaps' || rawType === 'multiple_choice' ? rawType
    : slide.activityType;

  return {
    ...slide,
    id: String(slide.id ?? index + 1),
    order: slide.order ?? index + 1,
    title: String(slide.title || slide.content?.title || `Slide ${index + 1}`),
    imageUrl: resolveSlideImage(slide),
    slideType: slide.slideType || (activityType ? 'activity' : rawType === 'vocab_list' ? 'vocabulary' : 'hook'),
    type: slide.type || activityType || rawType || 'title',
    activityType,
    content: typeof slide.content === 'string' ? { prompt: slide.content } : slide.content,
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
  /** Raw GeneratedSlide data for premium rendering (parallel to slides array). */
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
    if (isHyperbeamUrl(embeddedUrl)) {
      return (
        <MultiplayerWebStage
          embedUrl={embeddedUrl}
          role={role}
          controlEnabled={iframeUnlocked}
        />
      );
    }
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

  const currentSlide = normalizeLiveSlide(rawSlides?.[currentSlideIndex] ?? slides[currentSlideIndex], currentSlideIndex);
  if (!currentSlide) return <div className="absolute inset-0 bg-white" />;

  return (
    <div className="absolute inset-0 bg-white w-full h-full overflow-y-auto p-2">
      <div className="min-h-full w-full flex items-center justify-center">
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
