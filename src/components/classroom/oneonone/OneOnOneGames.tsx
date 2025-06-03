
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
  Gamepad2,
  Timer
} from "lucide-react";

export function OneOnOneGames() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [gameTimer, setGameTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

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

  const spinnerQuestions = [
    "What is your favorite color?",
    "Name three animals",
    "Count to 10 in English",
    "Describe your bedroom",
    "What did you eat for breakfast?",
    "Tell me about your family",
    "What's the weather like today?",
    "Name five body parts"
  ];

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setGameTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsTimerRunning(true);
    setGameTimer(0);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setGameTimer(0);
    setIsTimerRunning(false);
  };

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

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSpinResult(null);
    
    // Simulate spinning animation
    setTimeout(() => {
      const randomQuestion = spinnerQuestions[Math.floor(Math.random() * spinnerQuestions.length)];
      setSpinResult(randomQuestion);
      setIsSpinning(false);
    }, 3000);
  };

  const renderSpinningWheel = () => (
    <div className="text-center space-y-6">
      <div className="relative mx-auto">
        <div 
          className={`w-48 h-48 mx-auto rounded-full border-8 border-orange-300 relative overflow-hidden transition-transform duration-3000 ${
            isSpinning ? 'animate-spin' : ''
          }`}
          style={{
            background: `conic-gradient(
              #ff6b6b 0deg 45deg,
              #4ecdc4 45deg 90deg,
              #45b7d1 90deg 135deg,
              #96ceb4 135deg 180deg,
              #ffd93d 180deg 225deg,
              #ff9ff3 225deg 270deg,
              #a8e6cf 270deg 315deg,
              #ffb3ba 315deg 360deg
            )`
          }}
        >
          {/* Wheel sections with numbers */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num, index) => (
            <div
              key={num}
              className="absolute w-full h-full flex items-center justify-center text-white font-bold text-lg"
              style={{
                transform: `rotate(${index * 45}deg)`,
                clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%)'
              }}
            >
              <span 
                className="absolute"
                style={{ 
                  transform: `rotate(-${index * 45}deg) translateY(-60px)`,
                }}
              >
                {num}
              </span>
            </div>
          ))}
          
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-4 border-gray-400"></div>
        </div>
        
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-red-500"></div>
        </div>
      </div>

      {spinResult && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <h4 className="font-semibold text-yellow-800 mb-2">Your Question:</h4>
          <p className="text-yellow-700">{spinResult}</p>
        </Card>
      )}

      <Button 
        onClick={spinWheel} 
        disabled={isSpinning}
        size="lg"
        className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600"
      >
        <Play size={16} className="mr-2" />
        {isSpinning ? "Spinning..." : "Spin the Wheel!"}
      </Button>
    </div>
  );

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
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg">
              <Timer size={16} className="text-blue-600" />
              <span className="font-mono text-blue-700">{formatTime(gameTimer)}</span>
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={startTimer}>
                Start
              </Button>
              <Button variant="outline" size="sm" onClick={stopTimer}>
                Stop
              </Button>
              <Button variant="outline" size="sm" onClick={resetTimer}>
                Reset
              </Button>
            </div>
            <Badge variant="secondary">Score: {score}</Badge>
          </div>
        </div>
        
        <Card className="flex-1 p-4">
          {activeGame === "flashcards" && renderFlashcards()}
          {activeGame === "sentence-builder" && renderSentenceBuilder()}
          {activeGame === "word-match" && renderWordMatch()}
          {activeGame === "quiz-spinner" && renderSpinningWheel()}
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
