import React, { useState, useRef, useCallback } from 'react';
import { Trash2, Move, Maximize2 } from 'lucide-react';
import type { CanvasElementData } from '../types';

interface CanvasElementProps {
  element: CanvasElementData;
  isSelected: boolean;
  scale: number;
  onSelect: () => void;
  onUpdate: (updates: Partial<CanvasElementData>) => void;
  onDelete: () => void;
}

export const CanvasElement: React.FC<CanvasElementProps> = ({
  element, isSelected, scale, onSelect, onUpdate, onDelete
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, elX: 0, elY: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, elX: element.x, elY: element.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [element.x, element.y, onSelect]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (isDragging) {
      const dx = (e.clientX - dragStart.current.x) / scale;
      const dy = (e.clientY - dragStart.current.y) / scale;
      onUpdate({ x: Math.round(dragStart.current.elX + dx), y: Math.round(dragStart.current.elY + dy) });
    }
    if (isResizing) {
      const dx = (e.clientX - resizeStart.current.x) / scale;
      const dy = (e.clientY - resizeStart.current.y) / scale;
      onUpdate({
        width: Math.max(60, Math.round(resizeStart.current.w + dx)),
        height: Math.max(40, Math.round(resizeStart.current.h + dy)),
      });
    }
  }, [isDragging, isResizing, scale, onUpdate]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  const handleResizeStart = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    resizeStart.current = { x: e.clientX, y: e.clientY, w: element.width, h: element.height };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [element.width, element.height]);

  const renderContent = () => {
    switch (element.elementType) {
      case 'text':
        return (
          <div
            className="w-full h-full flex items-center justify-center p-2 overflow-hidden"
            style={{
              fontSize: element.content?.fontSize || 24,
              fontWeight: element.content?.bold ? 'bold' : 'normal',
              fontStyle: element.content?.italic ? 'italic' : 'normal',
              color: element.content?.color || 'hsl(var(--foreground))',
              textAlign: element.content?.align || 'center',
            }}
          >
            {element.content?.text || 'Double-click to edit'}
          </div>
        );
      case 'image':
        return element.content?.src ? (
          <img src={element.content.src} alt="" className="w-full h-full object-cover rounded" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted rounded text-muted-foreground text-sm">
            Drop image
          </div>
        );
      case 'shape':
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: element.content?.fill || 'hsl(var(--primary))',
              borderRadius: element.content?.shape === 'circle' ? '50%' : element.content?.shape === 'rounded' ? 12 : 0,
              opacity: element.content?.opacity ?? 1,
            }}
          />
        );
      case 'quiz':
        return (
          <div className="w-full h-full p-3 bg-primary/10 rounded border border-primary/30 flex flex-col justify-center">
            <p className="text-xs font-bold text-primary mb-1">QUIZ</p>
            <p className="text-sm">{element.content?.question || 'Quiz question...'}</p>
          </div>
        );
      case 'matching':
        return (
          <div className="w-full h-full p-3 bg-accent/30 rounded border border-accent flex flex-col justify-center">
            <p className="text-xs font-bold text-accent-foreground mb-1">MATCHING</p>
            <p className="text-sm">{element.content?.title || 'Matching pairs activity'}</p>
          </div>
        );
      case 'fill-blank':
        return (
          <div className="w-full h-full p-3 bg-secondary/30 rounded border border-secondary flex flex-col justify-center">
            <p className="text-xs font-bold text-secondary-foreground mb-1">FILL IN THE BLANK</p>
            <p className="text-sm">{element.content?.sentence || 'The cat ___ on the mat.'}</p>
          </div>
        );
      case 'audio':
        return (
          <div className="w-full h-full p-3 bg-muted rounded border border-border flex items-center justify-center">
            <p className="text-sm text-muted-foreground">🔊 Audio Player</p>
          </div>
        );
      default:
        return <div className="w-full h-full bg-muted rounded" />;
    }
  };

  return (
    <div
      className={`absolute select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        zIndex: element.zIndex,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {renderContent()}

      {isSelected && (
        <>
          {/* Selection border */}
          <div className="absolute inset-0 border-2 border-primary rounded pointer-events-none" />

          {/* Delete button */}
          <button
            className="absolute -top-3 -right-3 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-50"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Trash2 className="h-3 w-3" />
          </button>

          {/* Resize handle */}
          <div
            className="absolute -bottom-2 -right-2 w-5 h-5 bg-primary rounded-sm cursor-se-resize flex items-center justify-center shadow-md z-50"
            onPointerDown={handleResizeStart}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <Maximize2 className="h-3 w-3 text-primary-foreground" />
          </div>

          {/* Corner handles */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-primary rounded-full pointer-events-none" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full pointer-events-none" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary rounded-full pointer-events-none" />
        </>
      )}
    </div>
  );
};
