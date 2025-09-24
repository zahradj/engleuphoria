import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slide } from '@/types/slides';
import { motion } from 'framer-motion';

interface WarmUpSlideProps {
  slide: Slide;
  onComplete?: () => void;
  onNext?: () => void;
}

export function WarmUpSlide({ slide, onComplete, onNext }: WarmUpSlideProps) {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const emojis = [
    { id: 'happy', emoji: '😊', action: 'hello', correct: true },
    { id: 'sad', emoji: '😢', action: 'goodbye', correct: false },
    { id: 'wave', emoji: '👋', action: 'hello', correct: true },
    { id: 'bye', emoji: '👋😢', action: 'goodbye', correct: false }
  ];

  const handleEmojiClick = (emoji: typeof emojis[0]) => {
    setSelectedEmoji(emoji.id);
    setIsCorrect(emoji.correct);
    
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 1000);
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">{slide.prompt}</h2>
        <p className="text-lg text-muted-foreground">{slide.instructions}</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="mb-6">
          <CardContent className="p-6">
            <img 
              src={slide.media?.url} 
              alt={slide.media?.alt}
              className="w-full max-w-md mx-auto rounded-lg"
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {emojis.map((emoji) => (
            <motion.div
              key={emoji.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={selectedEmoji === emoji.id ? "default" : "outline"}
                size="lg"
                className="w-full h-20 text-4xl"
                onClick={() => handleEmojiClick(emoji)}
                disabled={selectedEmoji !== null}
              >
                {emoji.emoji}
              </Button>
            </motion.div>
          ))}
        </div>

        {isCorrect !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-6"
          >
            <div className={`text-lg font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? '🎉 Great job!' : '💡 Try again!'}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}