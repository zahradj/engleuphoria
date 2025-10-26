import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCcw, Star } from 'lucide-react';
import { soundEffectsService } from '@/services/soundEffectsService';
import { ConfettiEffect } from '@/components/gamification/ConfettiEffect';

interface MemoryCard {
  id: string;
  content: string;
  pairId: string;
}

interface MemoryGameActivityProps {
  pairs: Array<{ id: string; word: string; translation: string }>;
  title?: string;
  instructions?: string;
  onComplete?: () => void;
}

export function MemoryGameActivity({ pairs, title, instructions, onComplete }: MemoryGameActivityProps) {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    initializeGame();
  }, [pairs]);

  const initializeGame = () => {
    const gameCards: MemoryCard[] = [];
    pairs.forEach((pair) => {
      gameCards.push(
        { id: `${pair.id}-word`, content: pair.word, pairId: pair.id },
        { id: `${pair.id}-translation`, content: pair.translation, pairId: pair.id }
      );
    });
    setCards(gameCards.sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
  };

  const handleCardClick = (cardId: string) => {
    if (flippedCards.length === 2 || flippedCards.includes(cardId) || matchedPairs.includes(cardId)) {
      return;
    }

    soundEffectsService.playButtonClick();
    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const card1 = cards.find(c => c.id === newFlipped[0]);
      const card2 = cards.find(c => c.id === newFlipped[1]);

      if (card1 && card2 && card1.pairId === card2.pairId) {
        soundEffectsService.playCorrect();
        setMatchedPairs([...matchedPairs, newFlipped[0], newFlipped[1]]);
        setFlippedCards([]);
        
        if (matchedPairs.length + 2 === cards.length) {
          setShowConfetti(true);
          soundEffectsService.playCelebration();
          setTimeout(() => onComplete?.(), 2000);
        }
      } else {
        soundEffectsService.playIncorrect();
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  const isCardFlipped = (cardId: string) => {
    return flippedCards.includes(cardId) || matchedPairs.includes(cardId);
  };

  const isCardMatched = (cardId: string) => {
    return matchedPairs.includes(cardId);
  };

  return (
    <>
      <ConfettiEffect trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <div className="space-y-6">
        {title && (
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent"
          >
            {title}
          </motion.h3>
        )}

        {instructions && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted-foreground"
          >
            {instructions}
          </motion.p>
        )}

        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
            <Star className="w-5 h-5 text-amber-500" />
            <span className="font-semibold">Moves: {moves}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
            <Trophy className="w-5 h-5 text-green-500" />
            <span className="font-semibold">Pairs: {matchedPairs.length / 2}/{pairs.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleCardClick(card.id)}
              className="aspect-square cursor-pointer"
            >
              <motion.div
                className="relative w-full h-full"
                animate={{ rotateY: isCardFlipped(card.id) ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Card Back */}
                <div
                  className={`absolute inset-0 rounded-xl flex items-center justify-center text-4xl ${
                    isCardMatched(card.id)
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                      : 'bg-gradient-to-br from-pink-400 to-rose-500'
                  } shadow-lg`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  {isCardMatched(card.id) ? '✓' : '?'}
                </div>
                
                {/* Card Front */}
                <div
                  className="absolute inset-0 rounded-xl bg-card border-2 border-border flex items-center justify-center p-2 shadow-lg"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <span className="text-sm md:text-base font-semibold text-center break-words">
                    {card.content}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {matchedPairs.length === cards.length && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl text-center space-y-2"
          >
            <Trophy className="w-12 h-12 mx-auto" />
            <h3 className="text-2xl font-bold">Congratulations! 🎉</h3>
            <p className="text-lg">Completed in {moves} moves!</p>
          </motion.div>
        )}

        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              soundEffectsService.playButtonClick();
              initializeGame();
            }}
            className="px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-xl font-semibold transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            New Game
          </motion.button>
        </div>
      </div>
    </>
  );
}
