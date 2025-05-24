
import React from "react";
import { ClassroomLayout } from "@/components/classroom/ClassroomLayout";
import { SidebarContent } from "@/components/classroom/SidebarContent";
import { OneOnOneContent } from "@/components/classroom/OneOnOneContent";
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

  const mainContent = (
    <OneOnOneContent
      videoFeeds={mockVideoFeeds}
      students={mockStudents}
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
