import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedBackgroundProps {
  theme?: 'default' | 'ocean' | 'forest' | 'sunset' | 'space' | 'minimal';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export function AnimatedBackground({ 
  theme = 'default', 
  intensity = 'medium',
  className 
}: AnimatedBackgroundProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const getThemeColors = () => {
    switch (theme) {
      case 'ocean':
        return {
          primary: 'bg-blue-500/10',
          secondary: 'bg-cyan-400/8',
          accent: 'bg-teal-300/6'
        };
      case 'forest':
        return {
          primary: 'bg-green-500/10',
          secondary: 'bg-emerald-400/8',
          accent: 'bg-lime-300/6'
        };
      case 'sunset':
        return {
          primary: 'bg-orange-500/10',
          secondary: 'bg-pink-400/8',
          accent: 'bg-yellow-300/6'
        };
      case 'space':
        return {
          primary: 'bg-purple-500/10',
          secondary: 'bg-indigo-400/8',
          accent: 'bg-violet-300/6'
        };
      case 'minimal':
        return {
          primary: 'bg-neutral-300/8',
          secondary: 'bg-neutral-200/6',
          accent: 'bg-neutral-100/4'
        };
      default:
        return {
          primary: 'bg-primary-500/10',
          secondary: 'bg-accent-400/8',
          accent: 'bg-primary-300/6'
        };
    }
  };

  const getIntensityMultiplier = () => {
    switch (intensity) {
      case 'low': return 0.5;
      case 'high': return 1.5;
      default: return 1;
    }
  };

  const colors = getThemeColors();
  const multiplier = getIntensityMultiplier();

  const floatingElements = [
    {
      size: 200 * multiplier,
      x: '20%',
      y: '30%',
      duration: 20,
      delay: 0,
      color: colors.primary
    },
    {
      size: 150 * multiplier,
      x: '70%',
      y: '60%',
      duration: 25,
      delay: 5,
      color: colors.secondary
    },
    {
      size: 100 * multiplier,
      x: '50%',
      y: '20%',
      duration: 30,
      delay: 10,
      color: colors.accent
    },
    {
      size: 80 * multiplier,
      x: '85%',
      y: '80%',
      duration: 35,
      delay: 15,
      color: colors.primary
    },
    {
      size: 120 * multiplier,
      x: '15%',
      y: '75%',
      duration: 28,
      delay: 8,
      color: colors.secondary
    }
  ];

  if (prefersReducedMotion) {
    return (
      <div className={cn("absolute inset-0 -z-10 overflow-hidden", className)}>
        {floatingElements.slice(0, 2).map((element, index) => (
          <div
            key={index}
            className={cn(
              "absolute rounded-full blur-3xl opacity-30",
              element.color
            )}
            style={{
              width: element.size,
              height: element.size,
              left: element.x,
              top: element.y,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("absolute inset-0 -z-10 overflow-hidden", className)}>
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className={cn(
            "absolute rounded-full blur-3xl",
            element.color
          )}
          style={{
            width: element.size,
            height: element.size,
            left: element.x,
            top: element.y,
          }}
          animate={{
            x: [-20, 20, -20],
            y: [-10, 10, -10],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-background/5 to-transparent" />
    </div>
  );
}