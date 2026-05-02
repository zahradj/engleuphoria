import { useStudentLevel } from '@/hooks/useStudentLevel';
import { PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const HUB_ACCENT: Record<string, string> = {
  playground: 'text-orange-600',
  academy: 'text-indigo-600',
  professional: 'text-emerald-600',
};

export function MyLessonsTab() {
  const { studentLevel } = useStudentLevel();
  const accent = HUB_ACCENT[studentLevel || 'playground'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className={cn('text-3xl font-bold flex items-center gap-2', accent)}>
          <PlayCircle className="w-7 h-7" />
          My Lessons
        </h1>
        <p className="text-muted-foreground mt-1">
          Browse your unlocked lessons and continue where you left off.
        </p>
      </div>
      <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl p-8 text-center text-muted-foreground">
        Your lesson library is loading. Lessons unlock as you progress along your learning path.
      </div>
    </div>
  );
}
