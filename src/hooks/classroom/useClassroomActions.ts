
import { useToast } from "@/hooks/use-toast";

interface UseClassroomActionsProps {
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  setStudentXP: (xp: number | ((prev: number) => number)) => void;
  setShowRewardPopup: (show: boolean) => void;
}

export function useClassroomActions({
  isRecording,
  setIsRecording,
  setStudentXP,
  setShowRewardPopup
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
