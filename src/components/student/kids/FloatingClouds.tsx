import React from 'react';
import { motion } from 'framer-motion';

interface FloatingCloudsProps {
  theme?: 'jungle' | 'space' | 'underwater';
}

export const FloatingClouds: React.FC<FloatingCloudsProps> = ({ theme = 'jungle' }) => {
  // Different cloud styles per theme
  const cloudConfigs = {
    jungle: [
      { width: 280, height: 100, top: '8%', left: '5%', opacity: 0.7, duration: 25, delay: 0 },
      { width: 200, height: 80, top: '12%', left: '60%', opacity: 0.6, duration: 30, delay: 5 },
      { width: 240, height: 90, top: '5%', left: '30%', opacity: 0.5, duration: 28, delay: 8 },
      { width: 160, height: 60, top: '18%', left: '80%', opacity: 0.4, duration: 22, delay: 12 },
    ],
    space: [], // No clouds in space
    underwater: [], // Bubbles instead of clouds
  };

  const clouds = cloudConfigs[theme];

  if (clouds.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {clouds.map((cloud, index) => (
        <motion.div
          key={index}
          initial={{ x: '-20%' }}
          animate={{ x: '120%' }}
          transition={{
            duration: cloud.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: cloud.delay,
          }}
          className="absolute rounded-full bg-white blur-2xl"
          style={{
            width: cloud.width,
            height: cloud.height,
            top: cloud.top,
            left: cloud.left,
            opacity: cloud.opacity,
          }}
        />
      ))}
      
      {/* Extra dreamy cloud layers with more blur */}
      {clouds.slice(0, 2).map((cloud, index) => (
        <motion.div
          key={`blur-${index}`}
          initial={{ x: '120%' }}
          animate={{ x: '-20%' }}
          transition={{
            duration: cloud.duration + 10,
            repeat: Infinity,
            ease: 'linear',
            delay: cloud.delay + 3,
          }}
          className="absolute rounded-full bg-white/50 blur-3xl"
          style={{
            width: cloud.width * 1.5,
            height: cloud.height * 1.2,
            top: `calc(${cloud.top} + 5%)`,
            left: cloud.left,
            opacity: cloud.opacity * 0.5,
          }}
        />
      ))}
    </div>
  );
};
