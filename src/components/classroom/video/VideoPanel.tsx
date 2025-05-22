
import React from "react";
import { VideoConferencePanel } from "@/components/classroom/VideoConferencePanel";

interface VideoFeedType {
  id: string;
  name: string;
  isTeacher: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
  isHandRaised?: boolean;
}

interface VideoPanelProps {
  videoFeeds: VideoFeedType[];
  currentUserId: string;
  onToggleMute: (id: string) => void;
  onToggleVideo: (id: string) => void;
  onToggleHand: (id: string) => void;
}

export function VideoPanel({
  videoFeeds,
  currentUserId,
  onToggleMute,
  onToggleVideo,
  onToggleHand
}: VideoPanelProps) {
  return (
    <VideoConferencePanel
      feeds={videoFeeds}
      currentUserId={currentUserId}
      onToggleMute={onToggleMute}
      onToggleCamera={onToggleVideo}
      onRaiseHand={onToggleHand}
    />
  );
}
