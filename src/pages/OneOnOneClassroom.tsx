
import React, { useState, useEffect } from "react";
import { ClassroomLayout } from "@/components/classroom/ClassroomLayout";
import { SidebarContent } from "@/components/classroom/SidebarContent";
import { OneOnOneContent } from "@/components/classroom/OneOnOneContent";
import { StudentInteractions } from "@/components/classroom/StudentInteractions";
import { useClassroomState } from "@/hooks/useClassroomState";

// Mock data for one-on-one session
const mockOneOnOneFeeds = [
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
];

// Mock student data for one-on-one
const mockOneOnOneStudents = [
  {
    id: "student1",
    name: "Current Student",
    avatar: "https://github.com/shadcn.png",
    status: "speaking",
    isCurrentUser: true,
  },
];

const OneOnOneClassroom = () => {
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

  // Track scroll position for video panel movement
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

  // Calculate video panel movement
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
            {mockOneOnOneFeeds.map((feed) => (
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
      
      {/* Content Area - With enough height to enable scrolling */}
      <div className="flex-1 min-h-[150vh]">
        <OneOnOneContent
          videoFeeds={mockOneOnOneFeeds}
          students={mockOneOnOneStudents}
          currentUserId="student1"
          isTeacherView={isTeacherView}
          isMuted={isMuted}
          isVideoOff={isVideoOff}
          isHandRaised={isHandRaised}
          onToggleMute={handleToggleMute}
          onToggleVideo={handleToggleVideo}
          onToggleHand={handleToggleHand}
          onMessageStudent={handleMessageStudent}
          onToggleSpotlight={handleToggleSpotlight}
          onLayoutChange={handleLayoutChange}
        />
      </div>
    </div>
  );

  const sidebarContent = (
    <SidebarContent 
      studentName={studentName}
      isChatOpen={isChatOpen}
      students={mockOneOnOneStudents}
      isTeacherView={isTeacherView}
      toggleChat={toggleChat}
    />
  );

  // Behind the scenes component for student interactions
  const studentInteractions = (
    <StudentInteractions
      students={mockOneOnOneStudents}
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

export default OneOnOneClassroom;
