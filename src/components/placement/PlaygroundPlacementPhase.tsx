import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';
import type { TestResult } from './TestPhase';

interface PlaygroundPlacementPhaseProps {
  onComplete: (results: TestResult[]) => void;
}

interface PictureQuestion {
  prompt: string;
  audioPrompt: string; // Spoken version for narration / accessibility
  options: { emoji: string; label: string }[];
  correctIndex: number;
  difficulty: number;
  targetLevel: 'A1' | 'A2' | 'B1';
  feedback: { correct: string; incorrect: string };
}

// Picture-based mini quiz for ages 4-9 (Playground Hub).
// 10 visual questions ordered by gentle progression: colors → animals → actions → simple sentences.
const PICTURE_QUESTIONS: PictureQuestion[] = [
  {
    prompt: 'Which one is a CAT?',
    audioPrompt: 'Tap the cat',
    options: [
      { emoji: '🐶', label: 'Dog' },
      { emoji: '🐱', label: 'Cat' },
      { emoji: '🐰', label: 'Rabbit' },
      { emoji: '🐦', label: 'Bird' },
    ],
    correctIndex: 1,
    difficulty: 0.1,
    targetLevel: 'A1',
    feedback: { correct: 'Yes! Meow! 🐱', incorrect: 'This one is a cat 🐱' },
  },
  {
    prompt: 'Which one is RED?',
    audioPrompt: 'Tap the red one',
    options: [
      { emoji: '🟦', label: 'Blue' },
      { emoji: '🟩', label: 'Green' },
      { emoji: '🟥', label: 'Red' },
      { emoji: '🟨', label: 'Yellow' },
    ],
    correctIndex: 2,
    difficulty: 0.1,
    targetLevel: 'A1',
    feedback: { correct: 'Yes! That is red! 🟥', incorrect: 'This one is red 🟥' },
  },
  {
    prompt: 'Which one is an APPLE?',
    audioPrompt: 'Tap the apple',
    options: [
      { emoji: '🍌', label: 'Banana' },
      { emoji: '🍎', label: 'Apple' },
      { emoji: '🍇', label: 'Grapes' },
      { emoji: '🍊', label: 'Orange' },
    ],
    correctIndex: 1,
    difficulty: 0.15,
    targetLevel: 'A1',
    feedback: { correct: 'Yummy! 🍎', incorrect: 'This one is an apple 🍎' },
  },
  {
    prompt: 'Which one is the SUN?',
    audioPrompt: 'Tap the sun',
    options: [
      { emoji: '🌙', label: 'Moon' },
      { emoji: '⭐', label: 'Star' },
      { emoji: '☁️', label: 'Cloud' },
      { emoji: '☀️', label: 'Sun' },
    ],
    correctIndex: 3,
    difficulty: 0.15,
    targetLevel: 'A1',
    feedback: { correct: 'Bright and warm! ☀️', incorrect: 'This is the sun ☀️' },
  },
  {
    prompt: 'Which one can you DRINK?',
    audioPrompt: 'Tap the one you can drink',
    options: [
      { emoji: '🍕', label: 'Pizza' },
      { emoji: '🥛', label: 'Milk' },
      { emoji: '🍪', label: 'Cookie' },
      { emoji: '🍞', label: 'Bread' },
    ],
    correctIndex: 1,
    difficulty: 0.25,
    targetLevel: 'A1',
    feedback: { correct: 'Yes! We drink milk! 🥛', incorrect: 'We drink milk! 🥛' },
  },
  {
    prompt: 'Which one is JUMPING?',
    audioPrompt: 'Tap the one that is jumping',
    options: [
      { emoji: '🧍', label: 'Standing' },
      { emoji: '🏃', label: 'Running' },
      { emoji: '🤸', label: 'Jumping' },
      { emoji: '😴', label: 'Sleeping' },
    ],
    correctIndex: 2,
    difficulty: 0.35,
    targetLevel: 'A1',
    feedback: { correct: 'Boing! Jumping high! 🤸', incorrect: 'This one is jumping 🤸' },
  },
  {
    prompt: 'How many apples? 🍎🍎🍎',
    audioPrompt: 'Count the apples',
    options: [
      { emoji: '1️⃣', label: 'One' },
      { emoji: '2️⃣', label: 'Two' },
      { emoji: '3️⃣', label: 'Three' },
      { emoji: '4️⃣', label: 'Four' },
    ],
    correctIndex: 2,
    difficulty: 0.4,
    targetLevel: 'A1',
    feedback: { correct: 'Three apples! 🍎🍎🍎', incorrect: 'Count again: 1, 2, 3 🍎🍎🍎' },
  },
  {
    prompt: 'Which sentence is correct?',
    audioPrompt: 'Choose the right sentence',
    options: [
      { emoji: '🐕', label: 'The dog is happy.' },
      { emoji: '🐕', label: 'The dog am happy.' },
      { emoji: '🐕', label: 'The dog be happy.' },
      { emoji: '🐕', label: 'The dog are happy.' },
    ],
    correctIndex: 0,
    difficulty: 0.55,
    targetLevel: 'A2',
    feedback: {
      correct: 'Perfect! "The dog IS happy." ✅',
      incorrect: 'We say "The dog IS happy." 🐕',
    },
  },
  {
    prompt: 'Complete: "I ___ ice cream."',
    audioPrompt: 'Choose the right word',
    options: [
      { emoji: '🍦', label: 'liking' },
      { emoji: '🍦', label: 'like' },
      { emoji: '🍦', label: 'likes' },
      { emoji: '🍦', label: 'liked it' },
    ],
    correctIndex: 1,
    difficulty: 0.65,
    targetLevel: 'A2',
    feedback: {
      correct: 'Yes! "I LIKE ice cream." 🍦',
      incorrect: 'With "I" we say "like": "I like ice cream." 🍦',
    },
  },
  {
    prompt: 'What time is it? 🕒',
    audioPrompt: 'What time is it on the clock?',
    options: [
      { emoji: '🕐', label: 'One o\'clock' },
      { emoji: '🕑', label: 'Two o\'clock' },
      { emoji: '🕒', label: 'Three o\'clock' },
      { emoji: '🕓', label: 'Four o\'clock' },
    ],
    correctIndex: 2,
    difficulty: 0.7,
    targetLevel: 'B1',
    feedback: { correct: 'Three o\'clock! ⏰', incorrect: 'The clock shows three o\'clock 🕒' },
  },
];

