import React from 'react';
import { motion } from 'framer-motion';

interface PathPoint {
  x: number;
  y: number;
}

interface WindingPathProps {
  points: PathPoint[];
  completedIndex: number;
  theme?: 'jungle' | 'space' | 'underwater';
}

export const WindingPath: React.FC<WindingPathProps> = ({
  points,
  completedIndex,
  theme = 'jungle',
}) => {
  const themeColors = {
    jungle: {
      path: 'rgba(255, 255, 255, 0.4)',
      completed: 'rgba(255, 255, 255, 0.9)',
      glow: 'rgba(255, 255, 255, 0.6)',
      stroke: 10,
    },
    space: {
      path: 'rgba(200, 180, 255, 0.3)',
      completed: 'rgba(180, 220, 255, 0.9)',
      glow: 'rgba(180, 220, 255, 0.5)',
      stroke: 8,
    },
    underwater: {
      path: 'rgba(150, 220, 255, 0.3)',
      completed: 'rgba(200, 255, 255, 0.9)',
      glow: 'rgba(200, 255, 255, 0.5)',
      stroke: 10,
    },
  };

  const colors = themeColors[theme];

  // Generate a smooth curve through the points
  const generatePath = (pts: PathPoint[]): string => {
    if (pts.length < 2) return '';
    
    let path = `M ${pts[0].x} ${pts[0].y}`;
    
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      
      // Control points for smooth curve
      const cpX1 = prev.x + (curr.x - prev.x) * 0.5;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (curr.x - prev.x) * 0.5;
      const cpY2 = curr.y;
      
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
    }
    
    return path;
  };

  // Scale points to SVG viewBox
  const scaledPoints = points.map(p => ({
    x: p.x * 10, // Scale percentage to viewBox units
    y: p.y * 10,
  }));

  const fullPath = generatePath(scaledPoints);
  
  // Generate completed portion of path
  const completedPoints = scaledPoints.slice(0, completedIndex + 1);
  const completedPath = completedPoints.length > 1 ? generatePath(completedPoints) : '';

  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Soft glow filter for path */}
        <filter id="pathGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Extra soft glow for completed path */}
        <filter id="completedGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Background path - thick white dashed line */}
      <motion.path
        d={fullPath}
        fill="none"
        stroke={colors.path}
        strokeWidth={colors.stroke + 6}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="20 15"
        filter="url(#pathGlow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      
      {/* Main path - dashed white line */}
      <motion.path
        d={fullPath}
        fill="none"
        stroke={colors.path}
        strokeWidth={colors.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="25 12"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      
      {/* Completed path - solid white with strong glow */}
      {completedPath && (
        <motion.path
          d={completedPath}
          fill="none"
          stroke={colors.completed}
          strokeWidth={colors.stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#completedGlow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
        />
      )}
      
      {/* Sparkle nodes along completed path */}
      {completedPoints.slice(0, -1).map((point, index) => (
        <motion.circle
          key={index}
          cx={point.x}
          cy={point.y}
          r="8"
          fill={colors.glow}
          filter="url(#pathGlow)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            delay: index * 0.3,
            ease: 'easeInOut'
          }}
        />
      ))}
    </svg>
  );
};
