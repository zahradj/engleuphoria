
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
    <div className="h-full flex items-center justify-between glass-subtle rounded-2xl px-6 py-3 backdrop-blur-lg">
      {/* Left: User Info */}
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-xl ${isTeacher ? 'bg-gradient-to-br from-purple-500 to-violet-600' : 'bg-gradient-to-br from-teal-500 to-cyan-600'} shadow-lg ring-2 ring-white/20 transition-all duration-200 hover:scale-105`}>
          <RoleIcon className="h-5 w-5 text-white" />
        </div>
        
        <div>
          <h2 className="text-lg font-bold text-foreground">{currentUser.name}</h2>
          <div className="flex items-center gap-2">
            <Badge 
              variant={isTeacher ? "default" : "secondary"} 
              className={`text-xs transition-all duration-200 hover:scale-105 ${
                isTeacher 
                  ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white border-0 shadow-lg' 
                  : 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white border-0 shadow-lg'
              }`}
            >
              {isTeacher ? "Teacher" : "Student"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Center: Timer & Status */}
      <div className="text-center">
        <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 bg-clip-text text-transparent font-mono tracking-wider">
          {formatTime(classTime)}
        </div>
        
        <div className="flex items-center justify-center gap-3 text-xs mt-2">
          <div className="flex items-center gap-1 px-3 py-1 glass-subtle rounded-full backdrop-blur-sm">
            <div className={`w-2 h-2 rounded-full transition-all duration-200 ${
              media.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground'
            }`}></div>
            <span className="text-foreground font-medium">
              {media.isConnected ? 'Live' : 'Ready'}
            </span>
          </div>
          
          {participants && participants.length > 0 && (
            <div className="flex items-center gap-1 px-3 py-1 glass-subtle rounded-full backdrop-blur-sm">
              <Users size={12} className="text-primary" />
              <span className="text-foreground font-medium">{participants.length}</span>
            </div>
          )}

          {isRecording && (
            <div className="flex items-center gap-1 px-3 py-1 bg-red-500/20 rounded-full backdrop-blur-sm border border-red-300/50">
              <Circle className="h-2 w-2 text-red-500 fill-current animate-pulse" />
              <span className="text-red-600 font-bold">REC</span>
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

        <div className="flex items-center gap-2 p-2 glass-enhanced rounded-xl backdrop-blur-lg">
          <Button
            variant={media.isMuted ? "destructive" : "ghost"}
            size="sm"
            onClick={media.toggleMicrophone}
            className={`rounded-lg w-9 h-9 p-0 transition-all duration-200 hover:scale-105 ${
              media.isMuted ? 'bg-red-500/90 text-white shadow-lg' : 'glass-subtle text-foreground hover:bg-white/20'
            }`}
          >
            {media.isMuted ? <MicOff size={16} /> : <Mic size={16} />}
          </Button>
          
          <Button
            variant={media.isCameraOff ? "destructive" : "ghost"}
            size="sm"
            onClick={media.toggleCamera}
            className={`rounded-lg w-9 h-9 p-0 transition-all duration-200 hover:scale-105 ${
              media.isCameraOff ? 'bg-red-500/90 text-white shadow-lg' : 'glass-subtle text-foreground hover:bg-white/20'
            }`}
          >
            {media.isCameraOff ? <VideoOff size={16} /> : <Video size={16} />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={raiseHand}
            className="rounded-lg w-9 h-9 p-0 glass-subtle text-foreground hover:bg-white/20 transition-all duration-200 hover:scale-105 disabled:opacity-50"
            disabled={!media.isConnected}
          >
            <Hand size={16} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={startScreenShare}
            className="rounded-lg w-9 h-9 p-0 glass-subtle text-foreground hover:bg-white/20 transition-all duration-200 hover:scale-105 disabled:opacity-50"
            disabled={!media.isConnected}
          >
            <Monitor size={16} />
          </Button>

          {isTeacher && (
            <Button
              variant={isRecording ? "destructive" : "ghost"}
              size="sm"
              onClick={toggleRecording}
              className={`rounded-lg w-9 h-9 p-0 transition-all duration-200 hover:scale-105 disabled:opacity-50 ${
                isRecording ? 'bg-red-500/90 text-white shadow-lg' : 'glass-subtle text-foreground hover:bg-white/20'
              }`}
              disabled={!media.isConnected}
            >
              {isRecording ? <Square size={16} /> : <Circle size={16} />}
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
