
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ClassroomLayout } from "@/components/classroom/ClassroomLayout";
import { SidebarContent } from "@/components/classroom/SidebarContent";
import { SimpleVideoPanel } from "@/components/classroom/video/SimpleVideoPanel";
import { SimpleContentViewer } from "@/components/classroom/content/SimpleContentViewer";
import { useClassroomState } from "@/hooks/useClassroomState";

const ClassroomPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get("mode") || "group"; // Default to 'group' if no mode specified
  const [scrollPosition, setScrollPosition] = useState(0);
  const [userInfo, setUserInfo] = useState({ name: "", points: 0, isTeacher: false });
  
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

  // Check authentication on component mount
  useEffect(() => {
    const teacherName = localStorage.getItem("teacherName");
    const studentName = localStorage.getItem("studentName");
    const userType = localStorage.getItem("userType");
    const storedPoints = localStorage.getItem("points");
    
    console.log("ClassroomPage - Auth check:", { teacherName, studentName, userType });
    
    // If no user data, redirect to login
    if (!teacherName && !studentName && !userType) {
      console.log("No authentication found, redirecting to login");
      navigate("/login");
      return;
    }
    
    // Set user info based on authentication
    if (teacherName || userType === "teacher") {
      setUserInfo({
        name: teacherName || "Teacher",
        points: 0, // Teachers don't have points
        isTeacher: true
      });
    } else {
      setUserInfo({
        name: studentName || "Student",
        points: parseInt(storedPoints || "0"),
        isTeacher: false
      });
    }
  }, [navigate]);

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
      id: "current-user",
      name: userInfo.name,
      isTeacher: userInfo.isTeacher,
      isMuted: isMuted,
      isCameraOff: isVideoOff,
      isHandRaised: isHandRaised,
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
      id: "current-user",
      name: userInfo.name,
      isTeacher: userInfo.isTeacher,
      isMuted: isMuted,
      isCameraOff: isVideoOff,
      isHandRaised: isHandRaised,
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
      id: "current-user",
      name: userInfo.name,
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
    if (id === "current-user") {
      toggleMute();
    }
  };

  const handleToggleVideo = (id: string) => {
    if (id === "current-user") {
      toggleVideo();
    }
  };

  const handleToggleHand = (id: string) => {
    if (id === "current-user") {
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
          currentUserId="current-user"
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
          isTeacher={userInfo.isTeacher}
          studentName={userInfo.name}
        />
      </div>
    </div>
  );

  const sidebarContent = (
    <SidebarContent 
      studentName={userInfo.name}
      isChatOpen={isChatOpen}
      students={mockStudents}
      isTeacherView={userInfo.isTeacher}
      toggleChat={toggleChat}
    />
  );

  return (
    <ClassroomLayout
      studentName={userInfo.name}
      points={userInfo.points}
      mainContent={mainContent}
      sidebarContent={sidebarContent}
    />
  );
};

export default ClassroomPage;
