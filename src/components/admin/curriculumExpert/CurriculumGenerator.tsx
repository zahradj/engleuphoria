import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useCurriculumExpert } from '@/hooks/useCurriculumExpert';
import { QuickActionButtons } from './QuickActionButtons';
import { MaterialPreview } from './MaterialPreview';
import { AgeGroup, CEFRLevel } from '@/types/curriculumExpert';

const AGE_GROUPS: AgeGroup[] = ['5-7', '8-11', '12-14', '15-17'];
const CEFR_LEVELS: CEFRLevel[] = ['Pre-A1', 'A1', 'A2', 'B1', 'B2'];

export const CurriculumGenerator = () => {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>('8-11');
  const [cefrLevel, setCefrLevel] = useState<CEFRLevel>('A2');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('45');
  const [grammarFocus, setGrammarFocus] = useState('');
  const [vocabularyTheme, setVocabularyTheme] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  const { isGenerating, generatedMaterial, generateMaterial } = useCurriculumExpert();

  const handleQuickAction = async (prompt: string) => {
    await generateMaterial({
      mode: 'lesson',
      prompt,
      ageGroup: selectedAgeGroup,
      cefrLevel,
      duration: parseInt(duration) || 45,
      topic,
      grammarFocus,
      vocabularyTheme
    });
  };

  const handleCustomGenerate = async () => {
    if (!customPrompt.trim()) return;
    
    await generateMaterial({
      mode: 'lesson',
      prompt: customPrompt,
      ageGroup: selectedAgeGroup,
      cefrLevel,
      duration: parseInt(duration) || 45,
      topic,
      grammarFocus,
      vocabularyTheme
    });
  };

  return (
    <div className="space-y-6">
      {/* Age Group Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Age Group</CardTitle>
          <CardDescription>Choose the target age group for your curriculum material</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {AGE_GROUPS.map((age) => (
              <Button
                key={age}
                variant={selectedAgeGroup === age ? 'default' : 'outline'}
                onClick={() => setSelectedAgeGroup(age)}
                className="h-20"
              >
                <div className="text-center">
                  <div className="text-lg font-bold">Ages {age}</div>
                  <div className="text-xs opacity-70">
                    {age === '5-7' && 'Pre-A1/A1'}
                    {age === '8-11' && 'A1/A2'}
                    {age === '12-14' && 'A2/B1'}
                    {age === '15-17' && 'B1/B2'}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Action Buttons */}
      <QuickActionButtons
        ageGroup={selectedAgeGroup}
        onActionClick={handleQuickAction}
        isGenerating={isGenerating}
      />

      {/* Custom Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Generation</CardTitle>
          <CardDescription>Specify details for personalized curriculum material</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cefrLevel">CEFR Level</Label>
              <Select value={cefrLevel} onValueChange={(v) => setCefrLevel(v as CEFRLevel)}>
                <SelectTrigger id="cefrLevel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CEFR_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="45"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Daily routines"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grammar">Grammar Focus</Label>
              <Input
                id="grammar"
                value={grammarFocus}
                onChange={(e) => setGrammarFocus(e.target.value)}
                placeholder="Present Simple"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vocabulary">Vocabulary Theme</Label>
              <Input
                id="vocabulary"
                value={vocabularyTheme}
                onChange={(e) => setVocabularyTheme(e.target.value)}
                placeholder="Food and meals"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">Custom Prompt</Label>
            <Textarea
              id="prompt"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Describe the lesson, activity, or curriculum material you want to generate..."
              rows={4}
            />
          </div>

          <Button
            onClick={handleCustomGenerate}
            disabled={isGenerating || !customPrompt.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Custom Material'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Preview */}
      {generatedMaterial && <MaterialPreview material={generatedMaterial} mode="lesson" />}
    </div>
  );
};