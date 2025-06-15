
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ESLSkill } from "@/types/eslCurriculum";
import { getSkillIcon } from "../utils/eslLevelUtils";

interface SkillCardProps {
  skill: ESLSkill;
}

export function SkillCard({ skill }: SkillCardProps) {
  return (
    <Card className="p-3">
      <div className="flex items-start gap-3">
        <span className="text-lg">{getSkillIcon(skill.category)}</span>
        <div className="flex-1">
          <h5 className="font-medium text-sm">{skill.name}</h5>
          <p className="text-xs text-gray-600 mb-2">{skill.description}</p>
          <div className="flex flex-wrap items-center gap-1 mb-2">
            <Badge variant="outline" className="text-xs">
              {skill.category}
            </Badge>
            {skill.canStudentPractice && (
              <Badge variant="secondary" className="text-xs">
                Self-Practice
              </Badge>
            )}
            {skill.ageAppropriate && (
              <Badge variant="default" className="text-xs bg-green-500">
                Age-Friendly
              </Badge>
            )}
          </div>
          {skill.grammarPoints && skill.grammarPoints.length > 0 && (
            <div className="text-xs text-purple-600">
              Grammar: {skill.grammarPoints.slice(0, 2).join(', ')}
              {skill.grammarPoints.length > 2 && '...'}
            </div>
          )}
          {skill.vocabularyThemes && skill.vocabularyThemes.length > 0 && (
            <div className="text-xs text-blue-600">
              Themes: {skill.vocabularyThemes.slice(0, 2).join(', ')}
              {skill.vocabularyThemes.length > 2 && '...'}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
