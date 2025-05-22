
import React from "react";
import { VideoPanel } from "@/components/classroom/video/VideoPanel";
import { ESLWhiteboard } from "@/components/classroom/ESLWhiteboard";

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
        <ESLWhiteboard isCollaborative={true} />
      </div>
    </div>
  );
}
