
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shuffle, RotateCcw, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MatchItem {
  id: string;
  content: string;
  matchId: string;
  type: 'word' | 'definition' | 'image';
}

interface GameMode {
  id: string;
  name: string;
  description: string;
  difficulty: number;
}

export function EnhancedDragDropGame() {
  const [gameMode, setGameMode] = useState<GameMode>({
    id: 'word-definition',
    name: 'Word-Definition Match',
    description: 'Match words with their meanings',
    difficulty: 1
  });
  
  const [leftItems, setLeftItems] = useState<MatchItem[]>([]);
  const [rightItems, setRightItems] = useState<MatchItem[]>([]);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();

  const gameModes: GameMode[] = [
    { id: 'word-definition', name: 'Word-Definition', description: 'Match words with meanings', difficulty: 1 },
    { id: 'category-sort', name: 'Category Sort', description: 'Sort items by category', difficulty: 2 },
    { id: 'image-word', name: 'Image-Word', description: 'Match images with words', difficulty: 1 },
    { id: 'grammar-function', name: 'Grammar Function', description: 'Match grammar terms with examples', difficulty: 3 }
  ];

  // AI-generated content based on game mode
  const generateGameContent = async (mode: GameMode) => {
    setIsLoading(true);
    
    // Simulated AI content generation - in real app, this would call an AI service
    const contentSets = {
      'word-definition': [
        { word: 'Happy', definition: 'Feeling joy or pleasure' },
        { word: 'Bright', definition: 'Giving out light; shining' },
        { word: 'Quick', definition: 'Moving fast or doing something rapidly' },
        { word: 'Calm', definition: 'Not showing excitement or worry' },
        { word: 'Strong', definition: 'Having great power or force' }
      ],
      'category-sort': [
        { word: 'Apple', definition: 'Fruit' },
        { word: 'Car', definition: 'Transportation' },
        { word: 'Dog', definition: 'Animal' },
        { word: 'Blue', definition: 'Color' },
        { word: 'Book', definition: 'Object' }
      ],
      'image-word': [
        { word: '🐶', definition: 'Dog' },
        { word: '🌞', definition: 'Sun' },
        { word: '🏠', definition: 'House' },
        { word: '📚', definition: 'Book' },
        { word: '🚗', definition: 'Car' }
      ],
      'grammar-function': [
        { word: 'runs quickly', definition: 'Adverb' },
        { word: 'beautiful flower', definition: 'Adjective' },
        { word: 'the cat sleeps', definition: 'Verb' },
        { word: 'big house', definition: 'Noun' },
        { word: 'under the table', definition: 'Preposition' }
      ]
    };

    setTimeout(() => {
      const content = contentSets[mode.id as keyof typeof contentSets] || contentSets['word-definition'];
      
      const leftData = content.map((item, index) => ({
        id: `left-${index}`,
        content: item.word,
        matchId: `match-${index}`,
        type: 'word' as const
      }));

      const rightData = content.map((item, index) => ({
        id: `right-${index}`,
        content: item.definition,
        matchId: `match-${index}`,
        type: 'definition' as const
      }));

      // Shuffle the right items
      const shuffledRight = [...rightData].sort(() => Math.random() - 0.5);

      setLeftItems(leftData);
      setRightItems(shuffledRight);
      setMatches({});
      setScore(0);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    generateGameContent(gameMode);
  }, [gameMode]);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedItem) return;

    const draggedItemData = leftItems.find(item => item.id === draggedItem);
    const targetItemData = rightItems.find(item => item.id === targetId);

    if (draggedItemData && targetItemData) {
      if (draggedItemData.matchId === targetItemData.matchId) {
        // Correct match
        setMatches(prev => ({ ...prev, [draggedItem]: targetId }));
        setScore(prev => prev + 10);
        
        toast({
          title: "Correct Match! 🎉",
          description: "Great job! You earned 10 points.",
        });
      } else {
        // Incorrect match
        toast({
          title: "Try Again",
          description: "That's not quite right. Keep trying!",
          variant: "destructive"
        });
      }
    }

    setDraggedItem(null);
  };

  const handleReset = () => {
    generateGameContent(gameMode);
  };

  const completedMatches = Object.keys(matches).length;
  const totalMatches = leftItems.length;
  const isComplete = completedMatches === totalMatches && totalMatches > 0;

  return (
    <div className="space-y-4">
      {/* Game Mode Selection */}
      <div className="flex flex-wrap gap-2 mb-4">
        {gameModes.map((mode) => (
          <Button
            key={mode.id}
            variant={gameMode.id === mode.id ? "default" : "outline"}
            size="sm"
            onClick={() => setGameMode(mode)}
            className="text-xs"
          >
            {mode.name}
            <Badge variant="secondary" className="ml-1 text-xs">
              L{mode.difficulty}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Score and Progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Score: {score}</Badge>
          <Badge variant="outline">
            Progress: {completedMatches}/{totalMatches}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw size={14} className="mr-1" />
            Reset
          </Button>
          <Button variant="outline" size="sm" onClick={() => generateGameContent(gameMode)}>
            <Shuffle size={14} className="mr-1" />
            New Set
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Generating new content...</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {/* Left Column - Items to Drag */}
          <div className="space-y-2">
            <h4 className="font-semibold text-center mb-3">Drag Items</h4>
            {leftItems.map((item) => {
              const isMatched = matches[item.id];
              return (
                <Card
                  key={item.id}
                  className={`p-3 cursor-move transition-all ${
                    isMatched 
                      ? 'bg-green-100 border-green-300 opacity-50' 
                      : 'hover:shadow-md hover:scale-105'
                  }`}
                  draggable={!isMatched}
                  onDragStart={(e) => handleDragStart(e, item.id)}
                >
                  <div className="text-center font-medium">
                    {item.content}
                  </div>
                  {isMatched && (
                    <div className="flex justify-center mt-1">
                      <Star size={16} className="text-green-600" />
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Right Column - Drop Targets */}
          <div className="space-y-2">
            <h4 className="font-semibold text-center mb-3">Drop Here</h4>
            {rightItems.map((item) => {
              const isTarget = Object.values(matches).includes(item.id);
              return (
                <Card
                  key={item.id}
                  className={`p-3 min-h-[60px] transition-all border-2 border-dashed ${
                    isTarget 
                      ? 'bg-green-100 border-green-300' 
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, item.id)}
                >
                  <div className="text-center font-medium">
                    {item.content}
                  </div>
                  {isTarget && (
                    <div className="flex justify-center mt-1">
                      <Star size={16} className="text-green-600" />
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Completion Message */}
      {isComplete && (
        <Card className="p-4 bg-green-50 border-green-200 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star size={20} className="text-yellow-500" />
            <h3 className="text-lg font-bold text-green-800">Congratulations!</h3>
            <Star size={20} className="text-yellow-500" />
          </div>
          <p className="text-green-700">
            You completed all matches! Final Score: {score} points
          </p>
          <Button 
            className="mt-2" 
            onClick={handleReset}
          >
            Play Again
          </Button>
        </Card>
      )}
    </div>
  );
}
