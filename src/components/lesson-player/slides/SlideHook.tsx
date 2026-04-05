import React from 'react';
import { motion } from 'framer-motion';
import { GeneratedSlide, HubType } from '@/components/admin/lesson-builder/ai-wizard/types';
import { HUB_CONFIGS } from '@/components/admin/lesson-builder/ai-wizard/hubConfig';
import PipMascot from '../PipMascot';
import { Play, Loader2, Square } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

interface Props {
  slide: GeneratedSlide;
  hub: HubType;
}

// Kid-friendly expressive voice for songs
const SONG_VOICE_ID = 'pFZP5JQG7iQjIQuC4Bku'; // Lily — expressive kid voice

export default function SlideHook({ slide, hub }: Props) {
  const config = HUB_CONFIGS[hub];
  const content = slide.content?.prompt || slide.title;
  const hasImage = slide.imageUrl && slide.imageUrl.length > 5;
  const { speak, stop, isLoading, isPlaying } = useTextToSpeech();

  // Detect song slides
  const isSong = slide.keywords?.some(k => ['song', 'warm-up', 'music', 'chant'].includes(k))
    || slide.title?.toLowerCase().includes('song')
    || slide.title?.toLowerCase().includes('chant');

  const handlePlaySong = () => {
    if (isPlaying) {
      stop();
      return;
    }
    const lyrics = slide.content?.prompt || slide.title || '';
    speak(lyrics, { voiceId: SONG_VOICE_ID, speed: 0.95 });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 w-full text-center">
      {hasImage && (
        <motion.img
          src={slide.imageUrl}
          alt={slide.title}
          className="w-full max-w-lg rounded-2xl object-cover"
          style={{ maxHeight: 300 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          loading="lazy"
        />
      )}

      <motion.h1
        className="text-3xl font-bold"
        style={{ color: config.colorPalette.primary, fontFamily: hub === 'playground' ? "'Quicksand', sans-serif" : undefined }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {slide.title}
      </motion.h1>

      <motion.p
        className="text-lg leading-relaxed max-w-xl whitespace-pre-line"
        style={{ color: config.colorPalette.text }}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {content}
      </motion.p>

      {/* Song Play Button */}
      {isSong && (
        <motion.button
          onClick={handlePlaySong}
          disabled={isLoading}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transition-all"
          style={{
            background: isPlaying
              ? 'linear-gradient(135deg, #ef4444, #dc2626)'
              : 'linear-gradient(135deg, #FF9F1C, #FFBF00)',
            color: '#1a1a2e',
            fontFamily: "'Quicksand', sans-serif",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
        >
          {isLoading ? (
            <Loader2 size={24} className="animate-spin" />
          ) : isPlaying ? (
            <Square size={24} />
          ) : (
            <Play size={24} />
          )}
          {isLoading ? 'Loading...' : isPlaying ? 'Stop' : '🎵 Play Song'}
        </motion.button>
      )}

      {hub === 'playground' && config.mascot && (
        <PipMascot size={80} animation="wave" />
      )}
    </div>
  );
}
