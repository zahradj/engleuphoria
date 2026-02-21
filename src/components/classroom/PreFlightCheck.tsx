import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Camera, Mic, Volume2, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { usePreFlightCheck } from '@/hooks/usePreFlightCheck';
import { Progress } from '@/components/ui/progress';

interface PreFlightCheckProps {
  onComplete: () => void;
}

export const PreFlightCheck: React.FC<PreFlightCheckProps> = ({ onComplete }) => {
  const {
    cameraStatus, micStatus, speakerStatus,
    videoStream, audioLevel,
    cameraError, micError,
    runCameraCheck, runMicCheck, confirmSpeaker,
    allPassed, cleanup,
  } = usePreFlightCheck();

  const videoRef = useRef<HTMLVideoElement>(null);

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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">Pre-Flight Check ✈️</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Let's make sure your hardware is ready before joining class.
            </p>
          </div>

          {/* Camera Check */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {statusIcon(cameraStatus)}
                <Camera className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">Camera</span>
              </div>
              {cameraStatus === 'idle' && (
                <Button size="sm" variant="outline" onClick={runCameraCheck}>Test</Button>
              )}
              {cameraStatus === 'failed' && (
                <Button size="sm" variant="outline" onClick={runCameraCheck}>Retry</Button>
              )}
            </div>
            {cameraStatus === 'passed' && videoStream && (
              <div className="rounded-lg overflow-hidden bg-black aspect-video max-h-40">
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
            {cameraError && (
              <p className="text-xs text-destructive">{cameraError}</p>
            )}
          </div>

          {/* Mic Check */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {statusIcon(micStatus)}
                <Mic className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">Microphone</span>
              </div>
              {micStatus === 'idle' && (
                <Button size="sm" variant="outline" onClick={runMicCheck}>Test</Button>
              )}
              {micStatus === 'failed' && (
                <Button size="sm" variant="outline" onClick={runMicCheck}>Retry</Button>
              )}
            </div>
            {(micStatus === 'passed' || micStatus === 'checking') && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Level:</span>
                <Progress value={audioLevel} className="h-3 flex-1" />
                <Badge variant="secondary" className="text-xs">{Math.round(audioLevel)}%</Badge>
              </div>
            )}
            {micError && (
              <p className="text-xs text-destructive">{micError}</p>
            )}
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
              <div className="flex items-center gap-2">
                <Checkbox
                  id="speaker-confirm"
                  onCheckedChange={(checked) => {
                    if (checked) confirmSpeaker();
                  }}
                />
                <label htmlFor="speaker-confirm" className="text-sm text-muted-foreground cursor-pointer">
                  I can hear audio from my speakers/headphones
                </label>
              </div>
            )}
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
              className="px-6"
            >
              Join Class 🎓
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
