import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';
import { soundEffectsService } from '@/services/soundEffectsService';

interface TimeAttackProps {
  slide: GeneratedSlide;
  onCorrect: () => void;
  onIncorrect?: () => void;
}

export default function TimeAttack({ slide, onCorrect, onIncorrect }: TimeAttackProps) {
  const pairs = slide.content?.matchPairs || [
    { word: 'Hello', image: 'Bonjour' },
    { word: 'Goodbye', image: 'Au revoir' },
    { word: 'Please', image: 'S\'il vous plaît' },
    { word: 'Thank you', image: 'Merci' },
  ];

  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);

  const buildOptions = useCallback((idx: number) => {
    const correct = pairs[idx % pairs.length].image;
    const wrong = pairs
      .filter((_, i) => i !== idx % pairs.length)
      .map((p) => p.image)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    return [correct, ...wrong].sort(() => Math.random() - 0.5);
  }, [pairs]);

  useEffect(() => {
    setOptions(buildOptions(0));
  }, []);

  useEffect(() => {
    if (gameOver) return;
    if (timeLeft <= 0) {
      setGameOver(true);
      if (score > 0) onCorrect();
      return;
    }
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, gameOver]);

  useEffect(() => {
    if (timeLeft <= 5 && timeLeft > 0 && !gameOver) {
      soundEffectsService.playTimerWarning();
    }
  }, [timeLeft, gameOver]);

  const handleAnswer = (ans: string) => {
    if (gameOver) return;
    const correct = pairs[currentIdx % pairs.length].image;
    if (ans === correct) {
      setScore((s) => s + 1);
      soundEffectsService.playCorrect();
    } else {
      soundEffectsService.playIncorrect();
    }
    const next = currentIdx + 1;
    setCurrentIdx(next);
    setOptions(buildOptions(next));
  };

  const timerPct = (timeLeft / 30) * 100;
  const currentWord = pairs[currentIdx % pairs.length]?.word || '';

  if (gameOver) {
    return (
      <div className="flex flex-col items-center gap-4 p-8 text-center">
        <span className="text-5xl">⏱️</span>
        <h3 className="text-2xl font-bold">Time's Up!</h3>
        <p className="text-lg opacity-70">You matched <strong>{score}</strong> words!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 p-8 w-full">
      <div className="flex items-center justify-between w-full">
        <span className="text-sm font-bold uppercase tracking-widest opacity-60">⚡ Time Attack</span>
        <span className="font-bold text-lg">{score} pts</span>
      </div>

      {/* Timer bar */}
      <div className="w-full h-2 rounded-full overflow-hidden bg-black/10">
        <motion.div
          className="h-full rounded-full"
          style={{ background: timeLeft <= 5 ? '#FF4B4B' : '#58CC02' }}
          animate={{ width: `${timerPct}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <motion.div
        key={currentIdx}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-3xl font-bold py-6"
      >
        {currentWord}
      </motion.div>

      <div className="grid grid-cols-2 gap-3 w-full">
        {options.map((opt) => (
          <motion.button
            key={`${currentIdx}-${opt}`}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAnswer(opt)}
            className="py-4 rounded-xl font-semibold text-base border-2 transition-all"
            style={{
              borderColor: '#6366f1',
              background: 'rgba(99,102,241,0.08)',
              color: '#4338ca',
              boxShadow: '0 2px 0 #4338ca',
            }}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
