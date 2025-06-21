
import React, { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Video, VideoOff, Phone, Maximize2 } from "lucide-react";

interface MobileVideoPanelProps {
  currentUser: {
    id: string;
    name: string;
    role: 'teacher' | 'student';
  };
  stream?: MediaStream | null;
  isConnected?: boolean;
  isMuted?: boolean;
  isCameraOff?: boolean;
  onToggleMicrophone?: () => void;
  onToggleCamera?: () => void;
  onLeaveCall?: () => void;
  isExpanded?: boolean;
}

export function MobileVideoPanel({
  currentUser,
  stream,
  isConnected = false,
  isMuted = false,
  isCameraOff = false,
  onToggleMicrophone,
  onToggleCamera,
  onLeaveCall,
  isExpanded = false
}: MobileVideoPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isTeacher = currentUser.role === 'teacher';

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const hasVideo = stream && isConnected && !isCameraOff;
  const userLabel = currentUser.name;
  const gradientColors = isTeacher ? "from-blue-500 to-blue-600" : "from-purple-500 to-purple-600";

  return (
    <div className={`relative ${isExpanded ? 'h-full' : 'h-32'} w-full rounded-lg overflow-hidden`}>
      <Card className="h-full w-full p-0 bg-white/90 border-2 border-opacity-50 shadow-lg overflow-hidden relative">
        {hasVideo ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientColors} flex items-center justify-center relative`}>
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full ${isTeacher ? 'bg-blue-400' : 'bg-purple-400'} flex items-center justify-center shadow-xl mb-2 mx-auto`}>
                <span className="text-xl font-bold text-white">
                  {userLabel.charAt(0).toUpperCase()}
                </span>
              </div>
              {isExpanded && (
                <p className="text-white font-medium text-sm">{userLabel}</p>
              )}
            </div>
          </div>
        )}

        {/* Status Indicators */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isConnected && (
            <Badge className="bg-green-500 text-white text-xs animate-pulse">
              ● Live
            </Badge>
          )}
          <Badge variant="secondary" className={`text-xs ${isTeacher ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
            {isTeacher ? 'Teacher' : 'Student'}
          </Badge>
        </div>

        {/* Video Controls - Only show when expanded */}
        {isExpanded && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1">
            <Button
              variant={isMuted ? "destructive" : "outline"}
              size="icon"
              onClick={onToggleMicrophone}
              className="w-8 h-8 bg-black/20 hover:bg-black/40 border-white/30"
            >
              {isMuted ? <MicOff size={14} className="text-white" /> : <Mic size={14} className="text-white" />}
            </Button>
            <Button
              variant={isCameraOff ? "destructive" : "outline"}
              size="icon"
              onClick={onToggleCamera}
              className="w-8 h-8 bg-black/20 hover:bg-black/40 border-white/30"
            >
              {isCameraOff ? <VideoOff size={14} className="text-white" /> : <Video size={14} className="text-white" />}
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={onLeaveCall}
              className="w-8 h-8"
            >
              <Phone size={14} />
            </Button>
          </div>
        )}

        {/* Expand Button - Only show when not expanded */}
        {!isExpanded && (
          <div className="absolute bottom-2 right-2">
            <Button
              variant="outline"
              size="icon"
              className="w-6 h-6 bg-black/20 hover:bg-black/40 border-white/30"
            >
              <Maximize2 size={12} className="text-white" />
            </Button>
          </div>
        )}

        {/* Name Label - Only show when expanded */}
        {isExpanded && (
          <div className="absolute bottom-2 left-2">
            <div className="bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
              {userLabel}
            </div>
          </div>
        )}

        {/* Camera Off Indicator */}
        {isCameraOff && !isExpanded && (
          <div className="absolute bottom-1 left-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
            Camera Off
          </div>
        )}
      </Card>
    </div>
  );
}
