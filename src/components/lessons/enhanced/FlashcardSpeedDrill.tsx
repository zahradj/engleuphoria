import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Zap, Volume2 } from 'lucide-react';

interface Flashcard {
  front: string;
  back: string;
  audioText?: string;
}

interface FlashcardSpeedDrillProps {
  cards: Flashcard[];
  timePerCard?: number; // seconds
  onComplete: (cardsReviewed: number) => void;
}

export function FlashcardSpeedDrill({ cards, timePerCard = 3, onComplete }: FlashcardSpeedDrillProps) {
  const [started, setStarted] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timePerCard);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!started || finished) return;

    if (timeLeft <= 0) {
      nextCard();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [started, finished, timeLeft, currentCard]);

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const nextCard = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
      setTimeLeft(timePerCard);
    } else {
      setFinished(true);
      onComplete(cards.length);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped && cards[currentCard].audioText) {
      playAudio(cards[currentCard].audioText || cards[currentCard].back);
    }
  };

  const progressPercentage = ((currentCard + 1) / cards.length) * 100;

  if (!started) {
    return (
      <Card className="p-8 max-w-2xl mx-auto text-center space-y-6">
        <div className="space-y-4">
          <Zap className="w-16 h-16 mx-auto text-primary" />
          <h2 className="text-3xl font-bold text-foreground">Flashcard Speed Drill!</h2>
          <p className="text-lg text-muted-foreground">
            Review {cards.length} cards quickly - {timePerCard} seconds each
          </p>
          <div className="text-sm text-muted-foreground">
            Tap to flip the cards and learn! 📚
          </div>
        </div>
        <Button size="lg" onClick={() => setStarted(true)} className="px-12">
          Start Drill
        </Button>
      </Card>
    );
  }

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <Card className="p-8 max-w-2xl mx-auto">
          <div className="space-y-4">
            <Zap className="w-20 h-20 mx-auto text-green-500 fill-green-500" />
            <h2 className="text-3xl font-bold text-foreground">Drill Complete!</h2>
            <p className="text-xl text-muted-foreground">
              You reviewed all {cards.length} flashcards! 🎉
            </p>
          </div>
        </Card>
      </motion.div>
    );
  }

  const card = cards[currentCard];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Card {currentCard + 1} / {cards.length}</span>
          <span className={timeLeft <= 1 ? 'text-red-500 font-bold' : ''}>{timeLeft}s</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Flashcard */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard}
          initial={{ opacity: 0, rotateY: -90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          exit={{ opacity: 0, rotateY: 90 }}
          transition={{ duration: 0.3 }}
          className="perspective-1000"
        >
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            className="relative preserve-3d cursor-pointer"
            onClick={handleFlip}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Card className="p-12 min-h-[300px] flex items-center justify-center backface-hidden">
              <div className={`text-center space-y-4 ${isFlipped ? 'invisible' : 'visible'}`}>
                <div className="text-4xl font-bold text-foreground">
                  {card.front}
                </div>
                <p className="text-sm text-muted-foreground">Tap to see answer</p>
              </div>
            </Card>
            
            <Card 
              className="absolute inset-0 p-12 min-h-[300px] flex items-center justify-center backface-hidden bg-gradient-to-br from-primary/10 to-primary/5"
              style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
            >
              <div className={`text-center space-y-4 ${isFlipped ? 'visible' : 'invisible'}`}>
                <div className="text-4xl font-bold text-foreground">
                  {card.back}
                </div>
                {card.audioText && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      playAudio(card.audioText || card.back);
                    }}
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Listen
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Next Button */}
      <div className="flex justify-center">
        <Button onClick={nextCard} size="lg" variant="outline">
          Next Card →
        </Button>
      </div>
    </div>
  );
}
