import React from 'react';

export const JungleTheme: React.FC = () => {
  return (
    <svg 
      className="absolute inset-0 w-full h-full" 
      viewBox="0 0 1920 1080" 
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Sky Gradient */}
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(200, 80%, 70%)" />
          <stop offset="60%" stopColor="hsl(180, 70%, 80%)" />
          <stop offset="100%" stopColor="hsl(120, 40%, 75%)" />
        </linearGradient>
        
        {/* Ground Gradient */}
        <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(120, 50%, 45%)" />
          <stop offset="100%" stopColor="hsl(120, 40%, 35%)" />
        </linearGradient>
        
        {/* Sun Gradient */}
        <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(45, 100%, 70%)" />
          <stop offset="100%" stopColor="hsl(45, 100%, 55%)" />
        </radialGradient>
      </defs>
      
      {/* Sky */}
      <rect width="100%" height="100%" fill="url(#skyGradient)" />
      
      {/* Sun */}
      <circle cx="1700" cy="150" r="100" fill="url(#sunGradient)" opacity="0.9">
        <animate attributeName="r" values="100;105;100" dur="4s" repeatCount="indefinite" />
      </circle>
      
      {/* Clouds */}
      <g className="animate-float-gentle">
        <ellipse cx="300" cy="120" rx="80" ry="40" fill="white" opacity="0.9" />
        <ellipse cx="350" cy="100" rx="60" ry="35" fill="white" opacity="0.9" />
        <ellipse cx="380" cy="130" rx="50" ry="30" fill="white" opacity="0.9" />
      </g>
      
      <g className="animate-float-gentle" style={{ animationDelay: '1s' }}>
        <ellipse cx="900" cy="80" rx="70" ry="35" fill="white" opacity="0.85" />
        <ellipse cx="950" cy="65" rx="55" ry="30" fill="white" opacity="0.85" />
        <ellipse cx="870" cy="95" rx="45" ry="25" fill="white" opacity="0.85" />
      </g>
      
      <g className="animate-float-gentle" style={{ animationDelay: '2s' }}>
        <ellipse cx="1400" cy="150" rx="75" ry="38" fill="white" opacity="0.8" />
        <ellipse cx="1450" cy="130" rx="60" ry="32" fill="white" opacity="0.8" />
      </g>
      
      {/* Background Trees */}
      <g opacity="0.6">
        {/* Tree 1 */}
        <rect x="100" y="400" width="40" height="200" fill="hsl(30, 40%, 35%)" rx="5" />
        <ellipse cx="120" cy="380" rx="80" ry="100" fill="hsl(120, 50%, 35%)" />
        
        {/* Tree 2 */}
        <rect x="300" y="350" width="50" height="250" fill="hsl(30, 40%, 30%)" rx="5" />
        <ellipse cx="325" cy="320" rx="100" ry="120" fill="hsl(120, 45%, 30%)" />
        
        {/* Tree 3 */}
        <rect x="1600" y="380" width="45" height="220" fill="hsl(30, 40%, 32%)" rx="5" />
        <ellipse cx="1622" cy="350" rx="90" ry="110" fill="hsl(120, 48%, 32%)" />
        
        {/* Tree 4 */}
        <rect x="1750" y="420" width="35" height="180" fill="hsl(30, 40%, 35%)" rx="5" />
        <ellipse cx="1767" cy="400" rx="70" ry="90" fill="hsl(120, 50%, 35%)" />
      </g>
      
      {/* Ground */}
      <path 
        d="M 0 650 Q 200 600 400 650 T 800 630 T 1200 660 T 1600 640 T 1920 660 L 1920 1080 L 0 1080 Z" 
        fill="url(#groundGradient)" 
      />
      
      {/* Grass details */}
      <g fill="hsl(120, 55%, 40%)">
        <path d="M 50 660 Q 55 640 60 660" strokeWidth="3" stroke="hsl(120, 55%, 40%)" fill="none" />
        <path d="M 150 655 Q 155 635 160 655" strokeWidth="3" stroke="hsl(120, 55%, 40%)" fill="none" />
        <path d="M 250 665 Q 255 645 260 665" strokeWidth="3" stroke="hsl(120, 55%, 40%)" fill="none" />
        <path d="M 450 640 Q 455 620 460 640" strokeWidth="3" stroke="hsl(120, 55%, 40%)" fill="none" />
        <path d="M 650 660 Q 655 640 660 660" strokeWidth="3" stroke="hsl(120, 55%, 40%)" fill="none" />
        <path d="M 850 645 Q 855 625 860 645" strokeWidth="3" stroke="hsl(120, 55%, 40%)" fill="none" />
        <path d="M 1050 665 Q 1055 645 1060 665" strokeWidth="3" stroke="hsl(120, 55%, 40%)" fill="none" />
        <path d="M 1250 655 Q 1255 635 1260 655" strokeWidth="3" stroke="hsl(120, 55%, 40%)" fill="none" />
        <path d="M 1450 670 Q 1455 650 1460 670" strokeWidth="3" stroke="hsl(120, 55%, 40%)" fill="none" />
        <path d="M 1650 650 Q 1655 630 1660 650" strokeWidth="3" stroke="hsl(120, 55%, 40%)" fill="none" />
        <path d="M 1850 665 Q 1855 645 1860 665" strokeWidth="3" stroke="hsl(120, 55%, 40%)" fill="none" />
      </g>
      
      {/* Decorative flowers */}
      <g>
        <circle cx="180" cy="680" r="8" fill="hsl(330, 80%, 65%)" />
        <circle cx="180" cy="680" r="4" fill="hsl(45, 100%, 55%)" />
        
        <circle cx="520" cy="665" r="8" fill="hsl(45, 100%, 55%)" />
        <circle cx="520" cy="665" r="4" fill="hsl(30, 100%, 50%)" />
        
        <circle cx="980" cy="675" r="8" fill="hsl(280, 70%, 60%)" />
        <circle cx="980" cy="675" r="4" fill="hsl(45, 100%, 55%)" />
        
        <circle cx="1380" cy="685" r="8" fill="hsl(0, 80%, 60%)" />
        <circle cx="1380" cy="685" r="4" fill="hsl(45, 100%, 55%)" />
        
        <circle cx="1720" cy="670" r="8" fill="hsl(200, 80%, 60%)" />
        <circle cx="1720" cy="670" r="4" fill="hsl(45, 100%, 55%)" />
      </g>
      
      {/* Butterflies */}
      <g className="animate-float-gentle">
        <path d="M 200 400 Q 210 385 220 400 Q 210 415 200 400" fill="hsl(280, 70%, 60%)" opacity="0.8" />
        <path d="M 220 400 Q 230 385 240 400 Q 230 415 220 400" fill="hsl(330, 80%, 65%)" opacity="0.8" />
      </g>
      
      <g className="animate-float-gentle" style={{ animationDelay: '1.5s' }}>
        <path d="M 1500 300 Q 1510 285 1520 300 Q 1510 315 1500 300" fill="hsl(45, 100%, 55%)" opacity="0.8" />
        <path d="M 1520 300 Q 1530 285 1540 300 Q 1530 315 1520 300" fill="hsl(30, 100%, 55%)" opacity="0.8" />
      </g>
    </svg>
  );
};
