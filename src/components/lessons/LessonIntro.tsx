import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
// VocabularyImage removed - using static emojis instead to avoid AI generation costs
import AnimatedLogo from '@/components/ui/AnimatedLogo';
import { Volume2, ArrowLeft, ArrowRight, RotateCcw, Trophy, Star, Play, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

interface LessonIntroProps {
  onStart: () => void;
}

const LessonIntro: React.FC<LessonIntroProps> = ({ onStart }) => {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ["Hello!", "Hi!", "Greetings!"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const playSound = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 relative overflow-hidden flex items-center justify-center">
      {/* Animated Logo in top right */}
      <div className="absolute top-8 right-8 z-20">
        <AnimatedLogo size="lg" />
      </div>
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-white/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <Card className="relative z-10 w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-lg shadow-2xl border-0">
        <div className="p-12 text-center space-y-8">
          {/* Lesson badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg"
          >
            <BookOpen className="w-6 h-6" />
            Unit 1 • Lesson 1
          </motion.div>

          {/* Main title with animated text */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-6xl font-bold text-gray-800 mb-4">
              My name is{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                ____
              </span>
            </h1>
            <motion.h2 
              className="text-3xl font-semibold text-gray-600"
              key={currentWord}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              {words[currentWord]}
            </motion.h2>
          </motion.div>

          {/* Generated lesson image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w-64 h-64 mx-auto"
          >
            <div className="w-full h-full rounded-2xl shadow-2xl bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
              <span className="text-8xl">👋</span>
            </div>
          </motion.div>

          {/* Learning objectives */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="bg-gray-50 rounded-2xl p-8 space-y-4"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">🎯 What You'll Learn</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {[
                "Greet others and say goodbye",
                "Introduce yourself: My name is...",
                "Ask: What's your name?",
                "Reply politely: Nice to meet you"
              ].map((objective, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                  <span className="text-gray-700 font-medium">{objective}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex gap-6 justify-center"
          >
            <Button
              onClick={() => playSound("Hello! Welcome to your first English lesson!")}
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg border-2 border-purple-500 text-purple-600 hover:bg-purple-50 transition-all duration-300"
            >
              <Volume2 className="mr-3 h-6 w-6" />
              Listen to Welcome
            </Button>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onStart}
                size="lg"
                className="px-12 py-4 text-xl bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 hover:from-blue-600 hover:via-purple-700 hover:to-pink-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Play className="mr-3 h-6 w-6" />
                Start Learning!
              </Button>
            </motion.div>
          </motion.div>

          {/* Duration and level info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="flex justify-center gap-8 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Duration: 30 minutes
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Level: Beginner (A1)
            </div>
          </motion.div>
        </div>
      </Card>
    </div>
  );
};

export default LessonIntro;