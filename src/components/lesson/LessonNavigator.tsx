import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save, Home } from 'lucide-react';

interface LessonNavigatorProps {
  currentSlide: number;
  totalSlides: number;
  onPrevious?: () => void;
  onNext?: () => void;
  onSave?: () => void;
  onExit?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
}

export function LessonNavigator({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
  onSave,
  onExit,
  canGoPrevious = true,
  canGoNext = true
}: LessonNavigatorProps) {
  return (
    <div className="w-full bg-background border-t">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Previous Button */}
          <div>
            {onPrevious && currentSlide > 1 && (
              <Button
                variant="outline"
                onClick={onPrevious}
                disabled={!canGoPrevious}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
            )}
          </div>

          {/* Center: Save & Exit */}
          <div className="flex items-center gap-2">
            {onSave && (
              <Button
                variant="ghost"
                onClick={onSave}
                className="gap-2"
                size="sm"
              >
                <Save className="w-4 h-4" />
                Save Progress
              </Button>
            )}
            {onExit && (
              <Button
                variant="ghost"
                onClick={onExit}
                className="gap-2"
                size="sm"
              >
                <Home className="w-4 h-4" />
                Exit Lesson
              </Button>
            )}
          </div>

          {/* Right: Next Button */}
          <div>
            {onNext && (
              <Button
                onClick={onNext}
                disabled={!canGoNext}
                className="gap-2"
              >
                {currentSlide < totalSlides ? 'Next' : 'Complete'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
