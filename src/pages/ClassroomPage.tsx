
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ClassroomLayout } from "@/components/classroom/ClassroomLayout";
import { SidebarContent } from "@/components/classroom/SidebarContent";
import { SimpleVideoPanel } from "@/components/classroom/video/SimpleVideoPanel";
import { SimpleContentViewer } from "@/components/classroom/content/SimpleContentViewer";
import { useClassroomState } from "@/hooks/useClassroomState";

const ClassroomPage = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "group"; // 'group' or 'oneOnOne'
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const {
    studentName,
    points,
    isMuted,
    isVideoOff,
    isHandRaised,
    isChatOpen,
    isTeacherView,
    toggleMute,
    toggleVideo,
    toggleHand,
    toggleChat,
  } = useClassroomState();

  // Mock data based on mode
  const mockVideoFeeds = mode === "oneOnOne" ? [
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
  ] : [
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
    {
      id: "student3",
      name: "Noah",
      isTeacher: false,
      isMuted: true,
      isCameraOff: false,
    },
  ];

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

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handler for video controls
  const handleToggleMute = (id: string) => {
    if (id === "student1") {
      toggleMute();
    }
  };

  const handleToggleVideo = (id: string) => {
    if (id === "student1") {
      toggleVideo();
    }
  };

  const handleToggleHand = (id: string) => {
    if (id === "student1") {
      toggleHand();
    }
  };

  const handleMessageStudent = (studentId: string) => {
    toggleChat();
  };

  // Calculate video panel movement
  const videoTransform = `translateY(${scrollPosition * 0.3}px)`;

  const mainContent = (
    <div className="w-full flex flex-col gap-4 h-full">
      {/* Simple Video Panel */}
      <div 
        className="w-full transition-transform duration-200 ease-out"
        style={{ transform: videoTransform }}
      >
        <SimpleVideoPanel
          feeds={mockVideoFeeds}
          currentUserId="student1"
          isOneOnOne={mode === "oneOnOne"}
          onToggleMute={handleToggleMute}
          onToggleVideo={handleToggleVideo}
          onToggleHand={handleToggleHand}
        />
      </div>
      
      {/* Content Area */}
      <div className="flex-1 min-h-[120vh]">
        <SimpleContentViewer 
          mode={mode}
          isTeacher={isTeacherView}
          studentName={studentName}
        />
      </div>
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

export default ClassroomPage;
