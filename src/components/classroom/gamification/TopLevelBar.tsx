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
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 h-6 bg-white/20 backdrop-blur-md border border-white/20 shadow-[0_0_10px_rgba(0,255,255,0.15)] max-w-4xl w-full">
      <div className="h-full flex items-center gap-2 px-4">
        {/* Level Badge */}
        <Badge className="bg-gradient-to-r from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-pink))] text-white px-2 py-0.5 text-xs font-bold border border-white/20">
          Lv {level}
        </Badge>
        
        {/* Segmented Progress Bar */}
        <div className="flex-1 flex gap-1 max-w-2xl">
          {Array.from({ length: segments }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                i < filledSegments
              ? 'bg-gradient-to-r from-[hsl(var(--neon-cyan))] via-[hsl(var(--neon-purple))] to-[hsl(var(--neon-magenta))]'
              : 'bg-white/20 border border-white/30'
              } ${animatingSegments.includes(i) ? 'animate-pulse scale-110' : ''}`}
              style={{
                transform: animatingSegments.includes(i) ? 'scale(1.1)' : 'scale(1)',
              }}
            />
          ))}
        </div>
        
        {/* XP Counter */}
        <span className="text-xs font-bold text-[hsl(var(--neon-cyan))] min-w-[70px]">
          {normalizedXP}/{maxXP} XP
        </span>
        
        {/* Star Count */}
        <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full border border-[hsl(var(--neon-yellow)/0.5)] shadow-[0_0_5px_hsl(var(--neon-yellow)/0.2)]">
          <Star className="w-3 h-3 fill-[hsl(var(--neon-yellow))] text-[hsl(var(--neon-yellow))] drop-shadow-[0_0_2px_hsl(var(--neon-yellow)/0.5)]" />
          <span className="text-xs font-bold text-[hsl(var(--neon-yellow))]">×{starCount}</span>
        </div>
      </div>
    </div>
  );
}
