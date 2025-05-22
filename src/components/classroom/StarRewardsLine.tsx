
import React from "react";
import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface StarRewardsLineProps {
  points: number;
  milestones: number[];
}

export function StarRewardsLine({ points, milestones }: StarRewardsLineProps) {
  const { languageText } = useLanguage();
  
  // Sort milestones in descending order
  const sortedMilestones = [...milestones].sort((a, b) => b - a);
  
  return (
    <div className="h-full flex flex-col items-center py-3 px-1">
      <div className="text-xs font-medium mb-2 text-center">
        {languageText.rewards}
      </div>
      
      <div className="flex-1 w-[2px] bg-gray-200 relative">
        {sortedMilestones.map((milestone, index) => {
          const isEarned = points >= milestone;
          
          return (
            <div 
              key={milestone} 
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ 
                left: "50%", 
                top: `${(index + 1) * 100 / (sortedMilestones.length + 1)}%` 
              }}
            >
              <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                isEarned ? "bg-yellow-100" : "bg-gray-100"
              }`}>
                <Star 
                  size={14} 
                  className={isEarned ? "fill-yellow text-yellow-dark" : "text-gray-400"} 
                />
              </div>
              <div className="text-[10px] mt-1 whitespace-nowrap text-center">
                {milestone}
              </div>
            </div>
          );
        })}
        
        {/* Current position indicator */}
        <div 
          className="absolute w-2 h-2 bg-primary rounded-full transform -translate-x-1/2"
          style={{ 
            left: "50%", 
            top: `${100 - (points / Math.max(...milestones)) * 100}%`,
            display: points <= Math.max(...milestones) ? "block" : "none"
          }}
        />
      </div>
      
      <div className="mt-2 text-center">
        <div className="text-xs font-medium">{points}</div>
        <div className="text-[10px] text-muted-foreground">{languageText.points}</div>
      </div>
    </div>
  );
}
