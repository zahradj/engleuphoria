import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SlideTransitionProps {
  children: React.ReactNode;
  slideKey: string | number;
  direction?: 'next' | 'previous';
  transitionType?: 'fade' | 'slide' | 'scale' | 'none';
  className?: string;
}

export function SlideTransition({
  children,
  slideKey,
  direction = 'next',
  transitionType = 'fade',
  className
}: SlideTransitionProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const variants: Record<string, Variants> = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slide: {
      initial: { 
        opacity: 0,
        x: direction === 'next' ? 100 : -100 
      },
      animate: { 
        opacity: 1,
        x: 0 
      },
      exit: { 
        opacity: 0,
        x: direction === 'next' ? -100 : 100 
      }
    },
    scale: {
      initial: { 
        opacity: 0,
        scale: 0.8 
      },
      animate: { 
        opacity: 1,
        scale: 1 
      },
      exit: { 
        opacity: 0,
        scale: 0.8 
      }
    },
    none: {
      initial: {},
      animate: {},
      exit: {}
    }
  };

  const transition = prefersReducedMotion 
    ? { duration: 0 }
    : { 
        duration: 0.3,
        ease: 'easeInOut' as const
      };

  const activeVariants = prefersReducedMotion ? variants.none : variants[transitionType];

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={slideKey}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={activeVariants}
        transition={transition}
        className={cn("w-full h-full", className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}