
import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export function useOneOnOneClassroom() {
  console.log("useOneOnOneClassroom hook initializing");
  
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [classTime, setClassTime] = useState(0);
  const [activeRightTab, setActiveRightTab] = useState("chat");
  const [activeCenterTab, setActiveCenterTab] = useState("whiteboard");
  const [studentXP, setStudentXP] = useState(1250);
  const [studentLevel, setStudentLevel] = useState("Intermediate");
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  console.log("Hook state initialized");

  // Optimized class timer with proper cleanup
  useEffect(() => {
    console.log("Setting up class timer");
    
    timerRef.current = setInterval(() => {
      setClassTime(prev => prev + 1);
    }, 1000);

    return () => {
      console.log("Cleaning up class timer");
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []); // Empty dependency array - timer should only be set up once

  const toggleRecording = useCallback(() => {
    console.log("Toggling recording:", !isRecording);
    setIsRecording(prev => {
      const newState = !prev;
      toast({
        title: newState ? "Recording Started" : "Recording Stopped",
        description: newState ? "Class is now being recorded" : "Class recording has been stopped",
      });
      return newState;
    });
  }, [isRecording, toast]);

  const awardPoints = useCallback(() => {
    console.log("Awarding points");
    setStudentXP(prev => prev + 50);
    setShowRewardPopup(true);
    setTimeout(() => setShowRewardPopup(false), 3000);
    toast({
      title: "🌟 Great Job!",
      description: "Emma earned 50 XP points!",
    });
  }, [toast]);

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
