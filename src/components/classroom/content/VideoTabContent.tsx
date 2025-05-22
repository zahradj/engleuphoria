
import React from "react";
import { VideoPanel } from "@/components/classroom/video/VideoPanel";
import { TeachingMaterial } from "@/components/classroom/TeachingMaterial";

interface VideoTabContentProps {
  videoFeeds: Array<{
    id: string;
    name: string;
    isTeacher: boolean;
    isMuted: boolean;
    isCameraOff: boolean;
    isHandRaised?: boolean;
  }>;
  currentUserId: string;
  isTeacherView: boolean;
  currentPage: number;
  onToggleMute: (id: string) => void;
  onToggleVideo: (id: string) => void;
  onToggleHand: (id: string) => void;
  onPageChange: (page: number) => void;
}

export function VideoTabContent({
  videoFeeds,
  currentUserId,
  isTeacherView,
  currentPage,
  onToggleMute,
  onToggleVideo,
  onToggleHand,
  onPageChange
}: VideoTabContentProps) {
  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="w-full">
        <VideoPanel
          videoFeeds={videoFeeds}
          currentUserId={currentUserId}
          onToggleMute={onToggleMute}
          onToggleVideo={onToggleVideo}
          onToggleHand={onToggleHand}
          oneOnOneMode={true}
          currentPage={currentPage}
        />
      </div>
      <div className="w-full">
        <TeachingMaterial
          materialType="pdf"
          source={isTeacherView ? "Teacher_ESL_Lesson.pdf" : "ESL_Animals_Lesson.pdf"}
          currentPage={currentPage}
          totalPages={5}
          allowAnnotation={isTeacherView}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
