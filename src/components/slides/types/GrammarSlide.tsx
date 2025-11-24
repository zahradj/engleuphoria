import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, BookOpen, CheckCircle2, Sparkles, Lightbulb, XCircle } from 'lucide-react';
import { useLessonAssets } from '@/hooks/useLessonAssets';
import { soundEffectsService } from '@/services/soundEffectsService';
import { ImageLoader } from '../ImageLoader';

interface GrammarSlideProps {
  slide: any;
  slideNumber: number;
  onNext?: () => void;
}

export function GrammarSlide({ slide, slideNumber, onNext }: GrammarSlideProps) {
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [selectedExample, setSelectedExample] = useState<number | null>(null);
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<number, any>>({});
  const [checkedExercises, setCheckedExercises] = useState<Set<number>>(new Set());
  const { generateAudio, generateImage } = useLessonAssets();

  const handlePlayExample = async (exampleText: string) => {
    soundEffectsService.playButtonClick();
    if (playingAudio === exampleText) {
      setPlayingAudio(null);
      return;
    }
    setPlayingAudio(exampleText);
    try {
      await generateAudio(exampleText);
    } finally {
      setPlayingAudio(null);
    }
  };

  const handleExampleClick = (index: number) => {
    soundEffectsService.playButtonClick();
    setSelectedExample(selectedExample === index ? null : index);
  };

  const handleExerciseAnswer = (exerciseIndex: number, answer: any) => {
    soundEffectsService.playButtonClick();
    setExerciseAnswers({ ...exerciseAnswers, [exerciseIndex]: answer });
  };

  const handleCheckExercise = (exerciseIndex: number, exercise: any) => {
    const userAnswer = exerciseAnswers[exerciseIndex];
    const isCorrect = userAnswer === exercise.correctAnswer || userAnswer === exercise.correctAnswer.toString();
    
    if (isCorrect) {
      soundEffectsService.playCorrect();
    } else {
      soundEffectsService.playIncorrect();
    }
    
    setCheckedExercises(new Set(checkedExercises).add(exerciseIndex));
  };

  return (
    <Card className="border-none shadow-2xl backdrop-blur-sm bg-card/80">
      <CardHeader className="text-center pb-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-block mx-auto mb-2 px-4 py-1.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full"
        >
          <span className="text-sm font-medium text-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            📝 Grammar Focus
          </span>
        </motion.div>
        
        <CardTitle className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {slide.prompt || slide.title || 'Grammar Focus'}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Instructions */}
        {slide.instructions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200 dark:border-blue-800"
          >
            <p className="text-base md:text-lg text-center font-medium text-foreground">
              {slide.instructions}
            </p>
          </motion.div>
        )}

        {/* Grammar Pattern - Main Focus */}
        {slide.pattern && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="relative p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg overflow-hidden"
          >
            <motion.div
              className="absolute top-0 right-0 text-6xl opacity-10"
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ✨
            </motion.div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-semibold text-white/90">Pattern</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">{slide.pattern}</p>
          </motion.div>
        )}

        {/* Grammar Rule */}
        {slide.rule && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-l-4 border-indigo-500 rounded-xl"
          >
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-indigo-600" />
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">Grammar Rule:</span>
            </div>
            <p className="text-base text-foreground">{slide.rule}</p>
          </motion.div>
        )}

        {/* Examples Section */}
        {slide.examples && Array.isArray(slide.examples) && slide.examples.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              <h4 className="text-xl font-bold text-foreground">Examples:</h4>
            </div>
            
            <div className="space-y-3">
              {slide.examples.map((example: any, index: number) => {
                const exampleText = typeof example === 'string' 
                  ? example 
                  : (example.audio || example.text || example.sentence);
                const isSelected = selectedExample === index;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleExampleClick(index)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-500'
                        : 'bg-card border-border hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            isSelected
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                              : 'bg-secondary text-foreground'
                          }`}
                        >
                          {index + 1}
                        </motion.div>
                        <p className="text-base md:text-lg flex-1 pt-1">
                          {exampleText || JSON.stringify(example)}
                        </p>
                      </div>
                      
                      {exampleText && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayExample(exampleText);
                          }}
                          className={`p-3 rounded-full transition-colors ${
                            playingAudio === exampleText
                              ? 'bg-blue-500 text-white'
                              : 'bg-secondary hover:bg-secondary/80'
                          }`}
                        >
                          <Volume2 
                            className={`w-5 h-5 ${
                              playingAudio === exampleText ? 'animate-pulse' : ''
                            }`} 
                          />
                        </motion.button>
                      )}
                    </div>
                    
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-3 pt-3 border-t border-border"
                        >
                          <p className="text-sm text-muted-foreground italic">
                            ✓ Great example! Notice how the pattern is used here.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Additional Content */}
        {slide.content && typeof slide.content === 'string' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="p-4 bg-muted/50 rounded-xl"
          >
            <p className="text-base leading-relaxed text-foreground">{slide.content}</p>
          </motion.div>
        )}

        {/* Visual Aid if imagePrompt exists */}
        {slide.imagePrompt && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl overflow-hidden shadow-lg"
          >
            <ImageLoader
              prompt={slide.imagePrompt}
              alt="Grammar visualization"
              generateImage={generateImage}
              className="w-full h-64 object-cover"
            />
          </motion.div>
        )}

        {/* Interactive Exercises */}
        {slide.exercises && Array.isArray(slide.exercises) && slide.exercises.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">✏️</span>
              <h4 className="text-xl font-bold text-foreground">Practice Exercises:</h4>
            </div>

            {slide.exercises.map((exercise: any, exIndex: number) => {
              const userAnswer = exerciseAnswers[exIndex];
              const isChecked = checkedExercises.has(exIndex);
              const isCorrect = isChecked && (userAnswer === exercise.correctAnswer || userAnswer === exercise.correctAnswer.toString());

              return (
                <motion.div
                  key={exIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + exIndex * 0.1 }}
                  className={`p-5 rounded-xl border-2 ${
                    isChecked
                      ? isCorrect
                        ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
                        : 'border-red-500 bg-red-50 dark:bg-red-950/30'
                      : 'border-border bg-card'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Question */}
                    <div className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        {exIndex + 1}
                      </span>
                      <div className="flex-1">
                        {exercise.type === 'fill_blank' && (
                          <p className="text-lg font-medium">{exercise.sentence}</p>
                        )}
                        {exercise.type === 'multiple_choice' && (
                          <p className="text-lg font-medium">{exercise.question}</p>
                        )}
                      </div>
                    </div>

                    {/* Options */}
                    {exercise.options && Array.isArray(exercise.options) && (
                      <div className="space-y-2 ml-9">
                        {exercise.options.map((option: any, optIndex: number) => {
                          const optionValue = typeof option === 'string' ? option : option.text || option;
                          const isSelected = userAnswer === optionValue || userAnswer === optIndex;
                          
                          return (
                            <motion.button
                              key={optIndex}
                              whileHover={!isChecked ? { scale: 1.02 } : {}}
                              whileTap={!isChecked ? { scale: 0.98 } : {}}
                              onClick={() => !isChecked && handleExerciseAnswer(exIndex, optionValue)}
                              disabled={isChecked}
                              className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                                isSelected
                                  ? isChecked
                                    ? isCorrect
                                      ? 'border-green-500 bg-green-100 dark:bg-green-900/50'
                                      : 'border-red-500 bg-red-100 dark:bg-red-900/50'
                                    : 'border-primary bg-primary/10'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                  isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'
                                }`}>
                                  {isSelected && (isChecked ? (isCorrect ? '✓' : '✗') : '●')}
                                </span>
                                <span>{optionValue}</span>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    )}

                    {/* Check/Feedback */}
                    {userAnswer && !isChecked && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="ml-9"
                      >
                        <Button
                          size="sm"
                          onClick={() => handleCheckExercise(exIndex, exercise)}
                          className="bg-primary"
                        >
                          Check Answer
                        </Button>
                      </motion.div>
                    )}

                    {isChecked && exercise.feedback && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className={`ml-9 p-3 rounded-lg ${
                          isCorrect 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {isCorrect ? (
                            <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                          )}
                          <p className="text-sm">{exercise.feedback}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Practice Prompt */}
        {(!slide.exercises || slide.exercises.length === 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border-2 border-green-200 dark:border-green-800"
          >
            <p className="text-lg font-semibold mb-2 text-foreground">🎯 Your Turn!</p>
            <p className="text-sm text-muted-foreground">
              Practice the pattern with your teacher. Take your time and don't worry about mistakes!
            </p>
          </motion.div>
        )}

        {/* Continue Button */}
        {onNext && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                soundEffectsService.playButtonClick();
                onNext();
              }}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
            >
              Continue ➡️
            </motion.button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
