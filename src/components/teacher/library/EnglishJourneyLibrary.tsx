import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StageNavigator } from "./StageNavigator";
import { UnitGrid } from "./UnitGrid";
import { UnitDetailView } from "./UnitDetailView";
import { englishJourneyService } from "@/services/englishJourneyService";
import { Unit } from "@/types/englishJourney";

export function EnglishJourneyLibrary() {
  const [selectedStageId, setSelectedStageId] = useState<number>(1);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  
  const stages = englishJourneyService.getAllStages();
  const currentStage = stages.find(s => s.id === selectedStageId);
  const units = currentStage?.units || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">🌟 English Journey Program</CardTitle>
          <p className="text-muted-foreground">"From First Words to Fluency" • Ages 4-17 • Pre-A1 → B2</p>
        </CardHeader>
        <CardContent>
          <StageNavigator
            stages={stages}
            selectedStageId={selectedStageId}
            onSelectStage={setSelectedStageId}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {currentStage?.icon} {currentStage?.name}: {currentStage?.theme}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {currentStage?.cefrLevel} • {currentStage?.ageGroup} • {currentStage?.units.length} units
          </p>
        </CardHeader>
        <CardContent>
          <UnitGrid units={units} onSelectUnit={setSelectedUnit} />
        </CardContent>
      </Card>

      {selectedUnit && (
        <UnitDetailView
          unit={selectedUnit}
          onClose={() => setSelectedUnit(null)}
        />
      )}
    </div>
  );
}
