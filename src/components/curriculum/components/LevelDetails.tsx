
import React, { useState, useEffect } from "react";
import { CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ESLLevel } from "@/types/eslCurriculum";
import { CurriculumMaterial, enhancedESLCurriculumService } from "@/services/enhancedESLCurriculumService";
import { LevelUploadDialog } from "./LevelUploadDialog";
import { LevelHeader } from "./LevelHeader";
import { LevelStatsGrid } from "./LevelStatsGrid";
import { LevelActions } from "./LevelActions";
import { LevelProgressSection } from "./LevelProgressSection";
import { LevelTabs } from "./LevelTabs";

interface LevelDetailsProps {
  level: ESLLevel;
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

export function LevelDetails({ level }: LevelDetailsProps) {
  const [materials, setMaterials] = useState<CurriculumMaterial[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadMaterials();
  }, [level.id]);

  const loadMaterials = async () => {
    setIsLoading(true);
    try {
      const levelMaterials = await enhancedESLCurriculumService.getMaterialsByLevel(level.id);
      setMaterials(levelMaterials);
    } catch (error) {
      toast({
        title: "Error loading materials",
        description: "Failed to load materials for this level.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadComplete = () => {
    setIsUploadOpen(false);
    loadMaterials();
  };

  const handleStartLearning = () => {
    toast({
      title: "Starting learning path",
      description: `Beginning systematic learning for ${level.name}`,
    });
  };

  const calculateLevelProgress = () => {
    if (materials.length === 0) return 0;
    const completedMaterials = materials.filter(m => m.views > 0).length;
    return Math.round((completedMaterials / materials.length) * 100);
  };

  const progress = calculateLevelProgress();
  const completedMaterials = materials.filter(m => m.views > 0).length;

  return (
    <div className="space-y-6">
      <LevelHeader level={level} materialsCount={materials.length} />

      <div>
        <CardContent>
          <LevelStatsGrid 
            level={level} 
            materialsCount={materials.length} 
            progress={progress} 
          />

          <LevelActions 
            onStartLearning={handleStartLearning}
            onUpload={() => setIsUploadOpen(true)}
          />

          <LevelProgressSection 
            progress={progress}
            completedMaterials={completedMaterials}
            totalMaterials={materials.length}
          />
        </CardContent>
      </div>

      <LevelTabs 
        level={convertToCurriculumLevel(level)}
        materials={materials}
        isLoading={isLoading}
        onMaterialUpdate={loadMaterials}
      />

      <LevelUploadDialog
        level={level}
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
}
