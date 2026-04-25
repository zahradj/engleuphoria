import React, { useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { StageMode, WhiteboardStroke, SmartWorksheet } from '@/services/whiteboardService';
import { StageContent } from './StageContent';
import { TransparentCanvas } from './TransparentCanvas';
import { useCollapseWatcher } from '@/hooks/useCollapseWatcher';
import { Layout, Globe, PenTool, Wifi, Gamepad2 } from 'lucide-react';

interface Slide {
  id: string;
  title: string;
  imageUrl?: string;
  content?: React.ReactNode;
}

interface MainStageProps {
  mode: StageMode;
  slides: Slide[];
  currentSlideIndex: number;
  embeddedUrl: string | null;
  drawingEnabled: boolean;
  activeTool: 'pen' | 'highlighter' | 'eraser' | 'pointer';
  activeColor: string;
  strokes: WhiteboardStroke[];
  roomId: string;
  userId: string;
  userName: string;
  role: 'teacher' | 'student';
  /** Web-mode "Independent Play" — when true the student can interact directly with the iframe. */
  iframeUnlocked?: boolean;
  /** Active Smart Worksheet for native game modes. */
  worksheet?: SmartWorksheet | null;
  onAddStroke: (stroke: Omit<WhiteboardStroke, 'id' | 'roomId' | 'timestamp'>) => void;
}

const MODE_META: Record<StageMode, { label: string; Icon: React.ComponentType<{ className?: string }> }> = {
  slide: { label: 'Slide', Icon: Layout },
  web: { label: 'Web Content', Icon: Globe },
  blank: { label: 'Whiteboard', Icon: PenTool },
  native_game_flashcards: { label: 'Flashcards', Icon: Gamepad2 },
  native_game_memory: { label: 'Memory Match', Icon: Gamepad2 },
  native_game_sentence: { label: 'Sentence Builder', Icon: Gamepad2 },
  native_game_blanks: { label: 'Fill in the Blanks', Icon: Gamepad2 },
};

/**
 * The unified Main Stage — a single 16:9 container that fills ~90% of the
 * viewport. Whatever the teacher selects (slide / web / blank) appears here
 * for both teacher and student, with a transparent annotation overlay on top.
 */
export const MainStage: React.FC<MainStageProps> = ({
  mode,
  slides,
  currentSlideIndex,
  embeddedUrl,
  drawingEnabled,
  activeTool,
  activeColor,
  strokes,
  roomId,
  userId,
  userName,
  role,
  iframeUnlocked = false,
  worksheet = null,
  onAddStroke,
}) => {
  const { label, Icon } = MODE_META[mode];
  const stageRef = useRef<HTMLDivElement>(null);
  useCollapseWatcher(stageRef, `main-stage[${role}/${mode}]`);

  return (
    <div className="absolute inset-0 h-full w-full flex items-stretch justify-stretch p-1 sm:p-2 min-h-0 min-w-0">
      <div
        ref={stageRef}
        className="relative flex-1 w-full h-full bg-white rounded-lg shadow-xl overflow-hidden border border-border"
      >
        {/* Underlying content (slide / web / blank / native game) */}
        <StageContent
          mode={mode}
          slides={slides}
          currentSlideIndex={currentSlideIndex}
          embeddedUrl={embeddedUrl}
          roomId={roomId}
          userId={userId}
          role={role}
          iframeUnlocked={iframeUnlocked}
          worksheet={worksheet}
        />

        {/* Universal annotation overlay — always mounted, on top */}
        <TransparentCanvas
          roomId={roomId}
          userId={userId}
          userName={userName}
          role={role}
          drawingEnabled={drawingEnabled}
          activeTool={activeTool}
          activeColor={activeColor}
          strokes={strokes}
          onAddStroke={onAddStroke}
          mode={mode}
          iframeUnlocked={iframeUnlocked}
        />

        {/* Mode badge (top-left) */}
        <div className="absolute top-3 left-3 z-[60] flex items-center gap-2 pointer-events-none">
          <Badge
            variant="secondary"
            className="flex items-center gap-1.5 bg-background/90 backdrop-blur-sm border border-border shadow-sm text-foreground"
          >
            <Icon className="h-3 w-3" />
            {label}
          </Badge>
          {role === 'student' && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1.5 bg-background/90 backdrop-blur-sm border border-border shadow-sm text-foreground"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Teacher is presenting
            </Badge>
          )}
        </div>

        {/* Slide counter (only in slide mode) */}
        {mode === 'slide' && slides.length > 0 && (
          <div className="absolute bottom-3 right-3 z-[60] bg-foreground/70 text-background px-3 py-1 rounded-full text-xs font-medium pointer-events-none">
            {currentSlideIndex + 1} / {slides.length}
          </div>
        )}

        {/* Drawing-OFF hint */}
        {!drawingEnabled && role === 'student' && (
          <div className="absolute bottom-3 left-3 z-[60] bg-background/80 text-muted-foreground text-[10px] px-2 py-1 rounded-md pointer-events-none flex items-center gap-1">
            <Wifi className="w-3 h-3" /> View only
          </div>
        )}
      </div>
    </div>
  );
};
