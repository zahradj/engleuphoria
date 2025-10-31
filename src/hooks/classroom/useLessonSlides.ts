import { useState, useCallback } from "react";

export interface Slide {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  notes?: string;
}

// Sample lesson slides for demonstration
const SAMPLE_SLIDES: Slide[] = [
  {
    id: "1",
    title: "Welcome to Today's Lesson",
    content: "Let's learn about animals and their habitats!",
    notes: "Start with a warm greeting. Ask students what animals they know."
  },
  {
    id: "2",
    title: "Farm Animals",
    content: "Animals that live on farms: cow, pig, chicken, horse, sheep",
    notes: "Show pictures. Practice pronunciation. Ask which animals they've seen."
  },
  {
    id: "3",
    title: "Wild Animals",
    content: "Animals in nature: lion, elephant, monkey, giraffe, zebra",
    notes: "Compare with farm animals. Discuss habitats. Use the whiteboard for drawing."
  },
  {
    id: "4",
    title: "Activity Time!",
    content: "Draw your favorite animal and describe it in English",
    notes: "Use the whiteboard tool. Help with vocabulary. Encourage speaking."
  },
  {
    id: "5",
    title: "Great Job!",
    content: "You learned about many animals today. Keep practicing!",
    notes: "Review key vocabulary. Give positive feedback. Assign homework if needed."
  }
];

export function useLessonSlides() {
  const [slides] = useState<Slide[]>(SAMPLE_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlide(index);
    }
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
  }, [slides.length]);

  const previousSlide = useCallback(() => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  }, []);

  const toggleFullScreen = useCallback(() => {
    setIsFullScreen(prev => !prev);
  }, []);

  return {
    slides,
    currentSlide,
    isFullScreen,
    goToSlide,
    nextSlide,
    previousSlide,
    toggleFullScreen,
    totalSlides: slides.length
  };
}
