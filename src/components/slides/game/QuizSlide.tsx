import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AudioButton } from '@/components/lessons/slides/AudioButton';
import { motion } from 'framer-motion';
import { soundEffectsService } from '@/services/soundEffectsService';
import { cn } from '@/lib/utils';

interface QuizSlideProps {
  prompt: string;
  options: string[];
  correctAnswer: string;
  onCorrect: (score: number) => void;
  onNext: () => void;
}

export function QuizSlide({ prompt, options, correctAnswer, onCorrect, onNext }: QuizSlideProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);

    const isCorrect = answer.toLowerCase() === correctAnswer.toLowerCase();
    
    if (isCorrect) {
      soundEffectsService.playCorrect();
      onCorrect(50);
      setTimeout(() => {
        onNext();
      }, 1500);
    } else {
      soundEffectsService.playIncorrect();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] gap-8 p-8">
      {/* Question */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold">{prompt}</h2>
        <AudioButton text={prompt} />
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option.toLowerCase() === correctAnswer.toLowerCase();
          const showCorrect = showFeedback && isCorrect;
          const showIncorrect = showFeedback && isSelected && !isCorrect;

          return (
            <motion.div
              key={index}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                onClick={() => !showFeedback && handleSelect(option)}
                disabled={showFeedback}
                className={cn(
                  'w-full h-24 text-2xl font-bold transition-all',
                  showCorrect && 'bg-green-500 hover:bg-green-500',
                  showIncorrect && 'bg-red-500 hover:bg-red-500',
                  !showFeedback && 'hover:scale-105'
                )}
                variant={showFeedback ? 'default' : 'outline'}
              >
                {option}
                {showCorrect && ' ✓'}
                {showIncorrect && ' ✗'}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            'text-2xl font-bold p-4 rounded-lg',
            selectedAnswer?.toLowerCase() === correctAnswer.toLowerCase()
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          )}
        >
          {selectedAnswer?.toLowerCase() === correctAnswer.toLowerCase()
            ? '🎉 Correct! Well done!'
            : `Not quite. The answer is: ${correctAnswer}`}
        </motion.div>
      )}
    </div>
  );
}
