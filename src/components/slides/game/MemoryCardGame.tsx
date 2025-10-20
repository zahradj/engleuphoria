import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { GameHUD } from './GameHUD';
import { soundEffectsService } from '@/services/soundEffectsService';
import { cn } from '@/lib/utils';

interface CardPair {
  id: string;
  content: string;
  matched: boolean;
}

interface MemoryCardGameProps {
  pairs: Array<{ word: string; emoji: string }>;
  onComplete: (score: number, perfect: boolean) => void;
  theme?: 'space' | 'ocean' | 'forest' | 'playground' | 'fantasy';
  timeLimit?: number;
}

export function MemoryCardGame({ pairs, onComplete, theme = 'playground', timeLimit = 90 }: MemoryCardGameProps) {
  const [cards, setCards] = useState<CardPair[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [attempts, setAttempts] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Initialize cards (each pair creates 2 cards)
    const initialCards: CardPair[] = [];
    pairs.forEach((pair, idx) => {
      initialCards.push(
        { id: `${idx}-word`, content: pair.word, matched: false },
        { id: `${idx}-emoji`, content: pair.emoji, matched: false }
      );
    });
    
    // Shuffle cards
    const shuffled = initialCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, [pairs]);

  useEffect(() => {
    if (!gameStarted || gameEnded) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        if (prev <= 10) soundEffectsService.playTimerWarning();
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameEnded]);

  useEffect(() => {
    if (matchedPairs.length === pairs.length && matchedPairs.length > 0) {
      soundEffectsService.playLevelComplete();
      setTimeout(() => endGame(), 1000);
    }
  }, [matchedPairs, pairs.length]);

  const startGame = () => {
    setGameStarted(true);
    soundEffectsService.playButtonClick();
  };

  const endGame = () => {
    setGameEnded(true);
    const perfect = lives === 5 && attempts === pairs.length;
    onComplete(score, perfect);
  };

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || cards[index].matched) {
      return;
    }

    soundEffectsService.playButtonClick();
    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setAttempts((prev) => prev + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];

      // Check if they're a matching pair (same id prefix)
      const firstId = firstCard.id.split('-')[0];
      const secondId = secondCard.id.split('-')[0];

      if (firstId === secondId) {
        // Match found!
        soundEffectsService.playCorrect();
        setMatchedPairs((prev) => [...prev, firstId]);
        setScore((prev) => prev + 100);
        
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id.startsWith(firstId) ? { ...card, matched: true } : card
          )
        );

        setTimeout(() => setFlippedCards([]), 500);
      } else {
        // No match
        soundEffectsService.playIncorrect();
        setLives((prev) => Math.max(0, prev - 1));
        
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6 p-8">
        <h2 className="text-4xl font-bold text-center">Memory Card Game 🎴</h2>
        <p className="text-xl text-center">Match the pairs by remembering their positions!</p>
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">⏱️ Time Limit: {timeLimit} seconds</p>
          <p className="text-muted-foreground">❤️ Lives: 5</p>
          <p className="text-muted-foreground">🎯 Pairs to find: {pairs.length}</p>
        </div>
        <Button size="lg" onClick={startGame} className="text-xl px-8 py-6">
          Start Game
        </Button>
      </div>
    );
  }

  if (gameEnded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6 p-8">
        <h2 className="text-4xl font-bold">Game Over!</h2>
        <div className="text-center space-y-2">
          <p className="text-2xl">Final Score: {score}</p>
          <p className="text-xl">Pairs Found: {matchedPairs.length}/{pairs.length}</p>
          <p className="text-xl">Attempts: {attempts}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <GameHUD
        score={score}
        lives={lives}
        maxLives={5}
        timeLeft={timeLeft}
        level={1}
        isMuted={isMuted}
        onToggleMute={() => {
          setIsMuted(!isMuted);
          soundEffectsService.setMuted(!isMuted);
        }}
        theme={theme}
      />

      <div className="flex-1 p-8">
        <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: card.matched ? 1 : 1.05 }}
              whileTap={{ scale: card.matched ? 1 : 0.95 }}
            >
              <Button
                onClick={() => handleCardClick(index)}
                disabled={card.matched || flippedCards.includes(index)}
                className={cn(
                  'w-full h-24 text-2xl font-bold transition-all',
                  card.matched && 'opacity-50 cursor-not-allowed bg-success',
                  flippedCards.includes(index) && 'bg-primary',
                  !card.matched && !flippedCards.includes(index) && 'bg-secondary'
                )}
              >
                <AnimatePresence mode="wait">
                  {(flippedCards.includes(index) || card.matched) ? (
                    <motion.span
                      key="content"
                      initial={{ rotateY: 90 }}
                      animate={{ rotateY: 0 }}
                      exit={{ rotateY: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      {card.content}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="back"
                      initial={{ rotateY: 0 }}
                      animate={{ rotateY: 0 }}
                      exit={{ rotateY: 90 }}
                      transition={{ duration: 0.2 }}
                      className="text-4xl"
                    >
                      🎴
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