export const PlaygroundPlacementPhase = ({ onComplete }: PlaygroundPlacementPhaseProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const current = PICTURE_QUESTIONS[currentIndex];
  const total = PICTURE_QUESTIONS.length;
  const progress = ((currentIndex + (showFeedback ? 1 : 0)) / total) * 100;

  const handleSelect = (optionIndex: number) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(optionIndex);
    setShowFeedback(true);

    const isCorrect = optionIndex === current.correctIndex;
    const result: TestResult = {
      questionIndex: currentIndex,
      selectedOption: optionIndex,
      correctOption: current.correctIndex,
      isCorrect,
      difficulty: current.difficulty,
      targetLevel: current.targetLevel,
    };
    const updatedResults = [...results, result];
    setResults(updatedResults);

    setTimeout(() => {
      if (currentIndex + 1 >= total) {
        onComplete(updatedResults);
      } else {
        setCurrentIndex(currentIndex + 1);
        setSelectedIndex(null);
        setShowFeedback(false);
      }
    }, 1600);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Progress bar — kid-friendly stars */}
      <div className="px-6 pt-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < currentIndex || (i === currentIndex && showFeedback)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-white/20'
                }`}
              />
            ))}
          </div>
          <span className="text-white/70 text-xs font-semibold">
            {currentIndex + 1} / {total}
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-300"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col px-6 pb-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col"
          >
            <div className="text-center mt-4 mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-2">
                {current.prompt}
              </h2>
              <p className="text-white/60 text-sm">{current.audioPrompt}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto w-full">
              {current.options.map((option, idx) => {
                const isSelected = selectedIndex === idx;
                const isCorrectAnswer = idx === current.correctIndex;
                let stateClass =
                  'bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30 hover:scale-105';
                if (showFeedback) {
                  if (isCorrectAnswer) {
                    stateClass =
                      'bg-emerald-400/30 border-emerald-300 ring-4 ring-emerald-300/40 scale-105';
                  } else if (isSelected) {
                    stateClass = 'bg-rose-400/20 border-rose-300/60 opacity-60';
                  } else {
                    stateClass = 'bg-white/5 border-white/10 opacity-50';
                  }
                }

                return (
                  <motion.button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(idx)}
                    disabled={selectedIndex !== null}
                    whileTap={{ scale: 0.95 }}
                    className={`relative aspect-square rounded-3xl border-2 backdrop-blur-md p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${stateClass}`}
                  >
                    <span className="text-5xl md:text-6xl" role="img" aria-label={option.label}>
                      {option.emoji}
                    </span>
                    <span className="text-white font-semibold text-sm md:text-base text-center">
                      {option.label}
                    </span>
                    {showFeedback && isCorrectAnswer && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-emerald-400 flex items-center justify-center shadow-lg"
                      >
                        <Sparkles className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 mx-auto max-w-sm"
                >
                  <div
                    className={`rounded-2xl px-5 py-3 text-center font-semibold backdrop-blur-md border ${
                      selectedIndex === current.correctIndex
                        ? 'bg-emerald-400/20 border-emerald-300/40 text-emerald-100'
                        : 'bg-amber-400/20 border-amber-300/40 text-amber-100'
                    }`}
                  >
                    {selectedIndex === current.correctIndex
                      ? current.feedback.correct
                      : current.feedback.incorrect}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PlaygroundPlacementPhase;
