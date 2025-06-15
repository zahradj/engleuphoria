
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mic,
  MicOff,
  Video,
  VideoOff,
  Users,
  Clock
} from "lucide-react";

interface EnhancedTopHeaderProps {
  classTime: number;
  mediaControls: {
    isMuted: boolean;
    isCameraOff: boolean;
    onToggleMute: () => void;
    onToggleCamera: () => void;
  };
}

export function EnhancedTopHeader({ classTime, mediaControls }: EnhancedTopHeaderProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-20 bg-white/80 backdrop-blur-xl border-b border-white/20 px-6 flex items-center justify-between shadow-lg relative z-10">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              S
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div>
            <div className="font-bold text-gray-900 text-lg">Enhanced Classroom</div>
            <div className="text-sm text-gray-600 font-medium">Interactive Learning Session</div>
          </div>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 px-3 py-1 animate-pulse">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          Connected
        </Badge>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-white/60 rounded-lg px-4 py-2 backdrop-blur-sm">
          <Clock size={16} className="text-gray-600" />
          <span className="text-xl font-bold text-gray-800">{formatTime(classTime)}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant={mediaControls.isMuted ? "destructive" : "outline"}
          onClick={mediaControls.onToggleMute}
          className="bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200"
        >
          {mediaControls.isMuted ? <MicOff size={16} /> : <Mic size={16} />}
        </Button>
        <Button
          size="sm"
          variant={mediaControls.isCameraOff ? "destructive" : "outline"}
          onClick={mediaControls.onToggleCamera}
          className="bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200"
        >
          {mediaControls.isCameraOff ? <VideoOff size={16} /> : <Video size={16} />}
        </Button>
        <Button size="sm" className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200">
          <Users size={16} className="mr-2" />
          Active Session
        </Button>
      </div>
    </div>
  );
}
