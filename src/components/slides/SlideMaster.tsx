import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Volume2, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Media, Option, Slide, LessonSlides } from '@/types/slides';
import { MatchPairs } from './interactive/MatchPairs';
import { DragDropMatch } from './interactive/DragDropMatch';
import { ClozeActivity } from './interactive/ClozeActivity';
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
  const progress = (currentSlide + 1) / totalSlides * 100;
  const renderMedia = () => {
    if (!slide.media) return null;
    const {
      type,
      url,
      alt,
      autoplay
    } = slide.media;
    switch (type) {
      case 'image':
        return <img src={url} alt={alt || 'Lesson image'} className="max-w-full max-h-64 object-contain rounded-lg shadow-sm" />;
      case 'video':
        return <video src={url} controls autoPlay={autoplay} className="max-w-full max-h-64 rounded-lg shadow-sm">
            Your browser does not support the video tag.
          </video>;
      case 'audio':
        return <div className="flex items-center gap-3 p-4 bg-surface-2 rounded-lg">
            <Volume2 className="h-6 w-6 text-primary-600" />
            <audio src={url} controls autoPlay={autoplay} className="flex-1">
              Your browser does not support the audio tag.
            </audio>
          </div>;
      default:
        return null;
    }
  };
  const renderOptions = () => {
    if (!slide.options) return null;
    return <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-enter">
        {slide.options.map(option => {
        const isSelected = selectedOptions.includes(option.id);
        const showCorrectness = showFeedback && option.isCorrect !== undefined;
        return <Button key={option.id} variant={isSelected ? "default" : "outline"} size="lg" className={cn("min-h-[60px] p-4 text-left justify-start relative mobile-touch-target", "transition-all duration-200 text-wrap hover-scale", showCorrectness && option.isCorrect && "bg-success-soft border-success text-success-on", showCorrectness && !option.isCorrect && isSelected && "bg-error-soft border-error text-error-on", "focus:ring-2 focus:ring-focus-ring focus:ring-offset-2")} onClick={() => onOptionSelect?.(option.id)} disabled={showFeedback}>
              {option.image && <img src={option.image} alt="" className="w-12 h-12 object-cover rounded mr-3 flex-shrink-0" />}
              <span className="flex-1">{option.text}</span>
              
              {showCorrectness && <div className="absolute top-2 right-2">
                  {option.isCorrect ? <CheckCircle className="h-5 w-5 text-success" /> : isSelected ? <XCircle className="h-5 w-5 text-error" /> : null}
                </div>}
            </Button>;
      })}
      </div>;
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
      clozeGaps: slide.clozeGaps?.length || 0
    });
    
    // Handle Canva slides
    if (slide.type === 'canva_embed' || slide.type === 'canva_link') {
      return renderCanvaContent();
    }
    
    if (!onActivityResult) return null;
    switch (slide.type) {
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
  return <div className="h-full flex flex-col bg-background text-foreground relative animate-fade-in">
      {/* Header */}
      

      {/* Floating Navigation Arrows */}
      {onPrevious && currentSlide > 0 && <Button variant="ghost" size="icon" onClick={onPrevious} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-surface/80 backdrop-blur-sm border border-border hover:bg-surface shadow-lg mobile-touch-target">
          <ChevronLeft className="h-6 w-6" />
        </Button>}
      
      {onNext && currentSlide < totalSlides - 1 && <Button variant="ghost" size="icon" onClick={onNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-surface/80 backdrop-blur-sm border border-border hover:bg-surface shadow-lg mobile-touch-target">
          <ChevronRight className="h-6 w-6" />
        </Button>}

      {/* Main Content */}
      <div className="flex-1 min-h-0 overflow-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Prompt Area */}
          <div className="text-center space-y-4 animate-scale-in">
            <h1 className="text-2xl sm:text-3xl font-bold text-text">
              {slide.prompt}
            </h1>
            {slide.instructions && <p className="text-lg text-text-muted max-w-2xl mx-auto">
                {slide.instructions}
              </p>}
          </div>

          {/* Media Zone */}
          {slide.media && <div className="flex justify-center animate-fade-in">
              {renderMedia()}
            </div>}

          {/* Interactive Activities */}
          {renderInteractiveActivity()}

          {/* Options Grid - only show for non-interactive slides */}
          {slide.options && !['match', 'drag_drop', 'cloze', 'canva_embed', 'canva_link'].includes(slide.type) && <div className="max-w-2xl mx-auto">
              {renderOptions()}
            </div>}

          {/* Feedback Panel */}
          {showFeedback && <div className={cn("p-6 rounded-lg border-2 text-center space-y-3 animate-scale-in", isCorrect ? "bg-success-soft border-success text-success-on" : "bg-error-soft border-error text-error-on")}>
              <div className="flex items-center justify-center gap-2">
                {isCorrect ? <CheckCircle className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                <span className="text-lg font-semibold">
                  {isCorrect ? "Excellent!" : "Try again!"}
                </span>
              </div>
              <p className="text-sm opacity-90">
                {isCorrect ? "Great job! You got it right." : "Don't worry, keep practicing and you'll improve!"}
              </p>
            </div>}
        </div>
      </div>

      {/* Slide Progress Indicators - Now at bottom */}
      <div className="bg-surface/90 backdrop-blur-sm border-t border-border px-6 py-3">
        <div className="flex justify-center max-w-4xl mx-auto">
          <div className="flex gap-2">
            {Array.from({
            length: totalSlides
          }, (_, i) => <div key={i} className={cn("w-2 h-2 rounded-full transition-colors", i === currentSlide ? "bg-primary-500" : i < currentSlide ? "bg-primary-300" : "bg-neutral-300")} />)}
          </div>
        </div>
      </div>

      {/* Accessibility Support */}
      {slide.accessibility?.screenReaderText && <div className="sr-only">
          {slide.accessibility.screenReaderText}
        </div>}
    </div>;
}