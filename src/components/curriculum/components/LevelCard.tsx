
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ESLLevel } from "@/types/eslCurriculum";
import { Clock, ChevronRight, Baby, User, Users, GraduationCap } from "lucide-react";
import { getLevelColor, getAgeIcon, getSkillIcon, getDifficultyLevel } from "../utils/eslLevelUtils";

interface LevelCardProps {
  level: ESLLevel;
  isSelected: boolean;
  onSelect: (level: ESLLevel) => void;
}

export function LevelCard({ level, isSelected, onSelect }: LevelCardProps) {
  const iconName = getAgeIcon(level.ageGroup);
  const AgeIcon = iconName === 'Baby' ? Baby : iconName === 'User' ? User : iconName === 'Users' ? Users : GraduationCap;
  const difficulty = getDifficultyLevel(level.levelOrder);
  
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => onSelect(level)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Badge className={getLevelColor(level.cefrLevel)}>
            {level.cefrLevel}
          </Badge>
          <div className="flex items-center gap-1">
            <AgeIcon className="h-4 w-4 text-gray-500" />
            <span className="text-xs text-gray-500">{level.levelOrder}</span>
          </div>
        </div>
        
        <h3 className="font-semibold mb-1 text-sm">{level.name}</h3>
        <p className="text-xs text-blue-600 mb-2">{level.ageGroup}</p>
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{level.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${difficulty.color}`}></div>
            <span className="text-xs font-medium">{difficulty.label}</span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span>Skills: {level.skills.length}</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {level.estimatedHours}h
            </div>
          </div>
          
          <div className="flex items-center gap-1 mb-2">
            {level.skills.slice(0, 4).map((skill) => (
              <span key={skill.id} className="text-xs">
                {getSkillIcon(skill.category)}
              </span>
            ))}
            {level.skills.length > 4 && (
              <span className="text-xs text-gray-500">+{level.skills.length - 4}</span>
            )}
          </div>
          
          <div className="text-xs text-purple-600 font-medium">
            {level.xpRequired === 0 ? 'Starting Level' : `${level.xpRequired} XP Required`}
          </div>
        </div>
        
        <Button variant="outline" size="sm" className="w-full mt-3 text-xs">
          <ChevronRight className="h-3 w-3 ml-auto" />
          Explore Level
        </Button>
      </CardContent>
    </Card>
  );
}
