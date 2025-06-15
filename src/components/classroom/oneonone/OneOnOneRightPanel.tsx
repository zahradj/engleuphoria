
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MessageCircle, BookOpen, Book, Trophy, Star, TrendingUp } from "lucide-react";
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

  // Calculate level and progress
  const currentLevel = Math.floor(studentXP / 100);
  const xpInCurrentLevel = studentXP % 100;
  const xpToNextLevel = 100 - xpInCurrentLevel;

  // Handle adding word to vocabulary
  const handleAddToVocab = (word: string, definition: string) => {
    console.log('Adding to vocabulary:', word, definition);
    // This would integrate with student vocabulary tracking
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      {/* Enhanced Student Video with Progress */}
      <Card className="flex-shrink-0 shadow-lg overflow-hidden">
        <div className="p-3">
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

        {/* Enhanced XP Progress Display */}
        <div className="px-3 pb-3 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-800">{displayName}</span>
              {!isTeacher && (
                <Badge className="bg-green-100 text-green-700 text-xs">
                  <TrendingUp size={10} className="mr-1" />
                  Active
                </Badge>
              )}
            </div>
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1">
              <Star size={10} className="mr-1" />
              Level {currentLevel}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-gray-600">
              <span>XP Progress</span>
              <span className="font-semibold">{xpInCurrentLevel}/100</span>
            </div>
            <Progress value={xpInCurrentLevel} className="h-2" />
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">{xpToNextLevel} XP to next level</span>
              <div className="flex items-center gap-1 text-yellow-600">
                <Trophy size={10} />
                <span>{studentXP} total</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Enhanced Tabs Navigation */}
      <Card className="flex-shrink-0 p-2 shadow-sm">
        <div className="flex gap-1">
          <Button
            variant={activeRightTab === "chat" ? "default" : "ghost"}
            size="sm"
            onClick={() => onTabChange("chat")}
            className="text-xs px-3 py-2 flex-1"
          >
            <MessageCircle size={12} className="mr-1" />
            Chat
          </Button>
          <Button
            variant={activeRightTab === "homework" ? "default" : "ghost"}
            size="sm"
            onClick={() => onTabChange("homework")}
            className="text-xs px-3 py-2 flex-1"
          >
            <BookOpen size={12} className="mr-1" />
            Tasks
          </Button>
          <Button
            variant={activeRightTab === "dictionary" ? "default" : "ghost"}
            size="sm"
            onClick={() => onTabChange("dictionary")}
            className="text-xs px-3 py-2 flex-1"
          >
            <Book size={12} className="mr-1" />
            Dictionary
          </Button>
        </div>
      </Card>

      {/* Scrollable Tab Content */}
      <Card className="flex-1 overflow-hidden shadow-lg">
        <div className="h-full p-3 overflow-y-auto">
          {activeRightTab === "chat" && <OneOnOneChat />}
          {activeRightTab === "homework" && <OneOnOneHomework />}
          {activeRightTab === "dictionary" && <EnhancedDictionary onAddToVocab={handleAddToVocab} />}
        </div>
      </Card>
    </div>
  );
}
