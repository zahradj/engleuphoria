
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Circle, 
  Square,
  PhoneCall,
  PhoneOff,
  Users
} from "lucide-react";
import { useVideoRoom } from "@/hooks/useVideoRoom";

interface OneOnOneTopBarProps {
  classTime: number;
  studentName: string;
  studentLevel: string;
  isMuted: boolean;
  isCameraOff: boolean;
  isRecording: boolean;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onToggleRecording: () => void;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export function OneOnOneTopBar({
  classTime,
  studentName,
  studentLevel,
  isMuted,
  isCameraOff,
  isRecording,
  onToggleMute,
  onToggleCamera,
  onToggleRecording
}: OneOnOneTopBarProps) {
  const {
    isConnected,
    participants,
    isLoading,
    joinRoom,
    leaveRoom
  } = useVideoRoom({
    roomId: "classroom-room-1",
    userId: "teacher-1",
    displayName: "Ms. Johnson"
  });

  return (
    <Card className="w-full shadow-sm">
      <div className="p-4 flex items-center justify-between">
        {/* Left: Student Info */}
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold">{studentName}</h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {studentLevel}
              </Badge>
              <div className="text-xs text-gray-500">
                One-on-One Lesson
              </div>
            </div>
          </div>
        </div>

        {/* Center: Class Timer */}
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-primary">
            {formatTime(classTime)}
          </div>
          <div className="text-xs text-gray-500">Class Duration</div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          {/* Video Connection Controls */}
          <div className="flex items-center gap-2 mr-4">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : isLoading ? 'bg-yellow-500' : 'bg-gray-400'
              }`}></div>
              <span className="text-xs text-gray-600">
                {isConnected ? 'Connected' : isLoading ? 'Connecting...' : 'Ready'}
              </span>
              {participants.size > 0 && (
                <div className="flex items-center gap-1 ml-1">
                  <Users size={12} className="text-gray-400" />
                  <span className="text-xs text-gray-400">{participants.size}</span>
                </div>
              )}
            </div>
            
            {!isConnected ? (
              <Button 
                onClick={joinRoom} 
                size="sm"
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1"
              >
                <PhoneCall size={12} className="mr-1" />
                {isLoading ? 'Joining...' : 'Join'}
              </Button>
            ) : (
              <Button 
                onClick={leaveRoom} 
                size="sm"
                variant="destructive"
                className="text-xs px-3 py-1"
              >
                <PhoneOff size={12} className="mr-1" />
                Leave
              </Button>
            )}
          </div>

          {/* Audio/Video Controls */}
          <Button
            variant={isMuted ? "destructive" : "outline"}
            size="sm"
            onClick={onToggleMute}
            className="rounded-full w-10 h-10 p-0"
          >
            {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
          </Button>
          
          <Button
            variant={isCameraOff ? "destructive" : "outline"}
            size="sm"
            onClick={onToggleCamera}
            className="rounded-full w-10 h-10 p-0"
          >
            {isCameraOff ? <VideoOff size={16} /> : <Video size={16} />}
          </Button>

          {/* Recording Control */}
          <Button
            variant={isRecording ? "destructive" : "outline"}
            size="sm"
            onClick={onToggleRecording}
            className="rounded-full w-10 h-10 p-0"
          >
            {isRecording ? <Square size={16} /> : <Circle size={16} />}
          </Button>
        </div>
      </div>
    </Card>
  );
}
