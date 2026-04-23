import React from 'react';
import { CollaborativeCanvas } from '@/components/classroom/shared/CollaborativeCanvas';
import { WhiteboardStroke } from '@/services/whiteboardService';

interface TransparentCanvasProps {
  roomId: string;
  userId: string;
  userName: string;
  role: 'teacher' | 'student';
  /** When true, the overlay captures pointer events for drawing. When false,
   *  clicks pass through to the underlying slide / iframe. */
  drawingEnabled: boolean;
  activeTool: 'pen' | 'highlighter' | 'eraser' | 'pointer';
  activeColor: string;
  strokes: WhiteboardStroke[];
  onAddStroke: (stroke: Omit<WhiteboardStroke, 'id' | 'roomId' | 'timestamp'>) => void;
}

/**
 * Universal annotation overlay. Mounted ONCE on top of the entire Main Stage,
 * regardless of mode (slide / web / blank). Both teacher and student see and
 * draw on the same surface — strokes broadcast through whiteboardService.
 */
export const TransparentCanvas: React.FC<TransparentCanvasProps> = ({
  roomId,
  userId,
  userName,
  role,
  drawingEnabled,
  activeTool,
  activeColor,
  strokes,
  onAddStroke,
}) => {
  // When drawing is OFF, the overlay must be fully click-through so the user
  // can interact with iframe links / slide elements underneath.
  const passThrough = !drawingEnabled || activeTool === 'pointer';

  return (
    <div
      className="absolute inset-0 z-50"
      style={{ pointerEvents: passThrough ? 'none' : 'auto' }}
    >
      <CollaborativeCanvas
        roomId={roomId}
        userId={userId}
        userName={userName}
        role={role}
        canDraw={drawingEnabled && activeTool !== 'pointer'}
        activeTool={activeTool === 'pointer' ? 'pen' : activeTool}
        activeColor={activeColor}
        strokes={strokes}
        onAddStroke={onAddStroke}
      />
    </div>
  );
};
