import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PhonemeCard } from './PhonemeCard';
import { useStudentPhonicsProgress } from '@/hooks/useStudentPhonicsProgress';
import { PHONEME_MAP, CATEGORY_LABELS, MasteryLevel } from '@/data/phonemeMap';
import { Volume2, Loader2 } from 'lucide-react';

export const MapOfSounds: React.FC = () => {
  const { data: progress = [], isLoading } = useStudentPhonicsProgress();

  const progressMap = new Map<string, MasteryLevel>();
  progress.forEach((p) => progressMap.set(p.phoneme, p.mastery_level as MasteryLevel));

  const getMastery = (symbol: string): MasteryLevel =>
    progressMap.get(symbol) || 'unseen';

  const totalPhonemes = PHONEME_MAP.length;
  const masteredCount = progress.filter((p) => p.mastery_level === 'mastered').length;
  const progressPercent = totalPhonemes > 0 ? Math.round((masteredCount / totalPhonemes) * 100) : 0;

  const grouped = {
    short_vowel: PHONEME_MAP.filter((p) => p.category === 'short_vowel'),
    long_vowel: PHONEME_MAP.filter((p) => p.category === 'long_vowel'),
    consonant: PHONEME_MAP.filter((p) => p.category === 'consonant'),
    digraph: PHONEME_MAP.filter((p) => p.category === 'digraph'),
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Volume2 className="h-5 w-5 text-primary" />
          Map of Sounds
        </CardTitle>
        <div className="space-y-1.5 mt-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{masteredCount} of {totalPhonemes} sounds mastered</span>
            <span>{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {(Object.keys(grouped) as Array<keyof typeof grouped>).map((category) => (
          <div key={category}>
            <h3 className="text-sm font-semibold text-foreground mb-2">
              {CATEGORY_LABELS[category]}
            </h3>
            <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 gap-2">
              {grouped[category].map((phoneme) => (
                <PhonemeCard
                  key={phoneme.symbol}
                  phoneme={phoneme}
                  mastery={getMastery(phoneme.symbol)}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="flex flex-wrap gap-3 pt-3 border-t border-border text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-muted/50 border border-border" /> Unseen</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-100 border border-blue-300 dark:bg-blue-900/30 dark:border-blue-700" /> Introduced</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-100 border border-slate-400 dark:bg-slate-800/50 dark:border-slate-500" /> Practiced</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-100 border border-amber-400 dark:bg-amber-900/30 dark:border-amber-600" /> ⭐ Mastered</span>
        </div>
      </CardContent>
    </Card>
  );
};
