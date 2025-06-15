
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ESLLevel } from "@/types/eslCurriculum";
import { Star, Trophy } from "lucide-react";
import { getLevelColor } from "../utils/eslLevelUtils";
import { SkillCard } from "./SkillCard";
import { LevelStatistics } from "./LevelStatistics";
import { SkillDistribution } from "./SkillDistribution";
import { AgeAppropriatenessInfo } from "./AgeAppropriatenessInfo";

interface LevelDetailsProps {
  level: ESLLevel;
}

export function LevelDetails({ level }: LevelDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Badge className={getLevelColor(level.cefrLevel)}>
            {level.cefrLevel}
          </Badge>
          <div>
            <div>{level.name} - Skills & Content</div>
            <div className="text-sm font-normal text-blue-600">{level.ageGroup}</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Skills Section */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Core Skills ({level.skills.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {level.skills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          </div>

          {/* Progress & Statistics */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Level Information
            </h4>
            <LevelStatistics level={level} />
            <SkillDistribution level={level} />
            <AgeAppropriatenessInfo level={level} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
