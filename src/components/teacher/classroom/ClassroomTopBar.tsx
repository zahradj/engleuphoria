import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Clock,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Phone,
  Settings,
  Star,
  ClipboardCheck,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface ClassroomTopBarProps {
  lessonTitle: string;
  roomName: string;
  participantCount: number;
  isMuted: boolean;
  isCameraOff: boolean;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onEndClass: () => void;
  onOpenSettings?: () => void;
  onOpenWrapUp?: () => void;
  studentStars?: number;
  isZenMode?: boolean;
  onToggleZenMode?: () => void;
}

export const ClassroomTopBar: React.FC<ClassroomTopBarProps> = ({
  lessonTitle,
  roomName,
  participantCount,
  isMuted,
  isCameraOff,
  onToggleMute,
  onToggleCamera,
  onEndClass,
  onOpenSettings,
  onOpenWrapUp,
  studentStars = 0,
  isZenMode = false,
  onToggleZenMode
}) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="h-14 glass-panel border-b border-white/5 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-4">
        {/* Live Indicator */}
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-medium text-red-400">LIVE</span>
        </div>
        <div className="h-6 w-px bg-gray-700" />
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-300">{participantCount} in room</span>
        </div>
        <Badge variant="secondary" className="bg-gray-800 text-gray-300">
          {lessonTitle}
        </Badge>
        <Badge variant="outline" className="border-emerald-500 text-emerald-400 text-xs">
          Room: {roomName}
        </Badge>
      </div>

      {/* Centered Star Count */}
      <div className="flex items-center">
        <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 px-3 py-1 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.3)]">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="font-bold text-amber-300 text-sm">{studentStars} {studentStars === 1 ? 'Star' : 'Stars'}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-sm text-gray-400 mr-4">
          <Clock className="h-4 w-4" />
          <span className="font-mono">{formatTime(elapsed)}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full ${isMuted ? 'bg-red-500/20 text-red-400' : 'bg-gray-800 text-gray-300'}`}
          onClick={onToggleMute}
        >
          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full ${isCameraOff ? 'bg-red-500/20 text-red-400' : 'bg-gray-800 text-gray-300'}`}
          onClick={onToggleCamera}
        >
          {isCameraOff ? <CameraOff className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
        </Button>
        {/* Zen Mode Toggle */}
        {onToggleZenMode && (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-gray-800 text-gray-300"
            onClick={onToggleZenMode}
            title="Zen Mode (F11)"
          >
            {isZenMode ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-gray-800 text-gray-300"
          onClick={onOpenSettings}
        >
          <Settings className="h-5 w-5" />
        </Button>
        {/* Wrap-Up Button */}
        {onOpenWrapUp && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenWrapUp}
            className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30"
          >
            <ClipboardCheck className="h-4 w-4 mr-1" />
            Wrap-Up
          </Button>
        )}
        <div className="h-6 w-px bg-gray-700 mx-2" />
        <Button
          variant="destructive"
          size="sm"
          className="bg-red-600 hover:bg-red-700"
          onClick={onEndClass}
        >
          <Phone className="h-4 w-4 mr-2" />
          End Class
        </Button>
      </div>
    </div>
  );
};
