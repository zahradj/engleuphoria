import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';
import type { TestResult } from './TestPhase';

interface PlaygroundPlacementPhaseProps {
  onComplete: (results: TestResult[]) => void;
}

interface PictureOption {
  image: string;
  label: string;
}

interface PictureQuestion {
  prompt: string;
  audioPrompt: string;
  options: PictureOption[];
  correctIndex: number;
  difficulty: number;
  targetLevel: 'A1' | 'A2' | 'B1';
}

// Picture-based mini quiz for ages 4-9 (Playground Hub).
// Real flat illustrations served from /public/placement/
const img = (name: string) => `/placement/${name}`;

const PICTURE_QUESTIONS: PictureQuestion[] = [
  {
    prompt: 'Which one is a CAT?',
    audioPrompt: 'Tap the cat',
    options: [
      { image: img('dog.png'), label: 'Dog' },
      { image: img('cat.png'), label: 'Cat' },
      { image: img('rabbit.png'), label: 'Rabbit' },
      { image: img('bird.png'), label: 'Bird' },
    ],
    correctIndex: 1,
    difficulty: 0.1,
    targetLevel: 'A1',
  },
  {
    prompt: 'Which one is RED?',
    audioPrompt: 'Tap the red one',
    options: [
      { image: img('blue.png'), label: 'Blue' },
      { image: img('green.png'), label: 'Green' },
      { image: img('red.png'), label: 'Red' },
      { image: img('yellow.png'), label: 'Yellow' },
    ],
    correctIndex: 2,
    difficulty: 0.1,
    targetLevel: 'A1',
  },
  {
    prompt: 'Which one is an APPLE?',
    audioPrompt: 'Tap the apple',
    options: [
      { image: img('banana.png'), label: 'Banana' },
      { image: img('apple.png'), label: 'Apple' },
      { image: img('grapes.png'), label: 'Grapes' },
      { image: img('orange.png'), label: 'Orange' },
    ],
    correctIndex: 1,
    difficulty: 0.15,
    targetLevel: 'A1',
  },
  {
    prompt: 'Which one is the SUN?',
    audioPrompt: 'Tap the sun',
    options: [
      { image: img('moon.png'), label: 'Moon' },
      { image: img('star.png'), label: 'Star' },
      { image: img('cloud.png'), label: 'Cloud' },
      { image: img('sun.png'), label: 'Sun' },
    ],
    correctIndex: 3,
    difficulty: 0.15,
    targetLevel: 'A1',
  },
  {
    prompt: 'Which one can you DRINK?',
    audioPrompt: 'Tap the one you can drink',
    options: [
      { image: img('pizza.png'), label: 'Pizza' },
      { image: img('milk.png'), label: 'Milk' },
      { image: img('cookie.png'), label: 'Cookie' },
      { image: img('bread.png'), label: 'Bread' },
    ],
    correctIndex: 1,
    difficulty: 0.25,
    targetLevel: 'A1',
  },
  {
    prompt: 'Which one is JUMPING?',
    audioPrompt: 'Tap the one that is jumping',
    options: [
      { image: img('standing.png'), label: 'Standing' },
      { image: img('running.png'), label: 'Running' },
      { image: img('jumping.png'), label: 'Jumping' },
      { image: img('sleeping.png'), label: 'Sleeping' },
    ],
    correctIndex: 2,
    difficulty: 0.35,
    targetLevel: 'A1',
  },
  {
    prompt: 'How many apples?',
    audioPrompt: 'Count the apples and tap the right number',
    options: [
      { image: img('count-1.png'), label: 'One' },
      { image: img('count-2.png'), label: 'Two' },
      { image: img('count-3.png'), label: 'Three' },
      { image: img('count-4.png'), label: 'Four' },
    ],
    correctIndex: 2,
    difficulty: 0.4,
    targetLevel: 'A1',
  },
  {
    prompt: 'Which sentence is correct?',
    audioPrompt: 'Choose the right sentence',
    options: [
      { image: img('happy-dog.png'), label: 'The dog is happy.' },
      { image: img('happy-dog.png'), label: 'The dog am happy.' },
      { image: img('happy-dog.png'), label: 'The dog be happy.' },
      { image: img('happy-dog.png'), label: 'The dog are happy.' },
    ],
    correctIndex: 0,
    difficulty: 0.55,
    targetLevel: 'A2',
  },
  {
    prompt: 'Complete: "I ___ ice cream."',
    audioPrompt: 'Choose the right word',
    options: [
      { image: img('ice-cream.png'), label: 'liking' },
      { image: img('ice-cream.png'), label: 'like' },
      { image: img('ice-cream.png'), label: 'likes' },
      { image: img('ice-cream.png'), label: 'liked it' },
    ],
    correctIndex: 1,
    difficulty: 0.65,
    targetLevel: 'A2',
  },
  {
    prompt: 'Which clock shows THREE o\'clock?',
    audioPrompt: 'Find the clock that shows three o\'clock',
    options: [
      { image: img('clock-1.svg'), label: 'One o\'clock' },
      { image: img('clock-2.svg'), label: 'Two o\'clock' },
      { image: img('clock-3.svg'), label: 'Three o\'clock' },
      { image: img('clock-4.svg'), label: 'Four o\'clock' },
    ],
    correctIndex: 2,
    difficulty: 0.7,
    targetLevel: 'B1',
  },
];

