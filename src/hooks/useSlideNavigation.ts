import { useState, useCallback, useEffect } from 'react';

interface UseSlideNavigationProps {
  totalSlides: number;
  initialSlide?: number;
  onSlideChange?: (slideIndex: number) => void;
}

export const useSlideNavigation = ({
  totalSlides,
  initialSlide = 0,
  onSlideChange,
}: UseSlideNavigationProps) => {
  const [currentSlide, setCurrentSlide] = useState(initialSlide);

  const goToNext = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      onSlideChange?.(nextSlide);
    }
  }, [currentSlide, totalSlides, onSlideChange]);

  const goToPrevious = useCallback(() => {
    if (currentSlide > 0) {
      const prevSlide = currentSlide - 1;
      setCurrentSlide(prevSlide);
      onSlideChange?.(prevSlide);
    }
  }, [currentSlide, onSlideChange]);

  const goToSlide = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalSlides) {
        setCurrentSlide(index);
        onSlideChange?.(index);
      }
    },
    [totalSlides, onSlideChange]
  );

  const canGoNext = currentSlide < totalSlides - 1;
  const canGoPrevious = currentSlide > 0;
  const progress = totalSlides > 0 ? ((currentSlide + 1) / totalSlides) * 100 : 0;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(totalSlides - 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [goToNext, goToPrevious, goToSlide, totalSlides]);

  return {
    currentSlide,
    totalSlides,
    goToNext,
    goToPrevious,
    goToSlide,
    canGoNext,
    canGoPrevious,
    progress,
  };
};
