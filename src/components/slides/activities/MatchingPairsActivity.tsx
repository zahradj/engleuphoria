import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { soundEffectsService } from '@/services/soundEffectsService';
import { useToast } from '@/hooks/use-toast';
import { ConfettiEffect } from '@/components/gamification/ConfettiEffect';

interface MatchingPairsActivityProps {
  slide: any;
  onNext?: () => void;
}

export function MatchingPairsActivity({ slide, onNext }: MatchingPairsActivityProps) {
  const { toast } = useToast();
  const [cards, setCards] = useState<any[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Initialize cards from pairs
    const pairs = slide.pairs || [];
    const allCards: any[] = [];
    
    pairs.forEach((pair: any, index: number) => {
      allCards.push({
        id: `${pair.id}-1`,
        pairId: pair.id,
        content: pair.card1,
        index: index * 2,
      });
      allCards.push({
        id: `${pair.id}-2`,
        pairId: pair.id,
        content: pair.card2,
        index: index * 2 + 1,
      });
    });

    // Shuffle cards
    const shuffled = allCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, [slide.pairs]);

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(index)) return;
    if (matchedPairs.includes(cards[index].pairId)) return;

    soundEffectsService.playButtonClick();
    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      const firstCard = cards[first];
      const secondCard = cards[second];

      setTimeout(() => {
        if (firstCard.pairId === secondCard.pairId) {
          soundEffectsService.playCorrect();
          setMatchedPairs([...matchedPairs, firstCard.pairId]);
          
          if (matchedPairs.length + 1 === slide.pairs?.length) {
            setShowConfetti(true);
            toast({
              title: slide.successMessage || "Amazing! 🎉",
              description: "You found all the pairs!",
            });
          }
        } else {
          soundEffectsService.playIncorrect();
        }
        setFlippedCards([]);
      }, 1000);
    }
  };

  const isCardFlipped = (index: number) => {
    return flippedCards.includes(index) || matchedPairs.includes(cards[index]?.pairId);
  };

  const isCardMatched = (index: number) => {
    return matchedPairs.includes(cards[index]?.pairId);
  };

  return (
    <>
      <ConfettiEffect trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <div className="space-y-6">
        {slide.instructions && (
          <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800">
            <p className="text-center font-medium">🎯 {slide.instructions}</p>
          </Card>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((card, index) => {
            const flipped = isCardFlipped(index);
            const matched = isCardMatched(index);

            return (
              <motion.div
                key={card.id}
                whileHover={!flipped ? { scale: 1.05 } : {}}
                whileTap={!flipped ? { scale: 0.95 } : {}}
                onClick={() => handleCardClick(index)}
                className="relative aspect-square cursor-pointer"
              >
                <div className={`w-full h-full transition-transform duration-500 transform-gpu ${flipped ? 'rotate-y-180' : ''}`}>
                  {/* Card Back */}
                  <Card className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 ${flipped ? 'invisible' : 'visible'}`}>
                    <Sparkles className="h-8 w-8 text-white" />
                  </Card>

                  {/* Card Front */}
                  <Card className={`absolute inset-0 flex items-center justify-center p-4 ${
                    matched 
                      ? 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-950 dark:to-emerald-950 border-2 border-green-500' 
                      : 'bg-card border-2 border-primary'
                  } ${flipped ? 'visible' : 'invisible'} rotate-y-180`}>
                    {card.content.type === 'image' && card.content.imagePrompt && (
                      <div className="text-4xl">🖼️</div>
                    )}
                    {card.content.type === 'word' && (
                      <div className="text-lg font-bold text-center">{card.content.text}</div>
                    )}
                  </Card>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Matched: {matchedPairs.length} / {slide.pairs?.length || 0}
        </div>

        {matchedPairs.length === slide.pairs?.length && onNext && (
          <div className="flex justify-center pt-4">
            <Button size="lg" onClick={onNext} className="bg-gradient-to-r from-green-500 to-emerald-500">
              Continue ➡️
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
