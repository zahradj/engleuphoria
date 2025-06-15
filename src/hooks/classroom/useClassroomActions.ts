
import { useToast } from "@/hooks/use-toast";
import { audioService } from "@/services/audioService";

interface UseClassroomActionsProps {
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  setStudentXP: (xp: number | ((prev: number) => number)) => void;
  setShowRewardPopup: (show: boolean) => void;
  onShowCelebration?: (points: number, reason?: string) => void;
}

export function useClassroomActions({
  isRecording,
  setIsRecording,
  setStudentXP,
  setShowRewardPopup,
  onShowCelebration
}: UseClassroomActionsProps) {
  const { toast } = useToast();

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    toast({
      title: isRecording ? "Recording Stopped" : "Recording Started",
      description: isRecording ? "Session recording has been stopped." : "Session recording has started.",
    });
  };

  const awardPoints = (points: number, reason?: string) => {
    setStudentXP(prev => prev + points);
    setShowRewardPopup(true);
    
    // Play enhanced sound based on points
    audioService.playRewardSound(points);
    
    // Show center-screen celebration
    if (onShowCelebration) {
      onShowCelebration(points, reason);
    }
    
    toast({
      title: "Points Awarded! 🎉",
      description: `Student earned ${points} XP${reason ? ` for ${reason}` : ''}`,
    });

    // Hide reward popup after 3 seconds
    setTimeout(() => {
      setShowRewardPopup(false);
    }, 3000);
  };

  return {
    toggleRecording,
    awardPoints
  };
}
