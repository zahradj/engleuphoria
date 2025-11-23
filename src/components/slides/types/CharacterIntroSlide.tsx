import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface CharacterIntroSlideProps {
  slide: {
    prompt: string;
    instructions?: string;
    characterName?: string;
    characterMessage?: string;
    lessonObjectives?: string[];
    imagePrompt?: string;
  };
  slideNumber: number;
  onNext?: () => void;
}

export function CharacterIntroSlide({ slide, slideNumber, onNext }: CharacterIntroSlideProps) {
  const [showContent, setShowContent] = useState(false);

  const characterName = slide.characterName || 'Max';
  const characterMessage = slide.characterMessage || "Hi! I'm Max, and I'll be your learning buddy today! Let's have fun learning English together! 🎉";

  useEffect(() => {
    setTimeout(() => setShowContent(true), 300);
  }, []);

  return (
    <div className="space-y-6">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold text-primary mb-4">{slide.prompt}</h1>
        {slide.instructions && (
          <p className="text-xl text-muted-foreground">{slide.instructions}</p>
        )}
      </motion.div>

      {showContent && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Character Introduction */}
          <Card className="bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 border-2 border-purple-300">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Character Avatar */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', bounce: 0.6, delay: 0.4 }}
                  className="flex-shrink-0"
                >
                  <div className="w-32 h-32 rounded-full bg-white border-4 border-purple-400 flex items-center justify-center text-6xl shadow-lg">
                    😊
                  </div>
                </motion.div>

                {/* Character Message */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex-1"
                >
                  <div className="bg-white rounded-2xl rounded-tl-none p-6 shadow-md">
                    <h3 className="text-2xl font-bold text-purple-600 mb-3">
                      {characterName}
                    </h3>
                    <p className="text-lg leading-relaxed">{characterMessage}</p>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Objectives */}
          {slide.lessonObjectives && slide.lessonObjectives.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-6 h-6 text-blue-600" />
                    <h3 className="text-2xl font-bold text-blue-700">
                      Today's Learning Goals 🎯
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {slide.lessonObjectives.map((objective, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0 + idx * 0.1 }}
                        className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm"
                      >
                        <Sparkles className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                        <span className="text-base">{objective}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Motivational Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300">
              <CardContent className="p-6">
                <p className="text-xl font-bold text-yellow-700 mb-2">
                  ✨ Get ready for an amazing lesson! ✨
                </p>
                <p className="text-yellow-600">
                  Remember: Every mistake is a step closer to success!
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Start Button */}
          {onNext && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 }}
            >
              <Button
                onClick={onNext}
                size="lg"
                className="w-full text-xl py-6"
              >
                Let's Start Learning! 🚀
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
