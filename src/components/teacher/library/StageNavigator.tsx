import { CurriculumStage } from "@/types/englishJourney";
import { Button } from "@/components/ui/button";

interface StageNavigatorProps {
  stages: CurriculumStage[];
  selectedStageId: number;
  onSelectStage: (id: number) => void;
}

export function StageNavigator({ stages, selectedStageId, onSelectStage }: StageNavigatorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stages.map((stage) => (
        <Button
          key={stage.id}
          variant={selectedStageId === stage.id ? "default" : "outline"}
          className="h-auto flex flex-col items-center gap-2 p-4"
          onClick={() => onSelectStage(stage.id)}
        >
          <span className="text-3xl">{stage.icon}</span>
          <span className="font-semibold">{stage.name}</span>
          <span className="text-xs">{stage.cefrLevel}</span>
          <span className="text-xs text-muted-foreground">{stage.ageGroup}</span>
          <span className="text-xs">{stage.units.length} units</span>
        </Button>
      ))}
    </div>
  );
}
