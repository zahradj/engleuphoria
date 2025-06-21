
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ESLLevel } from "@/types/eslCurriculum";

interface LevelHeaderProps {
  level: ESLLevel;
  materialsCount: number;
}

export function LevelHeader({ level, materialsCount }: LevelHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold mb-2">
              {level.name} - {level.cefrLevel}
            </CardTitle>
            <p className="text-gray-600 mb-4">{level.description}</p>
            <div className="flex gap-2">
              <Badge variant="outline">{level.ageGroup}</Badge>
              <Badge variant="secondary">{materialsCount} Materials</Badge>
              <Badge variant="outline">{level.skills.length} Skills</Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600 mb-1">{level.levelOrder}</div>
            <div className="text-sm text-gray-500">Level Order</div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
