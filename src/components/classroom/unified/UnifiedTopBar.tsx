
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Users, 
  Clock,
  Settings,
  Share2
} from "lucide-react";
import { UnifiedUser, getDisplayName } from "@/types/user";

interface UnifiedTopBarProps {
  classTime: number;
  currentUser: UnifiedUser;
  enhancedClassroom: any;
  roomId: string;
}

export function UnifiedTopBar({ 
  classTime, 
  currentUser, 
  enhancedClassroom,
  roomId 
}: UnifiedTopBarProps) {
  const {
    isConnected,
    participants,
    isMuted,
    isCameraOff,
    toggleMicrophone,
    toggleCamera,
    connectToRoom,
    disconnect
  } = enhancedClassroom;

  const displayName = getDisplayName(currentUser);
  const isTeacher = currentUser.role === 'teacher';

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between h-full px-4">
      {/* Left Section - Room Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
          <h1 className="text-lg font-semibold text-gray-800">Room {roomId}</h1>
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock size={16} />
          <span className="font-mono">{formatTime(classTime)}</span>
        </div>

        <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
          {isConnected ? "Live" : "Offline"}
        </Badge>
      </div>

      {/* Center Section - Media Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant={isMuted ? "destructive" : "outline"}
          size="sm"
          onClick={toggleMicrophone}
          className="h-10 w-10 p-0"
        >
          {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
        </Button>
        
        <Button
          variant={isCameraOff ? "destructive" : "outline"}
          size="sm"
          onClick={toggleCamera}
          className="h-10 w-10 p-0"
        >
          {isCameraOff ? <VideoOff size={16} /> : <Video size={16} />}
        </Button>
        
        <Button
          variant={isConnected ? "destructive" : "default"}
          size="sm"
          onClick={isConnected ? disconnect : connectToRoom}
          className="h-10 px-4"
        >
          {isConnected ? <PhoneOff size={16} /> : <Phone size={16} />}
          <span className="ml-2 hidden sm:inline">
            {isConnected ? "Leave" : "Join"}
          </span>
        </Button>
      </div>

      {/* Right Section - User Info & Actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Users size={16} className="text-gray-500" />
          <span className="text-gray-600">{participants.length}</span>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-800">{displayName}</p>
            <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
          </div>
          
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        {isTeacher && (
          <>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Share2 size={14} />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings size={14} />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
