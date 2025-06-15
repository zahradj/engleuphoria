
import React from "react";
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
  GraduationCap
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

  return (
    <div className="h-full flex items-center justify-between">
      {/* Left: User Info */}
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isTeacher ? 'bg-gradient-to-br from-slate-400 to-slate-500' : 'bg-gradient-to-br from-gray-400 to-gray-500'} shadow-md`}>
          <RoleIcon className="h-4 w-4 text-white" />
        </div>
        
        <div>
          <h2 className="text-lg font-bold text-gray-700">{currentUser.name}</h2>
          <div className="flex items-center gap-2">
            <Badge 
              variant={isTeacher ? "default" : "secondary"} 
              className={`text-xs ${
                isTeacher 
                  ? 'bg-gradient-to-r from-slate-400 to-slate-500 text-white border-0' 
                  : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0'
              }`}
            >
              {isTeacher ? "Teacher" : "Student"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Center: Timer & Status */}
      <div className="text-center">
        <div className="text-2xl font-bold bg-gradient-to-r from-slate-500 to-gray-600 bg-clip-text text-transparent font-mono">
          {formatTime(classTime)}
        </div>
        
        <div className="flex items-center justify-center gap-2 text-xs mt-1">
          <div className="flex items-center gap-1 px-2 py-1 bg-white/30 rounded-full">
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-400' : 'bg-gray-300'
            }`}></div>
            <span className="text-gray-600">
              {isConnected ? 'Live' : 'Connecting'}
            </span>
          </div>
          
          {participants.length > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-white/30 rounded-full">
              <Users size={10} />
              <span className="text-gray-600">{participants.length}</span>
            </div>
          )}

          {isRecording && (
            <div className="flex items-center gap-1 px-2 py-1 bg-red-50 rounded-full">
              <Circle className="h-2 w-2 text-red-400 fill-current" />
              <span className="text-red-500 font-medium">REC</span>
            </div>
          )}
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        {!isConnected ? (
          <Button 
            onClick={joinClassroom} 
            size="sm"
            className="bg-gradient-to-r from-green-400 to-green-500 text-white text-xs px-3 py-2 rounded-lg shadow-md"
          >
            <PhoneCall size={12} className="mr-1" />
            Join
          </Button>
        ) : (
          <Button 
            onClick={leaveClassroom} 
            size="sm"
            variant="destructive"
            className="text-xs px-3 py-2 rounded-lg bg-red-400 hover:bg-red-500"
          >
            <PhoneOff size={12} className="mr-1" />
            Leave
          </Button>
        )}

        <div className="flex items-center gap-1 p-1 bg-white/20 rounded-lg">
          <Button
            variant={isMuted ? "destructive" : "ghost"}
            size="sm"
            onClick={toggleMicrophone}
            className={`rounded-md w-8 h-8 p-0 ${
              isMuted ? 'bg-red-400 text-white hover:bg-red-500' : 'bg-white/30 text-gray-600 hover:bg-white/50'
            }`}
          >
            {isMuted ? <MicOff size={14} /> : <Mic size={14} />}
          </Button>
          
          <Button
            variant={isCameraOff ? "destructive" : "ghost"}
            size="sm"
            onClick={toggleCamera}
            className={`rounded-md w-8 h-8 p-0 ${
              isCameraOff ? 'bg-red-400 text-white hover:bg-red-500' : 'bg-white/30 text-gray-600 hover:bg-white/50'
            }`}
          >
            {isCameraOff ? <VideoOff size={14} /> : <Video size={14} />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={raiseHand}
            className="rounded-md w-8 h-8 p-0 bg-white/30 text-gray-600 hover:bg-white/50"
            disabled={!isConnected}
          >
            <Hand size={14} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={startScreenShare}
            className="rounded-md w-8 h-8 p-0 bg-white/30 text-gray-600 hover:bg-white/50"
            disabled={!isConnected}
          >
            <Monitor size={14} />
          </Button>

          {isTeacher && (
            <Button
              variant={isRecording ? "destructive" : "ghost"}
              size="sm"
              onClick={toggleRecording}
              className={`rounded-md w-8 h-8 p-0 ${
                isRecording ? 'bg-red-400 text-white hover:bg-red-500' : 'bg-white/30 text-gray-600 hover:bg-white/50'
              }`}
              disabled={!isConnected}
            >
              {isRecording ? <Square size={14} /> : <Circle size={14} />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
