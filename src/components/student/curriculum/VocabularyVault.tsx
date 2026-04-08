import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Loader2, Star, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VocabWord {
  id: string;
  word: string;
  unit_id: string | null;
  times_reviewed: number;
  mastered: boolean;
  first_seen_at: string;
  last_reviewed_at: string;
}

interface UnitGroup {
  unitId: string | null;
  unitTitle: string;
  words: VocabWord[];
}

export const VocabularyVault: React.FC = () => {
  const { user } = useAuth();

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['vocabulary-vault', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data: vocabData, error } = await supabase
        .from('student_vocabulary_progress')
        .select('*')
        .eq('student_id', user.id)
        .order('first_seen_at', { ascending: true });

      if (error) throw error;
      if (!vocabData?.length) return [];

      // Get unit titles
      const unitIds = [...new Set(vocabData.map((v: any) => v.unit_id).filter(Boolean))];
      let unitMap: Record<string, string> = {};
      if (unitIds.length) {
        const { data: units } = await supabase
          .from('curriculum_units')
          .select('id, title')
          .in('id', unitIds);
        if (units) {
          unitMap = Object.fromEntries(units.map((u: any) => [u.id, u.title]));
        }
      }

      // Group by unit
      const grouped: Record<string, VocabWord[]> = {};
      for (const word of vocabData) {
        const key = word.unit_id || 'ungrouped';
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(word as VocabWord);
      }

      return Object.entries(grouped).map(([unitId, words]) => ({
        unitId: unitId === 'ungrouped' ? null : unitId,
        unitTitle: unitId === 'ungrouped' ? 'Other Words' : (unitMap[unitId] || 'Unknown Unit'),
        words,
      })) as UnitGroup[];
    },
    enabled: !!user?.id,
    staleTime: 3 * 60 * 1000,
  });

  const totalWords = groups.reduce((sum, g) => sum + g.words.length, 0);
  const masteredWords = groups.reduce((sum, g) => sum + g.words.filter(w => w.mastered).length, 0);

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
    <div className="space-y-6">
      {/* Summary header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-primary" />
            Vocabulary Vault
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{totalWords}</p>
              <p className="text-xs text-muted-foreground">Words Learned</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-500">{masteredWords}</p>
              <p className="text-xs text-muted-foreground">Mastered</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">
                {totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0}%
              </p>
              <p className="text-xs text-muted-foreground">Mastery Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Word groups */}
      {groups.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No vocabulary words yet.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Complete lessons to start building your Vocabulary Vault!
            </p>
          </CardContent>
        </Card>
      ) : (
        groups.map((group) => (
          <Card key={group.unitId || 'ungrouped'}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <span>{group.unitTitle}</span>
                <Badge variant="outline" className="text-xs">
                  {group.words.length} words
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {group.words.map((word) => (
                  <div
                    key={word.id}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
                      word.mastered
                        ? 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950/30 dark:border-amber-700 dark:text-amber-300'
                        : word.times_reviewed >= 3
                          ? 'bg-primary/5 border-primary/30 text-primary'
                          : 'bg-muted border-border text-foreground'
                    )}
                  >
                    {word.mastered ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-500" />
                    ) : word.times_reviewed >= 3 ? (
                      <Star className="h-3.5 w-3.5 text-primary" />
                    ) : null}
                    {word.word}
                    {word.times_reviewed > 1 && (
                      <span className="text-[10px] text-muted-foreground ml-1">×{word.times_reviewed}</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
