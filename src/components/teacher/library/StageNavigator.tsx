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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {stages.map((stage) => {
        const totalXP = stage.units.reduce((sum, unit) => sum + unit.xpReward, 0);
        const totalDuration = stage.units.reduce((sum, unit) => sum + unit.estimatedDuration, 0);
        
        return (
          <GlassButton
            key={stage.id}
            variant={selectedStageId === stage.id ? "primary" : "default"}
            glow={selectedStageId === stage.id}
            className={cn(
              "h-auto flex flex-col items-center gap-2 p-4 group",
              "hover:scale-[1.03] transition-all duration-300",
              selectedStageId === stage.id && 
              "neon-border-glow bg-gradient-to-br from-[hsl(var(--neon-cyan))]/10 to-[hsl(var(--neon-purple))]/10"
            )}
            onClick={() => onSelectStage(stage.id)}
          >
            <span className="text-3xl transition-transform group-hover:scale-110 duration-300">
              {stage.icon}
            </span>
            <span className={cn(
              "font-bold text-sm text-center",
              selectedStageId === stage.id && "text-[hsl(var(--neon-cyan))]"
            )}>
              {stage.name}
            </span>
            <span className="text-xs font-semibold text-[hsl(var(--neon-purple))]">
              {stage.cefrLevel}
            </span>
            <span className="text-[10px] text-muted-foreground text-center">
              {stage.ageGroup}
            </span>
            
            <div className="w-full space-y-1 mt-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">Units:</span>
                <span className="font-semibold">{stage.units.length}</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-semibold">{Math.round(totalDuration / 60)}h</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">Total XP:</span>
                <span className="font-semibold text-[hsl(var(--neon-yellow))]">💎 {totalXP}</span>
              </div>
            </div>
          </GlassButton>
        );
      })}
    </div>
  );
}
