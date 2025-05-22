
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { ClassroomLayout } from "@/components/classroom/ClassroomLayout";
import { ToolsPanel } from "@/components/classroom/ToolsPanel";
import { MainContentTabs } from "@/components/classroom/MainContentTabs";
import { SidebarContent } from "@/components/classroom/SidebarContent";
import { Plus } from "lucide-react";

// Define types for layout options
type LayoutType = "gallery" | "spotlight" | "sidebar" | "default" | "material" | "video";

// Mock data for participants
const mockVideoFeeds = [
  {
    id: "teacher1",
    name: "Ms. Johnson",
    isTeacher: true,
    isMuted: false,
    isCameraOff: false,
  },
  {
    id: "student1",
    name: "Current Student",
    isTeacher: false,
    isMuted: true,
    isCameraOff: false,
    isHandRaised: false,
  },
  {
    id: "student2",
    name: "Emma",
    isTeacher: false,
    isMuted: true,
    isCameraOff: true,
  },
];

// Mock quiz questions
const mockQuizQuestions = [
  {
    id: "q1",
    question: "What sound does a dog make?",
    options: ["Meow", "Woof", "Moo", "Tweet"],
    correctAnswer: "Woof",
  },
  {
    id: "q2",
    question: "What sound does a cat make?",
    options: ["Meow", "Woof", "Moo", "Tweet"],
    correctAnswer: "Meow",
  },
];

// Mock student data
const mockStudents = [
  {
    id: "student1",
    name: "Current Student",
    avatar: "https://github.com/shadcn.png",
    status: "speaking",
    isCurrentUser: true,
  },
  {
    id: "student2",
    name: "Emma",
    avatar: "https://github.com/sadmann7.png",
    status: "online",
    isCurrentUser: false,
  },
  {
    id: "student3",
    name: "Noah",
    avatar: "https://github.com/emilkowalski.png",
    status: "offline",
    isCurrentUser: false,
  },
];

const ESLClassroom = () => {
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
    // In a real app, we'd fetch this from an API
    const storedName = localStorage.getItem("studentName");
    const storedPoints = localStorage.getItem("points");
    const storedIsTeacher = localStorage.getItem("isTeacher");

    if (!storedName) {
      navigate("/");
      return;
    }

    setStudentName(storedName);
    setPoints(storedPoints ? parseInt(storedPoints) : 0);
    setIsTeacherView(storedIsTeacher === "true");
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

  const handleMessageStudent = (studentId: string) => {
    const student = mockStudents.find(s => s.id === studentId);
    setIsChatOpen(true);
    toast({
      title: `Messaging ${student?.name}`,
      description: "Private chat opened",
    });
  };

  const handleToggleSpotlight = (studentId: string) => {
    const student = mockStudents.find(s => s.id === studentId);
    setLayout("spotlight");
    toast({
      title: `Spotlighting ${student?.name}`,
      description: "Student is now in spotlight view",
    });
  };

  const handleToggleMute = (id: string) => {
    if (id === "student1") toggleMute();
  };

  const handleToggleVideo = (id: string) => {
    if (id === "student1") toggleVideo();
  };

  const handleToggleHand = (id: string) => {
    if (id === "student1") toggleHand();
  };

  const mainContent = (
    <div className="space-y-4">
      <ToolsPanel
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        isHandRaised={isHandRaised}
        onToggleMute={toggleMute}
        onToggleVideo={toggleVideo}
        onToggleHand={toggleHand}
        onShowGames={() => toast({ title: "Games", description: "Opening games panel" })}
        onLayoutChange={handleLayoutChange}
        onShowRewards={() => toast({ title: "Rewards", description: "Opening rewards panel" })}
        onStartTimer={() => toast({ title: "Timer", description: "Starting timer" })}
        onUploadMaterial={() => toast({ title: "Upload", description: "Opening upload dialog" })}
      />

      <MainContentTabs
        videoFeeds={mockVideoFeeds}
        students={mockStudents}
        quizQuestions={mockQuizQuestions}
        currentUserId="student1"
        isTeacherView={isTeacherView}
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        isHandRaised={isHandRaised}
        onToggleMute={handleToggleMute}
        onToggleVideo={handleToggleVideo}
        onToggleHand={handleToggleHand}
        onQuizComplete={handleQuizComplete}
        onMessageStudent={handleMessageStudent}
        onToggleSpotlight={handleToggleSpotlight}
      />
    </div>
  );

  const sidebarContent = (
    <SidebarContent 
      studentName={studentName}
      isChatOpen={isChatOpen}
      students={mockStudents}
      isTeacherView={isTeacherView}
      toggleChat={toggleChat}
    />
  );

  return (
    <ClassroomLayout
      studentName={studentName}
      points={points}
      mainContent={mainContent}
      sidebarContent={sidebarContent}
    />
  );
};

export default ESLClassroom;
