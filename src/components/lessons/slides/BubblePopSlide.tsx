import React, { useState, useEffect } from 'react';
import { Slide } from '@/types/slides';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface BubblePopSlideProps {
  slide: Slide;
  onComplete?: () => void;
  onNext?: () => void;
}

interface Bubble {
  id: string;
  word: string;
  x: number;
  y: number;
  isCorrect: boolean;
}

export function BubblePopSlide({ slide, onComplete, onNext }: BubblePopSlideProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isActive, setIsActive] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const targetWords = slide.options?.filter(opt => opt.isCorrect).map(opt => opt.text) || [];
  const distractorWords = slide.options?.filter(opt => !opt.isCorrect).map(opt => opt.text) || [];

  useEffect(() => {
    if (!isActive || gameCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsActive(false);
          setGameCompleted(true);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const bubbleGenerator = setInterval(() => {
      const allWords = [...targetWords, ...distractorWords];
      const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
      const isCorrect = targetWords.includes(randomWord);

      const newBubble: Bubble = {
        id: `bubble-${Date.now()}-${Math.random()}`,
        word: randomWord,
        x: Math.random() * 80 + 10,
        y: 100,
        isCorrect
      };

      setBubbles(prev => [...prev, newBubble]);
    }, 1500);

    return () => {
      clearInterval(timer);
      clearInterval(bubbleGenerator);
    };
  }, [isActive, gameCompleted]);

  const handleBubblePop = (bubble: Bubble) => {
    setBubbles(prev => prev.filter(b => b.id !== bubble.id));
    
    if (bubble.isCorrect) {
      setScore(prev => prev + 5);
    } else {
      setScore(prev => Math.max(0, prev - 2));
    }
  };

  const startGame = () => {
    setIsActive(true);
    setScore(0);
    setTimeLeft(45);
    setBubbles([]);
    setGameCompleted(false);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden"
         style={{ backgroundImage: `url(${slide.media?.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 z-10"
      >
        <h2 className="text-3xl font-bold text-foreground mb-2">{slide.prompt}</h2>
        <p className="text-lg text-muted-foreground">{slide.instructions}</p>
      </motion.div>

      {!isActive && !gameCompleted && (
        <Card className="p-8 text-center">
          <h3 className="text-xl font-bold mb-4">Pop the Bubbles!</h3>
          <p className="mb-6">Click bubbles with greeting words only!</p>
          <Button onClick={startGame} size="lg" className="text-xl px-8">
            Start Game
          </Button>
        </Card>
      )}

      {isActive && (
        <>
          <div className="absolute top-4 right-4 flex gap-6 z-20">
            <Card className="px-6 py-3">
              <p className="text-2xl font-bold text-primary">Score: {score}</p>
            </Card>
            <Card className="px-6 py-3">
              <p className="text-2xl font-bold text-destructive">Time: {timeLeft}s</p>
            </Card>
          </div>

          <AnimatePresence>
            {bubbles.map(bubble => (
              <motion.div
                key={bubble.id}
                initial={{ y: '100vh', x: `${bubble.x}vw`, scale: 0 }}
                animate={{ y: '-20vh', scale: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 8, ease: 'linear' }}
                className="absolute cursor-pointer"
                onClick={() => handleBubblePop(bubble)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400/60 to-purple-400/60 
                                backdrop-blur-sm border-2 border-white/50 shadow-xl
                                flex items-center justify-center">
                    <span className="text-white font-bold text-lg drop-shadow-lg">
                      {bubble.word}
                    </span>
                  </div>
                  <div className="absolute top-2 left-2 w-4 h-4 bg-white/40 rounded-full blur-sm"></div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </>
      )}

      {gameCompleted && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="z-20"
        >
          <Card className="p-8 text-center">
            <h3 className="text-3xl font-bold mb-4">🎉 Great Job!</h3>
            <p className="text-2xl mb-6">Final Score: <span className="text-primary font-bold">{score}</span></p>
            <Button onClick={onNext} size="lg">Continue</Button>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
