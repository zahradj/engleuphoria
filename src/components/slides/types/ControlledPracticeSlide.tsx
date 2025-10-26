import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageLoader } from '../ImageLoader';
import { useLessonAssets } from '@/hooks/useLessonAssets';
import { soundEffectsService } from '@/services/soundEffectsService';
import { ConfettiEffect } from '@/components/gamification/ConfettiEffect';
import { Volume2, Shuffle, Lightbulb, CheckCircle2, RotateCcw, Target } from 'lucide-react';

interface ControlledPracticeSlideProps {
  slide: any;
  slideNumber: number;
  onNext?: () => void;
}

interface VocabularyItem {
  word: string;
  imagePrompt: string;
  id: string;
}

export function ControlledPracticeSlide({ slide, slideNumber, onNext }: ControlledPracticeSlideProps) {
  const { generateImage, generateAudio } = useLessonAssets();
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
  const [practicedImages, setPracticedImages] = useState<Set<string>>(new Set());
  const [showAnswer, setShowAnswer] = useState(false);
  const [shuffledVocabulary, setShuffledVocabulary] = useState<VocabularyItem[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [encouragementMessage, setEncouragementMessage] = useState('');

  const encouragements = [
    "Excellent! 🌟",
    "Perfect pronunciation! 👏",
    "You got it! 🎯",
    "Amazing work! ✨",
    "Fantastic! 🎉",
    "Brilliant! 💫"
  ];

  useEffect(() => {
    if (slide.vocabulary) {
      const vocabWithIds = slide.vocabulary.map((item: any, index: number) => ({
        ...item,
        id: `vocab-${index}`
      }));
      setShuffledVocabulary(vocabWithIds);
    }
  }, [slide.vocabulary]);

  const handleImageClick = (index: number) => {
    soundEffectsService.playButtonClick();
    setCurrentImageIndex(index);
    setShowAnswer(false);
    setEncouragementMessage('');
  };

  const handleRevealAnswer = () => {
    soundEffectsService.playButtonClick();
    setShowAnswer(true);
    if (currentImageIndex !== null) {
      const word = shuffledVocabulary[currentImageIndex].word;
      generateAudio(word);
    }
  };

  const handleCorrect = () => {
    if (currentImageIndex !== null) {
      soundEffectsService.playCorrect();
      const vocabId = shuffledVocabulary[currentImageIndex].id;
      setPracticedImages(prev => new Set([...prev, vocabId]));
      
      const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
      setEncouragementMessage(randomEncouragement);
      
      setTimeout(() => {
        setCurrentImageIndex(null);
        setShowAnswer(false);
        setEncouragementMessage('');
        
        // Check if all images practiced
        if (practicedImages.size + 1 === shuffledVocabulary.length) {
          setShowConfetti(true);
          soundEffectsService.playCelebration();
        }
      }, 1500);
    }
  };

  const handleTryAgain = () => {
    soundEffectsService.playIncorrect();
    setShowAnswer(false);
    setEncouragementMessage('');
  };

  const handleShuffle = () => {
    soundEffectsService.playButtonClick();
    const shuffled = [...shuffledVocabulary].sort(() => Math.random() - 0.5);
    setShuffledVocabulary(shuffled);
    setCurrentImageIndex(null);
    setShowAnswer(false);
  };

  const handleReset = () => {
    soundEffectsService.playButtonClick();
    setPracticedImages(new Set());
    setCurrentImageIndex(null);
    setShowAnswer(false);
    setEncouragementMessage('');
  };

  const getFirstSoundHint = () => {
    if (currentImageIndex !== null) {
      const word = shuffledVocabulary[currentImageIndex].word;
      return word.charAt(0).toUpperCase();
    }
    return '';
  };

  const progress = (practicedImages.size / shuffledVocabulary.length) * 100;
  const allPracticed = practicedImages.size === shuffledVocabulary.length;

  return (
    <>
      <ConfettiEffect trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <Card className="border-none shadow-2xl backdrop-blur-sm bg-card/80">
        <CardHeader className="text-center pb-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block mx-auto mb-2 px-4 py-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full"
          >
            <span className="text-sm font-medium text-foreground flex items-center gap-2">
              <Target className="w-4 h-4 text-green-600" />
              🎯 Controlled Practice
            </span>
          </motion.div>
          
          <CardTitle className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {slide.title || "What Is This?"}
          </CardTitle>

          <motion.div 
            className="mt-4 flex items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-sm font-medium text-muted-foreground">
              Progress: {practicedImages.size}/{shuffledVocabulary.length}
            </span>
            <div className="w-48 h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        </CardHeader>

        <CardContent className="space-y-6">
          {slide.instructions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border border-green-200 dark:border-green-800"
            >
              <p className="text-base md:text-lg text-center font-medium text-foreground">
                {slide.instructions}
              </p>
            </motion.div>
          )}

          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {shuffledVocabulary.map((item, index) => {
              const isPracticed = practicedImages.has(item.id);
              const isSelected = currentImageIndex === index;
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: isSelected ? 1 : 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => !isSelected && handleImageClick(index)}
                  className={`relative cursor-pointer rounded-2xl overflow-hidden shadow-lg transition-all ${
                    isSelected 
                      ? 'ring-4 ring-green-500 shadow-2xl' 
                      : isPracticed 
                      ? 'ring-2 ring-emerald-400' 
                      : 'hover:shadow-xl'
                  }`}
                >
                  <div className="aspect-square bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
                    <ImageLoader
                      prompt={item.imagePrompt || `Illustration of the word ${item.word}`}
                      alt={item.word}
                      generateImage={generateImage}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {isPracticed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-2 shadow-lg"
                    >
                      <CheckCircle2 className="w-6 h-6" />
                    </motion.div>
                  )}
                  
                  {!isSelected && !isPracticed && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center p-3">
                      <span className="text-white text-sm font-medium">Tap to Ask</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Interaction Area */}
          <AnimatePresence mode="wait">
            {currentImageIndex !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4 p-6 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl border-2 border-green-300 dark:border-green-700"
              >
                <div className="text-center space-y-3">
                  <motion.h3
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="text-2xl md:text-3xl font-bold text-foreground flex items-center justify-center gap-3"
                  >
                    What is this?
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => generateAudio("What is this?")}
                      className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                    >
                      <Volume2 className="w-5 h-5" />
                    </motion.button>
                  </motion.h3>

                  {!showAnswer && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleRevealAnswer}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
                    >
                      Click to Reveal Answer
                    </motion.button>
                  )}

                  {showAnswer && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="space-y-4"
                    >
                      <div className="text-4xl md:text-5xl font-bold text-green-600 dark:text-green-400 flex items-center justify-center gap-3">
                        {shuffledVocabulary[currentImageIndex].word}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => generateAudio(shuffledVocabulary[currentImageIndex].word)}
                          className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                        >
                          <Volume2 className="w-5 h-5" />
                        </motion.button>
                      </div>

                      {encouragementMessage && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-2xl font-bold text-emerald-600"
                        >
                          {encouragementMessage}
                        </motion.div>
                      )}

                      {!encouragementMessage && (
                        <div className="flex gap-3 justify-center">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCorrect}
                            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                            Correct!
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleTryAgain}
                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg flex items-center gap-2"
                          >
                            <RotateCcw className="w-5 h-5" />
                            Try Again
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* All Practiced Message */}
          {allPracticed && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl text-center space-y-2"
            >
              <h3 className="text-2xl md:text-3xl font-bold">🎉 Great Job!</h3>
              <p className="text-lg">All words practiced! +30 XP</p>
            </motion.div>
          )}

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-3 justify-center pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShuffle}
              className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Shuffle className="w-4 h-4" />
              Shuffle Order
            </motion.button>

            {currentImageIndex !== null && !showAnswer && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  soundEffectsService.playButtonClick();
                  alert(`First sound: "${getFirstSoundHint()}"`);
                }}
                className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                First Sound Hint
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Practice
            </motion.button>

            {allPracticed && onNext && (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  soundEffectsService.playButtonClick();
                  onNext();
                }}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg flex items-center gap-2"
              >
                Continue ➡️
              </motion.button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
