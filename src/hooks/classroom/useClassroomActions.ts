
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseClassroomActionsProps {
  isRecording: boolean;
  setIsRecording: (value: boolean) => void;
  setStudentXP: (value: number | ((prev: number) => number)) => void;
  setShowRewardPopup: (value: boolean) => void;
}

export function useClassroomActions({
  isRecording,
  setIsRecording,
  setStudentXP,
  setShowRewardPopup
}: UseClassroomActionsProps) {
  const { toast } = useToast();

  const toggleRecording = useCallback(() => {
    console.log("Toggling recording:", !isRecording);
    setIsRecording(!isRecording);
    const newState = !isRecording;
    toast({
      title: newState ? "Recording Started" : "Recording Stopped",
      description: newState ? "Class is now being recorded" : "Class recording has been stopped",
    });
  }, [isRecording, setIsRecording, toast]);

  const awardPoints = useCallback(() => {
    console.log("Awarding points");
    setStudentXP(prev => prev + 50);
    setShowRewardPopup(true);
    setTimeout(() => setShowRewardPopup(false), 3000);
    toast({
      title: "🌟 Great Job!",
      description: "Emma earned 50 XP points!",
    });
  }, [setStudentXP, setShowRewardPopup, toast]);

  return {
    toggleRecording,
    awardPoints
  };
}
