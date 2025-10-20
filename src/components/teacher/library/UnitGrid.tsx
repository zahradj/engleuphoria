import { Unit } from "@/types/englishJourney";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UnitGridProps {
  units: Unit[];
  onSelectUnit: (unit: Unit) => void;
}

export function UnitGrid({ units, onSelectUnit }: UnitGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {units.map((unit) => (
        <Card key={unit.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-lg">Unit {unit.unitNumber}: {unit.topic}</h3>
            <p className="text-sm text-muted-foreground">{unit.goal}</p>
            
            <div className="flex gap-2 text-lg">
              <span title="Listening">🎧</span>
              <span title="Speaking">🗣️</span>
              <span title="Reading">📖</span>
              <span title="Writing">✍️</span>
            </div>
            
            <div className="text-sm space-y-1">
              <p><strong>Vocabulary:</strong> {unit.keyVocabulary.slice(0, 3).join(", ")}...</p>
              <p><strong>Duration:</strong> {unit.estimatedDuration} min | <strong>XP:</strong> 💎 {unit.xpReward}</p>
            </div>
            
            <Button onClick={() => onSelectUnit(unit)} className="w-full">
              View Lesson Plan
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
