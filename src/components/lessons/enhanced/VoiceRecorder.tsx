import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, Square, Play, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceRecorderProps {
  prompt: string;
  exampleText: string;
  onComplete: () => void;
}

export function VoiceRecorder({ prompt, exampleText, onComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [hasRecorded, setHasRecorded] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setHasRecorded(true);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording started! 🎤');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success('Recording stopped!');
    }
  };

  const playRecording = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  const handleComplete = () => {
    if (hasRecorded) {
      onComplete();
    } else {
      toast.error('Please record yourself first!');
    }
  };

  return (
    <Card className="p-8 max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-foreground">Voice Practice! 🎤</h3>
        <p className="text-lg text-muted-foreground">{prompt}</p>
        <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <p className="text-xl font-semibold text-foreground">
            "{exampleText}"
          </p>
        </Card>
      </div>

      {/* Recording Visualizer */}
      <div className="flex justify-center">
        <motion.div
          animate={{
            scale: isRecording ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 1,
            repeat: isRecording ? Infinity : 0,
          }}
          className={`w-32 h-32 rounded-full flex items-center justify-center ${
            isRecording 
              ? 'bg-gradient-to-br from-red-500 to-red-600' 
              : hasRecorded 
              ? 'bg-gradient-to-br from-green-500 to-green-600'
              : 'bg-gradient-to-br from-primary to-primary/70'
          } shadow-lg`}
        >
          {isRecording ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Mic className="w-16 h-16 text-white" />
            </motion.div>
          ) : hasRecorded ? (
            <CheckCircle2 className="w-16 h-16 text-white" />
          ) : (
            <Mic className="w-16 h-16 text-white" />
          )}
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 items-center">
        {!isRecording && !hasRecorded && (
          <Button size="lg" onClick={startRecording} className="px-12">
            <Mic className="w-5 h-5 mr-2" />
            Start Recording
          </Button>
        )}

        {isRecording && (
          <Button size="lg" onClick={stopRecording} variant="destructive" className="px-12">
            <Square className="w-5 h-5 mr-2" />
            Stop Recording
          </Button>
        )}

        {hasRecorded && !isRecording && (
          <>
            <div className="flex gap-3">
              <Button variant="outline" onClick={playRecording}>
                <Play className="w-5 h-5 mr-2" />
                Play Recording
              </Button>
              <Button variant="outline" onClick={() => {
                setHasRecorded(false);
                setAudioURL(null);
              }}>
                <Mic className="w-5 h-5 mr-2" />
                Record Again
              </Button>
            </div>
            <Button size="lg" onClick={handleComplete} className="px-12">
              Continue
            </Button>
          </>
        )}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        {isRecording ? 'Recording... Speak clearly!' : 
         hasRecorded ? 'Great! Listen to your recording or continue' :
         'Click to start recording'}
      </div>
    </Card>
  );
}
