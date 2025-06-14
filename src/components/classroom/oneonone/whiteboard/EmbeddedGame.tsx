
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle, ExternalLink, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmbeddedGameData {
  id: string;
  title: string;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isBlocked?: boolean;
}

interface EmbeddedGameProps {
  game: EmbeddedGameData;
  onRemove: (gameId: string) => void;
  onError: (gameId: string) => void;
}

export function EmbeddedGame({ game, onRemove, onError }: EmbeddedGameProps) {
  const [loadError, setLoadError] = useState(false);
  const [loadTimeout, setLoadTimeout] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: game.x, y: game.y });
  const [size, setSize] = useState({ width: game.width, height: game.height });
  const [retryCount, setRetryCount] = useState(0);

  // Ensure content fits within whiteboard bounds
  const adjustToWhiteboardBounds = () => {
    const whiteboardElement = document.querySelector('.whiteboard-container');
    if (!whiteboardElement) return;

    const whiteboardRect = whiteboardElement.getBoundingClientRect();
    const maxWidth = whiteboardRect.width - 40; // Leave some padding
    const maxHeight = whiteboardRect.height - 100; // Account for toolbar

    // Adjust size to fit within whiteboard
    const adjustedWidth = Math.min(size.width, maxWidth);
    const adjustedHeight = Math.min(size.height, maxHeight);

    // Adjust position to stay within bounds
    const adjustedX = Math.max(20, Math.min(position.x, maxWidth - adjustedWidth));
    const adjustedY = Math.max(20, Math.min(position.y, maxHeight - adjustedHeight));

    setSize({ width: adjustedWidth, height: adjustedHeight });
    setPosition({ x: adjustedX, y: adjustedY });
  };

  useEffect(() => {
    adjustToWhiteboardBounds();
    window.addEventListener('resize', adjustToWhiteboardBounds);
    return () => window.removeEventListener('resize', adjustToWhiteboardBounds);
  }, []);

  const handleIframeError = () => {
    console.log("Iframe failed to load:", game.url);
    setLoadError(true);
    onError(game.id);
  };

  const handleIframeLoad = () => {
    console.log("Iframe loaded successfully:", game.url);
    setLoadError(false);
    setLoadTimeout(false);
    setRetryCount(0);
  };

  const handleRetry = () => {
    setLoadError(false);
    setLoadTimeout(false);
    setRetryCount(prev => prev + 1);
  };

  // Set a timeout to detect if iframe doesn't load within reasonable time
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loadError) {
        console.log("Iframe load timeout for:", game.url);
        setLoadTimeout(true);
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [game.url, loadError, retryCount]);

  const openInNewTab = () => {
    const finalUrl = game.url.startsWith('http') ? game.url : `https://${game.url}`;
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Constrain to whiteboard bounds
      const whiteboardElement = document.querySelector('.whiteboard-container');
      if (whiteboardElement) {
        const whiteboardRect = whiteboardElement.getBoundingClientRect();
        const maxX = whiteboardRect.width - size.width - 20;
        const maxY = whiteboardRect.height - size.height - 80;
        
        setPosition({
          x: Math.max(20, Math.min(newX, maxX)),
          y: Math.max(20, Math.min(newY, maxY))
        });
      } else {
        setPosition({ x: newX, y: newY });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, size]);

  const showError = game.isBlocked || loadError || loadTimeout;

  return (
    <div
      className="absolute border-2 border-blue-500 rounded bg-white shadow-lg overflow-hidden cursor-move"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        minWidth: '300px',
        minHeight: '200px',
        maxWidth: '100%',
        maxHeight: '100%',
        zIndex: 10
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-center justify-between p-2 bg-blue-500 text-white text-sm cursor-grab">
        <span className="font-medium truncate">{game.title}</span>
        <div className="flex items-center gap-1">
          {showError && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white hover:bg-blue-600"
              onClick={handleRetry}
              title="Retry loading"
            >
              <RefreshCw size={12} />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:bg-blue-600"
            onClick={openInNewTab}
            title="Open in new tab"
          >
            <ExternalLink size={12} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:bg-blue-600"
            onClick={() => onRemove(game.id)}
          >
            <X size={12} />
          </Button>
        </div>
      </div>
      
      {showError ? (
        <div className="w-full h-[calc(100%-2.5rem)] flex flex-col items-center justify-center bg-gray-100 text-gray-600 p-4">
          <AlertTriangle size={32} className="mb-2 text-orange-500" />
          <p className="text-sm text-center mb-3">
            {game.isBlocked ? "Content blocked by security policy." : 
             loadTimeout ? "Content is taking too long to load." :
             "Failed to load content."}
          </p>
          <p className="text-xs text-center text-gray-500 mb-3">
            Some educational games may have embedding restrictions. Try opening in a new tab or refreshing.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={handleRetry}
              size="sm"
              variant="outline"
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <RefreshCw size={14} className="mr-1" />
              Retry
            </Button>
            <Button
              onClick={openInNewTab}
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <ExternalLink size={14} className="mr-1" />
              Open in New Tab
            </Button>
          </div>
        </div>
      ) : (
        <iframe
          key={`${game.id}-${retryCount}`}
          src={game.url}
          className="w-full h-[calc(100%-2.5rem)] border-0 pointer-events-auto"
          title={game.title}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-top-navigation-by-user-activation"
          onError={handleIframeError}
          onLoad={handleIframeLoad}
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          loading="lazy"
          style={{ 
            transform: 'scale(1)',
            transformOrigin: 'top left'
          }}
        />
      )}
    </div>
  );
}
