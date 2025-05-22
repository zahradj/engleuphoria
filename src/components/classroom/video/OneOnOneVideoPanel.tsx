
import React, { useState, useEffect } from "react";
import { VideoFeed } from "./VideoFeed";
import { type VideoFeedType } from "./types";

interface OneOnOneVideoPanelProps {
  feeds: VideoFeedType[];
  currentUserId: string;
  onToggleMute: (id: string) => void;
  onToggleCamera: (id: string) => void;
  onRaiseHand?: (id: string) => void;
  currentPage?: number;
}

export function OneOnOneVideoPanel({
  feeds,
  currentUserId,
  onToggleMute,
  onToggleCamera,
  onRaiseHand,
  currentPage = 1
}: OneOnOneVideoPanelProps) {
  // Find the teacher and student feeds
  const teacherFeed = feeds.find(feed => feed.isTeacher);
  const studentFeed = feeds.find(feed => feed.id === currentUserId) || feeds.find(feed => !feed.isTeacher);
  
  const isCurrentUser = (id: string) => id === currentUserId;
  const [animating, setAnimating] = useState(false);
  const [prevPage, setPrevPage] = useState(currentPage);

  // Calculate position based on current page (each page moves 50px down)
  const topOffset = (currentPage - 1) * 50;

  useEffect(() => {
    if (prevPage !== currentPage) {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), 500);
      setPrevPage(currentPage);
      return () => clearTimeout(timer);
    }
  }, [currentPage, prevPage]);

  // If there's no teacher or student, show nothing
  if (!teacherFeed || !studentFeed) return null;

  return (
    <div className="bg-black rounded-lg overflow-hidden shadow-md">
      <div 
        className={`grid grid-cols-2 gap-2 p-2 transition-all duration-500 ease-in-out ${animating ? 'animate-fade-in' : ''}`}
        style={{ transform: `translateY(${topOffset}px)` }}
      >
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
