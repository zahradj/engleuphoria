
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  RotateCcw, 
  Shuffle, 
  Play,
  CheckCircle,
  XCircle,
  Star,
  Gamepad2
} from "lucide-react";

export function OneOnOneGames() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
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
    }
  ];

  const flashcards = [
    { word: "Apple", translation: "A red or green fruit", image: "🍎" },
    { word: "Cat", translation: "A small furry pet animal", image: "🐱" },
    { word: "House", translation: "A place where people live", image: "🏠" },
    { word: "Book", translation: "Something you read", image: "📚" }
  ];

  const sentenceWords = ["The", "cat", "is", "sleeping", "on", "the", "sofa"];
  const [draggedWords, setDraggedWords] = useState<string[]>([]);

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const nextCard = () => {
    setFlashcardIndex((flashcardIndex + 1) % flashcards.length);
    setIsFlipped(false);
  };

  const addWordToSentence = (word: string) => {
    setDraggedWords([...draggedWords, word]);
  };

  const clearSentence = () => {
    setDraggedWords([]);
  };

  const renderFlashcards = () => (
    <div className="text-center">
      <div className="mb-4">
        <Badge variant="secondary">{flashcardIndex + 1} / {flashcards.length}</Badge>
      </div>
      
      <div 
        className="w-64 h-40 mx-auto mb-6 cursor-pointer perspective-1000"
        onClick={flipCard}
      >
        <div className={`relative w-full h-full transition-transform duration-600 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex flex-col items-center justify-center text-white backface-hidden">
            <div className="text-4xl mb-2">{flashcards[flashcardIndex].image}</div>
            <h3 className="text-xl font-bold">{flashcards[flashcardIndex].word}</h3>
          </div>
          
          {/* Back */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white backface-hidden rotate-y-180">
            <p className="text-center px-4">{flashcards[flashcardIndex].translation}</p>
          </div>
        </div>
      </div>
      
      <div className="flex gap-3 justify-center">
        <Button onClick={flipCard} variant="outline">
          <RotateCcw size={16} className="mr-1" />
          Flip
        </Button>
        <Button onClick={nextCard}>
          Next Card
        </Button>
      </div>
    </div>
  );

  const renderSentenceBuilder = () => (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg min-h-16 border-2 border-dashed border-gray-300">
        <h4 className="text-sm font-medium mb-2 text-gray-600">Build your sentence:</h4>
        <div className="flex flex-wrap gap-2">
          {draggedWords.map((word, index) => (
            <Badge key={index} variant="default" className="text-sm">
              {word}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {sentenceWords.map((word, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => addWordToSentence(word)}
            className="hover:bg-blue-50"
          >
            {word}
          </Button>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Button onClick={clearSentence} variant="outline" size="sm">
          Clear
        </Button>
        <Button size="sm">
          <CheckCircle size={16} className="mr-1" />
          Check Answer
        </Button>
      </div>
    </div>
  );

  const renderWordMatch = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <h4 className="font-medium text-center">Words</h4>
        {["Happy", "Sad", "Big", "Small"].map((word, index) => (
          <Button key={index} variant="outline" className="w-full">
            {word}
          </Button>
        ))}
      </div>
      <div className="space-y-2">
        <h4 className="font-medium text-center">Meanings</h4>
        {["Large", "Joyful", "Tiny", "Unhappy"].map((meaning, index) => (
          <Button key={index} variant="outline" className="w-full">
            {meaning}
          </Button>
        ))}
      </div>
    </div>
  );

  if (activeGame) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={() => setActiveGame(null)}>
            ← Back to Games
          </Button>
          <Badge variant="secondary">Score: {score}</Badge>
        </div>
        
        <Card className="flex-1 p-4">
          {activeGame === "flashcards" && renderFlashcards()}
          {activeGame === "sentence-builder" && renderSentenceBuilder()}
          {activeGame === "word-match" && renderWordMatch()}
          {activeGame === "quiz-spinner" && (
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white">
                <Gamepad2 size={48} />
              </div>
              <Button size="lg">
                <Play size={16} className="mr-2" />
                Spin the Wheel!
              </Button>
            </div>
          )}
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
