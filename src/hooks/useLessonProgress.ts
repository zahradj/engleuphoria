import { useState, useEffect } from 'react';
import { lessonRecommendationService } from '@/services/lessonRecommendationService';
import { useAuth } from '@/contexts/AuthContext';

interface LessonProgress {
  currentLesson: any | null;
  nextLesson: any | null;
  loading: boolean;
  error: string | null;
  needsPlacementTest: boolean;
}

export function useLessonProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<LessonProgress>({
    currentLesson: null,
    nextLesson: null,
    loading: true,
    error: null,
    needsPlacementTest: false
  });

  useEffect(() => {
    const loadProgress = async () => {
      if (!user?.id) return;

      try {
        setProgress(prev => ({ ...prev, loading: true }));

        // Check if placement test is needed
        const needsTest = await lessonRecommendationService.needsPlacementTest(user.id);
        
        if (needsTest) {
          setProgress({
            currentLesson: null,
            nextLesson: null,
            loading: false,
            error: null,
            needsPlacementTest: true
          });
          return;
        }

        // Get next lesson
        const nextLesson = await lessonRecommendationService.getNextLessonForStudent(user.id);

        setProgress({
          currentLesson: nextLesson,
          nextLesson: nextLesson,
          loading: false,
          error: null,
          needsPlacementTest: false
        });
      } catch (err) {
        setProgress(prev => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to load lesson progress'
        }));
      }
    };

    loadProgress();
  }, [user?.id]);

  return progress;
}
