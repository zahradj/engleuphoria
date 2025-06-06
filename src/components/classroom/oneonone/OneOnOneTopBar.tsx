
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Camera, 
  CameraOff, 
  Mic, 
  MicOff, 
  Settings, 
  Circle,
  Timer
} from "lucide-react";

interface OneOnOneTopBarProps {
  classTime: number;
  studentName: string;
  studentLevel: string;
  isMuted: boolean;
  isCameraOff: boolean;
  isRecording: boolean;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onToggleRecording: () => void;
}

export function OneOnOneTopBar({
  classTime,
  studentName,
  studentLevel,
  isMuted,
  isCameraOff,
  isRecording,
  onToggleMute,
  onToggleCamera,
  onToggleRecording
}: OneOnOneTopBarProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="mb-4 p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Timer size={20} className="text-blue-600" />
            <span className="font-mono text-lg font-semibold">{formatTime(classTime)}</span>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2">
            <span className="font-semibold">{studentName}</span>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {studentLevel}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={isMuted ? "destructive" : "outline"}
            size="sm"
            onClick={onToggleMute}
          >
            {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
          </Button>
          
          <Button
            variant={isCameraOff ? "destructive" : "outline"}
            size="sm"
            onClick={onToggleCamera}
          >
            {isCameraOff ? <CameraOff size={16} /> : <Camera size={16} />}
          </Button>
          
          <Button
            variant={isRecording ? "destructive" : "outline"}
            size="sm"
            onClick={onToggleRecording}
            className={isRecording ? "animate-pulse" : ""}
          >
            <Circle size={16} className={isRecording ? "fill-current" : ""} />
            {isRecording ? "Stop" : "Record"}
          </Button>
          
          <Button variant="outline" size="sm">
            <Settings size={16} />
          </Button>
        </div>
      </div>
    </Card>
  );
}
