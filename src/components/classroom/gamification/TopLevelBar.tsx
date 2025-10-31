import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { soundEffectsService } from "@/services/soundEffectsService";

interface TopLevelBarProps {
  currentXP: number;
  maxXP?: number;
  level: number;
  starCount: number;
  isAnimating?: boolean;
}

export function TopLevelBar({ 
  currentXP, 
  maxXP = 100, 
  level, 
  starCount,
  isAnimating = false 
}: TopLevelBarProps) {
  const [animatingSegments, setAnimatingSegments] = useState<number[]>([]);
  const [previousXP, setPreviousXP] = useState(currentXP);
  
  const segments = 10;
  const xpPerSegment = maxXP / segments;
  const normalizedXP = currentXP % maxXP; // Handle level-ups
  const filledSegments = Math.floor(normalizedXP / xpPerSegment);

  useEffect(() => {
    if (currentXP > previousXP) {
      const prevSegments = Math.floor((previousXP % maxXP) / xpPerSegment);
      const newSegments = Math.floor(normalizedXP / xpPerSegment);
      
      // Animate each new segment with delay
      for (let i = prevSegments; i < newSegments; i++) {
        setTimeout(() => {
          setAnimatingSegments(prev => [...prev, i]);
          soundEffectsService.playStarEarned();
        }, (i - prevSegments) * 100);
      }
      
      // Clear animations after they complete
      setTimeout(() => {
        setAnimatingSegments([]);
      }, (newSegments - prevSegments) * 100 + 500);
    }
    
    setPreviousXP(currentXP);
  }, [currentXP, previousXP, xpPerSegment, normalizedXP, maxXP]);

  return (
    <div className="fixed top-16 left-0 right-0 z-50 h-12 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="container mx-auto h-full flex items-center gap-4 px-6">
        {/* Level Badge */}
        <Badge className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-3 py-1 text-sm font-bold shadow-glow">
          Level {level}
        </Badge>
        
        {/* Segmented Progress Bar */}
        <div className="flex-1 flex gap-1.5 max-w-2xl">
          {Array.from({ length: segments }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-5 rounded-full transition-all duration-300 ${
                i < filledSegments
                  ? 'bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.8)]'
                  : 'bg-gray-700/30'
              } ${animatingSegments.includes(i) ? 'animate-pulse scale-110' : ''}`}
              style={{
                transform: animatingSegments.includes(i) ? 'scale(1.1)' : 'scale(1)',
              }}
            />
          ))}
        </div>
        
        {/* XP Counter */}
        <span className="text-sm font-bold text-white min-w-[80px]">
          {normalizedXP}/{maxXP} XP
        </span>
        
        {/* Star Count */}
        <div className="flex items-center gap-2 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-bold text-white">×{starCount}</span>
        </div>
      </div>
    </div>
  );
}
