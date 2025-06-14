
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
  Users,
  Hand,
  Monitor,
  Wifi,
  WifiOff
} from "lucide-react";
import { useEnhancedClassroom } from "@/hooks/useEnhancedClassroom";

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
  roomId: string;
  currentUserId: string;
  currentUserName: string;
  isTeacher: boolean;
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
  onToggleRecording,
  roomId,
  currentUserId,
  currentUserName,
  isTeacher
}: OneOnOneTopBarProps) {
  const {
    isConnected,
    connectionQuality,
    error,
    session,
    participants,
    isRecording: enhancedIsRecording,
    joinClassroom,
    leaveClassroom,
    toggleRecording: enhancedToggleRecording,
    toggleMicrophone,
    toggleCamera,
    raiseHand,
    startScreenShare
  } = useEnhancedClassroom({
    roomId,
    userId: currentUserId,
    displayName: currentUserName,
    userRole: isTeacher ? 'teacher' : 'student'
  });

  const handleToggleMute = () => {
    toggleMicrophone();
    onToggleMute();
  };

  const handleToggleCamera = () => {
    toggleCamera();
    onToggleCamera();
  };

  const handleToggleRecording = () => {
    if (isTeacher) {
      enhancedToggleRecording();
      onToggleRecording();
    }
  };

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

        {/* Center: Class Timer & Connection Status */}
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-primary">
            {formatTime(classTime)}
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
              <span>{isConnected ? 'Connected' : 'Ready'}</span>
              {connectionQuality && isConnected && (
                <span className="text-gray-400">({connectionQuality})</span>
              )}
            </div>
            {participants.length > 0 && (
              <div className="flex items-center gap-1">
                <Users size={12} className="text-gray-400" />
                <span className="text-gray-400">{participants.length}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Enhanced Video Controls */}
        <div className="flex items-center gap-2">
          {/* Connection Control */}
          {!isConnected ? (
            <Button 
              onClick={joinClassroom} 
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1"
            >
              <PhoneCall size={12} className="mr-1" />
              Join
            </Button>
          ) : (
            <Button 
              onClick={leaveClassroom} 
              size="sm"
              variant="destructive"
              className="text-xs px-3 py-1"
            >
              <PhoneOff size={12} className="mr-1" />
              Leave
            </Button>
          )}

          {/* Microphone Control */}
          <Button
            variant={isMuted ? "destructive" : "outline"}
            size="sm"
            onClick={handleToggleMute}
            className="rounded-full w-10 h-10 p-0"
            disabled={!isConnected}
          >
            {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
          </Button>
          
          {/* Camera Control */}
          <Button
            variant={isCameraOff ? "destructive" : "outline"}
            size="sm"
            onClick={handleToggleCamera}
            className="rounded-full w-10 h-10 p-0"
            disabled={!isConnected}
          >
            {isCameraOff ? <VideoOff size={16} /> : <Video size={16} />}
          </Button>

          {/* Raise Hand Control */}
          <Button
            variant="outline"
            size="sm"
            onClick={raiseHand}
            className="rounded-full w-10 h-10 p-0"
            disabled={!isConnected}
          >
            <Hand size={16} />
          </Button>

          {/* Screen Share Control */}
          <Button
            variant="outline"
            size="sm"
            onClick={startScreenShare}
            className="rounded-full w-10 h-10 p-0"
            disabled={!isConnected}
          >
            <Monitor size={16} />
          </Button>

          {/* Recording Control - Teacher Only */}
          {isTeacher && (
            <Button
              variant={enhancedIsRecording ? "destructive" : "outline"}
              size="sm"
              onClick={handleToggleRecording}
              className="rounded-full w-10 h-10 p-0"
              disabled={!isConnected}
            >
              {enhancedIsRecording ? <Square size={16} /> : <Circle size={16} />}
            </Button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-4 pb-2">
          <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        </div>
      )}
    </Card>
  );
}
