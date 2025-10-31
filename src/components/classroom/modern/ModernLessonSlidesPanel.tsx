import { useState, useEffect, useCallback } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, ChevronDown, ChevronUp } from "lucide-react";
// import { useLanguage } from "@/contexts/LanguageContext";

interface Slide {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  notes?: string;
}

interface ModernLessonSlidesPanelProps {
  slides: Slide[];
  currentSlide: number;
  onSlideChange: (index: number) => void;
  isTeacher?: boolean;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
}

export function ModernLessonSlidesPanel({
  slides,
  currentSlide,
  onSlideChange,
  isTeacher = false,
  isFullScreen = false,
  onToggleFullScreen
}: ModernLessonSlidesPanelProps) {
  // const { t } = useLanguage();
  const [showNotes, setShowNotes] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentSlide > 0) {
        onSlideChange(currentSlide - 1);
      } else if (e.key === "ArrowRight" && currentSlide < slides.length - 1) {
        onSlideChange(currentSlide + 1);
      } else if (e.key === "Home") {
        onSlideChange(0);
      } else if (e.key === "End") {
        onSlideChange(slides.length - 1);
      } else if (e.key === "F11") {
        e.preventDefault();
        onToggleFullScreen?.();
      } else if (e.key === "Escape" && isFullScreen) {
        onToggleFullScreen?.();
      } else if (e.key >= "1" && e.key <= "9") {
        const slideIndex = parseInt(e.key) - 1;
        if (slideIndex < slides.length) {
          onSlideChange(slideIndex);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, slides.length, onSlideChange, isFullScreen, onToggleFullScreen]);

  const progress = ((currentSlide + 1) / slides.length) * 100;

  const goToPrevious = useCallback(() => {
    if (currentSlide > 0) {
      onSlideChange(currentSlide - 1);
    }
  }, [currentSlide, onSlideChange]);

  const goToNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      onSlideChange(currentSlide + 1);
    }
  }, [currentSlide, slides.length, onSlideChange]);

  const currentSlideData = slides[currentSlide];

  return (
    <GlassCard className={`h-full flex flex-col p-4 ${isFullScreen ? "fixed inset-0 z-50" : ""}`}>
      {/* Header with controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-classroom-primary">
          Slide {currentSlide + 1} / {slides.length}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            ← Prev | Next →
          </span>
          {onToggleFullScreen && (
            <GlassButton
              size="sm"
              variant="default"
              onClick={onToggleFullScreen}
              title={isFullScreen ? "Exit Full Screen (ESC)" : "Full Screen (F11)"}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </GlassButton>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-background/20 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-classroom-primary to-classroom-accent transition-all duration-500"
          style={{ width: `${progress}%` }}
        >
          {/* Milestone markers */}
          {[25, 50, 75, 100].map((milestone) => (
            <div
              key={milestone}
              className={`absolute h-3 w-3 rounded-full bg-classroom-reward transform -translate-y-0.5 ${
                progress >= milestone ? "scale-100" : "scale-0"
              } transition-transform duration-300`}
              style={{ left: `${milestone}%`, marginLeft: "-6px" }}
            />
          ))}
        </div>
      </div>

      {/* Main slide display */}
      <div className="flex-1 relative mb-4 bg-background/10 rounded-xl overflow-hidden animate-fade-in">
        <div className="absolute inset-0 flex items-center justify-center p-8">
          {currentSlideData?.imageUrl ? (
            <img
              src={currentSlideData.imageUrl}
              alt={currentSlideData.title}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                {currentSlideData?.title}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {currentSlideData?.content}
              </p>
            </div>
          )}
        </div>

        {/* Navigation arrows */}
        <GlassButton
          variant="default"
          size="lg"
          className="absolute left-4 top-1/2 -translate-y-1/2"
          onClick={goToPrevious}
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="w-8 h-8" />
        </GlassButton>
        <GlassButton
          variant="default"
          size="lg"
          className="absolute right-4 top-1/2 -translate-y-1/2"
          onClick={goToNext}
          disabled={currentSlide === slides.length - 1}
        >
          <ChevronRight className="w-8 h-8" />
        </GlassButton>
      </div>

      {/* Slide notes (teacher only) */}
      {isTeacher && currentSlideData?.notes && (
        <div className="mb-4">
          <GlassButton
            variant="default"
            size="sm"
            onClick={() => setShowNotes(!showNotes)}
            className="w-full justify-between"
          >
            <span>Teaching Notes</span>
            {showNotes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </GlassButton>
          {showNotes && (
            <div className="mt-2 p-3 bg-classroom-accent/20 rounded-lg text-sm animate-accordion-down">
              {currentSlideData.notes}
            </div>
          )}
        </div>
      )}

      {/* Thumbnail strip */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-classroom-primary/30 scrollbar-track-transparent">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => onSlideChange(index)}
            className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
              index === currentSlide
                ? "ring-2 ring-classroom-primary shadow-glow scale-110"
                : "opacity-60 hover:opacity-100 hover:scale-105"
            }`}
          >
            {slide.imageUrl ? (
              <img
                src={slide.imageUrl}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-background/20 flex items-center justify-center text-xs">
                {index + 1}
              </div>
            )}
          </button>
        ))}
      </div>
    </GlassCard>
  );
}
