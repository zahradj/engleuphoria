
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, BookOpen, Book } from "lucide-react";
import { OneOnOneChat } from "./OneOnOneChat";
import { OneOnOneHomework } from "./OneOnOneHomework";
import { EnhancedDictionary } from "./dictionary/EnhancedDictionary";
import { CompactVideoFeed } from "../video/CompactVideoFeed";
import { useWebRTC } from "@/hooks/useWebRTC";

interface OneOnOneRightPanelProps {
  studentName: string;
  studentXP: number;
  activeRightTab: string;
  onTabChange: (tab: string) => void;
  currentUserId: string;
  currentUserName: string;
  isTeacher: boolean;
}

export function OneOnOneRightPanel({
  studentName,
  studentXP,
  activeRightTab,
  onTabChange,
  currentUserId,
  currentUserName,
  isTeacher
}: OneOnOneRightPanelProps) {
  const {
    streams,
    localStream,
    isConnected,
    isMuted,
    isCameraOff,
    connectToRoom,
    disconnect,
    toggleVideo,
    toggleAudio
  } = useWebRTC("classroom-room-1", isTeacher ? "teacher-1" : "student-1");

  // For teacher view: show student video (remote stream)
  // For student view: show own video (local stream)
  const videoStream = isTeacher ? 
    streams.find(s => s.id === "student-1")?.stream || null : 
    localStream;

  const displayName = isTeacher ? studentName : currentUserName;
  const userRole = isTeacher ? 'student' : 'student';
  const isOwnVideo = !isTeacher; // Only students see their own video here

  // Handle adding word to vocabulary
  const handleAddToVocab = (word: string, definition: string) => {
    console.log('Adding to vocabulary:', word, definition);
    // This would integrate with student vocabulary tracking
  };

  return (
    <Card className="h-full shadow-lg flex flex-col overflow-hidden">
      {/* Student Video - Consistent with other video components */}
      <div className="p-3 flex-shrink-0">
        <CompactVideoFeed
          stream={videoStream}
          isConnected={isConnected}
          isMuted={isMuted}
          isCameraOff={isCameraOff}
          userName={displayName}
          userRole={userRole}
          isOwnVideo={isOwnVideo}
          onToggleMute={isOwnVideo ? toggleAudio : undefined}
          onToggleCamera={isOwnVideo ? toggleVideo : undefined}
          onJoinCall={isOwnVideo ? connectToRoom : undefined}
          onLeaveCall={isOwnVideo ? disconnect : undefined}
        />
      </div>

      {/* Tabs Navigation - Fixed height */}
      <div className="border-b p-2 flex-shrink-0">
        <div className="flex gap-1">
          <Button
            variant={activeRightTab === "chat" ? "default" : "ghost"}
            size="sm"
            onClick={() => onTabChange("chat")}
            className="text-xs px-3 py-1"
          >
            <MessageCircle size={12} className="mr-1" />
            Chat
          </Button>
          <Button
            variant={activeRightTab === "homework" ? "default" : "ghost"}
            size="sm"
            onClick={() => onTabChange("homework")}
            className="text-xs px-3 py-1"
          >
            <BookOpen size={12} className="mr-1" />
            Tasks
          </Button>
          <Button
            variant={activeRightTab === "dictionary" ? "default" : "ghost"}
            size="sm"
            onClick={() => onTabChange("dictionary")}
            className="text-xs px-3 py-1"
          >
            <Book size={12} className="mr-1" />
            Dictionary
          </Button>
        </div>
      </div>

      {/* Tab Content - Flexible height with scroll */}
      <div className="flex-1 overflow-y-auto">
        <div className="h-full p-3">
          {activeRightTab === "chat" && <OneOnOneChat />}
          {activeRightTab === "homework" && <OneOnOneHomework />}
          {activeRightTab === "dictionary" && <EnhancedDictionary onAddToVocab={handleAddToVocab} />}
        </div>
      </div>

      {/* XP Progress Bar - Only show for students or when teacher is viewing student progress */}
      <div className="p-3 border-t bg-gradient-to-r from-purple-50 to-purple-100 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{displayName}</span>
          <Badge className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1">
            Level {Math.floor(studentXP / 100)}
          </Badge>
        </div>
        
        <div>
          <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
            <span>XP Progress</span>
            <span>{studentXP % 100}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-yellow-400 h-1.5 rounded-full transition-all duration-300" 
              style={{ width: `${(studentXP % 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Card>
  );
}
