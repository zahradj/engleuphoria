
import { useState, useEffect } from "react";
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

  console.log("Hook state initialized");

  // Class timer
  useEffect(() => {
    console.log("Setting up class timer");
    const timer = setInterval(() => {
      setClassTime(prev => prev + 1);
    }, 1000);

    return () => {
      console.log("Cleaning up class timer");
      clearInterval(timer);
    };
  }, []);

  const toggleRecording = () => {
    console.log("Toggling recording:", !isRecording);
    setIsRecording(!isRecording);
    toast({
      title: isRecording ? "Recording Stopped" : "Recording Started",
      description: isRecording ? "Class recording has been stopped" : "Class is now being recorded",
    });
  };

  const awardPoints = () => {
    console.log("Awarding points");
    setStudentXP(prev => prev + 50);
    setShowRewardPopup(true);
    setTimeout(() => setShowRewardPopup(false), 3000);
    toast({
      title: "🌟 Great Job!",
      description: "Emma earned 50 XP points!",
    });
  };

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
