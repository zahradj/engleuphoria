
import React from "react";
import { Progress } from "@/components/ui/progress";
import { ESLLevel } from "@/types/eslCurriculum";

interface SkillDistributionProps {
  level: ESLLevel;
}

export function SkillDistribution({ level }: SkillDistributionProps) {
  const skillCategories = ['vocabulary', 'grammar', 'speaking', 'listening', 'reading', 'writing'];

  return (
    <div className="pt-3">
      <h5 className="font-medium mb-2">Skill Distribution</h5>
      <div className="space-y-2">
        {skillCategories.map((category) => {
          const categorySkills = level.skills.filter(s => s.category === category);
          const percentage = level.skills.length > 0 ? (categorySkills.length / level.skills.length) * 100 : 0;
          return categorySkills.length > 0 ? (
            <div key={category}>
              <div className="flex justify-between text-xs mb-1">
                <span className="capitalize">{category}</span>
                <span>{categorySkills.length} skill{categorySkills.length !== 1 ? 's' : ''}</span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}
