
import React from "react";
import { Clock, Award, BookOpen, Target } from "lucide-react";
import { ESLLevel } from "@/types/eslCurriculum";

interface LevelStatsGridProps {
  level: ESLLevel;
  materialsCount: number;
  progress: number;
}

export function LevelStatsGrid({ level, materialsCount, progress }: LevelStatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
        <Clock className="h-8 w-8 text-blue-600" />
        <div>
          <div className="font-semibold">{level.estimatedHours}h</div>
          <div className="text-sm text-gray-600">Duration</div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
        <Award className="h-8 w-8 text-green-600" />
        <div>
          <div className="font-semibold">{level.xpRequired}</div>
          <div className="text-sm text-gray-600">XP Required</div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
        <BookOpen className="h-8 w-8 text-purple-600" />
        <div>
          <div className="font-semibold">{materialsCount}</div>
          <div className="text-sm text-gray-600">Materials</div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
        <Target className="h-8 w-8 text-orange-600" />
        <div>
          <div className="font-semibold">{progress}%</div>
          <div className="text-sm text-gray-600">Progress</div>
        </div>
      </div>
    </div>
  );
}
