import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GameHUD } from './GameHUD';
import { soundEffectsService } from '@/services/soundEffectsService';
import { cn } from '@/lib/utils';

interface TreasureItem {
  id: string;
  word: string;
  emoji: string;
  position: { x: number; y: number };
  found: boolean;
}

interface TreasureHuntSlideProps {
  words: string[];
  emojis: string[];
  onComplete: (score: number) => void;
  theme?: 'space' | 'ocean' | 'forest' | 'playground' | 'fantasy';
  timeLimit?: number;
}

export function TreasureHuntSlide({
  words,
  emojis,
  onComplete,
  theme = 'playground',
  timeLimit = 60
}: TreasureHuntSlideProps) {
  const [treasures, setTreasures] = useState<TreasureItem[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [gameStarted, setGameStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [foundCount, setFoundCount] = useState(0);

  useEffect(() => {
    // Generate random positions for treasures
    const items: TreasureItem[] = words.map((word, idx) => ({
      id: `treasure-${idx}`,
      word,
      emoji: emojis[idx] || '💎',
      position: {
        x: Math.random() * 80 + 10, // 10-90%
        y: Math.random() * 70 + 15  // 15-85%
      },
      found: false
    }));
    setTreasures(items);
  }, [words, emojis]);

  useEffect(() => {
    if (!gameStarted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onComplete(score);
          return 0;
        }
        if (prev <= 10) soundEffectsService.playTimerWarning();
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, score]);

  useEffect(() => {
    if (foundCount === treasures.length && treasures.length > 0) {
      soundEffectsService.playLevelComplete();
      setTimeout(() => onComplete(score), 1000);
    }
  }, [foundCount, treasures.length, score]);

  const handleTreasureClick = (id: string) => {
    soundEffectsService.playCorrect();
    soundEffectsService.playStarEarned();
    
    setTreasures((prev) =>
      prev.map((t) => (t.id === id ? { ...t, found: true } : t))
    );
    
    setScore((prev) => prev + 50);
    setFoundCount((prev) => prev + 1);
  };

  const startGame = () => {
    setGameStarted(true);
    soundEffectsService.playButtonClick();
  };

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6">
        <h2 className="text-4xl font-bold">🗺️ Treasure Hunt!</h2>
        <p className="text-xl text-center">Find all the hidden treasures!</p>
        <button
          onClick={startGame}
          className="px-8 py-4 text-xl bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          Start Hunt
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <GameHUD
        score={score}
        lives={3}
        maxLives={3}
        timeLeft={timeLeft}
        level={1}
        isMuted={isMuted}
        onToggleMute={() => {
          setIsMuted(!isMuted);
          soundEffectsService.setMuted(!isMuted);
        }}
        theme={theme}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 to-green-200">
        {treasures.map((treasure) => (
          <motion.button
            key={treasure.id}
            onClick={() => !treasure.found && handleTreasureClick(treasure.id)}
            className={cn(
              'absolute text-4xl cursor-pointer transition-all',
              treasure.found && 'opacity-0 pointer-events-none'
            )}
            style={{
              left: `${treasure.position.x}%`,
              top: `${treasure.position.y}%`
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            animate={
              treasure.found
                ? { scale: 0, opacity: 0 }
                : { scale: [1, 1.1, 1], opacity: 1 }
            }
            transition={
              treasure.found
                ? { duration: 0.3 }
                : { duration: 2, repeat: Infinity }
            }
          >
            {treasure.emoji}
          </motion.button>
        ))}

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur px-6 py-3 rounded-lg">
          <p className="text-lg font-medium">
            Found: {foundCount}/{treasures.length}
          </p>
        </div>
      </div>
    </div>
  );
}
