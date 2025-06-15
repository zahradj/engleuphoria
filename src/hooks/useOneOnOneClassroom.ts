
import { useClassroomTimer } from "./classroom/useClassroomTimer";
import { useClassroomState } from "./classroom/useClassroomState";
import { useClassroomActions } from "./classroom/useClassroomActions";

export function useOneOnOneClassroom() {
  console.log("useOneOnOneClassroom hook initializing");
  
  const { classTime } = useClassroomTimer();
  const {
    isRecording,
    isMuted,
    isCameraOff,
    activeRightTab,
    activeCenterTab,
    studentXP,
    studentLevel,
    showRewardPopup,
    setIsRecording,
    setIsMuted,
    setIsCameraOff,
    setActiveRightTab,
    setActiveCenterTab,
    setStudentXP,
    setShowRewardPopup
  } = useClassroomState();

  const { toggleRecording, awardPoints: originalAwardPoints } = useClassroomActions({
    isRecording,
    setIsRecording,
    setStudentXP,
    setShowRewardPopup
  });

  // Create a wrapper function that matches the expected signature
  const awardPoints = (points: number, reason?: string) => {
    originalAwardPoints(points, reason);
  };

  console.log("Hook state initialized");
  console.log("Hook returning values");
  
  return {
    isRecording,
    isMuted,
    isCameraOff,
    classTime,
    activeRightTab,
    activeCenterTab,
    studentXP,
    studentLevel,
    showRewardPopup,
    setIsMuted,
    setIsCameraOff,
    setActiveRightTab,
    setActiveCenterTab,
    toggleRecording,
    awardPoints
  };
}
