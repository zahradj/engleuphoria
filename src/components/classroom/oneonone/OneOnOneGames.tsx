
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
  Plus
} from "lucide-react";
import { FlashcardsGame } from "./games/FlashcardsGame";
import { SentenceBuilderGame } from "./games/SentenceBuilderGame";
import { WordMatchGame } from "./games/WordMatchGame";
import { QuizSpinnerGame } from "./games/QuizSpinnerGame";
import { CreateActivityGame } from "./games/CreateActivityGame";
import { GameTimer } from "./games/GameTimer";

export function OneOnOneGames() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const games = [
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
      title: "Word Matching",
      description: "Match words with their meanings",
      icon: CheckCircle,
      color: "bg-purple-100 text-purple-700"
    },
    {
      id: "quiz-spinner",
      title: "Quiz Spinner",
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
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Gamepad2 size={18} className="text-purple-600" />
        Interactive Activities
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {games.map((game) => (
          <Card 
            key={game.id}
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveGame(game.id)}
          >
            <div className={`w-12 h-12 rounded-lg ${game.color} flex items-center justify-center mb-3`}>
              <game.icon size={24} />
            </div>
            <h4 className="font-medium text-sm mb-1">{game.title}</h4>
            <p className="text-xs text-gray-600">{game.description}</p>
          </Card>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Star size={16} className="text-purple-600" />
          <span className="font-medium text-purple-800">Pro Tip</span>
        </div>
        <p className="text-sm text-purple-700">
          Complete activities to earn XP points and unlock new levels!
        </p>
      </div>
    </div>
  );
}
