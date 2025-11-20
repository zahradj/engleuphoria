import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useCurriculumExpert } from '@/hooks/useCurriculumExpert';
import { GrammarProgression, VocabularyProgression } from '@/types/curriculumExpert';
import { BookOpen, MessageSquare } from 'lucide-react';

export const ProgressionGuide = () => {
  const [grammarData, setGrammarData] = useState<GrammarProgression[]>([]);
  const [vocabularyData, setVocabularyData] = useState<VocabularyProgression[]>([]);
  const { getGrammarProgression, getVocabularyProgression } = useCurriculumExpert();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [grammar, vocabulary] = await Promise.all([
      getGrammarProgression(),
      getVocabularyProgression()
    ]);
    setGrammarData(grammar);
    setVocabularyData(vocabulary);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>CEFR Progression Guide</CardTitle>
          <CardDescription>
            Grammar and vocabulary progression from Pre-A1 to B2
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="grammar" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="grammar" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Grammar</span>
          </TabsTrigger>
          <TabsTrigger value="vocabulary" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Vocabulary</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grammar" className="mt-6">
          <div className="space-y-4">
            {grammarData.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.cefrLevel}</CardTitle>
                    <Badge variant="outline">{item.ageRange}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="font-semibold mb-2">Grammar Points</div>
                    <div className="flex flex-wrap gap-2">
                      {item.grammarPoints.map((point, i) => (
                        <Badge key={i} variant="secondary">{point}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold mb-2">Examples</div>
                    <div className="space-y-2">
                      {Object.entries(item.examples).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="font-medium">{key}:</span>{' '}
                          <span className="text-muted-foreground">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vocabulary" className="mt-6">
          <div className="space-y-4">
            {vocabularyData.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.cefrLevel}</CardTitle>
                    <Badge variant="outline">{item.ageRange}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="font-semibold mb-2">Themes</div>
                    <div className="flex flex-wrap gap-2">
                      {item.themes.map((theme, i) => (
                        <Badge key={i} variant="secondary">{theme}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold mb-2">Word Lists</div>
                    <div className="space-y-3">
                      {Object.entries(item.wordLists).map(([theme, words]) => (
                        <div key={theme} className="bg-muted p-3 rounded-md">
                          <div className="font-medium text-sm mb-2">{theme}</div>
                          <div className="flex flex-wrap gap-2">
                            {words.map((word, i) => (
                              <span key={i} className="text-xs bg-background px-2 py-1 rounded">
                                {word}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};