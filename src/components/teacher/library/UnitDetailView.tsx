import { Unit } from "@/types/englishJourney";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface UnitDetailViewProps {
  unit: Unit;
  onClose: () => void;
}

export function UnitDetailView({ unit, onClose }: UnitDetailViewProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Unit {unit.unitNumber}: {unit.topic}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">🎯 Goal</h3>
              <p>{unit.goal}</p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">🎯 PPP Lesson Structure</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">📍 Presentation ({unit.presentation.duration} min)</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {unit.presentation.activities.map((activity, i) => (
                      <li key={i}>{activity}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">{unit.presentation.teacherInstructions}</p>
                </div>

                <div>
                  <h4 className="font-medium">🔁 Practice ({unit.practice.duration} min)</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {unit.practice.activities.map((activity, i) => (
                      <li key={i}>{activity}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">{unit.practice.teacherInstructions}</p>
                </div>

                <div>
                  <h4 className="font-medium">🎬 Production ({unit.production.duration} min)</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {unit.production.activities.map((activity, i) => (
                      <li key={i}>{activity}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">{unit.production.teacherInstructions}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">🎧 Listening</h4>
                <ul className="list-disc list-inside text-sm">
                  {unit.listening.tasks.map((task, i) => <li key={i}>{task}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">🗣️ Speaking</h4>
                <ul className="list-disc list-inside text-sm">
                  {unit.speaking.tasks.map((task, i) => <li key={i}>{task}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">📖 Reading</h4>
                <ul className="list-disc list-inside text-sm">
                  {unit.reading.tasks.map((task, i) => <li key={i}>{task}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">✍️ Writing</h4>
                <ul className="list-disc list-inside text-sm">
                  {unit.writing.tasks.map((task, i) => <li key={i}>{task}</li>)}
                </ul>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">🎮 Games & Activities</h4>
              <div className="space-y-2">
                {unit.gamesActivities.map(game => (
                  <div key={game.id} className="text-sm">
                    <strong>{game.name}</strong> ({game.duration} min): {game.description}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1">📥 Download Materials</Button>
              <Button variant="outline" className="flex-1">📊 Assign to Class</Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
