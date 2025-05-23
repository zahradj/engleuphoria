
import React from "react";
import { VideoPanel } from "@/components/classroom/video/VideoPanel";
import { UnifiedContentViewer } from "./UnifiedContentViewer";

interface WhiteboardTabContentProps {
  videoFeeds: Array<{
    id: string;
    name: string;
    isTeacher: boolean;
    isMuted: boolean;
    isCameraOff: boolean;
    isHandRaised?: boolean;
  }>;
  currentUserId: string;
  currentPage: number;
  onToggleMute: (id: string) => void;
  onToggleVideo: (id: string) => void;
  onToggleHand: (id: string) => void;
}

export function WhiteboardTabContent({
  videoFeeds,
  currentUserId,
  currentPage,
  onToggleMute,
  onToggleVideo,
  onToggleHand
}: WhiteboardTabContentProps) {
  const currentUser = videoFeeds.find(feed => feed.id === currentUserId);
  const isTeacher = currentUser?.isTeacher || false;
  const studentName = currentUser?.name || "Student";

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
      <div className="lg:col-span-3">
        <UnifiedContentViewer 
          isTeacher={isTeacher}
          studentName={studentName}
        />
      </div>
      <div className="lg:col-span-1">
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
  );
}
