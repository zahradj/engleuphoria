import { CurriculumStage } from "@/types/englishJourney";
import { GlassButton } from "@/components/ui/glass-button";
import { cn } from "@/lib/utils";

interface StageNavigatorProps {
  stages: CurriculumStage[];
  selectedStageId: number;
  onSelectStage: (id: number) => void;
}

export function StageNavigator({ stages, selectedStageId, onSelectStage }: StageNavigatorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {stages.map((stage) => (
        <GlassButton
          key={stage.id}
          variant={selectedStageId === stage.id ? "primary" : "default"}
          glow={selectedStageId === stage.id}
          className={cn(
            "h-auto flex flex-col items-center gap-1.5 p-3",
            selectedStageId === stage.id && 
            "neon-border-glow bg-gradient-to-br from-[hsl(var(--neon-cyan))]/10 to-[hsl(var(--neon-purple))]/10"
          )}
          onClick={() => onSelectStage(stage.id)}
        >
          <span className="text-2xl transition-transform hover:scale-110">{stage.icon}</span>
          <span className={cn(
            "font-semibold text-xs",
            selectedStageId === stage.id && "text-[hsl(var(--neon-cyan))]"
          )}>
            {stage.name}
          </span>
          <span className="text-[10px]">{stage.cefrLevel}</span>
          <span className="text-[10px] text-muted-foreground">{stage.ageGroup}</span>
          <span className="text-[10px]">{stage.units.length} units</span>
        </GlassButton>
      ))}
    </div>
  );
}
