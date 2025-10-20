import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedSlideWrapperProps {
  children: ReactNode;
  variant?: 'fade' | 'slide' | 'scale' | 'bounce';
  delay?: number;
}

const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slide: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 }
  },
  scale: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 }
  },
  bounce: {
    initial: { y: -50, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1
    },
    exit: { y: 50, opacity: 0 }
  }
};

export function AnimatedSlideWrapper({ 
  children, 
  variant = 'fade',
  delay = 0 
}: AnimatedSlideWrapperProps) {
  const transition = variant === 'bounce' 
    ? { type: 'spring' as const, bounce: 0.5, duration: 0.5, delay }
    : { duration: 0.5, delay };

  return (
    <motion.div
      initial={variants[variant].initial}
      animate={variants[variant].animate}
      exit={variants[variant].exit}
      transition={transition}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
