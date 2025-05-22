
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
      className={`bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden shadow-lg ${
        position === "fixed" 
          ? "fixed top-4 right-4 z-50 max-w-md" 
          : "w-full max-w-3xl"
      }`}
    >
      {/* Header with subtle gradient */}
      <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 px-4 py-2 flex justify-between items-center">
        <h3 className="text-white text-sm font-medium">Live Session</h3>
        <div className="text-white/70 text-xs">
          {isCurrentUserTeacher ? "Teaching Mode" : "Student Mode"}
        </div>
      </div>

      <div 
        className={`flex flex-row gap-3 p-3 transition-all duration-500 ease-in-out ${animating ? 'animate-fade-in' : ''}`}
      >
        {/* Teacher video */}
        <div className="w-1/2 aspect-video relative bg-muted-foreground/20 rounded-lg overflow-hidden border border-white/10">
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
        <div className="w-1/2 aspect-video relative bg-muted-foreground/20 rounded-lg overflow-hidden border border-white/10">
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

      {/* Quick controls */}
      <div className="bg-slate-800/50 border-t border-white/5 p-2 flex justify-center space-x-2">
        <button 
          className="text-xs px-3 py-1 rounded bg-blue-500/20 text-white/80 hover:bg-blue-500/30 transition"
          onClick={() => onRaiseHand && onRaiseHand(currentUserId)}
        >
          Raise Hand
        </button>
        <button 
          className="text-xs px-3 py-1 rounded bg-green-500/20 text-white/80 hover:bg-green-500/30 transition"
          onClick={() => onToggleMute(currentUserId)}
        >
          Toggle Mute
        </button>
        <button 
          className="text-xs px-3 py-1 rounded bg-purple-500/20 text-white/80 hover:bg-purple-500/30 transition"
          onClick={() => onToggleCamera(currentUserId)}
        >
          Toggle Camera
        </button>
      </div>
    </div>
  );
}
