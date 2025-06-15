
import React from "react";
import { ESLLevel } from "@/types/eslCurriculum";
import { Baby, User, Users, GraduationCap } from "lucide-react";
import { getAgeIcon } from "../utils/eslLevelUtils";

interface AgeAppropriatenessInfoProps {
  level: ESLLevel;
}

export function AgeAppropriatenessInfo({ level }: AgeAppropriatenessInfoProps) {
  const iconName = getAgeIcon(level.ageGroup);
  const AgeIcon = iconName === 'Baby' ? Baby : iconName === 'User' ? User : iconName === 'Users' ? Users : GraduationCap;

  return (
    <div className="pt-3">
      <h5 className="font-medium mb-2">Age Appropriateness</h5>
      <div className="flex items-center gap-2">
        <AgeIcon className="h-5 w-5 text-blue-500" />
        <span className="text-sm">{level.ageGroup}</span>
      </div>
    </div>
  );
}
