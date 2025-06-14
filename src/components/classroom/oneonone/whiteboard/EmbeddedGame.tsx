
import React, { useState } from "react";
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

  const handleIframeError = () => {
    console.log("Iframe failed to load:", game.url);
    setLoadError(true);
    onError(game.id);
  };

  const handleIframeLoad = () => {
    console.log("Iframe loaded successfully:", game.url);
    // Remove the CSP-violating content access check
    // Just log successful load without accessing contentWindow
  };

  // Set a timeout to detect if iframe doesn't load within reasonable time
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!loadError) {
        console.log("Iframe load timeout for:", game.url);
        setLoadTimeout(true);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timer);
  }, [game.url, loadError]);

  const openInNewTab = () => {
    window.open(game.url, '_blank', 'noopener,noreferrer');
  };

  const showError = game.isBlocked || loadError || loadTimeout;

  return (
    <div
      className="absolute border-2 border-blue-500 rounded bg-white shadow-lg resize overflow-hidden"
      style={{
        left: `${game.x}px`,
        top: `${game.y}px`,
        width: `${game.width}px`,
        height: `${game.height}px`,
        minWidth: '200px',
        minHeight: '150px'
      }}
    >
      <div className="flex items-center justify-between p-2 bg-blue-500 text-white text-sm">
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
          className="w-full h-[calc(100%-2.5rem)] border-0"
          title={game.title}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          onError={handleIframeError}
          onLoad={handleIframeLoad}
          referrerPolicy="strict-origin-when-cross-origin"
        />
      )}
    </div>
  );
}
