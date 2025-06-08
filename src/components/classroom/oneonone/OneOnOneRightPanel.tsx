
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, BookOpen } from "lucide-react";
import { OneOnOneChat } from "./OneOnOneChat";
import { OneOnOneHomework } from "./OneOnOneHomework";
import { TeacherVideoFeed } from "../video/TeacherVideoFeed";
import { useWebRTC } from "@/hooks/useWebRTC";

interface OneOnOneRightPanelProps {
  studentName: string;
  studentXP: number;
  activeRightTab: string;
  onTabChange: (tab: string) => void;
}

export function OneOnOneRightPanel({
  studentName,
  studentXP,
  activeRightTab,
  onTabChange
}: OneOnOneRightPanelProps) {
  const {
    streams,
    isConnected,
    isMuted,
    isCameraOff,
    connectToRoom,
    disconnect,
    toggleVideo,
    toggleAudio
  } = useWebRTC("classroom-room-1", "student-1");

  // Find student stream (remote stream for teacher view, local stream for student view)
  const studentStream = streams.find(s => s.id === "student-1")?.stream || null;

  return (
    <Card className="h-full shadow-lg flex flex-col overflow-hidden">
      {/* Student Info Header - Fixed height */}
      <div className="p-3 border-b bg-gradient-to-r from-purple-50 to-purple-100 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-700 text-sm">{studentName}</h3>
          <Badge className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1">
            Level {Math.floor(studentXP / 100)}
          </Badge>
        </div>
        
        {/* Student video */}
        <TeacherVideoFeed
          stream={studentStream}
          isConnected={isConnected}
          isMuted={isMuted}
          isCameraOff={isCameraOff}
          onToggleMute={toggleAudio}
          onToggleCamera={toggleVideo}
          onJoinCall={connectToRoom}
          onLeaveCall={disconnect}
        />
        
        {/* XP Progress */}
        <div className="mt-2">
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
        </div>
      </div>

      {/* Tab Content - Flexible height */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full p-3">
          {activeRightTab === "chat" && <OneOnOneChat />}
          {activeRightTab === "homework" && <OneOnOneHomework />}
        </div>
      </div>
    </Card>
  );
}
