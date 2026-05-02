import { useStudentLevel } from '@/hooks/useStudentLevel';
import { Route } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LearningPathTab } from '@/components/student/LearningPathTab';

const HUB_ACCENT: Record<string, string> = {
  playground: 'text-orange-600',
  academy: 'text-indigo-600',
  professional: 'text-emerald-600',
};

export function MyPathTab() {
  const { studentLevel } = useStudentLevel();
  const accent = HUB_ACCENT[studentLevel || 'playground'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className={cn('text-3xl font-bold flex items-center gap-2', accent)}>
          <Route className="w-7 h-7" />
          My Learning Path
        </h1>
        <p className="text-muted-foreground mt-1">
          Your personalized journey from where you are to where you want to be.
        </p>
      </div>
      <LearningPathTab />
    </div>
  );
}
