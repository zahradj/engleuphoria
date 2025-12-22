import React from 'react';
import { motion } from 'framer-motion';

export const UnderwaterTheme: React.FC = () => {
  // Generate stable bubble positions
  const bubbles = React.useMemo(() => 
    Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      cx: (i * 77) % 1920,
      r: ((i % 4) + 1) * 4 + 5,
      duration: 6 + (i % 5) * 2,
      delay: i * 0.3,
    })), []
  );

  return (
    <>
      {/* Dreamy ocean gradient - Layer 1 */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at top, hsl(195, 85%, 55%) 0%, hsl(210, 75%, 40%) 40%, hsl(220, 65%, 25%) 100%)'
        }}
      />
      
      <svg 
        className="absolute inset-0 w-full h-full" 
        viewBox="0 0 1920 1080" 
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Sunlight rays */}
          <linearGradient id="lightRayUnder" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(50, 100%, 95%)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="hsl(50, 100%, 95%)" stopOpacity="0" />
          </linearGradient>
          
          {/* Coral colors */}
          <linearGradient id="coral1Under" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="hsl(350, 80%, 55%)" />
            <stop offset="100%" stopColor="hsl(340, 70%, 70%)" />
          </linearGradient>
          
          <linearGradient id="coral2Under" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="hsl(30, 90%, 55%)" />
            <stop offset="100%" stopColor="hsl(40, 80%, 65%)" />
          </linearGradient>
          
          <linearGradient id="coral3Under" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="hsl(280, 60%, 55%)" />
            <stop offset="100%" stopColor="hsl(290, 50%, 70%)" />
          </linearGradient>

          {/* Soft blur filter */}
          <filter id="underwaterBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
        
        {/* Light rays from surface - dreamy effect */}
        <motion.polygon 
          points="400,0 600,0 850,1080 150,1080" 
          fill="url(#lightRayUnder)"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.polygon 
          points="1000,0 1200,0 1550,1080 650,1080" 
          fill="url(#lightRayUnder)" 
          opacity="0.5"
          animate={{ opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.polygon 
          points="1500,0 1650,0 1850,1080 1300,1080" 
          fill="url(#lightRayUnder)" 
          opacity="0.3"
          animate={{ opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        
        {/* Bubbles - rising gently */}
        {bubbles.map((bubble) => (
          <motion.circle 
            key={bubble.id}
            cx={bubble.cx} 
            r={bubble.r} 
            fill="none"
            stroke="hsl(195, 80%, 85%)"
            strokeWidth="2"
            opacity="0.4"
            animate={{ 
              cy: [1100, -50],
              cx: [bubble.cx, bubble.cx + (bubble.id % 2 === 0 ? 30 : -30)]
            }}
            transition={{ 
              duration: bubble.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: bubble.delay
            }}
          />
        ))}
        
        {/* Seaweed - swaying in current */}
        <g opacity="0.7">
          <motion.path 
            d="M 100 1080 Q 90 950 110 850 Q 130 750 100 650" 
            stroke="hsl(120, 60%, 40%)" 
            strokeWidth="12" 
            fill="none" 
            strokeLinecap="round"
            animate={{ d: [
              "M 100 1080 Q 90 950 110 850 Q 130 750 100 650",
              "M 100 1080 Q 115 950 90 850 Q 65 750 100 650",
              "M 100 1080 Q 90 950 110 850 Q 130 750 100 650"
            ]}}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path 
            d="M 150 1080 Q 160 980 140 900 Q 120 820 150 750" 
            stroke="hsl(130, 55%, 45%)" 
            strokeWidth="10" 
            fill="none" 
            strokeLinecap="round"
            animate={{ d: [
              "M 150 1080 Q 160 980 140 900 Q 120 820 150 750",
              "M 150 1080 Q 135 980 165 900 Q 185 820 150 750",
              "M 150 1080 Q 160 980 140 900 Q 120 820 150 750"
            ]}}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
          
          <motion.path 
            d="M 1750 1080 Q 1760 950 1740 850 Q 1720 750 1750 650" 
            stroke="hsl(120, 60%, 40%)" 
            strokeWidth="12" 
            fill="none" 
            strokeLinecap="round"
            animate={{ d: [
              "M 1750 1080 Q 1760 950 1740 850 Q 1720 750 1750 650",
              "M 1750 1080 Q 1735 950 1765 850 Q 1785 750 1750 650",
              "M 1750 1080 Q 1760 950 1740 850 Q 1720 750 1750 650"
            ]}}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path 
            d="M 1820 1080 Q 1810 980 1830 900 Q 1850 820 1820 750" 
            stroke="hsl(130, 55%, 45%)" 
            strokeWidth="10" 
            fill="none" 
            strokeLinecap="round"
            animate={{ d: [
              "M 1820 1080 Q 1810 980 1830 900 Q 1850 820 1820 750",
              "M 1820 1080 Q 1835 980 1805 900 Q 1785 820 1820 750",
              "M 1820 1080 Q 1810 980 1830 900 Q 1850 820 1820 750"
            ]}}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          />
        </g>
        
        {/* Sandy ocean floor - soft */}
        <path 
          d="M 0 950 Q 300 920 600 950 T 1200 940 T 1800 960 T 1920 950 L 1920 1080 L 0 1080 Z" 
          fill="hsl(40, 50%, 60%)" 
        />
        <path 
          d="M 0 970 Q 300 950 600 970 T 1200 960 T 1800 980 T 1920 970 L 1920 1080 L 0 1080 Z" 
          fill="hsl(40, 45%, 50%)" 
        />
        
        {/* Coral Reef - softened */}
        <g opacity="0.85">
          {/* Brain coral */}
          <ellipse cx="300" cy="950" rx="60" ry="40" fill="url(#coral1Under)" />
          
          {/* Branching coral */}
          <path d="M 600 1000 Q 580 950 590 900 M 600 1000 Q 600 950 610 890 M 600 1000 Q 620 960 640 920" stroke="url(#coral2Under)" strokeWidth="15" fill="none" strokeLinecap="round" />
          
          {/* Fan coral */}
          <ellipse cx="1300" cy="970" rx="80" ry="60" fill="url(#coral3Under)" />
          
          {/* Small coral */}
          <ellipse cx="1600" cy="960" rx="50" ry="35" fill="url(#coral1Under)" />
        </g>
        
        {/* Fish - swimming gently */}
        <motion.g 
          animate={{ x: [0, 40, 0], y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Clownfish */}
          <ellipse cx="500" cy="400" rx="40" ry="25" fill="hsl(25, 100%, 55%)" />
          <ellipse cx="500" cy="400" rx="30" ry="18" fill="white" opacity="0.3" />
          <path d="M 540 400 L 570 385 L 570 415 Z" fill="hsl(25, 100%, 55%)" />
          <circle cx="475" cy="395" r="5" fill="white" />
          <circle cx="477" cy="395" r="3" fill="black" />
          <line x1="485" y1="390" x2="485" y2="410" stroke="white" strokeWidth="4" />
          <line x1="510" y1="388" x2="510" y2="412" stroke="white" strokeWidth="4" />
        </motion.g>
        
        <motion.g 
          animate={{ x: [0, -50, 0], y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          {/* Blue tang */}
          <ellipse cx="1400" cy="300" rx="45" ry="30" fill="hsl(210, 90%, 55%)" />
          <path d="M 1445 300 L 1480 280 L 1480 320 Z" fill="hsl(210, 90%, 55%)" />
          <ellipse cx="1380" cy="295" rx="8" ry="5" fill="hsl(50, 100%, 65%)" />
          <circle cx="1370" cy="295" r="5" fill="white" />
          <circle cx="1372" cy="295" r="3" fill="black" />
        </motion.g>
        
        <motion.g 
          animate={{ x: [0, 30, 0], y: [0, -25, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        >
          {/* Yellow tang */}
          <ellipse cx="800" cy="600" rx="35" ry="25" fill="hsl(50, 100%, 55%)" />
          <path d="M 835 600 L 865 585 L 865 615 Z" fill="hsl(50, 100%, 55%)" />
          <circle cx="775" cy="595" r="4" fill="white" />
          <circle cx="777" cy="595" r="2" fill="black" />
        </motion.g>
        
        {/* Jellyfish - dreamy floating */}
        <motion.g 
          animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        >
          <ellipse cx="1700" cy="450" rx="40" ry="30" fill="hsl(300, 60%, 75%)" opacity="0.5" />
          <motion.path 
            d="M 1665 475 Q 1660 520 1670 560" 
            stroke="hsl(300, 50%, 70%)" 
            strokeWidth="3" 
            fill="none" 
            opacity="0.4"
            animate={{ d: [
              "M 1665 475 Q 1660 520 1670 560",
              "M 1665 475 Q 1650 520 1655 560",
              "M 1665 475 Q 1660 520 1670 560"
            ]}}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.path 
            d="M 1690 478 Q 1695 530 1685 570" 
            stroke="hsl(300, 50%, 70%)" 
            strokeWidth="3" 
            fill="none" 
            opacity="0.4"
            animate={{ d: [
              "M 1690 478 Q 1695 530 1685 570",
              "M 1690 478 Q 1705 530 1700 570",
              "M 1690 478 Q 1695 530 1685 570"
            ]}}
            transition={{ duration: 2.2, repeat: Infinity }}
          />
          <motion.path 
            d="M 1715 475 Q 1720 525 1710 565" 
            stroke="hsl(300, 50%, 70%)" 
            strokeWidth="3" 
            fill="none" 
            opacity="0.4"
            animate={{ d: [
              "M 1715 475 Q 1720 525 1710 565",
              "M 1715 475 Q 1730 525 1725 565",
              "M 1715 475 Q 1720 525 1710 565"
            ]}}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <motion.path 
            d="M 1735 475 Q 1740 515 1730 555" 
            stroke="hsl(300, 50%, 70%)" 
            strokeWidth="3" 
            fill="none" 
            opacity="0.4"
            animate={{ d: [
              "M 1735 475 Q 1740 515 1730 555",
              "M 1735 475 Q 1750 515 1745 555",
              "M 1735 475 Q 1740 515 1730 555"
            ]}}
            transition={{ duration: 2.1, repeat: Infinity }}
          />
        </motion.g>
        
        {/* Starfish */}
        <g transform="translate(700, 980) rotate(-15)">
          <path d="M 0 -25 L 7 -8 L 25 -8 L 12 5 L 15 22 L 0 12 L -15 22 L -12 5 L -25 -8 L -7 -8 Z" fill="hsl(15, 80%, 60%)" />
        </g>
        
        <g transform="translate(1100, 1000) rotate(10)">
          <path d="M 0 -20 L 5 -6 L 20 -6 L 10 4 L 12 18 L 0 10 L -12 18 L -10 4 L -20 -6 L -5 -6 Z" fill="hsl(330, 70%, 65%)" />
        </g>
        
        {/* Treasure Chest hint - soft glow */}
        <g opacity="0.5">
          <rect x="1000" y="990" width="50" height="35" rx="5" fill="hsl(30, 60%, 40%)" />
          <rect x="1005" y="995" width="40" height="5" fill="hsl(45, 80%, 55%)" />
          <motion.circle 
            cx="1025" cy="1010" r="5" 
            fill="hsl(45, 80%, 55%)"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </g>
      </svg>
    </>
  );
};
