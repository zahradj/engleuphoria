import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Star, Clock, Trophy, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameHUDProps {
  score: number;
  lives: number;
  maxLives: number;
  timeLeft?: number;
  level: number;
  streakCount?: number;
  isMuted?: boolean;
  onToggleMute?: () => void;
  theme?: 'space' | 'ocean' | 'forest' | 'playground' | 'fantasy';
  className?: string;
}

const themeColors = {
  space: 'bg-gradient-to-r from-purple-600 to-blue-600',
  ocean: 'bg-gradient-to-r from-blue-500 to-cyan-500',
  forest: 'bg-gradient-to-r from-green-500 to-emerald-500',
  playground: 'bg-gradient-to-r from-orange-500 to-red-500',
  fantasy: 'bg-gradient-to-r from-pink-500 to-purple-500'
};

export function GameHUD({
  score,
  lives,
  maxLives,
  timeLeft,
  level,
  streakCount = 0,
  isMuted = false,
  onToggleMute,
  theme = 'playground',
  className
}: GameHUDProps) {
  const lifePercentage = (lives / maxLives) * 100;
  
  return (
    <div className={cn(
      "flex items-center justify-between p-4 rounded-t-lg border-b",
      themeColors[theme],
      "text-white shadow-lg",
      className
    )}>
      {/* Left side - Score and Level */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-300" />
          <span className="font-bold text-lg">{score.toLocaleString()}</span>
        </div>
        
        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
          Level {level}
        </Badge>
        
        {streakCount > 0 && (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-300" />
            <span className="text-sm font-medium">{streakCount}x</span>
          </div>
        )}
      </div>

      {/* Center - Lives */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {Array.from({ length: maxLives }, (_, i) => (
            <Heart
              key={i}
              className={cn(
                "h-5 w-5",
                i < lives ? "text-red-400 fill-current" : "text-white/30"
              )}
            />
          ))}
        </div>
      </div>

      {/* Right side - Timer and Controls */}
      <div className="flex items-center gap-4">
        {timeLeft !== undefined && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="font-mono text-sm">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
        )}
        
        {onToggleMute && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleMute}
            className="text-white hover:bg-white/20 p-2"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        )}
      </div>
    </div>
  );
}