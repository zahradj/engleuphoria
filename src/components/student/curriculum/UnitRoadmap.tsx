import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Map, Loader2, Lock, Star, Trophy, AlertCircle } from 'lucide-react';
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
    completed: boolean;
  }[];
  masteryPassed: boolean;
  milestoneResult: { score: number; passed: boolean; weakest_skill: string | null } | null;
}

export const UnitRoadmap: React.FC = () => {
  const { user } = useAuth();

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
        .eq('is_review', false)
        .order('sequence_order');

      if (lessonsError) throw lessonsError;

      // Fetch student progress including mastery_check_passed
      let completedLessonIds = new Set<string>();
      let masteryPassedLessonIds = new Set<string>();
      if (user?.id) {
        const { data: progressData } = await supabase
          .from('interactive_lesson_progress')
          .select('lesson_id, mastery_check_passed')
          .eq('student_id', user.id)
          .eq('lesson_status', 'completed');
        if (progressData) {
          completedLessonIds = new Set(progressData.map((p: any) => p.lesson_id));
          masteryPassedLessonIds = new Set(
            progressData.filter((p: any) => p.mastery_check_passed).map((p: any) => p.lesson_id)
          );
        }
      }

      // Fetch milestone results
      let milestoneMap: Record<string, { score: number; passed: boolean; weakest_skill: string | null }> = {};
      if (user?.id) {
        const { data: milestones } = await supabase
          .from('mastery_milestone_results')
          .select('unit_id, score, passed, weakest_skill')
          .eq('student_id', user.id);
        if (milestones) {
          for (const m of milestones) {
            milestoneMap[m.unit_id] = { score: Number(m.score), passed: m.passed, weakest_skill: m.weakest_skill };
          }
        }
      }

      return unitsData.map((unit) => {
        const unitLessons = (lessonsData || [])
          .filter((l: any) => l.unit_id === unit.id)
          .map((l: any) => ({
            ...l,
            completed: completedLessonIds.has(l.id),
          }));

        // Check if bridge lesson has mastery passed
        const bridgeLesson = unitLessons.find((l: any) => l.cycle_type === 'bridge');
        const masteryPassed = bridgeLesson ? masteryPassedLessonIds.has(bridgeLesson.id) : false;

        return {
          ...unit,
          lessons: unitLessons,
          masteryPassed,
          milestoneResult: milestoneMap[unit.id] || null,
        };
      });
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

  const cycleLabel: Record<string, { label: string; emoji: string }> = {
    discovery: { label: 'Discovery', emoji: '🔍' },
    ladder: { label: 'Ladder', emoji: '🪜' },
    bridge: { label: 'Bridge', emoji: '🌉' },
  };

  // Determine if a unit is unlocked: first unit always, others require previous unit mastery
  const isUnitUnlocked = (idx: number): boolean => {
    if (idx === 0) return true;
    const prevUnit = units[idx - 1] as any;
    return prevUnit.masteryPassed;
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
            const unitGold = allCompleted && unit.masteryPassed;
            const unlocked = isUnitUnlocked(idx);

            return (
              <div key={unit.id} className="relative">
                {/* Connecting line */}
                {idx < units.length - 1 && (
                  <div className={cn(
                    'absolute left-6 top-full w-0.5 h-6 z-0',
                    unitGold ? 'bg-amber-400' : 'bg-border'
                  )} />
                )}

                <div className={cn(
                  'relative z-10 rounded-xl border-2 p-4 mb-6 transition-all',
                  !unlocked
                    ? 'border-border bg-muted/30 opacity-60'
                    : unitGold
                      ? 'border-amber-400 bg-amber-50/50 dark:bg-amber-950/20'
                      : 'border-border bg-card'
                )}>
                  {/* Unit header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold',
                      !unlocked
                        ? 'bg-muted text-muted-foreground'
                        : unitGold
                          ? 'bg-amber-400 text-white'
                          : 'bg-primary/10 text-primary'
                    )}>
                      {!unlocked ? <Lock className="h-4 w-4" /> : unit.unit_number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{unit.title}</h3>
                      <Badge variant="outline" className="text-xs mt-0.5">{unit.cefr_level}</Badge>
                    </div>
                    {unitGold && <span className="text-lg">🏆</span>}
                  </div>

                  {/* 3-Star lesson progress */}
                  <div className="flex items-center gap-3 ml-2">
                    {unit.lessons.map((lesson: any, li: number) => {
                      const prev = li === 0 ? unlocked : unit.lessons[li - 1]?.completed;
                      const available = unlocked && prev && !lesson.completed;
                      const cycle = lesson.cycle_type ? cycleLabel[lesson.cycle_type] : null;

                      return (
                        <div key={lesson.id} className="flex flex-col items-center gap-1 group relative">
                          {li > 0 && (
                            <div className={cn(
                              'absolute -left-3 top-3 w-3 h-0.5',
                              lesson.completed ? 'bg-amber-400' : 'bg-border'
                            )} />
                          )}
                          <Star
                            className={cn(
                              'h-7 w-7 transition-all',
                              lesson.completed
                                ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                                : available
                                  ? 'text-primary fill-primary/20'
                                  : 'text-muted-foreground/40'
                            )}
                          />
                          <span className="text-[10px] text-muted-foreground text-center max-w-[60px] truncate">
                            {cycle ? `${cycle.emoji} ${cycle.label}` : `L${lesson.sequence_order}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quiz / Milestone icon (4th position) */}
                  <div className="flex items-center gap-3 ml-2 mt-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-0.5 bg-border" />
                      {(() => {
                        const milestone = unit.milestoneResult;
                        if (unitGold || (milestone && milestone.passed)) {
                          return (
                            <div className="flex flex-col items-center gap-0.5">
                              <Trophy className="h-6 w-6 text-amber-500 fill-amber-100" />
                              <span className="text-[10px] text-amber-600 font-medium">
                                {milestone ? `${Math.round(milestone.score)}%` : 'Passed'}
                              </span>
                            </div>
                          );
                        }
                        if (milestone && !milestone.passed) {
                          return (
                            <div className="flex flex-col items-center gap-0.5">
                              <AlertCircle className="h-6 w-6 text-destructive" />
                              <span className="text-[10px] text-destructive font-medium">
                                {Math.round(milestone.score)}% — Review {milestone.weakest_skill || 'needed'}
                              </span>
                            </div>
                          );
                        }
                        if (allCompleted) {
                          return (
                            <div className="flex flex-col items-center gap-0.5">
                              <Trophy className="h-6 w-6 text-primary fill-primary/20" />
                              <span className="text-[10px] text-primary font-medium">Take Quiz</span>
                            </div>
                          );
                        }
                        return (
                          <div className="flex flex-col items-center gap-0.5">
                            <Trophy className="h-6 w-6 text-muted-foreground/30" />
                            <span className="text-[10px] text-muted-foreground">Quiz</span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Mastery gate indicator */}
                  {allCompleted && !unit.masteryPassed && !unit.milestoneResult && (
                    <div className="mt-2 ml-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Pass the Mastery Milestone quiz to unlock the next unit
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
