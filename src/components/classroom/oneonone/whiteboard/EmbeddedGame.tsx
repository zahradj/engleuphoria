
import React from "react";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle } from "lucide-react";

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
  const handleIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    const iframe = e.target as HTMLIFrameElement;
    try {
      // This will throw an error if blocked by CORS
      iframe.contentWindow?.document;
    } catch {
      onError(game.id);
    }
  };

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
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-white hover:bg-blue-600"
          onClick={() => onRemove(game.id)}
        >
          <X size={12} />
        </Button>
      </div>
      
      {game.isBlocked ? (
        <div className="w-full h-[calc(100%-2.5rem)] flex flex-col items-center justify-center bg-gray-100 text-gray-600">
          <AlertTriangle size={32} className="mb-2" />
          <p className="text-sm text-center px-4">
            Content blocked by security policy.<br/>
            Try using a different URL or platform.
          </p>
        </div>
      ) : (
        <iframe
          src={game.url}
          className="w-full h-[calc(100%-2.5rem)] border-0"
          title={game.title}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          onError={() => onError(game.id)}
          onLoad={handleIframeLoad}
        />
      )}
    </div>
  );
}
