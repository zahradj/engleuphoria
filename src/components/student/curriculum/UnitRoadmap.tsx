import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Map, Loader2, CheckCircle2, Circle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UnitWithLessons {
  id: string;
  title: string;
  unit_number: number;
  cefr_level: string;
  lessons: {
    id: string;
    title: string;
    sequence_order: number;
    cycle_type: string | null;
  }[];
}

export const UnitRoadmap: React.FC = () => {
  const { user } = useAuth();

  // Fetch units + lessons
  const { data: units = [], isLoading } = useQuery({
    queryKey: ['unit-roadmap', user?.id],
    queryFn: async () => {
      const { data: unitsData, error: unitsError } = await supabase
        .from('curriculum_units')
        .select('id, title, unit_number, cefr_level')
        .order('unit_number');

      if (unitsError) throw unitsError;
      if (!unitsData?.length) return [];

      const unitIds = unitsData.map((u) => u.id);
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('curriculum_lessons')
        .select('id, title, sequence_order, cycle_type, unit_id')
        .in('unit_id', unitIds)
        .order('sequence_order');

      if (lessonsError) throw lessonsError;

      // Fetch student progress
      let completedLessonIds = new Set<string>();
      if (user?.id) {
        const { data: progressData } = await supabase
          .from('interactive_lesson_progress')
          .select('lesson_id')
          .eq('student_id', user.id)
          .eq('status', 'completed');
        if (progressData) {
          completedLessonIds = new Set(progressData.map((p) => p.lesson_id));
        }
      }

      return unitsData.map((unit) => ({
        ...unit,
        lessons: (lessonsData || [])
          .filter((l: any) => l.unit_id === unit.id)
          .map((l: any) => ({
            ...l,
            completed: completedLessonIds.has(l.id),
          })),
      }));
    },
    staleTime: 3 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!units.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Map className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No curriculum units available yet.</p>
          <p className="text-sm text-muted-foreground mt-1">Your learning path will appear here once lessons are assigned.</p>
        </CardContent>
      </Card>
    );
  }

  const cycleLabel: Record<string, { label: string; color: string }> = {
    discovery: { label: '🔍 Discovery', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
    ladder: { label: '🪜 Ladder', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
    bridge: { label: '🌉 Bridge', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Map className="h-5 w-5 text-primary" />
          My Learning Path
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-0">
          {units.map((unit: any, idx: number) => {
            const allCompleted = unit.lessons.length > 0 && unit.lessons.every((l: any) => l.completed);
            const anyCompleted = unit.lessons.some((l: any) => l.completed);

            return (
              <div key={unit.id} className="relative">
                {/* Connecting line */}
                {idx < units.length - 1 && (
                  <div className="absolute left-6 top-full w-0.5 h-6 bg-border z-0" />
                )}

                <div className={cn(
                  'relative z-10 rounded-xl border-2 p-4 mb-6 transition-all',
                  allCompleted
                    ? 'border-amber-400 bg-amber-50/50 dark:bg-amber-950/20'
                    : anyCompleted
                      ? 'border-primary/40 bg-primary/5'
                      : 'border-border bg-card'
                )}>
                  {/* Unit header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold',
                      allCompleted
                        ? 'bg-amber-400 text-white'
                        : 'bg-primary/10 text-primary'
                    )}>
                      {unit.unit_number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{unit.title}</h3>
                      <Badge variant="outline" className="text-xs mt-0.5">{unit.cefr_level}</Badge>
                    </div>
                    {allCompleted && <span className="text-lg">🏆</span>}
                  </div>

                  {/* Lesson dots */}
                  <div className="flex items-center gap-2 ml-2">
                    {unit.lessons.map((lesson: any, li: number) => {
                      const prev = li === 0 ? true : unit.lessons[li - 1]?.completed;
                      const available = prev && !lesson.completed;

                      return (
                        <div key={lesson.id} className="flex flex-col items-center gap-1 group relative">
                          {li > 0 && (
                            <div className={cn(
                              'absolute -left-2 top-1/2 w-2 h-0.5',
                              lesson.completed ? 'bg-amber-400' : 'bg-border'
                            )} />
                          )}
                          <div
                            className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center transition-all',
                              lesson.completed
                                ? 'bg-amber-400 text-white shadow-sm'
                                : available
                                  ? 'bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/30'
                                  : 'bg-muted text-muted-foreground'
                            )}
                          >
                            {lesson.completed ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : available ? (
                              <Circle className="h-4 w-4" />
                            ) : (
                              <Lock className="h-3 w-3" />
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground text-center max-w-[60px] truncate">
                            {lesson.cycle_type ? cycleLabel[lesson.cycle_type]?.label || `L${lesson.sequence_order}` : `L${lesson.sequence_order}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
