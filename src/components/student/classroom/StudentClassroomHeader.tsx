import React from 'react';
import { Button } from '@/components/ui/button';
import englePhoriaLogo from '@/assets/englephoria-logo.png';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Video, VideoOff, LogOut, Signal, SignalMedium, SignalLow, WifiOff, Maximize2, Minimize2, RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useConnectionHealth } from '@/hooks/useConnectionHealth';

type HubType = 'playground' | 'academy' | 'professional';

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
  hubType?: HubType;
  rtcConnected?: boolean;
  onReconnect?: () => void;
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
  onToggleZenMode,
  hubType = 'academy',
  rtcConnected = false,
  onReconnect
}) => {
  const { quality, latencyMs, suggestion } = useConnectionHealth();

  const SignalIcon = quality === 'good' ? Signal : quality === 'fair' ? SignalMedium : SignalLow;
  const signalColor = quality === 'good' ? 'bg-green-600' : quality === 'fair' ? 'bg-yellow-600' : 'bg-red-600';
  const signalLabel = quality === 'good' ? 'Strong' : quality === 'fair' ? 'Unstable' : 'Weak';

  const hubGradient = hubType === 'playground'
    ? 'linear-gradient(135deg, #FF9F1C, #F59E0B)'
    : hubType === 'professional'
    ? 'linear-gradient(135deg, #059669, #10B981)'
    : 'linear-gradient(135deg, #6B21A8, #A855F7)';

  const hubBorderColor = hubType === 'playground'
    ? 'border-amber-200'
    : hubType === 'professional'
    ? 'border-emerald-200'
    : 'border-indigo-200';

  return (
    <div className="relative">
      <div className={`h-14 bg-white/80 backdrop-blur-md border-b ${hubBorderColor} px-4 flex items-center justify-between shadow-sm`}>
        {/* Left: Logo + Live Indicator + Lesson Title */}
        <div className="flex items-center gap-3">
          {/* Hub-Branded Logo */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-md"
              style={{ background: hubGradient }}
            >
              <img src={englePhoriaLogo} alt="EnglEuphoria" className="w-5 h-5 object-contain" />
            </div>
            <span className="text-sm font-bold bg-clip-text text-transparent" style={{ backgroundImage: hubGradient }}>
              EnglEuphoria
            </span>
          </div>
          <div className="h-6 w-px bg-gray-200" />
          {isConnected && (
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-medium text-red-500">LIVE</span>
            </div>
          )}
          <h1 className="text-lg font-semibold text-gray-900">{lessonTitle}</h1>
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
          className={`h-9 w-9 rounded-full ${isMuted ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCamera}
          className={`h-9 w-9 rounded-full ${isCameraOff ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          {isCameraOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
        </Button>
        {onToggleZenMode && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleZenMode}
            className="h-9 w-9 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
            title="Zen Mode (F11)"
          >
            {isZenMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        )}
        {/* Reconnect button - shown when RTC is disconnected */}
        {onReconnect && !rtcConnected && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReconnect}
            className="h-9 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Reconnect
          </Button>
        )}
        <div className="h-6 w-px bg-gray-200 mx-2" />
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
