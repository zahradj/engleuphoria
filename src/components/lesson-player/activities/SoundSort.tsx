import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';
import { soundEffectsService } from '@/services/soundEffectsService';

interface Props {
  slide: GeneratedSlide;
  onCorrect: () => void;
  onIncorrect?: () => void;
}

interface WordItem {
  word: string;
  bucket: string;
  sorted: boolean;
}

export default function SoundSort({ slide, onCorrect, onIncorrect }: Props) {
  const phoneme1 = slide.content?.phonemeTarget || '/æ/';
  const phoneme2 = '/ɪ/';

  const initialWords: WordItem[] = [
    { word: 'Apple', bucket: phoneme1, sorted: false },
    { word: 'Ant', bucket: phoneme1, sorted: false },
    { word: 'Axe', bucket: phoneme1, sorted: false },
    { word: 'Igloo', bucket: phoneme2, sorted: false },
    { word: 'Ink', bucket: phoneme2, sorted: false },
    { word: 'Insect', bucket: phoneme2, sorted: false },
  ];

  const [words, setWords] = useState(initialWords);
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ word: string; correct: boolean } | null>(null);
  const [completed, setCompleted] = useState(false);

  const unsortedWords = words.filter(w => !w.sorted);
  const bucket1Words = words.filter(w => w.sorted && w.bucket === phoneme1);
  const bucket2Words = words.filter(w => w.sorted && w.bucket === phoneme2);

  const handleWordTap = useCallback((word: string) => {
    setActiveWord(activeWord === word ? null : word);
  }, [activeWord]);

  const handleBucketDrop = useCallback((bucket: string) => {
    if (!activeWord || completed) return;

    const wordItem = words.find(w => w.word === activeWord);
    if (!wordItem) return;

    const correct = wordItem.bucket === bucket;
    setFeedback({ word: activeWord, correct });

    if (correct) {
      soundEffectsService.playCorrect();
      const updated = words.map(w => w.word === activeWord ? { ...w, sorted: true } : w);
      setWords(updated);

      if (updated.every(w => w.sorted)) {
        setCompleted(true);
        setTimeout(() => onCorrect(), 1000);
      }
    } else {
      soundEffectsService.playIncorrect();
    }

    setActiveWord(null);
    setTimeout(() => setFeedback(null), 800);
  }, [activeWord, words, completed, onCorrect]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-between rounded-3xl p-6 bg-gradient-to-b from-background to-muted/30">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-foreground">🗂 Sound Sort</h2>
        <p className="text-muted-foreground text-sm">Tap a word, then tap the correct bucket</p>
      </div>

      {/* Word cards */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {unsortedWords.map((w, i) => (
          <motion.button
            key={w.word}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => handleWordTap(w.word)}
            className={`px-4 py-3 rounded-xl border-2 text-lg font-bold transition-all ${
              activeWord === w.word
                ? 'border-[#1A237E] bg-[#1A237E]/10 text-[#1A237E] scale-105'
                : 'border-border bg-card text-foreground hover:border-[#1A237E]/30'
            }`}
          >
            {w.word}
          </motion.button>
        ))}
      </div>

      {/* Buckets */}
      <div className="flex gap-4 w-full max-w-lg">
        {[phoneme1, phoneme2].map((bucket) => {
          const bucketWords = words.filter(w => w.sorted && w.bucket === bucket);
          return (
            <motion.button
              key={bucket}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleBucketDrop(bucket)}
              className="flex-1 min-h-[140px] rounded-2xl border-2 border-dashed border-[#1A237E]/30 bg-[#1A237E]/5 p-4 flex flex-col items-center"
            >
              <span className="font-mono text-2xl font-bold text-[#1A237E] mb-2">{bucket}</span>
              <div className="flex flex-wrap gap-1 justify-center">
                {bucketWords.map(w => (
                  <span key={w.word} className="text-xs bg-[#4CAF50]/20 text-[#2E7D32] px-2 py-1 rounded-full font-medium">
                    {w.word}
                  </span>
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`mt-4 px-4 py-2 rounded-xl font-bold ${
              feedback.correct ? 'bg-[#4CAF50]/20 text-[#2E7D32]' : 'bg-[#EF5350]/20 text-[#C62828]'
            }`}
          >
            {feedback.correct ? '✅ Correct!' : '❌ Try again!'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
