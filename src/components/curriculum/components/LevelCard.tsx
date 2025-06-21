
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Award, Users } from "lucide-react";
import { ESLLevel } from "@/types/eslCurriculum";

interface LevelCardProps {
  level: ESLLevel;
  isSelected: boolean;
  onSelect: (level: ESLLevel) => void;
  progress?: number;
  materialsCount?: number;
}

export function LevelCard({ level, isSelected, onSelect, progress = 0, materialsCount = 0 }: LevelCardProps) {
  const getAgeGroupColor = (ageGroup: string) => {
    if (ageGroup.includes('4-7')) return 'bg-pink-100 text-pink-700';
    if (ageGroup.includes('6-9')) return 'bg-purple-100 text-purple-700';
    if (ageGroup.includes('8-11')) return 'bg-blue-100 text-blue-700';
    if (ageGroup.includes('10-13')) return 'bg-green-100 text-green-700';
    if (ageGroup.includes('12-15')) return 'bg-yellow-100 text-yellow-700';
    if (ageGroup.includes('14-17')) return 'bg-orange-100 text-orange-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getCEFRColor = (cefrLevel: string) => {
    switch (cefrLevel) {
      case 'Pre-A1': return 'bg-red-100 text-red-700';
      case 'A1': return 'bg-orange-100 text-orange-700';
      case 'A1+': return 'bg-amber-100 text-amber-700';
      case 'A2': return 'bg-yellow-100 text-yellow-700';
      case 'A2+': return 'bg-lime-100 text-lime-700';
      case 'B1': return 'bg-green-100 text-green-700';
      case 'B1+': return 'bg-emerald-100 text-emerald-700';
      case 'B2': return 'bg-teal-100 text-teal-700';
      case 'B2+': return 'bg-cyan-100 text-cyan-700';
      case 'C1': return 'bg-blue-100 text-blue-700';
      case 'C1+': return 'bg-indigo-100 text-indigo-700';
      case 'C2': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
      }`}
      onClick={() => onSelect(level)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold mb-2">{level.name}</CardTitle>
            <div className="flex gap-2 mb-2">
              <Badge className={getCEFRColor(level.cefrLevel)}>
                {level.cefrLevel}
              </Badge>
              <Badge variant="outline" className={getAgeGroupColor(level.ageGroup)}>
                {level.ageGroup}
              </Badge>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-400">
            {level.levelOrder}
          </div>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{level.description}</p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-gray-500" />
              <span>{level.estimatedHours}h</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={14} className="text-gray-500" />
              <span>{level.xpRequired} XP</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen size={14} className="text-gray-500" />
              <span>{materialsCount} materials</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={14} className="text-gray-500" />
              <span>{level.skills.length} skills</span>
            </div>
          </div>
          
          {progress > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          <Button 
            variant={isSelected ? "default" : "outline"} 
            size="sm" 
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(level);
            }}
          >
            {isSelected ? "Selected" : "Select Level"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
