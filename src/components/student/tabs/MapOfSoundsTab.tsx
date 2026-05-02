import { useStudentLevel } from '@/hooks/useStudentLevel';
import { Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const HUB_ACCENT: Record<string, string> = {
  playground: 'text-orange-600',
  academy: 'text-indigo-600',
  professional: 'text-emerald-600',
};

export function MapOfSoundsTab() {
  const { studentLevel } = useStudentLevel();
  const accent = HUB_ACCENT[studentLevel || 'playground'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className={cn('text-3xl font-bold flex items-center gap-2', accent)}>
          <Volume2 className="w-7 h-7" />
          Map of Sounds
        </h1>
        <p className="text-muted-foreground mt-1">
          Master English phonics one sound at a time.
        </p>
      </div>
      <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl p-8 text-center text-muted-foreground">
        Phonics map coming soon. Practice sounds during your lessons to unlock progress here.
      </div>
    </div>
  );
}
