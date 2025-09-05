import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { GameHUD } from './GameHUD';
import { audioService } from '@/services/audioService';
import { Brain, Eye, Clock } from 'lucide-react';

interface MemoryFlipGameProps {
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

interface FlipCard {
  id: string;
  content: string;
  pairId: string;
  isFlipped: boolean;
  isMatched: boolean;
  image?: string;
}

export function MemoryFlipGame({ 
  matchPairs, 
  onComplete, 
  theme = 'playground',
  timeLimit = 90 
}: MemoryFlipGameProps) {
  const [cards, setCards] = useState<FlipCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<FlipCard[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [attempts, setAttempts] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Initialize cards
  useEffect(() => {
    const cardData: FlipCard[] = [];
    matchPairs.forEach(pair => {
      cardData.push({
        id: `${pair.id}-left`,
        content: pair.left,
        pairId: pair.id,
        isFlipped: false,
        isMatched: false,
        image: pair.leftImage
      });
      cardData.push({
        id: `${pair.id}-right`,
        content: pair.right,
        pairId: pair.id,
        isFlipped: false,
        isMatched: false,
        image: pair.rightImage
      });
    });
    
    // Shuffle cards
    const shuffled = [...cardData].sort(() => Math.random() - 0.5);
    setCards(shuffled);
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

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      setAttempts(prev => prev + 1);

      setTimeout(() => {
        if (first.pairId === second.pairId) {
          // Match found!
          setCards(prev => prev.map(card => 
            card.pairId === first.pairId 
              ? { ...card, isMatched: true, isFlipped: true }
              : card
          ));
          
          const points = 200 + (timeLeft * 2); // Time bonus
          setScore(prev => prev + points);
          
          if (!isMuted) audioService.playRewardSound(points);
          
          // Check if game is complete
          const updatedCards = cards.map(card => 
            card.pairId === first.pairId 
              ? { ...card, isMatched: true }
              : card
          );
          
          if (updatedCards.every(card => card.isMatched)) {
            setTimeout(() => endGame(true), 1000);
          }
        } else {
          // No match - flip cards back
          setCards(prev => prev.map(card => ({
            ...card,
            isFlipped: card.isMatched
          })));
          
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setTimeout(() => endGame(false), 500);
            }
            return newLives;
          });
          
          if (!isMuted) audioService.playErrorSound();
        }
        
        setFlippedCards([]);
      }, 1500);
    }
  }, [flippedCards, cards, timeLeft, isMuted]);

  const startGame = () => {
    setGameStarted(true);
    setShowAll(true);
    
    // Show all cards for 3 seconds, then flip them
    setTimeout(() => {
      setShowAll(false);
      setCards(prev => prev.map(card => ({ ...card, isFlipped: false })));
    }, 3000);
    
    if (!isMuted) audioService.playSuccessSound();
  };

  const endGame = useCallback((success: boolean) => {
    if (gameEnded) return;
    
    setGameEnded(true);
    const allMatched = cards.every(card => card.isMatched);
    const finalScore = score + (timeLeft * 10); // Final time bonus
    
    if (success && allMatched) {
      if (!isMuted) audioService.playCelebrationSound();
      onComplete(true, attempts, finalScore);
    } else {
      onComplete(false, attempts, score);
    }
  }, [gameEnded, cards, score, timeLeft, attempts, onComplete, isMuted]);

  const handleCardClick = (card: FlipCard) => {
    if (card.isFlipped || card.isMatched || flippedCards.length >= 2 || gameEnded) return;
    
    const updatedCard = { ...card, isFlipped: true };
    setCards(prev => prev.map(c => c.id === card.id ? updatedCard : c));
    setFlippedCards(prev => [...prev, updatedCard]);
    
    if (!isMuted) audioService.playButtonClick();
  };

  const getCardStyle = (card: FlipCard) => {
    if (card.isMatched) return 'bg-success-soft border-success text-success-on';
    if (card.isFlipped || showAll) return 'bg-primary border-primary text-primary-foreground';
    return 'bg-gradient-to-br from-blue-500 to-purple-600 border-blue-400 text-white cursor-pointer hover:scale-105';
  };

  if (!gameStarted) {
    return (
      <Card className="p-8 text-center space-y-6">
        <div className="space-y-4">
          <div className="flex justify-center">
            <Brain className="h-16 w-16 text-purple-500" />
          </div>
          <h2 className="text-2xl font-bold">Memory Flip Game!</h2>
          <p className="text-muted-foreground">
            Memorize the cards and find matching pairs! You have {timeLimit} seconds and 5 lives.
          </p>
          <div className="flex justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{matchPairs.length * 2} cards</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{timeLimit} seconds</span>
            </div>
          </div>
        </div>
        <Button onClick={startGame} size="lg" className="text-lg px-8">
          Start Memory Game!
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <GameHUD
        score={score}
        lives={lives}
        maxLives={5}
        timeLeft={timeLeft}
        level={1}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        theme={theme}
      />
      
      {showAll && (
        <div className="text-center p-4 bg-primary-soft rounded-lg">
          <p className="text-lg font-medium">Memorize the cards! Game starts in 3 seconds...</p>
        </div>
      )}
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 p-4">
        {cards.map((card) => (
          <Button
            key={card.id}
            variant="outline"
            onClick={() => handleCardClick(card)}
            disabled={card.isMatched || flippedCards.length >= 2 || gameEnded}
            className={cn(
              "aspect-square min-h-[80px] p-2 flex flex-col items-center justify-center gap-1",
              "transition-all duration-300 transform-gpu",
              getCardStyle(card)
            )}
          >
            {card.isFlipped || card.isMatched || showAll ? (
              <>
                {card.image && (
                  <img 
                    src={card.image} 
                    alt="" 
                    className="w-6 h-6 object-cover rounded"
                  />
                )}
                <span className="text-xs font-medium text-center leading-tight">
                  {card.content}
                </span>
              </>
            ) : (
              <div className="text-2xl">?</div>
            )}
          </Button>
        ))}
      </div>
      
      {gameEnded && (
        <Card className="p-6 text-center space-y-4">
          <h3 className="text-xl font-bold">
            {cards.every(card => card.isMatched) ? '🧠 Memory Master!' : '🎯 Good Try!'}
          </h3>
          <div className="flex justify-center gap-4">
            <Badge variant="secondary">Score: {score}</Badge>
            <Badge variant="secondary">Attempts: {attempts}</Badge>
            <Badge variant="secondary">
              Accuracy: {Math.round((cards.filter(c => c.isMatched).length / 2) / attempts * 100) || 0}%
            </Badge>
          </div>
        </Card>
      )}
    </div>
  );
}