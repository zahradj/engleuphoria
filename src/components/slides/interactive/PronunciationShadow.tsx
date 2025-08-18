import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slide } from '@/types/slides';
import { Mic, Square, Play, Pause } from 'lucide-react';

interface PronunciationShadowProps {
  slide: Slide;
  onComplete: (fluencyData: { secondsSpoken: number; attempts: number }) => void;
}

export function PronunciationShadow({ slide, onComplete }: PronunciationShadowProps) {
  const [isRecording, setIsRecording] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [recordingTime, setRecordingTime] = React.useState(0);
  const [attempts, setAttempts] = React.useState(0);
  const [hasRecorded, setHasRecorded] = React.useState(false);

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const recordedAudioRef = React.useRef<string | null>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const targetText = slide.instructions || slide.prompt || "Repeat after me";
  const modelAudioUrl = slide.media?.url;

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        recordedAudioRef.current = audioUrl;
        setHasRecorded(true);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setAttempts(prev => prev + 1);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const playModelAudio = () => {
    if (modelAudioUrl) {
      const audio = new Audio(modelAudioUrl);
      setIsPlaying(true);
      
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);
      
      audio.play().catch(console.error);
    }
  };

  const playRecordedAudio = () => {
    if (recordedAudioRef.current) {
      const audio = new Audio(recordedAudioRef.current);
      audio.play().catch(console.error);
    }
  };

  const handleComplete = () => {
    onComplete({
      secondsSpoken: recordingTime,
      attempts: attempts
    });
  };

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 p-6 max-w-2xl mx-auto">
      {/* Instructions */}
      <div className="text-center space-y-3">
        <h3 className="text-2xl font-semibold">{slide.prompt}</h3>
        <p className="text-muted-foreground">
          Listen to the model pronunciation, then record yourself saying it
        </p>
      </div>

      {/* Target Text */}
      <Card className="p-6 bg-accent-soft text-center">
        <Badge variant="outline" className="mb-3">Practice Text</Badge>
        <p className="text-xl font-medium">{targetText}</p>
      </Card>

      {/* Model Audio Section */}
      {modelAudioUrl && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Model Pronunciation</h4>
              <p className="text-sm text-muted-foreground">Listen first</p>
            </div>
            <Button
              variant="outline"
              onClick={playModelAudio}
              disabled={isPlaying}
              className="mobile-touch-target"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? 'Playing...' : 'Listen'}
            </Button>
          </div>
        </Card>
      )}

      {/* Recording Section */}
      <Card className="p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Badge variant="secondary">
              Attempt {attempts}
            </Badge>
            {isRecording && (
              <Badge variant="destructive" className="animate-pulse">
                Recording: {formatTime(recordingTime)}
              </Badge>
            )}
          </div>

          <div className="flex justify-center gap-3">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                size="lg"
                className="bg-success hover:bg-success/90 mobile-touch-target"
              >
                <Mic className="h-5 w-5 mr-2" />
                Start Recording
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                size="lg"
                variant="destructive"
                className="mobile-touch-target"
              >
                <Square className="h-5 w-5 mr-2" />
                Stop Recording
              </Button>
            )}
          </div>

          {hasRecorded && (
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={playRecordedAudio}
                className="mobile-touch-target"
              >
                <Play className="h-4 w-4 mr-2" />
                Play My Recording
              </Button>
              
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={startRecording}
                  size="sm"
                >
                  Try Again
                </Button>
                <Button
                  onClick={handleComplete}
                  className="bg-success hover:bg-success/90"
                  size="sm"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Tips */}
      <Card className="p-4 bg-info-soft">
        <h4 className="font-medium mb-2">💡 Tips for better pronunciation:</h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• Listen to the model audio first</li>
          <li>• Speak clearly and at a normal pace</li>
          <li>• Don't worry about being perfect - practice makes progress!</li>
        </ul>
      </Card>
    </div>
  );
}