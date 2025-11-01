import { Unit } from "@/types/englishJourney";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";

interface UnitGridProps {
  units: Unit[];
  onSelectUnit: (unit: Unit) => void;
}

export function UnitGrid({ units, onSelectUnit }: UnitGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {units.map((unit) => (
        <GlassCard 
          key={unit.id} 
          variant="light"
          className="hover:neon-border-glow hover:scale-[1.02] transition-all duration-300 border border-white/10"
        >
          <div className="p-3 space-y-2">
            <h3 className="font-bold text-sm bg-gradient-to-r from-white to-[hsl(var(--neon-cyan))] bg-clip-text text-transparent">
              Unit {unit.unitNumber}: {unit.topic}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2">{unit.goal}</p>
            
            <div className="flex gap-2">
              <span className="px-2 py-1 glass rounded-lg text-base" title="Listening">🎧</span>
              <span className="px-2 py-1 glass rounded-lg text-base" title="Speaking">🗣️</span>
              <span className="px-2 py-1 glass rounded-lg text-base" title="Reading">📖</span>
              <span className="px-2 py-1 glass rounded-lg text-base" title="Writing">✍️</span>
            </div>
            
            <div className="text-xs space-y-1">
              <p><strong>Vocabulary:</strong> {unit.keyVocabulary.slice(0, 3).join(", ")}...</p>
              {unit.lessons && unit.lessons.length > 0 && (
                <p><strong>Lessons:</strong> 📚 {unit.lessons.length} lessons</p>
              )}
              <p>
                <strong>Duration:</strong> {unit.estimatedDuration} min | 
                <strong className="ml-1">XP:</strong> 
                <span className="text-[hsl(var(--neon-yellow))] font-bold ml-1">💎 {unit.xpReward}</span>
              </p>
            </div>
            
            <GlassButton 
              onClick={() => onSelectUnit(unit)} 
              className="w-full"
              variant="primary"
              glow
              size="sm"
            >
              View Lesson Plan
            </GlassButton>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
