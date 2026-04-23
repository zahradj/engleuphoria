import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';
import { Search, Check, X } from 'lucide-react';

interface LetterHuntProps {
  slide: GeneratedSlide;
  onCorrect?: () => void;
  onIncorrect?: () => void;
}

/**
 * LetterHunt — Writing Variant Activity
 * Ghost Vector with missing letter — student types the correct letter to "unlock" the color.
 */
const LetterHunt: React.FC<LetterHuntProps> = ({ slide, onCorrect, onIncorrect }) => {
  const [inputLetter, setInputLetter] = useState('');
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const targetWord = slide.content?.word || 'Lion';
  const missingIndex = slide.content?.targetLetterIndex ?? 0;
  const correctLetter = targetWord[missingIndex]?.toLowerCase() || 'l';
  const imageUrl = slide.content?.imageUrl || slide.imageUrl;

  const displayWord = targetWord.split('').map((char, i) => ({
    char,
    isMissing: i === missingIndex,
  }));

  const handleSubmit = useCallback(() => {
    if (!inputLetter) return;
    setAttempts(prev => prev + 1);

    if (inputLetter.toLowerCase() === correctLetter) {
      setResult('correct');
      setIsUnlocked(true);
      onCorrect?.();
    } else {
      setResult('incorrect');
      onIncorrect?.();
      setTimeout(() => {
        setResult(null);
        setInputLetter('');
      }, 1000);
    }
  }, [inputLetter, correctLetter, onCorrect, onIncorrect]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  }, [handleSubmit]);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-[#6B21A8] font-inter flex items-center justify-center gap-2">
          <Search className="h-5 w-5" />
          Letter Hunt
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Find the missing letter to unlock the image!
        </p>
      </div>

      {/* Ghost Vector Image */}
      <motion.div
        className={`w-40 h-40 rounded-2xl overflow-hidden border-2 transition-all ${
          isUnlocked ? 'border-[#2E7D32]' : 'border-[#6B21A8]/20'
        }`}
        animate={isUnlocked ? { filter: 'grayscale(0)' } : { filter: 'grayscale(1)' }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={isUnlocked ? targetWord : 'Mystery'}
            className="w-full h-full object-cover transition-all"
            style={{ opacity: isUnlocked ? 1 : 0.3 }}
          />
        ) : (
          <div className="w-full h-full bg-muted/20 flex items-center justify-center">
            <span className="text-4xl" style={{ filter: isUnlocked ? 'none' : 'grayscale(1)' }}>
              {isUnlocked ? '🦁' : '❓'}
            </span>
          </div>
        )}
      </motion.div>

      {/* Word with missing letter */}
      <div className="flex items-center gap-1">
        {displayWord.map((item, idx) => (
          <motion.div
            key={idx}
            className={`w-12 h-14 flex items-center justify-center rounded-lg text-2xl font-bold font-inter ${
              item.isMissing
                ? result === 'correct'
                  ? 'bg-[#2E7D32]/10 border-2 border-[#2E7D32] text-[#2E7D32]'
                  : result === 'incorrect'
                  ? 'bg-[#EF5350]/10 border-2 border-[#EF5350] text-[#EF5350]'
                  : 'bg-[#6B21A8]/5 border-2 border-dashed border-[#6B21A8]/40 text-[#6B21A8]'
                : 'bg-card border border-border text-[#6B21A8]'
            }`}
            animate={
              item.isMissing && result === 'incorrect'
                ? { x: [0, -4, 4, -4, 4, 0] }
                : {}
            }
            transition={{ duration: 0.4 }}
          >
            {item.isMissing ? (
              isUnlocked ? (
                item.char.toUpperCase()
              ) : (
                <input
                  type="text"
                  maxLength={1}
                  value={inputLetter}
                  onChange={e => setInputLetter(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full h-full text-center bg-transparent outline-none text-2xl font-bold uppercase"
                  autoFocus
                  disabled={isUnlocked}
                />
              )
            ) : (
              item.char.toUpperCase()
            )}
          </motion.div>
        ))}
      </div>

      {/* Submit / Result */}
      {!isUnlocked && (
        <button
          onClick={handleSubmit}
          disabled={!inputLetter}
          className="px-6 py-2.5 bg-[#6B21A8] text-white rounded-xl font-medium shadow hover:bg-[#6B21A8]/90 disabled:opacity-40 transition"
        >
          Check Letter
        </button>
      )}

      <AnimatePresence>
        {isUnlocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-[#2E7D32]"
          >
            <Check className="h-5 w-5" />
            <span className="text-sm font-medium">
              Image unlocked! The word is <strong>{targetWord}</strong>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {attempts > 0 && !isUnlocked && (
        <p className="text-xs text-muted-foreground">
          Attempts: {attempts} — Keep trying!
        </p>
      )}
    </div>
  );
};

export default LetterHunt;
