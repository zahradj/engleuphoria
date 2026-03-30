import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Slide } from './types';

interface LessonPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slides: Slide[];
  lessonTitle: string;
}

export const LessonPreviewDialog: React.FC<LessonPreviewDialogProps> = ({
  open,
  onOpenChange,
  slides,
  lessonTitle,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (open) setCurrentIndex(0);
  }, [open]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, slides.length - 1));
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, goNext, goPrev, onOpenChange]);

  const currentSlide = slides[currentIndex];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 gap-0 bg-black border-none">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 bg-black/60 text-white">
          <span className="text-sm font-medium">{lessonTitle}</span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/70">
              {currentIndex + 1} / {slides.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-white hover:bg-white/20"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Slide viewport */}
        <div className="flex-1 flex items-center justify-center bg-black relative">
          {currentSlide && (
            <div
              className="relative bg-white rounded shadow-2xl overflow-hidden"
              style={{
                width: '960px',
                height: '540px',
                maxWidth: '90vw',
                maxHeight: '75vh',
              }}
            >
              {currentSlide.imageUrl ? (
                <img
                  src={currentSlide.imageUrl}
                  alt={currentSlide.title || `Slide ${currentIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/50 p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {currentSlide.title || `Slide ${currentIndex + 1}`}
                  </h2>
                  {currentSlide.type === 'quiz' && currentSlide.quizQuestion && (
                    <p className="text-lg text-muted-foreground">{currentSlide.quizQuestion}</p>
                  )}
                  {currentSlide.type === 'poll' && currentSlide.pollQuestion && (
                    <p className="text-lg text-muted-foreground">{currentSlide.pollQuestion}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Navigation arrows */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 text-white bg-black/40 hover:bg-black/60 disabled:opacity-30"
            onClick={goPrev}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 text-white bg-black/40 hover:bg-black/60 disabled:opacity-30"
            onClick={goNext}
            disabled={currentIndex === slides.length - 1}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Slide strip */}
        <div className="flex items-center gap-2 px-4 py-3 bg-black/80 overflow-x-auto">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(idx)}
              className={`shrink-0 w-16 h-10 rounded border-2 overflow-hidden transition-all ${
                idx === currentIndex
                  ? 'border-primary ring-1 ring-primary'
                  : 'border-white/20 hover:border-white/50'
              }`}
            >
              {slide.imageUrl ? (
                <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-muted/20 flex items-center justify-center text-[8px] text-white/60">
                  {idx + 1}
                </div>
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
