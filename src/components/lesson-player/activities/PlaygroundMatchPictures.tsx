import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';
import { soundEffectsService } from '@/services/soundEffectsService';

interface MatchPair {
  word: string;
  image: string; // emoji or image URL
  imageKeywords?: string;
}

interface Props {
  slide: GeneratedSlide;
  onCorrect: () => void;
  onIncorrect?: () => void;
}

export default function PlaygroundMatchPictures({ slide, onCorrect, onIncorrect }: Props) {
  const pairs: MatchPair[] = slide.content?.matchPairs || [
    { word: 'Apple', image: '🍎' },
    { word: 'Dog', image: '🐕' },
    { word: 'Sun', image: '☀️' },
  ];

  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());

  const shuffledImages = useMemo(() => [...pairs].sort(() => Math.random() - 0.5), []);

  const handleWordClick = (word: string) => {
    if (matched.has(word)) return;
    setSelectedWord(word);
    soundEffectsService.playPop?.();
  };

  const handleImageClick = (pair: MatchPair) => {
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

  const isImageUrl = (str: string) => str.startsWith('http') || str.startsWith('data:');

  return (
    <div className="flex flex-col items-center gap-6 p-6 w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold" style={{ fontFamily: "'Quicksand', sans-serif", color: '#FF9F1C' }}>
        🧩 {slide.title}
      </h2>

      <div className="grid grid-cols-2 gap-8 w-full">
        {/* Words Column */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-center text-muted-foreground mb-1">Words</p>
          {pairs.map((p) => (
            <motion.button
              key={p.word}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleWordClick(p.word)}
              className="py-4 px-5 rounded-2xl text-lg font-bold transition-all"
              style={{
                fontFamily: "'Quicksand', sans-serif",
                background: matched.has(p.word) ? '#86efac' : selectedWord === p.word ? '#fbbf24' : '#fef3c7',
                color: '#1a1a2e',
                border: selectedWord === p.word ? '3px solid #f59e0b' : '3px solid transparent',
                opacity: matched.has(p.word) ? 0.7 : 1,
              }}
              disabled={matched.has(p.word)}
            >
              {p.word} {matched.has(p.word) && '✅'}
            </motion.button>
          ))}
        </div>

        {/* Images Column */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-center text-muted-foreground mb-1">Pictures</p>
          {shuffledImages.map((p, idx) => (
            <motion.button
              key={`img-${idx}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleImageClick(p)}
              className="py-3 px-5 rounded-2xl transition-all flex items-center justify-center min-h-[60px]"
              style={{
                background: matched.has(p.word) ? '#86efac' : '#fff7ed',
                border: '3px solid #fdba74',
                opacity: matched.has(p.word) ? 0.7 : 1,
              }}
              disabled={matched.has(p.word)}
            >
              {isImageUrl(p.image) ? (
                <img src={p.image} alt={p.word} className="w-16 h-16 object-contain rounded-xl" />
              ) : (
                <span className="text-4xl">{p.image || '❓'}</span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {matched.size === pairs.length && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-3xl font-bold text-green-500 mt-2">
          🎉 Perfect Match!
        </motion.div>
      )}
    </div>
  );
}
