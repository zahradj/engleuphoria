
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Monitor,
  Hand,
  Users,
  Signal,
  Circle
} from "lucide-react";

interface UnifiedVideoSectionProps {
  enhancedClassroom: any;
  currentUser: any;
  studentXP: number;
  onAwardPoints?: () => void;
  showRewardPopup: boolean;
}

export function UnifiedVideoSection({
  enhancedClassroom,
  currentUser,
  studentXP,
  onAwardPoints,
  showRewardPopup
}: UnifiedVideoSectionProps) {
  const {
    isConnected,
    participants,
    localStream,
    isMuted,
    isCameraOff,
    isRecording,
    connectionQuality,
    joinClassroom,
    leaveClassroom,
    toggleMicrophone,
    toggleCamera,
    raiseHand,
    startScreenShare
  } = enhancedClassroom;

  const isTeacher = currentUser.role === 'teacher';

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Main Video Area */}
      <Card className="flex-1 p-4 relative overflow-hidden">
        <div className="h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg relative">
          {/* Video Stream */}
          {localStream ? (
            <video
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover rounded-lg"
              ref={(video) => {
                if (video && localStream) {
                  video.srcObject = localStream;
                }
              }}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                  {isCameraOff ? <VideoOff size={32} /> : <Video size={32} />}
                </div>
                <h3 className="font-semibold text-gray-700">{currentUser.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {isConnected ? (isCameraOff ? 'Camera Off' : 'Camera On') : 'Not Connected'}
                </p>
              </div>
            </div>
          )}

          {/* Video Overlays */}
          <div className="absolute top-3 left-3 flex gap-2">
            {isConnected && (
              <Badge className="bg-green-500 text-white">
                <Circle size={8} className="mr-1 fill-current" />
                Live
              </Badge>
            )}
            {isRecording && (
              <Badge className="bg-red-500 text-white">
                <Circle size={8} className="mr-1 fill-current" />
                REC
              </Badge>
            )}
          </div>

          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Signal size={12} />
              {connectionQuality}
            </Badge>
          </div>

          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary">
              {currentUser.name} ({isTeacher ? 'Teacher' : 'Student'})
            </Badge>
          </div>

          {/* Participant Count */}
          {participants.length > 0 && (
            <div className="absolute bottom-3 right-3">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users size={12} />
                {participants.length}
              </Badge>
            </div>
          )}
        </div>

        {/* Video Controls */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md">
            {!isConnected ? (
              <Button 
                onClick={joinClassroom}
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Phone size={16} className="mr-1" />
                Join
              </Button>
            ) : (
              <>
                <Button
                  variant={isMuted ? "destructive" : "secondary"}
                  size="sm"
                  onClick={toggleMicrophone}
                >
                  {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                </Button>
                
                <Button
                  variant={isCameraOff ? "destructive" : "secondary"}
                  size="sm"
                  onClick={toggleCamera}
                >
                  {isCameraOff ? <VideoOff size={16} /> : <Video size={16} />}
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={raiseHand}
                  title="Raise Hand"
                >
                  <Hand size={16} />
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={startScreenShare}
                  title="Share Screen"
                >
                  <Monitor size={16} />
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={leaveClassroom}
                >
                  <PhoneOff size={16} />
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Teacher Rewards Section */}
      {isTeacher && onAwardPoints && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-sm">Student Progress</h4>
              <p className="text-xs text-gray-500">Current XP: {studentXP}</p>
            </div>
            <Button
              onClick={onAwardPoints}
              size="sm"
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Award +10 XP
            </Button>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(studentXP % 100)}%` }}
              ></div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
