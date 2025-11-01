import { useState, useCallback, useEffect } from "react";
import { classroomLessonService, LessonContent, LessonProgress } from "@/services/classroomLessonService";

export interface Slide {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  notes?: string;
  xpReward?: number;
}

export function useLessonSlides(studentId?: string, lessonContentId?: string) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [lessonData, setLessonData] = useState<LessonContent | null>(null);
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [xpEarned, setXpEarned] = useState(0);

  // Load lesson on mount
  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      return;
    }
    loadLesson();
  }, [studentId, lessonContentId]);

  const loadLesson = async () => {
    if (!studentId) return;

    try {
      setLoading(true);

      // Load lesson content
      const lesson = await classroomLessonService.loadLessonForStudent(studentId, lessonContentId);
      
      if (!lesson) {
        console.log("No lesson available");
        setLoading(false);
        return;
      }

      // Load progress
      const lessonProgress = await classroomLessonService.loadLessonProgress(studentId, lesson.id);
      
      setLessonData(lesson);
      setSlides(lesson.slides_content?.slides || []);
      setCurrentSlide(lessonProgress?.current_slide_index || 0);
      setXpEarned(lessonProgress?.xp_earned || 0);
      setProgress(lessonProgress);
      setLoading(false);
    } catch (error) {
      console.error("Error loading lesson:", error);
      setLoading(false);
    }
  };

  const goToSlide = useCallback(async (index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlide(index);
      
      // Save progress to database
      if (studentId && lessonData) {
        await classroomLessonService.saveSlideProgress(
          studentId,
          lessonData.id,
          index,
          xpEarned
        );
      }
    }
  }, [slides.length, studentId, lessonData, xpEarned]);

  const nextSlide = useCallback(async () => {
    if (currentSlide < slides.length - 1) {
      // Award XP for completing the slide
      const xp = slides[currentSlide].xpReward || 10;
      const newXP = xpEarned + xp;
      setXpEarned(newXP);
      
      await goToSlide(currentSlide + 1);
    } else {
      // Complete lesson
      if (studentId && lessonData) {
        await classroomLessonService.completeLesson(
          studentId,
          lessonData.id,
          xpEarned,
          { completedAt: new Date().toISOString() }
        );
      }
    }
  }, [currentSlide, slides, xpEarned, goToSlide, studentId, lessonData]);

  const previousSlide = useCallback(() => {
    goToSlide(Math.max(0, currentSlide - 1));
  }, [currentSlide, goToSlide]);

  const toggleFullScreen = useCallback(() => {
    setIsFullScreen(prev => !prev);
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!studentId || !lessonData || currentSlide < 0) return;

    const interval = setInterval(() => {
      classroomLessonService.saveSlideProgress(
        studentId,
        lessonData.id,
        currentSlide,
        xpEarned
      );
    }, 30000);

    return () => clearInterval(interval);
  }, [studentId, lessonData, currentSlide, xpEarned]);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (studentId && lessonData && currentSlide >= 0) {
        classroomLessonService.saveSlideProgress(
          studentId,
          lessonData.id,
          currentSlide,
          xpEarned
        );
      }
    };
  }, [studentId, lessonData, currentSlide, xpEarned]);

  return {
    slides,
    currentSlide,
    isFullScreen,
    lessonData,
    progress,
    loading,
    xpEarned,
    goToSlide,
    nextSlide,
    previousSlide,
    toggleFullScreen,
    totalSlides: slides.length
  };
}
