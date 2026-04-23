import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';
import { supabase } from '@/integrations/supabase/client';
import { Volume2, Check, X, Ear } from 'lucide-react';

interface SoundTriggerProps {
  slide: GeneratedSlide;
  onCorrect?: () => void;
  onIncorrect?: () => void;
  sessionId?: string;
}

/**
 * SoundTrigger — Listening (Teacher-initiated)
 * Teacher plays a sound from Professional Hub.
 * Student selects matching Flat 2.0 vector in Academy Hub.
 * Uses Supabase Realtime for cross-screen sync.
 */
const SoundTrigger: React.FC<SoundTriggerProps> = ({ slide, onCorrect, onIncorrect, sessionId }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [isWaiting, setIsWaiting] = useState(true);
  const [soundPlayed, setSoundPlayed] = useState(false);

  const phonemeTarget = slide.content?.phonemeTarget || '/l/';
  const options = slide.content?.options || ['Lion', 'Apple', 'Cat', 'Dog'];
  const correctIndex = 0; // First option is correct by convention

  // Listen for teacher's sound trigger via Realtime
  useEffect(() => {
    if (!sessionId) {
      // No session — allow self-play mode
      setIsWaiting(false);
      return;
    }

    const channel = supabase
      .channel(`sound-trigger-${sessionId}`)
      .on('broadcast', { event: 'sound_trigger' }, (payload) => {
        setSoundPlayed(true);
        setIsWaiting(false);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const handleSelect = useCallback((index: number) => {
    if (result) return;
    setSelectedId(index);

    if (index === correctIndex) {
      setResult('correct');
      onCorrect?.();
    } else {
      setResult('incorrect');
      onIncorrect?.();
      setTimeout(() => {
        setResult(null);
        setSelectedId(null);
      }, 1200);
    }
  }, [result, correctIndex, onCorrect, onIncorrect]);

  const selfPlaySound = useCallback(() => {
    setSoundPlayed(true);
    setIsWaiting(false);
    // In production, this would trigger TTS for the phoneme
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-[#6B21A8] font-inter flex items-center justify-center gap-2">
          <Ear className="h-5 w-5" />
          Sound Trigger
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {isWaiting
            ? 'Wait for your teacher to play the sound...'
            : `Which image matches the sound ${phonemeTarget}?`}
        </p>
      </div>

      {/* Waiting state */}
      {isWaiting && (
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="w-20 h-20 rounded-full bg-[#6B21A8]/5 flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Volume2 className="h-10 w-10 text-[#6B21A8]/40" />
          </motion.div>
          {!sessionId && (
            <button
              onClick={selfPlaySound}
              className="text-sm text-[#6B21A8] underline"
            >
              Play sound (practice mode)
            </button>
          )}
        </div>
      )}

      {/* Options grid */}
      {!isWaiting && (
        <div className="grid grid-cols-2 gap-4 max-w-sm">
          {options.map((word, idx) => (
            <motion.button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={result === 'correct'}
              className={`relative p-4 rounded-2xl border-2 transition-all text-center ${
                selectedId === idx && result === 'correct'
                  ? 'border-[#2E7D32] bg-[#2E7D32]/5 shadow-[0_0_15px_rgba(46,125,50,0.2)]'
                  : selectedId === idx && result === 'incorrect'
                  ? 'border-[#EF5350] bg-[#EF5350]/5'
                  : 'border-border hover:border-[#6B21A8]/30 bg-card'
              }`}
              whileHover={{ scale: result ? 1 : 1.03 }}
              whileTap={{ scale: result ? 1 : 0.97 }}
              animate={
                selectedId === idx && result === 'incorrect'
                  ? { x: [0, -3, 3, -3, 3, 0] }
                  : {}
              }
            >
              <div className="w-16 h-16 mx-auto bg-muted/20 rounded-xl flex items-center justify-center mb-2">
                <span className="text-3xl">
                  {idx === 0 ? '🦁' : idx === 1 ? '🍎' : idx === 2 ? '🐱' : '🐕'}
                </span>
              </div>
              <p className="text-sm font-medium text-[#6B21A8]">{word}</p>

              {selectedId === idx && result === 'correct' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-[#2E7D32] rounded-full flex items-center justify-center"
                >
                  <Check className="h-4 w-4 text-white" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      )}

      {result === 'correct' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm font-medium text-[#2E7D32]"
        >
          ✨ Perfect ear! That's the {phonemeTarget} sound!
        </motion.p>
      )}
    </div>
  );
};

export default SoundTrigger;
