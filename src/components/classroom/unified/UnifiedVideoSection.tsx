
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, VideoOff, Mic, MicOff, PhoneCall, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UnifiedUser, getDisplayName } from "@/types/user";

interface UnifiedVideoSectionProps {
  enhancedClassroom: any;
  currentUser: UnifiedUser;
  studentXP?: number;
  onAwardPoints?: () => void;
  showRewardPopup?: boolean;
}

export function UnifiedVideoSection({
  enhancedClassroom,
  currentUser,
  studentXP = 1250,
  onAwardPoints,
  showRewardPopup = false
}: UnifiedVideoSectionProps) {
  const {
    isConnected,
    participants,
    localStream,
    isMuted,
    isCameraOff,
    toggleMicrophone,
    toggleCamera,
    connectToRoom,
    disconnect
  } = enhancedClassroom;

  const displayName = getDisplayName(currentUser);
  const isTeacher = currentUser.role === 'teacher';
  const studentLevel = Math.floor(studentXP / 100);

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Main Video Panel */}
      <Card className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Video Area */}
          <div className="flex-1 bg-gradient-to-br from-blue-100 to-indigo-100 relative">
            {localStream ? (
              <video
                ref={(video) => {
                  if (video && localStream) {
                    video.srcObject = localStream;
                  }
                }}
                autoPlay
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-white">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium">{displayName}</p>
                  <Badge className={isConnected ? "bg-green-500" : "bg-gray-400"}>
                    {isConnected ? "Connected" : "Offline"}
                  </Badge>
                </div>
              </div>
            )}
            
            {/* Video Controls Overlay */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex gap-2 bg-black/20 backdrop-blur-sm rounded-lg p-2">
                <Button
                  size="sm"
                  variant={isMuted ? "destructive" : "secondary"}
                  onClick={toggleMicrophone}
                >
                  {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                </Button>
                <Button
                  size="sm"
                  variant={isCameraOff ? "destructive" : "secondary"}
                  onClick={toggleCamera}
                >
                  {isCameraOff ? <VideoOff size={16} /> : <Video size={16} />}
                </Button>
                <Button
                  size="sm"
                  variant={isConnected ? "destructive" : "default"}
                  onClick={isConnected ? disconnect : connectToRoom}
                >
                  {isConnected ? <PhoneOff size={16} /> : <PhoneCall size={16} />}
                </Button>
              </div>
            </div>
          </div>

          {/* Connection Status */}
          <div className="p-3 border-t bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="text-sm text-gray-600">
                  {isConnected ? `Connected (${participants.length} participant${participants.length !== 1 ? 's' : ''})` : 'Not connected'}
                </span>
              </div>
              {isTeacher && (
                <Badge variant="outline" className="text-xs">
                  Teacher
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Teacher Rewards Panel */}
      {isTeacher && onAwardPoints && (
        <Card className="p-4">
          <div className="text-center">
            <h4 className="font-medium text-gray-800 mb-2">Student Progress</h4>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">Level {studentLevel}</span>
              <Badge className="bg-yellow-100 text-yellow-700">
                {studentXP} XP
              </Badge>
            </div>
            <Button
              onClick={onAwardPoints}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600"
              size="sm"
            >
              Award 10 XP
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
