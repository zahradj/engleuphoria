
import React, { ReactNode, useState } from "react";
import { TeachingMaterial } from "@/components/classroom/TeachingMaterial";
import { VideoPanel } from "@/components/classroom/video/VideoPanel";
import { ESLWhiteboard } from "@/components/classroom/ESLWhiteboard";
import { StudentsTab } from "@/components/classroom/tabs/StudentsTab";
import { LessonTab } from "@/components/classroom/tabs/LessonTab";

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
  
  const renderVideoComponent = () => (
    <VideoPanel
      videoFeeds={videoFeeds}
      currentUserId={currentUserId}
      onToggleMute={onToggleMute}
      onToggleVideo={onToggleVideo}
      onToggleHand={onToggleHand}
      oneOnOneMode={true}
      currentPage={currentPage}
    />
  );
  
  // Content for video tab
  if (activeTab === "video") {
    return (
      <div className="grid grid-cols-12 gap-6 w-full">
        <div className="col-span-12 lg:col-span-8">
          <TeachingMaterial
            materialType="pdf"
            source={isTeacherView ? "Teacher_ESL_Lesson.pdf" : "ESL_Animals_Lesson.pdf"}
            currentPage={currentPage}
            totalPages={5}
            allowAnnotation={isTeacherView}
            onPageChange={setCurrentPage}
          />
        </div>
        <div className="col-span-12 lg:col-span-4">
          {renderVideoComponent()}
        </div>
      </div>
    );
  }
  
  // Content for whiteboard tab
  if (activeTab === "whiteboard") {
    return (
      <div className="grid grid-cols-12 gap-6 w-full">
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white rounded-lg border shadow-sm p-0 h-full min-h-[500px]">
            <ESLWhiteboard isCollaborative={true} />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4">
          {renderVideoComponent()}
        </div>
      </div>
    );
  }
  
  // Content for students/lessons tab
  return (
    <div className="grid grid-cols-12 gap-6 w-full">
      <div className="col-span-12 lg:col-span-8">
        <div className="bg-white rounded-lg border shadow-sm p-4 h-full">
          {isTeacherView ? (
            <StudentsTab
              students={students}
              onMessageStudent={onMessageStudent}
              onToggleSpotlight={onToggleSpotlight}
            />
          ) : (
            <LessonTab
              quizQuestions={quizQuestions}
              onQuizComplete={onQuizComplete}
            />
          )}
        </div>
      </div>
      <div className="col-span-12 lg:col-span-4">
        {renderVideoComponent()}
      </div>
    </div>
  );
}
