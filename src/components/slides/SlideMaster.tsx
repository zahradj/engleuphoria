import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Volume2, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Media, Option, Slide, LessonSlides } from '@/types/slides';

export interface SlideMasterProps {
  slide: Slide;
  currentSlide: number;
  totalSlides: number;
  theme?: 'mist-blue' | 'sage-sand' | 'default';
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
  theme = 'default',
  isTeacher = false,
  onNext,
  onPrevious,
  onOptionSelect,
  selectedOptions = [],
  showFeedback = false,
  isCorrect,
  timeElapsed = 0,
  level = 'A1'
}: SlideMasterProps) {
  const progress = ((currentSlide + 1) / totalSlides) * 100;

  const renderMedia = () => {
    if (!slide.media) return null;

    const { type, url, alt, autoplay } = slide.media;

    switch (type) {
      case 'image':
        return (
          <img
            src={url}
            alt={alt || 'Lesson image'}
            className="max-w-full max-h-64 object-contain rounded-lg shadow-sm"
          />
        );
      case 'video':
        return (
          <video
            src={url}
            controls
            autoPlay={autoplay}
            className="max-w-full max-h-64 rounded-lg shadow-sm"
          >
            Your browser does not support the video tag.
          </video>
        );
      case 'audio':
        return (
          <div className="flex items-center gap-3 p-4 bg-surface-2 rounded-lg">
            <Volume2 className="h-6 w-6 text-primary-600" />
            <audio src={url} controls autoPlay={autoplay} className="flex-1">
              Your browser does not support the audio tag.
            </audio>
          </div>
        );
      default:
        return null;
    }
  };

  const renderOptions = () => {
    if (!slide.options) return null;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {slide.options.map((option) => {
          const isSelected = selectedOptions.includes(option.id);
          const showCorrectness = showFeedback && option.isCorrect !== undefined;
          
          return (
            <Button
              key={option.id}
              variant={isSelected ? "default" : "outline"}
              size="lg"
              className={cn(
                "min-h-[60px] p-4 text-left justify-start relative mobile-touch-target",
                "transition-all duration-200 text-wrap",
                showCorrectness && option.isCorrect && "bg-success-soft border-success text-success-on",
                showCorrectness && !option.isCorrect && isSelected && "bg-error-soft border-error text-error-on",
                "focus:ring-2 focus:ring-focus-ring focus:ring-offset-2"
              )}
              onClick={() => onOptionSelect?.(option.id)}
              disabled={showFeedback}
            >
              {option.image && (
                <img
                  src={option.image}
                  alt=""
                  className="w-12 h-12 object-cover rounded mr-3 flex-shrink-0"
                />
              )}
              <span className="flex-1">{option.text}</span>
              
              {showCorrectness && (
                <div className="absolute top-2 right-2">
                  {option.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : isSelected ? (
                    <XCircle className="h-5 w-5 text-error" />
                  ) : null}
                </div>
              )}
            </Button>
          );
        })}
      </div>
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className={cn(
        "min-h-screen bg-bg text-text",
        theme !== 'default' && `data-theme-${theme}`
      )}
      data-theme={theme}
    >
      {/* Header */}
      <div className="bg-surface border-b border-border px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-sm font-medium">
              {level}
            </Badge>
            <span className="text-sm text-text-muted">
              Slide {currentSlide + 1} of {totalSlides}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {slide.timeLimit && (
              <div className="text-sm text-text-muted">
                {formatTime(Math.max(0, slide.timeLimit - timeElapsed))}
              </div>
            )}
            {isTeacher && (
              <Badge variant="secondary" className="text-xs">
                Teacher View
              </Badge>
            )}
          </div>
        </div>
        
        <div className="mt-3 max-w-4xl mx-auto">
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Prompt Area */}
          <div className="text-center space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-text">
              {slide.prompt}
            </h1>
            {slide.instructions && (
              <p className="text-lg text-text-muted max-w-2xl mx-auto">
                {slide.instructions}
              </p>
            )}
          </div>

          {/* Media Zone */}
          {slide.media && (
            <div className="flex justify-center">
              {renderMedia()}
            </div>
          )}

          {/* Options Grid */}
          {slide.options && (
            <div className="max-w-2xl mx-auto">
              {renderOptions()}
            </div>
          )}

          {/* Feedback Panel */}
          {showFeedback && (
            <div className={cn(
              "p-6 rounded-lg border-2 text-center space-y-3",
              isCorrect 
                ? "bg-success-soft border-success text-success-on" 
                : "bg-error-soft border-error text-error-on"
            )}>
              <div className="flex items-center justify-center gap-2">
                {isCorrect ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <XCircle className="h-6 w-6" />
                )}
                <span className="text-lg font-semibold">
                  {isCorrect ? "Excellent!" : "Try again!"}
                </span>
              </div>
              <p className="text-sm opacity-90">
                {isCorrect 
                  ? "Great job! You got it right." 
                  : "Don't worry, keep practicing and you'll improve!"
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-surface border-t border-border px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={currentSlide === 0}
            className="mobile-touch-target"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {Array.from({ length: totalSlides }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  i === currentSlide 
                    ? "bg-primary-500" 
                    : i < currentSlide 
                    ? "bg-primary-300" 
                    : "bg-neutral-300"
                )}
              />
            ))}
          </div>

          <Button
            onClick={onNext}
            disabled={currentSlide >= totalSlides - 1}
            className="mobile-touch-target"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Accessibility Support */}
      {slide.accessibility?.screenReaderText && (
        <div className="sr-only">
          {slide.accessibility.screenReaderText}
        </div>
      )}
    </div>
  );
}