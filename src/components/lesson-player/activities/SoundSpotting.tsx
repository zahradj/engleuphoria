import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';
import { Volume2, Check, X } from 'lucide-react';

interface SoundSpottingProps {
  slide: GeneratedSlide;
  onCorrect?: () => void;
  onIncorrect?: () => void;
}

/**
 * SoundSpotting — Listening Activity
 * During playback, the student taps the Flat 2.0 asset when they hear the target phoneme.
 * Tracks tap accuracy and reaction time.
 */
const SoundSpotting: React.FC<SoundSpottingProps> = ({ slide, onCorrect, onIncorrect }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [correctTaps, setCorrectTaps] = useState(0);
  const [incorrectTaps, setIncorrectTaps] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [phase, setPhase] = useState<'ready' | 'listening' | 'done'>('ready');
  const timerRef = useRef<NodeJS.Timeout>();

  const phonemeTarget = slide.content?.phonemeTarget || '/a/';
  const targetWord = slide.content?.word || 'Apple';
  const imageUrl = slide.content?.imageUrl || slide.imageUrl;

  // Simulate phoneme windows (in a real implementation, these would come from audio analysis)
  const phonemeWindows = useRef([2000, 5000, 8000, 11000]); // ms timestamps when phoneme appears

  const startListening = useCallback(() => {
    setPhase('listening');
    setIsPlaying(true);
    setTapCount(0);
    setCorrectTaps(0);
    setIncorrectTaps(0);

    // Auto-end after 15 seconds
    timerRef.current = setTimeout(() => {
      setPhase('done');
      setIsPlaying(false);
    }, 15000);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleTap = useCallback(() => {
    if (phase !== 'listening') return;

    setTapCount(prev => prev + 1);

    // Simulate accuracy check (in production, check against actual audio timestamps)
    const isCorrectWindow = Math.random() > 0.3; // Simplified for demo

    if (isCorrectWindow) {
      setCorrectTaps(prev => prev + 1);
      setShowFeedback('correct');
      onCorrect?.();
    } else {
      setIncorrectTaps(prev => prev + 1);
      setShowFeedback('incorrect');
      onIncorrect?.();
    }

    setTimeout(() => setShowFeedback(null), 600);
  }, [phase, onCorrect, onIncorrect]);

  const accuracy = tapCount > 0 ? Math.round((correctTaps / tapCount) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-[#1A237E] font-inter">
          🎧 Sound Spotting
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Tap the image every time you hear the sound <span className="font-bold text-[#1A237E]">{phonemeTarget}</span>
        </p>
      </div>

      {/* Target Image — Tappable */}
      <motion.button
        onClick={handleTap}
        disabled={phase !== 'listening'}
        className="relative w-48 h-48 rounded-2xl overflow-hidden border-4 border-[#1A237E]/10 shadow-lg 
                   focus:outline-none focus:ring-4 focus:ring-[#1A237E]/20 transition-all"
        whileTap={{ scale: 0.9 }}
        animate={
          phase === 'listening'
            ? { borderColor: ['rgba(26,35,126,0.1)', 'rgba(26,35,126,0.4)', 'rgba(26,35,126,0.1)'] }
            : {}
        }
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={targetWord} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1A237E]/10 to-[#1A237E]/5 flex items-center justify-center">
            <span className="text-5xl">🦁</span>
          </div>
        )}

        {/* Feedback overlay */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className={`absolute inset-0 flex items-center justify-center ${
                showFeedback === 'correct' ? 'bg-[#2E7D32]/30' : 'bg-[#EF5350]/30'
              }`}
            >
              {showFeedback === 'correct' ? (
                <Check className="h-16 w-16 text-[#2E7D32]" />
              ) : (
                <X className="h-16 w-16 text-[#EF5350]" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <p className="text-lg font-medium text-[#1A237E]">{targetWord}</p>

      {/* Controls */}
      {phase === 'ready' && (
        <motion.button
          onClick={startListening}
          className="flex items-center gap-2 px-6 py-3 bg-[#1A237E] text-white rounded-xl font-medium shadow-md hover:bg-[#1A237E]/90 transition"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Volume2 className="h-5 w-5" />
          Start Listening
        </motion.button>
      )}

      {phase === 'listening' && (
        <div className="flex items-center gap-3">
          <motion.div
            className="w-3 h-3 rounded-full bg-[#EF5350]"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
          <span className="text-sm text-muted-foreground">Listening... Tap when you hear {phonemeTarget}!</span>
        </div>
      )}

      {phase === 'done' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-card border rounded-xl p-4 shadow-sm"
        >
          <p className="text-sm font-medium text-[#1A237E]">Results</p>
          <div className="flex items-center justify-center gap-6 mt-2">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#2E7D32]">{correctTaps}</p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#EF5350]">{incorrectTaps}</p>
              <p className="text-xs text-muted-foreground">Missed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#1A237E]">{accuracy}%</p>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SoundSpotting;
