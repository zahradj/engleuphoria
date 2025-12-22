import React from 'react';
import { motion } from 'framer-motion';
import { Star, Lock, Play } from 'lucide-react';

interface LevelNodeProps {
  id: string;
  number: number;
  title: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
  position: { x: number; y: number };
  onClick?: () => void;
  theme?: 'jungle' | 'space' | 'underwater';
}

export const LevelNode: React.FC<LevelNodeProps> = ({
  id,
  number,
  title,
  isCompleted,
  isCurrent,
  isLocked,
  position,
  onClick,
  theme = 'jungle',
}) => {
  // Theme-specific accent colors for icons and badges
  const themeAccents = {
    jungle: {
      completedBg: 'hsl(45, 100%, 50%)',
      currentBg: 'hsl(145, 70%, 45%)',
      completedText: 'text-amber-600',
      currentText: 'text-emerald-600',
    },
    space: {
      completedBg: 'hsl(280, 70%, 60%)',
      currentBg: 'hsl(200, 80%, 55%)',
      completedText: 'text-purple-600',
      currentText: 'text-cyan-600',
    },
    underwater: {
      completedBg: 'hsl(175, 70%, 45%)',
      currentBg: 'hsl(220, 70%, 55%)',
      completedText: 'text-teal-600',
      currentText: 'text-blue-600',
    },
  };

  const accents = themeAccents[theme];

  const getIcon = () => {
    if (isCompleted) {
      return <Star className="w-8 h-8 text-white fill-white drop-shadow-lg" />;
    }
    if (isCurrent) {
      return <Play className="w-8 h-8 text-white fill-white drop-shadow-lg" />;
    }
    return <Lock className="w-6 h-6 text-white/50" />;
  };

  // Glassmorphism base styles
  const glassBase = "bg-white/30 backdrop-blur-md border-2 border-white/50 shadow-lg";
  
  // State-specific glass enhancements
  const getGlassStyle = () => {
    if (isCompleted) {
      return `${glassBase} shadow-amber-400/30 hover:bg-white/40`;
    }
    if (isCurrent) {
      return `${glassBase} shadow-emerald-400/40 ring-4 ring-white/60 ring-offset-2 ring-offset-transparent hover:bg-white/45`;
    }
    return `${glassBase} opacity-60`;
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 20,
        delay: number * 0.1 
      }}
      style={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      className="z-10"
    >
      <motion.button
        onClick={!isLocked ? onClick : undefined}
        whileHover={!isLocked ? { scale: 1.15 } : {}}
        whileTap={!isLocked ? { scale: 0.9 } : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className={`
          relative w-20 h-20 md:w-24 md:h-24 rounded-full 
          ${getGlassStyle()}
          flex items-center justify-center
          transition-all duration-300
          ${!isLocked ? 'cursor-pointer' : 'cursor-not-allowed'}
        `}
        disabled={isLocked}
      >
        {/* Inner glow effect */}
        <div 
          className="absolute inset-1 rounded-full flex items-center justify-center"
          style={{
            background: isCompleted 
              ? `radial-gradient(circle, ${accents.completedBg}40 0%, transparent 70%)`
              : isCurrent 
                ? `radial-gradient(circle, ${accents.currentBg}40 0%, transparent 70%)`
                : 'transparent'
          }}
        >
          {getIcon()}
        </div>
        
        {/* Level number badge - glass style */}
        <motion.div 
          className={`
            absolute -top-2 -right-2 w-8 h-8 rounded-full 
            flex items-center justify-center text-sm font-bold
            bg-white/80 backdrop-blur-sm shadow-md border border-white/60
            ${isCompleted ? accents.completedText : 
              isCurrent ? accents.currentText : 
              'text-gray-500'}
          `}
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          {number}
        </motion.div>
        
        {/* Current level floating indicator */}
        {isCurrent && (
          <motion.div
            animate={{ y: [-8, 0, -8] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-12 left-1/2 -translate-x-1/2"
          >
            <div className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-lg text-sm font-bold text-emerald-600 whitespace-nowrap border border-white/60">
              Play Now!
            </div>
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white/90 mx-auto" />
          </motion.div>
        )}

        {/* Sparkle effect for completed */}
        {isCompleted && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute top-1 right-2 w-2 h-2 rounded-full bg-yellow-300 blur-sm" />
            <div className="absolute bottom-2 left-1 w-1.5 h-1.5 rounded-full bg-amber-300 blur-sm" />
          </motion.div>
        )}
      </motion.button>
      
      {/* Title label - glass style */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: number * 0.1 + 0.2 }}
        className={`
          mt-3 text-center text-sm md:text-base font-bold
          px-3 py-1 rounded-full
          ${isLocked 
            ? 'text-white/50' 
            : 'text-white bg-black/20 backdrop-blur-sm shadow-lg'}
          max-w-[100px] truncate mx-auto
        `}
      >
        {isLocked ? '???' : title}
      </motion.div>
    </motion.div>
  );
};
