import React, { useState, useEffect } from 'react';
import { useWebRTC } from '@/hooks/useWebRTC';
import { FunctionalVideoFeed } from './FunctionalVideoFeed';
import { Button } from '@/components/ui/button';
import { Video, VideoOff, Mic, MicOff, PhoneCall, PhoneOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FunctionalVideoPanelProps {
  roomId: string;
  currentUserId: string;
  currentUserName: string;
  isTeacher: boolean;
}

export function FunctionalVideoPanel({
  roomId,
  currentUserId,
  currentUserName,
  isTeacher
}: FunctionalVideoPanelProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const { toast } = useToast();

  const {
    streams,
    isConnected,
    error,
    connectToRoom,
    disconnect,
    toggleVideo,
    toggleAudio
  } = useWebRTC(roomId, currentUserId);

  useEffect(() => {
    if (error) {
      toast({
        title: "Connection Error",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const handleToggleMute = () => {
    const newMutedState = toggleAudio();
    setIsMuted(newMutedState);
    toast({
      title: newMutedState ? "Microphone Disabled" : "Microphone Enabled",
      description: newMutedState ? "You are now muted" : "You can now speak"
    });
  };

  const handleToggleCamera = () => {
    const newCameraOffState = toggleVideo();
    setIsCameraOff(newCameraOffState);
    toast({
      title: newCameraOffState ? "Camera Disabled" : "Camera Enabled",
      description: newCameraOffState ? "Your camera is off" : "You are now visible"
    });
  };

  const handleToggleHand = () => {
    setIsHandRaised(!isHandRaised);
    toast({
      title: !isHandRaised ? "Hand Raised" : "Hand Lowered",
      description: !isHandRaised ? "Teacher has been notified" : "Your hand has been lowered"
    });
  };

  const handleJoinCall = () => {
    connectToRoom();
  };

  const handleLeaveCall = () => {
    disconnect();
  };

  const currentUserStream = streams.find(s => s.id === currentUserId);
  const otherStreams = streams.filter(s => s.id !== currentUserId);

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg flex flex-col overflow-hidden">
      {/* Connection Status Header */}
      <div className="p-3 border-b border-gray-700 flex items-center justify-between bg-gray-800">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-white text-sm font-medium">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        
        {!isConnected ? (
          <Button 
            onClick={handleJoinCall} 
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <PhoneCall size={14} className="mr-1" />
            Join Call
          </Button>
        ) : (
          <Button 
            onClick={handleLeaveCall} 
            size="sm"
            variant="destructive"
          >
            <PhoneOff size={14} className="mr-1" />
            Leave
          </Button>
        )}
      </div>

      {/* Video Content */}
      <div className="flex-1 p-3 min-h-0">
        {isConnected ? (
          <div className="h-full flex flex-col gap-3">
            {/* Main video feeds */}
            <div className="flex-1 flex flex-col gap-2 min-h-0">
              {/* Current user feed */}
              {currentUserStream && (
                <div className="h-1/2 min-h-[120px]">
                  <FunctionalVideoFeed
                    stream={currentUserStream.stream}
                    name={currentUserName}
                    isTeacher={isTeacher}
                    isMuted={isMuted}
                    isCameraOff={isCameraOff}
                    isHandRaised={isHandRaised}
                    isCurrentUser={true}
                    isSmall={false}
                    onToggleMute={handleToggleMute}
                    onToggleCamera={handleToggleCamera}
                    onRaiseHand={handleToggleHand}
                  />
                </div>
              )}

              {/* Other participants */}
              {otherStreams.map(stream => (
                <div key={stream.id} className="h-1/2 min-h-[120px]">
                  <FunctionalVideoFeed
                    stream={stream.stream}
                    name={stream.id === 'teacher-1' ? 'Ms. Johnson' : stream.id === 'student-1' ? 'Emma Thompson' : 'Participant'}
                    isTeacher={stream.id === 'teacher-1'}
                    isMuted={false}
                    isCameraOff={false}
                    isCurrentUser={false}
                    isSmall={false}
                  />
                </div>
              ))}
            </div>

            {/* Control buttons */}
            <div className="flex justify-center gap-2 pt-2 border-t border-gray-700">
              <Button
                variant={isMuted ? "destructive" : "outline"}
                size="sm"
                onClick={handleToggleMute}
                className="rounded-full w-10 h-10 p-0"
              >
                {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
              </Button>
              
              <Button
                variant={isCameraOff ? "destructive" : "outline"}
                size="sm"
                onClick={handleToggleCamera}
                className="rounded-full w-10 h-10 p-0"
              >
                {isCameraOff ? <VideoOff size={16} /> : <Video size={16} />}
              </Button>
            </div>
          </div>
        ) : (
          /* Placeholder when not connected */
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Video size={32} className="mb-3" />
            <p className="text-sm text-center mb-2">Click "Join Call" to start video conference</p>
            <p className="text-xs text-center text-gray-500">Allow camera and microphone access when prompted</p>
          </div>
        )}
      </div>
    </div>
  );
}
