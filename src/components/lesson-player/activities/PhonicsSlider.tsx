import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';
import { soundEffectsService } from '@/services/soundEffectsService';
import { Mic, Square, CheckCircle2 } from 'lucide-react';

interface Props {
  slide: GeneratedSlide;
  onCorrect: () => void;
  onIncorrect?: () => void;
}

export default function PhonicsSlider({ slide, onCorrect, onIncorrect }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [waveValues, setWaveValues] = useState<number[]>(Array(20).fill(0.1));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const phoneme = slide.content?.phonemeTarget || slide.content?.title || '/a/';
  const masterWave = Array(20).fill(0).map((_, i) => 0.3 + Math.sin(i * 0.8) * 0.5);

  const startRecording = useCallback(() => {
    setIsRecording(true);
    intervalRef.current = setInterval(() => {
      setWaveValues(prev => prev.map(() => 0.1 + Math.random() * 0.8));
    }, 100);
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    if (intervalRef.current) clearInterval(intervalRef.current);

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // Simulate accuracy (increases with attempts)
    const simulatedAccuracy = Math.min(95, 60 + newAttempts * 12 + Math.random() * 10);
    setAccuracy(Math.round(simulatedAccuracy));
    setShowResult(true);

    if (simulatedAccuracy >= 80) {
      soundEffectsService.playCorrect();
      setTimeout(() => onCorrect(), 1200);
    } else {
      soundEffectsService.playIncorrect();
    }
  }, [attempts, onCorrect]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center rounded-3xl p-8 bg-gradient-to-b from-background to-muted/30">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-foreground mb-2">🎤 Phonics Slider</h2>
        <p className="text-muted-foreground">Hold to record the sound, then release to check</p>
      </motion.div>

      {/* Target Phoneme */}
      <motion.div
        animate={{ scale: isRecording ? [1, 1.05, 1] : 1 }}
        transition={{ repeat: isRecording ? Infinity : 0, duration: 0.8 }}
        className="h-28 w-28 rounded-full border-4 border-[#1A237E]/20 bg-[#1A237E]/5 flex items-center justify-center mb-8"
      >
        <span className="font-mono text-4xl font-bold text-[#1A237E]">{phoneme}</span>
      </motion.div>

      {/* Master Waveform */}
      <div className="w-full max-w-md mb-4">
        <p className="text-xs text-muted-foreground mb-2 text-center">Master Sound</p>
        <div className="flex items-end justify-center gap-0.5 h-12 bg-muted/20 rounded-lg p-2">
          {masterWave.map((v, i) => (
            <div key={i} className="w-2 bg-[#4CAF50]/60 rounded-full transition-all" style={{ height: `${v * 100}%` }} />
          ))}
        </div>
      </div>

      {/* Student Waveform */}
      <div className="w-full max-w-md mb-8">
        <p className="text-xs text-muted-foreground mb-2 text-center">Your Sound</p>
        <div className="flex items-end justify-center gap-0.5 h-12 bg-muted/20 rounded-lg p-2">
          {waveValues.map((v, i) => (
            <motion.div
              key={i}
              className="w-2 rounded-full"
              animate={{ height: `${v * 100}%` }}
              transition={{ duration: 0.1 }}
              style={{ backgroundColor: isRecording ? '#1A237E' : '#94a3b8' }}
            />
          ))}
        </div>
      </div>

      {/* Record Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        className={`h-20 w-20 rounded-full flex items-center justify-center shadow-lg transition-colors ${
          isRecording ? 'bg-[#EF5350] text-white' : 'bg-[#1A237E] text-white'
        }`}
      >
        {isRecording ? <Square className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
      </motion.button>

      {/* Result */}
      <AnimatePresence>
        {showResult && accuracy !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-6 px-6 py-3 rounded-xl text-center ${
              accuracy >= 80 ? 'bg-[#4CAF50]/10 text-[#2E7D32]' : 'bg-amber-100 text-amber-700'
            }`}
          >
            <p className="text-lg font-bold">{accuracy}% Accuracy</p>
            {accuracy >= 80 ? (
              <p className="text-sm flex items-center gap-1 justify-center"><CheckCircle2 className="h-4 w-4" /> Perfect! Moving on...</p>
            ) : (
              <p className="text-sm">Try again! Hold the button longer.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
