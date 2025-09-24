import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Home, Award } from 'lucide-react';
import { Slide, LessonSlides } from '@/types/slides';
import { SlideRenderer } from './SlideRenderer';
import { motion, AnimatePresence } from 'framer-motion';

interface LessonPlayerProps {
  lessonData: LessonSlides;
  onComplete?: () => void;
  onExit?: () => void;
}

export function LessonPlayer({ lessonData, onComplete, onExit }: LessonPlayerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [completedSlides, setCompletedSlides] = useState<Set<number>>(new Set());
  const [startTime] = useState(Date.now());

  const currentSlide = lessonData.slides[currentSlideIndex];
  const totalSlides = lessonData.slides.length;
  const progress = ((currentSlideIndex + 1) / totalSlides) * 100;

  const goToNextSlide = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCompletedSlides(prev => new Set([...prev, currentSlideIndex]));
      setCurrentSlideIndex(prev => prev + 1);
    } else {
      handleLessonComplete();
    }
  };

  const goToPreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const handleLessonComplete = () => {
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    
    // Log completion analytics
    console.log(`Lesson completed in ${duration} seconds`);
    
    if (onComplete) {
      onComplete();
    }
  };

  const handleSlideComplete = () => {
    setCompletedSlides(prev => new Set([...prev, currentSlideIndex]));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      {/* Header */}
      <div className="bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onExit}>
                <Home className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Module {lessonData.metadata.module}, Lesson {lessonData.metadata.lesson}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {lessonData.metadata.CEFR} • {lessonData.durationMin} minutes
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {currentSlideIndex + 1} / {totalSlides}
              </div>
              <div className="w-32">
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlideIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[600px]"
              >
                <SlideRenderer 
                  slide={currentSlide}
                  onComplete={handleSlideComplete}
                  onNext={goToNextSlide}
                />
              </motion.div>
            </AnimatePresence>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6">
            <Button 
              variant="outline" 
              onClick={goToPreviousSlide}
              disabled={currentSlideIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              {lessonData.slides.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlideIndex
                      ? 'bg-primary'
                      : completedSlides.has(index)
                      ? 'bg-green-500'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <Button 
              onClick={goToNextSlide}
              className="bg-primary hover:bg-primary/90"
            >
              {currentSlideIndex === totalSlides - 1 ? (
                <>
                  Complete
                  <Award className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}