
import React, { useState } from "react";
import { VideoTabContent } from "./VideoTabContent";
import { WhiteboardTabContent } from "./WhiteboardTabContent";
import { StudentsLessonsTabContent } from "./StudentsLessonsTabContent";

interface VideoFeedType {
  id: string;
  name: string;
  isTeacher: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
  isHandRaised?: boolean;
}

interface StudentType {
  id: string;
  name: string;
  avatar: string;
  status: string;
  isCurrentUser: boolean;
}

interface QuizQuestionType {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface ContentLayoutProps {
  activeTab: string;
  videoFeeds: VideoFeedType[];
  students: StudentType[];
  quizQuestions: QuizQuestionType[];
  currentUserId: string;
  isTeacherView: boolean;
  onToggleMute: (id: string) => void;
  onToggleVideo: (id: string) => void;
  onToggleHand: (id: string) => void;
  onQuizComplete: (score: number, total: number) => void;
  onMessageStudent: (studentId: string) => void;
  onToggleSpotlight: (studentId: string) => void;
}

export function ContentLayout({
  activeTab,
  videoFeeds,
  students,
  quizQuestions,
  currentUserId,
  isTeacherView,
  onToggleMute,
  onToggleVideo,
  onToggleHand,
  onQuizComplete,
  onMessageStudent,
  onToggleSpotlight
}: ContentLayoutProps) {
  // Add state to track current page
  const [currentPage, setCurrentPage] = useState(1);
  
  // Content for video tab
  if (activeTab === "video") {
    return (
      <VideoTabContent
        videoFeeds={videoFeeds}
        currentUserId={currentUserId}
        isTeacherView={isTeacherView}
        currentPage={currentPage}
        onToggleMute={onToggleMute}
        onToggleVideo={onToggleVideo}
        onToggleHand={onToggleHand}
        onPageChange={setCurrentPage}
      />
    );
  }
  
  // Content for whiteboard tab
  if (activeTab === "whiteboard") {
    return (
      <WhiteboardTabContent
        videoFeeds={videoFeeds}
        currentUserId={currentUserId}
        currentPage={currentPage}
        onToggleMute={onToggleMute}
        onToggleVideo={onToggleVideo}
        onToggleHand={onToggleHand}
      />
    );
  }
  
  // Content for students/lessons tab
  return (
    <StudentsLessonsTabContent
      videoFeeds={videoFeeds}
      students={students}
      quizQuestions={quizQuestions}
      currentUserId={currentUserId}
      isTeacherView={isTeacherView}
      currentPage={currentPage}
      onToggleMute={onToggleMute}
      onToggleVideo={onToggleVideo}
      onToggleHand={onToggleHand}
      onQuizComplete={onQuizComplete}
      onMessageStudent={onMessageStudent}
      onToggleSpotlight={onToggleSpotlight}
    />
  );
}
