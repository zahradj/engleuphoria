
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mic,
  MicOff,
  Video,
  VideoOff,
  Clock,
  Wifi
} from "lucide-react";

interface CleanTopHeaderProps {
  classTime: number;
  mediaControls: {
    isMuted: boolean;
    isCameraOff: boolean;
    onToggleMute: () => void;
    onToggleCamera: () => void;
  };
  isConnected: boolean;
}

export function CleanTopHeader({ classTime, mediaControls, isConnected }: CleanTopHeaderProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-16 bg-blue-600 text-white px-6 flex items-center justify-between">
      {/* Left - Brand */}
      <div className="flex items-center gap-4">
        <div className="text-xl font-bold">Student Enhanced Classroom</div>
        <Badge variant="secondary" className="bg-blue-500 text-white border-blue-400">
          <Wifi className="w-3 h-3 mr-1" />
          {isConnected ? 'Connected' : 'Connecting...'}
        </Badge>
      </div>

      {/* Center - Timer */}
      <div className="flex items-center gap-2 bg-blue-700 px-4 py-2 rounded-lg">
        <Clock className="w-4 h-4" />
        <span className="text-xl font-mono font-bold">{formatTime(classTime)}</span>
      </div>

      {/* Right - Media Controls */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={mediaControls.isMuted ? "destructive" : "secondary"}
          onClick={mediaControls.onToggleMute}
          className="bg-white/10 hover:bg-white/20 border-white/20"
        >
          {mediaControls.isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </Button>
        <Button
          size="sm"
          variant={mediaControls.isCameraOff ? "destructive" : "secondary"}
          onClick={mediaControls.onToggleCamera}
          className="bg-white/10 hover:bg-white/20 border-white/20"
        >
          {mediaControls.isCameraOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
