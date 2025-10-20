import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface FeelingsMatchSlideProps {
  slide: any;
  onComplete?: () => void;
  onNext?: () => void;
}

const FEELINGS = [
  { emoji: '😄', word: 'happy', color: 'bg-yellow-100 border-yellow-300' },
  { emoji: '😢', word: 'sad', color: 'bg-blue-100 border-blue-300' },
  { emoji: '🙂', word: 'good', color: 'bg-green-100 border-green-300' },
];

export function FeelingsMatchSlide({ slide, onComplete, onNext }: FeelingsMatchSlideProps) {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const handleEmojiClick = (emoji: string) => {
    if (matchedPairs.includes(emoji)) return;
    setSelectedEmoji(emoji);
    
    if (selectedWord) {
      checkMatch(emoji, selectedWord);
    }
  };

  const handleWordClick = (word: string) => {
    if (matchedPairs.includes(word)) return;
    setSelectedWord(word);
    
    if (selectedEmoji) {
      checkMatch(selectedEmoji, word);
    }
  };

  const checkMatch = (emoji: string, word: string) => {
    const feeling = FEELINGS.find(f => f.emoji === emoji);
    
    if (feeling && feeling.word === word) {
      // Correct match!
      setMatchedPairs([...matchedPairs, emoji, word]);
      setScore(score + 1);
      toast.success('Great job! 🌟', { description: `${emoji} = ${word}` });
      
      setSelectedEmoji(null);
      setSelectedWord(null);
      
      // Check if all matched
      if (matchedPairs.length + 2 === FEELINGS.length * 2) {
        setTimeout(() => {
          onComplete?.();
          onNext?.();
        }, 1500);
      }
    } else {
      // Wrong match
      toast.error('Try again! 💪');
      setSelectedEmoji(null);
      setSelectedWord(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[500px] p-8"
    >
      <Card className="max-w-4xl w-full p-8">
        <h2 className="text-3xl font-bold text-center mb-2">
          {slide.prompt || 'Match the Feelings!'}
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          Click an emoji, then click the matching word
        </p>

        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Emojis Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center mb-4">Emojis</h3>
            {FEELINGS.map((feeling) => (
              <motion.button
                key={feeling.emoji}
                onClick={() => handleEmojiClick(feeling.emoji)}
                disabled={matchedPairs.includes(feeling.emoji)}
                className={`w-full p-6 rounded-xl border-4 transition-all ${
                  matchedPairs.includes(feeling.emoji)
                    ? 'opacity-30 cursor-not-allowed bg-gray-100'
                    : selectedEmoji === feeling.emoji
                    ? 'border-primary scale-105 shadow-lg'
                    : feeling.color
                }`}
                whileHover={{ scale: matchedPairs.includes(feeling.emoji) ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-6xl">{feeling.emoji}</div>
              </motion.button>
            ))}
          </div>

          {/* Words Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center mb-4">Words</h3>
            {FEELINGS.map((feeling) => (
              <motion.button
                key={feeling.word}
                onClick={() => handleWordClick(feeling.word)}
                disabled={matchedPairs.includes(feeling.word)}
                className={`w-full p-6 rounded-xl border-4 transition-all ${
                  matchedPairs.includes(feeling.word)
                    ? 'opacity-30 cursor-not-allowed bg-gray-100'
                    : selectedWord === feeling.word
                    ? 'border-primary scale-105 shadow-lg'
                    : feeling.color
                }`}
                whileHover={{ scale: matchedPairs.includes(feeling.word) ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-3xl font-bold">{feeling.word}</div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-2xl font-bold">Score: {score} / {FEELINGS.length}</p>
        </div>
      </Card>
    </motion.div>
  );
}
