import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { lessonCompletionService } from '@/services/lessonCompletionService';

interface UseAutomaticProgressProps {
  studentId: string;
}

interface TrackCompletionParams {
  lessonId: string;
  scheduledLessonId?: string;
  timeSpentMinutes: number;
  performanceScore?: number;
  skillsPracticed?: Record<string, number>;
  notes?: string;
}

export function useAutomaticProgress({ studentId }: UseAutomaticProgressProps) {
  const [isTracking, setIsTracking] = useState(false);
  const { toast } = useToast();

  const trackCompletion = async (params: TrackCompletionParams) => {
    if (!studentId) {
      toast({
        title: "Error",
        description: "Student ID is required",
        variant: "destructive"
      });
      return null;
    }

    setIsTracking(true);

    try {
      const { completion, xpEarned } = await lessonCompletionService.recordCompletion(
        studentId,
        params
      );

      toast({
        title: "🎉 Lesson Complete!",
        description: `You earned ${xpEarned} XP! Keep up the great work!`,
      });

      return { completion, xpEarned };
    } catch (error) {
      console.error('Error tracking lesson completion:', error);
      toast({
        title: "Error",
        description: "Failed to record lesson completion. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsTracking(false);
    }
  };

  const checkIfCompleted = async (lessonId: string) => {
    try {
      return await lessonCompletionService.isLessonCompleted(studentId, lessonId);
    } catch (error) {
      console.error('Error checking lesson completion:', error);
      return false;
    }
  };

  const getRecentCompletions = async (limit: number = 10) => {
    try {
      return await lessonCompletionService.getCompletionHistory(studentId, limit);
    } catch (error) {
      console.error('Error fetching recent completions:', error);
      return [];
    }
  };

  return {
    trackCompletion,
    checkIfCompleted,
    getRecentCompletions,
    isTracking
  };
}
