import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';

interface SentenceUnscrambleProps {
  words: string[];
  correctOrder: string[];
  onComplete: (correct: boolean) => void;
  sentence?: string;
}

export function SentenceUnscramble({ words, correctOrder, onComplete, sentence }: SentenceUnscrambleProps) {
  const [shuffledWords, setShuffledWords] = useState(() => [...words].sort(() => Math.random() - 0.5));
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleWordClick = (word: string, fromSelected: boolean) => {
    if (isChecked) return;
    
    if (fromSelected) {
      setSelectedWords(selectedWords.filter(w => w !== word));
      setShuffledWords([...shuffledWords, word]);
    } else {
      setShuffledWords(shuffledWords.filter(w => w !== word));
      setSelectedWords([...selectedWords, word]);
    }
  };

  const checkAnswer = () => {
    const correct = JSON.stringify(selectedWords) === JSON.stringify(correctOrder);
    setIsCorrect(correct);
    setIsChecked(true);
    onComplete(correct);
  };

  const reset = () => {
    setShuffledWords([...words].sort(() => Math.random() - 0.5));
    setSelectedWords([]);
    setIsChecked(false);
    setIsCorrect(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2">Unscramble the Sentence!</h3>
        {sentence && <p className="text-muted-foreground">{sentence}</p>}
      </div>

      {/* Selected Words Area */}
      <Card className="p-6 min-h-[100px] bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-dashed border-primary/30">
        <div className="flex flex-wrap gap-2 justify-center items-center min-h-[60px]">
          {selectedWords.map((word, idx) => (
            <motion.button
              key={`${word}-${idx}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleWordClick(word, true)}
              disabled={isChecked}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold text-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {word}
            </motion.button>
          ))}
        </div>
      </Card>

      {/* Word Bank */}
      <div className="flex flex-wrap gap-3 justify-center">
        {shuffledWords.map((word, idx) => (
          <motion.button
            key={`${word}-${idx}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleWordClick(word, false)}
            disabled={isChecked}
            className="px-4 py-2 bg-card border-2 border-border text-foreground rounded-lg font-semibold text-lg shadow-sm hover:shadow-md hover:border-primary/50 transition-all disabled:opacity-50"
          >
            {word}
          </motion.button>
        ))}
      </div>

      {/* Result & Actions */}
      {isChecked && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className={`flex items-center justify-center gap-2 text-lg font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-6 h-6" />
                Perfect! That's correct!
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6" />
                Not quite. Try again!
              </>
            )}
          </div>
          {!isCorrect && (
            <Button onClick={reset} variant="outline">
              Try Again
            </Button>
          )}
        </motion.div>
      )}

      {!isChecked && selectedWords.length === correctOrder.length && (
        <div className="flex justify-center">
          <Button onClick={checkAnswer} size="lg" className="px-8">
            Check Answer
          </Button>
        </div>
      )}
    </div>
  );
}
