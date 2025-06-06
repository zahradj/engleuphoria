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
    <div className="w-full h-full bg-gray-900 rounded-lg p-4">
      {/* Connection Status */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-white text-sm">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        
        {!isConnected ? (
          <Button onClick={handleJoinCall} className="bg-green-600 hover:bg-green-700">
            <PhoneCall size={16} className="mr-2" />
            Join Call
          </Button>
        ) : (
          <Button onClick={handleLeaveCall} variant="destructive">
            <PhoneOff size={16} className="mr-2" />
            Leave Call
          </Button>
        )}
      </div>

      {/* Video Grid */}
      {isConnected && (
        <>
          {/* Main video area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Current user */}
            {currentUserStream && (
              <div className="aspect-video">
                <FunctionalVideoFeed
                  stream={currentUserStream.stream}
                  name={currentUserName}
                  isTeacher={isTeacher}
                  isMuted={isMuted}
                  isCameraOff={isCameraOff}
                  isHandRaised={isHandRaised}
                  isCurrentUser={true}
                  onToggleMute={handleToggleMute}
                  onToggleCamera={handleToggleCamera}
                  onRaiseHand={handleToggleHand}
                />
              </div>
            )}

            {/* Other participants */}
            {otherStreams.map(stream => (
              <div key={stream.id} className="aspect-video">
                <FunctionalVideoFeed
                  stream={stream.stream}
                  name={stream.id === 'teacher-1' ? 'Ms. Johnson' : 'Student'}
                  isTeacher={stream.id === 'teacher-1'}
                  isMuted={false}
                  isCameraOff={false}
                  isCurrentUser={false}
                />
              </div>
            ))}
          </div>

          {/* Control buttons */}
          <div className="flex justify-center gap-4">
            <Button
              variant={isMuted ? "destructive" : "outline"}
              size="lg"
              onClick={handleToggleMute}
              className="rounded-full"
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </Button>
            
            <Button
              variant={isCameraOff ? "destructive" : "outline"}
              size="lg"
              onClick={handleToggleCamera}
              className="rounded-full"
            >
              {isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
            </Button>
          </div>
        </>
      )}

      {/* Placeholder when not connected */}
      {!isConnected && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <Video size={48} className="mb-4" />
          <p className="text-lg">Click "Join Call" to start video conference</p>
          <p className="text-sm">Make sure to allow camera and microphone access</p>
        </div>
      )}
    </div>
  );
}
