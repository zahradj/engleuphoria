
import React, { useState } from "react";
import { VideoFeed } from "./VideoFeed";
import { type VideoFeedType } from "./types";

interface OneOnOneVideoPanelProps {
  feeds: VideoFeedType[];
  currentUserId: string;
  onToggleMute: (id: string) => void;
  onToggleCamera: (id: string) => void;
  onRaiseHand?: (id: string) => void;
}

export function OneOnOneVideoPanel({
  feeds,
  currentUserId,
  onToggleMute,
  onToggleCamera,
  onRaiseHand
}: OneOnOneVideoPanelProps) {
  // Find the teacher and student feeds
  const teacherFeed = feeds.find(feed => feed.isTeacher);
  const studentFeed = feeds.find(feed => feed.id === currentUserId) || feeds.find(feed => !feed.isTeacher);
  
  const isCurrentUser = (id: string) => id === currentUserId;

  // If there's no teacher or student, show nothing
  if (!teacherFeed || !studentFeed) return null;

  return (
    <div className="bg-black rounded-lg overflow-hidden shadow-md">
      <div className="grid grid-cols-2 gap-2 p-2">
        {/* Teacher video */}
        <div className="aspect-video relative bg-muted-foreground/20 rounded overflow-hidden">
          <VideoFeed
            feed={teacherFeed}
            isSmall={false}
            isCurrentUser={isCurrentUser(teacherFeed.id)}
            onToggleMute={onToggleMute}
            onToggleCamera={onToggleCamera}
            onRaiseHand={onRaiseHand}
          />
        </div>

        {/* Student video */}
        <div className="aspect-video relative bg-muted-foreground/20 rounded overflow-hidden">
          <VideoFeed
            feed={studentFeed}
            isSmall={false}
            isCurrentUser={isCurrentUser(studentFeed.id)}
            onToggleMute={onToggleMute}
            onToggleCamera={onToggleCamera}
            onRaiseHand={onRaiseHand}
          />
        </div>
      </div>
    </div>
  );
}
