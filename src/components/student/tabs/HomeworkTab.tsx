import { useStudentLevel } from '@/hooks/useStudentLevel';
import { BookMarked } from 'lucide-react';
import { cn } from '@/lib/utils';

const HUB_ACCENT: Record<string, string> = {
  playground: 'text-orange-600',
  academy: 'text-indigo-600',
  professional: 'text-emerald-600',
};

export function HomeworkTab() {
  const { studentLevel } = useStudentLevel();
  const accent = HUB_ACCENT[studentLevel || 'playground'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className={cn('text-3xl font-bold flex items-center gap-2', accent)}>
          <BookMarked className="w-7 h-7" />
          Homework
        </h1>
        <p className="text-muted-foreground mt-1">
          Assignments from your teacher will appear here.
        </p>
      </div>
      <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl p-8 text-center text-muted-foreground">
        No homework assigned yet. Check back after your next lesson.
      </div>
    </div>
  );
}
