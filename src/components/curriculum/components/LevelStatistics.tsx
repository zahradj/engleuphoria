
import React from "react";
import { Card } from "@/components/ui/card";
import { ESLLevel } from "@/types/eslCurriculum";

interface LevelStatisticsProps {
  level: ESLLevel;
}

export function LevelStatistics({ level }: LevelStatisticsProps) {
  return (
    <div className="space-y-4">
      <Card className="p-3">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{level.estimatedHours}</div>
          <div className="text-xs text-gray-600">Study Hours</div>
        </div>
      </Card>
      
      <Card className="p-3">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{level.xpRequired}</div>
          <div className="text-xs text-gray-600">XP Required</div>
        </div>
      </Card>
      
      <Card className="p-3">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{level.skills.length}</div>
          <div className="text-xs text-gray-600">Core Skills</div>
        </div>
      </Card>

      <Card className="p-3">
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{level.levelOrder}</div>
          <div className="text-xs text-gray-600">Level Order</div>
        </div>
      </Card>
    </div>
  );
}
