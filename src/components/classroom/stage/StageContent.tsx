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
  title: string;
  imageUrl?: string;
  content?: React.ReactNode;
}

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

  // 'slide' — try premium renderer first if raw slide data is available
  const rawSlide = rawSlides?.[currentSlideIndex] as GeneratedSlide | undefined;

  if (rawSlide && (rawSlide.slideType || rawSlide.activityType || rawSlide.type)) {
    return (
      <div className="absolute inset-0 bg-white flex items-center justify-center overflow-auto p-2">
        <div className="w-full h-full flex items-center justify-center">
          <DynamicSlideRenderer
            slide={rawSlide}
            hub={hubType}
            onCorrectAnswer={() => {}}
            onIncorrectAnswer={() => {}}
            onComplete={() => {}}
          />
        </div>
      </div>
    );
  }

  // Fallback: basic title/image rendering
  const slide = slides[currentSlideIndex];
  return (
    <div className="absolute inset-0 bg-white flex items-center justify-center overflow-hidden">
      {slide?.imageUrl ? (
        <img
          src={slide.imageUrl}
          alt={slide.title}
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="text-center p-8 max-w-3xl">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {slide?.title || `Slide ${currentSlideIndex + 1}`}
          </h2>
          {slide?.content && <div className="text-muted-foreground text-lg">{slide.content}</div>}
        </div>
      )}
    </div>
  );
};
