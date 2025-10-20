import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface TextInputSlideProps {
  slide: any;
  onComplete?: () => void;
  onNext?: () => void;
  onNameSubmit?: (name: string) => void;
}

export function TextInputSlide({ slide, onComplete, onNext, onNameSubmit }: TextInputSlideProps) {
  const [inputValue, setInputValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      // Save to localStorage and parent state
      localStorage.setItem('esl_student_name', inputValue.trim());
      if (onNameSubmit) {
        onNameSubmit(inputValue.trim());
      }
      setIsSubmitted(true);
      
      // Auto-advance after celebration
      setTimeout(() => {
        onComplete?.();
        onNext?.();
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[500px] p-8"
    >
      <Card className="max-w-2xl w-full p-8 text-center">
        {!isSubmitted ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              <h2 className="text-4xl font-bold mb-4">{slide.prompt || "What's your name?"}</h2>
              <p className="text-lg text-muted-foreground mb-8">
                {slide.instructions || "Type your name below"}
              </p>
            </motion.div>

            <div className="space-y-4">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="My name is..."
                className="text-2xl text-center py-6"
                autoFocus
              />
              
              <Button
                onClick={handleSubmit}
                disabled={!inputValue.trim()}
                size="lg"
                className="w-full text-xl py-6"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Continue
              </Button>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="space-y-4"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-3xl font-bold">
              Nice to meet you, {inputValue}!
            </h3>
            <p className="text-lg text-muted-foreground">
              Let's start learning English together!
            </p>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
