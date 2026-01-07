import React from 'react';
import { Button } from '@/components/ui/button';
import { useThemeMode } from '@/hooks/useThemeMode';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemeModeToggleProps {
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
}

// Sun ray component for staggered animation
const SunRay = ({ index, total }: { index: number; total: number }) => {
  const angle = (index / total) * 360;
  return (
    <motion.div
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      exit={{ scaleY: 0, opacity: 0 }}
      transition={{ 
        duration: 0.2, 
        delay: index * 0.03,
        ease: "easeOut"
      }}
      className="absolute w-[2px] h-[6px] bg-amber-400 rounded-full"
      style={{
        transform: `rotate(${angle}deg) translateY(-10px)`,
        transformOrigin: 'center center'
      }}
    />
  );
};

// Moon crater component
const MoonCrater = ({ 
  size, 
  top, 
  left, 
  delay 
}: { 
  size: number; 
  top: string; 
  left: string; 
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 0.4, scale: 1 }}
    exit={{ opacity: 0, scale: 0 }}
    transition={{ duration: 0.2, delay }}
    className="absolute bg-slate-400 rounded-full"
    style={{
      width: size,
      height: size,
      top,
      left
    }}
  />
);

export function ThemeModeToggle({ className = '', variant = 'ghost' }: ThemeModeToggleProps) {
  const { resolvedTheme, toggleTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={toggleTheme}
      className={`relative w-9 h-9 overflow-hidden ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 rounded-md"
        initial={false}
        animate={{
          backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(251, 191, 36, 0.1)'
        }}
        transition={{ duration: 0.4 }}
      />

      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          // Sun icon for dark mode (clicking switches to light)
          <motion.div
            key="sun"
            className="relative flex items-center justify-center"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Sun rays */}
            {[...Array(8)].map((_, i) => (
              <SunRay key={i} index={i} total={8} />
            ))}
            
            {/* Sun center */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="w-[10px] h-[10px] bg-gradient-to-br from-amber-300 to-amber-500 rounded-full shadow-lg shadow-amber-400/50"
            />
          </motion.div>
        ) : (
          // Moon icon for light mode (clicking switches to dark)
          <motion.div
            key="moon"
            className="relative flex items-center justify-center"
            initial={{ scale: 0, rotate: 90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -90 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Moon body with shadow/curve effect */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              className="relative w-[14px] h-[14px] bg-gradient-to-br from-slate-200 to-slate-300 rounded-full shadow-lg"
            >
              {/* Craters */}
              <MoonCrater size={3} top="2px" left="3px" delay={0.15} />
              <MoonCrater size={4} top="7px" left="8px" delay={0.2} />
              <MoonCrater size={2} top="4px" left="9px" delay={0.25} />
              
              {/* Moon shadow overlay to create crescent effect */}
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="absolute -top-[2px] -left-[4px] w-[12px] h-[12px] bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-100 dark:to-slate-200 rounded-full"
                style={{ 
                  background: 'inherit',
                  opacity: 0 
                }}
              />
            </motion.div>
            
            {/* Stars around moon */}
            {[
              { top: '-4px', left: '12px', size: 2, delay: 0.2 },
              { top: '10px', left: '-2px', size: 1.5, delay: 0.25 },
              { top: '-2px', left: '-4px', size: 1, delay: 0.3 }
            ].map((star, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.2, delay: star.delay }}
                className="absolute bg-slate-400 rounded-full"
                style={{
                  width: star.size,
                  height: star.size,
                  top: star.top,
                  left: star.left
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
