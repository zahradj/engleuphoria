import React from 'react';
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
import { useSmartTimer, type TimerPhase } from '@/hooks/classroom/useSmartTimer';

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
  shouldPulseWrapUp?: boolean;
  elapsedSeconds?: number;
  sessionDuration?: 25 | 55;
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
  onToggleZenMode,
  shouldPulseWrapUp = false,
  elapsedSeconds = 0,
  sessionDuration = 25
}) => {
  const smartTimer = useSmartTimer(elapsedSeconds, sessionDuration);

  const totalSec = sessionDuration * 60;
  const remaining = Math.max(0, totalSec - elapsedSeconds);
  const isOvertime = elapsedSeconds > totalSec;
  const overtimeSec = isOvertime ? elapsedSeconds - totalSec : 0;

  // Buffer time: last 5 min for 55-min, last 2 min for 25-min
  const bufferSec = sessionDuration === 55 ? 5 * 60 : 2 * 60;
  const inBuffer = remaining <= bufferSec && !isOvertime;

  const fmt = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const fmtFull = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Timer color classes based on phase
  const timerColorClass = (() => {
    switch (smartTimer.phase) {
      case 'overtime': return 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]';
      case 'urgent': return 'text-red-500 animate-pulse';
      case 'warning': return 'text-amber-400';
      default: return 'text-gray-400';
    }
  })();

  const timerBgClass = (() => {
    switch (smartTimer.phase) {
      case 'overtime': return 'bg-red-500/20 border border-red-500/40';
      case 'urgent': return 'bg-red-500/15 border border-red-500/30';
      case 'warning': return 'bg-amber-500/15 border border-amber-500/30';
      default: return '';
    }
  })();

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

      {/* Centered: Star Count + Timer */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 px-3 py-1 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.3)]">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="font-bold text-amber-300 text-sm">{studentStars} {studentStars === 1 ? 'Star' : 'Stars'}</span>
        </div>

        {/* Smart Timer Display */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${timerBgClass}`}>
          <Clock className={`h-4 w-4 ${timerColorClass}`} />
          <div className="flex flex-col items-center leading-none">
            <span className={`font-mono text-sm font-bold ${timerColorClass}`}>
              {isOvertime ? `+${fmt(overtimeSec)}` : fmt(remaining)}
            </span>
            {smartTimer.phase !== 'normal' && (
              <span className={`text-[10px] font-semibold uppercase tracking-wider ${timerColorClass}`}>
                {smartTimer.phaseLabel}
              </span>
            )}
          </div>
          <span className="text-[10px] text-gray-500 font-mono">
            {fmtFull(elapsedSeconds)}
          </span>
        </div>

        {/* Buffer Indicator */}
        {inBuffer && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600/30 border border-red-500/50 animate-pulse">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-[10px] font-bold text-red-300 uppercase tracking-wider">Buffer</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
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
        {/* Wrap-Up / Session Report Button */}
        {onOpenWrapUp && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenWrapUp}
            className={`${
              shouldPulseWrapUp
                ? 'bg-red-600/30 text-red-300 hover:bg-red-600/40 animate-pulse ring-2 ring-red-500/50'
                : 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30'
            }`}
          >
            <ClipboardCheck className="h-4 w-4 mr-1" />
            {shouldPulseWrapUp ? 'Session Report' : 'Wrap-Up'}
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
