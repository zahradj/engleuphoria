
import React, { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Hand, 
  Circle, 
  Users,
  Wifi,
  WifiOff
} from "lucide-react";
import { ParticipantData } from '@/services/enhancedVideoService';

interface EnhancedVideoPanelProps {
  participants: ParticipantData[];
  isConnected: boolean;
  isRecording: boolean;
  connectionQuality: string;
  userRole: 'teacher' | 'student';
  localStream?: MediaStream | null;
  isMuted: boolean;
  isCameraOff: boolean;
  onToggleMicrophone: () => void;
  onToggleCamera: () => void;
  onRaiseHand: () => void;
  onToggleRecording?: () => void;
  onStartScreenShare?: () => void;
}

export function EnhancedVideoPanel({
  participants,
  isConnected,
  isRecording,
  connectionQuality,
  userRole,
  localStream,
  isMuted,
  isCameraOff
}: EnhancedVideoPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Update video element when localStream changes
  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
      console.log('🎥 Video element updated with local stream');
    }
  }, [localStream]);

  return (
    <Card className="h-full flex flex-col">
      {/* Header with connection status */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm font-medium">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
            <Badge variant={connectionQuality === 'good' ? 'default' : 'destructive'}>
              {connectionQuality}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="text-sm">{participants.length}</span>
            {isRecording && (
              <Badge variant="destructive" className="animate-pulse">
                <Circle className="h-3 w-3 mr-1 fill-current" />
                REC
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 p-4">
        <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
          {localStream && !isCameraOff ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Local user overlay */}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                You ({userRole})
                {isMuted && <MicOff className="h-3 w-3 inline ml-1" />}
              </div>
            </>
          ) : (
            <div className="text-center text-white">
              {isCameraOff ? (
                <>
                  <VideoOff className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Camera Off</p>
                </>
              ) : localStream ? (
                <>
                  <Video className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Camera Loading...</p>
                </>
              ) : (
                <>
                  <VideoOff className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">No Camera Access</p>
                </>
              )}
            </div>
          )}

          {/* Connection status overlay when connected */}
          {isConnected && (
            <div className="absolute top-2 right-2 bg-green-500 bg-opacity-80 text-white px-2 py-1 rounded text-xs">
              Live
            </div>
          )}

          {/* Participant overlay */}
          {participants.length > 0 && (
            <div className="absolute bottom-2 right-2">
              <div className="flex flex-wrap gap-1">
                {participants.map((participant) => (
                  <Badge 
                    key={participant.id}
                    variant={participant.role === 'teacher' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {participant.displayName}
                    {participant.isMuted && <MicOff className="h-2 w-2 ml-1" />}
                    {participant.isHandRaised && <Hand className="h-2 w-2 ml-1" />}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
