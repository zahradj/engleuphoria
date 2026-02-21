import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Video, VideoOff, LogOut, Signal, SignalMedium, SignalLow, WifiOff, Maximize2, Minimize2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useConnectionHealth } from '@/hooks/useConnectionHealth';

interface StudentClassroomHeaderProps {
  lessonTitle: string;
  isConnected: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onLeaveClass: () => void;
  isZenMode?: boolean;
  onToggleZenMode?: () => void;
}

export const StudentClassroomHeader: React.FC<StudentClassroomHeaderProps> = ({
  lessonTitle,
  isConnected,
  isMuted,
  isCameraOff,
  onToggleMute,
  onToggleCamera,
  onLeaveClass,
  isZenMode = false,
  onToggleZenMode
}) => {
  const { quality, latencyMs, suggestion } = useConnectionHealth();

  const SignalIcon = quality === 'good' ? Signal : quality === 'fair' ? SignalMedium : SignalLow;
  const signalColor = quality === 'good' ? 'bg-green-600' : quality === 'fair' ? 'bg-yellow-600' : 'bg-red-600';
  const signalLabel = quality === 'good' ? 'Strong' : quality === 'fair' ? 'Unstable' : 'Weak';

  return (
    <div className="relative">
      <div className="h-14 glass-panel border-b border-white/5 px-4 flex items-center justify-between">
        {/* Left: Live Indicator + Lesson Title */}
        <div className="flex items-center gap-3">
          {isConnected && (
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-medium text-red-400">LIVE</span>
            </div>
          )}
          <h1 className="text-lg font-semibold text-white">{lessonTitle}</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant={isConnected ? 'default' : 'destructive'}
                  className={`flex items-center gap-1 cursor-default ${isConnected ? signalColor : 'bg-red-600'}`}
                >
                  {isConnected ? <SignalIcon className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                  {isConnected ? signalLabel : 'Disconnected'}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Latency: {latencyMs}ms</p>
                {suggestion && <p className="text-xs mt-1">{suggestion}</p>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleMute}
          className={`h-9 w-9 rounded-full ${isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCamera}
          className={`h-9 w-9 rounded-full ${isCameraOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          {isCameraOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
        </Button>
        {onToggleZenMode && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleZenMode}
            className="h-9 w-9 rounded-full bg-gray-700 hover:bg-gray-600"
            title="Zen Mode (F11)"
          >
            {isZenMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        )}
        <div className="h-6 w-px bg-gray-700 mx-2" />
        <Button
          variant="destructive"
          size="sm"
          onClick={onLeaveClass}
          className="flex items-center gap-1"
        >
          <LogOut className="h-4 w-4" />
          Leave
        </Button>
      </div>
    </div>

    {/* Connection warning banner */}
    {quality === 'poor' && suggestion && (
      <div className="bg-yellow-500/20 border-b border-yellow-500/30 px-4 py-2 text-center">
        <p className="text-xs text-yellow-300">⚠️ {suggestion}</p>
      </div>
    )}
    </div>
  );
};
