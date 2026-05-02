import { useStudentLevel } from '@/hooks/useStudentLevel';
import { Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const HUB_ACCENT: Record<string, string> = {
  playground: 'text-orange-600',
  academy: 'text-indigo-600',
  professional: 'text-emerald-600',
};

export function MasteryMilestonesTab() {
  const { studentLevel } = useStudentLevel();
  const accent = HUB_ACCENT[studentLevel || 'playground'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className={cn('text-3xl font-bold flex items-center gap-2', accent)}>
          <Target className="w-7 h-7" />
          Mastery Milestones
        </h1>
        <p className="text-muted-foreground mt-1">
          Track every unit you've mastered along your learning journey.
        </p>
      </div>
      <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl p-8 text-center text-muted-foreground">
        Complete the Lesson 6 Mastery Quiz at 80%+ to earn your first milestone.
      </div>
    </div>
  );
}
