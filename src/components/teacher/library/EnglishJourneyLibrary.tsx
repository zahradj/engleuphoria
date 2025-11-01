import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { StageNavigator } from "./StageNavigator";
import { UnitGrid } from "./UnitGrid";
import { UnitDetailView } from "./UnitDetailView";
import { englishJourneyService } from "@/services/englishJourneyService";
import { Unit } from "@/types/englishJourney";

interface EnglishJourneyLibraryProps {
  onSelectLesson?: (lessonContentId: string) => void;
}

export function EnglishJourneyLibrary({ onSelectLesson }: EnglishJourneyLibraryProps = {}) {
  const [selectedStageId, setSelectedStageId] = useState<number>(1);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  
  const stages = englishJourneyService.getAllStages();
  const currentStage = stages.find(s => s.id === selectedStageId);
  const units = currentStage?.units || [];

  return (
    <div className="space-y-4">
      <GlassCard variant="strong" className="border border-white/10">
        <div className="p-4 space-y-2">
          <h2 className="text-xl font-bold bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-purple))] bg-clip-text text-transparent">
            🌟 English Journey Program
          </h2>
          <p className="text-xs text-[hsl(var(--neon-cyan))]/80">"From First Words to Fluency" • Ages 4-17 • Pre-A1 → B2</p>
        </div>
        <div className="px-4 pb-4">
          <StageNavigator
            stages={stages}
            selectedStageId={selectedStageId}
            onSelectStage={setSelectedStageId}
          />
        </div>
      </GlassCard>

      <GlassCard variant="light" className="border border-white/10">
        <div className="p-4 space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="text-2xl">{currentStage?.icon}</span>
            <span className="bg-gradient-to-r from-white to-[hsl(var(--neon-cyan))] bg-clip-text text-transparent">
              {currentStage?.name}: {currentStage?.theme}
            </span>
          </h3>
          <p className="text-xs text-muted-foreground">
            {currentStage?.cefrLevel} • {currentStage?.ageGroup} • {currentStage?.units.length} units
          </p>
        </div>
        <div className="px-4 pb-4">
          <UnitGrid units={units} onSelectUnit={setSelectedUnit} />
        </div>
      </GlassCard>

      {selectedUnit && (
        <UnitDetailView
          unit={selectedUnit}
          onClose={() => setSelectedUnit(null)}
        />
      )}
    </div>
  );
}
