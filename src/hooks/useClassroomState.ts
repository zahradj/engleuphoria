
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

// Define types for layout options
export type LayoutType = "gallery" | "spotlight" | "sidebar" | "default" | "material" | "video";

export function useClassroomState() {
  const [studentName, setStudentName] = useState<string>("");
  const [points, setPoints] = useState<number>(0);
  const [layout, setLayout] = useState<LayoutType>("default");
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTeacherView, setIsTeacherView] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { languageText } = useLanguage();

  useEffect(() => {
    // Check for both teacher and student authentication
    const teacherName = localStorage.getItem("teacherName");
    const storedStudentName = localStorage.getItem("studentName");
    const storedPoints = localStorage.getItem("points");
    const userType = localStorage.getItem("userType");

    console.log("useClassroomState - Auth check:", { teacherName, storedStudentName, userType });

    // If no authentication found, redirect to login
    if (!teacherName && !storedStudentName && !userType) {
      console.log("No authentication found, redirecting to login");
      navigate("/login");
      return;
    }

    // Set state based on user type
    if (teacherName || userType === "teacher") {
      console.log("Setting teacher view");
      setStudentName(teacherName || "Teacher");
      setPoints(0); // Teachers don't have points
      setIsTeacherView(true);
    } else {
      console.log("Setting student view");
      setStudentName(storedStudentName || "Student");
      setPoints(storedPoints ? parseInt(storedPoints) : 0);
      setIsTeacherView(false);
    }
  }, [navigate]);

  const handleLayoutChange = (newLayout: LayoutType) => {
    setLayout(newLayout);
    
    toast({
      title: languageText.layoutChanged,
      description: `${languageText.switchedTo} ${newLayout} ${languageText.view}`,
    });
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    toast({
      title: isMuted ? languageText.microphoneEnabled : languageText.microphoneDisabled,
      description: isMuted ? languageText.youCanNowSpeak : languageText.youAreMuted,
    });
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    
    toast({
      title: isVideoOff ? languageText.cameraEnabled : languageText.cameraDisabled,
      description: isVideoOff ? languageText.youAreNowVisible : languageText.youAreNowHidden,
    });
  };

  const toggleHand = () => {
    setIsHandRaised(!isHandRaised);
    
    toast({
      title: isHandRaised ? languageText.handLowered : languageText.handRaised,
      description: isHandRaised ? languageText.handLoweredDesc : languageText.teacherNotified,
    });
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleQuizComplete = (score: number, total: number) => {
    const newPoints = points + score;
    setPoints(newPoints);
    localStorage.setItem("points", newPoints.toString());
    
    toast({
      title: "Quiz Completed!",
      description: `You scored ${score} out of ${total} and earned ${score} points!`,
    });
  };

  return {
    studentName,
    points,
    layout,
    isMuted,
    isVideoOff,
    isHandRaised,
    isChatOpen,
    isTeacherView,
    handleLayoutChange,
    toggleMute,
    toggleVideo,
    toggleHand,
    toggleChat,
    handleQuizComplete,
    setPoints
  };
}
