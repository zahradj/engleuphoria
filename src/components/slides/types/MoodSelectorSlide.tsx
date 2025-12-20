import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BENNY_THE_BEAR } from '@/constants/mascots';
import { playSound } from '@/constants/soundEffects';

interface MoodSelectorSlideProps {
  slide: {
    title?: string;
    question?: string;
    options?: Array<{
      mood: 'happy' | 'sad';
      label: string;
      emoji: string;
    }>;
    content?: {
      title?: string;
      question?: string;
      options?: Array<{
        mood: 'happy' | 'sad';
        label: string;
        emoji: string;
      }>;
    };
  };
  slideNumber: number;
  onNext?: () => void;
}

const defaultOptions = [
  { mood: 'happy' as const, label: 'Happy', emoji: '☀️' },
  { mood: 'sad' as const, label: 'Sad', emoji: '🌧️' }
];

export function MoodSelectorSlide({ slide, slideNumber, onNext }: MoodSelectorSlideProps) {
  const [selectedMood, setSelectedMood] = useState<'happy' | 'sad' | null>(null);
  const [showResponse, setShowResponse] = useState(false);
  
  const title = slide.content?.title || slide.title || 'How are you feeling today?';
  const question = slide.content?.question || slide.question || 'Tap to tell me!';
  const options = slide.content?.options || slide.options || defaultOptions;
  
  const handleMoodSelect = useCallback((mood: 'happy' | 'sad') => {
    setSelectedMood(mood);
    
    if (mood === 'happy') {
      playSound('happySun');
    } else {
      playSound('sadCloud');
    }
    
    setTimeout(() => {
      setShowResponse(true);
      if (mood === 'happy') {
        playSound('cheer');
      }
    }, 500);
  }, []);
  
  const handleContinue = () => {
    playSound('whoosh');
    onNext?.();
  };
  
  const getResponseMessage = () => {
    if (selectedMood === 'happy') {
      return {
        title: "That's wonderful! 🌟",
        message: `${BENNY_THE_BEAR.name} is happy too!`,
        emoji: '😊'
      };
    } else {
      return {
        title: "It's okay to feel sad 💙",
        message: `${BENNY_THE_BEAR.name} is here to help you feel better!`,
        emoji: '🤗'
      };
    }
  };
  
  return (
    <Card className="w-full h-full min-h-[500px] overflow-hidden relative bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-rose-950/20">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              repeat: Infinity,
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2
            }}
            className="absolute text-4xl"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`
            }}
          >
            {['✨', '💫', '⭐', '🌈'][Math.floor(Math.random() * 4)]}
          </motion.div>
        ))}
      </div>
      
      <CardContent className="p-8 flex flex-col items-center justify-center h-full relative z-10">
        {/* Title */}
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl md:text-4xl font-bold text-center mb-4 text-purple-800 dark:text-purple-200"
        >
          {title}
        </motion.h2>
        
        {/* Question */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-center mb-8 text-purple-700 dark:text-purple-300"
        >
          {selectedMood ? getResponseMessage().title : question}
        </motion.p>
        
        {/* Benny */}
        <motion.div
          animate={selectedMood ? {
            scale: [1, 1.1, 1],
            rotate: selectedMood === 'happy' ? [0, 5, -5, 0] : [0, -3, 3, 0]
          } : {
            y: [0, -5, 0]
          }}
          transition={{
            repeat: Infinity,
            duration: selectedMood ? 1 : 2
          }}
          className="text-7xl mb-8"
        >
          {selectedMood ? getResponseMessage().emoji : BENNY_THE_BEAR.emoji}
        </motion.div>
        
        {/* Mood Options */}
        <AnimatePresence mode="wait">
          {!selectedMood ? (
            <motion.div
              key="options"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex gap-8"
            >
              {options.map((option, index) => (
                <motion.button
                  key={option.mood}
                  onClick={() => handleMoodSelect(option.mood)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-3 p-6 rounded-3xl transition-all cursor-pointer group"
                  style={{
                    background: option.mood === 'happy' 
                      ? 'linear-gradient(135deg, #FEF3C7, #FDE68A)' 
                      : 'linear-gradient(135deg, #DBEAFE, #BFDBFE)'
                  }}
                >
                  <motion.span
                    animate={{
                      y: [0, -8, 0],
                      rotate: option.mood === 'happy' ? [0, 10, 0] : [0, -5, 5, 0]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      delay: index * 0.5
                    }}
                    className="text-7xl"
                  >
                    {option.emoji}
                  </motion.span>
                  <span className="text-xl font-bold text-gray-700">
                    {option.label}
                  </span>
                  
                  {/* Hover glow */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"
                    style={{
                      boxShadow: option.mood === 'happy'
                        ? '0 0 30px rgba(251, 191, 36, 0.5)'
                        : '0 0 30px rgba(96, 165, 250, 0.5)'
                    }}
                  />
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="response"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`text-8xl mb-6 ${selectedMood === 'happy' ? '' : ''}`}
              >
                {selectedMood === 'happy' ? '☀️' : '🌧️'}
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-purple-700 dark:text-purple-300"
              >
                {getResponseMessage().message}
              </motion.p>
              
              {selectedMood === 'sad' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-4 flex justify-center gap-2"
                >
                  {['💙', '🌈', '🤗', '✨'].map((emoji, i) => (
                    <motion.span
                      key={i}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                      className="text-3xl"
                    >
                      {emoji}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Continue Button */}
        {showResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Button
              onClick={handleContinue}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-8 py-6 text-xl rounded-full shadow-lg"
            >
              Continue! ✨
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
