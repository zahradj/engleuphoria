
import React from "react";
import { EmbeddedGameHeader } from "./EmbeddedGameHeader";
import { EmbeddedGameError } from "./EmbeddedGameError";
import { useEmbeddedGameState } from "./useEmbeddedGameState";
import { useGamePosition } from "./useGamePosition";

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
  const {
    loadError,
    loadTimeout,
    retryCount,
    handleIframeError,
    handleIframeLoad,
    handleRetry
  } = useEmbeddedGameState(game.url);

  const {
    position,
    size,
    handleMouseDown
  } = useGamePosition(
    { x: game.x, y: game.y },
    { width: game.width, height: game.height }
  );

  const showError = game.isBlocked || loadError || loadTimeout;

  const openInNewTab = () => {
    const finalUrl = game.url.startsWith('http') ? game.url : `https://${game.url}`;
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  };

  const handleGameError = () => {
    handleIframeError();
    onError(game.id);
  };

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
      <EmbeddedGameHeader
        title={game.title}
        showError={showError}
        onRetry={handleRetry}
        onOpenInNewTab={openInNewTab}
        onRemove={() => onRemove(game.id)}
      />
      
      {showError ? (
        <EmbeddedGameError
          isBlocked={!!game.isBlocked}
          loadTimeout={loadTimeout}
          onRetry={handleRetry}
          onOpenInNewTab={openInNewTab}
        />
      ) : (
        <iframe
          key={`${game.id}-${retryCount}`}
          src={game.url}
          className="w-full h-[calc(100%-2.5rem)] border-0 pointer-events-auto"
          title={game.title}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-top-navigation-by-user-activation"
          onError={handleGameError}
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
