
import React, { useState, useEffect, useRef } from "react";
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
  const isCurrentUser = (id: string) => id === currentUserId;
  const [animating, setAnimating] = useState(false);
  const [prevPage, setPrevPage] = useState(currentPage);
  const [scrollOffset, setScrollOffset] = useState(0);
  const maxScrollOffset = 200; // Maximum amount the panel will move down

  // Determine if current user is teacher or student
  const isCurrentUserTeacher = feeds.find(feed => feed.id === currentUserId)?.isTeacher || false;
  
  // Find the teacher and student feeds
  const teacherFeed = feeds.find(feed => feed.isTeacher);
  const studentFeed = isCurrentUserTeacher 
    ? feeds.find(feed => !feed.isTeacher) 
    : feeds.find(feed => feed.id === currentUserId) || feeds.find(feed => !feed.isTeacher);

  // Calculate position based on current page (each page moves 50px down) and scroll position
  const topOffset = (currentPage - 1) * 50 + scrollOffset;

  useEffect(() => {
    if (prevPage !== currentPage) {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), 500);
      setPrevPage(currentPage);
      return () => clearTimeout(timer);
    }
  }, [currentPage, prevPage]);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Calculate scroll offset with a limit
      const newOffset = Math.min(scrollPosition * 0.3, maxScrollOffset);
      setScrollOffset(newOffset);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // If there's no teacher or student, show nothing
  if (!teacherFeed || !studentFeed) return null;

  return (
    <div className="bg-black rounded-lg overflow-hidden shadow-md relative">
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
          {isCurrentUserTeacher && (
            <div className="absolute bottom-0 left-0 bg-green-500/80 text-white text-xs px-2 py-1 rounded-tr">
              You (Teacher)
            </div>
          )}
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
          {!isCurrentUserTeacher && isCurrentUser(studentFeed.id) && (
            <div className="absolute bottom-0 left-0 bg-blue-500/80 text-white text-xs px-2 py-1 rounded-tr">
              You (Student)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
