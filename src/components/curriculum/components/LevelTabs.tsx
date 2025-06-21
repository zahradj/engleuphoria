
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ESLLevel } from "@/types/eslCurriculum";
import { CurriculumMaterial } from "@/services/enhancedESLCurriculumService";
import { LevelMaterialsGrid } from "./LevelMaterialsGrid";
import { LevelSkillsOverview } from "./LevelSkillsOverview";
import { LevelProgressTracker } from "./LevelProgressTracker";
import { LevelInsights } from "./LevelInsights";

interface LevelTabsProps {
  level: ESLLevel;
  materials: CurriculumMaterial[];
  isLoading: boolean;
  onMaterialUpdate: () => void;
}

// Convert ESLLevel to CurriculumLevel format for components that need it
const convertToCurriculumLevel = (eslLevel: ESLLevel) => ({
  id: eslLevel.id,
  name: eslLevel.name,
  cefrLevel: eslLevel.cefrLevel,
  ageGroup: eslLevel.ageGroup,
  description: eslLevel.description,
  levelOrder: eslLevel.levelOrder,
  xpRequired: eslLevel.xpRequired,
  estimatedHours: eslLevel.estimatedHours,
  skills: eslLevel.skills,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

export function LevelTabs({ level, materials, isLoading, onMaterialUpdate }: LevelTabsProps) {
  return (
    <Tabs defaultValue="materials" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="materials">Materials</TabsTrigger>
        <TabsTrigger value="skills">Skills</TabsTrigger>
        <TabsTrigger value="progress">Progress</TabsTrigger>
        <TabsTrigger value="insights">Insights</TabsTrigger>
      </TabsList>

      <TabsContent value="materials" className="mt-6">
        <LevelMaterialsGrid 
          materials={materials} 
          isLoading={isLoading}
          onMaterialUpdate={onMaterialUpdate}
        />
      </TabsContent>

      <TabsContent value="skills" className="mt-6">
        <LevelSkillsOverview level={level} materials={materials} />
      </TabsContent>

      <TabsContent value="progress" className="mt-6">
        <LevelProgressTracker level={convertToCurriculumLevel(level)} materials={materials} />
      </TabsContent>

      <TabsContent value="insights" className="mt-6">
        <LevelInsights level={level} materials={materials} />
      </TabsContent>
    </Tabs>
  );
}
