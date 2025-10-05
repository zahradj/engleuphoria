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
  const { toast } = useToast();

  useEffect(() => {
    if (audio?.autoGenerate && audio.text && !audioUrl) {
      generateAudio();
    }
  }, [audio]);

  useEffect(() => {
    if (audioUrl && autoPlay && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
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
        description: 'Could not generate audio for this slide.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

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
        disabled={isGenerating || !audioUrl}
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
