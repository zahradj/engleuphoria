
import React from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, Phone } from "lucide-react";

interface VideoControlsProps {
  isMuted: boolean;
  isCameraOff: boolean;
  isTeacher: boolean;
  onToggleMicrophone: () => void;
  onToggleCamera: () => void;
  onLeaveVideo: () => void;
}

export function VideoControls({
  isMuted,
  isCameraOff,
  isTeacher,
  onToggleMicrophone,
  onToggleCamera,
  onLeaveVideo
}: VideoControlsProps) {
  return (
    <div className="absolute bottom-3 right-3 flex items-center gap-2">
      <Button
        variant={isMuted ? "destructive" : "outline"}
        size="icon"
        onClick={onToggleMicrophone}
        className="w-8 h-8 bg-black/20 hover:bg-black/40 border-white/30"
      >
        {isMuted ? <MicOff size={16} className="text-white" /> : <Mic size={16} className="text-white" />}
      </Button>
      <Button
        variant={isCameraOff ? "destructive" : "outline"}
        size="icon"
        onClick={onToggleCamera}
        className="w-8 h-8 bg-black/20 hover:bg-black/40 border-white/30"
      >
        {isCameraOff ? <VideoOff size={16} className="text-white" /> : <Video size={16} className="text-white" />}
      </Button>
      <Button
        variant="destructive"
        size="icon"
        onClick={onLeaveVideo}
        className="w-8 h-8"
        title={isTeacher ? "End Session" : "Leave Video"}
      >
        <Phone size={16} />
      </Button>
    </div>
  );
}
