
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
  const isCurrentUser = (id: string) => id === currentUserId;
  const [animating, setAnimating] = useState(false);
  const [prevPage, setPrevPage] = useState(currentPage);
  const [position, setPosition] = useState("static");

  // Determine if current user is teacher or student
  const isCurrentUserTeacher = feeds.find(feed => feed.id === currentUserId)?.isTeacher || false;
  
  // Find the teacher and student feeds
  const teacherFeed = feeds.find(feed => feed.isTeacher);
  const studentFeed = isCurrentUserTeacher 
    ? feeds.find(feed => !feed.isTeacher) 
    : feeds.find(feed => feed.id === currentUserId) || feeds.find(feed => !feed.isTeacher);

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

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      // When scroll position exceeds threshold, make the panel fixed
      if (window.scrollY > 100) {
        setPosition("fixed");
      } else {
        setPosition("static");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // If there's no teacher or student, show nothing
  if (!teacherFeed || !studentFeed) return null;

  return (
    <div 
      className={`bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden shadow-lg w-full ${
        position === "fixed" 
          ? "fixed top-4 right-4 z-50 max-w-md" 
          : "relative"
      }`}
      style={{ transform: position === "static" ? `translateY(${topOffset}px)` : "none" }}
    >
      {/* Header with subtle gradient */}
      <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 px-4 py-2">
        <h3 className="text-white text-sm font-medium">Live Session</h3>
      </div>

      <div 
        className={`flex flex-col gap-3 p-3 transition-all duration-500 ease-in-out ${animating ? 'animate-fade-in' : ''}`}
      >
        {/* Teacher video - slightly larger */}
        <div className="w-full aspect-video relative bg-muted-foreground/20 rounded-lg overflow-hidden border border-white/10">
          <VideoFeed
            feed={teacherFeed}
            isSmall={false}
            isCurrentUser={isCurrentUser(teacherFeed.id)}
            onToggleMute={onToggleMute}
            onToggleCamera={onToggleCamera}
            onRaiseHand={onRaiseHand}
          />
          <div className="absolute top-2 left-2 bg-blue-500/80 text-white text-xs px-2 py-0.5 rounded">
            {teacherFeed.name} {isCurrentUserTeacher ? "(You)" : ""}
          </div>
        </div>

        {/* Student video */}
        <div className="w-full aspect-video relative bg-muted-foreground/20 rounded-lg overflow-hidden border border-white/10">
          <VideoFeed
            feed={studentFeed}
            isSmall={false}
            isCurrentUser={isCurrentUser(studentFeed.id)}
            onToggleMute={onToggleMute}
            onToggleCamera={onToggleCamera}
            onRaiseHand={onRaiseHand}
          />
          <div className="absolute top-2 left-2 bg-green-500/80 text-white text-xs px-2 py-0.5 rounded">
            {studentFeed.name} {!isCurrentUserTeacher && isCurrentUser(studentFeed.id) ? "(You)" : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
