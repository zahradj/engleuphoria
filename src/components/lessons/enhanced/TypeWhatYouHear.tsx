import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Volume2, CheckCircle2, XCircle } from 'lucide-react';
import { ttsService } from '@/services/ttsService';

interface TypeWhatYouHearProps {
  text: string;
  voice?: string;
  onComplete: (correct: boolean) => void;
  hint?: string;
}

export function TypeWhatYouHear({ text, voice = 'nova', onComplete, hint }: TypeWhatYouHearProps) {
  const [userInput, setUserInput] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = async () => {
    if (isPlaying) return;
    try {
      setIsPlaying(true);
      const audioUrl = await ttsService.generateSpeech(text, voice);
      await ttsService.playAudio(audioUrl);
    } catch (error) {
      console.error('Audio playback failed:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const checkAnswer = () => {
    const correct = userInput.trim().toLowerCase() === text.trim().toLowerCase();
    setIsCorrect(correct);
    setIsChecked(true);
    onComplete(correct);
  };

  const reset = () => {
    setUserInput('');
    setIsChecked(false);
    setIsCorrect(false);
  };

  return (
    <Card className="p-8 max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-foreground">Type What You Hear!</h3>
        <p className="text-muted-foreground">Listen carefully and type the word or phrase</p>
      </div>

      {/* Audio Button */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={playAudio}
          disabled={isPlaying}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all flex items-center justify-center disabled:opacity-50"
        >
          <Volume2 className="w-12 h-12" />
        </motion.button>
      </div>

      {/* Input Field */}
      <div className="space-y-2">
        <Input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isChecked && userInput.trim() && checkAnswer()}
          placeholder="Type here..."
          disabled={isChecked}
          className="text-xl text-center py-6"
        />
        {hint && !isChecked && (
          <p className="text-sm text-muted-foreground text-center">Hint: {hint}</p>
        )}
      </div>

      {/* Result */}
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
                Perfect! You got it!
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6" />
                Not quite. The answer was: "{text}"
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

      {/* Check Button */}
      {!isChecked && userInput.trim() && (
        <div className="flex justify-center">
          <Button onClick={checkAnswer} size="lg" className="px-8">
            Check Answer
          </Button>
        </div>
      )}
    </Card>
  );
}
