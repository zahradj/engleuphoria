import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PhonemeCard } from './PhonemeCard';
import { useStudentPhonicsProgress } from '@/hooks/useStudentPhonicsProgress';
import { PHONEME_MAP, CATEGORY_LABELS, MasteryLevel } from '@/data/phonemeMap';
import { Volume2, Loader2, Sun, Moon } from 'lucide-react';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';
import { cn } from '@/lib/utils';

export const MapOfSounds: React.FC = () => {
  const { data: progress = [], isLoading } = useStudentPhonicsProgress();
  const { isDaytime } = useTimeOfDay();

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
    <Card className={cn(
      'relative overflow-hidden transition-colors duration-700',
      isDaytime
        ? ''
        : 'bg-gradient-to-b from-indigo-950 to-slate-900 border-indigo-500/30'
    )}>
      <CardHeader>
        <CardTitle className={cn(
          'flex items-center gap-2 text-lg transition-colors duration-500',
          !isDaytime && 'text-indigo-100'
        )}>
          <Volume2 className={cn('h-5 w-5', isDaytime ? 'text-primary' : 'text-indigo-400')} />
          {isDaytime ? 'Map of Sounds' : '✨ Constellation of Sounds'}
          <span className="ml-auto">
            {isDaytime ? (
              <Sun className="h-4 w-4 text-amber-500" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-300" />
            )}
          </span>
        </CardTitle>
        <div className="space-y-1.5 mt-2">
          <div className={cn(
            'flex justify-between text-sm',
            isDaytime ? 'text-muted-foreground' : 'text-indigo-300'
          )}>
            <span>{masteredCount} of {totalPhonemes} sounds mastered</span>
            <span>{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {(Object.keys(grouped) as Array<keyof typeof grouped>).map((category) => (
          <div key={category}>
            <h3 className={cn(
              'text-sm font-semibold mb-2 transition-colors duration-500',
              isDaytime ? 'text-foreground' : 'text-indigo-200'
            )}>
              {CATEGORY_LABELS[category]}
            </h3>
            <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 gap-2">
              {grouped[category].map((phoneme) => {
                const mastery = getMastery(phoneme.symbol);
                return (
                  <div
                    key={phoneme.symbol}
                    className={cn(
                      'transition-all duration-500',
                      !isDaytime && mastery === 'mastered' && 'drop-shadow-[0_0_8px_rgba(251,191,36,0.5)] animate-pulse-slow'
                    )}
                  >
                    <PhonemeCard
                      phoneme={phoneme}
                      mastery={mastery}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className={cn(
          'flex flex-wrap gap-3 pt-3 border-t text-xs',
          isDaytime ? 'border-border text-muted-foreground' : 'border-indigo-700/50 text-indigo-400'
        )}>
          <span className="flex items-center gap-1"><span className={cn('w-3 h-3 rounded border', isDaytime ? 'bg-muted/50 border-border' : 'bg-indigo-900/50 border-indigo-700')} /> Unseen</span>
          <span className="flex items-center gap-1"><span className={cn('w-3 h-3 rounded border', isDaytime ? 'bg-blue-100 border-blue-300' : 'bg-blue-900/40 border-blue-600')} /> Introduced</span>
          <span className="flex items-center gap-1"><span className={cn('w-3 h-3 rounded border', isDaytime ? 'bg-slate-100 border-slate-400' : 'bg-slate-800/50 border-slate-500')} /> Practiced</span>
          <span className="flex items-center gap-1"><span className={cn('w-3 h-3 rounded border', isDaytime ? 'bg-amber-100 border-amber-400' : 'bg-amber-900/40 border-amber-500 shadow-[0_0_6px_rgba(251,191,36,0.4)]')} /> ⭐ Mastered</span>
        </div>
      </CardContent>
    </Card>
  );
};
