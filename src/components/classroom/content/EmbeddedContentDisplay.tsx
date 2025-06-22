
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, X, Maximize2, Minimize2, Move } from "lucide-react";

interface EmbeddedContent {
  id: string;
  type: 'youtube' | 'docs' | 'game' | 'website';
  title: string;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface EmbeddedContentDisplayProps {
  content: EmbeddedContent;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<EmbeddedContent>) => void;
  isTeacher: boolean;
}

export function EmbeddedContentDisplay({ 
  content, 
  onRemove, 
  onUpdate, 
  isTeacher 
}: EmbeddedContentDisplayProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isTeacher) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - content.x,
      y: e.clientY - content.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !isTeacher) return;
    
    onUpdate(content.id, {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const openInNewTab = () => {
    window.open(content.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className={`absolute border-2 border-blue-500 rounded bg-white shadow-lg overflow-hidden ${
        isTeacher ? 'cursor-move' : ''
      } ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}
      style={isFullscreen ? {} : {
        left: `${content.x}px`,
        top: `${content.y}px`,
        width: `${content.width}px`,
        height: `${content.height}px`,
        minWidth: '400px',
        minHeight: '300px',
        zIndex: 10
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className="h-10 bg-blue-500 text-white px-3 py-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Move size={14} className="text-blue-200" />
          <span className="font-medium text-sm truncate">{content.title}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              openInNewTab();
            }}
            className="h-6 w-6 p-0 text-white hover:bg-blue-600"
          >
            <ExternalLink size={12} />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            className="h-6 w-6 p-0 text-white hover:bg-blue-600"
          >
            {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </Button>
          
          {isTeacher && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(content.id);
              }}
              className="h-6 w-6 p-0 text-white hover:bg-red-600"
            >
              <X size={12} />
            </Button>
          )}
        </div>
      </div>
      
      {/* Content */}
      <iframe
        src={content.url}
        className="w-full h-[calc(100%-2.5rem)] border-0"
        title={content.title}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-top-navigation-by-user-activation"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        loading="lazy"
      />
    </div>
  );
}
