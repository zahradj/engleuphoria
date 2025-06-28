
import { useState, useCallback } from 'react';
import { progressAnalyticsService, Achievement } from '@/services/progressAnalyticsService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface UseProgressTrackingReturn {
  trackLessonCompletion: (lessonData: {
    duration: number;
    accuracy: number;
    skillArea: string;
    xpEarned: number;
  }) => Promise<void>;
  trackSpeakingPractice: (speakingData: {
    duration: number;
    overallRating: number;
    xpEarned: number;
  }) => Promise<void>;
  awardXP: (xpAmount: number, reason?: string) => Promise<void>;
  loading: boolean;
  showAchievementNotification: (achievement: Achievement & { xp_reward: number }) => void;
}

export function useProgressTracking(): UseProgressTrackingReturn {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const trackLessonCompletion = useCallback(async (lessonData: {
    duration: number;
    accuracy: number;
    skillArea: string;
    xpEarned: number;
  }) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      await progressAnalyticsService.trackLessonCompletion(user.id, lessonData);
      
      toast({
        title: "Progress Updated!",
        description: `You earned ${lessonData.xpEarned} XP for completing this lesson.`,
      });
    } catch (error) {
      console.error('Error tracking lesson completion:', error);
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, toast]);

  const trackSpeakingPractice = useCallback(async (speakingData: {
    duration: number;
    overallRating: number;
    xpEarned: number;
  }) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      await progressAnalyticsService.trackSpeakingPractice(user.id, speakingData);
      
      toast({
        title: "Speaking Progress Updated!",
        description: `Great speaking session! You earned ${speakingData.xpEarned} XP.`,
      });
    } catch (error) {
      console.error('Error tracking speaking practice:', error);
      toast({
        title: "Error",
        description: "Failed to update speaking progress",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, toast]);

  const awardXP = useCallback(async (xpAmount: number, reason: string = 'Activity completion') => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const result = await progressAnalyticsService.updateStudentXP(user.id, xpAmount);
      
      if (result?.level_up) {
        toast({
          title: "Level Up! 🎉",
          description: `Congratulations! You've reached level ${result.current_level}!`,
        });
      } else {
        toast({
          title: "XP Earned!",
          description: `+${xpAmount} XP for ${reason}`,
        });
      }
    } catch (error) {
      console.error('Error awarding XP:', error);
      toast({
        title: "Error",
        description: "Failed to award XP",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, toast]);

  const showAchievementNotification = useCallback((achievement: Achievement & { xp_reward: number }) => {
    // This would typically trigger a global notification component
    toast({
      title: `🏆 Achievement Unlocked: ${achievement.name}`,
      description: `${achievement.description} (+${achievement.xp_reward} XP)`,
    });
  }, [toast]);

  return {
    trackLessonCompletion,
    trackSpeakingPractice,
    awardXP,
    loading,
    showAchievementNotification
  };
}
