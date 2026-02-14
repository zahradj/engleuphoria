import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import TypewriterText from './TypewriterText';

interface ProcessingPhaseProps {
  onComplete: () => void;
}

const ProcessingPhase = ({ onComplete }: ProcessingPhaseProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 4000;
    const interval = 50;
    const step = 100 / (duration / interval);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= 100) {
        setProgress(100);
        clearInterval(timer);
        setTimeout(onComplete, 500);
      } else {
        setProgress(current);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 p-8">
      {/* Animated icon */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.4)]">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
        {/* Glow ring */}
        <motion.div
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 rounded-full border-2 border-violet-400"
        />
      </motion.div>

      {/* Text */}
      <div className="text-center text-white text-lg">
        <TypewriterText text="Generating your personalized learning path..." speed={40} />
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-sm">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>
        <p className="text-white/50 text-xs text-center mt-2">{Math.round(progress)}%</p>
      </div>
    </div>
  );
};

export default ProcessingPhase;
