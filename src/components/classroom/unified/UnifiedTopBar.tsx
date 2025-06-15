
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
  Crown,
  GraduationCap,
  Wifi,
  Signal
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  avatar?: string;
}

interface UnifiedTopBarProps {
  classTime: number;
  currentUser: UserProfile;
  enhancedClassroom: any;
  roomId: string;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export function UnifiedTopBar({
  classTime,
  currentUser,
  enhancedClassroom,
  roomId
}: UnifiedTopBarProps) {
  const {
    isConnected,
    connectionQuality,
    error,
    participants,
    isRecording,
    isMuted,
    isCameraOff,
    joinClassroom,
    leaveClassroom,
    toggleRecording,
    toggleMicrophone,
    toggleCamera,
    raiseHand,
    startScreenShare
  } = enhancedClassroom;

  const isTeacher = currentUser.role === 'teacher';
  const RoleIcon = isTeacher ? Crown : GraduationCap;

  const handleToggleRecording = () => {
    if (isTeacher) {
      toggleRecording();
    }
  };

  // Enhanced connection quality indicator
  const getConnectionColor = () => {
    if (!isConnected) return 'text-gray-400';
    switch (connectionQuality) {
      case 'excellent': return 'text-emerald-500';
      case 'good': return 'text-green-500';
      case 'fair': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="h-full flex items-center justify-between">
      {/* Enhanced Left: User Info with Animated Role Badge */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          {/* Animated Role Icon with Glow Effect */}
          <div className={`p-2 rounded-xl ${isTeacher ? 'bg-gradient-to-br from-purple-500 to-violet-600' : 'bg-gradient-to-br from-blue-500 to-cyan-600'} shadow-lg`}>
            <RoleIcon className="h-5 w-5 text-white" />
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {currentUser.name}
              </h2>
              {/* Animated Connection Status */}
              {isConnected && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <Signal className={`h-3 w-3 ${getConnectionColor()}`} />
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant={isTeacher ? "default" : "secondary"} 
                className={`text-xs font-medium ${
                  isTeacher 
                    ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white border-0 shadow-md' 
                    : 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0 shadow-md'
                }`}
              >
                {isTeacher ? "Teacher" : "Student"}
              </Badge>
              
              <div className="text-xs text-gray-500 font-medium">
                Enhanced Classroom
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Center: Timer & Status with Better Visual Hierarchy */}
      <div className="text-center">
        <div className="relative">
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-mono">
            {formatTime(classTime)}
          </div>
          {/* Glowing accent */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur opacity-30"></div>
        </div>
        
        <div className="flex items-center justify-center gap-3 text-xs mt-2">
          {/* Enhanced Connection Status */}
          <div className="flex items-center gap-2 px-3 py-1 bg-white/50 rounded-full backdrop-blur-sm">
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
            }`}></div>
            <span className="font-medium text-gray-700">
              {isConnected ? 'Live' : 'Connecting...'}
            </span>
            {connectionQuality && isConnected && (
              <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                {connectionQuality}
              </Badge>
            )}
          </div>
          
          {/* Participants Count with Animation */}
          {participants.length > 0 && (
            <div className="flex items-center gap-1 px-3 py-1 bg-white/50 rounded-full backdrop-blur-sm">
              <Users size={12} className="text-gray-600" />
              <span className="font-medium text-gray-700">{participants.length}</span>
            </div>
          )}

          {/* Recording Indicator */}
          {isRecording && (
            <div className="flex items-center gap-1 px-3 py-1 bg-red-500/10 border border-red-200 rounded-full animate-pulse">
              <Circle className="h-2 w-2 text-red-500 fill-current" />
              <span className="text-red-600 font-medium">REC</span>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Right: Controls with Modern Styling */}
      <div className="flex items-center gap-2">
        {/* Connection Control with Enhanced States */}
        {!isConnected ? (
          <Button 
            onClick={joinClassroom} 
            size="sm"
            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-xs px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
          >
            <PhoneCall size={12} className="mr-2" />
            Join Class
          </Button>
        ) : (
          <Button 
            onClick={leaveClassroom} 
            size="sm"
            variant="destructive"
            className="text-xs px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
          >
            <PhoneOff size={12} className="mr-2" />
            Leave
          </Button>
        )}

        {/* Enhanced Media Controls */}
        <div className="flex items-center gap-1 p-1 bg-white/30 rounded-full backdrop-blur-sm">
          {/* Microphone Control */}
          <Button
            variant={isMuted ? "destructive" : "ghost"}
            size="sm"
            onClick={toggleMicrophone}
            className={`rounded-full w-10 h-10 p-0 transition-all duration-200 hover:scale-110 ${
              isMuted 
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' 
                : 'bg-white/50 hover:bg-white/70 text-gray-700'
            }`}
          >
            {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
          </Button>
          
          {/* Camera Control */}
          <Button
            variant={isCameraOff ? "destructive" : "ghost"}
            size="sm"
            onClick={toggleCamera}
            className={`rounded-full w-10 h-10 p-0 transition-all duration-200 hover:scale-110 ${
              isCameraOff 
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' 
                : 'bg-white/50 hover:bg-white/70 text-gray-700'
            }`}
          >
            {isCameraOff ? <VideoOff size={16} /> : <Video size={16} />}
          </Button>

          {/* Raise Hand Control */}
          <Button
            variant="ghost"
            size="sm"
            onClick={raiseHand}
            className="rounded-full w-10 h-10 p-0 bg-white/50 hover:bg-yellow-100 text-gray-700 hover:text-yellow-700 transition-all duration-200 hover:scale-110"
            disabled={!isConnected}
            title={isTeacher ? "View raised hands" : "Raise hand"}
          >
            <Hand size={16} />
          </Button>

          {/* Screen Share Control */}
          <Button
            variant="ghost"
            size="sm"
            onClick={startScreenShare}
            className="rounded-full w-10 h-10 p-0 bg-white/50 hover:bg-blue-100 text-gray-700 hover:text-blue-700 transition-all duration-200 hover:scale-110"
            disabled={!isConnected}
            title="Share screen"
          >
            <Monitor size={16} />
          </Button>

          {/* Recording Control - Teacher Only */}
          {isTeacher && (
            <Button
              variant={isRecording ? "destructive" : "ghost"}
              size="sm"
              onClick={handleToggleRecording}
              className={`rounded-full w-10 h-10 p-0 transition-all duration-200 hover:scale-110 ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg animate-pulse' 
                  : 'bg-white/50 hover:bg-red-100 text-gray-700 hover:text-red-700'
              }`}
              disabled={!isConnected}
              title={isRecording ? "Stop recording" : "Start recording"}
            >
              {isRecording ? <Square size={16} /> : <Circle size={16} />}
            </Button>
          )}
        </div>
      </div>

      {/* Enhanced Error Display */}
      {error && (
        <div className="absolute bottom-full left-0 right-0 mb-2 px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-sm shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              {error}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
