
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
import { useMediaContext } from "@/components/classroom/oneonone/video/MediaContext";

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
  // Use MediaContext for actual video controls
  const media = useMediaContext();
  
  const {
    participants,
    isRecording,
    toggleRecording,
    raiseHand,
    startScreenShare
  } = enhancedClassroom;

  const isTeacher = currentUser.role === 'teacher';
  const RoleIcon = isTeacher ? Crown : GraduationCap;

  return (
    <div className="h-full flex items-center justify-between">
      {/* Left: User Info */}
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isTeacher ? 'bg-gradient-to-br from-purple-500 to-violet-600' : 'bg-gradient-to-br from-blue-500 to-cyan-600'} shadow-md`}>
          <RoleIcon className="h-4 w-4 text-white" />
        </div>
        
        <div>
          <h2 className="text-lg font-bold text-gray-800">{currentUser.name}</h2>
          <div className="flex items-center gap-2">
            <Badge 
              variant={isTeacher ? "default" : "secondary"} 
              className={`text-xs ${
                isTeacher 
                  ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white border-0' 
                  : 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0'
              }`}
            >
              {isTeacher ? "Teacher" : "Student"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Center: Timer & Status */}
      <div className="text-center">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-mono">
          {formatTime(classTime)}
        </div>
        
        <div className="flex items-center justify-center gap-2 text-xs mt-1">
          <div className="flex items-center gap-1 px-2 py-1 bg-white/40 rounded-full">
            <div className={`w-2 h-2 rounded-full ${
              media.isConnected ? 'bg-emerald-500' : 'bg-gray-400'
            }`}></div>
            <span className="text-gray-700">
              {media.isConnected ? 'Live' : 'Ready'}
            </span>
          </div>
          
          {participants && participants.length > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-white/40 rounded-full">
              <Users size={10} />
              <span className="text-gray-700">{participants.length}</span>
            </div>
          )}

          {isRecording && (
            <div className="flex items-center gap-1 px-2 py-1 bg-red-100 rounded-full">
              <Circle className="h-2 w-2 text-red-500 fill-current" />
              <span className="text-red-600 font-medium">REC</span>
            </div>
          )}
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        {!media.isConnected ? (
          <Button 
            onClick={media.join} 
            size="sm"
            className="bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs px-3 py-2 rounded-lg shadow-md"
          >
            <PhoneCall size={12} className="mr-1" />
            Join
          </Button>
        ) : (
          <Button 
            onClick={media.leave} 
            size="sm"
            variant="destructive"
            className="text-xs px-3 py-2 rounded-lg"
          >
            <PhoneOff size={12} className="mr-1" />
            Leave
          </Button>
        )}

        <div className="flex items-center gap-1 p-1 bg-white/30 rounded-lg">
          <Button
            variant={media.isMuted ? "destructive" : "ghost"}
            size="sm"
            onClick={media.toggleMicrophone}
            className={`rounded-md w-8 h-8 p-0 ${
              media.isMuted ? 'bg-red-500 text-white' : 'bg-white/40 text-gray-700'
            }`}
          >
            {media.isMuted ? <MicOff size={14} /> : <Mic size={14} />}
          </Button>
          
          <Button
            variant={media.isCameraOff ? "destructive" : "ghost"}
            size="sm"
            onClick={media.toggleCamera}
            className={`rounded-md w-8 h-8 p-0 ${
              media.isCameraOff ? 'bg-red-500 text-white' : 'bg-white/40 text-gray-700'
            }`}
          >
            {media.isCameraOff ? <VideoOff size={14} /> : <Video size={14} />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={raiseHand}
            className="rounded-md w-8 h-8 p-0 bg-white/40 text-gray-700"
            disabled={!media.isConnected}
          >
            <Hand size={14} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={startScreenShare}
            className="rounded-md w-8 h-8 p-0 bg-white/40 text-gray-700"
            disabled={!media.isConnected}
          >
            <Monitor size={14} />
          </Button>

          {isTeacher && (
            <Button
              variant={isRecording ? "destructive" : "ghost"}
              size="sm"
              onClick={toggleRecording}
              className={`rounded-md w-8 h-8 p-0 ${
                isRecording ? 'bg-red-500 text-white' : 'bg-white/40 text-gray-700'
              }`}
              disabled={!media.isConnected}
            >
              {isRecording ? <Square size={14} /> : <Circle size={14} />}
            </Button>
          )}
        </div>

        {/* Error Display */}
        {media.error && (
          <div className="absolute top-full left-0 right-0 mt-2 mx-4">
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
              {media.error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
