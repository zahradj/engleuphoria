
import React, { useState } from "react";
import { VideoPanel } from "@/components/classroom/video/VideoPanel";
import { UnifiedContentViewer } from "@/components/classroom/content/UnifiedContentViewer";
import { useLanguage } from "@/contexts/LanguageContext";

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

interface OneOnOneContentProps {
  videoFeeds: VideoFeedType[];
  students: StudentType[];
  currentUserId: string;
  isTeacherView: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  isHandRaised: boolean;
  onToggleMute: (id: string) => void;
  onToggleVideo: (id: string) => void;
  onToggleHand: (id: string) => void;
}

export function OneOnOneContent({
  videoFeeds,
  students,
  currentUserId,
  isTeacherView,
  isMuted,
  isVideoOff,
  isHandRaised,
  onToggleMute,
  onToggleVideo,
  onToggleHand,
}: OneOnOneContentProps) {
  const { languageText } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);

  const currentUser = videoFeeds.find(feed => feed.id === currentUserId);
  const isTeacher = currentUser?.isTeacher || false;
  const studentName = currentUser?.name || "Student";

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      {/* Video Meeting Area - Positioned at the top */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            One-on-One Session
          </h2>
          <p className="text-sm text-gray-600">
            Private lesson with your teacher
          </p>
        </div>
        
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
      </div>

      {/* Lesson Content Area - Positioned below the video */}
      <div className="bg-white rounded-lg shadow-sm border p-4 flex-1">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-800">
            Lesson Materials
          </h3>
        </div>
        
        <UnifiedContentViewer 
          isTeacher={isTeacher}
          studentName={studentName}
        />
      </div>
    </div>
  );
}
