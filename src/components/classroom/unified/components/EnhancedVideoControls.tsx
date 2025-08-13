import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Mic, 
  MicOff, 
  Camera, 
  CameraOff, 
  Phone, 
  PhoneOff,
  Monitor,
  CircleDot,
  Square,
  Hand,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedVideoControlsProps {
  isConnected: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
  isRecording: boolean;
  isTeacher: boolean;
  onToggleMicrophone: () => void;
  onToggleCamera: () => void;
  onJoinCall: () => void;
  onLeaveCall: () => void;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  onStartScreenShare?: () => void;
  onRaiseHand?: () => void;
  className?: string;
}

export function EnhancedVideoControls({
  isConnected,
  isMuted,
  isCameraOff,
  isRecording,
  isTeacher,
  onToggleMicrophone,
  onToggleCamera,
  onJoinCall,
  onLeaveCall,
  onStartRecording,
  onStopRecording,
  onStartScreenShare,
  onRaiseHand,
  className
}: EnhancedVideoControlsProps) {

  const ControlButton = ({ 
    icon: Icon, 
    isActive, 
    isDestructive = false,
    isSuccess = false,
    onClick, 
    label,
    disabled = false 
  }: {
    icon: any;
    isActive?: boolean;
    isDestructive?: boolean;
    isSuccess?: boolean;
    onClick: () => void;
    label: string;
    disabled?: boolean;
  }) => (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative group transition-all duration-300 hover:scale-110",
        "border-2 backdrop-blur-md shadow-lg",
        isDestructive && isActive
          ? "bg-red-500/90 border-red-400/60 text-white hover:bg-red-600/90"
          : isSuccess && isActive
          ? "bg-green-500/90 border-green-400/60 text-white hover:bg-green-600/90"
          : isActive
          ? "bg-blue-500/90 border-blue-400/60 text-white hover:bg-blue-600/90"
          : "bg-white/10 border-white/20 text-white hover:bg-white/20",
        disabled && "opacity-50 cursor-not-allowed hover:scale-100"
      )}
      size="lg"
    >
      <Icon className={cn(
        "w-5 h-5 transition-transform duration-200",
        "group-hover:scale-110"
      )} />
      
      {/* Tooltip */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap backdrop-blur-sm">
        {label}
      </div>
      
      {/* Active indicator */}
      {isActive && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
      )}
    </Button>
  );

  return (
    <div className={cn(
      "glass-controls rounded-2xl p-4 shadow-2xl",
      "border border-white/20",
      className
    )}>
      <div className="flex items-center justify-center gap-3">
        {/* Connection control */}
        {!isConnected ? (
          <ControlButton
            icon={Phone}
            onClick={onJoinCall}
            label="Join Call"
            isSuccess={true}
          />
        ) : (
          <ControlButton
            icon={PhoneOff}
            onClick={onLeaveCall}
            label="Leave Call"
            isDestructive={true}
            isActive={true}
          />
        )}

        {/* Audio control */}
        <ControlButton
          icon={isMuted ? MicOff : Mic}
          isActive={!isMuted && isConnected}
          isDestructive={isMuted}
          onClick={onToggleMicrophone}
          label={isMuted ? "Unmute" : "Mute"}
          disabled={!isConnected}
        />

        {/* Video control */}
        <ControlButton
          icon={isCameraOff ? CameraOff : Camera}
          isActive={!isCameraOff && isConnected}
          isDestructive={isCameraOff}
          onClick={onToggleCamera}
          label={isCameraOff ? "Turn On Camera" : "Turn Off Camera"}
          disabled={!isConnected}
        />

        {/* Screen share (if available) */}
        {onStartScreenShare && (
          <ControlButton
            icon={Monitor}
            onClick={onStartScreenShare}
            label="Share Screen"
            disabled={!isConnected}
          />
        )}

        {/* Recording controls (teacher only) */}
        {isTeacher && isConnected && (
          <ControlButton
            icon={isRecording ? Square : CircleDot}
            isActive={isRecording}
            isDestructive={isRecording}
            onClick={isRecording ? onStopRecording! : onStartRecording!}
            label={isRecording ? "Stop Recording" : "Start Recording"}
          />
        )}

        {/* Raise hand (student only) */}
        {!isTeacher && onRaiseHand && (
          <ControlButton
            icon={Hand}
            onClick={onRaiseHand}
            label="Raise Hand"
            disabled={!isConnected}
          />
        )}

        {/* Settings */}
        <ControlButton
          icon={Settings}
          onClick={() => console.log('Settings clicked')}
          label="Settings"
        />
      </div>

      {/* Status indicator */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center justify-center gap-2 text-sm text-white/80">
          <div className={cn(
            "w-2 h-2 rounded-full",
            isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"
          )} />
          <span className="font-medium">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
          {isRecording && (
            <>
              <span className="mx-2">•</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                <span>Recording</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}