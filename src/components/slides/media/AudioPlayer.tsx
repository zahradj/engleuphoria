import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Loader2, PlayCircle, PauseCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { AudioConfig } from '@/types/slides';
import { useToast } from '@/hooks/use-toast';

interface AudioPlayerProps {
  audio?: AudioConfig;
  className?: string;
  autoPlay?: boolean;
}

export function AudioPlayer({ audio, className, autoPlay = false }: AudioPlayerProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(audio?.url || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (audio?.autoGenerate && audio.text && !audioUrl) {
      generateAudio();
    }
  }, [audio]);

useEffect(() => {
  if (autoPlay) {
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    } else if (!audioUrl && audio?.text) {
      speak();
    }
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [audioUrl, autoPlay]);

  const generateAudio = async () => {
    if (!audio?.text) return;
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text: audio.text }
      });
      if (error) throw error;
      if (data?.audioContent) {
        const audioDataUrl = `data:audio/mp3;base64,${data.audioContent}`;
        setAudioUrl(audioDataUrl);
      }
    } catch (err) {
      console.error('Failed to generate audio:', err);
      toast({
        title: 'Audio generation failed',
        description: 'Could not generate audio for this slide. Using device voice instead.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const speak = () => {
    if (!audio?.text) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      toast({
        title: 'Audio not available',
        description: 'Text-to-speech is not supported in this browser.',
        variant: 'destructive'
      });
      return;
    }
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(audio.text);
    utter.onend = () => setIsPlaying(false);
    utter.onerror = () => setIsPlaying(false);
    utteranceRef.current = utter;
    window.speechSynthesis.speak(utter);
    setIsPlaying(true);
  };

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }
    if (audio?.text) {
      if (isPlaying) {
        stopSpeech();
      } else {
        speak();
      }
    }
  };

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  if (!audio) return null;

  return (
    <div className={className}>
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />
      )}

      <Button
        onClick={togglePlay}
        disabled={isGenerating || !(audioUrl || audio?.text)}
        variant="outline"
        size="lg"
        className="gap-2"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Generating audio...
          </>
        ) : isPlaying ? (
          <>
            <PauseCircle className="h-5 w-5" />
            Pause
          </>
        ) : (
          <>
            <PlayCircle className="h-5 w-5" />
            Play Audio
          </>
        )}
      </Button>
    </div>
  );
}
