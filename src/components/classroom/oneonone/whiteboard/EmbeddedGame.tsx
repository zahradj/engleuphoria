
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle, ExternalLink } from "lucide-react";
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

  const handleIframeError = () => {
    console.log("Iframe failed to load:", game.url);
    setLoadError(true);
    onError(game.id);
  };

  const handleIframeLoad = () => {
    console.log("Iframe loaded successfully:", game.url);
    setLoadError(false);
    setLoadTimeout(false);
  };

  // Set a timeout to detect if iframe doesn't load within reasonable time
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loadError) {
        console.log("Iframe load timeout for:", game.url);
        setLoadTimeout(true);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timer);
  }, [game.url, loadError]);

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
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
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
  }, [isDragging]);

  const showError = game.isBlocked || loadError || loadTimeout;

  return (
    <div
      className="absolute border-2 border-blue-500 rounded bg-white shadow-lg resize overflow-hidden cursor-move"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${game.width}px`,
        height: `${game.height}px`,
        minWidth: '200px',
        minHeight: '150px',
        zIndex: 10
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-center justify-between p-2 bg-blue-500 text-white text-sm cursor-grab">
        <span className="font-medium truncate">{game.title}</span>
        <div className="flex items-center gap-1">
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
            This may happen due to browser security settings or the website's embedding restrictions.
          </p>
          <Button
            onClick={openInNewTab}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <ExternalLink size={14} className="mr-1" />
            Open in New Tab
          </Button>
        </div>
      ) : (
        <iframe
          src={game.url}
          className="w-full h-[calc(100%-2.5rem)] border-0 pointer-events-auto"
          title={game.title}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
          onError={handleIframeError}
          onLoad={handleIframeLoad}
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        />
      )}
    </div>
  );
}