const ENCOURAGEMENTS = [
  'Great choice! ✨',
  'Awesome! Keep going! 🌟',
  'Nice work! 🎉',
  'You\'re doing great! 💫',
  'Wonderful! ⭐',
];

export const PlaygroundPlacementPhase = ({ onComplete }: PlaygroundPlacementPhaseProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [results, setResults] = useState<TestResult[]>([]);

  const current = PICTURE_QUESTIONS[currentIndex];
  const total = PICTURE_QUESTIONS.length;
  const progress = ((currentIndex + (selectedIndex !== null ? 1 : 0)) / total) * 100;
  const encouragement = ENCOURAGEMENTS[currentIndex % ENCOURAGEMENTS.length];

  const handleSelect = (optionIndex: number) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(optionIndex);

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
      }
    }, 1100);
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
                  i < currentIndex || (i === currentIndex && selectedIndex !== null)
                    ? 'text-amber-500 fill-amber-400'
                    : 'text-amber-200'
                }`}
              />
            ))}
          </div>
          <span className="text-slate-600 text-xs font-semibold">
            {currentIndex + 1} / {total}
          </span>
        </div>
        <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Question with horizontal slide between questions */}
      <div className="flex-1 flex flex-col px-4 sm:px-6 pb-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex-1 flex flex-col"
          >
            <div className="text-center mt-4 mb-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 leading-tight mb-2">
                {current.prompt}
              </h2>
              <p className="text-slate-500 text-sm">{current.audioPrompt}</p>
            </div>

            {(() => {
              const uniqueImages = new Set(current.options.map(o => o.image));
              const showLabels = uniqueImages.size < current.options.length;
              return (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto w-full" key="opts">
              {current.options.map((option, idx) => {
                const isSelected = selectedIndex === idx;
                const showSelected = isSelected;

                return (
                  <motion.button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(idx)}
                    disabled={selectedIndex !== null}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      delay: idx * 0.08,
                      type: 'spring',
                      stiffness: 300,
                      damping: 22,
                    }}
                    whileHover={selectedIndex === null ? { scale: 1.05, y: -5 } : undefined}
                    whileTap={selectedIndex === null ? { scale: 0.95 } : undefined}
                    aria-label={option.label}
                    aria-pressed={isSelected}
                    className={`relative aspect-square rounded-2xl overflow-hidden bg-white border shadow-md transition-shadow duration-200 ${
                      showSelected
                        ? 'border-orange-300 ring-4 ring-orange-400 shadow-lg'
                        : selectedIndex !== null
                        ? 'border-slate-200 opacity-70'
                        : 'border-slate-200 hover:shadow-lg'
                    }`}
                  >
                    <img
                      src={option.image}
                      alt={option.label}
                      loading="lazy"
                      width={512}
                      height={512}
                      className="absolute inset-0 w-full h-full object-contain p-4 select-none pointer-events-none"
                      draggable={false}
                    />
                    {/* Pop badge on tap (non-punishing — appears for any selection) */}
                    {showSelected && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-orange-400 flex items-center justify-center shadow-lg"
                      >
                        <Sparkles className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Non-punishing encouragement — shown for any tap */}
            <AnimatePresence>
              {selectedIndex !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 mx-auto max-w-sm"
                >
                  <div className="rounded-2xl px-5 py-3 text-center font-semibold bg-orange-50 border border-orange-200 text-orange-700">
                    {encouragement}
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
