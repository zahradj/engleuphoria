import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { ttsService } from '@/services/ttsService';
import { motion } from 'framer-motion';

interface AudioButtonProps {
  text: string;
  voice?: string;
  autoPlay?: boolean;
}

export function AudioButton({ text, voice = 'nova', autoPlay = false }: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlay = async () => {
    if (isPlaying) return;
    
    setIsLoading(true);
    try {
      const audioUrl = await ttsService.generateSpeech(text, voice);
      setIsPlaying(true);
      await ttsService.playAudio(audioUrl);
    } catch (error) {
      console.error('Failed to play audio:', error);
    } finally {
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  // Auto-play on mount if requested
  if (autoPlay && !isPlaying && !isLoading) {
    handlePlay();
  }

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={handlePlay}
        disabled={isPlaying || isLoading}
        className="rounded-full w-12 h-12"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : isPlaying ? (
          <VolumeX className="h-5 w-5" />
        ) : (
          <Volume2 className="h-5 w-5" />
        )}
      </Button>
    </motion.div>
  );
}
