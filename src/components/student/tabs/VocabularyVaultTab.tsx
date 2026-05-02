import { useStudentLevel } from '@/hooks/useStudentLevel';
import { Archive } from 'lucide-react';
import { cn } from '@/lib/utils';

const HUB_ACCENT: Record<string, string> = {
  playground: 'text-orange-600',
  academy: 'text-indigo-600',
  professional: 'text-emerald-600',
};

export function VocabularyVaultTab() {
  const { studentLevel } = useStudentLevel();
  const accent = HUB_ACCENT[studentLevel || 'playground'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className={cn('text-3xl font-bold flex items-center gap-2', accent)}>
          <Archive className="w-7 h-7" />
          Vocabulary Vault
        </h1>
        <p className="text-muted-foreground mt-1">
          Every new word you learn lives here as a collectible sticker.
        </p>
      </div>
      <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl p-8 text-center text-muted-foreground">
        Your vault is empty. Words you master in lessons will appear as stickers here.
      </div>
    </div>
  );
}
