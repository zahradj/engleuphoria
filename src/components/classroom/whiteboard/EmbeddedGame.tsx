
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, ExternalLink, Maximize2, Minimize2 } from "lucide-react";
import { FlashcardsGame } from "@/components/classroom/oneonone/games/FlashcardsGame";
import { SentenceBuilderGame } from "@/components/classroom/oneonone/games/SentenceBuilderGame";
import { WordMatchGame } from "@/components/classroom/oneonone/games/WordMatchGame";
import { QuizSpinnerGame } from "@/components/classroom/oneonone/games/QuizSpinnerGame";
import { CreateActivityGame } from "@/components/classroom/oneonone/games/CreateActivityGame";
import { EnhancedDragDropGame } from "@/components/classroom/oneonone/games/EnhancedDragDropGame";
import { SpinningWheelGame } from "@/components/classroom/oneonone/games/SpinningWheelGame";
import { DiceRollingGame } from "@/components/classroom/oneonone/games/DiceRollingGame";

interface EmbeddedGameData {
  id: string;
  gameId: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface EmbeddedGameProps {
  game: EmbeddedGameData;
  onRemove: (id: string) => void;
}

export function EmbeddedGame({ game, onRemove }: EmbeddedGameProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderGameContent = () => {
    switch (game.gameId) {
      case "flashcards":
        return <FlashcardsGame />;
      case "sentence-builder":
        return <SentenceBuilderGame />;
      case "word-match":
        return <WordMatchGame />;
      case "quiz-spinner":
        return <QuizSpinnerGame />;
      case "create-activity":
        return <CreateActivityGame />;
      case "enhanced-drag-drop":
        return <EnhancedDragDropGame />;
      case "spinning-wheel":
        return <SpinningWheelGame />;
      case "dice-rolling":
        return <DiceRollingGame />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            Game not found: {game.gameId}
          </div>
        );
    }
  };

  const expandedStyle = isExpanded ? {
    position: 'fixed' as const,
    top: '10px',
    left: '10px',
    right: '10px',
    bottom: '10px',
    width: 'auto',
    height: 'auto',
    zIndex: 1000
  } : {
    left: `${game.x}px`,
    top: `${game.y}px`,
    width: `${game.width}px`,
    height: `${game.height}px`
  };

  return (
    <div
      className="absolute border-2 border-purple-500 rounded-lg bg-white shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-200"
      style={expandedStyle}
    >
      {/* Header */}
      <div className="h-8 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-2 h-2 bg-white rounded-full opacity-75"></div>
          <span className="font-medium text-sm truncate">{game.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0 text-white hover:bg-purple-600 opacity-75 hover:opacity-100"
          >
            {isExpanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onRemove(game.id)}
            className="h-6 w-6 p-0 text-white hover:bg-red-500 opacity-75 hover:opacity-100"
          >
            <X size={12} />
          </Button>
        </div>
      </div>
      
      {/* Game Content */}
      <div className="h-[calc(100%-2rem)] overflow-auto">
        {renderGameContent()}
      </div>
    </div>
  );
}
