import React, { useState, useEffect } from "react";
import { ClassroomLayout } from "@/components/classroom/ClassroomLayout";
import { SidebarContent } from "@/components/classroom/SidebarContent";
import { VideoPanel } from "@/components/classroom/video/VideoPanel";
import { UnifiedContentViewer } from "@/components/classroom/content/UnifiedContentViewer";
import { StudentInteractions } from "@/components/classroom/StudentInteractions";
import { useClassroomState } from "@/hooks/useClassroomState";

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
    avatar: "https://github.com/sadmann7.png",
    isTeacher: false,
    isMuted: true,
    isCameraOff: true,
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
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const {
    studentName,
    points,
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
  } = useClassroomState();

  // Track scroll position with optimized handling
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handler for toggling student controls
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

  // Handle student interactions
  const handleMessageStudent = (studentId: string) => {
    toggleChat();
  };

  const handleToggleSpotlight = (studentId: string) => {
    handleLayoutChange("spotlight");
  };

  const currentUser = mockVideoFeeds.find(feed => feed.id === "student1");
  const isTeacher = currentUser?.isTeacher || false;
  const studentDisplayName = currentUser?.name || "Student";

  // Calculate movement with optimized transform
  const videoTransform = `translateY(${scrollPosition * 0.5}px)`;

  const mainContent = (
    <div className="w-full flex flex-col gap-4 h-full">
      {/* Compact Video Panel - Moves down with scroll */}
      <div 
        className="w-full transition-transform duration-200 ease-out"
        style={{ 
          transform: videoTransform
        }}
      >
        <div className="bg-black rounded-lg p-2 shadow-lg">
          <div className="flex gap-2 overflow-x-auto">
            {mockVideoFeeds.map((feed) => (
              <div 
                key={feed.id} 
                className="flex-shrink-0 w-32 h-20 bg-muted-foreground/20 rounded overflow-hidden relative"
              >
                <div className="h-full w-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">{feed.name}</span>
                </div>
                
                {/* Status indicators */}
                <div className="absolute top-1 left-1">
                  {feed.isTeacher && (
                    <span className="bg-teal-500 text-white text-[8px] px-1 py-0.5 rounded">T</span>
                  )}
                  {feed.id === "student1" && (
                    <span className="bg-purple-500 text-white text-[8px] px-1 py-0.5 rounded ml-1">You</span>
                  )}
                </div>

                {/* Mute indicator */}
                {feed.isMuted && (
                  <div className="absolute bottom-1 right-1 bg-red-500 rounded-full p-0.5">
                    <div className="w-2 h-2"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Material Content - Below videos with enough height to enable scrolling */}
      <div className="flex-1 min-h-[150vh]">
        <UnifiedContentViewer 
          isTeacher={isTeacher}
          studentName={studentDisplayName}
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

  // Behind the scenes component for student interactions
  const studentInteractions = (
    <StudentInteractions
      students={mockStudents}
      onMessageStudent={handleMessageStudent}
      onToggleSpotlight={handleToggleSpotlight}
    />
  );

  return (
    <>
      {studentInteractions}
      <ClassroomLayout
        studentName={studentName}
        points={points}
        mainContent={mainContent}
        sidebarContent={sidebarContent}
      />
    </>
  );
};

export default ESLClassroom;
