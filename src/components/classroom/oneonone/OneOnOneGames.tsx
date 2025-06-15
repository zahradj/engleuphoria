
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  RotateCcw, 
  Shuffle, 
  Play,
  CheckCircle,
  Star,
  Gamepad2,
  Plus,
  Grid3x3,
  CirclePlay,
  Dice1
} from "lucide-react";
import { FlashcardsGame } from "./games/FlashcardsGame";
import { SentenceBuilderGame } from "./games/SentenceBuilderGame";
import { WordMatchGame } from "./games/WordMatchGame";
import { QuizSpinnerGame } from "./games/QuizSpinnerGame";
import { CreateActivityGame } from "./games/CreateActivityGame";
import { EnhancedDragDropGame } from "./games/EnhancedDragDropGame";
import { SpinningWheelGame } from "./games/SpinningWheelGame";
import { DiceRollingGame } from "./games/DiceRollingGame";
import { GameTimer } from "./games/GameTimer";

export function OneOnOneGames() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const games = [
    {
      id: "enhanced-drag-drop",
      title: "Grab & Drag Match",
      description: "AI-powered drag and drop matching games",
      icon: Grid3x3,
      color: "bg-emerald-100 text-emerald-700",
      isNew: true
    },
    {
      id: "spinning-wheel",
      title: "AI Spinning Wheel",
      description: "Interactive wheel with AI-generated content",
      icon: CirclePlay,
      color: "bg-purple-100 text-purple-700",
      isNew: true
    },
    {
      id: "dice-rolling",
      title: "Roll the Dice",
      description: "Story dice and vocabulary challenges",
      icon: Dice1,
      color: "bg-blue-100 text-blue-700",
      isNew: true
    },
    {
      id: "flashcards",
      title: "Vocabulary Flashcards",
      description: "Practice new words with interactive cards",
      icon: RotateCcw,
      color: "bg-blue-100 text-blue-700"
    },
    {
      id: "sentence-builder",
      title: "Sentence Builder",
      description: "Drag words to create proper sentences",
      icon: Shuffle,
      color: "bg-green-100 text-green-700"
    },
    {
      id: "word-match",
      title: "Word Matching (Classic)",
      description: "Match words with their meanings",
      icon: CheckCircle,
      color: "bg-purple-100 text-purple-700"
    },
    {
      id: "quiz-spinner",
      title: "Quiz Spinner (Classic)",
      description: "Spin the wheel for random questions",
      icon: Play,
      color: "bg-orange-100 text-orange-700"
    },
    {
      id: "create-activity",
      title: "Create Activity",
      description: "Design your own custom activities",
      icon: Plus,
      color: "bg-pink-100 text-pink-700"
    }
  ];

  if (activeGame) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => setActiveGame(null)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Games
          </button>
          {activeGame !== "create-activity" && (
            <div className="flex items-center gap-3">
              <GameTimer />
              <Badge variant="secondary">Score: {score}</Badge>
            </div>
          )}
        </div>
        
        <Card className="flex-1 p-4">
          {activeGame === "enhanced-drag-drop" && <EnhancedDragDropGame />}
          {activeGame === "spinning-wheel" && <SpinningWheelGame />}
          {activeGame === "dice-rolling" && <DiceRollingGame />}
          {activeGame === "flashcards" && <FlashcardsGame />}
          {activeGame === "sentence-builder" && <SentenceBuilderGame />}
          {activeGame === "word-match" && <WordMatchGame />}
          {activeGame === "quiz-spinner" && <QuizSpinnerGame />}
          {activeGame === "create-activity" && <CreateActivityGame />}
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Gamepad2 size={18} className="text-purple-600" />
          AI Gaming Activities
        </h3>
        <Badge variant="outline" className="text-xs">
          {games.filter(g => g.isNew).length} New!
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {games.map((game) => (
          <Card 
            key={game.id}
            className="p-4 cursor-pointer hover:shadow-md transition-all relative group"
            onClick={() => setActiveGame(game.id)}
          >
            {game.isNew && (
              <Badge 
                variant="secondary" 
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1"
              >
                NEW
              </Badge>
            )}
            
            <div className={`w-12 h-12 rounded-lg ${game.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <game.icon size={24} />
            </div>
            <h4 className="font-medium text-sm mb-1">{game.title}</h4>
            <p className="text-xs text-gray-600 leading-relaxed">{game.description}</p>
            
            {game.isNew && (
              <div className="mt-2 flex items-center gap-1">
                <Star size={12} className="text-yellow-500" />
                <span className="text-xs text-yellow-600 font-medium">AI Powered</span>
              </div>
            )}
          </Card>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 via-blue-50 to-emerald-50 rounded-lg border">
        <div className="flex items-center gap-2 mb-2">
          <Star size={16} className="text-purple-600" />
          <span className="font-medium text-purple-800">New AI Features!</span>
        </div>
        <p className="text-sm text-purple-700 leading-relaxed">
          Try our new AI-powered games: <strong>Grab & Drag Match</strong> with smart content, 
          <strong> AI Spinning Wheel</strong> with adaptive questions, and <strong>Roll the Dice</strong> for creative challenges!
        </p>
      </div>
      
      <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Star size={14} className="text-orange-600" />
          <span className="font-medium text-orange-800 text-sm">Pro Tip</span>
        </div>
        <p className="text-sm text-orange-700">
          Complete activities to earn XP points and unlock new levels! AI games adapt to your progress.
        </p>
      </div>
    </div>
  );
}
