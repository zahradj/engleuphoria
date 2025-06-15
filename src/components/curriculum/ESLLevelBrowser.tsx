
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { eslCurriculumService } from "@/services/eslCurriculumService";
import { ESLLevel } from "@/types/eslCurriculum";
import { BookOpen } from "lucide-react";
import { LevelCard } from "./components/LevelCard";
import { LevelDetails } from "./components/LevelDetails";

interface ESLLevelBrowserProps {
  refreshTrigger: number;
}

export function ESLLevelBrowser({ refreshTrigger }: ESLLevelBrowserProps) {
  const [levels, setLevels] = useState<ESLLevel[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<ESLLevel | null>(null);

  useEffect(() => {
    setLevels(eslCurriculumService.getAllLevels());
  }, [refreshTrigger]);

  return (
    <div className="space-y-6">
      {/* Enhanced CEFR Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Enhanced 8-Level ESL Curriculum Framework
          </CardTitle>
          <p className="text-sm text-gray-600">
            Comprehensive age-appropriate curriculum from Pre-A1 (Starter) to C1 (Fluent/Proficient)
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {levels.map((level) => (
              <LevelCard 
                key={level.id} 
                level={level}
                isSelected={selectedLevel?.id === level.id}
                onSelect={setSelectedLevel}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Selected Level Details */}
      {selectedLevel && (
        <LevelDetails level={selectedLevel} />
      )}
    </div>
  );
}
