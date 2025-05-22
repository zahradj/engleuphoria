
import React from "react";
import { VideoConferencePanel } from "@/components/classroom/VideoConferencePanel";
import { OneOnOneVideoPanel } from "@/components/classroom/video/OneOnOneVideoPanel";

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
  oneOnOneMode?: boolean;
  currentPage?: number;
}

export function VideoPanel({
  videoFeeds,
  currentUserId,
  onToggleMute,
  onToggleVideo,
  onToggleHand,
  oneOnOneMode = false,
  currentPage = 1
}: VideoPanelProps) {
  // For 1-on-1 mode, use the OneOnOneVideoPanel component
  if (oneOnOneMode) {
    return (
      <OneOnOneVideoPanel
        feeds={videoFeeds}
        currentUserId={currentUserId}
        onToggleMute={onToggleMute}
        onToggleCamera={onToggleVideo}
        onRaiseHand={onToggleHand}
        currentPage={currentPage}
      />
    );
  }

  // Otherwise use the standard VideoConferencePanel
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
