import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { GameHUD } from './GameHUD';
import { audioService } from '@/services/audioService';
import { Zap, Target, Clock } from 'lucide-react';

interface FastMatchGameProps {
  matchPairs: Array<{
    id: string;
    left: string;
    right: string;
    leftImage?: string;
    rightImage?: string;
  }>;
  onComplete: (correct: boolean, attempts: number, score?: number) => void;
  theme?: 'space' | 'ocean' | 'forest' | 'playground' | 'fantasy';
  timeLimit?: number;
}

interface GameItem {
  id: string;
  content: string;
  pairId: string;
  type: 'left' | 'right';
  matched: boolean;
  image?: string;
}

export function FastMatchGame({ 
  matchPairs, 
  onComplete, 
  theme = 'playground',
  timeLimit = 60 
}: FastMatchGameProps) {
  const [gameItems, setGameItems] = useState<GameItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<GameItem | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [attempts, setAttempts] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Initialize game items
  useEffect(() => {
    const items: GameItem[] = [];
    matchPairs.forEach(pair => {
      items.push({
        id: `${pair.id}-left`,
        content: pair.left,
        pairId: pair.id,
        type: 'left',
        matched: false,
        image: pair.leftImage
      });
      items.push({
        id: `${pair.id}-right`,
        content: pair.right,
        pairId: pair.id,
        type: 'right',
        matched: false,
        image: pair.rightImage
      });
    });
    
    // Shuffle items for random placement
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setGameItems(shuffled);
  }, [matchPairs]);

  // Timer effect
  useEffect(() => {
    if (!gameStarted || gameEnded || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameEnded, timeLeft]);

  const startGame = () => {
    setGameStarted(true);
    if (!isMuted) audioService.playSuccessSound();
  };

  const endGame = useCallback((success: boolean) => {
    if (gameEnded) return;
    
    setGameEnded(true);
    const allMatched = gameItems.every(item => item.matched);
    const finalScore = score + (timeLeft * 10); // Time bonus
    
    if (success && allMatched) {
      if (!isMuted) audioService.playCelebrationSound();
      onComplete(true, attempts, finalScore);
    } else {
      onComplete(false, attempts, score);
    }
  }, [gameEnded, gameItems, score, timeLeft, attempts, onComplete, isMuted]);

  const handleItemClick = (item: GameItem) => {
    if (item.matched || gameEnded) return;

    if (!selectedItem) {
      setSelectedItem(item);
      if (!isMuted) audioService.playButtonClick();
    } else if (selectedItem.id === item.id) {
      // Deselect
      setSelectedItem(null);
    } else if (selectedItem.pairId === item.pairId) {
      // Correct match!
      const newScore = score + (100 * (streakCount + 1));
      setScore(newScore);
      setStreakCount(prev => prev + 1);
      setAttempts(prev => prev + 1);
      
      // Mark items as matched
      setGameItems(prev => prev.map(gameItem => 
        gameItem.pairId === item.pairId 
          ? { ...gameItem, matched: true }
          : gameItem
      ));
      
      setSelectedItem(null);
      
      if (!isMuted) audioService.playRewardSound(100 * (streakCount + 1));
      
      // Check if all matched
      const updatedItems = gameItems.map(gameItem => 
        gameItem.pairId === item.pairId 
          ? { ...gameItem, matched: true }
          : gameItem
      );
      
      if (updatedItems.every(gameItem => gameItem.matched)) {
        setTimeout(() => endGame(true), 500);
      }
    } else {
      // Wrong match
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setTimeout(() => endGame(false), 500);
        }
        return newLives;
      });
      setStreakCount(0);
      setAttempts(prev => prev + 1);
      setSelectedItem(null);
      
      if (!isMuted) audioService.playErrorSound();
    }
  };

  const getItemStyle = (item: GameItem) => {
    if (item.matched) return 'bg-success-soft border-success text-success-on opacity-50';
    if (selectedItem?.id === item.id) return 'bg-primary border-primary text-primary-foreground scale-105';
    return 'bg-card border-border hover:bg-accent hover:scale-102';
  };

  if (!gameStarted) {
    return (
      <Card className="p-8 text-center space-y-6">
        <div className="space-y-4">
          <div className="flex justify-center">
            <Zap className="h-16 w-16 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold">Fast Match Challenge!</h2>
          <p className="text-muted-foreground">
            Match pairs as quickly as possible! You have {timeLimit} seconds and 3 lives.
          </p>
          <div className="flex justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>{matchPairs.length} pairs to match</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{timeLimit} seconds</span>
            </div>
          </div>
        </div>
        <Button onClick={startGame} size="lg" className="text-lg px-8">
          Start Game!
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <GameHUD
        score={score}
        lives={lives}
        maxLives={3}
        timeLeft={timeLeft}
        level={1}
        streakCount={streakCount}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        theme={theme}
      />
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4">
        {gameItems.map((item) => (
          <Button
            key={item.id}
            variant="outline"
            onClick={() => handleItemClick(item)}
            disabled={item.matched || gameEnded}
            className={cn(
              "min-h-[80px] p-4 flex flex-col items-center gap-2 transition-all duration-200",
              "hover:scale-102 active:scale-95",
              getItemStyle(item)
            )}
          >
            {item.image && (
              <img 
                src={item.image} 
                alt="" 
                className="w-8 h-8 object-cover rounded"
              />
            )}
            <span className="text-sm font-medium text-center leading-tight">
              {item.content}
            </span>
          </Button>
        ))}
      </div>
      
      {gameEnded && (
        <Card className="p-6 text-center space-y-4">
          <h3 className="text-xl font-bold">
            {gameItems.every(item => item.matched) ? '🎉 Excellent!' : '💪 Keep Practicing!'}
          </h3>
          <div className="flex justify-center gap-4">
            <Badge variant="secondary">Score: {score}</Badge>
            <Badge variant="secondary">Attempts: {attempts}</Badge>
            {streakCount > 0 && (
              <Badge variant="secondary">Best Streak: {streakCount}</Badge>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}