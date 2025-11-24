import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

interface TapToChooseOption {
  id: string;
  text: string;
  image?: string;
  isCorrect: boolean;
}

interface TapToChooseActivityProps {
  title: string;
  instructions: string;
  options: TapToChooseOption[];
  allowMultiple?: boolean;
  onComplete: (score: number, xp: number) => void;
  studentId?: string;
  lessonId?: string;
}

export const TapToChooseActivity: React.FC<TapToChooseActivityProps> = ({
  title,
  instructions,
  options,
  allowMultiple = false,
  onComplete,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleOptionClick = (optionId: string) => {
    if (revealed) return;

    if (allowMultiple) {
      setSelectedIds(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedIds([optionId]);
      handleSubmit([optionId]);
    }
  };

  const handleSubmit = (ids: string[] = selectedIds) => {
    setRevealed(true);
    setShowFeedback(true);

    const correctOptions = options.filter(opt => opt.isCorrect);
    const correctIds = correctOptions.map(opt => opt.id);
    
    const correctSelections = ids.filter(id => correctIds.includes(id)).length;
    const incorrectSelections = ids.filter(id => !correctIds.includes(id)).length;
    
    const score = Math.max(0, correctSelections - incorrectSelections);
    const maxScore = correctOptions.length;
    const percentage = (score / maxScore) * 100;
    
    const xp = Math.round((percentage / 100) * 50);

    if (percentage >= 80) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setTimeout(() => {
      onComplete(score, xp);
    }, 2000);
  };

  const isCorrectSelection = (optionId: string) => {
    const option = options.find(opt => opt.id === optionId);
    return option?.isCorrect;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <h2 className="text-3xl font-bold text-center mb-4 text-foreground">{title}</h2>
        <p className="text-lg text-center mb-8 text-muted-foreground">{instructions}</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {options.map((option) => {
            const isSelected = selectedIds.includes(option.id);
            const isCorrect = isCorrectSelection(option.id);

            return (
              <motion.button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                disabled={revealed}
                whileHover={{ scale: revealed ? 1 : 1.05 }}
                whileTap={{ scale: revealed ? 1 : 0.95 }}
                className={`
                  relative p-6 rounded-2xl border-4 transition-all duration-300
                  ${!revealed && !isSelected ? 'border-border bg-card hover:border-primary' : ''}
                  ${!revealed && isSelected ? 'border-primary bg-primary/10' : ''}
                  ${revealed && isCorrect && isSelected ? 'border-green-500 bg-green-50' : ''}
                  ${revealed && !isCorrect && isSelected ? 'border-red-500 bg-red-50' : ''}
                  ${revealed && isCorrect && !isSelected ? 'border-green-500 bg-green-50/50' : ''}
                  ${revealed && !isCorrect && !isSelected ? 'opacity-50' : ''}
                `}
              >
                {option.image && (
                  <div className="mb-3 text-5xl text-center">{option.image}</div>
                )}
                <p className="text-xl font-semibold text-center text-foreground">{option.text}</p>

                <AnimatePresence>
                  {revealed && isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2"
                    >
                      {isCorrect ? (
                        <div className="bg-green-500 rounded-full p-2">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                      ) : (
                        <div className="bg-red-500 rounded-full p-2">
                          <X className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        {allowMultiple && !revealed && (
          <div className="flex justify-center">
            <Button
              onClick={() => handleSubmit()}
              disabled={selectedIds.length === 0}
              size="lg"
              className="px-8"
            >
              Submit Answer
            </Button>
          </div>
        )}

        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center mt-6"
            >
              <p className="text-2xl font-bold text-primary">
                {revealed && selectedIds.every(id => isCorrectSelection(id)) && selectedIds.length > 0
                  ? "Perfect! 🎉"
                  : "Good try! Keep learning! 💪"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
