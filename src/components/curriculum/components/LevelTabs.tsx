
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CurriculumMaterial } from "@/services/enhancedESLCurriculumService";
import { LevelMaterialsGrid } from "./LevelMaterialsGrid";
import { LevelSkillsOverview } from "./LevelSkillsOverview";
import { LevelProgressTracker } from "./LevelProgressTracker";
import { LevelInsights } from "./LevelInsights";

// Define CurriculumLevel interface to match what components expect
interface CurriculumLevel {
  id: string;
  name: string;
  cefrLevel: string;
  ageGroup: string;
  description: string;
  levelOrder: number;
  xpRequired: number;
  estimatedHours: number;
  skills: any[];
  createdAt: string;
  updatedAt: string;
}

interface LevelTabsProps {
  level: CurriculumLevel;
  materials: CurriculumMaterial[];
  isLoading: boolean;
  onMaterialUpdate: () => void;
}

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
        <LevelProgressTracker level={level} materials={materials} />
      </TabsContent>

      <TabsContent value="insights" className="mt-6">
        <LevelInsights level={level} materials={materials} />
      </TabsContent>
    </Tabs>
  );
}
