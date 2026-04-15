import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Camera, Mic, Volume2, CheckCircle2, XCircle, Loader2, Wifi, WifiOff, Headphones, LogIn, Target } from 'lucide-react';
import { usePreFlightCheck } from '@/hooks/usePreFlightCheck';
import { motion, AnimatePresence } from 'framer-motion';

export type HubType = 'playground' | 'academy' | 'professional';

interface PreFlightCheckProps {
  onComplete: () => void;
  hubType?: HubType;
  role?: 'student' | 'teacher';
}

const hubThemes: Record<HubType, { gradient: string; accent: string; ring: string; btnGradient: string; label: string }> = {
  playground: {
    gradient: 'from-orange-500/20 via-amber-500/10 to-yellow-500/20',
    accent: 'text-orange-500',
    ring: 'ring-orange-400',
    btnGradient: 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600',
    label: '🎪 Playground',
  },
  academy: {
    gradient: 'from-blue-500/20 via-indigo-500/10 to-purple-500/20',
    accent: 'text-blue-500',
    ring: 'ring-blue-400',
    btnGradient: 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600',
    label: '📘 Academy',
  },
  professional: {
    gradient: 'from-emerald-500/20 via-teal-500/10 to-green-500/20',
    accent: 'text-emerald-500',
    ring: 'ring-emerald-400',
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
  const [intention, setIntention] = useState('');

  // Auto-start camera and mic checks on mount
  useEffect(() => {
    const autoStart = async () => {
      await runCameraCheck();
      await runMicCheck();
    };
    autoStart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  const handleJoin = () => {
    cleanup();
    onComplete();
  };

  // Progress calculation
  const checksCompleted = [cameraStatus, micStatus, speakerStatus].filter(s => s === 'passed').length;
  const progressPercent = Math.round((checksCompleted / 3) * 100);

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
    if (status === 'poor') return 'Connection is weak — try moving closer to your router.';
    return 'Checking connection...';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradient} bg-background flex items-center justify-center p-4`}>
      <Card className="w-full max-w-lg backdrop-blur-xl bg-card/80 border border-border/50 shadow-2xl">
        <CardContent className="p-8 space-y-5">
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

          {/* Progress Ring */}
          <div className="flex items-center justify-center gap-4">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted/30" />
                <circle
                  cx="32" cy="32" r="28" fill="none" strokeWidth="4"
                  className={theme.accent}
                  stroke="currentColor"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - progressPercent / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
                {checksCompleted}/3
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {checksCompleted === 3 ? '✅ All systems go!' : `${3 - checksCompleted} check${3 - checksCompleted !== 1 ? 's' : ''} remaining`}
            </div>
          </div>

          {/* Connection Quality */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
            {connectionIcon()}
            <span className={`text-xs ${connectionQuality.status === 'poor' ? 'text-destructive' : 'text-muted-foreground'}`}>
              {connectionLabel()}
            </span>
          </div>

          {/* Camera Check */}
          <AnimatePresence>
            <motion.div className="space-y-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {statusIcon(cameraStatus)}
                  <Camera className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">Camera</span>
                </div>
                {cameraStatus === 'failed' && (
                  <Button size="sm" variant="outline" onClick={runCameraCheck}>Retry</Button>
                )}
              </div>
              {(cameraStatus === 'passed' || cameraStatus === 'checking') && videoStream && (
                <div className={`rounded-xl overflow-hidden bg-black aspect-video max-h-48 ring-4 ${theme.ring} ring-opacity-50 shadow-lg`}>
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
            </motion.div>
          </AnimatePresence>

          {/* Mic Check */}
          <motion.div className="space-y-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {statusIcon(micStatus)}
                <Mic className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">Microphone</span>
              </div>
              {micStatus === 'failed' && (
                <Button size="sm" variant="outline" onClick={runMicCheck}>Retry</Button>
              )}
            </div>
            {(micStatus === 'passed' || micStatus === 'checking') && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Level:</span>
                <div className="flex-1 h-3 rounded-full bg-muted/50 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                    animate={{ width: `${audioLevel}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
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
          </motion.div>

          {/* Speaker Check */}
          <motion.div className="space-y-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
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
          </motion.div>

          {/* Success Hub: Intention Input */}
          {hubType === 'professional' && (
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium text-foreground">Set your intention for today</span>
              </div>
              <Input
                value={intention}
                onChange={e => setIntention(e.target.value)}
                placeholder="e.g. Practice presentation skills, improve fluency..."
                className="text-sm bg-muted/30 border-border/50"
              />
            </motion.div>
          )}

          {/* Waiting Status */}
          <motion.div
            className="text-center py-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {role === 'student'
                ? 'Your teacher is connecting...'
                : 'Waiting for your student to join...'}
            </div>
          </motion.div>

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
