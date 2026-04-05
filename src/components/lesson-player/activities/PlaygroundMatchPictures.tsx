import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';
import { soundEffectsService } from '@/services/soundEffectsService';

interface Props {
  slide: GeneratedSlide;
  onCorrect: () => void;
  onIncorrect?: () => void;
}

export default function PlaygroundMatchPictures({ slide, onCorrect, onIncorrect }: Props) {
  const pairs = slide.content?.matchPairs || [
    { word: 'Apple', image: '🍎' },
    { word: 'Dog', image: '🐕' },
    { word: 'Sun', image: '☀️' },
  ];

  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());

  const shuffledImages = [...pairs].sort(() => Math.random() - 0.5);

  const handleWordClick = (word: string) => {
    if (matched.has(word)) return;
    setSelectedWord(word);
  };

  const handleImageClick = (pair: { word: string; image: string }) => {
    if (!selectedWord || matched.has(pair.word)) return;
    if (selectedWord === pair.word) {
      setMatched((m) => new Set([...m, pair.word]));
      soundEffectsService.playCorrect();
      onCorrect();
      setSelectedWord(null);
    } else {
      soundEffectsService.playIncorrect();
      onIncorrect?.();
      setSelectedWord(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8 w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold" style={{ fontFamily: "'Quicksand', sans-serif", color: '#FF9F1C' }}>
        🧩 {slide.title}
      </h2>

      <div className="grid grid-cols-2 gap-12 w-full">
        {/* Words */}
        <div className="flex flex-col gap-3">
          {pairs.map((p) => (
            <motion.button
              key={p.word}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleWordClick(p.word)}
              className="py-4 px-6 rounded-2xl text-xl font-bold transition-all"
              style={{
                fontFamily: "'Quicksand', sans-serif",
                background: matched.has(p.word) ? '#86efac' : selectedWord === p.word ? '#fbbf24' : '#fef3c7',
                color: '#1a1a2e',
                border: selectedWord === p.word ? '3px solid #f59e0b' : '3px solid transparent',
              }}
              disabled={matched.has(p.word)}
            >
              {p.word} {matched.has(p.word) && '✅'}
            </motion.button>
          ))}
        </div>

        {/* Images */}
        <div className="flex flex-col gap-3">
          {shuffledImages.map((p) => (
            <motion.button
              key={p.image}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleImageClick(p)}
              className="py-4 px-6 rounded-2xl text-4xl transition-all"
              style={{
                background: matched.has(p.word) ? '#86efac' : '#fff7ed',
                border: '3px solid #fdba74',
              }}
              disabled={matched.has(p.word)}
            >
              {p.image}
            </motion.button>
          ))}
        </div>
      </div>

      {matched.size === pairs.length && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-4xl font-bold text-green-500">
          🎉 Perfect Match!
        </motion.div>
      )}
    </div>
  );
}
