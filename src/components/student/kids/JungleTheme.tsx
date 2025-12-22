import React from 'react';
import { motion } from 'framer-motion';

export const JungleTheme: React.FC = () => {
  return (
    <>
      {/* Dreamy sky gradient background - Layer 1 */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at top, hsl(195, 85%, 75%) 0%, hsl(200, 80%, 65%) 30%, hsl(160, 60%, 55%) 70%, hsl(130, 50%, 45%) 100%)'
        }}
      />
      
      {/* SVG elements */}
      <svg 
        className="absolute inset-0 w-full h-full" 
        viewBox="0 0 1920 1080" 
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Soft blur filter for dreamy look */}
          <filter id="softBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          
          {/* Ground Gradient */}
          <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(120, 50%, 45%)" />
            <stop offset="100%" stopColor="hsl(120, 40%, 35%)" />
          </linearGradient>
          
          {/* Sun Gradient */}
          <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(50, 100%, 85%)" />
            <stop offset="50%" stopColor="hsl(45, 100%, 70%)" />
            <stop offset="100%" stopColor="hsl(40, 100%, 60%)" />
          </radialGradient>

          {/* Sun glow */}
          <filter id="sunGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="20" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Sun with soft glow */}
        <motion.circle 
          cx="1700" 
          cy="150" 
          r="100" 
          fill="url(#sunGradient)" 
          filter="url(#sunGlow)"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Background Trees with sway animation */}
        <g opacity="0.5" filter="url(#softBlur)">
          {/* Tree 1 */}
          <motion.g
            style={{ originX: '120px', originY: '600px' }}
            animate={{ rotate: [-1.5, 1.5, -1.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <rect x="100" y="400" width="40" height="200" fill="hsl(30, 40%, 35%)" rx="5" />
            <ellipse cx="120" cy="380" rx="80" ry="100" fill="hsl(120, 50%, 35%)" />
          </motion.g>
          
          {/* Tree 2 */}
          <motion.g
            style={{ originX: '325px', originY: '600px' }}
            animate={{ rotate: [1, -1.5, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <rect x="300" y="350" width="50" height="250" fill="hsl(30, 40%, 30%)" rx="5" />
            <ellipse cx="325" cy="320" rx="100" ry="120" fill="hsl(120, 45%, 30%)" />
          </motion.g>
          
          {/* Tree 3 */}
          <motion.g
            style={{ originX: '1622px', originY: '600px' }}
            animate={{ rotate: [-1, 2, -1] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <rect x="1600" y="380" width="45" height="220" fill="hsl(30, 40%, 32%)" rx="5" />
            <ellipse cx="1622" cy="350" rx="90" ry="110" fill="hsl(120, 48%, 32%)" />
          </motion.g>
          
          {/* Tree 4 */}
          <motion.g
            style={{ originX: '1767px', originY: '600px' }}
            animate={{ rotate: [1.5, -1, 1.5] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          >
            <rect x="1750" y="420" width="35" height="180" fill="hsl(30, 40%, 35%)" rx="5" />
            <ellipse cx="1767" cy="400" rx="70" ry="90" fill="hsl(120, 50%, 35%)" />
          </motion.g>
        </g>
        
        {/* Ground with soft edge */}
        <path 
          d="M 0 680 Q 200 650 400 680 T 800 660 T 1200 690 T 1600 670 T 1920 690 L 1920 1080 L 0 1080 Z" 
          fill="url(#groundGradient)" 
        />
        
        {/* Grass details - subtle */}
        <g fill="hsl(120, 55%, 40%)" opacity="0.6">
          {[50, 150, 250, 450, 650, 850, 1050, 1250, 1450, 1650, 1850].map((x, i) => (
            <motion.path 
              key={i}
              d={`M ${x} ${680 + Math.sin(x/100) * 20} Q ${x+5} ${660 + Math.sin(x/100) * 20} ${x+10} ${680 + Math.sin(x/100) * 20}`}
              strokeWidth="3" 
              stroke="hsl(120, 55%, 40%)" 
              fill="none"
              animate={{ rotate: [-3, 3, -3] }}
              style={{ originX: `${x+5}px`, originY: `${680 + Math.sin(x/100) * 20}px` }}
              transition={{ duration: 3 + i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </g>
        
        {/* Decorative flowers - softer */}
        <g opacity="0.8">
          {[
            { x: 180, y: 700, color: 'hsl(330, 80%, 65%)' },
            { x: 520, y: 685, color: 'hsl(45, 100%, 55%)' },
            { x: 980, y: 695, color: 'hsl(280, 70%, 60%)' },
            { x: 1380, y: 705, color: 'hsl(0, 80%, 60%)' },
            { x: 1720, y: 690, color: 'hsl(200, 80%, 60%)' },
          ].map((flower, i) => (
            <motion.g 
              key={i}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
            >
              <circle cx={flower.x} cy={flower.y} r="8" fill={flower.color} />
              <circle cx={flower.x} cy={flower.y} r="4" fill="hsl(45, 100%, 70%)" />
            </motion.g>
          ))}
        </g>
        
        {/* Butterflies - dreamy floating */}
        <motion.g 
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M 200 400 Q 210 385 220 400 Q 210 415 200 400" fill="hsl(280, 70%, 60%)" opacity="0.7" />
          <path d="M 220 400 Q 230 385 240 400 Q 230 415 220 400" fill="hsl(330, 80%, 65%)" opacity="0.7" />
        </motion.g>
        
        <motion.g 
          animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        >
          <path d="M 1500 300 Q 1510 285 1520 300 Q 1510 315 1500 300" fill="hsl(45, 100%, 55%)" opacity="0.7" />
          <path d="M 1520 300 Q 1530 285 1540 300 Q 1530 315 1520 300" fill="hsl(30, 100%, 55%)" opacity="0.7" />
        </motion.g>
      </svg>
    </>
  );
};
