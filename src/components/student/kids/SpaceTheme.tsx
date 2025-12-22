import React from 'react';
import { motion } from 'framer-motion';

export const SpaceTheme: React.FC = () => {
  // Generate stable star positions
  const stars = React.useMemo(() => 
    Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      cx: (i * 23.7) % 1920,
      cy: (i * 13.5) % 1080,
      r: ((i % 5) + 1) * 0.4 + 0.5,
      opacity: 0.3 + (i % 4) * 0.15,
      duration: 2 + (i % 3),
    })), []
  );

  return (
    <>
      {/* Dreamy space gradient - Layer 1 */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, hsl(270, 60%, 25%) 0%, hsl(250, 50%, 15%) 40%, hsl(220, 60%, 10%) 100%)'
        }}
      />
      
      <svg 
        className="absolute inset-0 w-full h-full" 
        viewBox="0 0 1920 1080" 
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Planet Gradients */}
          <radialGradient id="planet1Space" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="hsl(30, 80%, 65%)" />
            <stop offset="100%" stopColor="hsl(20, 70%, 40%)" />
          </radialGradient>
          
          <radialGradient id="planet2Space" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="hsl(200, 70%, 65%)" />
            <stop offset="100%" stopColor="hsl(220, 60%, 45%)" />
          </radialGradient>
          
          <radialGradient id="moonGradientSpace" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="hsl(45, 30%, 90%)" />
            <stop offset="100%" stopColor="hsl(45, 20%, 65%)" />
          </radialGradient>

          {/* Soft glow filters */}
          <filter id="planetGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="starGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>
        
        {/* Twinkling Stars */}
        {stars.map((star) => (
          <motion.circle 
            key={star.id}
            cx={star.cx} 
            cy={star.cy} 
            r={star.r} 
            fill="white"
            filter="url(#starGlow)"
            animate={{ opacity: [star.opacity, star.opacity + 0.3, star.opacity] }}
            transition={{ duration: star.duration, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        
        {/* Nebula clouds - dreamy blurred shapes */}
        <motion.ellipse 
          cx="300" cy="200" rx="250" ry="130" 
          fill="hsl(280, 60%, 50%)" 
          opacity="0.12"
          animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.ellipse 
          cx="450" cy="180" rx="180" ry="100" 
          fill="hsl(200, 70%, 55%)" 
          opacity="0.08"
          animate={{ scale: [1.1, 1, 1.1], x: [0, -15, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.ellipse 
          cx="1500" cy="800" rx="280" ry="150" 
          fill="hsl(330, 60%, 50%)" 
          opacity="0.1"
          animate={{ scale: [1, 1.15, 1], y: [0, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.ellipse 
          cx="1650" cy="850" rx="200" ry="110" 
          fill="hsl(270, 50%, 45%)" 
          opacity="0.08"
          animate={{ scale: [1.1, 1, 1.1], y: [0, -15, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Big Planet with soft glow */}
        <motion.g 
          animate={{ y: [0, 15, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        >
          <circle cx="1650" cy="250" r="150" fill="url(#planet1Space)" filter="url(#planetGlow)" opacity="0.7" />
          {/* Planet ring */}
          <ellipse cx="1650" cy="250" rx="220" ry="40" fill="none" stroke="hsl(30, 60%, 75%)" strokeWidth="8" opacity="0.5" />
        </motion.g>
        
        {/* Small Blue Planet */}
        <motion.g 
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <circle cx="200" cy="700" r="80" fill="url(#planet2Space)" filter="url(#planetGlow)" opacity="0.8" />
        </motion.g>
        
        {/* Moon with craters */}
        <motion.g 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        >
          <circle cx="1100" cy="150" r="50" fill="url(#moonGradientSpace)" filter="url(#planetGlow)" />
          <circle cx="1090" cy="140" r="8" fill="hsl(45, 20%, 60%)" opacity="0.4" />
          <circle cx="1110" cy="160" r="5" fill="hsl(45, 20%, 60%)" opacity="0.4" />
          <circle cx="1080" cy="165" r="6" fill="hsl(45, 20%, 60%)" opacity="0.4" />
        </motion.g>
        
        {/* Rocket - floating gently */}
        <motion.g 
          animate={{ y: [0, -15, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '120px', originY: '490px' }}
        >
          <path d="M 100 500 L 120 450 L 140 500 L 130 500 L 130 530 L 110 530 L 110 500 Z" fill="hsl(0, 0%, 95%)" />
          <circle cx="120" cy="475" r="8" fill="hsl(200, 80%, 55%)" />
          <path d="M 100 500 L 95 520 L 110 505 Z" fill="hsl(0, 70%, 55%)" />
          <path d="M 140 500 L 145 520 L 130 505 Z" fill="hsl(0, 70%, 55%)" />
          {/* Flame */}
          <motion.path 
            d="M 110 530 Q 120 560 130 530" 
            fill="hsl(30, 100%, 55%)" 
            opacity="0.9"
            animate={{ scaleY: [1, 1.3, 1] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
        </motion.g>
        
        {/* Flying Saucer */}
        <motion.g 
          animate={{ x: [0, 30, 0], y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        >
          <ellipse cx="1750" cy="600" rx="50" ry="15" fill="hsl(200, 60%, 55%)" />
          <ellipse cx="1750" cy="590" rx="25" ry="20" fill="hsl(200, 70%, 65%)" />
          <ellipse cx="1750" cy="595" rx="15" ry="10" fill="hsl(180, 100%, 85%)" opacity="0.7" />
          {/* Blinking lights */}
          <motion.circle 
            cx="1720" cy="600" r="4" fill="hsl(120, 100%, 65%)"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
          <motion.circle 
            cx="1750" cy="605" r="4" fill="hsl(45, 100%, 65%)"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
          <motion.circle 
            cx="1780" cy="600" r="4" fill="hsl(0, 100%, 65%)"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
          />
        </motion.g>
        
        {/* Shooting Star */}
        <motion.line 
          x1="600" y1="100" x2="700" y2="150" 
          stroke="white" 
          strokeWidth="2"
          strokeLinecap="round"
          filter="url(#starGlow)"
          animate={{ 
            x1: [600, 1200, 600], 
            y1: [100, 300, 100],
            x2: [700, 1300, 700],
            y2: [150, 350, 150],
            opacity: [0, 1, 1, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
      </svg>
    </>
  );
};
