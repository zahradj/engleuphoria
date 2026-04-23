import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';
import { soundEffectsService } from '@/services/soundEffectsService';
import { Mic, Play, CheckCircle2 } from 'lucide-react';

interface Props {
  slide: GeneratedSlide;
  onCorrect: () => void;
  onIncorrect?: () => void;
}

const MOUTH_SHAPES: Record<string, { lips: string; tongue: string; hint: string }> = {
  '/æ/': { lips: 'Wide open, spread', tongue: 'Low front', hint: 'Open mouth wide, tongue low and front' },
  '/iː/': { lips: 'Spread, slightly open', tongue: 'High front', hint: 'Smile position, tongue high' },
  '/ʃ/': { lips: 'Rounded, pushed forward', tongue: 'Raised behind teeth', hint: 'Round lips like "shh"' },
  '/θ/': { lips: 'Slightly open', tongue: 'Between teeth', hint: 'Tongue tip between teeth' },
  '/r/': { lips: 'Slightly rounded', tongue: 'Curled back', hint: 'Curl tongue tip back' },
};

export default function MouthMirror({ slide, onCorrect, onIncorrect }: Props) {
  const [step, setStep] = useState<'watch' | 'record' | 'result'>('watch');
  const [isRecording, setIsRecording] = useState(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [animPhase, setAnimPhase] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const phoneme = slide.content?.phonemeTarget || '/æ/';
  const shape = MOUTH_SHAPES[phoneme] || MOUTH_SHAPES['/æ/'];

  const playAnimation = useCallback(() => {
    setAnimPhase(0);
    let phase = 0;
    intervalRef.current = setInterval(() => {
      phase++;
      setAnimPhase(phase);
      if (phase >= 4) {
        clearInterval(intervalRef.current!);
        setStep('record');
      }
    }, 600);
  }, []);

  const handleRecord = useCallback(() => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      const acc = Math.min(98, 55 + newAttempts * 15 + Math.random() * 10);
      setAccuracy(Math.round(acc));
      setStep('result');

      if (acc >= 75) {
        soundEffectsService.playCorrect();
        setTimeout(() => onCorrect(), 1200);
      } else {
        soundEffectsService.playIncorrect();
      }
    }, 2000);
  }, [attempts, onCorrect]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center rounded-3xl p-8 bg-gradient-to-b from-background to-muted/30">
      <h2 className="text-2xl font-bold text-foreground mb-2">👄 Mouth Mirror</h2>
      <p className="text-muted-foreground text-sm mb-6">Watch the articulation, then mimic the sound</p>

      {/* Mouth Visualization */}
      <div className="relative h-40 w-40 mb-6">
        <motion.div
          animate={{
            borderRadius: animPhase >= 2 ? '50% 50% 50% 50%' : '40% 40% 60% 60%',
            scaleY: animPhase >= 1 ? 1.3 : 1,
            scaleX: animPhase >= 3 ? 1.2 : 1,
          }}
          transition={{ duration: 0.4 }}
          className="h-full w-full border-4 border-[#EF5350] bg-[#EF5350]/10 flex items-center justify-center"
        >
          <motion.div
            animate={{ y: animPhase >= 2 ? -10 : 0, scaleX: animPhase >= 3 ? 1.3 : 1 }}
            className="h-6 w-16 bg-[#EF5350]/40 rounded-full"
          />
        </motion.div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground text-center w-48">
          {shape.hint}
        </div>
      </div>

      {/* Phoneme Label */}
      <div className="h-16 w-16 rounded-full bg-[#6B21A8]/10 border-2 border-[#6B21A8]/20 flex items-center justify-center mb-6">
        <span className="font-mono text-2xl font-bold text-[#6B21A8]">{phoneme}</span>
      </div>

      {/* Action Buttons */}
      {step === 'watch' && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={playAnimation}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6B21A8] text-white font-bold shadow-lg"
        >
          <Play className="h-5 w-5" /> Watch Articulation
        </motion.button>
      )}

      {step === 'record' && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRecord}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg ${
            isRecording ? 'bg-[#EF5350] text-white' : 'bg-[#4CAF50] text-white'
          }`}
        >
          <Mic className="h-5 w-5" /> {isRecording ? 'Recording...' : 'Your Turn — Record'}
        </motion.button>
      )}

      <AnimatePresence>
        {step === 'result' && accuracy !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 px-6 py-3 rounded-xl text-center ${
              accuracy >= 75 ? 'bg-[#4CAF50]/10 text-[#2E7D32]' : 'bg-amber-100 text-amber-700'
            }`}
          >
            <p className="text-lg font-bold">{accuracy}% Match</p>
            {accuracy >= 75 ? (
              <p className="text-sm flex items-center gap-1 justify-center"><CheckCircle2 className="h-4 w-4" /> Great articulation!</p>
            ) : (
              <button onClick={() => setStep('watch')} className="text-sm underline mt-1">Watch again & retry</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
