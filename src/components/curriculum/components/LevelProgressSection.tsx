
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";

interface LevelProgressSectionProps {
  progress: number;
  completedMaterials: number;
  totalMaterials: number;
}

export function LevelProgressSection({ progress, completedMaterials, totalMaterials }: LevelProgressSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Target size={16} />
          Level Progress
        </h4>
        <Progress value={progress} className="h-3" />
        <p className="text-sm text-gray-600 mt-1">
          {completedMaterials} of {totalMaterials} materials accessed
        </p>
      </div>
    </div>
  );
}
