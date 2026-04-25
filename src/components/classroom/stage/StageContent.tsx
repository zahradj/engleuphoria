import React from 'react';
import { StageMode, SmartWorksheet } from '@/services/whiteboardService';
import { ScrollSyncedIframe } from './ScrollSyncedIframe';
import { MultiplayerWebStage } from './MultiplayerWebStage';
import { NativeGameStage } from '@/components/classroom/native-games/NativeGameStage';

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
  /** When true and mode === 'web', the student can interact with the iframe directly. */
  iframeUnlocked?: boolean;
  /** Active Smart Worksheet for native game modes. */
  worksheet?: SmartWorksheet | null;
}

/**
 * Renders whatever the teacher has put on the Main Stage:
 * - 'slide' → current lesson slide
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
    console.log('[StageContent] web mode', { role, embeddedUrl, isHyperbeam: isHyperbeamUrl(embeddedUrl) });
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

  // 'slide' — render current slide
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
