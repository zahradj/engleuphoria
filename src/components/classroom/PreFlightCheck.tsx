import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Mic, Volume2, CheckCircle2, XCircle, Loader2, Wifi, WifiOff, Headphones, LogIn } from 'lucide-react';
import { usePreFlightCheck } from '@/hooks/usePreFlightCheck';
import { Progress } from '@/components/ui/progress';

export type HubType = 'playground' | 'academy' | 'professional';

interface PreFlightCheckProps {
  onComplete: () => void;
  hubType?: HubType;
  role?: 'student' | 'teacher';
}

const hubThemes: Record<HubType, { gradient: string; accent: string; btnGradient: string; label: string }> = {
  playground: {
    gradient: 'from-orange-500/20 via-amber-500/10 to-yellow-500/20',
    accent: 'text-orange-500',
    btnGradient: 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600',
    label: '🎪 Playground',
  },
  academy: {
    gradient: 'from-blue-500/20 via-indigo-500/10 to-purple-500/20',
    accent: 'text-blue-500',
    btnGradient: 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600',
    label: '📘 Academy',
  },
  professional: {
    gradient: 'from-emerald-500/20 via-teal-500/10 to-green-500/20',
    accent: 'text-emerald-500',
    btnGradient: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600',
    label: '🏆 Success Hub',
  },
};

export const PreFlightCheck: React.FC<PreFlightCheckProps> = ({ onComplete, hubType = 'academy', role = 'student' }) => {
  const {
    cameraStatus, micStatus, speakerStatus,
    videoStream, audioLevel,
    cameraError, micError,
    runCameraCheck, runMicCheck, confirmSpeaker, playSpeakerTest,
    allPassed, cleanup,
    videoDevices, audioInputDevices, audioOutputDevices,
    selectedVideoDevice, selectedAudioInput, selectedAudioOutput,
    setSelectedVideoDevice, setSelectedAudioInput, setSelectedAudioOutput,
    connectionQuality,
  } = usePreFlightCheck();

  const videoRef = useRef<HTMLVideoElement>(null);
  const theme = hubThemes[hubType];

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  const handleJoin = () => {
    cleanup();
    onComplete();
  };

  const statusIcon = (status: string) => {
    if (status === 'checking') return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
    if (status === 'passed') return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (status === 'failed') return <XCircle className="h-5 w-5 text-destructive" />;
    return <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />;
  };

  const connectionIcon = () => {
    const { status } = connectionQuality;
    if (status === 'good') return <Wifi className="h-4 w-4 text-green-500" />;
    if (status === 'fair') return <Wifi className="h-4 w-4 text-amber-500" />;
    if (status === 'poor') return <WifiOff className="h-4 w-4 text-destructive" />;
    return <Wifi className="h-4 w-4 text-muted-foreground" />;
  };

  const connectionLabel = () => {
    const { status, downlink } = connectionQuality;
    if (status === 'good') return 'Connection: Excellent';
    if (status === 'fair') return `Connection: Fair (${downlink?.toFixed(1)} Mbps)`;
    if (status === 'poor') return 'Your connection is a bit sleepy today. Moving closer to the router might wake it up!';
    return 'Checking connection...';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradient} bg-background flex items-center justify-center p-4`}>
      <Card className="w-full max-w-lg backdrop-blur-xl bg-card/80 border border-border/50 shadow-2xl">
        <CardContent className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <Badge variant="outline" className={`${theme.accent} border-current/30 mb-2`}>
              {theme.label}
            </Badge>
            <h2 className="text-2xl font-bold text-foreground">Green Room</h2>
            <p className="text-muted-foreground text-sm">
              {role === 'teacher'
                ? "Let's check your setup before entering the classroom."
                : "Let's make sure you look and sound great before class!"}
            </p>
          </div>

          {/* Connection Quality */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
            {connectionIcon()}
            <span className={`text-xs ${connectionQuality.status === 'poor' ? 'text-destructive' : 'text-muted-foreground'}`}>
              {connectionLabel()}
            </span>
          </div>

          {/* Camera Check */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {statusIcon(cameraStatus)}
                <Camera className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">Camera</span>
              </div>
              {(cameraStatus === 'idle' || cameraStatus === 'failed') && (
                <Button size="sm" variant="outline" onClick={runCameraCheck}>
                  {cameraStatus === 'failed' ? 'Retry' : 'Test'}
                </Button>
              )}
            </div>
            {cameraStatus === 'passed' && videoStream && (
              <div className="rounded-xl overflow-hidden bg-black aspect-video max-h-44 ring-2 ring-border/30">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />
              </div>
            )}
            {videoDevices.length > 1 && cameraStatus === 'passed' && (
              <Select value={selectedVideoDevice} onValueChange={setSelectedVideoDevice}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select camera" />
                </SelectTrigger>
                <SelectContent>
                  {videoDevices.map(d => (
                    <SelectItem key={d.deviceId} value={d.deviceId} className="text-xs">{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {cameraError && <p className="text-xs text-destructive">{cameraError}</p>}
          </div>

          {/* Mic Check */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {statusIcon(micStatus)}
                <Mic className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">Microphone</span>
              </div>
              {(micStatus === 'idle' || micStatus === 'failed') && (
                <Button size="sm" variant="outline" onClick={runMicCheck}>
                  {micStatus === 'failed' ? 'Retry' : 'Test'}
                </Button>
              )}
            </div>
            {(micStatus === 'passed' || micStatus === 'checking') && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Level:</span>
                <Progress value={audioLevel} className="h-3 flex-1" />
                <Badge variant="secondary" className="text-xs">{Math.round(audioLevel)}%</Badge>
              </div>
            )}
            {audioInputDevices.length > 1 && micStatus === 'passed' && (
              <Select value={selectedAudioInput} onValueChange={setSelectedAudioInput}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select microphone" />
                </SelectTrigger>
                <SelectContent>
                  {audioInputDevices.map(d => (
                    <SelectItem key={d.deviceId} value={d.deviceId} className="text-xs">{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {micError && <p className="text-xs text-destructive">{micError}</p>}
          </div>

          {/* Speaker Check */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {statusIcon(speakerStatus)}
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">Speakers</span>
                <Badge variant="outline" className="text-xs">Optional</Badge>
              </div>
            </div>
            {speakerStatus !== 'passed' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={playSpeakerTest} className="text-xs gap-1.5">
                    <Headphones className="h-3.5 w-3.5" />
                    Test Speakers
                  </Button>
                  <span className="text-xs text-muted-foreground">Did you hear the chime?</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs" onClick={confirmSpeaker}>
                    ✅ Yes, I heard it
                  </Button>
                </div>
              </div>
            )}
            {audioOutputDevices.length > 1 && (
              <Select value={selectedAudioOutput} onValueChange={setSelectedAudioOutput}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select speaker" />
                </SelectTrigger>
                <SelectContent>
                  {audioOutputDevices.map(d => (
                    <SelectItem key={d.deviceId} value={d.deviceId} className="text-xs">{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Tech Tip */}
          <div className="bg-muted/30 rounded-lg px-3 py-2">
            <p className="text-xs text-muted-foreground">
              💡 <span className="font-medium">Tip:</span> Using headphones provides the best audio experience for your lesson.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <button
              onClick={onComplete}
              className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
            >
              Skip check
            </button>
            <Button
              onClick={handleJoin}
              disabled={!allPassed}
              className={`px-6 text-white ${allPassed ? theme.btnGradient : ''}`}
            >
              <LogIn className="h-4 w-4 mr-2" />
              Enter Classroom
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
