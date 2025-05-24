
import React from "react";
import { ClassroomLayout } from "@/components/classroom/ClassroomLayout";
import { SidebarContent } from "@/components/classroom/SidebarContent";
import { OneOnOneContent } from "@/components/classroom/OneOnOneContent";
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

  // Handler for toggling student controls
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
    />
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

  return (
    <ClassroomLayout
      studentName={studentName}
      points={points}
      mainContent={mainContent}
      sidebarContent={sidebarContent}
    />
  );
};

export default OneOnOneClassroom;
