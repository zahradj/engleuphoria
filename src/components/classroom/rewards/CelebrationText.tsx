
import React from "react";
import { Star, Trophy, Award } from "lucide-react";

interface CelebrationTextProps {
  points: number;
  reason?: string;
  isVisible: boolean;
}

export function CelebrationText({ points, reason, isVisible }: CelebrationTextProps) {
  const getIcon = () => {
    if (points >= 40) return Trophy;
    if (points >= 20) return Award;
    return Star;
  };

  const getColorClass = () => {
    if (points >= 40) return "text-orange-500";
    if (points >= 20) return "text-purple-500";
    return "text-yellow-500";
  };

  const IconComponent = getIcon();

  if (!isVisible) return null;

  return (
    <div className="flex flex-col items-center animate-scale-in">
      <div className="flex items-center gap-2 mb-2">
        <IconComponent 
          size={48} 
          className={`${getColorClass()} animate-pulse`} 
        />
        <div className="text-6xl font-bold text-white drop-shadow-2xl animate-bounce">
          +{points}
        </div>
        <div className="text-2xl font-bold text-yellow-400 drop-shadow-lg">
          XP
        </div>
      </div>
      
      {reason && (
        <div className="text-xl font-semibold text-white/90 drop-shadow-lg text-center max-w-md">
          {reason}
        </div>
      )}
      
      <div className="text-3xl animate-bounce mt-2">
        🎉
      </div>
    </div>
  );
}
