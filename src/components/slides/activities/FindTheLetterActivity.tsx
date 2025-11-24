import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Timer, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FindTheLetterActivityProps {
  targetLetter: string;
  gridLetters: string[];
  targetCount: number;
  onComplete: (time: number, xp: number) => void;
  studentId?: string;
  lessonId?: string;
}

export const FindTheLetterActivity: React.FC<FindTheLetterActivityProps> = ({
  targetLetter,
  gridLetters,
  targetCount,
  onComplete,
}) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [startTime] = useState(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isComplete) return;
    
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, isComplete]);

  const handleLetterClick = (index: number) => {
    if (isComplete || selectedIndices.includes(index)) return;

    const clickedLetter = gridLetters[index].toLowerCase();
    const target = targetLetter.toLowerCase();

    if (clickedLetter === target) {
      const newSelected = [...selectedIndices, index];
      setSelectedIndices(newSelected);

      if (newSelected.length === targetCount) {
        setIsComplete(true);
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 }
        });

        const xp = Math.max(20, 50 - timeTaken);

        setTimeout(() => {
          onComplete(timeTaken, xp);
        }, 2000);
      }
    }
  };

  const isTargetLetter = (letter: string) => {
    return letter.toLowerCase() === targetLetter.toLowerCase();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <h2 className="text-3xl font-bold text-center mb-4 text-foreground">
          Find the Letter!
        </h2>
        <p className="text-lg text-center mb-6 text-muted-foreground">
          Find all {targetCount} letter <span className="font-bold text-primary">{targetLetter.toUpperCase()}</span>'s
        </p>

        <div className="flex justify-center gap-8 mb-6">
          <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg border">
            <Timer className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">{timeElapsed}s</span>
          </div>
          <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg border">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-foreground">
              {selectedIndices.length} / {targetCount}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-3 mb-6">
          {gridLetters.map((letter, index) => {
            const isSelected = selectedIndices.includes(index);
            const isTarget = isTargetLetter(letter);

            return (
              <motion.button
                key={index}
                onClick={() => handleLetterClick(index)}
                disabled={isComplete || isSelected}
                whileHover={{ scale: isComplete || isSelected ? 1 : 1.1 }}
                whileTap={{ scale: isComplete || isSelected ? 1 : 0.9 }}
                className={`
                  aspect-square rounded-xl text-4xl font-bold transition-all duration-300
                  ${!isSelected ? 'bg-card border-2 border-border hover:border-primary' : ''}
                  ${isSelected && isTarget ? 'bg-green-500 text-white border-2 border-green-600' : ''}
                  ${isSelected && !isTarget ? 'bg-red-500 text-white border-2 border-red-600' : ''}
                `}
              >
                <AnimatePresence>
                  {isSelected ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="flex items-center justify-center h-full"
                    >
                      ✓
                    </motion.div>
                  ) : (
                    <div className="text-foreground">{letter}</div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-3xl font-bold text-green-600">
                Perfect! You found them all! 🎉
              </p>
              <p className="text-lg text-muted-foreground mt-2">
                Completed in {timeElapsed} seconds
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
