import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Volume2, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Media, Option, Slide, LessonSlides } from '@/types/slides';
import { useA11y } from '@/utils/accessibility';
import { MatchPairs } from './interactive/MatchPairs';
import { DragDropMatch } from './interactive/DragDropMatch';
import { WordPairDragDrop } from './interactive/WordPairDragDrop';
import { ClozeActivity } from './interactive/ClozeActivity';
import { FastMatchGame } from './game/FastMatchGame';
import { MemoryFlipGame } from './game/MemoryFlipGame';
import { SpellingRaceGame } from './game/SpellingRaceGame';
import { SlideTransition } from './animations/SlideTransition';
import { AnimatedElement, StaggeredList } from './animations/SlideElements';
import { EnhancedMediaRenderer } from './media/EnhancedMediaRenderer';
import { AnimatedBackground } from './background/AnimatedBackground';
import { InteractiveFeedback } from './interactive/InteractiveFeedback';
import { motion } from 'framer-motion';
export interface SlideMasterProps {
  slide: Slide;
  currentSlide: number;
  totalSlides: number;
  isTeacher?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  onOptionSelect?: (optionId: string) => void;
  onActivityResult?: (result: {
    itemId: string;
    correct: boolean;
    timeMs: number;
    attempts: number;
    tags: string[];
    cefr: string;
    accuracyPercent?: number;
    fluency?: {
      secondsSpoken?: number;
      wpm?: number;
      hesitations?: number;
    };
  }) => void;
  selectedOptions?: string[];
  showFeedback?: boolean;
  isCorrect?: boolean;
  timeElapsed?: number;
  level?: string;
}
export function SlideMaster({
  slide,
  currentSlide,
  totalSlides,
  isTeacher = false,
  onNext,
  onPrevious,
  onOptionSelect,
  onActivityResult,
  selectedOptions = [],
  showFeedback = false,
  isCorrect,
  timeElapsed = 0,
  level = 'A1'
}: SlideMasterProps) {
  const { announce } = useA11y();
  const progress = (currentSlide + 1) / totalSlides * 100;
  const [showInteractiveFeedback, setShowInteractiveFeedback] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'next' | 'previous'>('next');

  // Handle feedback display
  useEffect(() => {
    if (showFeedback) {
      setShowInteractiveFeedback(true);
      const timer = setTimeout(() => setShowInteractiveFeedback(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [showFeedback]);

  // Track slide direction for transitions
  const handleNext = () => {
    setSlideDirection('next');
    onNext?.();
  };

  const handlePrevious = () => {
    setSlideDirection('previous');
    onPrevious?.();
  };

  // Announce slide changes to screen readers
  useEffect(() => {
    const slideAnnouncement = `Slide ${currentSlide + 1} of ${totalSlides}. ${slide.prompt}${slide.instructions ? '. ' + slide.instructions : ''}`;
    announce(slideAnnouncement, 'polite');
  }, [currentSlide, slide.prompt, slide.instructions, totalSlides, announce]);
  const getSlideTheme = () => {
    switch (slide.type) {
      case 'vocabulary_preview':
      case 'target_language': return 'ocean';
      case 'grammar_focus':
      case 'sentence_builder': return 'forest';
      case 'picture_description':
      case 'picture_choice': return 'sunset';
      case 'listening_comprehension':
      case 'pronunciation_shadow': return 'space';
      default: return 'default';
    }
  };
  const renderOptions = () => {
    if (!slide.options) return null;
    
    const optionElements = slide.options.map((option, index) => {
      const isSelected = selectedOptions.includes(option.id);
      const showCorrectness = showFeedback && option.isCorrect !== undefined;
      
      return (
        <motion.div
          key={option.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Button 
            variant={isSelected ? "default" : "outline"} 
            size="lg" 
            className={cn(
              "min-h-[60px] p-4 text-left justify-start relative mobile-touch-target w-full", 
              "transition-all duration-300 text-wrap", 
              showCorrectness && option.isCorrect && "bg-success-soft border-success text-success-on", 
              showCorrectness && !option.isCorrect && isSelected && "bg-error-soft border-error text-error-on", 
              "focus:ring-2 focus:ring-focus-ring focus:ring-offset-2",
              "backdrop-blur-sm bg-surface/80 border-border/60"
            )} 
            onClick={() => onOptionSelect?.(option.id)} 
            disabled={showFeedback}
            aria-label={`Option: ${option.text}${isSelected ? ', selected' : ''}${showCorrectness ? (option.isCorrect ? ', correct answer' : isSelected ? ', incorrect' : '') : ''}`}
            role="button"
          >
            {option.image && (
              <motion.img 
                src={option.image} 
                alt={`Image for ${option.text}`} 
                className="w-12 h-12 object-cover rounded mr-3 flex-shrink-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              />
            )}
            <span className="flex-1">{option.text}</span>
            
            {showCorrectness && (
              <motion.div 
                className="absolute top-2 right-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
              >
                {option.isCorrect ? 
                  <CheckCircle className="h-5 w-5 text-success" aria-label="Correct answer" /> : 
                  isSelected ? 
                  <XCircle className="h-5 w-5 text-error" aria-label="Incorrect answer" /> : 
                  null
                }
              </motion.div>
            )}
          </Button>
        </motion.div>
      );
    });

    return (
      <StaggeredList staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {optionElements}
      </StaggeredList>
    );
  };
  const renderCanvaContent = () => {
    if (slide.type === 'canva_embed' && slide.canvaEmbedUrl) {
      return (
        <div className="w-full max-w-4xl mx-auto">
          <iframe
            src={slide.canvaEmbedUrl}
            allowFullScreen
            className="w-full h-96 rounded-lg border"
            title="Canva Design"
          />
        </div>
      );
    }
    
    if (slide.type === 'canva_link' && slide.canvaViewUrl) {
      return (
        <div className="text-center space-y-4">
          <div className="p-6 border-2 border-dashed border-primary-300 rounded-lg bg-primary-50">
            <ExternalLink className="h-12 w-12 mx-auto mb-4 text-primary-600" />
            <p className="text-sm text-muted-foreground mb-4">
              Click the button below to open the Canva design
            </p>
            <Button
              onClick={() => window.open(slide.canvaViewUrl, '_blank')}
              className="inline-flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open in Canva
            </Button>
          </div>
        </div>
      );
    }
    
    return null;
  };

  const renderInteractiveActivity = () => {
    console.log('🎮 Rendering interactive activity for slide type:', slide.type);
    console.log('🎮 Activity data check:', {
      matchPairs: slide.matchPairs?.length || 0,
      dragDropItems: slide.dragDropItems?.length || 0,
      dragDropTargets: slide.dragDropTargets?.length || 0,
      clozeText: !!slide.clozeText,
      clozeGaps: slide.clozeGaps?.length || 0,
      gameWords: slide.gameWords?.length || 0,
      vocabulary: slide.vocabulary?.length || 0
    });
    
    // Handle Canva slides
    if (slide.type === 'canva_embed' || slide.type === 'canva_link') {
      return renderCanvaContent();
    }
    
    if (!onActivityResult) return null;
    
    const handleGameComplete = (correct: boolean, attempts: number, score?: number) => {
      onActivityResult({
        itemId: slide.id,
        correct,
        timeMs: Date.now() - timeElapsed * 1000,
        attempts,
        tags: [slide.type],
        cefr: level,
        accuracyPercent: score ? Math.min((score / 100) * 100, 100) : (correct ? 100 : 0)
      });
    };
    
    switch (slide.type) {
      // Game-based slides
      case 'fast_match':
        if (!slide.matchPairs || slide.matchPairs.length === 0) return null;
        return <FastMatchGame 
          matchPairs={slide.matchPairs} 
          onComplete={handleGameComplete}
          theme={slide.gameConfig?.theme || 'playground'}
          timeLimit={slide.timeLimit || 60}
        />;
        
      case 'memory_flip':
        if (!slide.matchPairs || slide.matchPairs.length === 0) return null;
        return <MemoryFlipGame 
          matchPairs={slide.matchPairs} 
          onComplete={handleGameComplete}
          theme={slide.gameConfig?.theme || 'playground'}
          timeLimit={slide.timeLimit || 90}
        />;
        
      case 'spelling_race':
        const words = slide.gameWords || slide.vocabulary || [];
        if (words.length === 0) return null;
        return <SpellingRaceGame 
          words={words} 
          onComplete={handleGameComplete}
          theme={slide.gameConfig?.theme || 'playground'}
          timeLimit={slide.timeLimit || 120}
        />;
      
      // Traditional interactive slides
      case 'match':
        if (!slide.matchPairs || slide.matchPairs.length === 0) return null;
        return <MatchPairs pairs={slide.matchPairs} onComplete={(correct, attempts) => {
          onActivityResult({
            itemId: slide.id,
            correct,
            timeMs: Date.now() - timeElapsed * 1000,
            attempts,
            tags: [slide.type],
            cefr: level,
            accuracyPercent: correct ? 100 : 0
          });
        }} showFeedback={showFeedback} />;

      case 'quiz_match_pairs':
        if (!slide.matchPairs || slide.matchPairs.length === 0) return null;
        return <WordPairDragDrop 
          pairs={slide.matchPairs} 
          onComplete={(correct, attempts) => {
            onActivityResult({
              itemId: slide.id,
              correct,
              timeMs: Date.now() - timeElapsed * 1000,
              attempts,
              tags: [slide.type],
              cefr: level,
              accuracyPercent: correct ? 100 : 0
            });
          }} 
          showFeedback={showFeedback}
          currentSection={currentSlide + 1}
          totalSections={totalSlides}
          sectionTitle={slide.prompt || "Word Pairs"}
        />;
        
      case 'drag_drop':
        if (!slide.dragDropItems || !slide.dragDropTargets) return null;
        return <DragDropMatch items={slide.dragDropItems} targets={slide.dragDropTargets} onComplete={(correct, attempts) => {
          onActivityResult({
            itemId: slide.id,
            correct,
            timeMs: Date.now() - timeElapsed * 1000,
            attempts,
            tags: [slide.type],
            cefr: level,
            accuracyPercent: correct ? 100 : 0
          });
        }} showFeedback={showFeedback} />;
        
      case 'cloze':
        if (!slide.clozeText || !slide.clozeGaps) return null;
        return <ClozeActivity text={slide.clozeText} gaps={slide.clozeGaps} onComplete={(correct, attempts) => {
          onActivityResult({
            itemId: slide.id,
            correct,
            timeMs: Date.now() - timeElapsed * 1000,
            attempts,
            tags: [slide.type],
            cefr: level,
            accuracyPercent: correct ? 100 : 0
          });
        }} showFeedback={showFeedback} />;
        
      default:
        return null;
    }
  };
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  return (
    <SlideTransition 
      slideKey={currentSlide} 
      direction={slideDirection}
      transitionType="fade"
      className="h-full"
    >
      <div 
        className="h-full flex flex-col bg-background text-foreground relative"
        role="main"
        aria-label={`Lesson slide ${currentSlide + 1} of ${totalSlides}`}
      >
        {/* Animated Background */}
        <AnimatedBackground 
          theme={getSlideTheme()} 
          intensity="low" 
          className="opacity-60"
        />

        {/* Floating Navigation Arrows */}
        {onPrevious && currentSlide > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handlePrevious} 
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-surface/80 backdrop-blur-sm border border-border hover:bg-surface shadow-lg mobile-touch-target transition-all duration-300 hover:scale-110"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </Button>
          </motion.div>
        )}
        
        {onNext && currentSlide < totalSlides - 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleNext} 
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-surface/80 backdrop-blur-sm border border-border hover:bg-surface shadow-lg mobile-touch-target transition-all duration-300 hover:scale-110"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </Button>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-h-0 overflow-auto px-6 py-8 relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Prompt Area */}
            <AnimatedElement animationType="slideDown" delay={0.1}>
              <div className="text-center space-y-4">
                <h1 
                  className="text-2xl sm:text-3xl font-bold text-text"
                  id="slide-title"
                >
                  {slide.prompt}
                </h1>
                {slide.instructions && (
                  <p 
                    className="text-lg text-text-muted max-w-2xl mx-auto"
                    id="slide-instructions"
                  >
                    {slide.instructions}
                  </p>
                )}
              </div>
            </AnimatedElement>

            {/* Enhanced Media Zone */}
            <EnhancedMediaRenderer 
              media={slide.media}
              slideContent={{
                prompt: slide.prompt,
                type: slide.type,
                level: level
              }}
              autoGenerate={false}
              imageStyle="educational"
            />

            {/* Interactive Activities */}
            <AnimatedElement animationType="scaleIn" delay={0.4}>
              {renderInteractiveActivity()}
            </AnimatedElement>

            {/* Options Grid - only show for non-interactive slides */}
            {slide.options && !['match', 'drag_drop', 'cloze', 'canva_embed', 'canva_link', 'fast_match', 'memory_flip', 'spelling_race', 'word_rain', 'bubble_pop', 'treasure_hunt', 'quiz_match_pairs', 'quiz_multiple_choice', 'quiz_drag_drop'].includes(slide.type) && (
              <AnimatedElement animationType="fadeIn" delay={0.5}>
                <div className="max-w-2xl mx-auto">
                  {renderOptions()}
                </div>
              </AnimatedElement>
            )}
          </div>
        </div>

        {/* Enhanced Progress Indicators */}
        <motion.div 
          className="bg-surface/90 backdrop-blur-sm border-t border-border px-6 py-3 relative z-10"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex justify-center max-w-4xl mx-auto">
            <div className="flex gap-2">
              {Array.from({ length: totalSlides }, (_, i) => (
                <motion.div 
                  key={i} 
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    i === currentSlide ? "bg-primary-500 scale-125" : 
                    i < currentSlide ? "bg-primary-300" : "bg-neutral-300"
                  )}
                  initial={{ scale: 0 }}
                  animate={{ scale: i === currentSlide ? 1.25 : 1 }}
                  transition={{ delay: 0.7 + (i * 0.05) }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Interactive Feedback Overlay */}
        <InteractiveFeedback
          isVisible={showInteractiveFeedback}
          isCorrect={isCorrect || false}
          showConfetti={isCorrect}
        />

        {/* Enhanced Accessibility Support */}
        <div className="sr-only" role="status" aria-live="polite" id="slide-status">
          Slide {currentSlide + 1} of {totalSlides}
        </div>
        
        {slide.accessibility?.screenReaderText && (
          <div className="sr-only" id="slide-accessibility-text">
            {slide.accessibility.screenReaderText}
          </div>
        )}
          
        {showFeedback && (
          <div className="sr-only" role="alert" aria-live="assertive">
            {isCorrect ? "Correct answer! Well done." : "Incorrect answer. Please try again."}
          </div>
        )}
      </div>
    </SlideTransition>
  );
}