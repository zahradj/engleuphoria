import { Unit } from "@/types/englishJourney";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface UnitDetailViewProps {
  unit: Unit;
  onClose: () => void;
}

export function UnitDetailView({ unit, onClose }: UnitDetailViewProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleViewLesson = (lesson: any) => {
    if (!lesson.contentId) {
      toast({
        title: "Content Not Available",
        description: "This lesson doesn't have content yet.",
        variant: "destructive",
      });
      return;
    }

    // Navigate to lesson viewer with query params
    navigate(`/lesson-viewer?contentId=${lesson.contentId}&module=1&lesson=${lesson.lessonNumber}`);
  };

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

            {unit.lessons && unit.lessons.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3">📚 Lessons in This Unit</h3>
                  <div className="space-y-3">
                    {unit.lessons.map((lesson) => (
                      <div key={lesson.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-lg">
                              Lesson {lesson.lessonNumber}: {lesson.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">{lesson.topic}</p>
                          </div>
                          <Badge variant="secondary">{lesson.badge}</Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <p><strong>Focus:</strong> {lesson.focus}</p>
                          <p><strong>Grammar:</strong> {lesson.grammarPoint}</p>
                          {lesson.phonicsFocus && (
                            <p><strong>Phonics:</strong> {lesson.phonicsFocus}</p>
                          )}
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>⏱️ {lesson.duration} min</span>
                            <span>💎 {lesson.xpReward} XP</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-3">
                          <Button 
                            size="sm" 
                            variant="default" 
                            className="flex-1"
                            onClick={() => handleViewLesson(lesson)}
                          >
                            View Lesson
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Assign to Class
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

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
